import { createContext, useContext, useState, useCallback, useEffect, useRef } from "react";
import type { Product } from "@/data/products";
import { cartApi } from "@/lib/api";
import { useAuth } from "./AuthContext";
import { toast } from "@/hooks/use-toast";

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartContextValue {
  items: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  couponCode: string;
  setCouponCode: (code: string) => void;
  couponDiscount: number;
  applyCoupon: (code: string) => boolean;
  subtotal: number;
  shipping: number;
  total: number;
  totalItems: number;
}

const CartContext = createContext<CartContextValue | null>(null);

const COUPONS: Record<string, number> = {
  "SSL10": 10,
  "SSL20": 20,
  "WELCOME15": 15,
  "LUXURY25": 25,
};

// Guests (not logged in) get a cart stored in localStorage so they can
// still shop before creating an account. Once they log in, that guest
// cart is merged into their real account cart in the database, and from
// then on the database is the source of truth (works across devices,
// survives clearing browser storage, etc).
// v2 key: older projects that ran on localhost:5173 wrote incompatible
// data under the old key, which could break the cart on load. A fresh,
// versioned key sidesteps all of that; the old key is cleaned up below.
const GUEST_STORAGE_KEY = "ssl_sarees_cart_guest_v2";
try { localStorage.removeItem("ssl_sarees_cart_guest"); } catch {}

function loadGuestItems(): CartItem[] {
  try {
    const raw = localStorage.getItem(GUEST_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    // Validate the stored shape — corrupted/stale entries must never be
    // able to crash cart interactions.
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (i) => i && typeof i === "object" && i.product && typeof i.product.id === "string" && typeof i.quantity === "number"
    );
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [items, setItems] = useState<CartItem[]>(loadGuestItems);
  const [couponCode, setCouponCode] = useState("");
  const [couponDiscount, setCouponDiscount] = useState(0);
  const hasMergedRef = useRef(false);

  // Guests: keep localStorage in sync as the cart changes.
  useEffect(() => {
    if (!user) {
      localStorage.setItem(GUEST_STORAGE_KEY, JSON.stringify(items));
    }
  }, [items, user]);

  // Logged in: pull the real cart from the database. The first time this
  // runs after a login, merge in anything that was sitting in the guest
  // cart, then clear it so it isn't merged again on a future login.
  useEffect(() => {
    if (!user) {
      hasMergedRef.current = false;
      return;
    }
    let cancelled = false;

    (async () => {
      const guestItems = loadGuestItems();
      if (!hasMergedRef.current && guestItems.length > 0) {
        hasMergedRef.current = true;
        for (const item of guestItems) {
          await cartApi.add(item.product.id, item.quantity).catch(() => {});
        }
        localStorage.removeItem(GUEST_STORAGE_KEY);
      }
      try {
        const { items: serverItems } = await cartApi.get();
        if (!cancelled) setItems(serverItems);
      } catch {
        // Network hiccup or logged out mid-request — keep current state.
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [user]);

  const addToCart = useCallback(
    (product: Product, quantity = 1) => {
      setItems((prev) => {
        const existing = prev.find((i) => i.product.id === product.id);
        if (existing) {
          return prev.map((i) =>
            i.product.id === product.id ? { ...i, quantity: i.quantity + quantity } : i
          );
        }
        return [...prev, { product, quantity }];
      });
      if (user) {
        cartApi
          .add(product.id, quantity)
          .then(({ items: serverItems }) => setItems(serverItems))
          .catch((err: Error) => {
            toast({
              title: "Cart not saved to your account",
              description: err.message,
              variant: "destructive",
            });
          });
      }
    },
    [user]
  );

  const removeFromCart = useCallback(
    (productId: string) => {
      setItems((prev) => prev.filter((i) => i.product.id !== productId));
      if (user) cartApi.remove(productId).catch(() => {});
    },
    [user]
  );

  const updateQuantity = useCallback(
    (productId: string, quantity: number) => {
      if (quantity <= 0) {
        setItems((prev) => prev.filter((i) => i.product.id !== productId));
      } else {
        setItems((prev) =>
          prev.map((i) => (i.product.id === productId ? { ...i, quantity } : i))
        );
      }
      if (user) cartApi.setQuantity(productId, Math.max(0, quantity)).catch(() => {});
    },
    [user]
  );

  const clearCart = useCallback(() => {
    setItems([]);
    setCouponCode("");
    setCouponDiscount(0);
    if (user) cartApi.clear().catch(() => {});
  }, [user]);

  const applyCoupon = useCallback((code: string): boolean => {
    const discount = COUPONS[code.toUpperCase()];
    if (discount) {
      setCouponDiscount(discount);
      setCouponCode(code.toUpperCase());
      return true;
    }
    return false;
  }, []);

  const subtotal = items.reduce(
    (sum, item) => sum + item.product.discountedPrice * item.quantity,
    0
  );
  // Shipping: sum of each product's own shipping charge × quantity.
  // Products created before this feature (no charge set) fall back to
  // the old flat ₹199. Orders above ₹5,000 still ship FREE.
  const itemsShipping = items.reduce(
    (sum, i) => sum + (i.product.shippingCharge ?? 199) * i.quantity,
    0
  );
  const shipping = subtotal > 5000 || items.length === 0 ? 0 : itemsShipping;
  const discountAmount = (subtotal * couponDiscount) / 100;
  const total = subtotal + shipping - discountAmount;
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        couponCode,
        setCouponCode,
        couponDiscount,
        applyCoupon,
        subtotal,
        shipping,
        total,
        totalItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}

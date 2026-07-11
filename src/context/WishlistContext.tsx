import { createContext, useContext, useState, useCallback, useEffect, useRef } from "react";
import type { Product } from "@/data/products";
import { wishlistApi } from "@/lib/api";
import { useAuth } from "./AuthContext";
import { toast } from "@/hooks/use-toast";

interface WishlistContextValue {
  items: Product[];
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
  toggleWishlist: (product: Product) => void;
  isInWishlist: (productId: string) => boolean;
  totalItems: number;
}

const WishlistContext = createContext<WishlistContextValue | null>(null);

// Same pattern as CartContext: guests get localStorage, logged-in users
// get the database, with a one-time merge on login.
const GUEST_STORAGE_KEY = "ssl_sarees_wishlist_guest_v2";
try { localStorage.removeItem("ssl_sarees_wishlist_guest"); } catch {}

function loadGuestItems(): Product[] {
  try {
    const raw = localStorage.getItem(GUEST_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((p) => p && typeof p === "object" && typeof p.id === "string");
  } catch {
    return [];
  }
}

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [items, setItems] = useState<Product[]>(loadGuestItems);
  const hasMergedRef = useRef(false);

  useEffect(() => {
    if (!user) {
      localStorage.setItem(GUEST_STORAGE_KEY, JSON.stringify(items));
    }
  }, [items, user]);

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
        for (const product of guestItems) {
          await wishlistApi.add(product.id).catch(() => {});
        }
        localStorage.removeItem(GUEST_STORAGE_KEY);
      }
      try {
        const { items: serverItems } = await wishlistApi.get();
        if (!cancelled) setItems(serverItems);
      } catch {
        // Network hiccup or logged out mid-request — keep current state.
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [user]);

  const addToWishlist = useCallback(
    (product: Product) => {
      setItems((prev) => (prev.find((p) => p.id === product.id) ? prev : [...prev, product]));
      if (user) {
        wishlistApi
          .add(product.id)
          .then(({ items: serverItems }) => setItems(serverItems))
          .catch((err: Error) => {
            toast({
              title: "Wishlist not saved to your account",
              description: err.message,
              variant: "destructive",
            });
          });
      }
    },
    [user]
  );

  const removeFromWishlist = useCallback(
    (productId: string) => {
      setItems((prev) => prev.filter((p) => p.id !== productId));
      if (user) wishlistApi.remove(productId).catch(() => {});
    },
    [user]
  );

  const toggleWishlist = useCallback(
    (product: Product) => {
      let willAdd = false;
      setItems((prev) => {
        const exists = prev.some((p) => p.id === product.id);
        willAdd = !exists;
        return exists ? prev.filter((p) => p.id !== product.id) : [...prev, product];
      });
      if (user) {
        if (willAdd) wishlistApi.add(product.id).catch(() => {});
        else wishlistApi.remove(product.id).catch(() => {});
      }
    },
    [user]
  );

  const isInWishlist = useCallback(
    (productId: string) => items.some((p) => p.id === productId),
    [items]
  );

  return (
    <WishlistContext.Provider
      value={{
        items,
        addToWishlist,
        removeFromWishlist,
        toggleWishlist,
        isInWishlist,
        totalItems: items.length,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within WishlistProvider");
  return ctx;
}

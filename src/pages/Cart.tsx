import { useState } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Plus, Minus, ShoppingBag, Tag, ArrowRight, ChevronRight } from "lucide-react";
import { useCart } from "@/context/CartContext";

export default function Cart() {
  const [, navigate] = useLocation();
  const { items, removeFromCart, updateQuantity, subtotal, shipping, total, couponCode, couponDiscount, applyCoupon } = useCart();
  const [couponInput, setCouponInput] = useState("");
  const [couponMsg, setCouponMsg] = useState<{ text: string; ok: boolean } | null>(null);

  const handleApplyCoupon = () => {
    if (!couponInput.trim()) return;
    const ok = applyCoupon(couponInput.trim());
    setCouponMsg(ok ? { text: "Coupon applied successfully!", ok: true } : { text: "Invalid coupon code.", ok: false });
    setTimeout(() => setCouponMsg(null), 3000);
  };

  const discountAmount = (subtotal * couponDiscount) / 100;

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-ivory pt-24 flex items-center justify-center" data-testid="page-cart-empty">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-sm mx-auto px-4"
        >
          <div className="w-24 h-24 rounded-full gold-gradient flex items-center justify-center mx-auto mb-6">
            <ShoppingBag size={36} className="text-foreground" />
          </div>
          <h2 className="text-2xl font-serif text-foreground mb-2">Your Cart is Empty</h2>
          <p className="text-sm text-muted-foreground font-poppins mb-6">
            Discover our exquisite collection of handcrafted sarees
          </p>
          <motion.button
            whileHover={{ scale: 1.04 }}
            onClick={() => navigate("/collections")}
            className="bg-maroon text-white rounded-full px-8 py-3 text-sm font-semibold font-poppins shadow-md"
            data-testid="empty-cart-shop"
          >
            Shop Collections
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ivory pt-24" data-testid="page-cart">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <p className="text-xs text-gold uppercase tracking-[0.3em] font-poppins mb-1">Review</p>
          <h1 className="text-3xl sm:text-4xl font-serif text-foreground mb-8">
            Shopping Cart <span className="text-lg text-muted-foreground font-poppins font-normal">({items.length} items)</span>
          </h1>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Items */}
          <div className="lg:col-span-2 space-y-4">
            <AnimatePresence>
              {items.map((item, i) => (
                <motion.div
                  key={item.product.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20, height: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className="bg-white rounded-2xl border border-border p-4 sm:p-5 flex gap-4"
                  data-testid={`cart-item-${item.product.id}`}
                >
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    onClick={() => navigate(`/product/${item.product.id}`)}
                    className="w-24 h-32 sm:w-28 sm:h-36 object-cover rounded-xl cursor-pointer hover:opacity-90 transition-opacity flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-xs text-gold uppercase tracking-wider font-poppins mb-0.5">{item.product.category}</p>
                        <h3
                          onClick={() => navigate(`/product/${item.product.id}`)}
                          className="text-sm sm:text-base font-serif text-foreground font-semibold hover:text-maroon transition-colors cursor-pointer line-clamp-2"
                          data-testid={`cart-item-name-${item.product.id}`}
                        >
                          {item.product.name}
                        </h3>
                        <p className="text-xs text-muted-foreground font-poppins mt-0.5">{item.product.fabric} · {item.product.color}</p>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="p-1.5 text-muted-foreground hover:text-destructive transition-colors flex-shrink-0"
                        data-testid={`remove-item-${item.product.id}`}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center border border-border rounded-xl overflow-hidden">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="w-8 h-8 flex items-center justify-center hover:bg-muted transition-colors"
                          data-testid={`qty-decrease-${item.product.id}`}
                        >
                          <Minus size={13} />
                        </button>
                        <span className="w-8 text-center text-sm font-semibold font-poppins" data-testid={`qty-value-${item.product.id}`}>{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="w-8 h-8 flex items-center justify-center hover:bg-muted transition-colors"
                          data-testid={`qty-increase-${item.product.id}`}
                        >
                          <Plus size={13} />
                        </button>
                      </div>
                      <div className="text-right">
                        <p className="text-base font-bold text-maroon font-poppins" data-testid={`item-price-${item.product.id}`}>
                          ₹{(item.product.discountedPrice * item.quantity).toLocaleString()}
                        </p>
                        {item.quantity > 1 && (
                          <p className="text-xs text-muted-foreground font-poppins">₹{item.product.discountedPrice.toLocaleString()} each</p>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            <button
              onClick={() => navigate("/collections")}
              className="flex items-center gap-2 text-maroon font-semibold font-poppins text-sm mt-2 hover:gap-3 transition-all"
              data-testid="continue-shopping"
            >
              <ChevronRight size={16} className="rotate-180" /> Continue Shopping
            </button>
          </div>

          {/* Order Summary */}
          <div className="space-y-4">
            {/* Coupon */}
            <div className="bg-white rounded-2xl border border-border p-5">
              <h3 className="text-sm font-semibold font-poppins flex items-center gap-2 mb-4">
                <Tag size={15} className="text-gold" /> Have a coupon?
              </h3>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  placeholder="Enter code (e.g. SSL10)"
                  className="flex-1 border border-border rounded-xl px-3 py-2 text-sm font-poppins outline-none focus:border-gold/60 bg-background"
                  data-testid="coupon-input"
                />
                <button
                  onClick={handleApplyCoupon}
                  className="bg-maroon text-white rounded-xl px-4 py-2 text-xs font-semibold font-poppins whitespace-nowrap hover:bg-maroon/90 transition-colors"
                  data-testid="apply-coupon"
                >
                  Apply
                </button>
              </div>
              <AnimatePresence>
                {couponMsg && (
                  <motion.p
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className={`text-xs mt-2 font-poppins ${couponMsg.ok ? "text-emerald-600" : "text-destructive"}`}
                    data-testid="coupon-message"
                  >
                    {couponMsg.text}
                  </motion.p>
                )}
              </AnimatePresence>
              {couponCode && (
                <p className="text-xs text-gold font-semibold font-poppins mt-1">
                  "{couponCode}" applied — {couponDiscount}% off
                </p>
              )}
            </div>

            {/* Summary */}
            <div className="bg-white rounded-2xl border border-border p-5 sticky top-24">
              <h3 className="font-serif text-lg text-foreground mb-5">Order Summary</h3>
              <div className="space-y-3 text-sm font-poppins mb-5">
                <div className="flex justify-between text-foreground">
                  <span className="text-muted-foreground">Subtotal ({items.length} items)</span>
                  <span data-testid="summary-subtotal">₹{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-foreground">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className={shipping === 0 ? "text-emerald-600 font-semibold" : ""} data-testid="summary-shipping">
                    {shipping === 0 ? "FREE" : `₹${shipping}`}
                  </span>
                </div>
                {couponDiscount > 0 && (
                  <div className="flex justify-between text-emerald-600">
                    <span>Coupon discount ({couponDiscount}%)</span>
                    <span data-testid="summary-discount">-₹{discountAmount.toLocaleString()}</span>
                  </div>
                )}
                {shipping > 0 && (
                  <p className="text-xs text-muted-foreground bg-muted rounded-lg p-2">
                    Add ₹{(5000 - subtotal).toLocaleString()} more for FREE shipping
                  </p>
                )}
              </div>
              <div className="border-t border-border pt-4 flex justify-between font-bold text-lg">
                <span className="font-poppins">Total</span>
                <span className="text-maroon font-poppins" data-testid="summary-total">₹{total.toLocaleString()}</span>
              </div>
              <p className="text-xs text-muted-foreground font-poppins mt-1">Inclusive of all taxes</p>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate("/checkout")}
                className="w-full bg-maroon text-white rounded-2xl py-4 font-bold font-poppins text-sm flex items-center justify-center gap-2 mt-5 shadow-md hover:bg-maroon/90 transition-colors"
                data-testid="proceed-checkout"
              >
                Proceed to Checkout <ArrowRight size={16} />
              </motion.button>
              <div className="flex justify-center gap-4 mt-4">
                {["Visa", "Mastercard", "UPI", "RuPay"].map((m) => (
                  <span key={m} className="text-xs text-muted-foreground border border-border rounded px-1.5 py-0.5 font-poppins">{m}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

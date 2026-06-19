import { useState } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { Check, CreditCard, Smartphone, Landmark, Banknote, ChevronDown, X } from "lucide-react";
import { useCart } from "@/context/CartContext";

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  sameAsShipping: boolean;
}

const PAYMENT_METHODS = [
  { id: "upi", label: "UPI", desc: "PhonePe, GPay, Paytm", Icon: Smartphone },
  { id: "card", label: "Credit / Debit Card", desc: "Visa, Mastercard, RuPay", Icon: CreditCard },
  { id: "netbanking", label: "Net Banking", desc: "All major banks", Icon: Landmark },
  { id: "cod", label: "Cash on Delivery", desc: "Pay when delivered", Icon: Banknote },
];

const STATES = [
  "Andhra Pradesh", "Delhi", "Gujarat", "Karnataka", "Kerala",
  "Maharashtra", "Rajasthan", "Tamil Nadu", "Telangana", "Uttar Pradesh", "West Bengal"
];

export default function Checkout() {
  const { items, subtotal, shipping, total, couponDiscount, clearCart } = useCart();
  const [payment, setPayment] = useState("upi");
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    defaultValues: { sameAsShipping: true }
  });

  const discountAmount = (subtotal * couponDiscount) / 100;

  const onSubmit = async (_data: FormData) => {
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 1500));
    setSubmitting(false);
    setSuccess(true);
    clearCart();
  };

  if (items.length === 0 && !success) {
    return (
      <div className="min-h-screen bg-ivory pt-24 flex items-center justify-center" data-testid="checkout-empty">
        <div className="text-center">
          <h2 className="text-2xl font-serif text-foreground mb-4">Your cart is empty</h2>
          <Link href="/collections">
            <button className="bg-maroon text-white rounded-full px-8 py-3 text-sm font-semibold font-poppins" data-testid="checkout-empty-shop">
              Shop Collections
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ivory pt-24" data-testid="page-checkout">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <p className="text-xs text-gold uppercase tracking-[0.3em] font-poppins mb-1">Secure Checkout</p>
          <h1 className="text-3xl font-serif text-foreground mb-8">Complete Your Order</h1>
        </motion.div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left: Forms */}
            <div className="lg:col-span-2 space-y-6">
              {/* Billing Info */}
              <div className="bg-white rounded-2xl border border-border p-6" data-testid="billing-section">
                <h2 className="font-serif text-lg text-foreground mb-5 flex items-center gap-2">
                  <span className="w-6 h-6 bg-maroon text-white rounded-full text-xs flex items-center justify-center font-poppins font-bold">1</span>
                  Billing Information
                </h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {[
                    { name: "firstName", label: "First Name", placeholder: "Priya" },
                    { name: "lastName", label: "Last Name", placeholder: "Sharma" },
                  ].map(({ name, label, placeholder }) => (
                    <div key={name}>
                      <label className="text-xs font-semibold text-foreground font-poppins uppercase tracking-wider block mb-1.5">{label}</label>
                      <input
                        {...register(name as keyof FormData, { required: `${label} is required` })}
                        placeholder={placeholder}
                        className="w-full border border-border rounded-xl px-4 py-2.5 text-sm font-poppins outline-none focus:border-gold/60 bg-background"
                        data-testid={`input-${name}`}
                      />
                      {errors[name as keyof FormData] && (
                        <p className="text-xs text-destructive font-poppins mt-1">{errors[name as keyof FormData]?.message as string}</p>
                      )}
                    </div>
                  ))}
                  <div>
                    <label className="text-xs font-semibold text-foreground font-poppins uppercase tracking-wider block mb-1.5">Email</label>
                    <input
                      {...register("email", { required: "Email is required", pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Valid email required" } })}
                      type="email"
                      placeholder="priya@example.com"
                      className="w-full border border-border rounded-xl px-4 py-2.5 text-sm font-poppins outline-none focus:border-gold/60 bg-background"
                      data-testid="input-email"
                    />
                    {errors.email && <p className="text-xs text-destructive font-poppins mt-1">{errors.email.message}</p>}
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-foreground font-poppins uppercase tracking-wider block mb-1.5">Phone</label>
                    <input
                      {...register("phone", { required: "Phone is required", pattern: { value: /^[6-9]\d{9}$/, message: "Valid 10-digit number required" } })}
                      type="tel"
                      placeholder="9876543210"
                      className="w-full border border-border rounded-xl px-4 py-2.5 text-sm font-poppins outline-none focus:border-gold/60 bg-background"
                      data-testid="input-phone"
                    />
                    {errors.phone && <p className="text-xs text-destructive font-poppins mt-1">{errors.phone.message}</p>}
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="bg-white rounded-2xl border border-border p-6" data-testid="shipping-section">
                <h2 className="font-serif text-lg text-foreground mb-5 flex items-center gap-2">
                  <span className="w-6 h-6 bg-maroon text-white rounded-full text-xs flex items-center justify-center font-poppins font-bold">2</span>
                  Shipping Address
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-foreground font-poppins uppercase tracking-wider block mb-1.5">Address</label>
                    <input
                      {...register("address", { required: "Address is required" })}
                      placeholder="House No., Street, Area"
                      className="w-full border border-border rounded-xl px-4 py-2.5 text-sm font-poppins outline-none focus:border-gold/60 bg-background"
                      data-testid="input-address"
                    />
                    {errors.address && <p className="text-xs text-destructive font-poppins mt-1">{errors.address.message}</p>}
                  </div>
                  <div className="grid sm:grid-cols-3 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-foreground font-poppins uppercase tracking-wider block mb-1.5">City</label>
                      <input
                        {...register("city", { required: "City is required" })}
                        placeholder="Mumbai"
                        className="w-full border border-border rounded-xl px-4 py-2.5 text-sm font-poppins outline-none focus:border-gold/60 bg-background"
                        data-testid="input-city"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-foreground font-poppins uppercase tracking-wider block mb-1.5">State</label>
                      <div className="relative">
                        <select
                          {...register("state", { required: true })}
                          className="w-full border border-border rounded-xl px-4 py-2.5 text-sm font-poppins outline-none focus:border-gold/60 bg-background appearance-none"
                          data-testid="select-state"
                        >
                          <option value="">Select state</option>
                          {STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                        </select>
                        <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-foreground font-poppins uppercase tracking-wider block mb-1.5">Pincode</label>
                      <input
                        {...register("pincode", { required: "Pincode is required", pattern: { value: /^\d{6}$/, message: "6-digit pincode" } })}
                        placeholder="400001"
                        className="w-full border border-border rounded-xl px-4 py-2.5 text-sm font-poppins outline-none focus:border-gold/60 bg-background"
                        data-testid="input-pincode"
                      />
                      {errors.pincode && <p className="text-xs text-destructive font-poppins mt-1">{errors.pincode.message}</p>}
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment */}
              <div className="bg-white rounded-2xl border border-border p-6" data-testid="payment-section">
                <h2 className="font-serif text-lg text-foreground mb-5 flex items-center gap-2">
                  <span className="w-6 h-6 bg-maroon text-white rounded-full text-xs flex items-center justify-center font-poppins font-bold">3</span>
                  Payment Method
                </h2>
                <div className="space-y-3">
                  {PAYMENT_METHODS.map(({ id, label, desc, Icon }) => (
                    <label
                      key={id}
                      className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        payment === id ? "border-maroon bg-maroon/5" : "border-border hover:border-maroon/40"
                      }`}
                      data-testid={`payment-${id}`}
                    >
                      <input
                        type="radio"
                        name="payment"
                        value={id}
                        checked={payment === id}
                        onChange={() => setPayment(id)}
                        className="sr-only"
                      />
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${payment === id ? "border-maroon" : "border-border"}`}>
                        {payment === id && <div className="w-2.5 h-2.5 bg-maroon rounded-full" />}
                      </div>
                      <Icon size={18} className={payment === id ? "text-maroon" : "text-muted-foreground"} />
                      <div>
                        <p className="text-sm font-semibold font-poppins text-foreground">{label}</p>
                        <p className="text-xs text-muted-foreground font-poppins">{desc}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div>
              <div className="bg-white rounded-2xl border border-border p-5 sticky top-24">
                <h3 className="font-serif text-lg text-foreground mb-5">Order Summary</h3>
                <div className="space-y-3 mb-4 max-h-48 overflow-y-auto">
                  {items.map((item) => (
                    <div key={item.product.id} className="flex gap-3 items-center" data-testid={`checkout-item-${item.product.id}`}>
                      <img src={item.product.images[0]} alt={item.product.name} className="w-12 h-16 object-cover rounded-lg flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-poppins font-medium text-foreground line-clamp-2">{item.product.name}</p>
                        <p className="text-xs text-muted-foreground font-poppins">Qty: {item.quantity}</p>
                      </div>
                      <p className="text-sm font-bold text-maroon font-poppins flex-shrink-0">₹{(item.product.discountedPrice * item.quantity).toLocaleString()}</p>
                    </div>
                  ))}
                </div>
                <div className="border-t border-border pt-4 space-y-2 text-sm font-poppins">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Shipping</span>
                    <span className={shipping === 0 ? "text-emerald-600 font-semibold" : ""}>{shipping === 0 ? "FREE" : `₹${shipping}`}</span>
                  </div>
                  {couponDiscount > 0 && (
                    <div className="flex justify-between text-emerald-600">
                      <span>Discount</span>
                      <span>-₹{discountAmount.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold text-base pt-2 border-t border-border">
                    <span>Total</span>
                    <span className="text-maroon">₹{total.toLocaleString()}</span>
                  </div>
                </div>
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  disabled={submitting}
                  className="w-full bg-maroon text-white rounded-2xl py-4 font-bold font-poppins text-sm mt-5 shadow-md hover:bg-maroon/90 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
                  data-testid="place-order"
                >
                  {submitting ? (
                    <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Processing...</span>
                  ) : (
                    "Place Order Securely"
                  )}
                </motion.button>
                <p className="text-xs text-center text-muted-foreground font-poppins mt-3">
                  Secured by 256-bit SSL encryption
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* Success Modal */}
      <AnimatePresence>
        {success && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
            data-testid="order-success-modal"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.85, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 22 }}
              className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="w-20 h-20 gold-gradient rounded-full flex items-center justify-center mx-auto mb-6"
              >
                <Check size={36} className="text-foreground" />
              </motion.div>
              <h2 className="text-2xl font-serif text-foreground mb-2">Order Placed!</h2>
              <p className="text-sm text-muted-foreground font-poppins mb-6 leading-relaxed">
                Thank you for your order. You will receive a confirmation email shortly. Your saree is being prepared with love.
              </p>
              <p className="text-xs text-gold font-semibold font-poppins mb-6">
                Order ID: SSL-{Math.floor(Math.random() * 90000) + 10000}
              </p>
              <Link href="/collections">
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  className="w-full bg-maroon text-white rounded-2xl py-3 font-bold font-poppins text-sm"
                  data-testid="success-continue-shopping"
                >
                  Continue Shopping
                </motion.button>
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

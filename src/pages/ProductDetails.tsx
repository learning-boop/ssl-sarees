import { useState } from "react";
import { useRoute, Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, ShoppingBag, Star, Share2, ZoomIn, ChevronLeft, ChevronRight, Check, Truck, Shield, RotateCcw } from "lucide-react";
import { products } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import ProductCard from "@/components/product/ProductCard";

export default function ProductDetails() {
  const [, params] = useRoute("/product/:id");
  const product = products.find((p) => p.id === params?.id);
  const [selectedImg, setSelectedImg] = useState(0);
  const [qty, setQty] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const [added, setAdded] = useState(false);
  const [zoom, setZoom] = useState(false);
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20" data-testid="product-not-found">
        <div className="text-center">
          <h1 className="text-2xl font-serif text-foreground mb-2">Product Not Found</h1>
          <Link href="/collections">
            <button className="bg-maroon text-white rounded-full px-6 py-2.5 text-sm font-poppins font-semibold mt-4" data-testid="back-to-collections">
              Browse Collections
            </button>
          </Link>
        </div>
      </div>
    );
  }

  const inWishlist = isInWishlist(product.id);
  const related = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);

  const handleAddToCart = () => {
    addToCart(product, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="min-h-screen bg-ivory pt-24" data-testid="page-product-details">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center gap-2 text-xs font-poppins text-muted-foreground">
          <Link href="/" className="hover:text-maroon transition-colors" data-testid="breadcrumb-home">Home</Link>
          <span>/</span>
          <Link href="/collections" className="hover:text-maroon transition-colors" data-testid="breadcrumb-collections">Collections</Link>
          <span>/</span>
          <span className="text-foreground">{product.name}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16">
          {/* Gallery */}
          <div className="space-y-3" data-testid="product-gallery">
            <div className="relative rounded-3xl overflow-hidden aspect-[3/4] bg-card group cursor-zoom-in" onClick={() => setZoom(true)}>
              <AnimatePresence mode="wait">
                <motion.img
                  key={selectedImg}
                  src={product.images[selectedImg]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  initial={{ opacity: 0, scale: 1.03 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  data-testid="product-main-image"
                />
              </AnimatePresence>
              <div className="absolute inset-0 flex items-center justify-between px-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={(e) => { e.stopPropagation(); setSelectedImg(Math.max(0, selectedImg - 1)); }}
                  className="w-9 h-9 bg-white/90 rounded-full flex items-center justify-center shadow-md"
                  data-testid="image-prev"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); setSelectedImg(Math.min(product.images.length - 1, selectedImg + 1)); }}
                  className="w-9 h-9 bg-white/90 rounded-full flex items-center justify-center shadow-md"
                  data-testid="image-next"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
              <div className="absolute top-4 right-4 w-9 h-9 bg-white/90 rounded-full flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
                <ZoomIn size={16} className="text-foreground" />
              </div>
              {product.discount > 0 && (
                <div className="absolute top-4 left-4 bg-maroon text-white text-xs font-bold px-3 py-1 rounded-full font-poppins">
                  -{product.discount}% OFF
                </div>
              )}
            </div>
            <div className="flex gap-2.5 overflow-x-auto pb-1">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImg(i)}
                  className={`flex-none w-20 h-24 rounded-xl overflow-hidden border-2 transition-all ${
                    selectedImg === i ? "border-maroon shadow-sm" : "border-transparent opacity-70"
                  }`}
                  data-testid={`thumbnail-${i}`}
                >
                  <img src={img} alt={`${product.name} ${i + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div data-testid="product-info">
            <div className="mb-2">
              <p className="text-xs text-gold uppercase tracking-widest font-poppins">{product.category} · {product.fabric}</p>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif text-foreground leading-snug mb-4" data-testid="product-title">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-3 mb-5">
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={14} className={i < Math.floor(product.rating) ? "text-gold fill-gold" : "text-muted-foreground"} fill={i < Math.floor(product.rating) ? "currentColor" : "none"} />
                ))}
              </div>
              <span className="text-sm text-muted-foreground font-poppins" data-testid="product-rating">
                {product.rating} ({product.reviews} reviews)
              </span>
              <span className={`text-xs px-2 py-0.5 rounded-full font-poppins font-semibold ${product.inStock ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-600"}`} data-testid="product-stock">
                {product.inStock ? "In Stock" : "Out of Stock"}
              </span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-6 pb-6 border-b border-border" data-testid="product-price">
              <span className="text-3xl font-bold text-maroon font-poppins">₹{product.discountedPrice.toLocaleString()}</span>
              {product.discount > 0 && (
                <>
                  <span className="text-base text-muted-foreground line-through font-poppins">₹{product.price.toLocaleString()}</span>
                  <span className="text-sm text-emerald-600 font-semibold font-poppins">Save ₹{(product.price - product.discountedPrice).toLocaleString()}</span>
                </>
              )}
            </div>

            {/* Details */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              {[
                { label: "Color", value: product.color },
                { label: "Occasion", value: product.occasion.join(", ") },
                { label: "Fabric", value: product.fabric },
                { label: "Care", value: product.specifications.Care || "Dry Clean" },
              ].map((d) => (
                <div key={d.label}>
                  <p className="text-xs text-muted-foreground font-poppins uppercase tracking-wider">{d.label}</p>
                  <p className="text-sm text-foreground font-poppins font-medium mt-0.5">{d.value}</p>
                </div>
              ))}
            </div>

            {/* Quantity */}
            <div className="flex items-center gap-4 mb-5">
              <p className="text-sm font-poppins font-semibold text-foreground">Quantity:</p>
              <div className="flex items-center border border-border rounded-xl overflow-hidden">
                <button
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  className="w-10 h-10 flex items-center justify-center hover:bg-muted transition-colors text-foreground"
                  data-testid="qty-decrease"
                >
                  −
                </button>
                <span className="w-12 text-center text-sm font-semibold font-poppins" data-testid="qty-value">{qty}</span>
                <button
                  onClick={() => setQty(qty + 1)}
                  className="w-10 h-10 flex items-center justify-center hover:bg-muted transition-colors text-foreground"
                  data-testid="qty-increase"
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mb-6">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl font-semibold font-poppins text-sm transition-all ${
                  added
                    ? "bg-emerald-600 text-white"
                    : "bg-maroon text-white hover:bg-maroon/90"
                } disabled:opacity-40`}
                data-testid="button-add-to-cart"
              >
                {added ? <><Check size={16} /> Added to Cart</> : <><ShoppingBag size={16} /> Add to Cart</>}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => toggleWishlist(product)}
                className={`w-14 h-14 rounded-2xl border-2 flex items-center justify-center transition-all ${
                  inWishlist ? "border-maroon bg-maroon text-white" : "border-border text-foreground hover:border-maroon hover:text-maroon"
                }`}
                data-testid="button-wishlist"
              >
                <Heart size={18} fill={inWishlist ? "currentColor" : "none"} />
              </motion.button>
              <button className="w-14 h-14 rounded-2xl border-2 border-border flex items-center justify-center hover:border-maroon hover:text-maroon transition-all" data-testid="button-share">
                <Share2 size={18} />
              </button>
            </div>

            <Link href="/checkout">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                className="w-full gold-gradient text-foreground font-bold font-poppins py-3.5 rounded-2xl text-sm shadow-md mb-6"
                data-testid="button-buy-now"
              >
                Buy Now
              </motion.button>
            </Link>

            {/* Trust Badges */}
            <div className="flex gap-4 p-4 bg-card rounded-2xl border border-border">
              {[
                { Icon: Truck, text: "Free shipping above ₹5000" },
                { Icon: Shield, text: "100% authentic" },
                { Icon: RotateCcw, text: "7-day returns" },
              ].map(({ Icon, text }) => (
                <div key={text} className="flex-1 flex flex-col items-center text-center gap-1">
                  <Icon size={16} className="text-gold" />
                  <p className="text-xs text-muted-foreground font-poppins leading-tight">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-16">
          <div className="flex gap-0 border-b border-border mb-6">
            {["description", "specifications", "reviews"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 text-sm font-semibold font-poppins capitalize border-b-2 transition-all -mb-px ${
                  activeTab === tab
                    ? "border-maroon text-maroon"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
                data-testid={`tab-${tab}`}
              >
                {tab}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === "description" && (
                <div className="max-w-2xl">
                  <p className="text-foreground/80 font-poppins leading-relaxed text-sm" data-testid="product-description">
                    {product.description}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {product.occasion.map((o) => (
                      <span key={o} className="bg-maroon/10 text-maroon text-xs px-3 py-1 rounded-full font-poppins">{o}</span>
                    ))}
                  </div>
                </div>
              )}
              {activeTab === "specifications" && (
                <div className="max-w-lg" data-testid="product-specifications">
                  <table className="w-full text-sm">
                    <tbody>
                      {Object.entries(product.specifications).map(([key, value]) => (
                        <tr key={key} className="border-b border-border last:border-0">
                          <td className="py-3 pr-6 text-muted-foreground font-poppins w-40">{key}</td>
                          <td className="py-3 text-foreground font-poppins font-medium">{value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              {activeTab === "reviews" && (
                <div data-testid="product-reviews">
                  <div className="flex items-center gap-6 mb-6 p-5 bg-card rounded-2xl border border-border">
                    <div className="text-center">
                      <p className="text-5xl font-bold text-maroon font-poppins">{product.rating}</p>
                      <div className="flex gap-0.5 justify-center my-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} size={12} className="text-gold fill-gold" />
                        ))}
                      </div>
                      <p className="text-xs text-muted-foreground font-poppins">{product.reviews} reviews</p>
                    </div>
                    <div className="flex-1 space-y-1.5">
                      {[5, 4, 3, 2, 1].map((star) => (
                        <div key={star} className="flex items-center gap-2">
                          <span className="text-xs w-3 text-muted-foreground font-poppins">{star}</span>
                          <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gold rounded-full"
                              style={{ width: `${star === 5 ? 70 : star === 4 ? 20 : 5 + star}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground font-poppins text-center mt-4">
                    Verified reviews from real customers
                  </p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <div className="mt-16">
            <div className="mb-8">
              <p className="text-xs text-gold uppercase tracking-[0.3em] font-poppins mb-1">You May Also Love</p>
              <h2 className="text-2xl font-serif text-foreground">Related Products</h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {related.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
            </div>
          </div>
        )}
      </div>

      {/* Zoom Modal */}
      <AnimatePresence>
        {zoom && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setZoom(false)}
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 cursor-zoom-out"
            data-testid="zoom-modal"
          >
            <img src={product.images[selectedImg]} alt={product.name} className="max-h-screen max-w-full object-contain rounded-xl" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

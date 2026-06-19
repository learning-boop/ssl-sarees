import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, ShoppingBag, Trash2 } from "lucide-react";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";

export default function Wishlist() {
  const [, navigate] = useLocation();
  const { items, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-ivory pt-24 flex items-center justify-center" data-testid="page-wishlist-empty">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-sm mx-auto px-4"
        >
          <div className="w-24 h-24 rounded-full bg-maroon/10 flex items-center justify-center mx-auto mb-6">
            <Heart size={36} className="text-maroon" />
          </div>
          <h2 className="text-2xl font-serif text-foreground mb-2">Your Wishlist is Empty</h2>
          <p className="text-sm text-muted-foreground font-poppins mb-6">
            Save your favourite sarees to revisit them anytime
          </p>
          <motion.button
            whileHover={{ scale: 1.04 }}
            onClick={() => navigate("/collections")}
            className="bg-maroon text-white rounded-full px-8 py-3 text-sm font-semibold font-poppins shadow-md"
            data-testid="wishlist-empty-shop"
          >
            Explore Collections
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ivory pt-24" data-testid="page-wishlist">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <p className="text-xs text-gold uppercase tracking-[0.3em] font-poppins mb-1">Saved</p>
          <h1 className="text-3xl sm:text-4xl font-serif text-foreground mb-8">
            My Wishlist <span className="text-lg text-muted-foreground font-poppins font-normal">({items.length} items)</span>
          </h1>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence>
            {items.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: i * 0.06 }}
                className="bg-white rounded-2xl border border-border overflow-hidden group shadow-sm hover:shadow-lg transition-all"
                data-testid={`wishlist-item-${product.id}`}
              >
                <div
                  className="relative aspect-[3/4] overflow-hidden cursor-pointer"
                  onClick={() => navigate(`/product/${product.id}`)}
                >
                  <motion.img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  {product.discount > 0 && (
                    <span className="absolute top-3 left-3 bg-maroon text-white text-[10px] font-bold px-2.5 py-1 rounded-full font-poppins">
                      -{product.discount}%
                    </span>
                  )}
                </div>
                <div className="p-4">
                  <p className="text-xs text-gold uppercase tracking-wider font-poppins mb-1">{product.category}</p>
                  <h3
                    onClick={() => navigate(`/product/${product.id}`)}
                    className="text-sm font-serif font-semibold text-foreground hover:text-maroon transition-colors cursor-pointer line-clamp-2 mb-2"
                    data-testid={`wishlist-name-${product.id}`}
                  >
                    {product.name}
                  </h3>
                  <div className="flex items-center gap-2 mb-4" data-testid={`wishlist-price-${product.id}`}>
                    <span className="text-base font-bold text-maroon font-poppins">₹{product.discountedPrice.toLocaleString()}</span>
                    <span className="text-xs text-muted-foreground line-through font-poppins">₹{product.price.toLocaleString()}</span>
                  </div>
                  <div className="flex gap-2">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => addToCart(product)}
                      className="flex-1 flex items-center justify-center gap-1.5 bg-maroon text-white rounded-xl py-2.5 text-xs font-semibold font-poppins hover:bg-maroon/90 transition-colors"
                      data-testid={`wishlist-add-cart-${product.id}`}
                    >
                      <ShoppingBag size={13} /> Add to Cart
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.08 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => removeFromWishlist(product.id)}
                      className="w-10 h-10 rounded-xl border border-border flex items-center justify-center text-muted-foreground hover:text-destructive hover:border-destructive transition-colors"
                      data-testid={`wishlist-remove-${product.id}`}
                    >
                      <Trash2 size={14} />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

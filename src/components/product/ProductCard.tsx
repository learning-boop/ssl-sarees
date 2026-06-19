import { useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Heart, ShoppingBag, Star, Eye } from "lucide-react";
import type { Product } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";

interface ProductCardProps {
  product: Product;
  index?: number;
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const [hovered, setHovered] = useState(false);
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [, navigate] = useLocation();
  const inWishlist = isInWishlist(product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  const goToProduct = () => navigate(`/product/${product.id}`);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
      className="group relative bg-card rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 product-card-hover gold-border-animate"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      data-testid={`card-product-${product.id}`}
    >
      {/* Image */}
      <div className="relative overflow-hidden aspect-[3/4] cursor-pointer" onClick={goToProduct}>
        <motion.img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover"
          initial={{ opacity: 0.8, scale: 1.02 }}
          animate={{ opacity: 1, scale: hovered ? 1.06 : 1 }}
          transition={{ duration: 0.4 }}
          loading="lazy"
          data-testid={`img-product-${product.id}`}
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product.isNewArrival && (
            <span className="bg-maroon text-white text-[10px] font-bold px-2.5 py-1 rounded-full font-poppins uppercase tracking-wide">
              New
            </span>
          )}
          {product.isBestSeller && (
            <span className="gold-gradient text-foreground text-[10px] font-bold px-2.5 py-1 rounded-full font-poppins uppercase tracking-wide">
              Best Seller
            </span>
          )}
          {product.discount > 0 && (
            <span className="bg-emerald-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-full font-poppins">
              -{product.discount}%
            </span>
          )}
        </div>

        {/* Wishlist */}
        <motion.button
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleToggleWishlist}
          className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center shadow-sm transition-all ${
            inWishlist
              ? "bg-maroon text-white"
              : "bg-white/90 text-foreground hover:bg-maroon hover:text-white"
          }`}
          data-testid={`button-wishlist-${product.id}`}
        >
          <Heart size={14} fill={inWishlist ? "currentColor" : "none"} />
        </motion.button>

        {/* Quick View + Add to Cart on Hover */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: hovered ? 1 : 0, y: hovered ? 0 : 16 }}
          transition={{ duration: 0.25 }}
          className="absolute bottom-0 left-0 right-0 flex gap-2 p-3"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={goToProduct}
            className="flex-1 flex items-center justify-center gap-1.5 bg-white/95 text-foreground text-xs font-semibold py-2.5 rounded-xl hover:bg-white transition-colors font-poppins"
            data-testid={`button-quickview-${product.id}`}
          >
            <Eye size={13} />
            Quick View
          </button>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleAddToCart}
            className="flex-1 flex items-center justify-center gap-1.5 bg-maroon text-white text-xs font-semibold py-2.5 rounded-xl hover:bg-maroon/90 transition-colors font-poppins"
            data-testid={`button-addtocart-${product.id}`}
          >
            <ShoppingBag size={13} />
            Add to Cart
          </motion.button>
        </motion.div>
      </div>

      {/* Info */}
      <div className="p-4">
        <p className="text-xs text-muted-foreground font-poppins mb-1 uppercase tracking-wider">
          {product.category} · {product.fabric}
        </p>
        <h3
          className="text-sm font-serif font-medium text-foreground leading-snug mb-2 hover:text-maroon transition-colors cursor-pointer line-clamp-2"
          onClick={goToProduct}
          data-testid={`text-productname-${product.id}`}
        >
          {product.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-1.5 mb-3">
          <div className="flex gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                size={11}
                className={i < Math.floor(product.rating) ? "text-gold fill-gold" : "text-muted-foreground"}
                fill={i < Math.floor(product.rating) ? "currentColor" : "none"}
              />
            ))}
          </div>
          <span className="text-xs text-muted-foreground font-poppins" data-testid={`text-rating-${product.id}`}>
            {product.rating} ({product.reviews})
          </span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2" data-testid={`text-price-${product.id}`}>
          <span className="text-base font-bold text-maroon font-poppins">
            ₹{product.discountedPrice.toLocaleString()}
          </span>
          <span className="text-xs text-muted-foreground line-through font-poppins">
            ₹{product.price.toLocaleString()}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
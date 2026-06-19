import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Heart, ShoppingBag, User, Menu, X, ChevronDown } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useSearch } from "@/context/SearchContext";

const navLinks = [
  { label: "Home", href: "/" },
  {
    label: "Collections",
    href: "/collections",
    children: [
      { label: "All Collections", href: "/collections" },
      { label: "New Arrivals", href: "/collections?filter=new" },
      { label: "Best Sellers", href: "/collections?filter=bestseller" },
      { label: "Silk Sarees", href: "/collections?category=Silk" },
      { label: "Wedding Sarees", href: "/collections?category=Wedding" },
      { label: "Banarasi Sarees", href: "/collections?category=Banarasi" },
      { label: "Kanjivaram Sarees", href: "/collections?category=Kanjivaram" },
    ],
  },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  const { totalItems } = useCart();
  const { totalItems: wishlistCount } = useWishlist();
  const { query, setQuery, results, setIsOpen } = useSearch();
  const [location] = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setMegaOpen(false);
  }, [location]);

  useEffect(() => {
    if (searchOpen && searchRef.current) searchRef.current.focus();
  }, [searchOpen]);

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "glass shadow-md py-2"
            : "bg-transparent py-4"
        }`}
        data-testid="header"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/">
              <motion.div
                className="flex flex-col cursor-pointer"
                whileHover={{ scale: 1.02 }}
                data-testid="logo"
              >
                <span className="text-2xl font-serif font-bold text-maroon leading-none tracking-wide">
                  SSL Sarees
                </span>
                
              </motion.div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-8" data-testid="desktop-nav">
              {navLinks.map((link) =>
                link.children ? (
                  <div
                    key={link.label}
                    className="relative"
                    onMouseEnter={() => setMegaOpen(true)}
                    onMouseLeave={() => setMegaOpen(false)}
                  >
                    <button
                      className="flex items-center gap-1 text-sm font-medium text-foreground hover:text-maroon transition-colors font-poppins"
                      data-testid={`nav-${link.label.toLowerCase()}`}
                    >
                      {link.label}
                      <ChevronDown
                        size={14}
                        className={`transition-transform ${megaOpen ? "rotate-180" : ""}`}
                      />
                    </button>
                    <AnimatePresence>
                      {megaOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 8 }}
                          transition={{ duration: 0.2 }}
                          className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-56 glass rounded-xl shadow-lg overflow-hidden border border-gold/20"
                        >
                          {link.children.map((child) => (
                            <Link
                              key={child.label}
                              href={child.href}
                              className="block px-4 py-2.5 text-sm text-foreground hover:bg-primary/5 hover:text-maroon transition-colors font-poppins border-b border-border/50 last:border-0"
                              data-testid={`nav-submenu-${child.label.toLowerCase().replace(/\s+/g, "-")}`}
                            >
                              {child.label}
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="text-sm font-medium text-foreground hover:text-maroon transition-colors font-poppins"
                    data-testid={`nav-${link.label.toLowerCase()}`}
                  >
                    {link.label}
                  </Link>
                )
              )}
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-3">
              {/* Search */}
              <div className="relative hidden sm:block">
                <AnimatePresence>
                  {searchOpen && (
                    <motion.div
                      initial={{ width: 0, opacity: 0 }}
                      animate={{ width: 220, opacity: 1 }}
                      exit={{ width: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="absolute right-8 top-1/2 -translate-y-1/2 overflow-hidden"
                    >
                      <input
                        ref={searchRef}
                        type="search"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search sarees..."
                        className="w-full bg-white/90 border border-gold/30 rounded-full px-4 py-1.5 text-sm font-poppins outline-none focus:border-gold/60"
                        data-testid="search-input"
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
                <button
                  onClick={() => {
                    setSearchOpen(!searchOpen);
                    if (searchOpen) { setQuery(""); setIsOpen(false); }
                  }}
                  className="p-2 text-foreground hover:text-maroon transition-colors relative z-10"
                  data-testid="search-button"
                >
                  <Search size={20} />
                </button>
                {/* Search Results Dropdown */}
                <AnimatePresence>
                  {searchOpen && results.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 4 }}
                      className="absolute right-0 top-12 w-80 glass rounded-xl shadow-xl border border-gold/20 max-h-80 overflow-y-auto z-50"
                    >
                      {results.slice(0, 6).map((product) => (
                        <Link
                          key={product.id}
                          href={`/product/${product.id}`}
                          onClick={() => { setSearchOpen(false); setQuery(""); }}
                          className="flex items-center gap-3 px-4 py-3 hover:bg-primary/5 border-b border-border/50 last:border-0 transition-colors"
                          data-testid={`search-result-${product.id}`}
                        >
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="w-10 h-12 object-cover rounded-md"
                          />
                          <div>
                            <p className="text-xs font-medium font-poppins text-foreground line-clamp-1">{product.name}</p>
                            <p className="text-xs text-gold font-semibold">₹{product.discountedPrice.toLocaleString()}</p>
                          </div>
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Wishlist */}
              <Link href="/wishlist">
                <button className="relative p-2 text-foreground hover:text-maroon transition-colors" data-testid="wishlist-button">
                  <Heart size={20} />
                  {wishlistCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 bg-maroon text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-poppins font-bold" data-testid="wishlist-count">
                      {wishlistCount}
                    </span>
                  )}
                </button>
              </Link>

              {/* Cart */}
              <Link href="/cart">
                <button className="relative p-2 text-foreground hover:text-maroon transition-colors" data-testid="cart-button">
                  <ShoppingBag size={20} />
                  {totalItems > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 bg-maroon text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-poppins font-bold" data-testid="cart-count">
                      {totalItems}
                    </span>
                  )}
                </button>
              </Link>

              {/* Account */}
              <button className="hidden sm:flex p-2 text-foreground hover:text-maroon transition-colors" data-testid="account-button">
                <User size={20} />
              </button>

              {/* Mobile Menu Toggle */}
              <button
                className="lg:hidden p-2 text-foreground hover:text-maroon transition-colors"
                onClick={() => setMobileOpen(!mobileOpen)}
                data-testid="mobile-menu-toggle"
              >
                {mobileOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed inset-0 z-40 bg-ivory pt-20"
            data-testid="mobile-menu"
          >
            <div className="flex flex-col p-6 gap-1">
              <div className="mb-6">
                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search sarees..."
                  className="w-full bg-white border border-gold/30 rounded-full px-5 py-3 text-sm font-poppins outline-none focus:border-gold/60"
                  data-testid="mobile-search-input"
                />
              </div>
              {navLinks.map((link) => (
                <div key={link.label}>
                  <Link
                    href={link.href}
                    className="block py-3 px-2 text-lg font-serif text-foreground border-b border-border hover:text-maroon transition-colors"
                    data-testid={`mobile-nav-${link.label.toLowerCase()}`}
                  >
                    {link.label}
                  </Link>
                  {link.children && (
                    <div className="pl-4">
                      {link.children.slice(1).map((child) => (
                        <Link
                          key={child.label}
                          href={child.href}
                          className="block py-2 px-2 text-sm text-muted-foreground hover:text-maroon transition-colors font-poppins"
                          data-testid={`mobile-nav-sub-${child.label.toLowerCase().replace(/\s+/g, "-")}`}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
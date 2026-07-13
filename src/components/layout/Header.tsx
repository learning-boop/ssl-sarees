import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Heart, ShoppingBag, User, Menu, X, ChevronDown } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useSearch } from "@/context/SearchContext";
import { useAuth } from "@/context/AuthContext";

const WHATSAPP_NUMBER = "919676019333"; // +91 96760 19333
const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
  "Hi SSL Sarees! I'm interested in your saree collection."
)}`;

// lucide-react doesn't ship brand icons, so the official WhatsApp glyph
// is inlined here as an SVG that accepts the same size prop.
function WhatsAppIcon({ size = 20 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.297-.497.1-.198.05-.371-.025-.52-.074-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

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
  const accountRef = useRef<HTMLDivElement>(null);
  const [accountOpen, setAccountOpen] = useState(false);
  const { user, isAdmin, logout } = useAuth();
  const { totalItems } = useCart();
  const { totalItems: wishlistCount } = useWishlist();
  const { query, setQuery, results, setIsOpen } = useSearch();
  const [location] = useLocation();
  const isOverVideo = location === "/" && !scrolled;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (accountRef.current && !accountRef.current.contains(e.target as Node)) {
        setAccountOpen(false);
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setMegaOpen(false);
    setAccountOpen(false);
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
            : isOverVideo
            ? "bg-gradient-to-b from-black/55 via-black/20 to-transparent py-4"
            : "bg-transparent py-4"
        }`}
        data-testid="header"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/">
              <motion.div
                className="flex items-center gap-2.5 cursor-pointer"
                whileHover={{ scale: 1.02 }}
                data-testid="logo"
              >
                <img
  src="/assets/ssl-logo2.webp"
  alt="SSL Sarees logo"
  className="h-14 w-auto object-contain flex-shrink-0"
  data-testid="logo-image"
/>
                
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
                      className={`flex items-center gap-1 text-sm font-medium transition-colors font-poppins ${isOverVideo ? "text-white hover:text-gold" : "text-foreground hover:text-maroon"}`}
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
                    className={`text-sm font-medium transition-colors font-poppins ${isOverVideo ? "text-white hover:text-gold" : "text-foreground hover:text-maroon"}`}
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
                  className={`p-2 transition-colors relative z-10 ${isOverVideo ? "text-white hover:text-gold" : "text-foreground hover:text-maroon"}`}
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

              {/* WhatsApp */}
              <a
                href={WHATSAPP_LINK}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Chat with us on WhatsApp"
                className={`p-2 transition-colors ${
                  isOverVideo ? "text-white hover:text-[#25D366]" : "text-foreground hover:text-[#25D366]"
                }`}
                data-testid="whatsapp-button"
              >
                <WhatsAppIcon size={20} />
              </a>

              {/* Wishlist */}
              <Link href="/wishlist">
                <button className={`relative p-2 transition-colors ${isOverVideo ? "text-white hover:text-gold" : "text-foreground hover:text-maroon"}`} data-testid="wishlist-button">
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
                <button className={`relative p-2 transition-colors ${isOverVideo ? "text-white hover:text-gold" : "text-foreground hover:text-maroon"}`} data-testid="cart-button">
                  <ShoppingBag size={20} />
                  {totalItems > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 bg-maroon text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-poppins font-bold" data-testid="cart-count">
                      {totalItems}
                    </span>
                  )}
                </button>
              </Link>

              {/* Account */}
              <div className="relative hidden sm:block" ref={accountRef}>
                <button
                  className={`p-2 transition-colors ${isOverVideo ? "text-white hover:text-gold" : "text-foreground hover:text-maroon"}`}
                  data-testid="account-button"
                  onClick={() => setAccountOpen((o) => !o)}
                >
                  <User size={20} />
                </button>
                <AnimatePresence>
                  {accountOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-black/5 py-2 z-50"
                      data-testid="account-menu"
                    >
                      {user ? (
                        <>
                          <p className="px-4 py-1.5 text-xs text-muted-foreground font-poppins truncate">{user.email}</p>
                          {isAdmin && (
                            <Link href="/admin">
                              <span className="block px-4 py-2 text-sm font-poppins text-foreground hover:bg-beige cursor-pointer" data-testid="admin-dashboard-link">
                                Admin Dashboard
                              </span>
                            </Link>
                          )}
                          <button
                            className="w-full text-left px-4 py-2 text-sm font-poppins text-foreground hover:bg-beige"
                            onClick={logout}
                            data-testid="logout-button"
                          >
                            Sign Out
                          </button>
                        </>
                      ) : (
                        <>
                          <Link href="/login">
                            <span className="block px-4 py-2 text-sm font-poppins text-foreground hover:bg-beige cursor-pointer" data-testid="login-link">
                              Sign In
                            </span>
                          </Link>
                          <Link href="/register">
                            <span className="block px-4 py-2 text-sm font-poppins text-foreground hover:bg-beige cursor-pointer" data-testid="register-link">
                              Create Account
                            </span>
                          </Link>
                        </>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Mobile Menu Toggle */}
              <button
                className={`lg:hidden p-2 transition-colors ${isOverVideo ? "text-white hover:text-gold" : "text-foreground hover:text-maroon"}`}
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

              {/* Account (mobile) — the desktop account icon is hidden on
                  small screens, so login/logout must live in this menu */}
              <div className="mt-6 border-t border-border pt-5">
                {user ? (
                  <>
                    <p className="px-2 pb-2 text-xs text-muted-foreground font-poppins truncate">
                      Signed in as {user.email}
                    </p>
                    {isAdmin && (
                      <Link
                        href="/admin"
                        className="block py-2.5 px-2 text-base font-poppins text-foreground hover:text-maroon transition-colors"
                        data-testid="mobile-admin-link"
                      >
                        Admin Dashboard
                      </Link>
                    )}
                    <button
                      onClick={logout}
                      className="block w-full text-left py-2.5 px-2 text-base font-poppins text-red-600"
                      data-testid="mobile-logout-button"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <div className="flex gap-3">
                    <Link
                      href="/login"
                      className="flex-1 text-center bg-maroon text-white rounded-full py-3 text-sm font-semibold font-poppins"
                      data-testid="mobile-login-link"
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/register"
                      className="flex-1 text-center border border-maroon text-maroon rounded-full py-3 text-sm font-semibold font-poppins"
                      data-testid="mobile-register-link"
                    >
                      Create Account
                    </Link>
                  </div>
                )}
              </div>

              {/* WhatsApp (mobile) */}
              <a
                href={WHATSAPP_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 flex items-center justify-center gap-2 bg-[#25D366] text-white rounded-full py-3 text-sm font-semibold font-poppins shadow-md"
                data-testid="mobile-whatsapp-button"
              >
                <WhatsAppIcon size={18} />
                Chat on WhatsApp
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
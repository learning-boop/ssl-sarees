import { Link } from "wouter";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Heart } from "lucide-react";
import { SiInstagram, SiFacebook, SiPinterest, SiYoutube } from "react-icons/si";

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "Collections", href: "/collections" },
  { label: "New Arrivals", href: "/collections?filter=new" },
  { label: "Best Sellers", href: "/collections?filter=bestseller" },
  { label: "About Us", href: "/about" },
  { label: "Contact", href: "/contact" },
];

const supportLinks = [
  { label: "FAQ", href: "/contact" },
  { label: "Returns & Exchange", href: "/contact" },
  { label: "Shipping Policy", href: "/contact" },
  { label: "Terms & Conditions", href: "/contact" },
  { label: "Privacy Policy", href: "/contact" },
  { label: "Size Guide", href: "/contact" },
];

export default function Footer() {
  return (
    <footer className="bg-foreground text-white pt-16 pb-6" data-testid="footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div>
            <h3 className="text-2xl font-serif text-white mb-2">SSL Sarees</h3>
            <p className="text-xs text-gold tracking-widest uppercase mb-4 font-poppins">
              Elegance Woven Into Every Thread
            </p>
            <p className="text-sm text-white/60 leading-relaxed font-poppins mb-6">
              Curating the finest handcrafted sarees from master weavers across India. Each piece is a story of heritage, artistry, and timeless elegance.
            </p>
            <div className="flex gap-3">
              {[
                { Icon: SiInstagram, href: "#", label: "Instagram" },
                { Icon: SiFacebook, href: "#", label: "Facebook" },
                { Icon: SiPinterest, href: "#", label: "Pinterest" },
                { Icon: SiYoutube, href: "#", label: "YouTube" },
              ].map(({ Icon, href, label }) => (
                <motion.a
                  key={label}
                  href={href}
                  whileHover={{ scale: 1.15, y: -2 }}
                  className="w-9 h-9 rounded-full border border-gold/30 flex items-center justify-center text-gold hover:bg-gold hover:text-foreground transition-colors"
                  aria-label={label}
                  data-testid={`social-${label.toLowerCase()}`}
                >
                  <Icon size={16} />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-widest text-gold mb-5 font-poppins">
              Quick Links
            </h4>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/60 hover:text-gold transition-colors font-poppins flex items-center gap-1 group"
                    data-testid={`footer-link-${link.label.toLowerCase().replace(/\s+/g, "-")}`}
                  >
                    <span className="w-0 group-hover:w-3 overflow-hidden transition-all duration-200 text-gold">—</span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Support */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-widest text-gold mb-5 font-poppins">
              Customer Support
            </h4>
            <ul className="space-y-2.5">
              {supportLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/60 hover:text-gold transition-colors font-poppins flex items-center gap-1 group"
                    data-testid={`footer-support-${link.label.toLowerCase().replace(/\s+/g, "-")}`}
                  >
                    <span className="w-0 group-hover:w-3 overflow-hidden transition-all duration-200 text-gold">—</span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-widest text-gold mb-5 font-poppins">
              Contact Us
            </h4>
            <ul className="space-y-4">
              <li className="flex gap-3">
                <Phone size={16} className="text-gold mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-white/80 font-poppins">+91 98765 43210</p>
                  <p className="text-xs text-white/40 font-poppins">Mon–Sat, 10am–7pm IST</p>
                </div>
              </li>
              <li className="flex gap-3">
                <Mail size={16} className="text-gold mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-white/80 font-poppins">care@sslsarees.com</p>
                  <p className="text-xs text-white/40 font-poppins">24hr response time</p>
                </div>
              </li>
              <li className="flex gap-3">
                <MapPin size={16} className="text-gold mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-white/80 font-poppins leading-relaxed">
                    42 Silk Heritage Lane,<br />
                    Kanchipuram, Tamil Nadu,<br />
                    India – 631 501
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Newsletter Banner */}
        <div className="border-t border-white/10 pt-8 mb-8">
          <div className="gold-gradient rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-4">
            <div className="flex-1 text-center sm:text-left">
              <p className="text-foreground font-serif text-lg font-semibold">Get Exclusive Saree Launch Updates</p>
              <p className="text-foreground/70 text-sm font-poppins">Be first to know about new collections, offers & heritage stories.</p>
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-1 sm:w-56 bg-white/90 border-0 rounded-full px-4 py-2.5 text-sm font-poppins text-foreground outline-none focus:ring-2 focus:ring-maroon/30"
                data-testid="footer-newsletter-input"
              />
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="bg-maroon text-white rounded-full px-5 py-2.5 text-sm font-semibold font-poppins whitespace-nowrap hover:bg-maroon/90 transition-colors"
                data-testid="footer-newsletter-subscribe"
              >
                Subscribe
              </motion.button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-white/40 font-poppins">
            © 2026 SSL Sarees. All Rights Reserved.
          </p>
          <p className="text-xs text-white/40 font-poppins flex items-center gap-1">
            Made with <Heart size={10} className="text-gold" /> for Indian Craft Heritage
          </p>
          <div className="flex gap-4">
            {["Visa", "Mastercard", "UPI", "RuPay"].map((m) => (
              <span key={m} className="text-xs text-white/40 border border-white/10 rounded px-2 py-0.5 font-poppins">
                {m}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

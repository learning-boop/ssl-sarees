import { useState, useEffect, useCallback } from "react";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, Star, ShoppingBag, ArrowRight, Shield, Truck, Award, Gem } from "lucide-react";
import { SiInstagram } from "react-icons/si";
import { products, categories, trendingCollections, testimonials } from "@/data/products";
import ProductCard from "@/components/product/ProductCard";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";

// ─── Hero carousel images ───────────────────────────────────────────────────
const heroSlides = [
  {
    src: "assets/hero1.jpg",
    alt: "Luxury Indian Silk Saree",
    label: "Heritage Silk",
  },
  {
    src: "assets/hero2.jpg",
    alt: "Bridal Kanjeevaram Saree",
    label: "Bridal Kanjeevaram",
  },
  {
    src: "assets/tc3.jpg",
    alt: "Contemporary Festive Saree",
    label: "Festive Collection",
  },
];

// ─── Hero Section ────────────────────────────────────────────────────────────
function HeroSection() {
  const [, navigate] = useLocation();
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(1); // 1 = forward, -1 = backward

  // Auto-advance every 3.5s
  useEffect(() => {
    const timer = setInterval(() => {
      setDirection(1);
      setActiveIndex((prev) => (prev + 1) % heroSlides.length);
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  const goTo = useCallback(
    (idx) => {
      setDirection(idx > activeIndex ? 1 : -1);
      setActiveIndex(idx);
    },
    [activeIndex]
  );

  const slideVariants = {
    enter: (dir) => ({ x: dir > 0 ? "100%" : "-100%", opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir) => ({ x: dir > 0 ? "-100%" : "100%", opacity: 0 }),
  };

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-ivory" data-testid="hero-section">
      <div className="absolute inset-0 bg-gradient-to-br from-[#6B0F1A]/5 via-transparent to-[#D4AF37]/10" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(212,175,55,0.12)_0%,_transparent_60%)]" />
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
        className="absolute -right-32 -top-32 w-[600px] h-[600px] rounded-full border border-gold/10 opacity-60"
      />
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 90, repeat: Infinity, ease: "linear" }}
        className="absolute -right-16 -top-16 w-[400px] h-[400px] rounded-full border border-maroon/10 opacity-40"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-28 pb-16 grid lg:grid-cols-2 gap-12 items-center">
        {/* ── Left copy ── */}
        <div>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xs text-gold uppercase tracking-[0.35em] font-poppins mb-4 flex items-center gap-2"
          >
            <span className="w-8 h-px bg-gold inline-block" />
            Premium Heritage Collection 2026
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-serif font-semibold text-foreground leading-tight mb-6"
          >
            Grace In Every Fold{" "}
            <span className="text-maroon italic">Crafted For</span>{" "}
            Every Woman
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45 }}
            className="text-base text-muted-foreground font-poppins leading-relaxed mb-8 max-w-lg"
          >
            Discover handcrafted sarees that celebrate beauty, tradition, and sophistication. Each piece tells the story of India's most skilled artisans.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-wrap gap-4"
          >
            <motion.button
              whileHover={{ scale: 1.04, boxShadow: "0 8px 30px rgba(107,15,26,0.25)" }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate("/collections")}
              className="bg-maroon text-white px-8 py-3.5 rounded-full font-semibold font-poppins text-sm flex items-center gap-2 shadow-lg"
              data-testid="hero-shop-collection"
            >
              Shop Collection <ArrowRight size={16} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate("/collections?category=Wedding")}
              className="border-2 border-maroon text-maroon px-8 py-3.5 rounded-full font-semibold font-poppins text-sm hover:bg-maroon hover:text-white transition-colors"
              data-testid="hero-explore-wedding"
            >
              Explore Wedding Sarees
            </motion.button>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.75 }}
            className="flex gap-8 mt-10 pt-8 border-t border-border"
          >
            {[
              { value: "2000+", label: "Saree Designs" },
              { value: "50+", label: "Master Weavers" },
              { value: "15K+", label: "Happy Customers" },
            ].map((s) => (
              <div key={s.label}>
                <p className="text-2xl font-serif font-bold text-maroon">{s.value}</p>
                <p className="text-xs text-muted-foreground font-poppins">{s.label}</p>
              </div>
            ))}
          </motion.div>
        </div>

        {/* ── Right: image carousel ── */}
        <motion.div
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          className="relative"
        >
          {/* Main carousel frame */}
          <div className="relative rounded-3xl overflow-hidden aspect-[3/4] shadow-2xl">
            <AnimatePresence initial={false} custom={direction} mode="popLayout">
              <motion.div
                key={activeIndex}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
                className="absolute inset-0"
              >
                <img
                  src={heroSlides[activeIndex].src}
                  alt={heroSlides[activeIndex].alt}
                  className="w-full h-full object-cover"
                  data-testid="hero-image"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-maroon/30 via-transparent to-transparent" />

                {/* Slide label */}
                <div className="absolute top-4 left-4">
                  <span className="text-xs text-white bg-black/30 backdrop-blur-sm px-3 py-1.5 rounded-full font-poppins tracking-wide">
                    {heroSlides[activeIndex].label}
                  </span>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Dot indicators */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
              {heroSlides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  aria-label={`Go to slide ${i + 1}`}
                  className="transition-all duration-300 rounded-full focus:outline-none"
                  style={{
                    width: i === activeIndex ? "24px" : "8px",
                    height: "8px",
                    background: i === activeIndex ? "#D4AF37" : "rgba(255,255,255,0.55)",
                  }}
                />
              ))}
            </div>

            {/* Thumbnail strip inside frame bottom-right */}
            <div className="absolute right-3 bottom-16 z-10 flex flex-col gap-2">
              {heroSlides.map((slide, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  aria-label={`Preview ${slide.label}`}
                  className={`w-12 h-14 rounded-lg overflow-hidden border-2 transition-all duration-300 focus:outline-none ${
                    i === activeIndex
                      ? "border-gold shadow-lg scale-105"
                      : "border-white/40 opacity-60 hover:opacity-90"
                  }`}
                >
                  <img src={slide.src} alt={slide.label} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Floating review badge */}
          <motion.div
            initial={{ opacity: 0, x: -20, y: 20 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ delay: 0.9, duration: 0.5 }}
            className="absolute -bottom-4 -left-8 glass rounded-2xl p-4 shadow-xl border border-gold/20 w-52"
          >
            <div className="flex items-center gap-2 mb-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={10} className="text-gold fill-gold" />
              ))}
            </div>
            <p className="text-xs font-serif text-foreground font-semibold">"Absolutely breathtaking quality!"</p>
            <p className="text-xs text-muted-foreground font-poppins mt-1">— Priya S., Mumbai</p>
          </motion.div>

          {/* Certified badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1, duration: 0.4 }}
            className="absolute -top-4 -right-4 gold-gradient rounded-full w-20 h-20 flex flex-col items-center justify-center shadow-lg"
          >
            <p className="text-foreground text-[10px] font-bold font-poppins text-center leading-tight uppercase tracking-wide">
              Pure<br />Silk<br />Certified
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

// ─── Featured Categories ─────────────────────────────────────────────────────
function FeaturedCategories() {
  return (
    <section className="py-20 bg-beige" data-testid="categories-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <p className="text-xs text-gold uppercase tracking-[0.3em] font-poppins mb-2 flex items-center justify-center gap-2">
            <span className="w-6 h-px bg-gold" />
            Explore Our World
            <span className="w-6 h-px bg-gold" />
          </p>
          <h2 className="text-3xl sm:text-4xl font-serif text-foreground">Featured Categories</h2>
        </motion.div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.slug}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
            >
              <Link href={`/collections?category=${cat.slug}`}>
                <motion.div
                  whileHover={{ y: -6 }}
                  className="group relative rounded-2xl overflow-hidden cursor-pointer shadow-sm gold-border-animate"
                  data-testid={`category-${cat.slug.toLowerCase()}`}
                >
                  <div className="aspect-[3/4] overflow-hidden">
                    <motion.img
                      src={cat.image}
                      alt={cat.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-transparent to-transparent" />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
                    <p className="font-serif text-sm font-semibold leading-tight">{cat.name}</p>
                    <p className="text-xs text-white/70 font-poppins mt-0.5">{cat.count} designs</p>
                  </div>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function NewArrivals() {
  const [, navigate] = useLocation();
  const newProducts = products.filter((p) => p.isNewArrival).slice(0, 8);
  return (
    <section className="py-20 bg-ivory" data-testid="new-arrivals-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-12 gap-4"
        >
          <div>
            <p className="text-xs text-gold uppercase tracking-[0.3em] font-poppins mb-1">Just Arrived</p>
            <h2 className="text-3xl sm:text-4xl font-serif text-foreground">New Arrivals</h2>
          </div>
          <motion.button
            whileHover={{ scale: 1.04 }}
            onClick={() => navigate("/collections?filter=new")}
            className="flex items-center gap-2 text-maroon font-semibold font-poppins text-sm border-b border-maroon pb-0.5 hover:gap-3 transition-all"
            data-testid="link-view-all-new"
          >
            View All <ChevronRight size={16} />
          </motion.button>
        </motion.div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {newProducts.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function BestSellers() {
  const [, navigate] = useLocation();
  const [emblaRef] = useEmblaCarousel(
    { loop: true, align: "start", slidesToScroll: 1 },
    [Autoplay({ delay: 3500, stopOnInteraction: false })]
  );
  const bestProducts = products.filter((p) => p.isBestSeller);

  return (
    <section className="py-20 bg-beige" data-testid="best-sellers-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-12 gap-4"
        >
          <div>
            <p className="text-xs text-gold uppercase tracking-[0.3em] font-poppins mb-1">Most Loved</p>
            <h2 className="text-3xl sm:text-4xl font-serif text-foreground">Best Sellers</h2>
          </div>
          <motion.button
            whileHover={{ scale: 1.04 }}
            onClick={() => navigate("/collections?filter=bestseller")}
            className="flex items-center gap-2 text-maroon font-semibold font-poppins text-sm border-b border-maroon pb-0.5"
            data-testid="link-view-all-best"
          >
            View All <ChevronRight size={16} />
          </motion.button>
        </motion.div>
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex gap-5 select-none">
            {bestProducts.map((product, i) => (
              <div key={product.id} className="flex-none w-[260px] sm:w-[300px]">
                <ProductCard product={product} index={i} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function WhyChooseUs() {
  const features = [
    { Icon: Gem, title: "Premium Quality", desc: "Every saree is handpicked by our quality experts from the finest weavers in India." },
    { Icon: Award, title: "Handcrafted Designs", desc: "Authentic heritage weaves crafted by master artisans with decades of expertise." },
    { Icon: Shield, title: "Secure Payments", desc: "100% secure checkout with multiple payment options. Your data is always safe." },
    { Icon: Truck, title: "Fast Delivery", desc: "Express delivery across India in 3-5 days. Free shipping on orders above ₹5000." },
  ];
  return (
    <section className="py-20 luxury-gradient" data-testid="why-choose-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <p className="text-xs text-gold uppercase tracking-[0.3em] font-poppins mb-2 flex items-center justify-center gap-2">
            <span className="w-6 h-px bg-gold" /> Our Promise <span className="w-6 h-px bg-gold" />
          </p>
          <h2 className="text-3xl sm:text-4xl font-serif text-white">Why Choose SSL Sarees</h2>
        </motion.div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -6 }}
              className="glass-dark rounded-2xl p-7 text-center"
              data-testid={`feature-${f.title.toLowerCase().replace(/\s+/g, "-")}`}
            >
              <div className="w-14 h-14 rounded-2xl gold-gradient flex items-center justify-center mx-auto mb-5">
                <f.Icon size={24} className="text-foreground" />
              </div>
              <h3 className="font-serif text-lg text-white mb-2">{f.title}</h3>
              <p className="text-sm text-white/60 font-poppins leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TrendingCollections() {
  return (
    <section className="py-20 bg-ivory" data-testid="trending-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <p className="text-xs text-gold uppercase tracking-[0.3em] font-poppins mb-2 flex items-center justify-center gap-2">
            <span className="w-6 h-px bg-gold" /> Curated For You <span className="w-6 h-px bg-gold" />
          </p>
          <h2 className="text-3xl sm:text-4xl font-serif text-foreground">Trending Collections</h2>
        </motion.div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6">
          {trendingCollections.map((col, i) => (
            <motion.div
              key={col.name}
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.09 }}
              className={`group relative rounded-2xl overflow-hidden cursor-pointer ${i === 0 || i === 3 ? "aspect-[4/5]" : "aspect-square"}`}
              data-testid={`trending-${col.name.toLowerCase().replace(/\s+/g, "-")}`}
            >
              <Link href="/collections">
                <div className="w-full h-full">
                  <motion.img
                    src={col.image}
                    alt={col.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/75 via-foreground/20 to-transparent" />
                  <div className="absolute top-3 left-3">
                    <span className="text-xs text-white bg-gold/80 backdrop-blur-sm px-2.5 py-1 rounded-full font-poppins font-semibold">
                      {col.tag}
                    </span>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="font-serif text-lg sm:text-xl text-white font-semibold">{col.name}</h3>
                    <p className="text-xs text-white/70 font-poppins mt-1 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      Explore Collection <ArrowRight size={12} />
                    </p>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function SareeStory() {
  const [, navigate] = useLocation();
  return (
    <section className="relative py-28 overflow-hidden" data-testid="story-section">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url(assets/banner.png)" }}
      />
      <div className="absolute inset-0 luxury-gradient opacity-80" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(212,175,55,0.08)_0%,_transparent_70%)]" />
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <p className="text-xs text-gold uppercase tracking-[0.4em] font-poppins mb-4 flex items-center justify-center gap-3">
            <span className="w-8 h-px bg-gold" /> Heritage & Craft <span className="w-8 h-px bg-gold" />
          </p>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-serif text-white font-semibold mb-6 leading-tight">
            Every Saree Tells<br />
            <span className="text-gold italic">A Story</span>
          </h2>
          <p className="text-base sm:text-lg text-white/75 font-poppins leading-relaxed mb-8 max-w-2xl mx-auto">
            From the loom of a master weaver in Kanchipuram to the hands of a bride in Mumbai — every saree in our collection carries centuries of heritage, the artisan's devotion, and the promise of beauty that transcends time.
          </p>
          <div className="flex flex-wrap justify-center gap-6 mb-10 text-white/80 font-poppins text-sm">
            {["Hand-woven threads", "Authentic zari work", "GI Tagged Heritage", "Master artisans"].map((t) => (
              <span key={t} className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-gold rounded-full" />
                {t}
              </span>
            ))}
          </div>
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(212,175,55,0.3)" }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate("/about")}
            className="gold-gradient text-foreground font-bold font-poppins px-10 py-4 rounded-full text-sm shadow-xl"
            data-testid="story-read-more"
          >
            Discover Our Heritage
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}

function Testimonials() {
  const [emblaRef] = useEmblaCarousel({ loop: true }, [Autoplay({ delay: 4500 })]);
  return (
    <section className="py-20 bg-beige" data-testid="testimonials-section">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <p className="text-xs text-gold uppercase tracking-[0.3em] font-poppins mb-2 flex items-center justify-center gap-2">
            <span className="w-6 h-px bg-gold" /> Happy Customers <span className="w-6 h-px bg-gold" />
          </p>
          <h2 className="text-3xl sm:text-4xl font-serif text-foreground">What Our Customers Say</h2>
        </motion.div>
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex gap-6 select-none">
            {testimonials.map((t, i) => (
              <div key={t.id} className="flex-none w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.33%-16px)]">
                <motion.div
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="glass rounded-2xl p-6 border border-gold/15 shadow-sm h-full flex flex-col"
                  data-testid={`testimonial-${t.id}`}
                >
                  <div className="flex gap-0.5 mb-4">
                    {Array.from({ length: t.rating }).map((_, j) => (
                      <Star key={j} size={14} className="text-gold fill-gold" />
                    ))}
                  </div>
                  <p className="text-sm text-foreground/80 font-poppins leading-relaxed italic flex-1 mb-5">
                    "{t.review}"
                  </p>
                  <div className="flex items-center gap-3">
                    <img
                      src={t.image}
                      alt={t.name}
                      className="w-10 h-10 rounded-full object-cover border-2 border-gold/30"
                    />
                    <div>
                      <p className="text-sm font-semibold font-serif text-foreground">{t.name}</p>
                      <p className="text-xs text-muted-foreground font-poppins">{t.location}</p>
                    </div>
                  </div>
                </motion.div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function InstagramGallery() {
  const galleryImages = [
    "assets/inst1.jpg",
    "assets/inst2.jpg",
    "assets/inst3.jpg",
    "assets/inst4.jpg",
    "assets/inst5.jpg",
    "assets/inst6.jpg",
  ];
  return (
    <section className="py-20 bg-ivory" data-testid="instagram-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <p className="text-xs text-gold uppercase tracking-[0.3em] font-poppins mb-2 flex items-center justify-center gap-2">
            <span className="w-6 h-px bg-gold" /> Follow Our Journey <span className="w-6 h-px bg-gold" />
          </p>
          <h2 className="text-3xl sm:text-4xl font-serif text-foreground mb-2">@SSLSarees</h2>
          <p className="text-sm text-muted-foreground font-poppins">Share your style with #SSLSarees</p>
        </motion.div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3">
          {galleryImages.map((img, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className="group relative aspect-square rounded-xl overflow-hidden cursor-pointer"
              data-testid={`instagram-img-${i}`}
            >
              <img src={img} alt={`Instagram ${i + 1}`} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" loading="lazy" />
              <div className="absolute inset-0 bg-maroon/0 group-hover:bg-maroon/40 transition-all duration-300 flex items-center justify-center">
                <SiInstagram size={24} className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 drop-shadow-lg" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Newsletter() {
  return (
    <section className="py-20 bg-beige" data-testid="newsletter-section">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="gold-gradient rounded-3xl p-10 shadow-xl">
            <p className="text-xs uppercase tracking-[0.3em] font-poppins text-foreground/60 mb-3">Stay Connected</p>
            <h2 className="text-2xl sm:text-3xl font-serif font-semibold text-foreground mb-3">
              Get Exclusive Saree Launch Updates
            </h2>
            <p className="text-sm text-foreground/70 font-poppins mb-6">
              Be the first to discover new arrivals, festive collections, and exclusive member offers.
            </p>
            <div className="flex gap-2 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 bg-white/90 border-0 rounded-full px-5 py-3 text-sm font-poppins text-foreground outline-none focus:ring-2 focus:ring-maroon/30"
                data-testid="newsletter-email-input"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                className="bg-maroon text-white rounded-full px-6 py-3 text-sm font-semibold font-poppins whitespace-nowrap shadow-md hover:bg-maroon/90 transition-colors"
                data-testid="newsletter-subscribe-button"
              >
                Subscribe
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <div className="overflow-x-hidden" data-testid="page-home">
      <HeroSection />
      <FeaturedCategories />
      <NewArrivals />
      <BestSellers />
      <WhyChooseUs />
      <TrendingCollections />
      <SareeStory />
      <Testimonials />
      <InstagramGallery />
      <Newsletter />
    </div>
  );
}
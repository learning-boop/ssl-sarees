import { motion } from "framer-motion";
import { useLocation } from "wouter";
import { Heart, Award, Users, Leaf } from "lucide-react";

const timeline = [
  { year: "1987", title: "The Beginning", desc: "SSL Sarees was founded in Kanchipuram by the Subramaniam family with a single loom and a dream to preserve authentic Indian weaving traditions." },
  { year: "1995", title: "Expanding Heritage", desc: "We partnered with master weavers across Varanasi, Surat, and Mysore, bringing together India's finest textile traditions under one roof." },
  { year: "2004", title: "GI Recognition", desc: "Our curated collections received recognition for promoting GI-tagged textiles, cementing our commitment to authentic heritage weaves." },
  { year: "2012", title: "Digital Journey", desc: "SSL Sarees went online, making authentic handcrafted sarees accessible to Indian women across the country and around the world." },
  { year: "2019", title: "Artisan Welfare", desc: "Launched the SSL Artisan Initiative — providing fair wages, healthcare, and training to over 500 weaving families across India." },
  { year: "2026", title: "Today", desc: "With 2000+ designs and 15,000+ happy customers, we continue our mission of connecting tradition with modern elegance." },
];

const values = [
  { Icon: Heart, title: "Authenticity", desc: "Every saree is sourced directly from verified master weavers with documented heritage provenance." },
  { Icon: Award, title: "Craftsmanship", desc: "We celebrate artisans who have mastered their craft over decades, often passing skills across generations." },
  { Icon: Users, title: "Community", desc: "Supporting weaving communities through fair trade, ensuring artisans receive the value they deserve." },
  { Icon: Leaf, title: "Sustainability", desc: "Natural dyes, traditional processes, and zero synthetic shortcuts — we honour both the earth and the craft." },
];

export default function About() {
  const [, navigate] = useLocation();
  return (
    <div className="min-h-screen bg-ivory pt-24" data-testid="page-about">
      {/* Hero */}
      <section className="relative py-20 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: "url(https://images.unsplash.com/photo-1580481072645-022349e99928?w=1600&q=80)" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ivory via-ivory/90 to-ivory" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <p className="text-xs text-gold uppercase tracking-[0.3em] font-poppins mb-3 flex items-center justify-center gap-2">
              <span className="w-6 h-px bg-gold" /> Our Story <span className="w-6 h-px bg-gold" />
            </p>
            <h1 className="text-4xl sm:text-5xl font-serif text-foreground leading-tight mb-6">
              Weaving Heritage Into<br />
              <span className="text-maroon italic">Every Thread</span>
            </h1>
            <p className="text-base text-muted-foreground font-poppins leading-relaxed max-w-2xl mx-auto">
              For nearly four decades, SSL Sarees has been the custodian of India's most precious textile heritage — connecting the hands that weave with the hearts that cherish.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Brand Story */}
      <section className="py-16 bg-beige" data-testid="brand-story">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <div className="rounded-3xl overflow-hidden aspect-[4/5] shadow-xl">
                <img
                  src="https://images.unsplash.com/photo-1610030469983-98ccca3e8e88?w=700&h=900&fit=crop&q=85"
                  alt="SSL Sarees Heritage"
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="space-y-5">
              <p className="text-xs text-gold uppercase tracking-[0.3em] font-poppins">Our Heritage</p>
              <h2 className="text-3xl font-serif text-foreground">The Art of Living Tradition</h2>
              <p className="text-sm text-muted-foreground font-poppins leading-relaxed">
                SSL Sarees was born from a simple belief: that the ancient art of Indian weaving deserves to be celebrated, preserved, and shared with the world. Our founders, the Subramaniam family, began with a humble workshop in Kanchipuram — the silk city of India.
              </p>
              <p className="text-sm text-muted-foreground font-poppins leading-relaxed">
                Today, we work with over 500 artisan families across Tamil Nadu, Uttar Pradesh, West Bengal, Maharashtra, and Gujarat. Each weaver brings centuries of inherited skill, regional tradition, and personal artistry to every saree they create.
              </p>
              <p className="text-sm text-muted-foreground font-poppins leading-relaxed">
                When you wear an SSL Saree, you don't just wear fabric — you carry a living piece of India's cultural soul.
              </p>
              <div className="grid grid-cols-3 gap-4 pt-4">
                {[
                  { value: "500+", label: "Weaving Families" },
                  { value: "2000+", label: "Saree Designs" },
                  { value: "38", label: "Years of Heritage" },
                ].map((s) => (
                  <div key={s.label} className="text-center p-3 bg-white rounded-xl border border-border">
                    <p className="text-xl font-bold text-maroon font-serif">{s.value}</p>
                    <p className="text-xs text-muted-foreground font-poppins mt-0.5">{s.label}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-ivory" data-testid="values-section">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <p className="text-xs text-gold uppercase tracking-[0.3em] font-poppins mb-2 flex items-center justify-center gap-2">
              <span className="w-6 h-px bg-gold" /> What We Stand For <span className="w-6 h-px bg-gold" />
            </p>
            <h2 className="text-3xl font-serif text-foreground">Our Values</h2>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-2xl p-6 border border-border text-center shadow-sm"
                data-testid={`value-${v.title.toLowerCase()}`}
              >
                <div className="w-14 h-14 rounded-2xl gold-gradient flex items-center justify-center mx-auto mb-4">
                  <v.Icon size={22} className="text-foreground" />
                </div>
                <h3 className="font-serif text-lg text-foreground mb-2">{v.title}</h3>
                <p className="text-xs text-muted-foreground font-poppins leading-relaxed">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16 luxury-gradient" data-testid="timeline-section">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <p className="text-xs text-gold uppercase tracking-[0.3em] font-poppins mb-2 flex items-center justify-center gap-2">
              <span className="w-6 h-px bg-gold" /> Our Journey <span className="w-6 h-px bg-gold" />
            </p>
            <h2 className="text-3xl font-serif text-white">A Legacy of Excellence</h2>
          </motion.div>
          <div className="relative">
            <div className="absolute left-1/2 -translate-x-px top-0 bottom-0 w-px bg-gold/30 hidden sm:block" />
            <div className="space-y-8">
              {timeline.map((item, i) => (
                <motion.div
                  key={item.year}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className={`flex gap-6 items-start ${i % 2 === 0 ? "sm:flex-row-reverse" : "sm:flex-row"}`}
                  data-testid={`timeline-${item.year}`}
                >
                  <div className={`flex-1 ${i % 2 === 0 ? "sm:text-right" : "sm:text-left"}`}>
                    <div className="glass-dark rounded-2xl p-5">
                      <p className="text-xs text-gold font-poppins font-bold tracking-wider mb-1">{item.year}</p>
                      <h3 className="font-serif text-lg text-white mb-2">{item.title}</h3>
                      <p className="text-xs text-white/65 font-poppins leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                  <div className="hidden sm:flex w-8 flex-shrink-0 justify-center pt-5">
                    <div className="w-4 h-4 rounded-full bg-gold border-2 border-gold/30" />
                  </div>
                  <div className="flex-1 hidden sm:block" />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-ivory text-center">
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="max-w-xl mx-auto px-4">
          <h2 className="text-3xl font-serif text-foreground mb-4">Be Part of Our Story</h2>
          <p className="text-sm text-muted-foreground font-poppins mb-6">
            Every saree you purchase supports an artisan family and preserves a living cultural heritage.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={() => navigate("/collections")}
            className="bg-maroon text-white rounded-full px-10 py-3.5 text-sm font-bold font-poppins shadow-lg"
            data-testid="about-shop-button"
          >
            Explore Our Collection
          </motion.button>
        </motion.div>
      </section>
    </div>
  );
}

import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { Phone, Mail, MapPin, Clock, MessageCircle, Check } from "lucide-react";
import { SiWhatsapp } from "react-icons/si";

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export default function Contact() {
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const { register, handleSubmit, formState: { errors }, reset } = useForm<ContactFormData>();

  const onSubmit = async (_data: ContactFormData) => {
    setSending(true);
    await new Promise((r) => setTimeout(r, 1200));
    setSending(false);
    setSent(true);
    reset();
    setTimeout(() => setSent(false), 5000);
  };

  return (
    <div className="min-h-screen bg-ivory pt-24" data-testid="page-contact">
      {/* Header */}
      <div className="bg-beige border-b border-border py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <p className="text-xs text-gold uppercase tracking-[0.3em] font-poppins mb-2 flex items-center justify-center gap-2">
              <span className="w-6 h-px bg-gold" /> We're Here <span className="w-6 h-px bg-gold" />
            </p>
            <h1 className="text-3xl sm:text-4xl font-serif text-foreground mb-3">Get In Touch</h1>
            <p className="text-sm text-muted-foreground font-poppins">
              Have a question about a saree? Need styling advice? We'd love to hear from you.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contact Info */}
          <div className="space-y-5" data-testid="contact-info">
            {[
              { Icon: Phone, title: "Phone", lines: ["+91 98765 43210", "Mon–Sat, 10am–7pm IST"] },
              { Icon: Mail, title: "Email", lines: ["care@sslsarees.com", "Reply within 24 hours"] },
              { Icon: MapPin, title: "Visit Us", lines: ["42 Silk Heritage Lane,", "Kanchipuram, Tamil Nadu,", "India – 631 501"] },
              { Icon: Clock, title: "Store Hours", lines: ["Mon–Sat: 10am – 7pm", "Sunday: 11am – 5pm"] },
            ].map(({ Icon, title, lines }) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-2xl border border-border p-5 flex gap-4"
                data-testid={`contact-${title.toLowerCase().replace(/\s+/g, "-")}`}
              >
                <div className="w-10 h-10 rounded-xl gold-gradient flex items-center justify-center flex-shrink-0">
                  <Icon size={18} className="text-foreground" />
                </div>
                <div>
                  <p className="text-xs font-bold text-foreground font-poppins uppercase tracking-wider mb-1">{title}</p>
                  {lines.map((l, i) => (
                    <p key={i} className={`font-poppins text-sm ${i === 0 ? "text-foreground" : "text-muted-foreground text-xs"}`}>{l}</p>
                  ))}
                </div>
              </motion.div>
            ))}

            {/* WhatsApp */}
            <motion.a
              href="https://wa.me/919876543210"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-4 bg-emerald-500 text-white rounded-2xl p-5 hover:bg-emerald-600 transition-colors shadow-md"
              data-testid="whatsapp-button"
            >
              <SiWhatsapp size={24} />
              <div>
                <p className="font-semibold font-poppins text-sm">Chat on WhatsApp</p>
                <p className="text-xs text-white/80 font-poppins">Quick responses guaranteed</p>
              </div>
            </motion.a>
          </div>

          {/* Form + Map */}
          <div className="lg:col-span-2 space-y-6">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl border border-border p-6 sm:p-8"
              data-testid="contact-form"
            >
              <h2 className="font-serif text-xl text-foreground mb-6 flex items-center gap-2">
                <MessageCircle size={18} className="text-gold" />
                Send Us a Message
              </h2>

              {sent && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-5 bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center gap-3"
                  data-testid="form-success"
                >
                  <Check size={16} className="text-emerald-600" />
                  <p className="text-sm text-emerald-700 font-poppins">Your message has been sent! We'll be in touch within 24 hours.</p>
                </motion.div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-foreground font-poppins uppercase tracking-wider block mb-1.5">Full Name</label>
                    <input
                      {...register("name", { required: "Name is required" })}
                      placeholder="Priya Sharma"
                      className="w-full border border-border rounded-xl px-4 py-2.5 text-sm font-poppins outline-none focus:border-gold/60 bg-background"
                      data-testid="input-contact-name"
                    />
                    {errors.name && <p className="text-xs text-destructive font-poppins mt-1">{errors.name.message}</p>}
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-foreground font-poppins uppercase tracking-wider block mb-1.5">Email</label>
                    <input
                      {...register("email", {
                        required: "Email is required",
                        pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Valid email required" },
                      })}
                      type="email"
                      placeholder="priya@example.com"
                      className="w-full border border-border rounded-xl px-4 py-2.5 text-sm font-poppins outline-none focus:border-gold/60 bg-background"
                      data-testid="input-contact-email"
                    />
                    {errors.email && <p className="text-xs text-destructive font-poppins mt-1">{errors.email.message}</p>}
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-foreground font-poppins uppercase tracking-wider block mb-1.5">Subject</label>
                  <input
                    {...register("subject", { required: "Subject is required" })}
                    placeholder="Question about Kanjivaram saree"
                    className="w-full border border-border rounded-xl px-4 py-2.5 text-sm font-poppins outline-none focus:border-gold/60 bg-background"
                    data-testid="input-contact-subject"
                  />
                  {errors.subject && <p className="text-xs text-destructive font-poppins mt-1">{errors.subject.message}</p>}
                </div>
                <div>
                  <label className="text-xs font-semibold text-foreground font-poppins uppercase tracking-wider block mb-1.5">Message</label>
                  <textarea
                    {...register("message", { required: "Message is required", minLength: { value: 20, message: "Please write at least 20 characters" } })}
                    rows={5}
                    placeholder="Tell us how we can help you..."
                    className="w-full border border-border rounded-xl px-4 py-2.5 text-sm font-poppins outline-none focus:border-gold/60 bg-background resize-none"
                    data-testid="input-contact-message"
                  />
                  {errors.message && <p className="text-xs text-destructive font-poppins mt-1">{errors.message.message}</p>}
                </div>
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  disabled={sending}
                  className="w-full bg-maroon text-white rounded-xl py-3.5 font-bold font-poppins text-sm hover:bg-maroon/90 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
                  data-testid="submit-contact"
                >
                  {sending ? (
                    <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Sending...</span>
                  ) : (
                    "Send Message"
                  )}
                </motion.button>
              </form>
            </motion.div>

            {/* Map */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="rounded-2xl overflow-hidden border border-border shadow-sm"
              data-testid="contact-map"
            >
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.8!2d79.7036!3d12.8382!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a52c3b0e2a02b%3A0x5e0c7b74a1d6b3a0!2sKanchipuram%2C%20Tamil%20Nadu!5e0!3m2!1sen!2sin!4v1623000000000"
                width="100%"
                height="300"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="SSL Sarees Store Location"
              />
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-ivory pt-28 pb-20" data-testid="privacy-policy-page">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl sm:text-4xl font-serif text-foreground mb-2">Privacy Policy</h1>
        <p className="text-sm text-muted-foreground font-poppins mb-10">Last updated: August 2026</p>

        <div className="space-y-8 font-poppins text-sm leading-relaxed text-foreground/80">
          <section>
            <p>
              SSL Sarees ("we", "us", "our") respects your privacy and is committed to protecting the
              personal information you share with us. This Privacy Policy explains what information
              we collect, how we use it, and the choices you have.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-serif text-foreground mb-2">1. Information We Collect</h2>
            <p className="mb-2">When you use our website, we may collect:</p>
            <ul className="list-disc list-outside pl-5 space-y-1">
              <li>Contact details you provide, such as your name, email address, phone number, and shipping address</li>
              <li>Account information, including your login email and password (stored securely as an encrypted hash)</li>
              <li>Order history and the items in your cart or wishlist</li>
              <li>Payment confirmation details from Razorpay (we do not store your card, UPI, or bank details ourselves)</li>
              <li>Basic technical data such as browser type and device information, used to improve site performance</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-serif text-foreground mb-2">2. How We Use Your Information</h2>
            <ul className="list-disc list-outside pl-5 space-y-1">
              <li>To process and deliver your orders</li>
              <li>To communicate with you about your orders, account, or customer support requests</li>
              <li>To send you updates about new collections or offers, only if you've opted in (e.g. via our newsletter)</li>
              <li>To improve our website, products, and customer experience</li>
              <li>To detect and prevent fraud or misuse of our website</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-serif text-foreground mb-2">3. Payment Information</h2>
            <p>
              All payments are processed through Razorpay, a PCI-DSS compliant payment gateway. Your
              card, UPI, and banking details are handled directly by Razorpay and are never stored on
              our servers.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-serif text-foreground mb-2">4. Sharing of Information</h2>
            <p className="mb-2">We do not sell your personal information. We may share limited data with:</p>
            <ul className="list-disc list-outside pl-5 space-y-1">
              <li>Shipping and courier partners, to deliver your orders</li>
              <li>Razorpay, to process your payments securely</li>
              <li>Service providers who help us operate our website (e.g. hosting), under confidentiality obligations</li>
              <li>Authorities, where required by law</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-serif text-foreground mb-2">5. Data Security</h2>
            <p>
              We take reasonable technical and organisational measures to protect your personal
              information, including encrypting passwords and using secure connections (HTTPS).
              However, no method of transmission over the internet is 100% secure, and we cannot
              guarantee absolute security.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-serif text-foreground mb-2">6. Your Choices</h2>
            <ul className="list-disc list-outside pl-5 space-y-1">
              <li>You can review or update your account information at any time by logging in</li>
              <li>You can unsubscribe from marketing emails at any time using the link in our emails</li>
              <li>You can request that we delete your account and associated personal data by contacting us</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-serif text-foreground mb-2">7. Cookies</h2>
            <p>
              We use cookies and similar technologies to keep you logged in, remember items in your
              cart, and understand how visitors use our website. You can disable cookies in your
              browser settings, though some features of the site may not work as intended.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-serif text-foreground mb-2">8. Children's Privacy</h2>
            <p>
              Our website is not intended for children under 18. We do not knowingly collect personal
              information from children.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-serif text-foreground mb-2">9. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. Any changes will be posted on this
              page with an updated revision date.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-serif text-foreground mb-2">10. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy or how we handle your data, please
              contact us at{" "}
              <a href="mailto:care@sslsarees.com" className="text-maroon underline">care@sslsarees.com</a>{" "}
              or visit our <a href="/contact" className="text-maroon underline">Contact Us</a> page.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

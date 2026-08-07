export default function Terms() {
  return (
    <div className="min-h-screen bg-ivory pt-28 pb-20" data-testid="terms-page">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl sm:text-4xl font-serif text-foreground mb-2">Terms &amp; Conditions</h1>
        <p className="text-sm text-muted-foreground font-poppins mb-10">Last updated: August 2026</p>

        <div className="space-y-8 font-poppins text-sm leading-relaxed text-foreground/80">
          <section>
            <h2 className="text-lg font-serif text-foreground mb-2">1. Introduction</h2>
            <p>
              Welcome to SSL Sarees. These Terms &amp; Conditions govern your use of our website and
              your purchase of products from us. By accessing our website or placing an order, you
              agree to be bound by these terms. If you do not agree with any part of these terms,
              please do not use our website.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-serif text-foreground mb-2">2. Products &amp; Pricing</h2>
            <p>
              We make every effort to display our sarees and their colours, fabric, and details as
              accurately as possible. However, actual colours may vary slightly depending on your
              device's display settings. All prices are listed in Indian Rupees (₹) and are inclusive
              of applicable taxes unless stated otherwise. We reserve the right to change prices,
              descriptions, or availability of any product at any time without prior notice.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-serif text-foreground mb-2">3. Orders &amp; Payment</h2>
            <p>
              Once an order is placed and payment is confirmed, you will receive an order
              confirmation. We reserve the right to refuse or cancel any order at our discretion —
              for example, in cases of pricing errors, suspected fraud, or stock unavailability. If
              your order is cancelled after payment, a full refund will be initiated as per our{" "}
              <a href="/refund-policy" className="text-maroon underline">Refund Policy</a>.
            </p>
            <p className="mt-2">
              Payments on our website are processed securely through Razorpay. We do not store your
              card, UPI, or banking details on our servers.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-serif text-foreground mb-2">4. Shipping</h2>
            <p>
              We ship across India. Delivery timelines vary by location and are estimated at the time
              of checkout; they are not guaranteed and may be affected by courier delays, weather, or
              other circumstances beyond our control. Risk of loss and title for products pass to you
              upon delivery to the shipping carrier.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-serif text-foreground mb-2">5. Returns &amp; Exchanges</h2>
            <p>
              Our returns, exchange, and refund terms are detailed in our{" "}
              <a href="/refund-policy" className="text-maroon underline">Refund Policy</a>. Please
              review it before making a purchase.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-serif text-foreground mb-2">6. Intellectual Property</h2>
            <p>
              All content on this website — including images, product descriptions, logos, and
              design — is the property of SSL Sarees and is protected by applicable intellectual
              property laws. You may not reproduce, distribute, or use any content from this site
              without our prior written consent.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-serif text-foreground mb-2">7. User Accounts</h2>
            <p>
              If you create an account with us, you are responsible for maintaining the
              confidentiality of your login credentials and for all activity that occurs under your
              account. Please notify us immediately of any unauthorised use of your account.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-serif text-foreground mb-2">8. Limitation of Liability</h2>
            <p>
              SSL Sarees shall not be liable for any indirect, incidental, or consequential damages
              arising from the use of our website or products, to the fullest extent permitted by
              applicable law.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-serif text-foreground mb-2">9. Governing Law</h2>
            <p>
              These Terms &amp; Conditions are governed by the laws of India. Any disputes arising out
              of or relating to these terms shall be subject to the exclusive jurisdiction of the
              courts of Tamil Nadu, India.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-serif text-foreground mb-2">10. Changes to These Terms</h2>
            <p>
              We may update these Terms &amp; Conditions from time to time. Continued use of our
              website after any changes constitutes your acceptance of the revised terms.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-serif text-foreground mb-2">11. Contact Us</h2>
            <p>
              For any questions about these Terms &amp; Conditions, please reach us at{" "}
              <a href="mailto:care@sslsarees.com" className="text-maroon underline">care@sslsarees.com</a>{" "}
              or visit our <a href="/contact" className="text-maroon underline">Contact Us</a> page.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

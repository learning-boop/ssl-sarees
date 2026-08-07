export default function RefundPolicy() {
  return (
    <div className="min-h-screen bg-ivory pt-28 pb-20" data-testid="refund-policy-page">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl sm:text-4xl font-serif text-foreground mb-2">Refund &amp; Cancellation Policy</h1>
        <p className="text-sm text-muted-foreground font-poppins mb-10">Last updated: August 2026</p>

        <div className="space-y-8 font-poppins text-sm leading-relaxed text-foreground/80">
          <section>
            <p>
              At SSL Sarees, we want you to love what you order. If something isn't right, here's how
              our cancellation, return, and refund process works.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-serif text-foreground mb-2">1. Order Cancellation</h2>
            <p>
              You may cancel your order free of charge as long as it has not yet been shipped. Once an
              order has been dispatched, it can no longer be cancelled, but you may return it after
              delivery as per our return policy below. To cancel an order, please contact us as soon
              as possible at{" "}
              <a href="mailto:care@sslsarees.com" className="text-maroon underline">care@sslsarees.com</a>{" "}
              or via WhatsApp with your order number.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-serif text-foreground mb-2">2. Returns &amp; Exchanges</h2>
            <p className="mb-2">
              We accept returns and exchanges within <strong>7 days</strong> of delivery, provided
              that:
            </p>
            <ul className="list-disc list-outside pl-5 space-y-1">
              <li>The product is unused, unwashed, and unworn, with all original tags attached</li>
              <li>The product is returned in its original packaging</li>
              <li>The product is not from our list of non-returnable items (see below)</li>
            </ul>
            <p className="mt-2">
              To initiate a return or exchange, contact us with your order number and reason for
              return. We will guide you through the pickup or shipping process.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-serif text-foreground mb-2">3. Non-Returnable Items</h2>
            <p>
              For hygiene and customisation reasons, the following items cannot be returned or
              exchanged unless they arrive damaged or defective: blouses that have been stitched or
              altered to your measurements, and any items marked as "Final Sale" at the time of
              purchase.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-serif text-foreground mb-2">4. Damaged or Incorrect Items</h2>
            <p>
              If you receive a damaged, defective, or incorrect item, please contact us within{" "}
              <strong>48 hours</strong> of delivery with photos of the product and packaging. We will
              arrange a free replacement or full refund, including any shipping charges you paid.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-serif text-foreground mb-2">5. Refund Process</h2>
            <p>
              Once we receive and inspect your returned item, we will notify you of the approval or
              rejection of your refund. Approved refunds are processed back to your original payment
              method via Razorpay within <strong>7–10 business days</strong>. Please note that it may
              take a few additional days for the refund to reflect in your bank or card statement,
              depending on your bank.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-serif text-foreground mb-2">6. Return Shipping Costs</h2>
            <p>
              If the return is due to our error (damaged, defective, or incorrect item), we cover the
              return shipping cost. For returns due to a change of mind, the customer is responsible
              for return shipping charges unless otherwise stated.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-serif text-foreground mb-2">7. Failed or Delayed Payments</h2>
            <p>
              If a payment is deducted from your account but the order is not confirmed on our
              website, please contact us with your payment reference ID. Razorpay-related payment
              issues are typically resolved, and any amount debited without a successful order will
              be refunded automatically by Razorpay within 5–7 business days.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-serif text-foreground mb-2">8. Contact Us</h2>
            <p>
              For any questions about cancellations, returns, or refunds, please reach us at{" "}
              <a href="mailto:care@sslsarees.com" className="text-maroon underline">care@sslsarees.com</a>{" "}
              or visit our <a href="/contact" className="text-maroon underline">Contact Us</a> page.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

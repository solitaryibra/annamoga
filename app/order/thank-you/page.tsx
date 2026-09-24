import Link from "next/link";

export const metadata = {
  title: "Payment return | Anna Moga",
};

export default function ThankYouPage() {
  return (
    <main>
      <section className="payment-return">
        <div className="container payment-return-inner">
          <p className="kicker blue">PAYMENT RETURN</p>
          <h1>Thank you.<span>Your payment is being confirmed.</span></h1>
          <p>PayU sends the final payment status to Anna Moga separately. During the current integration stage, orders are not yet stored in a production database.</p>
          <div className="actions">
            <Link href="/products" className="btn primary">Back to products</Link>
            <Link href="/cart" className="btn secondary">View cart</Link>
          </div>
        </div>
      </section>
    </main>
  );
}

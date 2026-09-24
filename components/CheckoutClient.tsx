"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";

type CartItem = {
  id: string;
  name: string;
  personalization: "stock" | "custom";
  stockDesign: number | null;
  photoName: string | null;
  priceFrom: number;
  quantity: number;
};

export default function CheckoutClient() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [paying, setPaying] = useState(false);
  const [paymentError, setPaymentError] = useState("");

  useEffect(() => {
    try {
      setItems(JSON.parse(localStorage.getItem("anna-moga-cart") || "[]"));
    } catch {
      setItems([]);
    }
  }, []);

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.priceFrom * item.quantity, 0),
    [items]
  );

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPaymentError("");
    setPaying(true);

    const data = new FormData(e.currentTarget);
    const customer = Object.fromEntries(data.entries());
    localStorage.setItem("anna-moga-checkout", JSON.stringify(customer));

    try {
      const response = await fetch("/api/payu/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items, customer }),
      });

      const result = await response.json();

      if (!response.ok || !result.redirectUri) {
        throw new Error(result.error || "Unable to start PayU payment.");
      }

      window.location.assign(result.redirectUri);
    } catch (error) {
      setPaymentError(error instanceof Error ? error.message : "Unable to start payment.");
      setPaying(false);
    }
  }

  if (!items.length) {
    return (
      <main className="checkout-page">
        <section className="cart-header">
          <div className="container">
            <p className="kicker blue">CHECKOUT</p>
            <h1>No items to<br/><span>check out.</span></h1>
            <Link href="/create" className="btn primary">Create yours</Link>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="checkout-page">
      <section className="checkout-header">
        <div className="container">
          <p className="kicker blue">CHECKOUT</p>
          <h1>Delivery &<br/><span>payment.</span></h1>
          <p>Enter your details, then continue to PayU to test the payment flow.</p>
        </div>
      </section>

      <section className="checkout-content">
        <div className="container checkout-grid">
          <form className="checkout-form" onSubmit={submit}>
            <div className="checkout-section">
              <p className="create-step-label">01 / CONTACT</p>
              <h2>Your details</h2>
              <div className="form-grid">
                <label><span>First name</span><input name="firstName" required /></label>
                <label><span>Last name</span><input name="lastName" required /></label>
                <label><span>Email</span><input name="email" type="email" required /></label>
                <label><span>Phone</span><input name="phone" type="tel" required /></label>
              </div>
            </div>

            <div className="checkout-section">
              <p className="create-step-label">02 / DELIVERY</p>
              <h2>Shipping address</h2>
              <div className="form-grid">
                <label className="full"><span>Street and number</span><input name="street" required /></label>
                <label><span>Postal code</span><input name="postalCode" required /></label>
                <label><span>City</span><input name="city" required /></label>
                <label><span>Country</span><input name="country" defaultValue="Poland" required /></label>
                <label><span>Apartment / unit</span><input name="unit" /></label>
              </div>
            </div>

            <div className="checkout-section">
              <p className="create-step-label">03 / ORDER</p>
              <h2>Notes</h2>
              <label className="checkout-textarea">
                <span>Optional order note</span>
                <textarea name="note" rows={5} placeholder="Anything we should know about the order?" />
              </label>
            </div>

            <label className="permission-check checkout-consent">
              <input type="checkbox" name="terms" required />
              <span>I confirm that the order information is correct and that I have permission to use any photographs supplied for personalized products.</span>
            </label>

            <button className="btn primary checkout-save" type="submit" disabled={paying}>
              {paying ? "Opening PayU…" : "Continue to PayU"}
            </button>

            <p className="sandbox-note">Payment is configured for PayU sandbox until production credentials are added.</p>
            {paymentError && <p className="payment-error">{paymentError}</p>}
          </form>

          <aside className="checkout-summary">
            <p className="kicker blue">YOUR ORDER</p>
            <div className="checkout-products">
              {items.map(item => (
                <div key={item.id}>
                  <span>{item.quantity} × {item.name}</span>
                  <strong>From {item.priceFrom * item.quantity} PLN</strong>
                </div>
              ))}
            </div>
            <div className="checkout-total">
              <span>Estimated subtotal</span>
              <strong>From {subtotal} PLN</strong>
            </div>
            <p>Delivery and any final custom-production adjustments are not included yet.</p>
            <Link href="/cart" className="cart-continue">← Edit cart</Link>
          </aside>
        </div>
      </section>
    </main>
  );
}

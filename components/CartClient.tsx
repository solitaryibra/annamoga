"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type CartItem = {
  id: string;
  product: string;
  name: string;
  personalization: "stock" | "custom";
  stockDesign: number | null;
  photoName: string | null;
  priceFrom: number;
  quantity: number;
};

export default function CartClient() {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    try {
      setItems(JSON.parse(localStorage.getItem("anna-moga-cart") || "[]"));
    } catch {
      setItems([]);
    }
  }, []);

  function persist(next: CartItem[]) {
    setItems(next);
    localStorage.setItem("anna-moga-cart", JSON.stringify(next));
    window.dispatchEvent(new Event("anna-moga-cart-updated"));
  }

  function remove(id: string) {
    persist(items.filter(item => item.id !== id));
  }

  function changeQuantity(id: string, delta: number) {
    persist(items.map(item => item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item));
  }

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.priceFrom * item.quantity, 0),
    [items]
  );

  if (!items.length) {
    return (
      <main className="cart-page">
        <section className="cart-header">
          <div className="container">
            <p className="kicker blue">CART</p>
            <h1>Your cart is<br/><span>empty.</span></h1>
            <p>Add a character from the configurator to continue.</p>
            <Link href="/create" className="btn primary">Create yours</Link>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="cart-page">
      <section className="cart-header">
        <div className="container">
          <p className="kicker blue">CART</p>
          <h1>Your<br/><span>characters.</span></h1>
        </div>
      </section>

      <section className="cart-content">
        <div className="container cart-grid">
          <div className="cart-items">
            {items.map((item, index) => (
              <article className="cart-item" key={item.id}>
                <div className="cart-item-index">{String(index + 1).padStart(2, "0")}</div>
                <div className="cart-item-copy">
                  <p className="kicker blue">{item.personalization === "custom" ? "CUSTOM FACE" : "STOCK DESIGN"}</p>
                  <h2>{item.name}</h2>
                  <p>
                    {item.personalization === "custom"
                      ? "Photo: " + (item.photoName || "Uploaded during configuration")
                      : "Design #" + item.stockDesign}
                  </p>
                  <button onClick={() => remove(item.id)}>Remove</button>
                </div>
                <div className="cart-item-side">
                  <strong>From {item.priceFrom * item.quantity} PLN</strong>
                  <div className="quantity-control">
                    <button aria-label="Decrease quantity" onClick={() => changeQuantity(item.id, -1)}>−</button>
                    <span>{item.quantity}</span>
                    <button aria-label="Increase quantity" onClick={() => changeQuantity(item.id, 1)}>+</button>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <aside className="cart-summary">
            <p className="kicker blue">ORDER SUMMARY</p>
            <div className="cart-summary-lines">
              <div><span>Items</span><strong>{items.reduce((sum, item) => sum + item.quantity, 0)}</strong></div>
              <div><span>Products</span><strong>From {subtotal} PLN</strong></div>
              <div><span>Delivery</span><strong>Calculated at checkout</strong></div>
              <div className="cart-total"><span>Estimated subtotal</span><strong>From {subtotal} PLN</strong></div>
            </div>
            <p>Custom-product pricing is currently shown as a starting price. Final pricing rules can be connected to the production workflow later.</p>
            <Link href="/checkout" className="btn primary cart-checkout">Continue to checkout</Link>
            <Link href="/create" className="cart-continue">+ Add another character</Link>
          </aside>
        </div>
      </section>
    </main>
  );
}

"use client";

import Link from "next/link";
import { ChangeEvent, useState } from "react";

type ProductId = "small-assistant" | "large-face";
type Mode = "stock" | "custom";

const productData = {
  "small-assistant": { name: "Small Assistant", price: 250, stockCount: 5 },
  "large-face": { name: "Large Face", price: 400, stockCount: 3 },
} as const;

export default function CreateConfigurator() {
  const [step, setStep] = useState(1);
  const [product, setProduct] = useState<ProductId | null>(null);
  const [mode, setMode] = useState<Mode | null>(null);
  const [stockDesign, setStockDesign] = useState<number | null>(null);
  const [photoName, setPhotoName] = useState("");
  const [photoPreview, setPhotoPreview] = useState("");
  const [permission, setPermission] = useState(false);
  const [added, setAdded] = useState(false);

  const selected = product ? productData[product] : null;
  const canContinue = step === 1 ? Boolean(product) : step === 2 ? Boolean(mode) : mode === "stock" ? stockDesign !== null : Boolean(photoName && permission);

  function chooseProduct(id: ProductId) {
    setProduct(id);
    setMode(null);
    setStockDesign(null);
    setPhotoName("");
    setPhotoPreview("");
    setPermission(false);
    setAdded(false);
  }

  function chooseMode(nextMode: Mode) {
    setMode(nextMode);
    setStockDesign(null);
    setPhotoName("");
    setPhotoPreview("");
    setPermission(false);
    setAdded(false);
  }

  function handlePhoto(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (photoPreview) URL.revokeObjectURL(photoPreview);
    setPhotoName(file.name);
    setPhotoPreview(URL.createObjectURL(file));
    setAdded(false);
  }

  function addToCart() {
    if (!selected || !product || !mode) return;
    const item = {
      id: product + "-" + Date.now(),
      product,
      name: selected.name,
      personalization: mode,
      stockDesign: mode === "stock" ? stockDesign : null,
      photoName: mode === "custom" ? photoName : null,
      priceFrom: selected.price,
      quantity: 1,
    };
    const existing = JSON.parse(localStorage.getItem("anna-moga-cart") || "[]");
    localStorage.setItem("anna-moga-cart", JSON.stringify([...existing, item]));
    setAdded(true);
  }

  return (
    <main className="create-page">
      <section className="create-header">
        <div className="container create-heading">
          <div>
            <p className="kicker blue">CREATE YOURS</p>
            <h1>Build your<br/><span>Anna Moga.</span></h1>
          </div>
          <div className="create-progress">
            <span>{step} / 4</span>
            <div className="progress-track"><i style={{ width: String(step * 25) + "%" }} /></div>
            <p>{step === 1 ? "Choose product" : step === 2 ? "Choose personalization" : step === 3 ? "Add your input" : "Review"}</p>
          </div>
        </div>
      </section>

      <section className="create-workspace">
        <div className="container create-grid">
          <div className="create-main">
            {step === 1 && (
              <div className="create-step">
                <p className="create-step-label">STEP 01</p>
                <h2>Choose your product.</h2>
                <div className="choice-grid two">
                  <button className={"choice-card " + (product === "small-assistant" ? "selected" : "")} onClick={() => chooseProduct("small-assistant")}>
                    <span className="choice-index">01</span>
                    <strong>Small Assistant</strong>
                    <p>Compact character / companion format.</p>
                    <em>From 250 PLN</em>
                  </button>
                  <button className={"choice-card " + (product === "large-face" ? "selected" : "")} onClick={() => chooseProduct("large-face")}>
                    <span className="choice-index">02</span>
                    <strong>Large Face</strong>
                    <p>Larger face-focused statement format.</p>
                    <em>From 400 PLN</em>
                  </button>
                </div>
              </div>
            )}

            {step === 2 && selected && (
              <div className="create-step">
                <p className="create-step-label">STEP 02</p>
                <h2>How should it be personalized?</h2>
                <div className="choice-grid two">
                  <button className={"choice-card " + (mode === "stock" ? "selected" : "")} onClick={() => chooseMode("stock")}>
                    <span className="choice-index">A</span>
                    <strong>Stock design</strong>
                    <p>Choose from {selected.stockCount} ready-made {selected.name} designs.</p>
                    <em>No photo required</em>
                  </button>
                  <button className={"choice-card " + (mode === "custom" ? "selected" : "")} onClick={() => chooseMode("custom")}>
                    <span className="choice-index">B</span>
                    <strong>Custom face</strong>
                    <p>Use one photograph as the starting point for your personalized character.</p>
                    <em>One photo required</em>
                  </button>
                </div>
              </div>
            )}

            {step === 3 && selected && mode === "stock" && (
              <div className="create-step">
                <p className="create-step-label">STEP 03</p>
                <h2>Choose a stock design.</h2>
                <div className="choice-grid stock-grid">
                  {Array.from({ length: selected.stockCount }, (_, i) => i + 1).map((n) => (
                    <button key={n} className={"choice-card stock-card " + (stockDesign === n ? "selected" : "")} onClick={() => setStockDesign(n)}>
                      <span className="stock-placeholder">{String(n).padStart(2, "0")}</span>
                      <strong>Design {n}</strong>
                      <p>Preview artwork will be added when the final stock models are ready.</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 3 && mode === "custom" && (
              <div className="create-step">
                <p className="create-step-label">STEP 03</p>
                <h2>Upload one face photo.</h2>
                <div className="upload-layout">
                  <label className={"upload-box " + (photoPreview ? "has-image" : "")}>
                    {photoPreview ? (
                      <img src={photoPreview} alt="Uploaded face preview" />
                    ) : (
                      <>
                        <span>+</span>
                        <strong>Choose photograph</strong>
                        <p>JPG, PNG or WEBP. Use a clear, front-facing photo when possible.</p>
                      </>
                    )}
                    <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handlePhoto} />
                  </label>
                  <div className="photo-guidance">
                    <p className="kicker blue">PHOTO GUIDANCE</p>
                    <ul>
                      <li>One person clearly visible</li>
                      <li>Face not covered by hands or objects</li>
                      <li>Good lighting and useful detail</li>
                      <li>Avoid strong filters</li>
                    </ul>
                    {photoName && <p className="file-name">Selected: {photoName}</p>}
                    <label className="permission-check">
                      <input type="checkbox" checked={permission} onChange={(e) => setPermission(e.target.checked)} />
                      <span>I confirm that I have permission to use this photograph for this order.</span>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {step === 4 && selected && product && mode && (
              <div className="create-step">
                <p className="create-step-label">STEP 04</p>
                <h2>Review your character.</h2>
                <div className="review-card">
                  <div className="review-row"><span>Product</span><strong>{selected.name}</strong></div>
                  <div className="review-row"><span>Personalization</span><strong>{mode === "custom" ? "Custom face" : "Stock design " + stockDesign}</strong></div>
                  {mode === "custom" && <div className="review-row"><span>Photograph</span><strong>{photoName}</strong></div>}
                  <div className="review-row"><span>Physical product</span><strong>Purchased outright</strong></div>
                  <div className="review-row total"><span>Estimated price</span><strong>From {selected.price} PLN</strong></div>
                </div>
                <p className="review-note">The custom 3D model is not generated on this page yet. For custom orders, the uploaded photograph is the input for the production workflow. Final pricing can be confirmed before payment if the configuration changes.</p>
                <button className="btn primary cart-button" onClick={addToCart}>{added ? "Added to cart" : "Add to cart"}</button>
                {added && (
                  <div className="cart-success-wrap">
                    <p className="cart-success">Added to your cart.</p>
                    <Link href="/cart" className="btn secondary">View cart</Link>
                  </div>
                )}
              </div>
            )}

            <div className="create-controls">
              {step > 1 && <button className="btn secondary" onClick={() => { setStep(step - 1); setAdded(false); }}>Back</button>}
              {step < 4 && <button className="btn primary" disabled={!canContinue} onClick={() => setStep(step + 1)}>Continue</button>}
            </div>
          </div>

          <aside className="create-summary">
            <p className="kicker blue">YOUR CONFIGURATION</p>
            <div className="summary-lines">
              <div><span>Product</span><strong>{selected?.name || "Not selected"}</strong></div>
              <div><span>Type</span><strong>{mode ? (mode === "custom" ? "Custom face" : "Stock") : "Not selected"}</strong></div>
              {mode === "stock" && <div><span>Design</span><strong>{stockDesign ? "#" + stockDesign : "Not selected"}</strong></div>}
              {mode === "custom" && <div><span>Photo</span><strong>{photoName || "Not uploaded"}</strong></div>}
              <div className="summary-price"><span>Price</span><strong>{selected ? "From " + selected.price + " PLN" : "—"}</strong></div>
            </div>
            <p className="summary-note">AI and connected features are not included in the physical-product price and may be offered separately later.</p>
          </aside>
        </div>
      </section>
    </main>
  );
}

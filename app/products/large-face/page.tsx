import Link from "next/link";

function LargeFacePreview() {
  return (
    <div className="large-face-preview">
      <div className="character large">
        <div className="head"><i className="ear left"/><i className="ear right"/><div className="face"><i className="eye left"/><i className="eye right"/><i className="smile"/></div></div>
        <div className="body"><i className="dot"/></div>
      </div>
    </div>
  );
}

export default function LargeFacePage() {
  return (
    <main>
      <section className="product-page-hero">
        <div className="container product-page-grid">
          <div className="product-page-visual">
            <span className="product-page-index">02 / LARGE FACE</span>
            <LargeFacePreview />
          </div>

          <div className="product-page-copy">
            <p className="kicker blue">STATEMENT PIECE</p>
            <h1>Large<br/><span>Face.</span></h1>
            <p className="product-page-price">From 400 PLN</p>
            <p className="product-page-lead">
              A larger face-focused figurine built to make the personalized identity the main visual feature.
            </p>

            <div className="product-page-actions">
              <Link href="/contact" className="btn primary">Create yours</Link>
              <Link href="/how-it-works" className="btn secondary">How it works</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="product-page-info">
        <div className="container product-info-grid">
          <div>
            <p className="kicker blue">CHOOSE YOUR VERSION</p>
            <h2>Three stock faces.<br/>Or make it yours.</h2>
          </div>
          <div className="product-choice-list">
            <article>
              <span>01</span>
              <div>
                <h3>Stock face</h3>
                <p>Choose from three ready-made Large Face designs.</p>
              </div>
            </article>
            <article>
              <span>02</span>
              <div>
                <h3>Custom face</h3>
                <p>Upload one photograph and use it as the starting point for the personalized face design.</p>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="product-spec-section">
        <div className="container product-spec-grid">
          <p className="kicker">WHAT YOU'RE BUYING</p>
          <div className="product-specs">
            <div><span>PRODUCT</span><strong>Large physical figurine</strong></div>
            <div><span>PERSONALIZATION</span><strong>Stock or custom face</strong></div>
            <div><span>INPUT</span><strong>One photograph</strong></div>
            <div><span>AI FEATURES</span><strong>Optional / future subscription</strong></div>
          </div>
        </div>
      </section>
    </main>
  );
}

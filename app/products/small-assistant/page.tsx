import Link from "next/link";
import Image from "next/image";

export default function SmallAssistantPage() {
  return (
    <main>
      <section className="product-page-hero">
        <div className="container product-page-grid">
          <div className="product-page-visual">
            <span className="product-page-index">01 / SMALL ASSISTANT</span>
            <Image
              className="product-page-image"
              src="/small-assistant.png.png"
              alt="Anna Moga Small Assistant prototype"
              width={1200}
              height={1200}
              priority
            />
          </div>

          <div className="product-page-copy">
            <p className="kicker blue">COMPACT COMPANION</p>
            <h1>Small<br/><span>Assistant.</span></h1>
            <p className="product-page-price">From 250 PLN</p>
            <p className="product-page-lead">
              A compact personalized figurine designed around character, identity and future intelligent-home capabilities.
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
            <h2>Stock character<br/>or your face.</h2>
          </div>
          <div className="product-choice-list">
            <article>
              <span>01</span>
              <div>
                <h3>Stock design</h3>
                <p>Choose from five ready-made Small Assistant character designs.</p>
              </div>
            </article>
            <article>
              <span>02</span>
              <div>
                <h3>Custom face</h3>
                <p>Upload one normal photograph and use it as the starting point for your personalized character.</p>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="product-spec-section">
        <div className="container product-spec-grid">
          <p className="kicker">WHAT YOU'RE BUYING</p>
          <div className="product-specs">
            <div><span>PRODUCT</span><strong>Physical figurine</strong></div>
            <div><span>PERSONALIZATION</span><strong>Stock or custom face</strong></div>
            <div><span>INPUT</span><strong>One photograph</strong></div>
            <div><span>AI FEATURES</span><strong>Optional / future subscription</strong></div>
          </div>
        </div>
      </section>
    </main>
  );
}

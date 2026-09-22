"use client";

import { useState } from "react";

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <main>
      {/* Navigation */}
      <nav className="navbar">
        <div className="nav-inner">
          <a href="#" className="logo">
            ANNA MOGA<span>®</span>
          </a>

          <div className={`nav-links ${menuOpen ? "open" : ""}`}>
            <a href="#how-it-works" onClick={() => setMenuOpen(false)}>
              How it works
            </a>
            <a href="#creations" onClick={() => setMenuOpen(false)}>
              Creations
            </a>
            <a href="#pricing" onClick={() => setMenuOpen(false)}>
              Pricing
            </a>
            <a href="#faq" onClick={() => setMenuOpen(false)}>
              FAQ
            </a>
          </div>

          <a href="#create" className="nav-button">
            Create yours
          </a>

          <button
            className="menu-button"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Open menu"
          >
            ☰
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="hero">
        <div className="hero-content">
          <div className="eyebrow">
            AI × 3D PRINTING
          </div>

          <h1>
            Turn
            <br />
            <span>yourself</span>
            <br />
            into 3D.
          </h1>

          <p className="hero-description">
            Upload your photos. Our technology transforms you into a
            personalized 3D model — then we bring it to life as a physical
            figurine.
          </p>

          <div className="hero-buttons">
            <a href="#create" className="primary-button">
              Create my figurine →
            </a>

            <a href="#how-it-works" className="secondary-button">
              See how it works
            </a>
          </div>

          <div className="hero-note">
            <span>●</span> Personalized &nbsp;·&nbsp; 3D printed &nbsp;·&nbsp;
            Made for you
          </div>
        </div>

        <div className="hero-visual">
          <div className="figure-card">
            <div className="figure-placeholder">
              <div className="figure-head">
                <div className="face">
                  <div className="eye left"></div>
                  <div className="eye right"></div>
                  <div className="nose"></div>
                  <div className="mouth"></div>
                </div>
              </div>

              <div className="figure-body"></div>
              <div className="figure-base"></div>
            </div>

            <div className="floating-label label-one">
              <span>01</span> PHOTO
            </div>

            <div className="floating-label label-two">
              <span>02</span> MODEL
            </div>

            <div className="floating-label label-three">
              <span>03</span> FIGURINE
            </div>
          </div>
        </div>
      </section>

      {/* Marquee */}
      <div className="marquee">
        <div>
          PERSONALIZED OBJECTS · DIGITAL TO PHYSICAL · MADE FOR YOU ·
          PERSONALIZED OBJECTS · DIGITAL TO PHYSICAL · MADE FOR YOU ·
        </div>
      </div>

      {/* How it works */}
      <section id="how-it-works" className="section">
        <div className="section-header">
          <div className="section-number">01</div>

          <div>
            <p className="section-label">THE PROCESS</p>
            <h2>
              From photo
              <br />
              to <span>figurine.</span>
            </h2>
          </div>
        </div>

        <div className="steps">
          <div className="step">
            <div className="step-number">01</div>
            <h3>Upload</h3>
            <p>
              Send us a few photos of yourself. Different angles help us
              create a more accurate result.
            </p>
          </div>

          <div className="step">
            <div className="step-number">02</div>
            <h3>Reconstruct</h3>
            <p>
              Our AI-assisted process turns your photographs into a
              three-dimensional model.
            </p>
          </div>

          <div className="step">
            <div className="step-number">03</div>
            <h3>Approve</h3>
            <p>
              Preview your figurine and make sure you're happy before we
              manufacture it.
            </p>
          </div>

          <div className="step">
            <div className="step-number">04</div>
            <h3>Print</h3>
            <p>
              Your model is 3D printed, finished and prepared for delivery.
            </p>
          </div>
        </div>
      </section>

      {/* Creations */}
      <section id="creations" className="creations-section">
        <div className="section-header light">
          <div className="section-number">02</div>

          <div>
            <p className="section-label">WHAT WE MAKE</p>
            <h2>
              More than
              <br />
              <span>a portrait.</span>
            </h2>
          </div>
        </div>

        <div className="creation-grid">
          <div className="creation-card large">
            <div className="creation-image person">
              <div className="mini-figure"></div>
            </div>

            <div className="creation-info">
              <span>01</span>
              <h3>You</h3>
              <p>Your own miniature.</p>
            </div>
          </div>

          <div className="creation-card">
            <div className="creation-image couple">
              <div className="mini-figure small"></div>
              <div className="mini-figure small second"></div>
            </div>

            <div className="creation-info">
              <span>02</span>
              <h3>Couples</h3>
              <p>A shared memory.</p>
            </div>
          </div>

          <div className="creation-card">
            <div className="creation-image family">
              <div className="family-figures">
                <div></div>
                <div></div>
                <div></div>
              </div>
            </div>

            <div className="creation-info">
              <span>03</span>
              <h3>Families</h3>
              <p>Everyone together.</p>
            </div>
          </div>

          <div className="creation-card">
            <div className="creation-image pet">
              <div className="pet-shape"></div>
            </div>

            <div className="creation-info">
              <span>04</span>
              <h3>Pets</h3>
              <p>Your best friend.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Concept */}
      <section className="concept-section">
        <div className="concept-content">
          <p className="section-label">THE IDEA</p>

          <h2>
            A photograph
            <br />
            remembers.
            <br />
            <span>We make it tangible.</span>
          </h2>

          <p className="concept-text">
            ANNA MOGA combines artificial intelligence, 3D modelling and
            additive manufacturing to transform digital memories into physical
            objects you can hold, display and give to someone else.
          </p>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="section pricing-section">
        <div className="section-header">
          <div className="section-number">03</div>

          <div>
            <p className="section-label">PRICING</p>
            <h2>
              Simple.
              <br />
              <span>Personal.</span>
            </h2>
          </div>
        </div>

        <div className="pricing-card">
          <div>
            <p className="pricing-label">STARTING FROM</p>
            <div className="price">
              149 <span>PLN</span>
            </div>
            <p className="pricing-description">
              Final price depends on size, complexity and finishing.
            </p>
          </div>

          <div className="pricing-features">
            <p>✓ Personalized 3D model</p>
            <p>✓ Model preview</p>
            <p>✓ 3D printing</p>
            <p>✓ Quality check</p>
            <p>✓ Protective packaging</p>
          </div>

          <a href="#create" className="primary-button">
            Start creating →
          </a>
        </div>
      </section>

      {/* Create */}
      <section id="create" className="create-section">
        <div className="create-content">
          <p className="section-label">YOUR TURN</p>

          <h2>
            Ready to
            <br />
            become <span>3D?</span>
          </h2>

          <p>
            We're building the easiest way to turn a photograph into a
            physical figurine.
          </p>

          <button className="primary-button large-button">
            Create my figurine →
          </button>

          <p className="coming-soon">ONLINE CREATOR — COMING SOON</p>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="section faq-section">
        <div className="section-header">
          <div className="section-number">04</div>

          <div>
            <p className="section-label">QUESTIONS</p>
            <h2>
              Frequently
              <br />
              <span>asked.</span>
            </h2>
          </div>
        </div>

        <div className="faq-list">
          <details>
            <summary>How many photos do I need?</summary>
            <p>
              For the first version of our service, we expect several clear
              photos from different angles to provide enough information for
              reconstruction.
            </p>
          </details>

          <details>
            <summary>How long does production take?</summary>
            <p>
              Production time will depend on the size, complexity and
              finishing of your figurine. Exact delivery times will be shown
              when ordering.
            </p>
          </details>

          <details>
            <summary>Can I create a figurine of someone else?</summary>
            <p>
              Yes. Couples, families, friends and gift figurines are part of
              the concept. You should only upload photographs that you have
              permission to use.
            </p>
          </details>

          <details>
            <summary>Can I choose the size?</summary>
            <p>
              Yes. Different sizes and levels of detail will be available as
              the product range develops.
            </p>
          </details>
        </div>
      </section>

      {/* Footer */}
      <footer>
        <div className="footer-top">
          <div>
            <a href="#" className="footer-logo">
              ANNA MOGA<span>®</span>
            </a>

            <p className="footer-tagline">
              From pixels
              <br />
              to something
              <br />
              you can hold.
            </p>
          </div>

          <div className="footer-links">
            <div>
              <p>EXPLORE</p>
              <a href="#how-it-works">How it works</a>
              <a href="#creations">Creations</a>
              <a href="#pricing">Pricing</a>
              <a href="#faq">FAQ</a>
            </div>

            <div>
              <p>CONTACT</p>
              <a href="mailto:hello@annamoga.pl">hello@annamoga.pl</a>
              <a href="#create">Create a figurine</a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© 2026 ANNA MOGA</span>
          <span>POZNAŃ · POLAND</span>
        </div>
      </footer>
    </main>
  );
}

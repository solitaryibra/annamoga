export default function FAQPage() {
  return (
    <main>
      <section className="section">
        <div className="container faq">
          <div>
            <p className="kicker blue">FAQ</p>
            <h2>Questions,<br/>answered.</h2>
          </div>
          <div className="faq-list">
            <details><summary><span>How does personalization work?</span><b>+</b></summary><p>You provide a photograph. The creation workflow uses it as the starting point for your personalized character.</p></details>
            <details><summary><span>What products are available?</span><b>+</b></summary><p>The initial product family includes Small Assistant and Large Face.</p></details>
            <details><summary><span>Will the figurine become an AI device?</span><b>+</b></summary><p>The long-term product vision includes Wi-Fi-connected hardware, audio, and intelligent assistant capabilities.</p></details>
            <details><summary><span>When can I create mine?</span><b>+</b></summary><p>The creation and ordering experience is being developed as the ANNA MOGA platform evolves.</p></details>
          </div>
        </div>
      </section>
    </main>
  );
}

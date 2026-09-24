import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <main>
      <section className="hero">
        <div className="hero-inner">
          <div className="hero-copy">
            <p className="eyebrow">YOUR FACE. YOUR CHARACTER. YOUR COMPANION.</p>
            <h1>Meet your AI,<span>in your image.</span></h1>
            <p className="lead">ANNA MOGA turns your face into a physical character — and gives that character a path into the intelligent home.</p>
            <div className="actions">
              <Link href="/products" className="btn primary">Create your character</Link>
              <Link href="/how-it-works" className="btn secondary">See how it works</Link>
            </div>
            <p className="note"><b/> Personalization starts with one photograph.</p>
          </div>
          <div className="hero-art">
            <small>PHYSICAL / INTELLIGENT</small>
            <div className="art-stage">
              <div className="orb"/>
              <Image className="hero-product-image" src="/small-assistant.png.png" alt="ANNA MOGA Small Assistant prototype" width={1024} height={1024} priority />
            </div>
            <small>AM—001&nbsp;&nbsp;&nbsp; POZNAŃ / POLAND</small>
          </div>
        </div>
      </section>

      <section className="statement">
        <div className="container statement-grid">
          <p className="kicker">THE IDEA</p>
          <div>
            <h2>A character that is yours.</h2>
            <div className="pills">
              <span>Personalized.</span>
              <span>Physical.</span>
              <span>Intelligent.</span>
            </div>
            <div className="actions">
              <Link href="/products" className="btn primary">Explore products</Link>
              <Link href="/about" className="btn secondary">About Anna Moga</Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

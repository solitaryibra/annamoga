import Link from "next/link";
import Image from "next/image";

const products = [
  ["01", "Small Assistant", "A compact personalized character designed to bring your digital companion into the physical world."],
  ["02", "Large Face", "A larger statement figurine built around your face and personality."],
];

function Character({ large=false }: { large?: boolean }) {
  return <div className={large ? "character large" : "character"}>
    <div className="head"><i className="ear left"/><i className="ear right"/><div className="face"><i className="eye left"/><i className="eye right"/><i className="smile"/></div></div>
    <div className="body"><i className="dot"/></div>
  </div>;
}

export default function Home() {
  return <main>
    <header className="header"><div className="header-inner">
      <Link href="/" className="brand">ANNA MOGA</Link>
      <nav><Link href="#products">Products</Link><Link href="#about">About</Link><Link href="#process">How it works</Link><Link href="#faq">FAQ</Link><Link href="#contact">Contact</Link></nav>
      <Link href="#products" className="nav-cta">Create yours</Link>
    </div></header>

    <section className="hero"><div className="hero-inner">
      <div className="hero-copy">
        <p className="eyebrow">YOUR FACE. YOUR CHARACTER. YOUR COMPANION.</p>
        <h1>Meet your AI,<span>in your image.</span></h1>
        <p className="lead">ANNA MOGA turns your face into a physical character — and gives that character a path into the intelligent home.</p>
        <div className="actions"><Link href="#products" className="btn primary">Create your character</Link><Link href="#process" className="btn secondary">See how it works</Link></div>
        <p className="note"><b/> Personalization starts with one photograph.</p>
      </div>
      <div className="hero-art"><small>PHYSICAL / INTELLIGENT</small><div className="art-stage"><div className="orb"/><Image className="hero-product-image" src="/small-assistant.png.png" alt="ANNA MOGA Small Assistant prototype" width={1024} height={1024} priority /></div><small>AM—001&nbsp;&nbsp;&nbsp; POZNAŃ / POLAND</small></div>
    </div></section>

    <section className="statement"><div className="container statement-grid"><p className="kicker">THE IDEA</p><div><h2>A character that is yours.</h2><div className="pills"><span>Personalized.</span><span>Physical.</span><span>Intelligent.</span></div></div></div></section>

    <section id="products" className="section"><div className="container">
      <div className="heading"><div><p className="kicker blue">PRODUCTS</p><h2>Made to look like you.<br/>Built to become more.</h2></div><p>Every character begins with a photograph and becomes something you can hold.</p></div>
      <div className="products">{products.map(([num,name,text],i)=><article className="product" key={name}>
        <div className="product-art"><span>{num}</span><em>{i===0?"COMPACT COMPANION":"STATEMENT PIECE"}</em>{i===0?<Image className="product-render" src="/small-assistant.png.png" alt="ANNA MOGA Small Assistant prototype" width={1024} height={1024}/>:<Character large/>}</div>
        <div className="product-info"><div><p className="kicker blue">{num}</p><h3>{name}</h3></div><p>{text}</p><Link href="#contact">Learn more ↗</Link></div>
      </article>)}</div>
    </div></section>

    <section id="process" className="process"><div className="container"><p className="kicker">FROM PHOTO TO CHARACTER</p><h2>One photograph.<span>One physical identity.</span></h2>
      <div className="steps">{[["01","Upload","Send us one normal photograph."],["02","Create","Our workflow turns it into a 3D character."],["03","Personalize","Choose the form that fits you."],["04","Make","Your character becomes physical."]].map(([n,t,d])=><div key={n}><b>{n}</b><h3>{t}</h3><p>{d}</p></div>)}</div>
    </div></section>

    <section id="about" className="future"><div className="container future-grid"><div><p className="kicker">THE LONG-TERM VISION</p><h2>It starts as a character.<span>It can become a companion.</span></h2></div><div className="future-copy"><p>Today, ANNA MOGA creates personalized physical characters. Tomorrow, those characters can become intelligent interfaces for your home.</p><div className="specs"><span>VOICE</span><span>AI</span><span>WI-FI</span><span>SMART HOME</span></div></div></div></section>

    <section id="faq" className="section"><div className="container faq"><div><p className="kicker blue">FAQ</p><h2>Questions,<br/>answered.</h2></div><div className="faq-list">
      <details><summary><span>How does personalization work?</span><b>+</b></summary><p>You provide a photograph. The creation workflow uses it as the starting point for your personalized character.</p></details>
      <details><summary><span>What products are available?</span><b>+</b></summary><p>The initial product family includes Small Assistant and Large Face.</p></details>
      <details><summary><span>Will the figurine become an AI device?</span><b>+</b></summary><p>The long-term product vision includes Wi-Fi-connected hardware, audio, and intelligent assistant capabilities.</p></details>
      <details><summary><span>When can I create mine?</span><b>+</b></summary><p>The creation and ordering experience is being developed as the ANNA MOGA platform evolves.</p></details>
    </div></div></section>

    <section id="contact" className="contact"><div className="container contact-inner"><p className="kicker">ANNA MOGA</p><h2>Make something<span>that looks like you.</span></h2><p>Have an idea, question, or want to follow the project?</p><Link href="mailto:hello@annamoga.com" className="btn light">Contact ANNA MOGA</Link></div></section>
    <footer><div className="container footer"><span className="brand">ANNA MOGA</span><span>Personalized 3D characters & intelligent companions.</span><span>© 2026</span></div></footer>
  </main>;
}
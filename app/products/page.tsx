import Link from "next/link";
import Image from "next/image";

const products = [
  {
    num: "01",
    name: "Small Assistant",
    tag: "COMPACT COMPANION",
    price: "From 250 PLN",
    description: "A compact personalized character designed to bring your digital companion into the physical world.",
    options: ["5 stock character designs", "Custom face from one photograph", "Future AI features available separately"],
    image: true,
    href: "/products/small-assistant",
  },
  {
    num: "02",
    name: "Large Face",
    tag: "STATEMENT PIECE",
    price: "From 400 PLN",
    description: "A larger face-focused figurine built as a more expressive statement piece.",
    options: ["3 stock face designs", "Custom face from one photograph", "Designed for display and future smart features"],
    image: false,
    href: "/products/large-face",
  },
];

function Character({ large=false }: { large?: boolean }) {
  return <div className={large ? "character large" : "character"}>
    <div className="head"><i className="ear left"/><i className="ear right"/><div className="face"><i className="eye left"/><i className="eye right"/><i className="smile"/></div></div>
    <div className="body"><i className="dot"/></div>
  </div>;
}

export default function ProductsPage() {
  return (
    <main>
      <section className="products-hero">
        <div className="container">
          <p className="kicker blue">PRODUCTS</p>
          <h1>Choose the form.<span>Make it yours.</span></h1>
          <p>Start with a stock design or personalize the face using one photograph.</p>
        </div>
      </section>

      <section className="section product-catalog">
        <div className="container">
          <div className="products">
            {products.map((product)=>(
              <article className="product product-expanded" key={product.name}>
                <div className="product-art">
                  <span>{product.num}</span>
                  <em>{product.tag}</em>
                  {product.image
                    ? <Image className="product-render" src="/small-assistant.png.png" alt="ANNA MOGA Small Assistant prototype" width={1024} height={1024}/>
                    : <Character large/>
                  }
                </div>

                <div className="product-detail">
                  <div className="product-title-row">
                    <div>
                      <p className="kicker blue">{product.num}</p>
                      <h2>{product.name}</h2>
                    </div>
                    <strong>{product.price}</strong>
                  </div>

                  <p className="product-description">{product.description}</p>

                  <ul className="product-options">
                    {product.options.map(option => <li key={option}>{option}</li>)}
                  </ul>

                  <div className="product-actions">
                    <Link href={product.href} className="btn primary">View product</Link>
                    <Link href="/how-it-works" className="btn secondary">How personalization works</Link>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="product-note">
            <p className="kicker blue">AI CAPABILITIES</p>
            <p>The physical product is purchased outright. Future connected or AI features may be offered separately through an optional subscription.</p>
          </div>
        </div>
      </section>
    </main>
  );
}

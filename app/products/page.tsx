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

export default function ProductsPage() {
  return (
    <main>
      <section className="section">
        <div className="container">
          <div className="heading">
            <div>
              <p className="kicker blue">PRODUCTS</p>
              <h2>Made to look like you.<br/>Built to become more.</h2>
            </div>
            <p>Every character begins with a photograph and becomes something you can hold.</p>
          </div>

          <div className="products">
            {products.map(([num,name,text],i)=>(
              <article className="product" key={name}>
                <div className="product-art">
                  <span>{num}</span>
                  <em>{i===0?"COMPACT COMPANION":"STATEMENT PIECE"}</em>
                  {i===0
                    ? <Image className="product-render" src="/small-assistant.png.png" alt="ANNA MOGA Small Assistant prototype" width={1024} height={1024}/>
                    : <Character large/>
                  }
                </div>
                <div className="product-info">
                  <div><p className="kicker blue">{num}</p><h3>{name}</h3></div>
                  <p>{text}</p>
                  <Link href="/contact">Learn more ↗</Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

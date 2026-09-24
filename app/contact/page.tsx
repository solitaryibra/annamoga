import Link from "next/link";

export default function ContactPage() {
  return (
    <main>
      <section className="contact">
        <div className="container contact-inner">
          <p className="kicker">ANNA MOGA</p>
          <h2>Make something<span>that looks like you.</span></h2>
          <p>Have an idea, question, or want to follow the project?</p>
          <Link href="mailto:hello@annamoga.com" className="btn light">Contact ANNA MOGA</Link>
        </div>
      </section>
    </main>
  );
}

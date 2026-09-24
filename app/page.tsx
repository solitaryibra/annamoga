import Link from "next/link";

const products = [
  {
    name: "Small Assistant",
    text: "A compact personalized character designed to bring your digital companion into the physical world.",
  },
  {
    name: "Large Face",
    text: "A larger statement figurine built around your face and personality.",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#F7F7FA] text-[#111827]">
      <header className="sticky top-0 z-50 border-b border-black/5 bg-white/85 backdrop-blur">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-10">
          <Link href="/" className="text-xl font-extrabold tracking-[-0.04em]">ANNA MOGA</Link>
          <nav className="hidden items-center gap-8 text-sm font-medium md:flex">
            <Link href="#products">Products</Link>
            <Link href="#about">About</Link>
            <Link href="#faq">FAQ</Link>
            <Link href="#contact">Contact</Link>
          </nav>
          <Link href="#products" className="rounded-full bg-[#111827] px-5 py-2.5 text-sm font-semibold text-white">Create yours</Link>
        </div>
      </header>

      <section className="relative overflow-hidden">
        <div className="absolute -right-32 -top-24 h-96 w-96 rounded-full bg-[#A78BFA]/25 blur-3xl" />
        <div className="absolute -left-24 top-72 h-80 w-80 rounded-full bg-[#4F7CFF]/20 blur-3xl" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-6 py-24 md:py-32 lg:grid-cols-[1.05fr_.95fr] lg:px-10 lg:py-36">
          <div>
            <p className="mb-6 text-sm font-bold uppercase tracking-[0.22em] text-[#4F7CFF]">Your face. Your character. Your companion.</p>
            <h1 className="max-w-4xl text-6xl font-black leading-[0.92] tracking-[-0.065em] sm:text-7xl lg:text-8xl">
              Meet your AI,
              <span className="block text-[#4F7CFF]">in your image.</span>
            </h1>
            <p className="mt-8 max-w-xl text-lg leading-8 text-slate-600">
              ANNA MOGA turns your face into a physical character — and gives that character a path into the intelligent home.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link href="#products" className="rounded-full bg-[#111827] px-7 py-4 text-sm font-bold text-white shadow-lg shadow-black/10">Explore products</Link>
              <Link href="#about" className="rounded-full border border-black/10 bg-white px-7 py-4 text-sm font-bold">How it works</Link>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-xl">
            <div className="aspect-square rounded-[3rem] bg-[#111827] p-6 shadow-2xl shadow-[#111827]/20">
              <div className="flex h-full flex-col justify-between rounded-[2.4rem] bg-gradient-to-br from-[#4F7CFF] via-[#756CF4] to-[#A78BFA] p-8 text-white">
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-white/15 px-4 py-2 text-xs font-bold uppercase tracking-widest">ANNA MOGA</span>
                  <span className="h-3 w-3 rounded-full bg-white shadow-[0_0_24px_white]" />
                </div>
                <div>
                  <div className="mx-auto mb-8 h-40 w-40 rounded-[2.5rem] border border-white/30 bg-white/15 shadow-2xl sm:h-52 sm:w-52" />
                  <p className="text-center text-2xl font-bold tracking-tight">A character that is yours.</p>
                  <p className="mt-2 text-center text-sm text-white/75">Personalized. Physical. Intelligent.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="products" className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="max-w-2xl">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#4F7CFF]">Products</p>
            <h2 className="mt-3 text-4xl font-black tracking-[-0.045em] sm:text-5xl">Made to look like you. Built to become more.</h2>
            <p className="mt-5 text-lg leading-8 text-slate-600">Choose the form that fits your space. Personalization starts with a single photograph.</p>
          </div>
          <div className="mt-14 grid gap-6 md:grid-cols-2">
            {products.map((product, index) => (
              <article key={product.name} className="rounded-[2rem] border border-black/8 bg-[#F7F7FA] p-8">
                <div className="flex aspect-[4/3] items-end rounded-[1.5rem] bg-gradient-to-br from-slate-100 to-slate-200 p-6">
                  <span className="rounded-full bg-white/85 px-4 py-2 text-xs font-bold uppercase tracking-wider">0{index + 1}</span>
                </div>
                <h3 className="mt-7 text-2xl font-extrabold tracking-tight">{product.name}</h3>
                <p className="mt-3 leading-7 text-slate-600">{product.text}</p>
                <Link href="#contact" className="mt-6 inline-block text-sm font-bold text-[#4F7CFF]">Learn more →</Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="about" className="bg-[#111827] py-24 text-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#A78BFA]">The idea</p>
              <h2 className="mt-4 text-4xl font-black tracking-[-0.045em] sm:text-6xl">From a photograph to something you can hold.</h2>
            </div>
            <div className="space-y-5 text-lg leading-8 text-slate-300">
              <p>Upload one normal photograph. Our creation pipeline uses it as the starting point for a personalized 3D character.</p>
              <p>The long-term vision is bigger than a figurine: a physical interface for an intelligent companion that can live with you at home.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="faq" className="bg-white py-24">
        <div className="mx-auto max-w-3xl px-6 lg:px-10">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#4F7CFF]">FAQ</p>
          <h2 className="mt-3 text-4xl font-black tracking-[-0.045em]">Questions, answered.</h2>
          <div className="mt-10 divide-y divide-black/10 border-y border-black/10">
            <details className="py-6">
              <summary className="cursor-pointer font-bold">How does personalization work?</summary>
              <p className="mt-3 leading-7 text-slate-600">You provide a photograph. The creation workflow uses it as the starting point for your personalized character.</p>
            </details>
            <details className="py-6">
              <summary className="cursor-pointer font-bold">What products are available?</summary>
              <p className="mt-3 leading-7 text-slate-600">The initial product family includes Small Assistant and Large Face.</p>
            </details>
            <details className="py-6">
              <summary className="cursor-pointer font-bold">Will the figurine become an AI device?</summary>
              <p className="mt-3 leading-7 text-slate-600">The product vision includes Wi-Fi-connected hardware, audio, and intelligent assistant capabilities.</p>
            </details>
          </div>
        </div>
      </section>

      <section id="contact" className="bg-[#F7F7FA] py-24">
        <div className="mx-auto max-w-4xl px-6 text-center lg:px-10">
          <h2 className="text-4xl font-black tracking-[-0.05em] sm:text-6xl">Ready to make it yours?</h2>
          <p className="mx-auto mt-5 max-w-xl text-lg leading-8 text-slate-600">The creation and ordering experience will be connected here as the platform develops.</p>
          <Link href="mailto:hello@annamoga.com" className="mt-8 inline-block rounded-full bg-[#111827] px-7 py-4 text-sm font-bold text-white">Contact ANNA MOGA</Link>
        </div>
      </section>

      <footer className="border-t border-black/5 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-8 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between lg:px-10">
          <span>© 2026 ANNA MOGA</span>
          <span>Personalized 3D characters & intelligent companions.</span>
        </div>
      </footer>
    </main>
  );
}
"use client";

import Link from "next/link";
import { useState } from "react";

const links = [
  ["Products", "/products"],
  ["About", "/about"],
  ["FAQ", "/faq"],
  ["Contact", "/contact"],
  ["Login", "/login"],
] as const;

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <header className="header">
      <div className="header-inner">
        <Link href="/" className="brand-logo brand-logo-wordmark" aria-label="Anna Moga home" onClick={close}>
          <img src="/images/master-logo-blue-wordmark.svg" alt="Anna Moga" />
        </Link>

        <nav className="desktop-nav">
          {links.map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}
        </nav>


        <button
          className={"menu-toggle" + (open ? " open" : "")}
          type="button"
          aria-label={open ? "Close navigation" : "Open navigation"}
          aria-expanded={open}
          onClick={() => setOpen(v => !v)}
        >
          <span/><span/>
        </button>
      </div>

      <div className={"mobile-menu" + (open ? " open" : "")}>
        <nav>
          {links.map(([label, href]) => <Link key={href} href={href} onClick={close}>{label}</Link>)}
        </nav>
      </div>
    </header>
  );
}

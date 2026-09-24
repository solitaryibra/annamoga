import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "../components/Navbar";
import "./globals.css";

export const metadata: Metadata = {
  title: "Anna Moga",
  description: "Personalized 3D products and AI companions.",
  icons: {
    icon: "/images/master-logo.svg",
    shortcut: "/images/master-logo.svg",
    apple: "/images/master-logo.svg",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <Navbar />

        {children}

        <footer>
          <div className="container footer">
            <Link href="/" className="footer-logo" aria-label="Anna Moga home">
              <img src="/images/master-logo-blue-wordmark.svg" alt="Anna Moga" />
            </Link>
            <span>Personalized 3D characters & intelligent companions.</span>
            <span>© 2026</span>
          </div>
        </footer>
      </body>
    </html>
  );
}

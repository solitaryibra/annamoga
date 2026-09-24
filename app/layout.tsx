import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ANNA MOGA",
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
      <body>{children}</body>
    </html>
  );
}

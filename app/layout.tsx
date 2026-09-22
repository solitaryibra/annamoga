import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ANNA MOGA — Turn Yourself Into 3D",
  description:
    "Transform your photographs into personalized 3D printed figurines with ANNA MOGA.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

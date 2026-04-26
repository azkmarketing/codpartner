import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CodPartner COD Calculator",
  description: "Profit calculator for CodPartner COD fulfillment across UAE, KSA, Kuwait, Qatar, Oman, Bahrain, and Iraq.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

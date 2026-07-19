import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Goyal Filling Station | Authorized Nayara Energy Dealer",
  description:
    "Goyal Filling Station — your trusted authorized Nayara Energy franchise. Premium quality petrol, diesel, lubricants, and exceptional service. Located on Main Highway, open daily 6 AM to 11 PM.",
  keywords: [
    "Goyal Filling Station",
    "Nayara Energy",
    "petrol pump",
    "fuel station",
    "diesel",
    "petrol",
    "lubricants",
    "fuel dealer",
  ],
  openGraph: {
    title: "Goyal Filling Station | Authorized Nayara Energy Dealer",
    description:
      "Premium quality fuel and exceptional service at Goyal Filling Station — authorized Nayara Energy franchise.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}

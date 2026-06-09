import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Nav } from "@/components/layout/Nav";
import { ConditionalFooter } from "@/components/layout/ConditionalFooter";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Maple Carpet & Flooring — AI Outbound Agent",
  description:
    "Maya, the AI outbound agent for Maple Carpet & Flooring weekend sale campaigns.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased`}>
        <Nav />
        <main>{children}</main>
        <ConditionalFooter />
      </body>
    </html>
  );
}

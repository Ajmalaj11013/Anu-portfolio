import type { Metadata } from "next";
import { Playfair_Display, Inter, Cormorant_Garamond } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["300", "400", "500"],
});

const signature = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-signature",
  weight: ["400", "500"],
  style: ["italic"],
});

export const metadata: Metadata = {
  title: "AJNAS — Photographer & Film Director",
  description:
    "Images with a point of view. Fashion, spaces, objects and stories explored through editorial photography and moving image.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${inter.variable} ${signature.variable}`}
    >
      <body
        style={{ backgroundColor: "#F4F2ED", color: "#8C8980" }}
        className="font-sans bg-[#F4F2ED] text-[#8C8980] antialiased selection:bg-[#171715] selection:text-[#F4F2ED]"
      >
        {children}
      </body>
    </html>
  );
}


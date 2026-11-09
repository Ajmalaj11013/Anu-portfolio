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
        style={{ backgroundColor: "#EDE8DF", color: "#2A2A26" }}
        className="font-sans bg-[#EDE8DF] text-[#2A2A26] antialiased selection:bg-[#C9BBA7] selection:text-[#2A2A26]"
      >
        {children}
      </body>
    </html>
  );
}


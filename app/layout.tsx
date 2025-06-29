import type { Metadata } from "next";
import { Noto_Sans_KR } from "next/font/google";
import "./globals.css";
import Footer from "@/components/footer";
import { Analytics } from "@vercel/analytics/next";
import constants from "@/constants";

const notoSansKr = Noto_Sans_KR({
  subsets: ["latin"],
  weight: ["500", "700", "900"],
  variable: "--noto",
});

export const metadata: Metadata = constants.metaData;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={`${notoSansKr.variable} antialiased`}>
        {children}
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}

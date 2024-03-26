import { Inter } from "next/font/google";
import "./globals.css";
import Head from 'next/head'
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Liquid Staking AIUS",
  description: "Liquid Staking AIUS",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>{children}</body>
    </html>
  );
}

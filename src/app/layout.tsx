import "./globals.css";
import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import localFont from "next/font/local";

export const metadata: Metadata = {
  title: "Savepoint",
  description: "A build management system for FFVI",
};

const reactor7 = localFont({ src: "../../public/font/Reactor7.woff" });

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={reactor7.className}>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}

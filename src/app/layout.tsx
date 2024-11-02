import "./globals.css";
import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import localFont from "next/font/local";
import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";
import { isMobile } from "@/utils/device";

export const metadata: Metadata = {
  title: "Savepoint",
  description: "A build management system for FFVII",
};

const reactor7 = localFont({ src: "../../public/font/Reactor7.woff" });

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const userAgent = headers().get("user-agent") || "";
  const mobileCheck = isMobile(userAgent);

  const supabase = createClient();
  const { data, error } = await supabase.auth.getUser();
  return (
    <html lang="en">
      <body className={reactor7.className}>
        <Header user={data.user} isMobile={mobileCheck} />
        <main>{children}</main>
        <Footer user={data.user} />
      </body>
    </html>
  );
}

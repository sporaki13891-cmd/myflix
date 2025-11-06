import "./globals.css";
import { Roboto } from "next/font/google";
import type { Metadata, Viewport } from "next";
import ScrollManager from "../components/ScrollManager";
import ClientLayout from "./ClientLayout";
import SessionProviderWrapper from "./SessionProviderWrapper";

const roboto = Roboto({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-roboto",
});

export const metadata: Metadata = {
  title: "MyFlix",
  description: "A sleek Netflix-style streaming UI built with Next.js",
};

export const viewport: Viewport = {
  themeColor: "#000",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="el" className={roboto.variable} suppressHydrationWarning>
      <body className="bg-black text-white antialiased">
        <ScrollManager />

        {/* ✅ FIX: ΠΡΩΤΑ SessionProvider */}
        <SessionProviderWrapper>
          {/* ✅ ΜΕΤΑ ClientLayout */}
          <ClientLayout>{children}</ClientLayout>
        </SessionProviderWrapper>

      </body>
    </html>
  );
}

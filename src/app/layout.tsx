import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import QueryProvider from "@/components/providers/QueryProvider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MatSearch AI — Materials & Metallurgical Engineering Platform",
  description:
    "Autonomous Agentic AI platform for Materials & Metallurgical Engineering research, candidate screening, and crystallographic analysis via Materials Project.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable} dark h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#0B0F12] text-[#F1F5F9] selection:bg-[#00E5FF] selection:text-[#0B0F12]">
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}

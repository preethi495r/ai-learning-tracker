import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import { SupportFooter } from "@/components/SupportFooter";

export const metadata: Metadata = {
  title: "AI Engineering Tracker",
  description: "A guided, git-tracked path to becoming an AI Engineer — lesson by lesson.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body>
        {children}
        <SupportFooter />
      </body>
    </html>
  );
}

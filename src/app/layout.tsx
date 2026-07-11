import type { Metadata } from "next";
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
    <html lang="en">
      <body>
        {children}
        <SupportFooter />
      </body>
    </html>
  );
}

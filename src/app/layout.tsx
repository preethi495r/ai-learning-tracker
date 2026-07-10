import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Learning Tracker",
  description: "Track your AI engineering journey, lesson by lesson.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

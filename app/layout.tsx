import type { Metadata } from "next";
import "./globals.css";
import "./goodbot/goodbot.css";

export const metadata: Metadata = {
  title: "Good Business | AI Venture Studio",
  description:
    "AI venture studio and rapid product development firm for founders, operators, and business owners."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

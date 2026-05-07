import type { Metadata } from "next";
import "./globals.css";
import "./goodbot/goodbot.css";

export const metadata: Metadata = {
  title: "Good Business HQ | AI Software for Business Problems",
  description:
    "Good Business HQ helps business owners, operators, and founders turn business problems into working AI-powered software."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

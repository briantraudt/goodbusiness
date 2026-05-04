import type { Metadata } from "next";
import "./globals.css";
import "./goodbot/goodbot.css";

export const metadata: Metadata = {
  title: "GoodBot | Good Business",
  description: "An autonomous outcome engine for getting users for your web app."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

import type { Metadata } from "next";
import "./globals.css";
import "./goodbot/goodbot.css";

export const metadata: Metadata = {
  title: "Good Business — AI software consultancy for SMB owners",
  description:
    "Good Business helps SMB owners use AI to streamline operations, automate the slow parts, and ship the software that moves the needle. Start with a no‑risk trial.",
  metadataBase: new URL("https://goodbusinesshq.com"),
  openGraph: {
    title: "Good Business — AI software consultancy for SMB owners",
    description:
      "Two‑week, no‑risk trials. We pick the leak, ship the fix, hand it back. You don't pay unless it earns its keep.",
    url: "https://goodbusinesshq.com",
    siteName: "Good Business",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Good Business — AI software consultancy",
    description:
      "Two‑week, no‑risk trials. We pick the leak, ship the fix, hand it back."
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico" }
    ],
    apple: "/apple-touch-icon.png"
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600;700&family=Geist+Mono:wght@400;500&family=Instrument+Serif:ital@0;1&display=swap"
          rel="stylesheet"
        />
        <meta name="theme-color" content="#F5F4EE" />
      </head>
      <body>{children}</body>
    </html>
  );
}

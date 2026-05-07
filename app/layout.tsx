import type { Metadata } from "next";
import "./globals.css";
import "./goodbot/goodbot.css";

export const metadata: Metadata = {
  title: "Good Business HQ | AI, Automation, and Better Operations",
  description:
    "Good Business HQ helps owners and operators reduce manual work, speed up workflows, and improve profitability with AI, automation, and modern tools."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

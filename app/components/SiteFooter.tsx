import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div>
        <Link className="footer-brand" href="/">
          Good Business HQ
        </Link>
        <p>AI, automation, and modern tools for better business operations.</p>
      </div>
      <div className="footer-links">
        <Link href="/#what-we-build">What We Fix</Link>
        <Link href="/#process">Process</Link>
        <Link href="/#services">Services</Link>
        <Link href="/about">About</Link>
        <Link href="/contact">Contact</Link>
      </div>
    </footer>
  );
}

import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div>
        <Link className="footer-brand" href="/">
          Good Business
        </Link>
        <p>AI venture studio for founders, operators, and business owners.</p>
      </div>
      <div className="footer-links">
        <Link href="/#services">Services</Link>
        <Link href="/#process">Process</Link>
        <Link href="/portfolio">Portfolio</Link>
        <Link href="/about">About</Link>
        <Link href="/contact">Contact</Link>
      </div>
    </footer>
  );
}

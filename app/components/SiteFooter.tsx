import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div>
        <Link className="footer-brand" href="/">
          Good Business
        </Link>
        <p>goodbusinesshq.com</p>
      </div>
      <div className="footer-links">
        <Link href="/#what-we-build">What We Do</Link>
        <Link href="/#process">How We Work</Link>
        <Link href="/#services">Services</Link>
        <Link href="/about">About</Link>
        <Link href="/contact">Contact</Link>
      </div>
    </footer>
  );
}

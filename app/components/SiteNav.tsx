import Link from "next/link";

export function SiteNav() {
  return (
    <header className="site-nav">
      <Link className="brand" href="/">
        Good Business HQ
      </Link>
      <nav aria-label="Primary navigation">
        <Link href="/#what-we-build">What We Build</Link>
        <Link href="/#process">Process</Link>
        <Link href="/#services">Services</Link>
        <Link href="/about">About</Link>
        <Link href="/contact">Contact</Link>
      </nav>
      <Link className="nav-cta" href="/contact">
        Book a Strategy Call
      </Link>
    </header>
  );
}

import Link from "next/link";

export function SiteNav() {
  return (
    <header className="site-nav">
      <Link className="brand" href="/">
        Good Business
      </Link>
      <nav aria-label="Primary navigation">
        <Link href="/">Home</Link>
        <Link href="/#services">Services</Link>
        <Link href="/#process">Process</Link>
        <Link href="/portfolio">Portfolio</Link>
        <Link href="/about">About</Link>
        <Link href="/contact">Contact</Link>
      </nav>
      <Link className="nav-cta" href="/contact">
        Book Strategy Call
      </Link>
    </header>
  );
}

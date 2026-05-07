import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function SiteNav() {
  return (
    <header className="site-nav">
      <Link className="brand" href="/">
        Good Business
      </Link>
      <nav aria-label="Primary navigation">
        <Link href="/#what-we-build">What We Do</Link>
        <Link href="/#process">How We Work</Link>
        <Link href="/#services">Services</Link>
        <Link href="/about">About</Link>
        <Link href="/contact">Contact</Link>
      </nav>
      <Link className="nav-cta" href="/contact">
        Book a Strategy Call <ArrowRight aria-hidden="true" size={15} />
      </Link>
    </header>
  );
}

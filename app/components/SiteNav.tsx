import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function SiteNav() {
  return (
    <header className="site-nav">
      <Link className="brand" href="/">
        Good Business
      </Link>
      <nav aria-label="Primary navigation">
        <Link href="/#outcomes">Outcomes</Link>
        <Link href="/#process">Process</Link>
        <Link href="/contact">Contact</Link>
      </nav>
      <Link className="nav-cta" href="/contact">
        Book a Call <ArrowRight aria-hidden="true" size={15} />
      </Link>
    </header>
  );
}

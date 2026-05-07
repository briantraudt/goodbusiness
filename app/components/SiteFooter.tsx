import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div>
        <Link className="footer-brand" href="/">
          Good Business
        </Link>
        <p>goodbusinesshq.com</p>
      </div>
      <p className="footer-line">Practical systems. Measurable outcomes.</p>
      <div className="footer-links">
        <Link className="footer-cta" href="/contact">
          Book a Strategy Call <ArrowRight aria-hidden="true" size={15} />
        </Link>
      </div>
    </footer>
  );
}

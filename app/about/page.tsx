import Link from "next/link";
import { SiteFooter } from "../components/SiteFooter";
import { SiteNav } from "../components/SiteNav";

export const metadata = {
  title: "About | Good Business",
  description: "Good Business is an AI venture studio and rapid product development firm."
};

export default function AboutPage() {
  return (
    <main className="marketing-page">
      <SiteNav />
      <section className="page-hero about-hero">
        <p className="eyebrow">About</p>
        <h1>Built for owners who need working software, not a long innovation project.</h1>
        <p>
          Good Business is led by Brian Traudt, a founder, operator, and builder focused on turning
          clear business problems into usable AI-powered products.
        </p>
      </section>
      <section className="operator-section">
        <div>
          <p className="eyebrow">Founder-led</p>
          <h2>Operator first. Builder second. Strategy tied to execution.</h2>
        </div>
        <div className="operator-copy">
          <p>
            Brian has worked inside startups, led operating teams, built products from scratch, and
            been through the company sale process. That background shapes how Good Business works:
            understand the business model, find the highest-value opportunity, build the smallest
            useful version, and learn from real usage.
          </p>
          <p>
            The work is practical by design. No theater. No generic AI roadmap. The goal is to help
            business owners move faster with software that fits how the business actually runs.
          </p>
        </div>
      </section>
      <section className="proof-strip">
        {[
          "Startup experience",
          "Company sale history",
          "Operational leadership",
          "Rapid prototyping",
          "AI-first workflows",
          "Business model thinking"
        ].map((item) => (
          <span key={item}>{item}</span>
        ))}
      </section>
      <section className="final-cta slim">
        <h2>Have a product idea or workflow problem?</h2>
        <Link className="button button-dark" href="/contact">
          Book Strategy Call
        </Link>
      </section>
      <SiteFooter />
    </main>
  );
}

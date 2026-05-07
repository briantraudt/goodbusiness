import Link from "next/link";
import { SiteFooter } from "../components/SiteFooter";
import { SiteNav } from "../components/SiteNav";

export const metadata = {
  title: "About | Good Business",
  description: "Good Business helps businesses reduce waste, speed up work, and improve profit."
};

export default function AboutPage() {
  return (
    <main className="marketing-page">
      <SiteNav />
      <section className="page-hero about-hero">
        <p className="eyebrow">About</p>
        <h1>Built for owners who want the business to run better.</h1>
        <p>
          Good Business is led by Brian Traudt, a founder, operator, and builder focused on
          using automation, practical tools, and clear systems to reduce waste and improve operations.
        </p>
      </section>
      <section className="operator-section">
        <div>
          <p className="eyebrow">Founder-led</p>
          <h2>Operator first. Builder second. Strategy tied to execution.</h2>
        </div>
        <div className="operator-copy">
          <p>
            Brian has worked inside growing companies, led operating teams, built products from
            scratch, and been through the company sale process. That background shapes how Good
            Business works: understand the business model, find the highest-value opportunity, build
            the smallest useful version, and learn from real usage.
          </p>
          <p>
            The work is practical by design. No theater. No generic roadmap. The goal is to help
            business owners move faster with systems that fit how the business actually runs.
          </p>
        </div>
      </section>
      <section className="proof-strip">
        {[
          "Builder experience",
          "Company sale history",
          "Operational leadership",
          "Rapid prototyping",
          "Modern workflows",
          "Business model thinking"
        ].map((item) => (
          <span key={item}>{item}</span>
        ))}
      </section>
      <section className="final-cta slim">
        <h2>Have a workflow slowing the business down?</h2>
        <Link className="button button-dark" href="/contact">
          Book a Strategy Call
        </Link>
      </section>
      <SiteFooter />
    </main>
  );
}

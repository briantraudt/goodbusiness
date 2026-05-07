import {
  ArrowRight,
  BriefcaseBusiness,
  Building2,
  Factory,
  HeartPulse,
  Home as HomeIcon,
  HousePlus,
  MapPinned,
  Package,
  PanelsTopLeft,
  Store,
  UsersRound,
} from "lucide-react";
import Link from "next/link";
import { SiteFooter } from "./components/SiteFooter";
import { SiteNav } from "./components/SiteNav";

const industries = [
  {
    icon: BriefcaseBusiness,
    title: "Professional Services",
    pain: "Manual workflows, repeated admin, operational bottlenecks."
  },
  {
    icon: HomeIcon,
    title: "Home Services",
    pain: "Slow quoting, scattered intake, missed follow-up."
  },
  {
    icon: HeartPulse,
    title: "Healthcare & Wellness",
    pain: "Messy scheduling, repeated questions, staff drag."
  },
  {
    icon: Building2,
    title: "Real Estate",
    pain: "Lead follow-up, document flow, scattered deal context."
  },
  {
    icon: Store,
    title: "Ecommerce",
    pain: "Support volume, ops cleanup, fulfillment blind spots."
  },
  {
    icon: UsersRound,
    title: "Consulting & Coaching",
    pain: "Expertise trapped in calls, docs, and custom delivery."
  },
  {
    icon: Factory,
    title: "Trades & Manufacturing",
    pain: "Quoting delays, job tracking, handoff problems."
  },
  {
    icon: PanelsTopLeft,
    title: "Agencies",
    pain: "Too much custom work and not enough systems."
  },
  {
    icon: HousePlus,
    title: "Franchises",
    pain: "Inconsistent processes across teams and locations."
  },
  {
    icon: MapPinned,
    title: "Multi-location Businesses",
    pain: "No clean view of what is happening where."
  },
  {
    icon: Package,
    title: "Service Businesses",
    pain: "Manual intake, dispatch, follow-up, and reporting."
  },
  {
    icon: UsersRound,
    title: "Founder-Led Companies",
    pain: "The owner is still holding too many processes together."
  }
];

function IndustriesSection() {
  return (
    <section className="industries-section" id="industries">
      <div className="section-kicker">Industries</div>
      <div className="industries-head">
        <h2>Built for Businesses with Operational Complexity</h2>
        <p>Teams with real work, real customers, and expensive drag hiding in the process.</p>
      </div>
      <div className="industry-grid">
        {industries.map((item) => {
          const Icon = item.icon;
          return (
            <article className="industry-card" key={item.title}>
              <Icon aria-hidden="true" size={22} strokeWidth={1.7} />
              <h3>{item.title}</h3>
              <p>{item.pain}</p>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function PromiseSection() {
  return (
    <section className="promise-section" id="process">
      <div className="promise-block">
        <h2>
          You are not paying for hours.
          <br />
          You are paying for measurable business outcomes.
        </h2>
        <p>If we cannot identify a clear operational benefit, we do not recommend building it.</p>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <main className="minimal-home quiet-home">
      <SiteNav />

      <section className="quiet-hero" id="outcomes">
        <div className="quiet-hero-copy">
          <h1>Outcomes. Not Consultants.</h1>
          <p>
            We help businesses find operational inefficiencies, improve workflows, and use modern
            tools where they create measurable business results.
          </p>
          <p className="brand-promise">You pay for outcomes, not presentations.</p>
          <div className="hero-actions">
            <Link className="button button-dark" href="/contact">
              Book a Strategy Call <ArrowRight aria-hidden="true" size={17} />
            </Link>
            <Link className="button button-light" href="#process">
              Our Promise <ArrowRight aria-hidden="true" size={17} />
            </Link>
          </div>
        </div>

      </section>

      <IndustriesSection />
      <PromiseSection />

      <SiteFooter />
    </main>
  );
}

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
    title: "Professional Services"
  },
  {
    icon: HomeIcon,
    title: "Home Services"
  },
  {
    icon: HeartPulse,
    title: "Healthcare & Wellness"
  },
  {
    icon: Building2,
    title: "Real Estate"
  },
  {
    icon: Store,
    title: "Ecommerce"
  },
  {
    icon: UsersRound,
    title: "Consulting & Coaching"
  },
  {
    icon: Factory,
    title: "Trades & Manufacturing"
  },
  {
    icon: PanelsTopLeft,
    title: "Agencies"
  },
  {
    icon: HousePlus,
    title: "Franchises"
  },
  {
    icon: MapPinned,
    title: "Multi-location Businesses"
  },
  {
    icon: Package,
    title: "Service Businesses"
  },
  {
    icon: UsersRound,
    title: "Founder-Led Companies"
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
          <div className="hero-text-stack">
            <h1>Are You AI?</h1>
            <p>
              Successful companies are <strong>Always</strong> <strong>Innovating</strong>. We help
              find the operational drag, fix the work, and turn better systems into measurable
              results.
            </p>
            <p className="brand-promise">We provide outcomes, nothing else.</p>
          </div>
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

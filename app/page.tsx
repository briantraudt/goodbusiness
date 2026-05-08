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
      <div className="section-kicker">Where We Help</div>
      <div className="industries-head">
        <h2>For Businesses Where Work Gets Messy</h2>
        <p>Calls, quotes, intake, scheduling, reporting, follow-up. That is where money leaks.</p>
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
          Find the leak.
          <br />
          Fix the work.
          <br />
          Measure the result.
        </h2>
        <p>
          If we cannot point to saved time, lower cost, faster response, or more revenue, we do not
          recommend building it.
        </p>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <main className="minimal-home quiet-home">
      <SiteNav />

      <section className="quiet-hero" id="outcomes">
        <div className="hero-motion-image" aria-hidden="true">
          <span className="motion-panel motion-panel-a" />
          <span className="motion-panel motion-panel-b" />
          <span className="motion-panel motion-panel-c" />
          <span className="motion-line motion-line-a" />
          <span className="motion-line motion-line-b" />
          <span className="motion-line motion-line-c" />
          <span className="motion-node motion-node-a" />
          <span className="motion-node motion-node-b" />
          <span className="motion-node motion-node-c" />
        </div>
        <div className="quiet-hero-copy">
          <div className="hero-text-stack">
            <h1>Stop Losing Money to Slow Work.</h1>
            <p>
              We find the handoffs, admin, delays, and missed follow-up draining profit. Then we
              fix the workflow with practical systems, automation, and AI only where it helps.
            </p>
            <p className="brand-promise">No decks. No busywork. Just better operations.</p>
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

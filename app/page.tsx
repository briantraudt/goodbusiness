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

const outcomeMetrics = [
  ["Hours saved", "less manual work"],
  ["Faster response", "fewer missed leads"],
  ["Lower admin", "cleaner systems"],
  ["Revenue captured", "measured upside"]
];

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

const modelSteps = [
  {
    title: "Find the Leak",
    text: "Where time, money, or attention is being wasted."
  },
  {
    title: "Fix the Work",
    text: "Use better systems, automation, and AI where useful."
  },
  {
    title: "Measure the Result",
    text: "Time saved, costs reduced, revenue improved."
  }
];

function OutcomeSignal() {
  return (
    <div className="outcome-signal" aria-label="Measured business outcomes">
      <div className="signal-line" aria-hidden="true" />
      {outcomeMetrics.map(([label, detail], index) => (
        <article className={index === 3 ? "signal-card signal-card-accent" : "signal-card"} key={label}>
          <span>{label}</span>
          <p>{detail}</p>
        </article>
      ))}
    </div>
  );
}

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

function SimpleModel() {
  return (
    <section className="simple-model quiet-model" id="process">
      <div className="model-head">
        <p className="eyebrow">Process</p>
        <h2>The Model Is Simple</h2>
        <p>We only care about work that produces a measurable business result.</p>
      </div>

      <div className="simple-steps">
        {modelSteps.map((step, index) => (
          <article key={step.title}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <h3>{step.title}</h3>
            <p>{step.text}</p>
          </article>
        ))}
      </div>

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
              How It Works <ArrowRight aria-hidden="true" size={17} />
            </Link>
          </div>
        </div>

        <OutcomeSignal />
      </section>

      <IndustriesSection />
      <SimpleModel />

      <SiteFooter />
    </main>
  );
}

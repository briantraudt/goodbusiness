import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { SiteFooter } from "./components/SiteFooter";
import { SiteNav } from "./components/SiteNav";

const flowCards = [
  {
    label: "Problem",
    title: "Wasted time. Manual work. Missed revenue."
  },
  {
    label: "Solution",
    title: "Practical systems. Useful automation."
  },
  {
    label: "ROI",
    title: "Time saved. Costs reduced. Revenue captured."
  }
];

const metrics = ["Hours saved", "Costs reduced", "Revenue captured", "Faster response"];

const modelSteps = [
  {
    title: "Find the Leak",
    text: "Find where time, margin, leads, or labor are being wasted."
  },
  {
    title: "Fix the Work",
    text: "Rebuild the workflow with the simplest useful mix of process, tools, automation, and AI."
  },
  {
    title: "Measure the Outcome",
    text: "Track what changed: time saved, cost reduced, revenue gained, or speed improved."
  }
];

function OutcomeFlow() {
  return (
    <div className="minimal-flow" aria-label="Problem to solution to ROI">
      <div className="flow-line" aria-hidden="true" />
      <div className="flow-cards">
        {flowCards.map((card, index) => (
          <article className={`flow-card ${index === 1 ? "flow-card-dark" : ""} ${index === 2 ? "flow-card-roi" : ""}`} key={card.label}>
            <span>{card.label}</span>
            <h2>{card.title}</h2>
            {index < flowCards.length - 1 ? (
              <div className="flow-arrow" aria-hidden="true">
                <ArrowRight size={22} strokeWidth={1.7} />
              </div>
            ) : null}
          </article>
        ))}
      </div>
      <div className="metric-float" aria-label="Outcome metrics">
        {metrics.map((metric) => (
          <span key={metric}>{metric}</span>
        ))}
      </div>
    </div>
  );
}

function SimpleModel() {
  return (
    <section className="simple-model" id="process">
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
          You are paying for results.
        </h2>
        <p>If we cannot identify a clear business outcome, we do not build.</p>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <main className="minimal-home">
      <SiteNav />

      <section className="minimal-hero" id="outcomes">
        <div className="minimal-hero-copy">
          <p className="eyebrow">Good Business</p>
          <h1>Outcomes. Not Consultants.</h1>
          <p>
            We find the work slowing your business down, fix it with practical systems, and use AI
            where it helps increase revenue, reduce costs, or save time.
          </p>
          <div className="hero-actions">
            <Link className="button button-dark" href="/contact">
              Book a Strategy Call <ArrowRight aria-hidden="true" size={17} />
            </Link>
            <Link className="button button-light" href="#process">
              See the Model <ArrowRight aria-hidden="true" size={17} />
            </Link>
          </div>
        </div>

        <OutcomeFlow />
      </section>

      <SimpleModel />

      <SiteFooter />
    </main>
  );
}

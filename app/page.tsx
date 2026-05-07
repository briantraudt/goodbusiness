import {
  BarChart3,
  ClipboardList,
  Clock,
  HelpCircle,
  Inbox,
  Lightbulb,
  MessageSquare,
  MousePointerClick,
  Repeat2,
  Search,
  TimerReset,
  Workflow
} from "lucide-react";
import Link from "next/link";
import { SiteFooter } from "./components/SiteFooter";
import { SiteNav } from "./components/SiteNav";

const fixes = [
  {
    icon: Clock,
    title: "Slow Follow-Up",
    text: "Leads wait too long and disappear."
  },
  {
    icon: Repeat2,
    title: "Manual Admin",
    text: "People spend hours moving information around."
  },
  {
    icon: HelpCircle,
    title: "Repeated Questions",
    text: "Your team answers the same things every day."
  },
  {
    icon: Inbox,
    title: "Messy Intake",
    text: "Forms, emails, calls, and notes are scattered."
  },
  {
    icon: BarChart3,
    title: "No Clear Data",
    text: "You cannot see what is working."
  },
  {
    icon: Lightbulb,
    title: "Missed Opportunities",
    text: "Good ideas sit because nobody has time to build them."
  }
];

const tools = [
  "AI assistants",
  "workflow automation",
  "custom dashboards",
  "CRM cleanup",
  "forms and intake",
  "payment systems",
  "email systems",
  "lead capture",
  "internal tools",
  "knowledge bases",
  "reporting",
  "lightweight apps"
];

const roiExamples = [
  {
    title: "Service Business Intake",
    problem: "Calls, texts, and emails scattered.",
    fix: "Central intake, AI summary, automated follow-up.",
    value: "Fewer missed leads, faster response, less admin."
  },
  {
    title: "Quote Workflow",
    problem: "Quotes take too long.",
    fix: "Structured intake, pricing logic, draft proposal.",
    value: "Faster sales cycle, more quotes sent, less staff time."
  },
  {
    title: "Customer Support",
    problem: "Repeated questions consume staff time.",
    fix: "Trained AI assistant with escalation rules.",
    value: "Faster answers, fewer interruptions, better customer experience."
  },
  {
    title: "Owner Dashboard",
    problem: "The owner cannot see what is happening.",
    fix: "Key metrics dashboard with automated reporting.",
    value: "Better decisions, fewer surprises, cleaner operations."
  }
];

const steps = [
  ["Find the Money Leak", "Identify where time, leads, margin, or attention is being wasted."],
  ["Map the Workflow", "Understand how the business actually runs."],
  ["Build the System", "Use AI, automation, and modern tools to solve the problem."],
  ["Measure the Result", "Track time saved, speed gained, cost reduced, or revenue captured."]
];

const services = [
  {
    title: "Business AI Audit",
    text: "For owners who need to know where AI can actually improve the business.",
    items: ["workflow review", "bottleneck map", "ROI opportunities", "recommended build plan"]
  },
  {
    title: "Workflow Build Sprint",
    text: "For teams ready to fix a specific process.",
    items: ["intake/system design", "AI or automation setup", "dashboards/tools", "testing and rollout"]
  },
  {
    title: "AI Operating System",
    text: "For businesses that want connected systems across sales, operations, support, and reporting.",
    items: ["connected workflows", "AI assistants", "reporting", "integrations", "ongoing improvement"]
  }
];

const proof = [
  ["Operator mindset", "We start with how the business actually works."],
  ["Fast execution", "We move quickly from bottleneck to working system."],
  ["Profit-focused", "The work needs a clear business reason."],
  ["Practical systems", "Simple tools win when simple tools solve the problem."]
];

function SystemVisual() {
  return (
    <div className="system-visual" aria-label="Bottleneck to AI tool to faster workflow to measurable ROI">
      <div className="system-flow">
        {["Bottleneck", "AI Tool", "Faster Workflow", "Measurable ROI"].map((item, index) => (
          <div className="system-node" key={item}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <strong>{item}</strong>
          </div>
        ))}
      </div>
      <div className="metric-board">
        <div className="metric-card large">
          <span>Time saved</span>
          <strong>10 hrs/week</strong>
        </div>
        <div className="metric-card">
          <span>Lead response</span>
          <strong>5 min</strong>
        </div>
        <div className="metric-card">
          <span>Quote time</span>
          <strong>2 days → 20 min</strong>
        </div>
        <div className="metric-card">
          <span>Manual steps</span>
          <strong>Removed</strong>
        </div>
        <div className="metric-card">
          <span>Follow-ups</span>
          <strong>Automated</strong>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <main className="marketing-page">
      <SiteNav />
      <section className="hero outcome-hero">
        <div className="hero-copy">
          <p className="eyebrow">Good Business HQ</p>
          <h1>Use AI to Make the Business Run Better</h1>
          <p>
            We help owners and operators find expensive bottlenecks, replace manual work, and build
            practical systems that save time, increase profit, and make growth easier.
          </p>
          <div className="hero-actions">
            <Link className="button button-dark" href="/contact">
              Book a Strategy Call
            </Link>
            <Link className="button button-light" href="#process">
              See How We Work
            </Link>
          </div>
        </div>
        <SystemVisual />
      </section>

      <section className="section compact-section" id="what-we-build">
        <div className="section-heading compact-heading">
          <p className="eyebrow">What we fix</p>
          <h2>Where Businesses Lose Money</h2>
        </div>
        <div className="fix-grid">
          {fixes.map((item) => {
            const Icon = item.icon;
            return (
              <article className="fix-card" key={item.title}>
                <Icon aria-hidden="true" size={22} strokeWidth={1.8} />
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="improve-section">
        <div className="section-heading compact-heading">
          <p className="eyebrow">What we improve</p>
          <h2>Better Systems. Better Margins.</h2>
        </div>
        <div className="before-after">
          <article>
            <span>Before</span>
            {["manual work", "slow response", "scattered data", "disconnected tools", "unclear ROI"].map(
              (item) => (
                <strong key={item}>{item}</strong>
              )
            )}
          </article>
          <article className="after">
            <span>After</span>
            {["automated workflows", "faster response", "cleaner systems", "connected tools", "measurable savings"].map(
              (item) => (
                <strong key={item}>{item}</strong>
              )
            )}
          </article>
        </div>
      </section>

      <section className="tools-section">
        <div className="section-heading compact-heading">
          <p className="eyebrow">Tools we use</p>
          <h2>Modern Tools. Practical Outcomes.</h2>
        </div>
        <div className="tool-cloud">
          {tools.map((tool) => (
            <span key={tool}>{tool}</span>
          ))}
        </div>
      </section>

      <section className="roi-section">
        <div className="section-heading compact-heading">
          <p className="eyebrow">ROI examples</p>
          <h2>The Work Has to Pay for Itself</h2>
        </div>
        <div className="roi-grid">
          {roiExamples.map((item) => (
            <article className="roi-card" key={item.title}>
              <p>Example scenario</p>
              <h3>{item.title}</h3>
              <dl>
                <div>
                  <dt>Problem</dt>
                  <dd>{item.problem}</dd>
                </div>
                <div>
                  <dt>Fix</dt>
                  <dd>{item.fix}</dd>
                </div>
                <div>
                  <dt>Potential value</dt>
                  <dd>{item.value}</dd>
                </div>
              </dl>
            </article>
          ))}
        </div>
      </section>

      <section className="process-section" id="process">
        <div className="section-heading compact-heading">
          <p className="eyebrow">Process</p>
          <h2>Fast, But Not Random</h2>
        </div>
        <div className="timeline">
          {steps.map(([title, text], index) => (
            <article key={title}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="models-section" id="services">
        <div className="section-heading compact-heading">
          <p className="eyebrow">Services</p>
          <h2>Ways We Help</h2>
        </div>
        <div className="model-grid">
          {services.map((service) => (
            <article className="model-card" key={service.title}>
              <h3>{service.title}</h3>
              <p>{service.text}</p>
              <ul>
                {service.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="why-section">
        <div>
          <p className="eyebrow">Why Good Business HQ</p>
          <h2>Business First. Tools Second.</h2>
        </div>
        <div className="why-copy">
          <p>
            We are not here to sell AI experiments. We look for practical ways to save time, reduce
            waste, increase speed, and improve profitability. If a simple tool solves the problem, we
            use the simple tool. If AI helps, we use AI.
          </p>
          <div className="proof-grid proof-cards">
            {proof.map(([title, text]) => (
              <span key={title}>
                <strong>{title}</strong>
                {text}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="final-cta">
        <h2>Fix the Work That Is Slowing the Business Down</h2>
        <p>Bring us the bottleneck. We will help find the simplest profitable way to solve it.</p>
        <Link className="button button-dark" href="/contact">
          Book a Strategy Call
        </Link>
      </section>
      <SiteFooter />
    </main>
  );
}

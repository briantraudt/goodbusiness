import {
  AlertCircle,
  ArrowRight,
  BarChart3,
  Briefcase,
  Building2,
  CheckCircle2,
  Clock,
  DollarSign,
  HeartPulse,
  House,
  HelpCircle,
  Inbox,
  Lightbulb,
  Repeat2,
  Settings,
  ShoppingCart,
  Sparkles,
  TrendingUp,
  UserRound,
  X,
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
  "smart assistants",
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
    fix: "Central intake, clean summary, automated follow-up.",
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
    fix: "Answer assistant with escalation rules.",
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
  ["Build the System", "Use the right tools to remove the drag."],
  ["Measure the Result", "Track time saved, speed gained, cost reduced, or revenue captured."]
];

const services = [
  {
    title: "Operations Audit",
    text: "For owners who need to know where the business is wasting time or money.",
    items: ["workflow review", "bottleneck map", "ROI opportunities", "recommended build plan"]
  },
  {
    title: "Workflow Build Sprint",
    text: "For teams ready to fix a specific process.",
    items: ["intake/system design", "automation setup", "dashboards/tools", "testing and rollout"]
  },
  {
    title: "Connected Operating System",
    text: "For businesses that want connected systems across sales, operations, support, and reporting.",
    items: ["connected workflows", "assistants", "reporting", "integrations", "ongoing improvement"]
  }
];

const proof = [
  ["Operator mindset", "We start with how the business actually works."],
  ["Fast execution", "We move quickly from bottleneck to working system."],
  ["Profit-focused", "The work needs a clear business reason."],
  ["Practical systems", "Simple tools win when simple tools solve the problem."]
];

const operatorMarkets = [
  { icon: Briefcase, label: "Professional Services" },
  { icon: House, label: "Home Services" },
  { icon: HeartPulse, label: "Health & Wellness" },
  { icon: ShoppingCart, label: "Ecommerce" },
  { icon: Building2, label: "Real Estate" },
  { icon: UserRound, label: "Consulting & Coaching" },
  { icon: Settings, label: "Manufacturing & Trades" }
];

function SystemVisual() {
  const workflow = [
    {
      title: "Bottleneck",
      label: "Manual Quote Process",
      icon: AlertCircle,
      items: ["Multiple tools", "Re-entering data", "Back and forth", "Slow responses"]
    },
    {
      title: "System",
      label: "Workflow +\u00a0Automation",
      icon: Sparkles,
      items: ["Intake captured", "AI builds draft", "Auto follow-up", "Team notified"]
    },
    {
      title: "Outcome",
      label: "Faster Process. Better Results.",
      icon: CheckCircle2,
      items: ["Quotes in minutes", "Fewer errors", "Happier customers", "More revenue"]
    }
  ];

  const metrics = [
    { icon: Clock, label: "Time Saved", value: "10+", detail: "Hrs / Week" },
    { icon: DollarSign, label: "Est. Value", value: "$18K+", detail: "/ Month" },
    { icon: TrendingUp, label: "Quote Speed", value: "2 Days", detail: "to 20 Min" },
    { icon: UserRound, label: "Follow-Up", value: "100%", detail: "Automated" }
  ];

  return (
    <div className="hero-ops-map" aria-label="Business bottleneck to system to measurable outcome">
      <div className="ops-diagram">
        <div className="ops-flow">
        {workflow.map((card, index) => (
          <div className="ops-step" key={card.title}>
            <article className={`ops-card ${index === 1 ? "ops-card-dark" : ""} ${index === 2 ? "ops-card-outcome" : ""}`}>
              <div className="ops-card-icon" aria-hidden="true">
                <card.icon size={22} strokeWidth={1.9} />
              </div>
              <p>{card.title}</p>
              <h2>{card.label}</h2>
              <ul>
                {card.items.map((item) => (
                  <li key={item}>
                    {index === 0 ? <X aria-hidden="true" size={12} strokeWidth={2.4} /> : null}
                    {index === 1 ? <CheckCircle2 aria-hidden="true" size={13} strokeWidth={2.1} /> : null}
                    {index === 2 ? <CheckCircle2 aria-hidden="true" size={13} strokeWidth={2.1} /> : null}
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </article>
            {index < workflow.length - 1 ? (
              <div className={`ops-arrow ${index === 0 ? "ops-arrow-warm" : ""}`} aria-hidden="true">
                <span />
                <ArrowRight size={24} strokeWidth={1.7} />
              </div>
            ) : null}
          </div>
        ))}
        </div>
        <div className="roi-path" aria-hidden="true">
          <span className="roi-path-left" />
          <span className="roi-path-base" />
          <span className="roi-path-right" />
          <strong>Measurable ROI</strong>
        </div>
      </div>
      <div className="metric-rail" aria-hidden="true" />
      <div className="ops-metrics">
        {metrics.map((metric) => (
          <div className="ops-metric" key={metric.label}>
            <div>
              <metric.icon aria-hidden="true" size={19} strokeWidth={1.9} />
              <span>{metric.label}</span>
            </div>
            <strong>{metric.value}</strong>
            <small>{metric.detail}</small>
          </div>
        ))}
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
          <p className="eyebrow">Good Business</p>
          <h1>Fix Bottlenecks. Improve Profitability.</h1>
          <p>
            Good Business helps owners and operators reduce manual work, improve workflows, and
            build practical systems that create measurable business outcomes.
          </p>
          <div className="hero-actions">
            <Link className="button button-dark" href="/contact">
              Book a Strategy Call <ArrowRight aria-hidden="true" size={17} />
            </Link>
            <Link className="button button-light" href="#process">
              See How We Work <ArrowRight aria-hidden="true" size={17} />
            </Link>
          </div>
        </div>
        <SystemVisual />
      </section>

      <section className="operator-strip" aria-label="Industries served">
        <p>Trusted by operators in</p>
        <div>
          {operatorMarkets.map((market) => {
            const Icon = market.icon;
            return (
              <span key={market.label}>
                <Icon aria-hidden="true" size={22} strokeWidth={1.8} />
                {market.label}
              </span>
            );
          })}
        </div>
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
                <div className="fix-icon">
                  <Icon aria-hidden="true" size={30} strokeWidth={1.7} />
                </div>
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
          <p className="eyebrow">Why Good Business</p>
          <h2>Business First. Tools Second.</h2>
        </div>
        <div className="why-copy">
          <p>
            We are not here to sell experiments. We look for practical ways to save time, reduce
            waste, increase speed, and improve profitability. If a simple tool solves the problem, we
            use the simple tool. When automation or AI makes sense, we use it.
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

import Link from "next/link";
import { SiteFooter } from "./components/SiteFooter";
import { SiteNav } from "./components/SiteNav";

const problems = [
  ["Manual workflows", "Work still depends on spreadsheets, inboxes, and repeated handoffs."],
  ["Repetitive customer questions", "Your team answers the same questions instead of moving work forward."],
  ["Trapped internal knowledge", "Important expertise lives in people’s heads, notes, and scattered files."],
  ["No technical team", "The product idea is clear, but the build keeps getting delayed."]
];

const buildTypes = [
  ["Internal AI tools", "Private tools for research, admin, reporting, intake, and daily operations."],
  ["Customer-facing AI assistants", "Useful assistants that answer, guide, qualify, or support customers."],
  ["Workflow automation systems", "Software that moves work between people, tools, data, and decisions."],
  ["SaaS MVPs", "Working first versions with accounts, core flows, and launch-ready infrastructure."],
  ["Client portals", "Secure places for clients to submit, approve, track, and manage work."],
  ["Knowledge-base chat systems", "Chat experiences trained around your documents, policies, and expertise."],
  ["Lead generation tools", "Qualification, intake, follow-up, and routing systems for sales teams."],
  ["Subscription products", "Products with payments, access control, customer accounts, and admin tools."],
  ["Custom dashboards", "Operational views that show the numbers, tasks, and signals that matter."],
  ["AI onboarding flows", "Guided flows that collect context and move users toward the right next step."]
];

const audiences = [
  {
    title: "Business Owners",
    text: "You see the opportunity but need help turning it into a real product or system."
  },
  {
    title: "Operators",
    text: "You know where the work is breaking and need software that fixes it."
  },
  {
    title: "Founders",
    text: "You have the idea, market, or domain expertise, but not the full product team."
  }
];

const steps = [
  ["Diagnose", "Find the highest-value business problem or product opportunity."],
  ["Design", "Map the workflow, user experience, data, and business model."],
  ["Build", "Rapidly develop the product using modern AI-assisted development."],
  ["Launch", "Deploy, test, refine, and prepare for real-world use."]
];

const models = [
  {
    title: "AI Opportunity Audit",
    text: "For owners who need clarity on what AI should actually do in their business.",
    items: [
      "Workflow audit",
      "Product opportunity map",
      "Recommended build roadmap",
      "Prioritized automation and product ideas"
    ]
  },
  {
    title: "AI MVP Sprint",
    text: "For founders and businesses ready to build.",
    items: [
      "Product scope",
      "UX/UI",
      "Working MVP",
      "AI integration",
      "Database and backend setup",
      "Launch-ready deployment"
    ]
  },
  {
    title: "AI Systems Buildout",
    text: "For companies ready to automate or productize a major workflow.",
    items: [
      "Custom AI workflow system",
      "Internal tools",
      "Integrations",
      "Analytics",
      "Iteration support",
      "Launch and growth support"
    ]
  }
];

const examples = [
  {
    title: "AI intake assistant for a law firm",
    problem: "New matters arrive with missing details.",
    build: "A guided intake assistant that collects context and routes the request.",
    value: "Cleaner handoffs and faster first review."
  },
  {
    title: "Customer support knowledge bot",
    problem: "A service team answers the same questions all day.",
    build: "A support assistant connected to approved company knowledge.",
    value: "Fewer repeated replies and faster customer answers."
  },
  {
    title: "Internal quoting tool for a contractor",
    problem: "Quotes depend on manual pricing and tribal knowledge.",
    build: "A quoting workflow with rules, data, and review steps.",
    value: "More consistent estimates and less admin time."
  },
  {
    title: "Lead qualification assistant",
    problem: "Good leads get mixed with low-fit inquiries.",
    build: "An intake flow that scores, summarizes, and routes leads.",
    value: "Better sales focus and faster follow-up."
  },
  {
    title: "AI training portal for a consulting firm",
    problem: "Expertise is hard to package and deliver repeatedly.",
    build: "A training portal with lessons, prompts, resources, and progress.",
    value: "A repeatable product built from existing expertise."
  },
  {
    title: "Subscription product for a niche expert",
    problem: "Knowledge is valuable but trapped in one-to-one delivery.",
    build: "A paid product with accounts, content, tools, and AI guidance.",
    value: "A scalable offer beyond consulting hours."
  },
  {
    title: "Operations dashboard for a service business",
    problem: "Work status is spread across tools and people.",
    build: "A dashboard that tracks jobs, tasks, bottlenecks, and follow-up.",
    value: "Clearer decisions and fewer missed steps."
  },
  {
    title: "AI workflow engine for an agency",
    problem: "Client work requires repeated research, drafts, and approvals.",
    build: "A workflow system that standardizes inputs, drafts, and reviews.",
    value: "More output without lowering quality."
  }
];

function WorkflowVisual() {
  return (
    <div className="workflow-visual" aria-label="Workflow to AI system to business outcome">
      <div className="workflow-panel">
        <span>Workflow</span>
        <strong>Intake</strong>
        <p>Manual steps, scattered inputs, repeated work.</p>
      </div>
      <div className="workflow-arrow" />
      <div className="workflow-panel dark">
        <span>AI System</span>
        <strong>Build</strong>
        <p>Rules, data, interface, automation, handoffs.</p>
      </div>
      <div className="workflow-arrow" />
      <div className="workflow-panel">
        <span>Outcome</span>
        <strong>Use</strong>
        <p>Faster work, cleaner decisions, usable software.</p>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <main className="marketing-page">
      <SiteNav />
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">Good Business HQ</p>
          <h1>Turn Your Business Problem Into AI Software</h1>
          <p>
            Good Business HQ helps business owners, operators, and founders turn workflows,
            expertise, and ideas into working AI-powered products and systems.
          </p>
          <div className="hero-actions">
            <Link className="button button-dark" href="/contact">
              Book a Strategy Call
            </Link>
            <Link className="button button-light" href="#what-we-build">
              See What We Build
            </Link>
          </div>
        </div>
        <WorkflowVisual />
      </section>

      <section className="problem-section">
        <div className="section-heading">
          <p className="eyebrow">The problem</p>
          <h2>Most Businesses Don&apos;t Need “AI Strategy.” They Need Something Built.</h2>
          <p>
            Your business has repetitive work, buried knowledge, manual processes, customer friction,
            or an idea that keeps getting delayed. We help identify the highest-value opportunity and
            turn it into usable software.
          </p>
        </div>
        <div className="problem-grid">
          {problems.map(([title, text]) => (
            <article className="service-card" key={title}>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section" id="what-we-build">
        <div className="section-heading">
          <p className="eyebrow">What we build</p>
          <h2>Practical AI Software for Real Business Problems</h2>
        </div>
        <div className="service-grid">
          {buildTypes.map(([title, text]) => (
            <article className="service-card" key={title}>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="audience-section">
        <div className="audience-heading">
          <p className="eyebrow">Who it is for</p>
          <h2>Built for Operators, Not Committees</h2>
        </div>
        {audiences.map((item) => (
          <article key={item.title}>
            <h2>{item.title}</h2>
            <p>{item.text}</p>
          </article>
        ))}
      </section>

      <section className="process-section" id="process">
        <div className="section-heading">
          <p className="eyebrow">Process</p>
          <h2>From Clarity to Working Software</h2>
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
        <div className="section-heading">
          <p className="eyebrow">Services</p>
          <h2>Engagements</h2>
        </div>
        <div className="model-grid">
          {models.map((model) => (
            <article className="model-card" key={model.title}>
              <h3>{model.title}</h3>
              <p>{model.text}</p>
              <ul>
                {model.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="examples-section">
        <div className="section-heading">
          <p className="eyebrow">Example build types</p>
          <h2>Examples of What We Can Build</h2>
        </div>
        <div className="example-grid">
          {examples.map((example) => (
            <article className="example-card" key={example.title}>
              <h3>{example.title}</h3>
              <dl>
                <div>
                  <dt>Problem</dt>
                  <dd>{example.problem}</dd>
                </div>
                <div>
                  <dt>Build</dt>
                  <dd>{example.build}</dd>
                </div>
                <div>
                  <dt>Business value</dt>
                  <dd>{example.value}</dd>
                </div>
              </dl>
            </article>
          ))}
        </div>
      </section>

      <section className="why-section">
        <div>
          <p className="eyebrow">Why Good Business HQ</p>
          <h2>Business-First. AI-Enabled. Built Fast.</h2>
        </div>
        <div className="why-copy">
          <p>
            We connect strategy, product, and launch. The work starts with the business model and
            the workflow, then moves quickly into a usable build. Not just code. Not just consulting.
          </p>
          <div className="proof-grid">
            {[
              "Business model thinking",
              "Startup and operator experience",
              "Fast prototyping",
              "Modern AI development workflows",
              "Practical execution",
              "Launch-minded product work"
            ].map((point) => (
              <span key={point}>{point}</span>
            ))}
          </div>
        </div>
      </section>

      <section className="final-cta">
        <h2>Stop Talking About AI. Build the Thing.</h2>
        <p>
          If there is a workflow, idea, or business problem you know should become software, Good
          Business HQ can help you shape it and ship it.
        </p>
        <Link className="button button-dark" href="/contact">
          Book a Strategy Call
        </Link>
      </section>
      <SiteFooter />
    </main>
  );
}

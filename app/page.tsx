import Link from "next/link";
import { SiteFooter } from "./components/SiteFooter";
import { SiteNav } from "./components/SiteNav";

const audiences = [
  {
    title: "For founders",
    text: "You have an idea but no technical team."
  },
  {
    title: "For SMB owners",
    text: "You know AI matters but do not know what to build."
  },
  {
    title: "For operators",
    text: "You want to automate, productize, or scale workflows."
  }
];

const services = [
  ["AI SaaS Products", "New products with accounts, payments, dashboards, and AI features."],
  ["Internal AI Tools", "Private tools for research, intake, reporting, support, and admin work."],
  ["AI Automations", "Systems that move work between apps, people, data, and decisions."],
  ["Customer Portals", "Secure places for clients to submit, track, approve, and manage work."],
  ["AI Chat Interfaces", "Useful assistants built around your data, workflows, and customer needs."],
  ["Workflow Systems", "Operational software that replaces spreadsheets, email chains, and manual steps."],
  ["MVP Development", "A working first version built to test demand and learn from real users."],
  ["Product Strategy", "Clear scope, business model, user flow, and build plan before code starts."],
  ["Go-To-Market Systems", "Landing pages, lead flows, onboarding, feedback loops, and analytics."],
  ["Subscription Platforms", "Products with pricing, billing, access control, and customer accounts."]
];

const steps = [
  ["Strategy", "We identify the highest-value opportunity."],
  ["Validation", "We refine the product, workflow, and business model."],
  ["Build", "We rapidly develop the MVP using modern AI-assisted workflows."],
  ["Launch", "We deploy, iterate, and help drive initial traction."]
];

const projects = [
  {
    name: "SideStage",
    type: "Event platform",
    problem: "Live event discovery is scattered.",
    solution: "A cleaner way to find, follow, and manage local shows.",
    angle: "Structured event data, discovery flows, admin tools.",
    speed: "Rapid platform prototype"
  },
  {
    name: "FoodPersonal",
    type: "AI consumer product",
    problem: "Meal decisions are personal and repetitive.",
    solution: "AI-assisted food planning around real preferences.",
    angle: "Preference memory, generation, nutrition logic.",
    speed: "Working assistant prototype"
  },
  {
    name: "NDA.company",
    type: "Workflow SaaS",
    problem: "Simple legal work slows teams down.",
    solution: "A focused intake and document workflow.",
    angle: "Structured forms, review flow, document routing.",
    speed: "Focused SaaS build"
  },
  {
    name: "Dental AI",
    type: "Practice tools",
    problem: "Front-office work eats valuable time.",
    solution: "AI support for intake, follow-up, and summaries.",
    angle: "Patient workflows, task support, knowledge capture.",
    speed: "Ops tool prototype"
  },
  {
    name: "Pardners",
    type: "Network platform",
    problem: "Partnership work gets lost in loose systems.",
    solution: "A structured place to manage people and activity.",
    angle: "CRM-style workflows, permissions, member data.",
    speed: "Platform concept build"
  },
  {
    name: "Race",
    type: "Interactive product",
    problem: "Learning content needs more engagement.",
    solution: "A competitive quiz and gameplay system.",
    angle: "Scoring, content management, multiplayer flows.",
    speed: "Interactive MVP"
  },
  {
    name: "AI Growth Tools",
    type: "GTM systems",
    problem: "Early products need faster market feedback.",
    solution: "Tools for messaging, pages, outreach, and learning.",
    angle: "AI generation, tracking, lightweight analytics.",
    speed: "Reusable growth workflows"
  }
];

const models = [
  {
    title: "AI Opportunity Audit",
    text: "Find the best places to use AI inside your business or product idea.",
    items: ["Workflow analysis", "Opportunity map", "Build roadmap"]
  },
  {
    title: "MVP Sprint",
    text: "Turn a clear opportunity into a working product people can use.",
    items: ["UX", "Backend", "AI integration", "Launch-ready build"]
  },
  {
    title: "Growth & Optimization",
    text: "Improve the product after launch and build systems around traction.",
    items: ["Iteration", "Analytics", "Automation", "GTM systems"]
  }
];

function MockupStage() {
  return (
    <div className="mockup-stage" aria-label="Product interface examples">
      <div className="mockup-card mockup-dashboard">
        <div className="mockup-top">
          <span />
          <span />
          <span />
        </div>
        <div className="mockup-title">Operations dashboard</div>
        <div className="metric-row">
          <strong>42</strong>
          <span>Tasks routed</span>
        </div>
        <div className="bar-grid">
          <span />
          <span />
          <span />
          <span />
        </div>
      </div>
      <div className="mockup-card mockup-chat">
        <div className="chat-line wide" />
        <div className="chat-line" />
        <div className="chat-response">Drafted client summary</div>
      </div>
      <div className="mockup-card mockup-mobile">
        <div className="phone-notch" />
        <div className="phone-line" />
        <div className="phone-line short" />
        <div className="phone-action" />
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
          <p className="eyebrow">AI Venture Studio + Rapid Product Development</p>
          <h1>From Idea to AI Product in Days</h1>
          <p>
            We help founders and business owners rapidly design, validate, and launch AI-powered
            products, workflows, and business systems without hiring a full product team.
          </p>
          <div className="hero-actions">
            <Link className="button button-dark" href="/contact">
              Book Strategy Call
            </Link>
            <Link className="button button-light" href="#process">
              See How We Work
            </Link>
          </div>
        </div>
        <MockupStage />
      </section>

      <section className="audience-section">
        {audiences.map((item) => (
          <article key={item.title}>
            <h2>{item.title}</h2>
            <p>{item.text}</p>
          </article>
        ))}
      </section>

      <section className="section" id="services">
        <div className="section-heading">
          <p className="eyebrow">What we build</p>
          <h2>Software that removes bottlenecks or becomes a product.</h2>
        </div>
        <div className="service-grid">
          {services.map(([title, text]) => (
            <article className="service-card" key={title}>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="process-section" id="process">
        <div className="section-heading">
          <p className="eyebrow">How it works</p>
          <h2>Simple. Fast. Focused.</h2>
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

      <section className="portfolio-preview" id="portfolio">
        <div className="section-heading split">
          <div>
            <p className="eyebrow">Portfolio</p>
            <h2>Venture studio prototypes and platforms.</h2>
          </div>
          <Link className="text-link" href="/portfolio">
            View portfolio
          </Link>
        </div>
        <div className="project-grid">
          {projects.map((project) => (
            <article className="project-card" key={project.name}>
              <p>{project.type}</p>
              <h3>{project.name}</h3>
              <dl>
                <div>
                  <dt>Problem</dt>
                  <dd>{project.problem}</dd>
                </div>
                <div>
                  <dt>Solution</dt>
                  <dd>{project.solution}</dd>
                </div>
                <div>
                  <dt>System</dt>
                  <dd>{project.angle}</dd>
                </div>
                <div>
                  <dt>Speed</dt>
                  <dd>{project.speed}</dd>
                </div>
              </dl>
            </article>
          ))}
        </div>
      </section>

      <section className="why-section">
        <div>
          <p className="eyebrow">Why Good Business</p>
          <h2>Built by Operators, Not Just Developers</h2>
        </div>
        <div className="why-copy">
          <p>
            Good software starts with a real business problem. We bring startup experience,
            acquisition experience, operational leadership, and AI-first build workflows to the same
            table.
          </p>
          <div className="proof-grid">
            {[
              "Business-first thinking",
              "Rapid execution",
              "Shipping over theory",
              "Modern AI workflows",
              "Monetization judgment",
              "GTM awareness"
            ].map((point) => (
              <span key={point}>{point}</span>
            ))}
          </div>
        </div>
      </section>

      <section className="models-section">
        <div className="section-heading">
          <p className="eyebrow">Engagement models</p>
          <h2>Pick the level of build support you need.</h2>
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

      <section className="final-cta">
        <h2>You Don&apos;t Need a Huge Team to Build Something Valuable.</h2>
        <p>You need clarity, speed, execution, and the right AI workflows.</p>
        <Link className="button button-dark" href="/contact">
          Book Strategy Call
        </Link>
      </section>
      <SiteFooter />
    </main>
  );
}

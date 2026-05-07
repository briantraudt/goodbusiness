import Link from "next/link";
import { SiteFooter } from "../components/SiteFooter";
import { SiteNav } from "../components/SiteNav";

const cases = [
  {
    name: "SideStage",
    type: "Event discovery platform",
    challenge: "Local live music discovery is fragmented across venues, artists, and listings.",
    approach: "Design a cleaner way to search, follow, and surface relevant events.",
    product: "Consumer event platform with venue and artist workflows.",
    system: "Structured event data, recommendations, and admin tooling.",
    result: "Rapid prototype built to test discovery, listing, and engagement flows."
  },
  {
    name: "FoodPersonal",
    type: "AI nutrition product",
    challenge: "Personalized meal planning is hard to make useful in daily life.",
    approach: "Turn preferences, goals, and constraints into simple meal decisions.",
    product: "AI-assisted food planning experience.",
    system: "Preference memory, generation workflows, and nutrition logic.",
    result: "Prototype for a practical consumer AI assistant."
  },
  {
    name: "NDA.company",
    type: "Legal workflow SaaS",
    challenge: "Simple legal paperwork creates slow back-and-forth for teams.",
    approach: "Make intake, review, and document flow faster and easier to manage.",
    product: "NDA workflow platform for business users.",
    system: "Structured intake, document routing, and admin review.",
    result: "Built as a focused SaaS workflow prototype."
  },
  {
    name: "Dental AI",
    type: "Practice operations tools",
    challenge: "Dental teams lose time on repetitive admin and patient communication.",
    approach: "Map front-office bottlenecks and build tools around the daily workflow.",
    product: "AI-powered practice support tools.",
    system: "Patient intake, summaries, follow-up workflows, and task support.",
    result: "Prototype suite for clinical and operational efficiency."
  },
  {
    name: "Pardners",
    type: "Relationship platform",
    challenge: "Partnerships and communities need better coordination than spreadsheets.",
    approach: "Create a structured system for people, activity, and follow-through.",
    product: "Network and relationship management platform.",
    system: "Member data, workflows, permissions, and CRM-style views.",
    result: "Platform concept built around organized action."
  },
  {
    name: "Race",
    type: "Interactive learning product",
    challenge: "Educational content needs better engagement and replay value.",
    approach: "Use game mechanics to make learning competitive and memorable.",
    product: "Interactive quiz and gameplay platform.",
    system: "Content management, scoring, multiplayer flows, and progression.",
    result: "Prototype showing how niche expertise can become a product."
  },
  {
    name: "AI Growth Tools",
    type: "GTM systems",
    challenge: "Early products need faster ways to test channels, messaging, and demand.",
    approach: "Build small tools that support outreach, landing pages, research, and feedback.",
    product: "AI-assisted growth and experimentation workflows.",
    system: "Generation, tracking, automation, and lightweight analytics.",
    result: "Reusable systems for product validation and early traction."
  }
];

export const metadata = {
  title: "Portfolio | Good Business",
  description: "Venture studio prototypes and platforms built by Good Business."
};

export default function PortfolioPage() {
  return (
    <main className="marketing-page">
      <SiteNav />
      <section className="page-hero">
        <p className="eyebrow">Portfolio</p>
        <h1>Examples of rapid product development capability.</h1>
        <p>
          Venture studio prototypes and platforms built to test markets, automate workflows, and
          turn business knowledge into software.
        </p>
      </section>
      <section className="case-study-list">
        {cases.map((item, index) => (
          <article className="case-study" key={item.name}>
            <div className="case-index">{String(index + 1).padStart(2, "0")}</div>
            <div>
              <p className="case-type">{item.type}</p>
              <h2>{item.name}</h2>
            </div>
            <div className="case-details">
              <p>
                <strong>Challenge</strong>
                {item.challenge}
              </p>
              <p>
                <strong>Approach</strong>
                {item.approach}
              </p>
              <p>
                <strong>Product</strong>
                {item.product}
              </p>
              <p>
                <strong>AI / system</strong>
                {item.system}
              </p>
              <p>
                <strong>Execution</strong>
                {item.result}
              </p>
            </div>
          </article>
        ))}
      </section>
      <section className="final-cta slim">
        <h2>Have a similar problem worth productizing?</h2>
        <Link className="button button-dark" href="/contact">
          Book Strategy Call
        </Link>
      </section>
      <SiteFooter />
    </main>
  );
}

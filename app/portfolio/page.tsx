import Link from "next/link";
import { SiteFooter } from "../components/SiteFooter";
import { SiteNav } from "../components/SiteNav";

const examples = [
  {
    title: "AI intake assistant for a law firm",
    problem: "New matters arrive with missing context.",
    build: "A guided intake assistant that gathers details and routes the request.",
    value: "Faster review and cleaner handoffs."
  },
  {
    title: "Customer support knowledge bot",
    problem: "The same questions keep pulling the team away from higher-value work.",
    build: "A controlled assistant connected to approved company knowledge.",
    value: "Faster answers and fewer repeated replies."
  },
  {
    title: "Internal quoting tool for a contractor",
    problem: "Estimates rely on manual work and inconsistent rules.",
    build: "A quoting workflow with pricing logic, review steps, and saved context.",
    value: "More consistent quotes with less admin time."
  },
  {
    title: "AI training portal for a consulting firm",
    problem: "Expertise is valuable but hard to deliver repeatedly.",
    build: "A paid portal with lessons, resources, prompts, and AI guidance.",
    value: "A scalable product built from existing knowledge."
  },
  {
    title: "Operations dashboard for a service business",
    problem: "Work status is spread across tools, people, and notes.",
    build: "A dashboard that tracks jobs, tasks, bottlenecks, and follow-up.",
    value: "Clearer decisions and fewer missed steps."
  },
  {
    title: "AI workflow engine for an agency",
    problem: "Client work requires repeated research, drafts, and approvals.",
    build: "A system that standardizes inputs, drafts, routing, and review.",
    value: "More output without lowering quality."
  }
];

export const metadata = {
  title: "Example Builds | Good Business HQ",
  description: "Example B2B AI software build types from Good Business HQ."
};

export default function ExampleBuildsPage() {
  return (
    <main className="marketing-page">
      <SiteNav />
      <section className="page-hero">
        <p className="eyebrow">Example build types</p>
        <h1>B2B AI software built around real work.</h1>
        <p>
          These are example build types. The point is simple: find the business problem, design the
          workflow, and build the tool.
        </p>
      </section>
      <section className="case-study-list">
        {examples.map((item, index) => (
          <article className="case-study" key={item.title}>
            <div className="case-index">{String(index + 1).padStart(2, "0")}</div>
            <div>
              <p className="case-type">Example build</p>
              <h2>{item.title}</h2>
            </div>
            <div className="case-details">
              <p>
                <strong>Problem</strong>
                {item.problem}
              </p>
              <p>
                <strong>Build</strong>
                {item.build}
              </p>
              <p>
                <strong>Business value</strong>
                {item.value}
              </p>
            </div>
          </article>
        ))}
      </section>
      <section className="final-cta slim">
        <h2>Have a workflow that should become software?</h2>
        <Link className="button button-dark" href="/contact">
          Book a Strategy Call
        </Link>
      </section>
      <SiteFooter />
    </main>
  );
}

import { SiteFooter } from "../components/SiteFooter";
import { SiteNav } from "../components/SiteNav";
import { ContactForm } from "./ContactForm";

export const metadata = {
  title: "Contact | Good Business",
  description: "Book a strategy call with Good Business."
};

export default function ContactPage() {
  return (
    <main className="marketing-page">
      <SiteNav />
      <section className="page-hero compact">
        <p className="eyebrow">Contact</p>
        <h1>Tell us what you are trying to build.</h1>
        <p>
          Bring the idea, workflow, bottleneck, or messy process. We will help identify the fastest
          path to a working product.
        </p>
      </section>
      <section className="contact-layout">
        <div className="contact-copy">
          <h2>Good calls are specific.</h2>
          <p>
            The form helps us understand the business problem, the build scope, and what is blocking
            momentum right now.
          </p>
          <div className="contact-points">
            <span>Rapid MVPs</span>
            <span>Internal AI tools</span>
            <span>Workflow systems</span>
          </div>
        </div>
        <ContactForm />
      </section>
      <SiteFooter />
    </main>
  );
}

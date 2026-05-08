import { SiteFooter } from "../components/SiteFooter";
import { SiteNav } from "../components/SiteNav";
import { ContactForm } from "./ContactForm";

export const metadata = {
  title: "Contact | Good Business",
  description: "Tell Good Business where the work is slow, manual, or costing money."
};

export default function ContactPage() {
  return (
    <main className="marketing-page">
      <SiteNav />
      <section className="page-hero compact">
        <p className="eyebrow">Contact</p>
        <h1>Show us where the work is stuck.</h1>
        <p>
          Tell us what is slow, manual, scattered, or costing money. We will look for the simplest
          fix worth building.
        </p>
      </section>
      <section className="contact-layout">
        <div className="contact-copy">
          <h2>Useful calls start with the bottleneck.</h2>
          <p>
            The form helps us understand where time, margin, or follow-up is getting lost right now.
          </p>
          <div className="contact-points">
            <span>Lead follow-up</span>
            <span>Quoting + intake</span>
            <span>Admin cleanup</span>
          </div>
        </div>
        <ContactForm />
      </section>
      <SiteFooter />
    </main>
  );
}

import { Link } from 'react-router-dom';
import { industries } from '@/data/industries';
import SEOHead from '@/components/seo/SEOHead';
import PageLayout from '@/components/layout/PageLayout';
import { ArrowRight, Zap, Building2, Rocket, HelpCircle } from 'lucide-react';

const categoryLabels: Record<string, string> = {
  healthcare: "Healthcare",
  legal: "Legal",
  "real-estate": "Real Estate",
  education: "Education",
  finance: "Finance",
  retail: "Retail",
  hospitality: "Food & Hospitality",
  construction: "Construction & Trades",
  professional: "Professional Services",
  automotive: "Automotive",
  beauty: "Beauty & Wellness",
  nonprofit: "Religious & Nonprofit",
  agriculture: "Agriculture & Outdoors",
  tech: "Tech & SaaS",
  media: "Media & Content",
  services: "Services",
};

const grouped = industries.reduce((acc, ind) => {
  if (!acc[ind.category]) acc[ind.category] = [];
  acc[ind.category].push(ind);
  return acc;
}, {} as Record<string, typeof industries>);

const faqs = [
  {
    question: "What are AI business ideas?",
    answer: "AI business ideas are startup concepts that use artificial intelligence—such as machine learning, natural language processing, computer vision, or predictive analytics—to solve real problems for customers. These ideas range from AI-powered chatbots for customer service to machine learning platforms that predict equipment failures. The best AI business ideas identify a painful, repetitive, or data-heavy task in a specific industry and automate or enhance it using AI technology."
  },
  {
    question: "Which industries benefit most from AI?",
    answer: "Nearly every industry benefits from AI, but some see faster ROI than others. Healthcare leads with AI diagnostics, patient scheduling, and drug discovery. Legal firms use AI for contract review and case research. Real estate benefits from AI-powered property valuations and lead scoring. Finance uses AI for fraud detection, algorithmic trading, and personalized financial advice. Retail and e-commerce leverage AI for recommendation engines, inventory optimization, and dynamic pricing. Construction, education, and professional services are also rapidly adopting AI tools."
  },
  {
    question: "How much does it cost to build an AI startup?",
    answer: "The cost to build an AI startup varies widely depending on complexity. A simple AI-powered MVP—such as a chatbot or recommendation tool—can be built for $5,000 to $25,000 using existing APIs like OpenAI, Google Cloud AI, or AWS SageMaker. More complex products involving custom machine learning models, proprietary datasets, or real-time processing can cost $50,000 to $250,000+. The key is to start with a focused MVP that validates your core hypothesis before scaling. Many successful AI startups launch their first version in under 90 days."
  },
  {
    question: "Do I need technical skills to start an AI business?",
    answer: "Not necessarily. While understanding AI concepts is helpful, many successful AI founders are domain experts—not engineers. They deeply understand the problem in their industry and partner with technical co-founders or agencies to build the product. No-code and low-code AI tools like Bubble, Lovable, and Zapier with AI integrations make it easier than ever to prototype AI products without writing code. The most important skill is identifying a genuine problem worth solving."
  },
  {
    question: "What is the best AI business to start in 2025?",
    answer: "The best AI businesses in 2025 are those that serve specific niches rather than competing horizontally with large AI companies. Vertical AI SaaS—software built for a single industry using AI—is the strongest opportunity. Examples include AI scheduling for dental practices, AI contract review for small law firms, AI-powered menu optimization for restaurants, and AI lead scoring for real estate agents. These businesses win because they combine deep industry knowledge with AI capabilities, creating products that generic AI tools can't replicate."
  },
];

const AIBusinessIdeasIndex = () => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "AI Business Ideas by Industry | 200+ AI Startup Ideas",
    "description": "Explore 200+ AI startup ideas across every industry. Find your next AI-powered business opportunity with validated concepts, MVP roadmaps, and revenue models.",
    "url": "https://goodbusinesshq.com/ai-business-ideas",
    "publisher": { "@type": "Organization", "name": "Good Business HQ", "url": "https://goodbusinesshq.com" },
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer,
      }
    }))
  };

  return (
    <PageLayout>
      <SEOHead
        title="AI Business Ideas by Industry | 200+ AI Startup Ideas"
        description="Explore 200+ AI startup ideas across healthcare, legal, real estate, education, finance, and more. Each idea includes problem, solution, MVP concept, and revenue model."
        structuredData={structuredData}
      />
      {/* FAQ Schema */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <div className="relative z-10 pt-24 pb-16">
        <div className="container-custom max-w-5xl">

          {/* Hero */}
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            AI Business Ideas by Industry
          </h1>
          <p className="text-lg text-muted-foreground mb-6 max-w-3xl">
            The AI revolution isn't coming—it's here. Businesses that adopt artificial intelligence are growing faster, operating leaner, and outcompeting those that don't. Whether you're a first-time founder or a seasoned entrepreneur looking for your next venture, AI offers an unprecedented opportunity to build products that solve real problems at scale.
          </p>
          <p className="text-base text-muted-foreground mb-12 max-w-3xl">
            Below you'll find <strong className="text-foreground">200+ validated AI business ideas</strong> across {Object.keys(grouped).length} industries—each with a defined problem, AI-powered solution, MVP roadmap, and revenue model. Pick an industry to explore ideas tailored to markets you understand, or browse them all for inspiration.
          </p>

          {/* Section 1: Why AI Business Ideas Are Exploding */}
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-secondary/10">
                <Zap className="h-6 w-6 text-secondary" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                Why AI Business Ideas Are Exploding
              </h2>
            </div>

            <div className="prose prose-invert max-w-none space-y-4 text-muted-foreground">
              <p>
                Artificial intelligence has moved from research labs to mainstream business tools in record time. OpenAI's ChatGPT reached 100 million users faster than any application in history. Google, Microsoft, Amazon, and Apple are embedding AI into every product. But the biggest opportunity isn't with the tech giants—it's with entrepreneurs who apply AI to specific industries and workflows.
              </p>
              <p>
                Three forces are driving this explosion. First, <strong className="text-foreground">AI APIs have become accessible and affordable</strong>. You no longer need a PhD in machine learning to build an AI product. Services like OpenAI, Anthropic, Google Gemini, and open-source models like Llama and Mistral let anyone integrate powerful AI into their applications. Second, <strong className="text-foreground">every industry has inefficiencies that AI can fix</strong>. From{' '}
                <Link to="/ai-business-ideas-for/dentists" className="text-secondary hover:underline">dental practices</Link> drowning in appointment no-shows to{' '}
                <Link to="/ai-business-ideas-for/lawyers" className="text-secondary hover:underline">law firms</Link> spending hours on document review, there are thousands of painful, repetitive tasks waiting to be automated. Third, <strong className="text-foreground">customers are ready</strong>. Businesses and consumers now expect intelligent, personalized experiences—and they'll pay premium prices for products that deliver them.
              </p>
              <p>
                The venture capital market reflects this shift. AI startups raised over $50 billion in 2024 alone, with vertical AI SaaS—software built for specific industries—attracting the fastest-growing share. Investors are actively seeking founders who combine deep domain expertise with AI-powered solutions. If you understand an industry's problems, you already have a head start that most AI engineers don't.
              </p>
            </div>
          </section>

          {/* Section 2: Examples of AI Startups */}
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-primary/10">
                <Building2 className="h-6 w-6 text-primary" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                Examples of AI Startups Winning Right Now
              </h2>
            </div>

            <div className="prose prose-invert max-w-none space-y-4 text-muted-foreground">
              <p>
                The most successful AI startups aren't building general-purpose AI. They're solving specific, painful problems for specific customers. Here are patterns we see across the industries in our database:
              </p>

              <div className="grid gap-4 md:grid-cols-2 not-prose mt-6">
                {[
                  { title: "AI for Healthcare", desc: "Startups like Viz.ai use computer vision to detect strokes in medical scans, cutting diagnosis time from hours to minutes. Smaller AI companies are building appointment schedulers, patient intake automation, and clinical note generators for independent practices.", links: [{ to: "/ai-business-ideas-for/doctors", label: "Doctors" }, { to: "/ai-business-ideas-for/therapists", label: "Therapists" }] },
                  { title: "AI for Legal", desc: "Companies like Harvey AI are transforming how law firms research case law and draft contracts. But the biggest opportunity may be in serving solo practitioners and small firms who can't afford enterprise tools—AI-powered client intake, billing automation, and deadline tracking.", links: [{ to: "/ai-business-ideas-for/law-firms", label: "Law Firms" }, { to: "/ai-business-ideas-for/paralegals", label: "Paralegals" }] },
                  { title: "AI for Real Estate", desc: "AI property valuation tools, automated listing descriptions, and intelligent lead scoring are transforming how agents work. The smartest AI startups in real estate focus on saving agents time on repetitive tasks so they can focus on relationships.", links: [{ to: "/ai-business-ideas-for/real-estate-agents", label: "Real Estate Agents" }, { to: "/ai-business-ideas-for/property-managers", label: "Property Managers" }] },
                  { title: "AI for Retail & Ecommerce", desc: "AI recommendation engines drive 35% of Amazon's revenue. Startups are bringing this same technology to independent retailers—personalized product suggestions, dynamic pricing, inventory forecasting, and AI-generated product descriptions.", links: [{ to: "/ai-business-ideas-for/ecommerce-stores", label: "Ecommerce" }, { to: "/ai-business-ideas-for/boutiques", label: "Boutiques" }] },
                ].map((example, i) => (
                  <div key={i} className="rounded-xl border border-border bg-card p-6">
                    <h3 className="font-semibold text-foreground text-lg mb-2">{example.title}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{example.desc}</p>
                    <div className="flex gap-2 flex-wrap">
                      {example.links.map(link => (
                        <Link key={link.to} to={link.to} className="text-xs text-secondary hover:underline">
                          {link.label} →
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <p className="mt-6">
                Other fast-growing verticals include AI for{' '}
                <Link to="/ai-business-ideas-for/restaurants" className="text-secondary hover:underline">restaurants</Link>,{' '}
                <Link to="/ai-business-ideas-for/accountants" className="text-secondary hover:underline">accountants</Link>,{' '}
                <Link to="/ai-business-ideas-for/general-contractors" className="text-secondary hover:underline">general contractors</Link>, and{' '}
                <Link to="/ai-business-ideas-for/gyms" className="text-secondary hover:underline">gyms</Link>. The common thread: these industries have high volumes of repetitive tasks, unstructured data, and customers willing to pay for efficiency gains.
              </p>
            </div>
          </section>

          {/* Section 3: How to Build an AI Startup */}
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-accent/10">
                <Rocket className="h-6 w-6 text-accent" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                How to Build an AI Startup (Step by Step)
              </h2>
            </div>

            <div className="prose prose-invert max-w-none space-y-4 text-muted-foreground">
              <p>
                Building an AI startup follows the same principles as any startup—with a few key differences. Here's the framework we recommend to founders we work with at Good Business HQ:
              </p>

              <div className="not-prose space-y-6 mt-6">
                {[
                  { step: "1. Pick an Industry You Understand", detail: "The best AI founders are domain experts first, technologists second. Choose an industry where you have experience, connections, or deep curiosity. Browse our industry pages below to find ideas that match your background—from healthcare to construction to media." },
                  { step: "2. Identify a Painful, Repetitive Problem", detail: "Look for tasks that are time-consuming, error-prone, or require processing large amounts of data. These are the workflows where AI creates the most value. Talk to 20+ potential customers before writing a single line of code." },
                  { step: "3. Validate Before You Build", detail: "Create a landing page describing your AI solution. Run targeted ads or do cold outreach. Can you get 10 people to sign up for a waitlist or pre-pay? If not, iterate on the problem or audience before investing in development." },
                  { step: "4. Build a Focused MVP", detail: "Your first version should do one thing exceptionally well. Use existing AI APIs (OpenAI, Google Cloud AI, AWS Bedrock) rather than training custom models. Ship in 30-90 days, not 12 months. A working product that solves one problem beats a vision deck that promises everything." },
                  { step: "5. Launch, Learn, Iterate", detail: "Get your MVP into customers' hands immediately. Charge from day one—even if it's a small amount. Use customer feedback to guide every subsequent feature. The companies that win aren't the ones with the best AI; they're the ones that best understand their customers." },
                ].map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-secondary/20 text-secondary flex items-center justify-center font-bold text-sm">
                      {i + 1}
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">{item.step}</h3>
                      <p className="text-muted-foreground text-sm">{item.detail}</p>
                    </div>
                  </div>
                ))}
              </div>

              <p className="mt-6">
                Ready to go deeper? Pick any industry below to see five specific AI startup ideas with problem statements, solution architectures, MVP concepts, and revenue models.
              </p>
            </div>
          </section>

          {/* Industry Grid */}
          <section className="mb-16">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
              Browse AI Business Ideas by Industry
            </h2>
            <p className="text-muted-foreground mb-8">
              Select an industry to explore 5 AI-powered startup ideas with problem-solution frameworks, MVP blueprints, and monetization strategies.
            </p>

            {Object.entries(grouped).map(([cat, inds]) => (
              <div key={cat} className="mb-10">
                <h3 className="text-lg font-bold text-foreground mb-3 pb-2 border-b border-border">
                  {categoryLabels[cat] || cat}
                </h3>
                <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                  {inds.map((ind) => (
                    <Link
                      key={ind.slug}
                      to={`/ai-business-ideas-for/${ind.slug}`}
                      className="group flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-3 hover:border-secondary/50 transition-colors"
                    >
                      <span className="text-sm text-foreground group-hover:text-secondary transition-colors flex-1">
                        {ind.name}
                      </span>
                      <ArrowRight className="h-3 w-3 text-muted-foreground group-hover:text-secondary transition-colors" />
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </section>

          {/* FAQ Section */}
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 rounded-lg bg-secondary/10">
                <HelpCircle className="h-6 w-6 text-secondary" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                Frequently Asked Questions About AI Business Ideas
              </h2>
            </div>

            <div className="space-y-6">
              {faqs.map((faq, i) => (
                <div key={i} className="rounded-xl border border-border bg-card p-6">
                  <h3 className="font-semibold text-foreground text-lg mb-2">{faq.question}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Bottom CTA */}
          <section className="rounded-xl border border-secondary/30 bg-secondary/5 p-8 md:p-12 text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              Ready to Build Your AI Startup?
            </h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Good Business HQ partners with founders to take AI ideas from concept to launched product. We handle the technical build—you focus on your market and customers.
            </p>
            <Link
              to="/#contact"
              className="inline-flex items-center gap-2 rounded-md px-6 py-3 text-white text-lg font-medium transition-colors"
              style={{ backgroundColor: 'hsl(210, 55%, 55%)' }}
            >
              Work With Us <ArrowRight className="h-5 w-5" />
            </Link>
          </section>

        </div>
      </div>
    </PageLayout>
  );
};

export default AIBusinessIdeasIndex;

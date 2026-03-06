import { Link } from 'react-router-dom';
import { industries } from '@/data/industries';
import SEOHead from '@/components/seo/SEOHead';
import PageLayout from '@/components/layout/PageLayout';
import { ArrowRight } from 'lucide-react';

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

const AIBusinessIdeasIndex = () => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "AI Business Ideas by Industry",
    "description": "Explore 200+ AI startup ideas across every industry. Find your next AI-powered business opportunity.",
    "url": "https://goodbusinesshq.com/ai-business-ideas",
    "publisher": { "@type": "Organization", "name": "Good Business HQ" },
  };

  return (
    <PageLayout>
      <SEOHead
        title="AI Business Ideas by Industry | 200+ AI Startup Ideas"
        description="Explore 200+ AI startup ideas across healthcare, legal, real estate, education, finance, and more. Each idea includes problem, solution, MVP concept, and revenue model."
        structuredData={structuredData}
      />

      <div className="relative z-10 pt-24 pb-16">
        <div className="container-custom max-w-5xl">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            AI Business Ideas by Industry
          </h1>
          <p className="text-lg text-muted-foreground mb-12 max-w-3xl">
            Discover AI-powered startup opportunities across 200 industries. Each page includes validated business ideas with problem statements, AI solutions, MVP roadmaps, and revenue models.
          </p>

          {Object.entries(grouped).map(([cat, inds]) => (
            <section key={cat} className="mb-12">
              <h2 className="text-xl font-bold text-foreground mb-4 pb-2 border-b border-border">
                {categoryLabels[cat] || cat}
              </h2>
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
            </section>
          ))}
        </div>
      </div>
    </PageLayout>
  );
};

export default AIBusinessIdeasIndex;

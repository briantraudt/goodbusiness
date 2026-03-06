import { useParams, Link } from 'react-router-dom';
import { getIndustryBySlug } from '@/data/industries';
import { generatePageContent } from '@/data/ai-content-generator';
import SEOHead from '@/components/seo/SEOHead';
import PageLayout from '@/components/layout/PageLayout';
import NotFound from './NotFound';
import { ArrowRight, Lightbulb, Wrench, Rocket, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const AIBusinessIdeas = () => {
  const { slug } = useParams<{ slug: string }>();
  const industry = slug ? getIndustryBySlug(slug) : undefined;

  if (!industry) return <NotFound />;

  const content = generatePageContent(industry);

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": content.metaTitle,
    "description": content.metaDescription,
    "author": { "@type": "Organization", "name": "Good Business HQ" },
    "publisher": { "@type": "Organization", "name": "Good Business HQ", "url": "https://goodbusinesshq.com" },
    "mainEntityOfPage": `https://goodbusinesshq.com/ai-business-ideas-for-${slug}`,
  };

  return (
    <PageLayout>
      <SEOHead title={content.metaTitle} description={content.metaDescription} structuredData={structuredData} />

      <div className="relative z-10 pt-24 pb-16">
        <div className="container-custom max-w-4xl">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1 text-sm text-muted-foreground mb-8">
            <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
            <ChevronRight className="h-3 w-3" />
            <Link to="/ai-business-ideas" className="hover:text-foreground transition-colors">AI Business Ideas</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-foreground">{industry.name}</span>
          </nav>

          {/* H1 */}
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            AI Business Ideas for {industry.name}
          </h1>

          {/* Intro */}
          <p className="text-lg text-muted-foreground leading-relaxed mb-12">
            {content.intro}
          </p>

          {/* Section 1: AI Ideas */}
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 rounded-lg bg-secondary/10">
                <Lightbulb className="h-6 w-6 text-secondary" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                5 AI Startup Ideas for {industry.name}
              </h2>
            </div>

            <div className="space-y-8">
              {content.ideas.map((idea, i) => (
                <div key={i} className="rounded-xl border border-border bg-card p-6 md:p-8">
                  <h3 className="text-xl font-semibold text-foreground mb-4">
                    {i + 1}. {idea.title}
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <span className="text-sm font-semibold text-destructive uppercase tracking-wide">Problem</span>
                      <p className="text-muted-foreground mt-1">{idea.problem}</p>
                    </div>
                    <div>
                      <span className="text-sm font-semibold text-primary uppercase tracking-wide">AI Solution</span>
                      <p className="text-muted-foreground mt-1">{idea.solution}</p>
                    </div>
                    <div>
                      <span className="text-sm font-semibold text-secondary uppercase tracking-wide">MVP Concept</span>
                      <p className="text-muted-foreground mt-1">{idea.mvp}</p>
                    </div>
                    <div>
                      <span className="text-sm font-semibold text-accent uppercase tracking-wide">Revenue Model</span>
                      <p className="text-muted-foreground mt-1">{idea.revenue}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Section 2: AI Tools */}
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 rounded-lg bg-primary/10">
                <Wrench className="h-6 w-6 text-primary" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                AI Tools to Power Your {industry.name} Startup
              </h2>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {content.tools.map((tool, i) => (
                <div key={i} className="rounded-lg border border-border bg-card p-5">
                  <h3 className="font-semibold text-foreground mb-1">{tool.name}</h3>
                  <p className="text-sm text-muted-foreground">{tool.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Section 3: MVP Steps */}
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 rounded-lg bg-accent/10">
                <Rocket className="h-6 w-6 text-accent" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                How to Build Your AI MVP: Step by Step
              </h2>
            </div>

            <div className="space-y-6">
              {content.mvpSteps.map((s, i) => (
                <div key={i} className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-secondary/20 text-secondary flex items-center justify-center font-bold text-sm">
                    {i + 1}
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">{s.step}</h3>
                    <p className="text-muted-foreground text-sm">{s.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Section 4: CTA */}
          <section className="rounded-xl border border-secondary/30 bg-secondary/5 p-8 md:p-12 text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              Ready to Launch Your AI Startup for {industry.name}?
            </h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Good Business HQ partners with founders to take AI ideas from concept to launched product. We handle the technical build so you can focus on your market.
            </p>
            <Button asChild size="lg" className="text-white text-lg" style={{ backgroundColor: 'hsl(210, 55%, 55%)' }}>
              <Link to="/#contact">
                Work With Us <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </section>

          {/* Internal Links */}
          <nav className="mt-12 pt-8 border-t border-border">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4">Explore More</h3>
            <div className="flex flex-wrap gap-3">
              <Link to="/ai-business-ideas" className="text-sm text-secondary hover:underline">All AI Business Ideas →</Link>
              <Link to="/" className="text-sm text-secondary hover:underline">Good Business HQ Home →</Link>
            </div>
          </nav>
        </div>
      </div>
    </PageLayout>
  );
};

export default AIBusinessIdeas;

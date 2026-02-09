import React from 'react';
import ScrollReveal from '@/components/common/ScrollReveal';

const BRAND_BLUE = 'hsl(210, 55%, 55%)';

const ventures = [
  {
    name: "DGTL Dental",
    tagline: "Virtual Front Office for Dental Offices.",
    status: "In Production",
    tags: ["Agent", "Healthcare", "Automation"],
    url: "www.dgtldental.com",
  },
  {
    name: "Food Personal",
    tagline: "Personalized meal planning and nutrition tailored to your lifestyle.",
    status: "Beta",
    tags: ["Mobile App", "Meal Planning", "Nutrition"],
    url: "www.foodpersonal.com",
  },
  {
    name: "NDA Company",
    tagline: "Create, Send and Store NDA's Quickly and Securely.",
    status: "Beta",
    tags: ["Web App", "Legal Tech", "Security"],
    url: "www.nda.company",
  },
  {
    name: "SideStage",
    tagline: "Fan powered video platform for live music.",
    status: "In Development",
    tags: ["Mobile App", "UX Research", "Product Strategy"],
  },
];

const Portfolio = () => {
  return (
    <section id="portfolio" className="relative py-16 md:py-20">
      <div className="container-custom relative z-10">
        <ScrollReveal direction="up">
          <div className="text-center mb-12 md:mb-16">
            <span
              className="inline-block font-semibold text-lg md:text-xl uppercase tracking-[0.2em] mb-4"
              style={{ color: BRAND_BLUE }}
            >
              Portfolio
            </span>
            <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-foreground mb-5">
              What We've Built
            </h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
              A look at some of the recent products and platforms we are bringing to life.
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal direction="up" delay={100}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 max-w-5xl mx-auto">
            {ventures.map((venture, index) => (
              <div
                key={index}
                className="bg-card/60 backdrop-blur-sm border border-border rounded-xl px-5 py-5 flex flex-col items-center text-center"
              >
                <span
                  className="text-[10px] font-semibold uppercase tracking-widest mb-2"
                  style={{ color: BRAND_BLUE }}
                >
                  {venture.status}
                </span>
                <h3 className="text-xl md:text-2xl font-bold text-foreground mb-2">
                  {venture.name}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                  {venture.tagline}
                </p>
                <div className="flex flex-wrap justify-center gap-1.5">
                  {venture.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] font-medium px-2.5 py-0.5 rounded-full border border-border text-muted-foreground"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                {venture.url && (
                  <a
                    href={`https://${venture.url}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 text-xs text-muted-foreground hover:text-foreground transition-colors underline underline-offset-2"
                  >
                    {venture.url}
                  </a>
                )}
              </div>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default Portfolio;

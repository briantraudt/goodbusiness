import React from 'react';
import ScrollReveal from '@/components/common/ScrollReveal';

const BRAND_BLUE = 'hsl(210, 55%, 55%)';

const ventures = [
  {
    name: "DGTL Dental",
    tagline: "AI-powered virtual front desk that answers questions, books appointments, and reduces front-office workload for dental practices.",
    status: "In Production",
    tags: ["AI Agent", "Healthcare", "Workflow Automation"],
    url: "www.dgtldental.com",
  },
  {
    name: "Food Personal",
    tagline: "Personalized meal planning platform that generates recipes, plans meals, and adapts nutrition to individual preferences and goals.",
    status: "Beta",
    tags: ["Mobile App", "Meal Planning", "Nutrition AI"],
    url: "www.foodpersonal.com",
  },
  {
    name: "NDA Company",
    tagline: "Web application to create, send, sign, and store legally structured NDAs quickly and securely for founders and teams.",
    status: "Beta",
    tags: ["Web App", "Legal Tech", "Security"],
    url: "www.nda.company",
  },
  {
    name: "SideStage",
    tagline: "Fan-powered mobile platform for capturing, organizing, and stitching live-music videos into shared concert experiences.",
    status: "In Development",
    tags: ["Mobile App", "Media Platform", "Product Strategy"],
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
              What We Are Building
            </h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
              A look at some of the recent products and platforms we are bringing to life.
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal direction="up" delay={100}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 max-w-5xl mx-auto items-stretch">
            {ventures.map((venture, index) => (
              <div
                key={index}
                className="bg-card/60 backdrop-blur-sm border border-border rounded-xl px-5 py-5 flex flex-col items-center text-center"
              >
                {/* Status */}
                <span
                  className="text-[10px] font-semibold uppercase tracking-widest mb-3"
                  style={{ color: BRAND_BLUE }}
                >
                  {venture.status}
                </span>

                {/* Name */}
                <h3 className="text-xl md:text-2xl font-bold text-foreground mb-2">
                  {venture.name}
                </h3>

                {/* Description — fixed height for alignment */}
                <p className="text-muted-foreground text-sm leading-relaxed mb-4 min-h-[4.5rem]">
                  {venture.tagline}
                </p>

                {/* Pills — pushed to consistent position via mt-auto */}
                <div className="mt-auto flex flex-wrap justify-center gap-1.5 mb-3">
                  {venture.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] font-medium px-2.5 py-0.5 rounded-full border border-secondary text-secondary"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Footer link */}
                {venture.url ? (
                  <a
                    href={`https://${venture.url}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-muted-foreground hover:text-secondary transition-colors underline underline-offset-2"
                  >
                    {venture.url}
                  </a>
                ) : (
                  <span className="text-xs text-transparent select-none">&nbsp;</span>
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

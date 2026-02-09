import React from 'react';
import ScrollReveal from '@/components/common/ScrollReveal';

const BRAND_BLUE = 'hsl(210, 55%, 55%)';

const ventures = [
  {
    name: "SideStage",
    tagline: "A fan-powered video platform that lets you stay in the moment at concerts.",
    status: "In Development",
    tags: ["Mobile App", "UX Research", "Product Strategy"],
  },
  {
    name: "Pardners",
    tagline: "Connecting generations through peer-to-peer mentorship and knowledge sharing.",
    status: "In Development",
    tags: ["Community", "Mentorship", "Platform"],
  },
  {
    name: "Private Pitches",
    tagline: "An exclusive platform connecting vendors directly with decision makers.",
    status: "Beta Launch June 2025",
    tags: ["Platform", "Matching Algorithm", "Analytics"],
  },
  {
    name: "Rated JC",
    tagline: "Comprehensive database of movies, shows and books that use the name Jesus Christ dishonorably.",
    status: "Beta Launch May 2025",
    tags: ["Web App", "Content Management", "SEO"],
    imageUrl: "/lovable-uploads/0c24f616-5309-4d29-8c19-556e61654622.png",
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
              A look at the products and platforms we're bringing to life.
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal direction="up" delay={100}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 max-w-4xl mx-auto">
            {ventures.map((venture, index) => (
              <div
                key={index}
                className="bg-card/60 backdrop-blur-sm border border-border rounded-xl px-6 py-5 md:px-8 md:py-6 flex flex-col items-center text-center"
              >
                {venture.imageUrl && (
                  <div className="w-full max-w-[200px] mb-4 rounded-lg overflow-hidden">
                    <img
                      src={venture.imageUrl}
                      alt={venture.name}
                      className="w-full h-28 object-cover"
                      loading="lazy"
                    />
                  </div>
                )}
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
              </div>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default Portfolio;

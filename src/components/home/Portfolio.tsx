import React, { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
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
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'center' });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    emblaApi.on('select', onSelect);
    onSelect();
    return () => { emblaApi.off('select', onSelect); };
  }, [emblaApi]);

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
          <div className="relative max-w-4xl mx-auto">
            {/* Carousel */}
            <div className="overflow-hidden" ref={emblaRef}>
              <div className="flex">
                {ventures.map((venture, index) => (
                  <div
                    key={index}
                    className="flex-[0_0_100%] min-w-0 px-4"
                  >
                    <div className="bg-card/60 backdrop-blur-sm border border-border rounded-2xl p-8 md:p-12 flex flex-col items-center text-center">
                      {venture.imageUrl && (
                        <div className="w-full max-w-sm mb-8 rounded-xl overflow-hidden">
                          <img
                            src={venture.imageUrl}
                            alt={venture.name}
                            className="w-full h-48 object-cover"
                            loading="lazy"
                          />
                        </div>
                      )}
                      <span
                        className="text-xs font-semibold uppercase tracking-widest mb-3"
                        style={{ color: BRAND_BLUE }}
                      >
                        {venture.status}
                      </span>
                      <h3 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                        {venture.name}
                      </h3>
                      <p className="text-muted-foreground text-lg leading-relaxed max-w-lg mb-6">
                        {venture.tagline}
                      </p>
                      <div className="flex flex-wrap justify-center gap-2">
                        {venture.tags.map((tag) => (
                          <span
                            key={tag}
                            className="text-xs font-medium px-3 py-1 rounded-full border border-border text-muted-foreground"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-center gap-6 mt-8">
              <button
                onClick={scrollPrev}
                className="p-2 rounded-full border border-border text-muted-foreground hover:text-foreground hover:border-muted-foreground/50 transition-colors"
                aria-label="Previous project"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>

              <div className="flex gap-2">
                {ventures.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => emblaApi?.scrollTo(index)}
                    className="w-2 h-2 rounded-full transition-all duration-300"
                    style={{
                      backgroundColor: index === selectedIndex ? BRAND_BLUE : 'hsl(var(--muted-foreground) / 0.3)',
                    }}
                    aria-label={`Go to project ${index + 1}`}
                  />
                ))}
              </div>

              <button
                onClick={scrollNext}
                className="p-2 rounded-full border border-border text-muted-foreground hover:text-foreground hover:border-muted-foreground/50 transition-colors"
                aria-label="Next project"
              >
                <ArrowRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default Portfolio;


import React from 'react';
import PageLayout from '@/components/layout/PageLayout';
import { ArrowRight, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';

const Ventures = () => {
  const ventures = [
    {
      name: "SideStage",
      tagline: "A fan-powered video platform that lets you stay in the moment at concerts.",
      description: "SideStage helps music fans enjoy live shows without experiencing them through a phone screen. Through our platform, fans can access professional-quality videos of concerts they attended, share their favorite moments, and connect with other attendees.",
      color: "border-gb-blue",
      status: "In Development",
      link: "#"
    },
    {
      name: "Pardners",
      tagline: "Helping people connect through shared affinities and real-life events.",
      description: "Pardners is a community platform that brings together like-minded individuals through shared interests, facilitating meaningful connections and in-person gatherings. We're building tools to help people move from online interaction to real-world relationships.",
      color: "border-gb-green",
      status: "Coming Soon",
      link: "#"
    },
    {
      name: "Rated JC",
      tagline: "A guide for faith-conscious families to find entertainment that honors Jesus.",
      description: "Rated JC provides thoughtful, nuanced reviews of movies, TV shows, books, and games from a Christian perspective. We help families make informed decisions about media consumption while fostering meaningful conversations about faith and culture.",
      color: "border-gb-purple",
      status: "Beta Launch",
      link: "#"
    }
  ];

  return (
    <PageLayout>
      {/* Hero Section */}
      <section className="bg-gb-dark text-white">
        <div className="container-custom py-20">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Our Projects
            </h1>
            <p className="text-xl text-white/80">
              We're building businesses that solve meaningful problems and create lasting value.
            </p>
          </div>
        </div>
      </section>

      {/* Ventures Overview */}
      <section className="bg-white">
        <div className="container-custom py-20">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl font-bold text-gb-dark mb-6">Current Projects</h2>
            <p className="text-lg text-gb-dark/80">
              These are the companies we're currently building and developing in our venture studio.
            </p>
          </div>

          <div className="space-y-16">
            {ventures.map((venture, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div className={`order-2 md:order-${index % 2 === 0 ? 2 : 1}`}>
                  <div className={`venture-card ${venture.color}`}>
                    <span className="inline-block px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium mb-4">
                      {venture.status}
                    </span>
                    <h3 className="text-2xl font-bold text-gb-dark mb-2">{venture.name}</h3>
                    <p className="text-lg font-medium text-gb-dark/80 mb-4 italic">
                      {venture.tagline}
                    </p>
                    <p className="text-gb-dark/70 mb-6">
                      {venture.description}
                    </p>
                    <Button asChild variant="outline" className="mt-auto inline-flex items-center">
                      <a href={venture.link} target="_blank" rel="noopener noreferrer">
                        Learn More
                        <ExternalLink className="ml-2 h-4 w-4" />
                      </a>
                    </Button>
                  </div>
                </div>
                <div className={`order-1 md:order-${index % 2 === 0 ? 1 : 2} flex ${index % 2 === 0 ? 'justify-end' : 'justify-start'}`}>
                  {index === 0 ? (
                    // iPhone mockup for SideStage app - using the new image
                    <div className="flex justify-end pr-0 md:pr-6">
                      <img 
                        src="/lovable-uploads/35487980-8600-4a91-a5a8-b226968d1e70.png" 
                        alt="SideStage Mobile App" 
                        className="h-auto w-auto max-h-[500px]"
                      />
                    </div>
                  ) : (
                    <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                      {/* Placeholder for other venture images */}
                      <div className="w-full h-full flex items-center justify-center bg-gb-blue/10 text-gb-blue">
                        {venture.name} Preview
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Investment Philosophy */}
      <section className="bg-gray-50">
        <div className="container-custom py-20">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-gb-dark mb-6 text-center">Our Investment Philosophy</h2>
            <p className="text-lg text-gb-dark/80 mb-8 text-center">
              Beyond building our own ventures, we also invest in and partner with mission-aligned founders who are creating impactful businesses.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
              <div className="bg-white p-8 rounded-lg shadow-sm">
                <h3 className="text-xl font-bold text-gb-dark mb-4">What We Look For</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <span className="text-gb-green font-bold mr-2">•</span>
                    <span>Purpose-driven founders solving real problems</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-gb-green font-bold mr-2">•</span>
                    <span>Businesses with scalable models and clear unit economics</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-gb-green font-bold mr-2">•</span>
                    <span>Ventures that create positive social impact</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-gb-green font-bold mr-2">•</span>
                    <span>Leaders committed to building healthy cultures</span>
                  </li>
                </ul>
              </div>

              <div className="bg-white p-8 rounded-lg shadow-sm">
                <h3 className="text-xl font-bold text-gb-dark mb-4">How We Help</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <span className="text-gb-blue font-bold mr-2">•</span>
                    <span>Strategic guidance and mentorship</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-gb-blue font-bold mr-2">•</span>
                    <span>Access to our network and resources</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-gb-blue font-bold mr-2">•</span>
                    <span>Operational support in key growth areas</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-gb-blue font-bold mr-2">•</span>
                    <span>Software development services</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-gb-blue font-bold mr-2">•</span>
                    <span>Capital for sustainable growth</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA - Updated to link to the contact page */}
      <section className="bg-gb-dark text-white">
        <div className="container-custom py-20">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Building or investing in a venture?</h2>
            <p className="text-xl text-white/80 mb-8">
              We're always interested in connecting with mission-aligned founders and investors.
            </p>
            <Button asChild className="btn-primary text-lg group">
              <Link to="/contact">
                Start a Conversation
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default Ventures;

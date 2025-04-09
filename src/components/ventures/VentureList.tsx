
import React from 'react';
import VentureCard from './VentureCard';

const ventures = [
  {
    name: "SideStage",
    tagline: "A fan-powered video platform that lets you stay in the moment at concerts.",
    description: "SideStage helps music fans enjoy live shows without experiencing them through a phone screen. Through our platform, fans can access professional-quality videos of concerts they attended, share their favorite moments, and connect with other attendees.",
    color: "border-gb-blue",
    status: "In Development",
    link: "#",
    services: [
      "Mobile App Design",
      "UX Research",
      "Branding Strategy",
      "Technical Architecture",
      "Product Strategy"
    ]
  },
  {
    name: "Pardners",
    tagline: "Helping people connect through shared affinities and real-life events.",
    description: "Pardners is a community platform that brings together like-minded individuals through shared interests, facilitating meaningful connections and in-person gatherings. We're building tools to help people move from online interaction to real-world relationships.",
    color: "border-gb-blue",
    status: "In Development",
    link: "#",
    services: [
      "Product Vision",
      "Wireframing",
      "User Testing",
      "Community Strategy",
      "Frontend Development"
    ]
  }
];

const VentureList = () => {
  return (
    <section className="bg-white">
      <div className="container-custom py-20">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl font-bold text-gb-dark mb-6">Current Projects</h2>
          <p className="text-lg text-gb-dark/80">
            These are the companies we're currently building and developing in our venture studio.
          </p>
        </div>

        <div className="space-y-16 max-w-5xl mx-auto">
          {ventures.map((venture, index) => (
            <VentureCard key={index} venture={venture} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default VentureList;

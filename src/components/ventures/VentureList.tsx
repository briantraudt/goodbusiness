
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
  },
  {
    name: "Private Pitches",
    tagline: "An exclusive platform connecting vendors directly with decision makers.",
    description: "Private Pitches eliminates the traditional inefficiencies of trade shows by facilitating direct connections between vendors and qualified buyers. Our platform ensures vendors get in front of the right decision makers, while buyers save time by meeting only with relevant suppliers.",
    color: "border-gb-yellow",
    status: "Beta Launch June 2025",
    link: "#",
    services: [
      "Platform Development",
      "UI/UX Design",
      "Matching Algorithm",
      "Virtual Meeting Tools",
      "Analytics Dashboard"
    ]
  },
  {
    name: "Rated JC",
    tagline: "Comprehensive database of movies, shows and books that use the name Jesus Christ dishonorably.",
    description: "In a world where entertainment often disrespects the sacred, we're making it easy to filter what you watch. Search thousands of movies, tv shows and books and Instantly see if a show takes the Lord's name in vain so you and your family can watch with peace of mind.",
    color: "border-gb-green",
    status: "Beta Launch May 2025",
    link: "#",
    services: [
      "Web Development",
      "Community Building",
      "Local Business Strategy",
      "Content Management",
      "SEO Optimization"
    ],
    imageUrl: "/lovable-uploads/0c24f616-5309-4d29-8c19-556e61654622.png"
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


import React from 'react';

export const AboutHero = () => {
  return (
    <section className="bg-gb-dark text-white">
      <div className="container-custom py-20">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            About Us
          </h1>
          <p className="text-xl text-white/80">
            We're on a mission to build good businesses that create lasting impact.
          </p>
        </div>
      </div>
    </section>
  );
};

export const AboutMission = () => {
  return (
    <section className="bg-white">
      <div className="container-custom py-16">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-gb-dark mb-6">Our Mission</h2>
          <p className="text-lg text-gb-dark/80">
            At Good Business, we believe in building sustainable companies that create value for customers, employees, and shareholders alike. We're committed to developing software and businesses that make a positive impact in the world.
          </p>
        </div>
      </div>
    </section>
  );
};

export const AboutValues = () => {
  return (
    <section className="bg-gray-50">
      <div className="container-custom py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gb-dark mb-8 text-center">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-bold text-gb-dark mb-3">Purposeful Innovation</h3>
              <p className="text-gb-dark/80">We innovate with purpose, always focusing on solving real problems that create meaningful value.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-bold text-gb-dark mb-3">Sustainable Growth</h3>
              <p className="text-gb-dark/80">We build for the long-term, prioritizing sustainable growth over short-term gains.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-bold text-gb-dark mb-3">People First</h3>
              <p className="text-gb-dark/80">We put people at the center of everything we do, creating environments where teams thrive.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-bold text-gb-dark mb-3">Build With Integrity</h3>
              <p className="text-gb-dark/80">We operate with honesty and transparency, building trust with our customers and partners.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export const AboutTeam = () => {
  return (
    <section className="bg-white">
      <div className="container-custom py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gb-dark mb-8 text-center">Our Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto mb-4"></div>
              <h3 className="text-xl font-bold text-gb-dark">Brian Trevena</h3>
              <p className="text-gb-dark/80">CEO & Founder</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const About = () => {
  return (
    <div>
      <AboutHero />
      <AboutMission />
      <AboutValues />
      <AboutTeam />
    </div>
  );
};

export default About;

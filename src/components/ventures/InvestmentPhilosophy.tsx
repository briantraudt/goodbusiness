
import React from 'react';

const InvestmentPhilosophy = () => {
  return (
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
  );
};

export default InvestmentPhilosophy;

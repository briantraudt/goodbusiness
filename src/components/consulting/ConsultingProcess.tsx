
import React from 'react';

const ConsultingProcess = () => {
  return (
    <section className="bg-white">
      <div className="container-custom py-20">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-gb-dark mb-6 text-center">Our Process</h2>
          
          <div className="space-y-12 mt-12">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="md:w-16 flex-shrink-0 flex md:flex-col items-center md:items-start">
                <div className="bg-gb-green text-white h-10 w-10 rounded-full flex items-center justify-center font-bold text-lg">1</div>
                <div className="hidden md:block w-px h-full bg-gray-200 mx-auto mt-2"></div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gb-dark mb-2">Discovery & Diagnosis</h3>
                <p className="text-gb-dark/80 mb-4">
                  We start by understanding your business, challenges, and goals through in-depth conversations and analysis.
                </p>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row gap-6">
              <div className="md:w-16 flex-shrink-0 flex md:flex-col items-center md:items-start">
                <div className="bg-gb-blue text-white h-10 w-10 rounded-full flex items-center justify-center font-bold text-lg">2</div>
                <div className="hidden md:block w-px h-full bg-gray-200 mx-auto mt-2"></div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gb-dark mb-2">Strategy Development</h3>
                <p className="text-gb-dark/80 mb-4">
                  We collaborate with you to create a tailored plan that addresses your specific needs and opportunities.
                </p>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row gap-6">
              <div className="md:w-16 flex-shrink-0 flex md:flex-col items-center md:items-start">
                <div className="bg-gb-purple text-white h-10 w-10 rounded-full flex items-center justify-center font-bold text-lg">3</div>
                <div className="hidden md:block w-px h-full bg-gray-200 mx-auto mt-2"></div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gb-dark mb-2">Implementation Support</h3>
                <p className="text-gb-dark/80 mb-4">
                  Unlike traditional consultants, we roll up our sleeves and help you execute the plan, making adjustments as needed.
                </p>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row gap-6">
              <div className="md:w-16 flex-shrink-0 flex md:flex-col items-center md:items-start">
                <div className="bg-gb-yellow text-white h-10 w-10 rounded-full flex items-center justify-center font-bold text-lg">4</div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gb-dark mb-2">Ongoing Partnership</h3>
                <p className="text-gb-dark/80 mb-4">
                  We provide regular check-ins, accountability, and guidance to ensure lasting results and continued growth.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ConsultingProcess;

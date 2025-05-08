
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
                <h3 className="text-xl font-bold text-gb-dark mb-2">Business Evaluator</h3>
                <p className="text-gb-dark/80 mb-4">
                  Use our streamlined Business Evaluator tool to share your idea with us. We'll help you analyze its potential and determine if it's a good fit for development.
                </p>
                <Link to="/contact">
                  <Button variant="outline" className="group">
                    Start evaluation <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row gap-6">
              <div className="md:w-16 flex-shrink-0 flex md:flex-col items-center md:items-start">
                <div className="bg-gb-blue text-white h-10 w-10 rounded-full flex items-center justify-center font-bold text-lg">2</div>
                <div className="hidden md:block w-px h-full bg-gray-200 mx-auto mt-2"></div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gb-dark mb-2">Private Invitation</h3>
                <p className="text-gb-dark/80 mb-4">
                  After reviewing your evaluation, we'll send a private invitation to discuss your idea further. This allows us to explore potential solutions and determine the best path forward.
                </p>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row gap-6">
              <div className="md:w-16 flex-shrink-0 flex md:flex-col items-center md:items-start">
                <div className="bg-gb-purple text-white h-10 w-10 rounded-full flex items-center justify-center font-bold text-lg">3</div>
                <div className="hidden md:block w-px h-full bg-gray-200 mx-auto mt-2"></div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gb-dark mb-2">7-Day Prototype</h3>
                <p className="text-gb-dark/80 mb-4">
                  We build a working prototype in just 7 days, giving you something tangible to test and evaluate. Together, we'll discuss if the idea has merit and determine next steps.
                </p>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row gap-6">
              <div className="md:w-16 flex-shrink-0 flex md:flex-col items-center md:items-start">
                <div className="bg-gb-yellow text-white h-10 w-10 rounded-full flex items-center justify-center font-bold text-lg">4</div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gb-dark mb-2">Market-Ready Product</h3>
                <p className="text-gb-dark/80 mb-4">
                  For ideas with proven potential, we complete development of a market-ready product with all the features and polish needed for a successful launch.
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

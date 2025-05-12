
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ScrollToTopLink from '@/components/common/ScrollToTopLink';

const ConsultingProcess = () => {
  return (
    <section className="bg-white">
      <div className="container-custom py-20">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-gb-dark mb-6 text-center">Our Process</h2>
          <p className="text-gb-dark/80 text-center mb-10">
            We turn good ideas into great products—with a clear path from concept to launch.
          </p>
          
          <div className="space-y-12 mt-12">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="md:w-16 flex-shrink-0 flex md:flex-col items-center md:items-start">
                <div className="bg-gb-green text-white h-10 w-10 rounded-full flex items-center justify-center font-bold text-lg">1</div>
                <div className="hidden md:block w-px h-full bg-gray-200 mx-auto mt-2"></div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gb-dark mb-2">Evaluate the Idea</h3>
                <p className="text-gb-dark/80 mb-4">
                  Start by sharing your idea. We'll help assess its potential and determine if it's a strong fit for development and long-term growth.
                </p>
                <ScrollToTopLink to="/evaluator">
                  <Button variant="outline" className="group">
                    Try Our Idea Evaluator <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </ScrollToTopLink>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row gap-6">
              <div className="md:w-16 flex-shrink-0 flex md:flex-col items-center md:items-start">
                <div className="bg-gb-blue text-white h-10 w-10 rounded-full flex items-center justify-center font-bold text-lg">2</div>
                <div className="hidden md:block w-px h-full bg-gray-200 mx-auto mt-2"></div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gb-dark mb-2">Explore Partnership</h3>
                <p className="text-gb-dark/80 mb-4">
                  If the idea shows promise, we'll meet with you to explore how we might partner—whether through co-building, funding, or strategic support.
                </p>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row gap-6">
              <div className="md:w-16 flex-shrink-0 flex md:flex-col items-center md:items-start">
                <div className="bg-gb-purple text-white h-10 w-10 rounded-full flex items-center justify-center font-bold text-lg">3</div>
                <div className="hidden md:block w-px h-full bg-gray-200 mx-auto mt-2"></div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gb-dark mb-2">Build a 7-Day Prototype</h3>
                <p className="text-gb-dark/80 mb-4">
                  In just one week, we'll bring your concept to life with a working prototype you can see, test, and share. Then we'll review what worked, what didn't, and what comes next.
                </p>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row gap-6">
              <div className="md:w-16 flex-shrink-0 flex md:flex-col items-center md:items-start">
                <div className="bg-gb-yellow text-white h-10 w-10 rounded-full flex items-center justify-center font-bold text-lg">4</div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gb-dark mb-2">Launch a Market-Ready Product</h3>
                <p className="text-gb-dark/80 mb-4">
                  If your idea proves viable, we'll develop a full product with the features, polish, and scalability needed for a successful launch.
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

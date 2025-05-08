
import React from 'react';
import { ArrowDown } from 'lucide-react';

const ContactHero = () => {
  const scrollToEvaluator = () => {
    const evaluatorSection = document.querySelector('.evaluator-section');
    if (evaluatorSection) {
      evaluatorSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="bg-gradient-to-br from-gb-dark to-gb-dark/90 text-white">
      <div className="container-custom py-20 md:py-28">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Turn Your Idea Into Reality
            </h1>
            <p className="text-xl text-white/80 mb-8">
              We don't care if you have an idea on a cocktail napkin, a dusty business plan, or it's all in your head. 
              If you think it's good, then we want to know about it.
            </p>
            <button 
              onClick={scrollToEvaluator}
              className="flex items-center gap-2 bg-gb-green hover:bg-gb-green/90 text-white px-6 py-3 rounded-md transition-all"
            >
              Start Now <ArrowDown className="h-5 w-5" />
            </button>
          </div>
          
          <div className="hidden md:flex justify-center">
            <div className="relative">
              <div className="absolute -top-16 -right-16 w-64 h-64 bg-gb-blue/20 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-8 -left-8 w-48 h-48 bg-gb-purple/20 rounded-full blur-3xl"></div>
              <img 
                src="https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=600&q=80" 
                alt="Laptop with code" 
                className="rounded-lg shadow-xl relative z-10 max-w-md border-4 border-white/10"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactHero;

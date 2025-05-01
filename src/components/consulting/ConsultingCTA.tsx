
import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const ConsultingCTA = () => {
  return (
    <section className="bg-gb-dark text-white">
      <div className="container-custom py-20">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">
            Ready to start building a Go<span className="text-gb-green">o</span>d Business?
          </h2>
          <p className="text-xl text-white/80 mb-8">
            Let's discuss how we can help you achieve your business goals and create lasting impact.
          </p>
          <Button asChild className="btn-primary text-lg group">
            <Link to="/contact">
              Book a Call
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ConsultingCTA;

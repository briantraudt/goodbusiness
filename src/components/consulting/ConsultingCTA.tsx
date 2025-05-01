
import React from 'react';
import { ArrowRight, Rocket } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const ConsultingCTA = () => {
  return (
    <section className="bg-gb-dark text-white">
      <div className="container-custom py-20">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">
            Ready to Launch Your Idea in 7 Days?
          </h2>
          <p className="text-xl text-white/80 mb-8">
            Don't wait months to see your vision come to life. Let's start building today.
          </p>
          <Button asChild className="btn-primary text-lg group bg-gb-green hover:bg-gb-green/90">
            <Link to="/contact">
              Start Building Now
              <Rocket className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ConsultingCTA;

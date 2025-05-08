
import React from 'react';
import { Separator } from "@/components/ui/separator";

const Intro = () => {
  return (
    <section className="bg-gb-dark">
      <div className="container-custom py-8">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-xl md:text-2xl text-white font-serif leading-relaxed flex flex-col items-center justify-center">
            <span className="text-white font-medium">"The secret of getting ahead is getting started."</span>
            <span className="text-right block mt-1 text-sm md:text-base text-white/80">- Mark Twain</span>
          </p>
        </div>
      </div>
    </section>
  );
};

export default Intro;

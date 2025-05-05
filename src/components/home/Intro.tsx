
import React from 'react';
import { Separator } from "@/components/ui/separator";

const Intro = () => {
  return (
    <section className="bg-gb-green/20">
      <div className="container-custom py-12">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-xl md:text-2xl text-white leading-relaxed flex flex-col items-center justify-center">
            "GOOD, FAST AND CHEAP - CHOOSE 3."
            <br />
            <span className="text-right block mt-2 text-sm md:text-base text-white/80">-US</span>
          </p>
        </div>
      </div>
    </section>
  );
};

export default Intro;

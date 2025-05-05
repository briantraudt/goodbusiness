
import React from 'react';
import { Separator } from "@/components/ui/separator";

const Intro = () => {
  return (
    <section className="bg-white">
      <div className="container-custom py-12">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-xl md:text-2xl text-gb-dark/80 leading-relaxed flex flex-col items-center justify-center">
            "GOOD, FAST AND CHEAP - CHOOSE 3."
            <br />
            <span className="text-right block mt-2 text-sm md:text-base">-US</span>
          </p>
        </div>
      </div>
    </section>
  );
};

export default Intro;

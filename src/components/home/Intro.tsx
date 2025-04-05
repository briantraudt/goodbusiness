
import React from 'react';
import { Separator } from "@/components/ui/separator";

const Intro = () => {
  return (
    <section className="bg-white">
      <div className="container-custom section-padding">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-xl md:text-2xl text-gb-dark/80 leading-relaxed">
            "The two most important days in your life are the day you are born and the day you find out why."
          </p>
          <p className="text-lg text-gb-dark/70 mt-4">
            — Mark Twain
          </p>
        </div>
      </div>
    </section>
  );
};

export default Intro;

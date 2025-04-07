
import React from 'react';
import { Separator } from "@/components/ui/separator";

const Intro = () => {
  return (
    <section className="bg-white">
      <div className="container-custom section-padding">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-xl md:text-2xl text-gb-dark/80 leading-relaxed">
            "THE TWO MOST IMPORTANT DAYS IN YOUR LIFE ARE THE DAY YOU ARE BORN AND THE DAY YOU FIND OUT WHY."
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

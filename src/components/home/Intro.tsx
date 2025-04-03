
import React from 'react';
import { Separator } from "@/components/ui/separator";

const Intro = () => {
  return (
    <section className="bg-white">
      <div className="container-custom section-padding">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-xl md:text-2xl text-gb-dark/80 leading-relaxed">
            We believe a <span className="text-gb-green font-medium">Good Business</span> should be two things:
          </p>
          <p className="text-xl md:text-2xl text-gb-dark/80 leading-relaxed">
            <span className="font-semibold">Be Transforming + Be Profitable</span>.
          </p>
          <Separator className="my-4 bg-gb-green/30 w-24 mx-auto h-[2px]" />
          <p className="text-xl md:text-2xl text-gb-dark/80 leading-relaxed">
            <span className="mt-4 block"></span>
            We partner with purpose-driven leaders to build ventures that solve real world problems and create lasting value for all stakeholders.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Intro;

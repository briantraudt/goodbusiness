
import React from 'react';
import ScrollReveal from '@/components/common/ScrollReveal';
import { TrendingDown, Clock, Zap } from 'lucide-react';

const SolutionSection = () => {
  const stats = [
    {
      icon: <TrendingDown className="h-6 w-6" />,
      value: "10x",
      label: "Lower cost vs enterprise SaaS",
      color: "text-gb-green"
    },
    {
      icon: <Clock className="h-6 w-6" />,
      value: "Weeks",
      label: "Not months to launch",
      color: "text-gb-blue"
    },
    {
      icon: <Zap className="h-6 w-6" />,
      value: "100%",
      label: "Yours to own forever",
      color: "text-gb-purple"
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container-custom">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Content */}
          <ScrollReveal direction="left">
            <div>
              <span className="inline-block text-gb-green font-semibold text-sm uppercase tracking-wider mb-4">
                The Post-SaaS Era
              </span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gb-dark mb-6 leading-tight">
                Build What Actually Runs Your Business
              </h2>
              <p className="text-lg text-gb-dark/70 mb-6">
                AI has changed the economics of software. What used to require large teams and long timelines can now be built quickly, affordably, and precisely.
              </p>
              <p className="text-lg text-gb-dark/70 mb-8">
                Good Business designs and builds custom, AI-native software that replaces generic tools and gives you control over the systems that matter most.
              </p>
              <div className="border-l-4 border-gb-green pl-6 py-3 bg-gb-green/5 rounded-r-lg">
                <p className="text-xl text-gb-dark font-semibold">
                  This isn't anti-SaaS.
                  <span className="text-gb-green ml-2">It's post-SaaS.</span>
                </p>
              </div>
            </div>
          </ScrollReveal>

          {/* Right: Stats */}
          <ScrollReveal direction="right">
            <div className="grid gap-6">
              {stats.map((stat, index) => (
                <div 
                  key={index}
                  className="flex items-center gap-5 p-6 bg-slate-50 rounded-xl border border-slate-100 hover:border-slate-200 hover:shadow-sm transition-all"
                >
                  <div className={`p-3 rounded-lg bg-white shadow-sm ${stat.color}`}>
                    {stat.icon}
                  </div>
                  <div>
                    <div className={`text-3xl md:text-4xl font-bold ${stat.color}`}>
                      {stat.value}
                    </div>
                    <div className="text-gb-dark/60 font-medium">
                      {stat.label}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
};

export default SolutionSection;

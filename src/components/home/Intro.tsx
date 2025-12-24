
import React from 'react';
import { Code, Brain, Rocket, Zap } from 'lucide-react';

const Intro = () => {
  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container-custom">
        <div className="text-center max-w-4xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Building the Future with Code & AI
          </h2>
          <p className="text-lg text-muted-foreground">
            We specialize in creating custom software solutions that leverage the latest in artificial intelligence. Whether you need a web application, mobile app, or AI-powered automation, we deliver technology that drives results.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center p-6">
            <div className="w-14 h-14 bg-gb-green/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Code className="w-7 h-7 text-gb-green" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">Custom Development</h3>
            <p className="text-sm text-muted-foreground">Tailored software built to your exact specifications</p>
          </div>
          
          <div className="text-center p-6">
            <div className="w-14 h-14 bg-gb-blue/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Brain className="w-7 h-7 text-gb-blue" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">AI Integration</h3>
            <p className="text-sm text-muted-foreground">Smart features powered by cutting-edge AI models</p>
          </div>
          
          <div className="text-center p-6">
            <div className="w-14 h-14 bg-gb-purple/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Rocket className="w-7 h-7 text-gb-purple" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">Rapid Delivery</h3>
            <p className="text-sm text-muted-foreground">From concept to deployment in weeks, not months</p>
          </div>
          
          <div className="text-center p-6">
            <div className="w-14 h-14 bg-gb-orange/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Zap className="w-7 h-7 text-gb-orange" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">Scalable Solutions</h3>
            <p className="text-sm text-muted-foreground">Built to grow with your business needs</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Intro;

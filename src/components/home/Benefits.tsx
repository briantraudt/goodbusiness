
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Timer, DollarSign, ShieldCheck, Users } from 'lucide-react';

const Benefits = () => {
  const benefits = [
    {
      title: "Speed & Efficiency",
      description: "Don't wait months to see your idea come to life. Our rapid development process gets your concept into a working prototype in just days.",
      icon: <Timer className="h-7 w-7 text-gb-blue" />
    },
    {
      title: "Cost & Value",
      description: "Test your app idea without breaking the bank. Our focused approach means you invest only in what works.",
      icon: <DollarSign className="h-7 w-7 text-gb-green" />
    },
    {
      title: "Feedback & Validation",
      description: "Validate your app idea with real users before committing significant resources. Pivot early if needed, not after major investment.",
      icon: <ShieldCheck className="h-7 w-7 text-gb-purple" />
    },
    {
      title: "Scale & Growth",
      description: "Get your app in front of users quickly and start building a community of early adopters who provide invaluable feedback.",
      icon: <Users className="h-7 w-7 text-gb-orange" />
    }
  ];

  return (
    <section className="bg-white py-16 md:py-28">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gb-dark">Why Innovators Work With Us</h2>
          <p className="mt-4 text-lg text-gb-dark/70 max-w-2xl mx-auto">
            Turn your app idea into reality faster and smarter
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">
          {benefits.map((benefit, index) => (
            <Card key={index} className="border border-gray-100 shadow-sm hover:shadow-md transition-all p-2">
              <CardHeader className="flex flex-row items-center gap-4 pb-4">
                <div className="p-2 bg-gray-50 rounded-lg">
                  {benefit.icon}
                </div>
                <CardTitle className="text-xl font-semibold text-gb-dark">{benefit.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gb-dark/70 text-base">{benefit.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Benefits;

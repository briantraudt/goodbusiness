
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import PageLayout from '@/components/layout/PageLayout';
import { format } from 'date-fns';
import { CheckCircle2, Clock, Video, User, FileText, BookOpen } from 'lucide-react';

const Training = () => {
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  // Available time slots (you can modify these)
  const timeSlots = [
    '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'
  ];

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedDate || !selectedTime || !name.trim() || !email.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all fields and select a date and time.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { data, error } = await supabase.functions.invoke('create-training-payment', {
        body: {
          email: email.trim(),
          name: name.trim(),
          selectedDate: format(selectedDate, 'MMMM dd, yyyy'),
          selectedTime: selectedTime,
        },
      });

      if (error) throw error;

      if (data?.url) {
        // Open Stripe checkout in a new tab
        window.open(data.url, '_blank');
      }
    } catch (error) {
      console.error('Error creating payment session:', error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Disable past dates
  const isDateDisabled = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const learningItems = [
    {
      icon: <BookOpen className="h-6 w-6 text-gb-green" />,
      text: "How to use AI tools to build websites and software without coding"
    },
    {
      icon: <BookOpen className="h-6 w-6 text-gb-blue" />,
      text: "Creating mobile web apps with AI assistance"
    },
    {
      icon: <BookOpen className="h-6 w-6 text-gb-purple" />,
      text: "Software development basics and best practices"
    },
    {
      icon: <BookOpen className="h-6 w-6 text-gb-orange" />,
      text: "Choosing the right AI tools for your project"
    },
    {
      icon: <BookOpen className="h-6 w-6 text-gb-green" />,
      text: "Hands-on practice with real examples"
    }
  ];

  const sessionDetails = [
    {
      icon: <Clock className="h-6 w-6 text-gb-blue" />,
      label: "Duration:",
      text: "1 hour one-on-one session"
    },
    {
      icon: <Video className="h-6 w-6 text-gb-green" />,
      label: "Format:",
      text: "Live video call via Zoom"
    },
    {
      icon: <User className="h-6 w-6 text-gb-purple" />,
      label: "Personalized:",
      text: "Tailored to your specific needs"
    },
    {
      icon: <FileText className="h-6 w-6 text-gb-orange" />,
      label: "Follow-up:",
      text: "Recording provided after session"
    },
    {
      icon: <BookOpen className="h-6 w-6 text-gb-blue" />,
      label: "Resources:",
      text: "Curated list of tools and guides"
    }
  ];

  return (
    <PageLayout>
      <div className="bg-white min-h-screen">
        {/* Hero Section */}
        <div className="bg-gb-dark text-white">
          <div className="container-custom section-padding">
            <div className="text-center max-w-4xl mx-auto">
              <h1 className="text-5xl md:text-6xl font-bold mb-6">
                AI 101 Training Class
              </h1>
              <p className="text-xl mb-8 opacity-90">
                Learn the very basics of how to build your own website, software, and apps with AI assistance. 
                One-on-one personalized training session.
              </p>
              <div className="bg-gb-green text-white text-2xl font-bold py-4 px-8 rounded-lg inline-block">
                $250 for 1 Hour Session
              </div>
            </div>
          </div>
        </div>

        {/* Course Details */}
        <div className="bg-white">
          <div className="container-custom py-20">
            <div className="text-center mb-12">
              <p className="text-lg md:text-xl text-gb-dark leading-relaxed max-w-4xl mx-auto">
                At Good Business, we specialize in transforming ideas into real, working products—quickly and
                collaboratively. Whether you're refining a concept, designing a user-friendly interface, validating a
                prototype, or building a scalable app, our team walks with you every step of the way. We don't just offer
                advice—we roll up our sleeves and help you build something great.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-12 mb-16">
              <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all flex flex-col h-full">
                <div className="flex flex-col items-center text-center mb-6">
                  <BookOpen className="h-10 w-10 text-gb-green mb-4" />
                  <h3 className="text-2xl font-bold text-gb-dark mb-2">What You'll Learn</h3>
                  <p className="text-gb-dark/70">Master the fundamentals of AI-assisted development through hands-on learning.</p>
                </div>
                
                <ul className="space-y-3 text-left w-full">
                  {learningItems.map((item, i) => (
                    <li key={i} className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-gb-green mr-3 flex-shrink-0 mt-0.5" />
                      <span className="text-gb-dark/80">{item.text}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all flex flex-col h-full">
                <div className="flex flex-col items-center text-center mb-6">
                  <Video className="h-10 w-10 text-gb-blue mb-4" />
                  <h3 className="text-2xl font-bold text-gb-dark mb-2">Session Details</h3>
                  <p className="text-gb-dark/70">Everything you need to know about your personalized training experience.</p>
                </div>
                
                <ul className="space-y-3 text-left w-full">
                  {sessionDetails.map((detail, i) => (
                    <li key={i} className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-gb-blue mr-3 flex-shrink-0 mt-0.5" />
                      <span className="text-gb-dark/80">
                        <strong>{detail.label}</strong> {detail.text}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Booking Section */}
            <Card className="max-w-4xl mx-auto shadow-lg">
              <CardHeader className="text-center bg-gb-light">
                <CardTitle className="text-3xl text-gb-dark">Book Your Session</CardTitle>
                <p className="text-gray-600">Select a date and time that works for you</p>
              </CardHeader>
              <CardContent className="p-8">
                <form onSubmit={handleBooking} className="space-y-8">
                  <div className="grid md:grid-cols-2 gap-8">
                    {/* Contact Information */}
                    <div className="space-y-4">
                      <h3 className="text-xl font-semibold text-gb-dark">Your Information</h3>
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          type="text"
                          placeholder="Enter your full name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="Enter your email address"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    {/* Date Selection */}
                    <div className="space-y-4">
                      <h3 className="text-xl font-semibold text-gb-dark">Select Date</h3>
                      <div className="flex justify-center">
                        <Calendar
                          mode="single"
                          selected={selectedDate}
                          onSelect={setSelectedDate}
                          disabled={isDateDisabled}
                          className="rounded-md border"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Time Selection */}
                  {selectedDate && (
                    <div className="space-y-4">
                      <h3 className="text-xl font-semibold text-gb-dark">
                        Select Time for {format(selectedDate, 'MMMM dd, yyyy')}
                      </h3>
                      <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
                        {timeSlots.map((time) => (
                          <Button
                            key={time}
                            type="button"
                            variant={selectedTime === time ? "default" : "outline"}
                            className={selectedTime === time ? "bg-gb-green hover:bg-gb-green/90" : ""}
                            onClick={() => setSelectedTime(time)}
                          >
                            {time}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Submit Button */}
                  <div className="text-center pt-6">
                    <Button
                      type="submit"
                      className="bg-gb-blue hover:bg-gb-blue/90 text-white text-lg px-12 py-3"
                      disabled={isSubmitting || !selectedDate || !selectedTime}
                    >
                      {isSubmitting ? 'Processing...' : 'Pay $250 & Book Session'}
                    </Button>
                    <p className="text-sm text-gray-500 mt-2">
                      You'll be redirected to Stripe for secure payment
                    </p>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default Training;

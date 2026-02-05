import React, { useState, useEffect } from 'react';
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
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDateAvailable, setIsDateAvailable] = useState<boolean | null>(null);
  const [checkingAvailability, setCheckingAvailability] = useState(false);
  const { toast } = useToast();

  // Only available time slot
  const availableTime = '12:00 PM - 1:00 PM CST';

  // Check availability when date is selected
  useEffect(() => {
    if (selectedDate) {
      checkAvailability();
    }
  }, [selectedDate]);

  const checkAvailability = async () => {
    if (!selectedDate) return;

    setCheckingAvailability(true);
    try {
      const { data, error } = await supabase.functions.invoke('check-training-availability', {
        body: {
          date: format(selectedDate, 'MMMM dd, yyyy'),
        },
      });

      if (error) throw error;

      setIsDateAvailable(data?.available || false);
    } catch (error) {
      console.error('Error checking availability:', error);
      toast({
        title: "Error",
        description: "Could not check availability. Please try again.",
        variant: "destructive",
      });
    } finally {
      setCheckingAvailability(false);
    }
  };

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedDate || !name.trim() || !email.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all fields and select a date.",
        variant: "destructive",
      });
      return;
    }

    if (!isDateAvailable) {
      toast({
        title: "Error",
        description: "This date is not available. Please select a different date.",
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
          selectedTime: availableTime,
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
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Disable past dates and Sundays
  const isDateDisabled = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Disable past dates
    if (date < today) return true;
    
    // Disable Sundays (0 = Sunday)
    if (date.getDay() === 0) return true;
    
    return false;
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
        <div className="bg-gb-dark text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-gb-blue/10 to-transparent" />
          
          <div className="container-custom py-16 md:py-24 relative z-10">
            <div className="text-center max-w-4xl mx-auto">
              <span className="inline-block text-gb-blue font-semibold text-sm uppercase tracking-wider mb-4">
                1-on-1 Training
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                Learn to Build With AI
              </h1>
              <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
                Master the fundamentals of AI-powered development in a personalized, one-hour session 
                tailored to your goals.
              </p>
              <div className="inline-flex items-center gap-3 bg-gb-green text-white text-xl md:text-2xl font-bold py-4 px-8 rounded-xl">
                $250
                <span className="text-white/70 font-normal text-lg">/ 1 Hour Session</span>
              </div>
              <div className="mt-4 text-white/60">
                Available Monday-Saturday • 12:00 PM - 1:00 PM CST
              </div>
            </div>
          </div>
        </div>

        {/* Course Details */}
        <div className="bg-white">
          <div className="container-custom py-16 md:py-20">
            <div className="text-center mb-12">
              <span className="inline-block text-gb-green font-semibold text-sm uppercase tracking-wider mb-3">
                What You'll Get
              </span>
              <h2 className="text-2xl md:text-3xl font-bold text-gb-dark mb-4">
                Master AI-Powered Development
              </h2>
              <p className="text-lg text-gb-dark/70 leading-relaxed max-w-3xl mx-auto">
                In just one hour, you'll learn the fundamentals of using AI tools to build websites, apps, and software — 
                even if you've never written a line of code. This personalized session is tailored to your specific goals and projects.
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
                <p className="text-gray-600">Select a date - Available Monday-Saturday 12:00 PM - 1:00 PM CST</p>
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

                  {/* Time Display and Availability */}
                  {selectedDate && (
                    <div className="space-y-4">
                      <h3 className="text-xl font-semibold text-gb-dark">
                        Session Time for {format(selectedDate, 'MMMM dd, yyyy')}
                      </h3>
                      <div className="flex justify-center">
                        <div className={`p-4 rounded-lg border-2 ${
                          checkingAvailability 
                            ? 'border-gray-300 bg-gray-50' 
                            : isDateAvailable 
                              ? 'border-gb-green bg-gb-green/10' 
                              : 'border-red-500 bg-red-50'
                        }`}>
                          <div className="text-center">
                            <div className="text-lg font-semibold text-gb-dark mb-2">
                              {availableTime}
                            </div>
                            {checkingAvailability ? (
                              <div className="text-sm text-gray-500">Checking availability...</div>
                            ) : isDateAvailable ? (
                              <div className="text-sm text-gb-green font-medium">✓ Available</div>
                            ) : (
                              <div className="text-sm text-red-500 font-medium">✗ Already Booked</div>
                            )}
                          </div>
                        </div>
                      </div>
                      {!isDateAvailable && !checkingAvailability && (
                        <p className="text-center text-red-600">
                          This date is already booked. Please select a different date.
                        </p>
                      )}
                    </div>
                  )}

                  {/* Submit Button */}
                  <div className="text-center pt-6">
                    <Button
                      type="submit"
                      className="bg-gb-blue hover:bg-gb-blue/90 text-white text-lg px-12 py-3"
                      disabled={isSubmitting || !selectedDate || !isDateAvailable || checkingAvailability}
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

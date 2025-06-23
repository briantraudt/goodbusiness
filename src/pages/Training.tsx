
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

  return (
    <PageLayout>
      <div className="bg-gradient-to-br from-green-50 to-blue-50 min-h-screen">
        {/* Hero Section */}
        <div className="container-custom section-padding">
          <div className="text-center max-w-4xl mx-auto mb-16">
            <h1 className="text-5xl md:text-6xl font-bold text-gb-dark mb-6">
              AI 101 Training Class
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Learn the very basics of how to build your own website, software, and apps with AI assistance. 
              One-on-one personalized training session.
            </p>
            <div className="bg-gb-green text-white text-2xl font-bold py-4 px-8 rounded-lg inline-block">
              $250 for 1 Hour Session
            </div>
          </div>

          {/* Course Details */}
          <div className="grid md:grid-cols-2 gap-12 mb-16">
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="text-2xl text-gb-dark">What You'll Learn</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-gb-green rounded-full mt-2"></div>
                  <p>How to use AI tools to build websites without coding</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-gb-green rounded-full mt-2"></div>
                  <p>Creating mobile apps with AI assistance</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-gb-green rounded-full mt-2"></div>
                  <p>Software development basics and best practices</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-gb-green rounded-full mt-2"></div>
                  <p>Choosing the right AI tools for your project</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-gb-green rounded-full mt-2"></div>
                  <p>Hands-on practice with real examples</p>
                </div>
              </CardContent>
            </Card>

            <Card className="h-full">
              <CardHeader>
                <CardTitle className="text-2xl text-gb-dark">Session Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-gb-blue rounded-full mt-2"></div>
                  <p><strong>Duration:</strong> 1 hour one-on-one session</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-gb-blue rounded-full mt-2"></div>
                  <p><strong>Format:</strong> Live video call via Zoom</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-gb-blue rounded-full mt-2"></div>
                  <p><strong>Personalized:</strong> Tailored to your specific needs</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-gb-blue rounded-full mt-2"></div>
                  <p><strong>Follow-up:</strong> Recording provided after session</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-gb-blue rounded-full mt-2"></div>
                  <p><strong>Resources:</strong> Curated list of tools and guides</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Booking Section */}
          <Card className="max-w-4xl mx-auto">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl text-gb-dark">Book Your Session</CardTitle>
              <p className="text-gray-600">Select a date and time that works for you</p>
            </CardHeader>
            <CardContent>
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
    </PageLayout>
  );
};

export default Training;

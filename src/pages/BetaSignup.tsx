
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import PageLayout from '@/components/layout/PageLayout';

const BetaSignup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !email.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all fields.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('beta_signups')
        .insert([
          {
            name: name.trim(),
            email: email.trim().toLowerCase()
          }
        ]);

      if (error) {
        if (error.code === '23505') { // Unique constraint violation
          toast({
            title: "Already signed up",
            description: "This email address is already registered for the beta.",
            variant: "destructive",
          });
        } else {
          throw error;
        }
      } else {
        setIsSubmitted(true);
        console.log('Beta signup successful for:', email);
      }
    } catch (error) {
      console.error('Error submitting beta signup:', error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    const firstName = name.trim().split(' ')[0];
    
    return (
      <PageLayout>
        <div className="bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4" style={{ height: 'calc(100vh - 140px)' }}>
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-green-600">Thank You!</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-lg">
                Thanks for signing up for our food app beta, {firstName}!
              </p>
              <p className="text-gray-600">
                We'll be in touch soon with early access details.
              </p>
            </CardContent>
          </Card>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4" style={{ height: 'calc(100vh - 140px)' }}>
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-gb-dark">Join Our Food App Beta</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
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
              
              <Button 
                type="submit" 
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Signing Up...' : 'Sign Up for Beta'}
              </Button>
            </form>
            
            <div className="text-center mt-6">
              <p className="text-sm text-gray-500">
                Get Ready For Something Delicious!
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
};

export default BetaSignup;

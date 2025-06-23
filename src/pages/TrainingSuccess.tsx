
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import PageLayout from '@/components/layout/PageLayout';
import { useSearchParams } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

const TrainingSuccess = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const date = searchParams.get('date');
  const time = searchParams.get('time');

  return (
    <PageLayout>
      <div className="bg-white min-h-screen">
        <div className="container-custom py-20">
          <div className="max-w-3xl mx-auto">
            <Card className="shadow-lg border-0">
              <CardHeader className="text-center bg-gb-light rounded-t-lg">
                <div className="flex justify-center mb-4">
                  <div className="bg-gb-green rounded-full p-4">
                    <CheckCircle className="w-12 h-12 text-white" />
                  </div>
                </div>
                <CardTitle className="text-4xl text-gb-green mb-2">Payment Successful!</CardTitle>
                <p className="text-lg text-gb-dark">
                  Thank you for booking your AI 101 Training Class!
                </p>
              </CardHeader>
              
              <CardContent className="p-8 space-y-8">
                {date && time && (
                  <div className="bg-gb-light p-6 rounded-lg border-l-4 border-gb-blue">
                    <h3 className="text-2xl font-semibold text-gb-dark mb-4 flex items-center">
                      <CheckCircle className="w-6 h-6 text-gb-blue mr-2" />
                      Your Session Details
                    </h3>
                    <div className="grid md:grid-cols-3 gap-4 text-center">
                      <div className="bg-white p-4 rounded-lg shadow-sm">
                        <p className="text-sm text-gb-dark/70 mb-1">Date</p>
                        <p className="text-lg font-semibold text-gb-dark">{decodeURIComponent(date)}</p>
                      </div>
                      <div className="bg-white p-4 rounded-lg shadow-sm">
                        <p className="text-sm text-gb-dark/70 mb-1">Time</p>
                        <p className="text-lg font-semibold text-gb-dark">{decodeURIComponent(time)}</p>
                      </div>
                      <div className="bg-white p-4 rounded-lg shadow-sm">
                        <p className="text-sm text-gb-dark/70 mb-1">Duration</p>
                        <p className="text-lg font-semibold text-gb-dark">1 Hour</p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="space-y-6">
                  <h3 className="text-2xl font-semibold text-gb-dark text-center">What's Next?</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-gb-light p-4 rounded-lg flex items-start space-x-3">
                      <div className="w-3 h-3 bg-gb-green rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-gb-dark">You'll receive a confirmation email with session details</p>
                    </div>
                    <div className="bg-gb-light p-4 rounded-lg flex items-start space-x-3">
                      <div className="w-3 h-3 bg-gb-blue rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-gb-dark">A Zoom link will be sent 24 hours before your session</p>
                    </div>
                    <div className="bg-gb-light p-4 rounded-lg flex items-start space-x-3">
                      <div className="w-3 h-3 bg-gb-purple rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-gb-dark">We'll contact you if we need to reschedule</p>
                    </div>
                    <div className="bg-gb-light p-4 rounded-lg flex items-start space-x-3">
                      <div className="w-3 h-3 bg-gb-orange rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-gb-dark">Prepare any specific questions you'd like to discuss</p>
                    </div>
                  </div>
                </div>

                {sessionId && (
                  <div className="bg-gray-50 p-4 rounded-lg text-center">
                    <p className="text-sm text-gray-500 mb-1">Session ID</p>
                    <p className="text-xs font-mono text-gray-600">{sessionId}</p>
                  </div>
                )}

                <div className="text-center pt-4">
                  <Button 
                    onClick={() => window.location.href = '/'}
                    className="bg-gb-blue hover:bg-gb-blue/90 text-white text-lg px-8 py-3"
                  >
                    Return to Homepage
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default TrainingSuccess;

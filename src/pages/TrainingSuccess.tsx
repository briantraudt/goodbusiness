
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
      <div className="bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4" style={{ height: 'calc(100vh - 140px)' }}>
        <Card className="w-full max-w-2xl">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <CheckCircle className="w-16 h-16 text-green-600" />
            </div>
            <CardTitle className="text-3xl text-green-600">Payment Successful!</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <p className="text-lg">
              Thank you for booking your AI 101 Training Class!
            </p>
            
            {date && time && (
              <div className="bg-gb-light p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-gb-dark mb-2">Your Session Details</h3>
                <p className="text-lg"><strong>Date:</strong> {decodeURIComponent(date)}</p>
                <p className="text-lg"><strong>Time:</strong> {decodeURIComponent(time)}</p>
                <p className="text-lg"><strong>Duration:</strong> 1 Hour</p>
              </div>
            )}

            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gb-dark">What's Next?</h3>
              <div className="text-left space-y-2 max-w-md mx-auto">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-gb-green rounded-full mt-2"></div>
                  <p>You'll receive a confirmation email with session details</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-gb-green rounded-full mt-2"></div>
                  <p>A Zoom link will be sent 24 hours before your session</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-gb-green rounded-full mt-2"></div>
                  <p>We'll contact you if we need to reschedule</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-gb-green rounded-full mt-2"></div>
                  <p>Prepare any specific questions you'd like to discuss</p>
                </div>
              </div>
            </div>

            {sessionId && (
              <div className="text-sm text-gray-500">
                Session ID: {sessionId}
              </div>
            )}

            <div className="pt-4">
              <Button 
                onClick={() => window.location.href = '/'}
                className="bg-gb-blue hover:bg-gb-blue/90"
              >
                Return to Homepage
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
};

export default TrainingSuccess;

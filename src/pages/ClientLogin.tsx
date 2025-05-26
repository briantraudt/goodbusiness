
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useClientAuth } from '@/contexts/ClientAuthContext';
import PageLayout from '@/components/layout/PageLayout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const ClientLogin = () => {
  const [accessCode, setAccessCode] = useState('');
  const [slug, setSlug] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useClientAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!slug || !accessCode) {
      toast({
        title: "Missing information",
        description: "Please enter both the project ID and access code",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const { success, error } = await login(slug, accessCode);
      
      if (success) {
        toast({
          title: "Access granted",
          description: "Welcome to your project dashboard",
        });
        navigate(`/clients/${slug}`);
      } else {
        toast({
          title: "Access denied",
          description: error || "Invalid project ID or access code",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageLayout>
      <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 bg-gray-50">
        <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-xl shadow-md">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gb-dark">Client Portal</h1>
            <p className="mt-2 text-gray-600">
              Access your project dashboard
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div className="space-y-4">
              <div>
                <label htmlFor="slug" className="text-sm font-medium text-gray-700 block">
                  Project ID
                </label>
                <Input
                  id="slug"
                  name="slug"
                  type="text"
                  placeholder="" 
                  required
                  value={slug}
                  onChange={(e) => setSlug(e.target.value.toLowerCase())}
                  className="mt-1"
                />
              </div>
              
              <div>
                <label htmlFor="accessCode" className="text-sm font-medium text-gray-700 block">
                  Access Code
                </label>
                <Input
                  id="accessCode"
                  name="accessCode"
                  type="password"
                  required
                  value={accessCode}
                  onChange={(e) => setAccessCode(e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-gb-green hover:bg-gb-green/90" 
              disabled={isLoading}
            >
              {isLoading ? "Verifying..." : "Access Dashboard"}
            </Button>
          </form>
        </div>
      </div>
    </PageLayout>
  );
};

export default ClientLogin;

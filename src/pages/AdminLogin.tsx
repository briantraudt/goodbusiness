
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import PageLayout from '@/components/layout/PageLayout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Lock } from 'lucide-react';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { adminLoggedIn, login } = useAdminAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Redirect if already logged in
  useEffect(() => {
    if (adminLoggedIn) {
      navigate('/admin/clients');
    }
  }, [adminLoggedIn, navigate]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Missing information",
        description: "Please enter both email and password",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const { success, error } = await login(email, password);
      
      if (success) {
        toast({
          title: "Login successful",
          description: "Welcome to the admin dashboard",
        });
        // Explicitly navigate to admin dashboard after successful login
        navigate('/admin/clients');
      } else {
        toast({
          title: "Login failed",
          description: error || "Invalid email or password",
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
            <div className="mx-auto bg-gb-dark rounded-full w-16 h-16 flex items-center justify-center mb-4">
              <Lock className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gb-dark">Admin Login</h1>
            <p className="mt-2 text-gray-600">
              Access the admin dashboard
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="text-sm font-medium text-gray-700 block">
                  Email
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="admin@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1"
                />
              </div>
              
              <div>
                <label htmlFor="password" className="text-sm font-medium text-gray-700 block">
                  Password
                </label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-gb-dark hover:bg-gb-dark/90" 
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </form>
        </div>
      </div>
    </PageLayout>
  );
};

export default AdminLogin;

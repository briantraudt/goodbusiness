
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

interface AdminAuthContextType {
  adminLoggedIn: boolean;
  adminEmail: string | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  checkingAuth: boolean;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [adminLoggedIn, setAdminLoggedIn] = useState<boolean>(false);
  const [adminEmail, setAdminEmail] = useState<string | null>(null);
  const [checkingAuth, setCheckingAuth] = useState<boolean>(true);
  const { toast } = useToast();
  
  // Check if admin is logged in on component mount
  useEffect(() => {
    const checkAdminAuth = () => {
      const storedEmail = localStorage.getItem('admin_email');
      const storedAuthToken = localStorage.getItem('admin_auth_token');
      
      if (storedEmail && storedAuthToken) {
        setAdminEmail(storedEmail);
        setAdminLoggedIn(true);
      }
      
      setCheckingAuth(false);
    };
    
    checkAdminAuth();
  }, []);
  
  const login = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.rpc('check_admin_credentials', { 
        email_param: email,
        password_param: password
      });
      
      if (error) {
        throw new Error(error.message);
      }
      
      if (data === true) {
        // Generate a simple token (in a real app, use a proper JWT)
        const authToken = Date.now().toString();
        
        // Store auth in localStorage
        localStorage.setItem('admin_email', email);
        localStorage.setItem('admin_auth_token', authToken);
        
        setAdminEmail(email);
        setAdminLoggedIn(true);
        
        return { success: true };
      } else {
        return { success: false, error: 'Invalid email or password' };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'An error occurred during login' 
      };
    }
  };
  
  const logout = async () => {
    localStorage.removeItem('admin_email');
    localStorage.removeItem('admin_auth_token');
    setAdminEmail(null);
    setAdminLoggedIn(false);
    
    toast({
      title: 'Logged out',
      description: 'You have been successfully logged out.'
    });
  };
  
  return (
    <AdminAuthContext.Provider value={{
      adminLoggedIn,
      adminEmail,
      login,
      logout,
      checkingAuth
    }}>
      {children}
    </AdminAuthContext.Provider>
  );
};


import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

interface ClientAuthContextType {
  isAuthenticated: boolean;
  clientSlug: string | null;
  clientName: string | null;
  accessCode: string | null;
  login: (slug: string, code: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const ClientAuthContext = createContext<ClientAuthContextType | undefined>(undefined);

export function ClientAuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [clientSlug, setClientSlug] = useState<string | null>(null);
  const [clientName, setClientName] = useState<string | null>(null);
  const [accessCode, setAccessCode] = useState<string | null>(null);
  const navigate = useNavigate();

  // Check local storage for existing session on mount
  useEffect(() => {
    const storedClientSlug = localStorage.getItem('clientSlug');
    const storedAccessCode = localStorage.getItem('clientAccessCode');
    const storedClientName = localStorage.getItem('clientName');
    
    if (storedClientSlug && storedAccessCode) {
      verifyAccess(storedClientSlug, storedAccessCode).then(valid => {
        if (valid) {
          setIsAuthenticated(true);
          setClientSlug(storedClientSlug);
          setAccessCode(storedAccessCode);
          setClientName(storedClientName);
        } else {
          // Clear invalid credentials
          localStorage.removeItem('clientSlug');
          localStorage.removeItem('clientAccessCode');
          localStorage.removeItem('clientName');
        }
      });
    }
  }, []);

  const verifyAccess = async (slug: string, code: string) => {
    try {
      const { data, error } = await supabase.rpc('validate_client_access', {
        slug,
        code
      });
      
      return error ? false : !!data;
    } catch (error) {
      console.error('Error verifying client access:', error);
      return false;
    }
  };

  const login = async (slug: string, code: string) => {
    try {
      // Verify access code against the slug
      const isValid = await verifyAccess(slug, code);
      
      if (!isValid) {
        return { success: false, error: "Invalid access code" };
      }
      
      // If valid, get the client name
      const { data: client, error: clientError } = await supabase
        .from('clients')
        .select('name')
        .eq('slug', slug)
        .single();
        
      if (clientError || !client) {
        return { success: false, error: "Client not found" };
      }

      // Store authentication in state and localStorage
      setIsAuthenticated(true);
      setClientSlug(slug);
      setAccessCode(code);
      setClientName(client.name);
      
      localStorage.setItem('clientSlug', slug);
      localStorage.setItem('clientAccessCode', code);
      localStorage.setItem('clientName', client.name);
      
      return { success: true };
    } catch (error) {
      console.error('Error during client login:', error);
      return { success: false, error: "An unexpected error occurred" };
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setClientSlug(null);
    setAccessCode(null);
    setClientName(null);
    
    localStorage.removeItem('clientSlug');
    localStorage.removeItem('clientAccessCode');
    localStorage.removeItem('clientName');
    
    navigate('/client');
  };

  return (
    <ClientAuthContext.Provider value={{
      isAuthenticated,
      clientSlug,
      clientName,
      accessCode,
      login,
      logout
    }}>
      {children}
    </ClientAuthContext.Provider>
  );
}

export const useClientAuth = () => {
  const context = useContext(ClientAuthContext);
  if (context === undefined) {
    throw new Error('useClientAuth must be used within a ClientAuthProvider');
  }
  return context;
};

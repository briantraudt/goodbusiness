
import React from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Clipboard, RefreshCw, Eye } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface Client {
  id: string;
  name: string;
  slug: string;
  created_at: string;
}

interface ClientListProps {
  clients: Client[];
  accessCodes: { [key: string]: string };
  onResetAccessCode: () => void;
}

const ClientList = ({ clients, accessCodes, onResetAccessCode }: ClientListProps) => {
  const { toast } = useToast();
  
  const copyToClipboard = (text: string, message: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: 'Copied!',
        description: message
      });
    });
  };
  
  const resetAccessCode = async (clientId: string) => {
    try {
      // Generate new access code
      const newCode = Math.random().toString(36).substring(2, 10).toUpperCase();
      
      // Update the access code in the database
      const { error } = await supabase
        .from('client_access')
        .update({ access_code: newCode })
        .eq('client_id', clientId);
      
      if (error) throw error;
      
      toast({
        title: 'Access code reset',
        description: `New access code: ${newCode}`
      });
      
      // Refresh client data
      onResetAccessCode();
      
    } catch (error) {
      console.error('Error resetting access code:', error);
      toast({
        title: 'Error',
        description: 'Failed to reset access code. Please try again.',
        variant: 'destructive'
      });
    }
  };

  const getClientPortalUrl = (slug: string) => {
    // Get the base URL of the application
    const baseUrl = window.location.origin;
    return `${baseUrl}/client/${slug}`;
  };

  return (
    <div className="bg-white rounded-lg border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Client Name</TableHead>
            <TableHead>Portal URL</TableHead>
            <TableHead>Access Code</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {clients.map((client) => (
            <TableRow key={client.id}>
              <TableCell className="font-medium">{client.name}</TableCell>
              <TableCell>
                <div className="flex items-center space-x-2">
                  <span className="text-sm truncate max-w-[200px]">
                    /client/{client.slug}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(
                      getClientPortalUrl(client.slug),
                      'Portal URL copied to clipboard'
                    )}
                  >
                    <Clipboard className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center space-x-2">
                  <span className="font-mono text-sm">
                    {accessCodes[client.id] || 'Not available'}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(
                      accessCodes[client.id] || '',
                      'Access code copied to clipboard'
                    )}
                  >
                    <Clipboard className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => resetAccessCode(client.id)}
                  >
                    <RefreshCw className="h-4 w-4 mr-1" /> Reset Code
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(`/client/${client.slug}`, '_blank')}
                  >
                    <Eye className="h-4 w-4 mr-1" /> View Portal
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ClientList;

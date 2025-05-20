
import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { PlusCircle } from 'lucide-react';

interface AddClientDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onClientAdded: () => void;
}

const AddClientDialog = ({ open, onOpenChange, onClientAdded }: AddClientDialogProps) => {
  const [newClient, setNewClient] = useState({ name: '', slug: '' });
  const { toast } = useToast();

  const createClient = async () => {
    if (!newClient.name || !newClient.slug) {
      toast({
        title: 'Missing information',
        description: 'Please enter both client name and unique slug.',
        variant: 'destructive'
      });
      return;
    }

    try {
      // Create client
      const { data: clientData, error: clientError } = await supabase
        .from('clients')
        .insert([
          { name: newClient.name, slug: newClient.slug.toLowerCase() }
        ])
        .select()
        .single();
      
      if (clientError) throw clientError;
      
      // Generate random access code
      const accessCode = Math.random().toString(36).substring(2, 10).toUpperCase();
      
      // Create access code entry
      const { error: accessError } = await supabase
        .from('client_access')
        .insert([
          { client_id: clientData.id, access_code: accessCode }
        ]);
      
      if (accessError) throw accessError;
      
      toast({
        title: 'Client created',
        description: `${newClient.name} has been added with access code: ${accessCode}`
      });
      
      // Reset form and refresh data
      setNewClient({ name: '', slug: '' });
      onOpenChange(false); // Close dialog after success
      onClientAdded(); // Refresh client list
      
    } catch (error: any) {
      console.error('Error creating client:', error);
      
      // Handle duplicate slug error
      if (error.code === '23505') {
        toast({
          title: 'Error',
          description: 'This slug is already in use. Please choose another one.',
          variant: 'destructive'
        });
      } else {
        toast({
          title: 'Error',
          description: 'Failed to create client. Please try again.',
          variant: 'destructive'
        });
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button className="w-full">
          <PlusCircle className="mr-2 h-4 w-4" /> Add New Client
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Client</DialogTitle>
          <DialogDescription>
            Create a new client portal and generate their access code.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="client-name">Client Name</Label>
            <Input
              id="client-name"
              placeholder="E.g. Tiger Totes"
              value={newClient.name}
              onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="client-slug">
              Unique Slug
              <span className="text-sm text-gray-500 block">
                Used in the URL: goodbusinesshq.com/client/{newClient.slug || 'example'}
              </span>
            </Label>
            <Input
              id="client-slug"
              placeholder="E.g. tigertotes"
              value={newClient.slug}
              onChange={(e) => setNewClient({ ...newClient, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={createClient}>Create Client Portal</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddClientDialog;

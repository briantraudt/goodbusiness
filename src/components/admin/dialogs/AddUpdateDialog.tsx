
import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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

interface Project {
  id: string;
  name: string;
  client_id: string;
}

interface Client {
  id: string;
  name: string;
}

interface AddUpdateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projects: Project[];
  clients: Client[];
}

const AddUpdateDialog = ({ open, onOpenChange, projects, clients }: AddUpdateDialogProps) => {
  const [newUpdate, setNewUpdate] = useState({
    project_id: '',
    title: '',
    description: '',
    date: new Date().toISOString().split('T')[0]
  });
  
  const { toast } = useToast();

  const addProjectUpdate = async () => {
    if (!newUpdate.title || !newUpdate.description || !newUpdate.project_id) {
      toast({
        title: 'Missing information',
        description: 'Please fill in all required fields.',
        variant: 'destructive'
      });
      return;
    }

    try {
      const { data, error } = await supabase
        .from('project_updates')
        .insert([
          {
            title: newUpdate.title,
            description: newUpdate.description,
            project_id: newUpdate.project_id,
            date: new Date(newUpdate.date).toISOString()
          }
        ]);
      
      if (error) throw error;
      
      toast({
        title: 'Update added',
        description: 'Project update has been published successfully.'
      });
      
      setNewUpdate({
        project_id: '',
        title: '',
        description: '',
        date: new Date().toISOString().split('T')[0]
      });
      
      onOpenChange(false);
      
    } catch (error) {
      console.error('Error adding update:', error);
      toast({
        title: 'Error',
        description: 'Failed to add project update. Please try again.',
        variant: 'destructive'
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button className="w-full" variant="outline">
          <PlusCircle className="mr-2 h-4 w-4" /> Add Project Update
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Project Update</DialogTitle>
          <DialogDescription>
            Share a progress update with your client.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="update-project">Select Project</Label>
            <select
              id="update-project"
              className="w-full rounded-md border border-gray-300 p-2"
              value={newUpdate.project_id}
              onChange={(e) => setNewUpdate({ ...newUpdate, project_id: e.target.value })}
            >
              <option value="">-- Select Project --</option>
              {projects.map((project) => {
                const client = clients.find(c => c.id === project.client_id);
                return (
                  <option key={project.id} value={project.id}>
                    {project.name} {client ? `(${client.name})` : ''}
                  </option>
                );
              })}
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="update-title">Update Title</Label>
            <Input
              id="update-title"
              placeholder="E.g. Design Phase Completed"
              value={newUpdate.title}
              onChange={(e) => setNewUpdate({ ...newUpdate, title: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="update-date">Date</Label>
            <Input
              id="update-date"
              type="date"
              value={newUpdate.date}
              onChange={(e) => setNewUpdate({ ...newUpdate, date: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="update-description">Update Details</Label>
            <Textarea
              id="update-description"
              placeholder="Provide details about the progress"
              value={newUpdate.description}
              onChange={(e) => setNewUpdate({ ...newUpdate, description: e.target.value })}
              className="min-h-[100px]"
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={addProjectUpdate}>Publish Update</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddUpdateDialog;

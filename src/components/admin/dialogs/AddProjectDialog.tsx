
import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from "@/components/ui/switch";
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

interface Client {
  id: string;
  name: string;
}

interface AddProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onProjectAdded: () => void;
  clients: Client[];
}

const AddProjectDialog = ({ open, onOpenChange, onProjectAdded, clients }: AddProjectDialogProps) => {
  const [newProject, setNewProject] = useState({ 
    name: '', 
    description: '', 
    client_id: '',
    status: 'in_progress',
    project_url: '',
    embed_project: false
  });
  
  const { toast } = useToast();

  const createProject = async () => {
    if (!newProject.name || !newProject.client_id) {
      toast({
        title: 'Missing information',
        description: 'Please enter project name and select a client.',
        variant: 'destructive'
      });
      return;
    }

    try {
      const { data, error } = await supabase
        .from('projects')
        .insert([
          { 
            name: newProject.name, 
            description: newProject.description,
            client_id: newProject.client_id,
            status: newProject.status,
            project_url: newProject.project_url || null,
            embed_project: newProject.embed_project
          }
        ])
        .select();
      
      if (error) throw error;
      
      toast({
        title: 'Project created',
        description: `${newProject.name} has been added successfully.`
      });
      
      setNewProject({ 
        name: '', 
        description: '', 
        client_id: '', 
        status: 'in_progress',
        project_url: '',
        embed_project: false
      });
      onOpenChange(false);
      onProjectAdded();
      
    } catch (error) {
      console.error('Error creating project:', error);
      toast({
        title: 'Error',
        description: 'Failed to create project. Please try again.',
        variant: 'destructive'
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button className="w-full" variant="outline">
          <PlusCircle className="mr-2 h-4 w-4" /> Add New Project
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Project</DialogTitle>
          <DialogDescription>
            Create a new project for a client.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="project-client">Select Client</Label>
            <select
              id="project-client"
              className="w-full rounded-md border border-gray-300 p-2"
              value={newProject.client_id}
              onChange={(e) => setNewProject({ ...newProject, client_id: e.target.value })}
            >
              <option value="">-- Select Client --</option>
              {clients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.name}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="project-name">Project Name</Label>
            <Input
              id="project-name"
              placeholder="E.g. Website Redesign"
              value={newProject.name}
              onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="project-description">Description (Optional)</Label>
            <Textarea
              id="project-description"
              placeholder="Brief description of the project"
              value={newProject.description}
              onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="project-status">Status</Label>
            <select
              id="project-status"
              className="w-full rounded-md border border-gray-300 p-2"
              value={newProject.status}
              onChange={(e) => setNewProject({ ...newProject, status: e.target.value })}
            >
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="on_hold">On Hold</option>
            </select>
          </div>
          
          {/* Project URL field */}
          <div className="space-y-2">
            <Label htmlFor="project-url">Project URL (Optional)</Label>
            <Input
              id="project-url"
              placeholder="https://your-project-url.com"
              value={newProject.project_url}
              onChange={(e) => setNewProject({ ...newProject, project_url: e.target.value })}
            />
            <p className="text-xs text-gray-500">The URL where this project is hosted</p>
          </div>
          
          {/* Embed project option */}
          <div className="flex items-center space-x-2">
            <Switch
              id="embed-project"
              checked={newProject.embed_project}
              onCheckedChange={(checked) => setNewProject({ ...newProject, embed_project: checked })}
            />
            <Label htmlFor="embed-project">Embed project in client dashboard</Label>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={createProject}>Create Project</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddProjectDialog;


import React, { useEffect, useState } from 'react';
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
} from '@/components/ui/dialog';

interface Project {
  id: string;
  name: string;
  description: string | null;
  client_id: string;
  status: string;
  project_url?: string | null;
  embed_project?: boolean | null;
}

interface EditProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project: Project | null;
  onProjectUpdated: () => void;
}

const EditProjectDialog = ({ open, onOpenChange, project, onProjectUpdated }: EditProjectDialogProps) => {
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (project) {
      setEditingProject(project);
    }
  }, [project]);

  const updateProject = async () => {
    if (!editingProject) return;

    try {
      const { error } = await supabase
        .from('projects')
        .update({
          name: editingProject.name,
          description: editingProject.description,
          status: editingProject.status,
          project_url: editingProject.project_url || null,
          embed_project: editingProject.embed_project
        })
        .eq('id', editingProject.id);

      if (error) throw error;

      toast({
        title: 'Project updated',
        description: `${editingProject.name} has been updated successfully.`
      });

      onOpenChange(false);
      onProjectUpdated();
    } catch (error) {
      console.error('Error updating project:', error);
      toast({
        title: 'Error',
        description: 'Failed to update project. Please try again.',
        variant: 'destructive'
      });
    }
  };

  if (!editingProject) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Project</DialogTitle>
          <DialogDescription>
            Update project information.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="edit-project-name">Project Name</Label>
            <Input
              id="edit-project-name"
              value={editingProject.name}
              onChange={(e) => setEditingProject({ ...editingProject, name: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-project-description">Description</Label>
            <Textarea
              id="edit-project-description"
              value={editingProject.description || ''}
              onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-project-status">Status</Label>
            <select
              id="edit-project-status"
              className="w-full rounded-md border border-gray-300 p-2"
              value={editingProject.status}
              onChange={(e) => setEditingProject({ ...editingProject, status: e.target.value })}
            >
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="on_hold">On Hold</option>
            </select>
          </div>
          
          {/* Project URL field */}
          <div className="space-y-2">
            <Label htmlFor="edit-project-url">Project URL</Label>
            <Input
              id="edit-project-url"
              placeholder="https://your-project-url.com"
              value={editingProject.project_url || ''}
              onChange={(e) => setEditingProject({ ...editingProject, project_url: e.target.value })}
            />
            <p className="text-xs text-gray-500">The URL where this project is hosted</p>
          </div>
          
          {/* Embed project option */}
          <div className="flex items-center space-x-2">
            <Switch
              id="edit-embed-project"
              checked={editingProject.embed_project || false}
              onCheckedChange={(checked) => setEditingProject({ ...editingProject, embed_project: checked })}
            />
            <Label htmlFor="edit-embed-project">Embed project in client dashboard</Label>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={updateProject}>Update Project</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditProjectDialog;

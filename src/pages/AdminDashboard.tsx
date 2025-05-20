
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import PageLayout from '@/components/layout/PageLayout';
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { PlusCircle, Clipboard, RefreshCw, Eye, LogOut } from 'lucide-react';

interface Client {
  id: string;
  name: string;
  slug: string;
  created_at: string;
}

interface ClientAccess {
  id: string;
  client_id: string;
  access_code: string;
}

interface Project {
  id: string;
  name: string;
  description: string | null;
  client_id: string;
  status: string;
}

interface ProjectUpdate {
  id: string;
  project_id: string;
  title: string;
  description: string;
  date: string;
}

const AdminDashboard = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [accessCodes, setAccessCodes] = useState<{ [key: string]: string }>({});
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Dialog open states
  const [addClientDialogOpen, setAddClientDialogOpen] = useState(false);
  const [addProjectDialogOpen, setAddProjectDialogOpen] = useState(false);
  const [addUpdateDialogOpen, setAddUpdateDialogOpen] = useState(false);
  
  // Form states
  const [newClient, setNewClient] = useState({ name: '', slug: '' });
  const [newProject, setNewProject] = useState({ 
    name: '', 
    description: '', 
    client_id: '',
    status: 'in_progress'
  });
  const [newUpdate, setNewUpdate] = useState({
    project_id: '',
    title: '',
    description: '',
    date: new Date().toISOString().split('T')[0]
  });

  const { toast } = useToast();
  const { adminEmail, logout } = useAdminAuth();

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .order('name');
      
      if (error) throw error;
      
      if (data) {
        setClients(data);
        
        // Fetch access codes for each client
        const accessData: { [key: string]: string } = {};
        for (const client of data) {
          const { data: accessCodeData } = await supabase
            .from('client_access')
            .select('access_code')
            .eq('client_id', client.id)
            .single();
            
          if (accessCodeData) {
            accessData[client.id] = accessCodeData.access_code;
          }
        }
        
        setAccessCodes(accessData);
        
        // Fetch projects
        const { data: projectsData } = await supabase
          .from('projects')
          .select('*')
          .order('name');
          
        if (projectsData) {
          setProjects(projectsData);
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch data. Please try again later.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
  };

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
      setAddClientDialogOpen(false); // Close dialog after success
      fetchClients(); // Refresh client list
      
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
            status: newProject.status
          }
        ])
        .select();
      
      if (error) throw error;
      
      toast({
        title: 'Project created',
        description: `${newProject.name} has been added successfully.`
      });
      
      setNewProject({ name: '', description: '', client_id: '', status: 'in_progress' });
      setAddProjectDialogOpen(false);
      fetchClients();
      
    } catch (error) {
      console.error('Error creating project:', error);
      toast({
        title: 'Error',
        description: 'Failed to create project. Please try again.',
        variant: 'destructive'
      });
    }
  };

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
      
      setAddUpdateDialogOpen(false);
      
    } catch (error) {
      console.error('Error adding update:', error);
      toast({
        title: 'Error',
        description: 'Failed to add project update. Please try again.',
        variant: 'destructive'
      });
    }
  };

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
      
      // Update local state
      setAccessCodes({
        ...accessCodes,
        [clientId]: newCode
      });
      
      toast({
        title: 'Access code reset',
        description: `New access code: ${newCode}`
      });
      
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
    <PageLayout>
      <div className="min-h-screen bg-gray-50 py-10 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gb-dark">Client Portal Management</h1>
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">Logged in as: <span className="font-medium">{adminEmail}</span></span>
              <Button 
                variant="outline" 
                className="flex items-center" 
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-4 w-4" /> Logout
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
            {/* Add Client */}
            <Dialog open={addClientDialogOpen} onOpenChange={setAddClientDialogOpen}>
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

            {/* Add Project */}
            <Dialog open={addProjectDialogOpen} onOpenChange={setAddProjectDialogOpen}>
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
                </div>
                <DialogFooter>
                  <Button onClick={createProject}>Create Project</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Add Update */}
            <Dialog open={addUpdateDialogOpen} onOpenChange={setAddUpdateDialogOpen}>
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
          </div>
          
          {/* Client List */}
          <h2 className="text-xl font-semibold text-gb-dark mb-4">Client Portals</h2>
          {loading ? (
            <div className="text-center py-10">Loading client data...</div>
          ) : clients.length === 0 ? (
            <div className="text-center py-10 bg-white rounded-lg border">
              <p>No clients added yet. Create your first client portal.</p>
            </div>
          ) : (
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
          )}
        </div>
      </div>
    </PageLayout>
  );
};

export default AdminDashboard;

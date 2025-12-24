
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import PageLayout from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';

// Import our new components
import AddClientDialog from '@/components/admin/dialogs/AddClientDialog';
import AddProjectDialog from '@/components/admin/dialogs/AddProjectDialog';
import AddUpdateDialog from '@/components/admin/dialogs/AddUpdateDialog';
import EditProjectDialog from '@/components/admin/dialogs/EditProjectDialog';
import ClientList from '@/components/admin/lists/ClientList';
import ProjectList from '@/components/admin/lists/ProjectList';

interface Client {
  id: string;
  name: string;
  slug: string | null;
  created_at: string;
  user_id: string;
}

interface Project {
  id: string;
  name: string;
  description: string | null;
  client_id: string;
  status: string;
  project_url?: string | null;
  embed_project?: boolean | null;
}

const AdminDashboard = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [accessCodes, setAccessCodes] = useState<{ [key: string]: string }>({});
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Dialog open states
  const [addClientDialogOpen, setAddClientDialogOpen] = useState(false);
  const [addProjectDialogOpen, setAddProjectDialogOpen] = useState(false);
  const [addUpdateDialogOpen, setAddUpdateDialogOpen] = useState(false);
  const [editProjectDialogOpen, setEditProjectDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  
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

  // Handler for editing projects
  const handleEditProject = (project: Project) => {
    setEditingProject(project);
    setEditProjectDialogOpen(true);
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
            {/* Dialog triggers */}
            <AddClientDialog 
              open={addClientDialogOpen} 
              onOpenChange={setAddClientDialogOpen} 
              onClientAdded={fetchClients} 
            />
            
            <AddProjectDialog 
              open={addProjectDialogOpen} 
              onOpenChange={setAddProjectDialogOpen} 
              onProjectAdded={fetchClients} 
              clients={clients} 
            />
            
            <AddUpdateDialog 
              open={addUpdateDialogOpen} 
              onOpenChange={setAddUpdateDialogOpen} 
              projects={projects} 
              clients={clients} 
            />
            
            <EditProjectDialog 
              open={editProjectDialogOpen} 
              onOpenChange={setEditProjectDialogOpen} 
              project={editingProject} 
              onProjectUpdated={fetchClients} 
            />
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
            <ClientList 
              clients={clients} 
              accessCodes={accessCodes} 
              onResetAccessCode={fetchClients} 
            />
          )}
          
          {/* Projects List */}
          <h2 className="text-xl font-semibold text-gb-dark mb-4 mt-8">Projects</h2>
          {loading ? (
            <div className="text-center py-10">Loading project data...</div>
          ) : projects.length === 0 ? (
            <div className="text-center py-10 bg-white rounded-lg border">
              <p>No projects added yet. Create your first project.</p>
            </div>
          ) : (
            <ProjectList 
              projects={projects} 
              clients={clients} 
              onEditProject={handleEditProject} 
            />
          )}
        </div>
      </div>
    </PageLayout>
  );
};

export default AdminDashboard;

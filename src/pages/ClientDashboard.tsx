
import React, { useEffect, useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { useClientAuth } from '@/contexts/ClientAuthContext';
import { supabase } from '@/integrations/supabase/client';
import PageLayout from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import ProjectCard from '@/components/client/ProjectCard';
import UpdatesList from '@/components/client/UpdatesList';

interface Project {
  id: string;
  name: string;
  description: string | null;
  status: string;
  created_at: string;
  updated_at: string;
  project_url: string | null;
  embed_project: boolean | null;
}

interface ProjectUpdate {
  id: string;
  title: string;
  description: string;
  date: string;
  created_at: string;
  project_id: string;
}

const ClientDashboard = () => {
  const { slug } = useParams<{ slug: string }>();
  const { isAuthenticated, clientSlug, clientName, logout } = useClientAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [updates, setUpdates] = useState<ProjectUpdate[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop');

  // Redirect to login if not authenticated or slug mismatch
  if (!isAuthenticated || clientSlug !== slug) {
    return <Navigate to="/clients" replace />;
  }

  useEffect(() => {
    const fetchClientData = async () => {
      setLoading(true);
      try {
        // Fetch client's projects
        const { data: projectsData, error: projectsError } = await supabase
          .from('projects')
          .select('*')
          .eq('client_id', (await supabase
            .from('clients')
            .select('id')
            .eq('slug', slug)
            .single()).data?.id);

        if (projectsError) throw projectsError;

        if (projectsData && projectsData.length > 0) {
          setProjects(projectsData);

          // Fetch updates for all projects
          const projectIds = projectsData.map(p => p.id);
          const { data: updatesData, error: updatesError } = await supabase
            .from('project_updates')
            .select('*')
            .in('project_id', projectIds)
            .order('date', { ascending: false });

          if (updatesError) throw updatesError;
          if (updatesData) setUpdates(updatesData);
        }
      } catch (error) {
        console.error('Error fetching client data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchClientData();
  }, [slug]);

  // If there's exactly one project with a URL, show it full screen
  const singleProjectWithUrl = projects.length === 1 && projects[0].project_url;

  if (singleProjectWithUrl && !loading) {
    return (
      <div 
        style={{ 
          position: 'fixed', 
          top: 0, 
          left: 0, 
          width: '100vw', 
          height: '100vh', 
          margin: 0, 
          padding: 0, 
          backgroundColor: 'white',
          zIndex: 9999
        }}
      >
        {/* Controls Bar */}
        <div style={{
          position: 'absolute',
          top: '16px',
          right: '16px',
          zIndex: 10000,
          display: 'flex',
          gap: '8px',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', gap: '4px' }}>
            <Button
              variant={viewMode === 'desktop' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('desktop')}
              className="bg-white shadow-md text-xs"
            >
              Desktop
            </Button>
            <Button
              variant={viewMode === 'mobile' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('mobile')}
              className="bg-white shadow-md text-xs"
            >
              Mobile
            </Button>
          </div>
          <Button variant="outline" onClick={logout} className="bg-white shadow-md">
            Log out
          </Button>
        </div>

        {/* iframe Container */}
        <div style={{
          width: '100%',
          height: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          margin: 0,
          padding: 0
        }}>
          <iframe 
            src={projects[0].project_url!} 
            style={{
              width: viewMode === 'mobile' ? '375px' : '100%',
              height: '100vh',
              border: 'none',
              outline: 'none'
            }}
            title="Project Preview"
            sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox"
            allowFullScreen
          />
        </div>
      </div>
    );
  }

  return (
    <PageLayout>
      <div className="min-h-[80vh] bg-gray-50 py-10 px-4">
        <div className="max-w-full mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gb-dark">{clientName} Dashboard</h1>
              <p className="text-gray-600 mt-1">View your project progress and updates</p>
            </div>
            <Button variant="outline" onClick={logout}>Log out</Button>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <p className="text-gray-500">Loading project data...</p>
            </div>
          ) : projects.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center py-10">
                <p>No projects found. Please contact your account manager.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-8">
              {/* Projects Summary */}
              <div>
                <h2 className="text-xl font-semibold text-gb-dark mb-4">Your Projects</h2>
                <div className="grid grid-cols-1 gap-6">
                  {projects.map((project) => (
                    <ProjectCard key={project.id} project={project} />
                  ))}
                </div>
              </div>

              {/* Project Updates */}
              <div>
                <h2 className="text-xl font-semibold text-gb-dark mb-4">Latest Updates</h2>
                <UpdatesList updates={updates} projects={projects} />
              </div>
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  );
};

export default ClientDashboard;

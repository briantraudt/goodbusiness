
import React, { useEffect, useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { useClientAuth } from '@/contexts/ClientAuthContext';
import { supabase } from '@/integrations/supabase/client';
import PageLayout from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { CalendarIcon, BarChart3, ClipboardList, Maximize, Minimize } from 'lucide-react';
import { Toggle } from '@/components/ui/toggle';
import { format } from 'date-fns';

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
  const [fullscreenProject, setFullscreenProject] = useState<string | null>(null);

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

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'bg-green-500';
      case 'in_progress':
        return 'bg-blue-500';
      case 'on_hold':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  const formatStatusLabel = (status: string) => {
    return status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const toggleFullscreen = (projectId: string) => {
    setFullscreenProject(fullscreenProject === projectId ? null : projectId);
  };

  return (
    <PageLayout>
      <div className="min-h-[80vh] bg-gray-50 py-10 px-4">
        <div className="max-w-7xl mx-auto">
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
                    <Card key={project.id} className="overflow-hidden">
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-xl">{project.name}</CardTitle>
                          <Badge className={getStatusColor(project.status) + " text-white"}>
                            {formatStatusLabel(project.status)}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-600 mb-4">{project.description || "No description provided."}</p>
                        
                        {/* Fullscreen Button - Always visible when project_url exists, positioned right after description */}
                        {project.project_url && (
                          <div className="mb-6">
                            <Button
                              variant="outline"
                              size="lg"
                              onClick={() => toggleFullscreen(project.id)}
                              className="w-full bg-blue-50 border-blue-300 hover:bg-blue-100 text-blue-700 font-semibold py-4 text-lg"
                            >
                              {fullscreenProject === project.id ? (
                                <>
                                  <Minimize className="w-6 h-6 mr-3" />
                                  Exit Fullscreen
                                </>
                              ) : (
                                <>
                                  <Maximize className="w-6 h-6 mr-3" />
                                  View Fullscreen
                                </>
                              )}
                            </Button>
                          </div>
                        )}
                        
                        {/* Project Embed */}
                        {project.project_url && (
                          <div className={`w-full ${fullscreenProject === project.id ? 'fixed inset-0 z-50 bg-white' : ''}`}>
                            {fullscreenProject === project.id && (
                              <div className="flex justify-end p-4 bg-gray-100 border-b">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setFullscreenProject(null)}
                                  className="flex items-center gap-2"
                                >
                                  <Minimize className="w-4 h-4" />
                                  Exit Fullscreen
                                </Button>
                              </div>
                            )}
                            <iframe 
                              src={project.project_url} 
                              className={fullscreenProject === project.id ? "w-full h-full" : "w-full h-[600px] max-w-sm mx-auto"} 
                              style={{ border: 'none' }}
                              title="Project Preview"
                              sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox"
                            />
                          </div>
                        )}
                        
                        <div className="flex items-center text-sm text-gray-500 mt-4">
                          <CalendarIcon className="w-4 h-4 mr-1" />
                          <span>Started: {format(new Date(project.created_at), 'MMM d, yyyy')}</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Project Updates */}
              <div>
                <h2 className="text-xl font-semibold text-gb-dark mb-4">Latest Updates</h2>
                {updates.length === 0 ? (
                  <Card>
                    <CardContent className="py-6 text-center">
                      <p>No updates yet. Check back soon!</p>
                    </CardContent>
                  </Card>
                ) : (
                  <Card>
                    <CardContent className="p-0">
                      <div className="divide-y">
                        {updates.map((update, index) => {
                          const project = projects.find(p => p.id === update.project_id);
                          return (
                            <div key={update.id} className="p-5">
                              <div className="flex justify-between items-start mb-2">
                                <h3 className="font-semibold">{update.title}</h3>
                                <div className="text-sm text-gray-500">
                                  {format(new Date(update.date), 'MMM d, yyyy')}
                                </div>
                              </div>
                              {project && (
                                <div className="text-sm text-gray-500 mb-2">
                                  Project: {project.name}
                                </div>
                              )}
                              <p className="text-gray-600 mt-2">{update.description}</p>
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  );
};

export default ClientDashboard;

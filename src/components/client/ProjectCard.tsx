
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CalendarIcon, Maximize2, Minimize2 } from 'lucide-react';
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

interface ProjectCardProps {
  project: Project;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop');

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

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  // Use the project URL from the database
  const projectUrl = project.project_url;

  // Don't render iframe if no URL is available
  if (!projectUrl) {
    return (
      <Card className="overflow-hidden">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start">
            <CardTitle className="text-xl">{project.name}</CardTitle>
            <Badge className={getStatusColor(project.status) + " text-white"}>
              {formatStatusLabel(project.status)}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="px-6 pb-4">
            <p className="text-gray-600">{project.description || "No description provided."}</p>
          </div>
          <div className="px-6 pb-4">
            <p className="text-gray-500 italic">No project URL available for preview.</p>
          </div>
          <div className="px-6 pt-4">
            <div className="flex items-center text-sm text-gray-500">
              <CalendarIcon className="w-4 h-4 mr-1" />
              <span>Started: {format(new Date(project.created_at), 'MMM d, yyyy')}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Full-screen modal
  if (isFullscreen) {
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
          gap: '12px',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            <Button
              variant={viewMode === 'desktop' ? 'default' : 'outline'}
              size="default"
              onClick={() => setViewMode('desktop')}
              className="bg-white shadow-lg"
            >
              Desktop
            </Button>
            <Button
              variant={viewMode === 'mobile' ? 'default' : 'outline'}
              size="default"
              onClick={() => setViewMode('mobile')}
              className="bg-white shadow-lg"
            >
              Mobile
            </Button>
          </div>
          <Button variant="outline" onClick={toggleFullscreen} className="bg-white shadow-lg">
            <Minimize2 className="w-4 h-4 mr-2" />
            Exit Fullscreen
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
            src={projectUrl}
            style={{
              width: viewMode === 'mobile' ? '375px' : '100%',
              height: '100vh',
              border: 'none',
              outline: 'none',
              transition: 'width 0.3s ease'
            }}
            title="Project Preview"
            allowFullScreen
          />
        </div>
      </div>
    );
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl">{project.name}</CardTitle>
          <Badge className={getStatusColor(project.status) + " text-white"}>
            {formatStatusLabel(project.status)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="px-6 pb-4">
          <p className="text-gray-600">{project.description || "No description provided."}</p>
        </div>
        
        {/* Preview Controls - Made more prominent */}
        <div className="px-6 pb-4">
          <div className="flex flex-wrap gap-3 items-center justify-center bg-gray-50 p-4 rounded-lg">
            <div className="flex gap-2">
              <Button
                variant={viewMode === 'desktop' ? 'default' : 'outline'}
                size="default"
                onClick={() => setViewMode('desktop')}
              >
                Desktop View
              </Button>
              <Button
                variant={viewMode === 'mobile' ? 'default' : 'outline'}
                size="default"
                onClick={() => setViewMode('mobile')}
              >
                Mobile View
              </Button>
            </div>
            <Button
              variant="default"
              size="default"
              onClick={toggleFullscreen}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Maximize2 className="w-4 h-4 mr-2" />
              View Fullscreen
            </Button>
          </div>
        </div>

        {/* iframe Preview - Made more reasonable size */}
        <div className="px-6 pb-4">
          <div className="flex justify-center">
            <iframe 
              src={projectUrl}
              style={{
                width: viewMode === 'mobile' ? '375px' : '100%',
                height: '500px',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                transition: 'width 0.3s ease'
              }}
              title="Project Preview"
              allowFullScreen
            />
          </div>
        </div>
        
        <div className="px-6 pt-4">
          <div className="flex items-center text-sm text-gray-500">
            <CalendarIcon className="w-4 h-4 mr-1" />
            <span>Started: {format(new Date(project.created_at), 'MMM d, yyyy')}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectCard;

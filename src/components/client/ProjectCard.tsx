
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CalendarIcon, Maximize2, Minimize2 } from 'lucide-react';
import { format } from 'date-fns';
import ProjectEmbed from './ProjectEmbed';

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

  // Full-screen modal
  if (isFullscreen && project.project_url) {
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
          <Button variant="outline" onClick={toggleFullscreen} className="bg-white shadow-md">
            <Minimize2 className="w-4 h-4 mr-1" />
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
            src={project.project_url} 
            style={{
              width: viewMode === 'mobile' ? '375px' : '100%',
              height: '100vh',
              border: 'none',
              outline: 'none',
              transition: 'width 0.3s ease'
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
        
        {project.project_url && (
          <div className="project-preview-container" style={{ 
            width: '100%', 
            height: 'auto', 
            maxWidth: '100%', 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            overflow: 'hidden' 
          }}>
            {/* Preview Controls */}
            <div style={{ 
              marginBottom: '10px', 
              display: 'flex', 
              gap: '8px', 
              alignItems: 'center',
              padding: '0 20px',
              width: '100%',
              justifyContent: 'center'
            }}>
              <div style={{ display: 'flex', gap: '4px' }}>
                <Button
                  variant={viewMode === 'desktop' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('desktop')}
                  className="text-xs"
                >
                  Desktop
                </Button>
                <Button
                  variant={viewMode === 'mobile' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('mobile')}
                  className="text-xs"
                >
                  Mobile
                </Button>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={toggleFullscreen}
                className="text-xs"
              >
                <Maximize2 className="w-3 h-3 mr-1" />
                Fullscreen
              </Button>
            </div>

            {/* iframe Preview */}
            <div style={{
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}>
              <iframe 
                src={project.project_url} 
                style={{
                  width: viewMode === 'mobile' ? '375px' : '100%',
                  height: '600px',
                  border: '1px solid #ccc',
                  transition: 'width 0.3s ease'
                }}
                title="Project Preview"
                sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox"
              />
            </div>
          </div>
        )}
        
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

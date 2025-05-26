
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarIcon } from 'lucide-react';
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
          <ProjectEmbed projectUrl={project.project_url} />
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

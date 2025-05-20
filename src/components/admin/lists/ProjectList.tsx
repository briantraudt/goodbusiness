
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Edit, ExternalLink } from 'lucide-react';

interface Client {
  id: string;
  name: string;
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

interface ProjectListProps {
  projects: Project[];
  clients: Client[];
  onEditProject: (project: Project) => void;
}

const ProjectList = ({ projects, clients, onEditProject }: ProjectListProps) => {
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in_progress':
        return 'bg-blue-500';
      case 'completed':
        return 'bg-green-500';
      case 'on_hold':
        return 'bg-yellow-500';
      default:
        return '';
    }
  };

  const formatStatusLabel = (status: string) => {
    switch (status) {
      case 'in_progress':
        return 'In Progress';
      case 'completed':
        return 'Completed';
      case 'on_hold':
        return 'On Hold';
      default:
        return status;
    }
  };

  return (
    <div className="bg-white rounded-lg border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Project Name</TableHead>
            <TableHead>Client</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Project URL</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {projects.map((project) => {
            const client = clients.find(c => c.id === project.client_id);
            return (
              <TableRow key={project.id}>
                <TableCell className="font-medium">{project.name}</TableCell>
                <TableCell>{client?.name || 'Unknown Client'}</TableCell>
                <TableCell>
                  <Badge className={getStatusColor(project.status) + " text-white"}>
                    {formatStatusLabel(project.status)}
                  </Badge>
                </TableCell>
                <TableCell>
                  {project.project_url ? (
                    <div className="flex items-center space-x-2">
                      <span className="text-sm truncate max-w-[200px]">
                        {project.project_url}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => window.open(project.project_url!, '_blank')}
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <span className="text-gray-500">None</span>
                  )}
                </TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEditProject(project)}
                  >
                    <Edit className="h-4 w-4 mr-1" /> Edit
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default ProjectList;

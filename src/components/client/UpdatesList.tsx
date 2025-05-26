
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
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

interface UpdatesListProps {
  updates: ProjectUpdate[];
  projects: Project[];
}

const UpdatesList: React.FC<UpdatesListProps> = ({ updates, projects }) => {
  if (updates.length === 0) {
    return (
      <Card>
        <CardContent className="py-6 text-center">
          <p>No updates yet. Check back soon!</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-0">
        <div className="divide-y">
          {updates.map((update) => {
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
  );
};

export default UpdatesList;

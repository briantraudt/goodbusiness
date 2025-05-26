
import React from 'react';

interface ProjectEmbedProps {
  projectUrl: string;
}

const ProjectEmbed: React.FC<ProjectEmbedProps> = ({ projectUrl }) => {
  return (
    <div className="w-full">
      <iframe 
        src={projectUrl} 
        className="w-full h-[80vh] min-h-[600px] border-0" 
        title="Project Preview"
        sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox"
      />
    </div>
  );
};

export default ProjectEmbed;

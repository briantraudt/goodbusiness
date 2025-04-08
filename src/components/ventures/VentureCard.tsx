
import React, { useState } from 'react';
import { ExternalLink, Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

export interface VentureCardProps {
  venture: {
    name: string;
    tagline: string;
    description: string;
    color: string;
    status: string;
    link: string;
  };
  index: number;
}

const VentureCard = ({ venture, index }: VentureCardProps) => {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [services, setServices] = useState<string[]>([]);
  const [newService, setNewService] = useState('');
  const { toast } = useToast();

  const handleAddService = () => {
    if (newService.trim() !== '') {
      setServices([...services, newService.trim()]);
      setNewService('');
      
      toast({
        title: "Service Added",
        description: `${newService} has been added to ${venture.name}'s services.`,
      });
    }
  }

  const handleRemoveService = (index: number) => {
    const updatedServices = [...services];
    updatedServices.splice(index, 1);
    setServices(updatedServices);
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddService();
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
      <div>
        <div className={`venture-card ${venture.color}`}>
          <span className="inline-block px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium mb-4">
            {venture.status}
          </span>
          <h3 className="text-2xl font-bold text-gb-dark mb-2">{venture.name}</h3>
          <p className="text-lg font-medium text-gb-dark/80 mb-4 italic">
            {venture.tagline}
          </p>
          <p className="text-gb-dark/70 mb-6">
            {venture.description}
          </p>
          <Button 
            variant="outline" 
            className="mt-auto inline-flex items-center"
            onClick={() => setIsDetailsOpen(true)}
          >
            Learn More
            <ExternalLink className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="flex justify-center">
        {index === 0 ? (
          <Dialog>
            <DialogTrigger asChild>
              <img 
                src="/lovable-uploads/35487980-8600-4a91-a5a8-b226968d1e70.png" 
                alt="SideStage Mobile App" 
                className="h-auto w-auto max-h-[500px] rounded-3xl cursor-pointer transition-transform hover:scale-[1.02]" 
              />
            </DialogTrigger>
            <DialogContent className="sm:max-w-[80vw] max-h-[90vh] flex items-center justify-center p-0 overflow-hidden">
              <img 
                src="/lovable-uploads/35487980-8600-4a91-a5a8-b226968d1e70.png" 
                alt="SideStage Mobile App - Enlarged" 
                className="w-auto h-auto max-h-[90vh] max-w-[80vw] object-contain rounded-3xl" 
              />
            </DialogContent>
          </Dialog>
        ) : (
          <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
            <div className="w-full h-full flex items-center justify-center bg-gb-blue/10 text-gb-blue">
              {venture.name} Preview
            </div>
          </div>
        )}
      </div>

      {/* Services Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle className="text-2xl">{venture.name} Services</DialogTitle>
          </DialogHeader>
          
          <div className="py-4">
            <p className="mb-4 text-muted-foreground">{venture.description}</p>
            
            <div className="mt-6">
              <h4 className="text-lg font-medium mb-2">Services Provided:</h4>
              
              <div className="flex items-center gap-2 mb-4">
                <Input
                  placeholder="Add a service..."
                  value={newService}
                  onChange={(e) => setNewService(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="flex-1"
                />
                <Button 
                  size="sm"
                  onClick={handleAddService}
                  disabled={!newService.trim()}
                >
                  <Plus className="h-4 w-4" />
                  Add
                </Button>
              </div>
              
              <div className="space-y-2 max-h-[200px] overflow-y-auto">
                {services.length === 0 ? (
                  <p className="text-sm text-muted-foreground italic">No services added yet. Add services that were provided for this project.</p>
                ) : (
                  services.map((service, idx) => (
                    <div key={idx} className="flex items-center justify-between bg-secondary/50 p-2 rounded-md">
                      <span>{service}</span>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleRemoveService(idx)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-between mt-4">
            <Button variant="outline" onClick={() => setIsDetailsOpen(false)}>
              Close
            </Button>
            <Button asChild>
              <a href={venture.link} target="_blank" rel="noopener noreferrer">
                Visit Project
                <ExternalLink className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default VentureCard;

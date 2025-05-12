
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface VentureServicesDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  venture: {
    name: string;
    description: string;
    services: string[];
  };
}

const VentureServicesDialog = ({ isOpen, setIsOpen, venture }: VentureServicesDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle className="text-2xl">{venture.name} Services</DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          <p className="mb-4 text-muted-foreground">{venture.description}</p>
          
          <div className="mt-6">
            <h4 className="text-lg font-medium mb-2">Services Provided:</h4>
            
            <div className="space-y-2 max-h-[200px] overflow-y-auto">
              {venture.services.length === 0 ? (
                <p className="text-sm text-muted-foreground italic">No services have been added yet.</p>
              ) : (
                venture.services.map((service, idx) => (
                  <div key={idx} className="flex items-center justify-between bg-secondary/50 p-2 rounded-md">
                    <span>{service}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end mt-4">
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VentureServicesDialog;

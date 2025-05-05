
import React from 'react';
import { Button } from "@/components/ui/button";
import { Loader2, ArrowRight } from "lucide-react";

interface SubmitButtonProps {
  isSubmitting: boolean;
}

const SubmitButton: React.FC<SubmitButtonProps> = ({ isSubmitting }) => {
  return (
    <Button 
      type="submit" 
      className="bg-gb-green hover:bg-gb-green/90 text-white text-lg flex items-center justify-center w-full sm:w-auto"
      disabled={isSubmitting}
    >
      {isSubmitting ? (
        <>
          <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Preparing Email...
        </>
      ) : (
        <>
          Submit Idea
          <ArrowRight className="ml-2 h-5 w-5" />
        </>
      )}
    </Button>
  );
};

export default SubmitButton;

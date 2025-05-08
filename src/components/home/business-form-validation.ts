
export interface FormErrors {
  fullName?: string;
  email?: string;
  businessIdea?: string;
  problemSolution?: string;
  profitType?: string;
  businessStage?: string;
  budget?: string;
  [key: string]: string | undefined;
}

export const validateBusinessForm = (
  fullName: string,
  email: string,
  businessIdea: string,
  problemSolution: string,
  profitType: string,
  businessStage: string,
  budget: string
): { isValid: boolean; errors: FormErrors } => {
  const errors: FormErrors = {};
  let isValid = true;
  
  // Validate required fields
  if (!fullName.trim()) {
    errors.fullName = 'Full Name is required';
    isValid = false;
  }
  
  // Validate email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email.trim()) {
    errors.email = 'Email Address is required';
    isValid = false;
  } else if (!emailRegex.test(email)) {
    errors.email = 'Please enter a valid email address';
    isValid = false;
  }
  
  // Validate business idea
  if (!businessIdea.trim()) {
    errors.businessIdea = 'Business idea description is required';
    isValid = false;
  }
  
  // Validate problem solution
  if (!problemSolution.trim()) {
    errors.problemSolution = 'Problem solution is required';
    isValid = false;
  }
  
  // Validate profit type
  if (!profitType) {
    errors.profitType = 'Please select an option';
    isValid = false;
  }
  
  // Validate business stage
  if (!businessStage) {
    errors.businessStage = 'Please select a business stage';
    isValid = false;
  }
  
  // Validate budget
  if (!budget) {
    errors.budget = 'Please select a budget range';
    isValid = false;
  }
  
  return { isValid, errors };
};

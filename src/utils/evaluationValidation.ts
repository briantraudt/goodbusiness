
import { toast } from 'sonner';

/**
 * Validates the business evaluation form inputs
 */
export const validateEvaluationForm = (
  idea: string,
  name: string,
  email: string
): { isValid: boolean; errorMessage: string | null } => {
  // Validate idea
  if (!idea.trim()) {
    toast.error('Please enter your business idea');
    return { isValid: false, errorMessage: 'Please enter your business idea.' };
  }

  // Validate name
  if (!name.trim()) {
    toast.error('Please enter your name');
    return { isValid: false, errorMessage: 'Please enter your name.' };
  }

  // Validate email
  if (!email.trim()) {
    toast.error('Please enter your email address');
    return { isValid: false, errorMessage: 'Please enter your email address.' };
  }

  // Email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    toast.error('Please enter a valid email address');
    return { isValid: false, errorMessage: 'Please enter a valid email address.' };
  }

  return { isValid: true, errorMessage: null };
};

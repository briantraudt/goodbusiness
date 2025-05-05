
import * as z from 'zod';

// Define form validation schema
export const formSchema = z.object({
  firstName: z.string().min(1, { message: "First name is required" }),
  lastName: z.string().min(1, { message: "Last name is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  company: z.string().optional(),
  projectTitle: z.string().min(1, { message: "Project title is required" }),
  problemStatement: z.string().min(10, { message: "Please describe the problem your idea solves" }),
  targetMarket: z.string().min(1, { message: "Target market is required" }),
  marketSize: z.enum(["small", "medium", "large"], {
    message: "Please select an estimated market size",
  }),
  timeframe: z.enum(["immediate", "3months", "6months", "flexible"], {
    message: "Please select a timeframe",
  }),
  budgetRange: z.enum(["under10k", "10to25k", "25to50k", "over50k", "undefined"], {
    message: "Please select a budget range",
  }),
  additionalInfo: z.string().optional(),
});

export type FormValues = z.infer<typeof formSchema>;

export const defaultValues: FormValues = {
  firstName: "",
  lastName: "",
  email: "",
  company: "",
  projectTitle: "",
  problemStatement: "",
  targetMarket: "",
  marketSize: undefined as any,
  timeframe: undefined as any,
  budgetRange: undefined as any,
  additionalInfo: "",
};

import { AlertTriangle, CheckCircle2 } from "lucide-react";

interface FeedbackProps {
  message?: string;
}

// Error
export const FormError = ({ message }: FeedbackProps) => {
  if (!message) return null;

  return (
    <div className="bg-destructive/15 p-3 rounded-md flex items-center gap-x-2 text-sm text-destructive border border-destructive/20 animate-in fade-in slide-in-from-top-1 duration-300 mt-4 w-fit mx-auto px-5">
      <AlertTriangle className="h-4 w-4 shrink-0" />
      <p>{message}</p>
    </div>
  );
};

// Success
export const FormSuccess = ({ message }: FeedbackProps) => {
  if (!message) return null;

  return (
    <div className="bg-foreground/15 p-3 rounded-md flex items-center gap-x-2 text-sm text-secondary border animate-in fade-in slide-in-from-top-1 duration-300 mt-4 w-fit mx-auto px-5">
      <CheckCircle2 className="h-4 w-4 shrink-0" />
      <p>{message}</p>
    </div>
  );
};

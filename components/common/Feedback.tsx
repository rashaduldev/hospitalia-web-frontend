import { AlertTriangle, CheckCircle2 } from "lucide-react";

interface FeedbackProps {
  message?: string;
}

// Error
export const FormError = ({ message }: FeedbackProps) => {
  if (!message) return null;

  return (
      <p className="text-destructive text-xs font-semibold">{message}</p>
  );
};

// Success
export const FormSuccess = ({ message }: FeedbackProps) => {
  if (!message) return null;

  return (
    <div className="flex items-center gap-x-2 text-sm text-secondary animate-in fade-in slide-in-from-top-1 duration-300 mt-6 w-fit mx-auto">
      <CheckCircle2 className="h-4 w-4 shrink-0" />
      <p>{message}</p>
    </div>
  );
};

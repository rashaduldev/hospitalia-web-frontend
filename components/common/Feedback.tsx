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
    <p className="text-secondary text-xs font-semibold">{message}</p>
  );
};

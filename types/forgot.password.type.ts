export type ForgotPasswordType = {
  onSubmit?: (email: string) => void;
  onBack?: () => void;
  className?: string;
  defaultEmail?: string;
  isLoading?: boolean;
  isSuccess?: boolean;
  errors?: {
    email?: string;
    general?: string;
  };
  successMessage?: string;
};

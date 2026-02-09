import { FieldValues, UseFormSetError } from "react-hook-form";

export function useServerFormError<T extends FieldValues>(setError: UseFormSetError<T>) {
  return (error: any) => {
    // field-level errors
    if (error?.errors) {
      Object.entries(error.errors).forEach(([field, message]) => {
        setError(field as any, { type: "manual", message: message as string });
      });
    }

    // global error
    if (error?.message) {
      setError("root.serverError" as any, {
        type: "manual",
        message: error?.message || "Something went wrong",
        });
    }
  };
}


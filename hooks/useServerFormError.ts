import { FieldValues, UseFormSetError } from "react-hook-form";

export function useServerFormError<T extends FieldValues>(
  setError: UseFormSetError<T>
) {
  return (err: any) => {
    // global error
    setError("root.serverError" as any, {
      type: "manual",
      message: err?.message || "Something went wrong",
    });

    // field level errors
    if (err?.errors) {
      Object.entries(err.errors).forEach(([field, message]) => {
        setError(field as any, {
          type: "manual",
          message: message as string,
        });
      });
    }
  };
}

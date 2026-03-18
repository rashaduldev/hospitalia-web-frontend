import { ErrorHandle } from "@/components/common/ErrorHandle";

type StatusMessageProps = {
  isPending: boolean;
  createError: any;
  deleteError: any;
  isDateInDatabase: boolean;
};

export const StatusMessage = ({
  isPending,
  createError,
  deleteError,
  isDateInDatabase,
}: StatusMessageProps) => {
  if (isPending) return null;

  let message: string | null = null;

  if (createError) {
    message =
      createError?.message ||
      createError?.response?.data?.message ||
      "Something went wrong while creating.";
  } else if (deleteError) {
    message =
      deleteError?.message ||
      deleteError?.response?.data?.message ||
      "Something went wrong while deleting.";
  } else if (isDateInDatabase) {
    message = "This day is already set as unavailable";
  }

  if (!message) return null;

  return <ErrorHandle message={message} type="inline" />;
};

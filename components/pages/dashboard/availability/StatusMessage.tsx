import { ErrorHandle } from "@/components/common/ErrorHandle";
import { useI18n } from "@/locales/client";

type StatusMessageProps = {
  isPending: boolean;
  isCreateError: boolean;
  isDeleteError: boolean;
  isDateInDatabase: boolean;
};

export const StatusMessage = ({
  isPending,
  isCreateError,
  isDeleteError,
  isDateInDatabase,
}: StatusMessageProps) => {
  const t = useI18n();

  if (isPending) return null;

  let message: string | null = null;

  if (isCreateError || isDeleteError) {
    message = t("unavailability.error_message") || "Something went wrong.";
  } else if (isDateInDatabase) {
    message =
      t("unavailability.already_set") ||
      "This day is already set as unavailable";
  }

  if (!message) return null;

  return <ErrorHandle message={message} type="inline" />;
};

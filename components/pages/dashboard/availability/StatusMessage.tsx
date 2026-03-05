import { useI18n } from "@/locales/client";

type StatusMessageProps = {
  isPending: boolean;
  isCreateSuccess: boolean;
  isDeleteSuccess: boolean;
  isCreateError: boolean;
  isDeleteError: boolean;
  isDateInDatabase: boolean;
};

export const StatusMessage = ({
  isPending,
  isCreateSuccess,
  isDeleteSuccess,
  isCreateError,
  isDeleteError,
  isDateInDatabase,
}: StatusMessageProps) => {
  const t = useI18n();

  if (isPending) return null;

  if (isCreateSuccess) {
    return (
      <p className="text-sm text-secondary font-medium">
        {t("unavailability.success_message") ||
          "Date set as unavailable successfully"}
      </p>
    );
  }

  if (isDeleteSuccess) {
    return (
      <p className="text-sm text-secondary font-medium">
        {t("unavailability.remove_success") || "Availability restored"}
      </p>
    );
  }

  if (isCreateError || isDeleteError) {
    return (
      <p className="text-sm text-destructive font-medium">
        {t("unavailability.error_message") || "Something went wrong."}
      </p>
    );
  }

  if (isDateInDatabase) {
    return (
      <p className="text-sm text-destructive font-medium">
        {t("unavailability.already_set") ||
          "This day is already set as unavailable"}
      </p>
    );
  }

  return null;
};

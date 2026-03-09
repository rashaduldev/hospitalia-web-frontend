import { Typography } from "@/components/ui/Typography";
import { AlertCircle } from "lucide-react";

type ErrorDisplayProps = {
  message: string;
  status?: number;
  type?: "inline" | "page";
  action?: React.ReactNode;
};

export const ErrorHandle = ({
  message,
  status,
  type = "inline",
  action,
}: ErrorDisplayProps) => {
  if (type === "inline") {
    return (
      <Typography size="sm" color="destructive" weight="medium">
        {message} {status && `(Status Code: ${status})`}
      </Typography>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-muted p-4">
      <div className="max-w-md w-full bg-muted shadow-md rounded-lg p-6 border-t-4 border-destructive">
        <div className="flex items-center gap-3 mb-4">
          <AlertCircle className="text-destructive" />
          <Typography size="2xl" as="h3" color="foreground">
            Error
          </Typography>
        </div>
        <Typography
          size="xs"
          color="muted_foreground"
          weight="semiBold"
          className="mb-6"
        >
          {message} {status && `(Status Code: ${status})`}
        </Typography>
        {action && <div className="flex gap-4">{action}</div>}
      </div>
    </div>
  );
};

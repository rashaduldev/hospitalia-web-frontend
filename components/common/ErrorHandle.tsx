import Link from "next/link";
import { AlertCircle } from "lucide-react";
import { Typography } from "../ui/Typography";

export default function ErrorHandle({
  message,
  status,
}: {
  message: string;
  status?: number;
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-muted p-4">
      <div className="max-w-md w-full bg-muted shadow-md rounded-lg p-6 border-t-4 border-destructive">
        <div className="flex items-center gap-3 mb-4">
          <AlertCircle className="text-destructive" />
          <Typography size="2xl" as="h3" color="foreground">
            Authentication Error
          </Typography>
        </div>
        <Typography size="xs" color="muted_foreground" weight="semiBold" className="mb-6">
          {message}
          {status && (
            <span className="text-sm text-muted-foreground">
              {" "}
              (Status Code: {status})
            </span>
          )}
        </Typography>
        <div className="flex gap-4">
          <Link
            href="/login"
            className="flex-1 text-center bg-primary text-muted py-2 rounded-md hover:bg-primary transition"
          >
            Return to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
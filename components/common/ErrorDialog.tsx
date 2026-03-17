import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { AlertCircle } from "lucide-react";
import AppButton from "@/components/common/AppButton";

interface ErrorDialogProps {
  message: string | null;
  onClose: () => void;
}

function toFriendlyMessage(message: string): string {
  const lower = message.toLowerCase();
  // Fallback for raw network/abort errors that bypass apiClient (e.g. thrown directly)
  if (lower.includes("failed to fetch") || lower.includes("networkerror") || lower.includes("load failed")) {
    return "Unable to reach the server. Please check your internet connection and try again.";
  }
  if (lower.includes("aborted") || lower.includes("timed out") || lower.includes("timeout")) {
    return "The request timed out. The server took too long to respond. Please try again.";
  }
  return message;
}

export default function ErrorDialog({ message, onClose }: ErrorDialogProps) {
  return (
    <Dialog open={!!message} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-sm">
        <div className="flex flex-col items-center text-center gap-3">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-destructive/10">
            <AlertCircle className="h-6 w-6 text-destructive" />
          </div>
          <DialogTitle className="text-base font-semibold">Something went wrong</DialogTitle>
          <p className="text-sm text-muted-foreground px-2">
            {message ? toFriendlyMessage(message) : "An unexpected error occurred."}
          </p>
        </div>

        <DialogFooter className="sm:justify-center">
          <AppButton variant="destructive" onClick={onClose}>
            Close
          </AppButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

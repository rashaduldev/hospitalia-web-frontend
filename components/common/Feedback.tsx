"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, CheckCircle2 } from "lucide-react";

interface FeedbackProps {
  message?: string;
}

// Error
export const FormError = ({ message}: FeedbackProps) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (message) {
      setShow(true);
      const timer = setTimeout(() => setShow(false));
      return () => clearTimeout(timer);
    }
  }, [message]);

  if (!show || !message) return null;

  return (
    <div className="bg-destructive/15 p-3 rounded-md flex items-center gap-x-2 text-sm text-destructive border border-destructive/20 animate-in fade-in slide-in-from-top-1 duration-300 mt-4">
      <AlertTriangle className="h-4 w-4 shrink-0" />
      <p>{message}</p>
    </div>
  );
};

// Success
export const FormSuccess = ({ message }: FeedbackProps) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (message) {
      setShow(true);
      const timer = setTimeout(() => setShow(false));
      return () => clearTimeout(timer);
    }
  }, [message]);

  if (!show || !message) return null;

  return (
    <div className="bg-emerald-500/15 p-3 rounded-md flex items-center gap-x-2 text-sm text-emerald-600 border border-emerald-500/20 animate-in fade-in slide-in-from-top-1 duration-300 mt-4">
      <CheckCircle2 className="h-4 w-4 shrink-0" />
      <p>{message}</p>
    </div>
  );
};
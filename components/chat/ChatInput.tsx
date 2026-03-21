"use client";

import { useRef, useState, useCallback } from "react";
import { Paperclip, Send, X, FileText, Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface QueuedFile {
  id: string;
  file: File;
  previewUrl?: string; // only for images
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function isImageMime(type: string) {
  return type.startsWith("image/");
}

export function ChatInput({
  onSend,
  disabled,
}: {
  onSend: (text: string, files: QueuedFile[]) => void;
  disabled?: boolean;
}) {
  const [text, setText] = useState("");
  const [files, setFiles] = useState<QueuedFile[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const canSend = !disabled && (text.trim().length > 0 || files.length > 0);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const picked = Array.from(e.target.files ?? []);
    if (!picked.length) return;

    const newQueued: QueuedFile[] = picked.map((f) => ({
      id: `${Date.now()}-${Math.random()}`,
      file: f,
      previewUrl: isImageMime(f.type) ? URL.createObjectURL(f) : undefined,
    }));

    setFiles((prev) => [...prev, ...newQueued]);
    // reset so same file can be re-added
    e.target.value = "";
  };

  const removeFile = (id: string) => {
    setFiles((prev) => {
      const target = prev.find((f) => f.id === id);
      if (target?.previewUrl) URL.revokeObjectURL(target.previewUrl);
      return prev.filter((f) => f.id !== id);
    });
  };

  const handleSend = useCallback(() => {
    if (!canSend) return;
    onSend(text.trim(), files);
    setText("");
    setFiles([]);
    // reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  }, [canSend, text, files, onSend]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    // auto-grow
    const el = e.target;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
  };

  return (
    <div className="border-t border-border bg-card px-4 py-3 shrink-0">
      {/* File preview row */}
      {files.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {files.map((qf) =>
            qf.previewUrl ? (
              // Image thumbnail
              <div key={qf.id} className="relative group">
                <img
                  src={qf.previewUrl}
                  alt={qf.file.name}
                  className="h-16 w-16 rounded-lg object-cover border border-border"
                />
                <button
                  type="button"
                  onClick={() => removeFile(qf.id)}
                  className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-foreground text-background flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-2.5 h-2.5" />
                </button>
              </div>
            ) : (
              // File chip
              <div
                key={qf.id}
                className="flex items-center gap-2 bg-muted rounded-lg px-3 py-2 pr-2 max-w-[200px] group"
              >
                <FileText className="w-4 h-4 text-primary shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs font-medium text-foreground truncate">{qf.file.name}</p>
                  <p className="text-[10px] text-muted-foreground">{formatFileSize(qf.file.size)}</p>
                </div>
                <button
                  type="button"
                  onClick={() => removeFile(qf.id)}
                  className="ml-1 shrink-0 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )
          )}
        </div>
      )}

      {/* Input row */}
      <div className="flex items-end gap-2">
        {/* File upload button */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled}
          className="shrink-0 w-9 h-9 flex items-center justify-center rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/8 transition-colors disabled:opacity-40"
          title="Attach file"
        >
          <Paperclip className="w-4.5 h-4.5" />
        </button>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.txt"
          className="hidden"
          onChange={handleFileChange}
        />

        {/* Textarea */}
        <textarea
          ref={textareaRef}
          value={text}
          onChange={handleTextChange}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          placeholder="Type a message… (Enter to send, Shift+Enter for new line)"
          rows={1}
          className={cn(
            "flex-1 resize-none rounded-xl border border-border bg-background px-4 py-2.5",
            "text-sm text-foreground placeholder:text-muted-foreground",
            "focus:outline-none focus:ring-2 focus:ring-primary/30 transition-shadow",
            "min-h-[40px] max-h-[120px] overflow-y-auto leading-relaxed",
            "disabled:opacity-50"
          )}
        />

        {/* Send button */}
        <button
          type="button"
          onClick={handleSend}
          disabled={!canSend}
          className={cn(
            "shrink-0 w-9 h-9 rounded-lg flex items-center justify-center transition-all",
            canSend
              ? "bg-primary text-white hover:bg-primary/90 shadow-sm"
              : "bg-muted text-muted-foreground cursor-not-allowed"
          )}
          title="Send message"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>

      <p className="mt-1.5 text-[10px] text-muted-foreground/60 text-right">
        Shift+Enter for new line · Attach images, PDFs, and documents
      </p>
    </div>
  );
}

export type { QueuedFile };

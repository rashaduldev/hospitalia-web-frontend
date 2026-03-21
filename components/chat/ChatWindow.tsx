"use client";

import { useEffect, useRef } from "react";
import {
  MoreVertical,
  ChevronLeft,
  Check,
  CheckCheck,
  FileText,
  FileImage,
  FileVideo,
  FileAudio,
  FileArchive,
  FileSpreadsheet,
  File,
  Loader2,
  AlertCircle,
  RefreshCw,
  ExternalLink,
} from "lucide-react";
import { Conversation, Message, MessageFile, MessageStatus } from "./types";
import { ChatInput, QueuedFile } from "./ChatInput";
import { cn } from "@/lib/utils";
import { format, isToday, isYesterday, isSameDay } from "date-fns";

// ── Helpers ──────────────────────────────────────────────────────────────────

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function isImageMime(type: string) {
  return type.startsWith("image/");
}


function formatMsgTime(date: Date): string {
  return format(date, "h:mm a");
}

function formatDateSeparator(date: Date): string {
  if (isToday(date)) return "Today";
  if (isYesterday(date)) return "Yesterday";
  return format(date, "EEEE, MMMM d");
}

function getFileTypeInfo(mimeType: string): {
  Icon: React.ElementType;
  color: string;
  bg: string;
  label: string;
} {
  if (mimeType.startsWith("image/"))
    return { Icon: FileImage, color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-950/40", label: "Image" };
  if (mimeType === "application/pdf")
    return { Icon: FileText, color: "text-red-500", bg: "bg-red-50 dark:bg-red-950/40", label: "PDF" };
  if (mimeType.includes("spreadsheet") || mimeType.includes("excel") || mimeType.includes("csv"))
    return { Icon: FileSpreadsheet, color: "text-green-500", bg: "bg-green-50 dark:bg-green-950/40", label: "Spreadsheet" };
  if (mimeType.includes("word") || mimeType.includes("document") || mimeType.includes("msword"))
    return { Icon: FileText, color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-950/40", label: "Document" };
  if (mimeType.startsWith("video/"))
    return { Icon: FileVideo, color: "text-purple-500", bg: "bg-purple-50 dark:bg-purple-950/40", label: "Video" };
  if (mimeType.startsWith("audio/"))
    return { Icon: FileAudio, color: "text-yellow-500", bg: "bg-yellow-50 dark:bg-yellow-950/40", label: "Audio" };
  if (mimeType.includes("zip") || mimeType.includes("rar") || mimeType.includes("archive") || mimeType.includes("tar"))
    return { Icon: FileArchive, color: "text-orange-500", bg: "bg-orange-50 dark:bg-orange-950/40", label: "Archive" };
  return { Icon: File, color: "text-muted-foreground", bg: "bg-muted", label: "File" };
}

function getFileAccessUrl(fileId: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? "";
  return `${baseUrl}/api/file-objects/id/${fileId}/download`;
}

// ── Status icon ───────────────────────────────────────────────────────────────

function StatusIcon({ status }: { status?: MessageStatus }) {
  if (!status) return null;
  if (status === "sending")
    return <Loader2 className="w-3 h-3 animate-spin text-white/50" />;
  if (status === "sent")
    return <Check className="w-3 h-3 text-white/60" />;
  if (status === "delivered")
    return <CheckCheck className="w-3 h-3 text-white/60" />;
  if (status === "read")
    return <CheckCheck className="w-3 h-3 text-primary-foreground/90" />;
  return null;
}

// ── File attachment display ───────────────────────────────────────────────────

function FileCard({ file, isMine }: { file: MessageFile; isMine: boolean }) {
  const { Icon, color, bg } = getFileTypeInfo(file.mimeType);
  const ext = file.name.split(".").pop()?.toUpperCase() ?? "FILE";

  return (
    <a
      href={getFileAccessUrl(file.id)}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "flex items-center gap-3 mt-1.5 rounded-xl px-3 py-2.5 w-[260px] transition-colors group",
        isMine ? "bg-white/15 hover:bg-white/25" : "bg-muted hover:bg-muted/80"
      )}
    >
      <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center shrink-0", isMine ? "bg-white/20" : bg)}>
        <Icon className={cn("w-5 h-5", isMine ? "text-white" : color)} />
      </div>
      <div className="min-w-0 flex-1">
        <p className={cn("text-xs font-semibold truncate leading-snug", isMine ? "text-white" : "text-foreground")}>
          {file.name}
        </p>
        <p className={cn("text-[10px] mt-0.5 font-medium", isMine ? "text-white/60" : "text-muted-foreground")}>
          {ext} · {formatFileSize(file.size)}
        </p>
      </div>
      <ExternalLink className={cn("w-3.5 h-3.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity", isMine ? "text-white" : "text-primary")} />
    </a>
  );
}

// ── Single message bubble ─────────────────────────────────────────────────────

function MessageBubble({
  message,
  isMine,
  showAvatar,
  initials,
}: {
  message: Message;
  isMine: boolean;
  showAvatar: boolean;
  initials: string;
}) {
  const hasText = !!message.text;
  const hasFiles = !!message.files?.length;

  return (
    <div className={cn("flex items-end gap-2", isMine ? "flex-row-reverse" : "flex-row")}>
      {/* Avatar placeholder — keeps spacing consistent */}
      <div className="w-7 shrink-0">
        {!isMine && showAvatar && (
          <div className="w-7 h-7 rounded-full bg-secondary/20 text-secondary flex items-center justify-center text-[10px] font-bold">
            {initials}
          </div>
        )}
      </div>

      {/* Bubble content */}
      <div className={cn("flex flex-col max-w-[70%] sm:max-w-[60%]", isMine ? "items-end" : "items-start")}>
        {/* Text bubble */}
        {hasText && (
          <div
            className={cn(
              "rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
              isMine
                ? "bg-primary text-white rounded-br-none"
                : "bg-card border border-border text-foreground rounded-bl-none shadow-sm"
            )}
          >
            {message.text}
          </div>
        )}

        {/* File attachments */}
        {hasFiles && (
          <div className={cn("flex flex-col", isMine ? "items-end" : "items-start")}>
            {message.files!.map((file) => (
              <FileCard key={file.id} file={file} isMine={isMine} />
            ))}
          </div>
        )}

        {/* Timestamp + status */}
        <div className={cn("flex items-center gap-1 mt-1", isMine ? "flex-row-reverse" : "")}>
          <span className="text-[10px] text-muted-foreground">
            {formatMsgTime(message.timestamp)}
          </span>
          {isMine && <StatusIcon status={message.status} />}
        </div>
      </div>
    </div>
  );
}

// ── Date separator ────────────────────────────────────────────────────────────

function DateSeparator({ date }: { date: Date }) {
  return (
    <div className="flex items-center gap-3 my-4">
      <div className="flex-1 h-px bg-border" />
      <span className="text-[11px] font-medium text-muted-foreground px-2">
        {formatDateSeparator(date)}
      </span>
      <div className="flex-1 h-px bg-border" />
    </div>
  );
}

// ── Online status text ────────────────────────────────────────────────────────

function OnlineStatus({ isOnline }: { isOnline: boolean }) {
  return (
    <div className="flex items-center gap-1.5">
      <span
        className={cn(
          "w-2 h-2 rounded-full",
          isOnline ? "bg-green-500" : "bg-muted-foreground/40"
        )}
      />
      <span className="text-xs text-muted-foreground">
        {isOnline ? "Online" : "Offline"}
      </span>
    </div>
  );
}

// ── Empty state (no conversation selected) ───────────────────────────────────

function EmptyState() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center p-8 bg-dashboard-bg">
      <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-8 h-8 text-primary"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
          />
        </svg>
      </div>
      <div>
        <p className="font-semibold text-foreground">No conversation selected</p>
        <p className="text-sm text-muted-foreground mt-1">
          Choose a conversation from the sidebar to start messaging
        </p>
      </div>
    </div>
  );
}

// ── Main ChatWindow ───────────────────────────────────────────────────────────

function MessagesSkeleton() {
  return (
    <div className="flex-1 flex flex-col gap-4 px-4 py-4 bg-dashboard-bg animate-pulse">
      {[60, 40, 75, 50, 65].map((w, i) => (
        <div
          key={i}
          className={`flex items-end gap-2 ${i % 2 === 0 ? "" : "flex-row-reverse"}`}
        >
          <div className="w-7 h-7 rounded-full bg-muted shrink-0" />
          <div
            className="h-9 rounded-2xl bg-muted"
            style={{ width: `${w}%`, maxWidth: 320 }}
          />
        </div>
      ))}
    </div>
  );
}

export function ChatWindow({
  conversation,
  messages,
  myId,
  onSendMessage,
  onBack,
  isLoading = false,
  isError = false,
  onRetry,
  isSending = false,
}: {
  conversation: Conversation | null;
  messages: Message[];
  myId: string;
  onSendMessage: (text: string, files: QueuedFile[]) => Promise<void>;
  onBack: () => void;
  isLoading?: boolean;
  isError?: boolean;
  onRetry?: () => void;
  isSending?: boolean;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  if (!conversation) {
    return (
      <div className="flex flex-col flex-1 min-w-0">
        <EmptyState />
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 min-w-0">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-border bg-card shrink-0">
        {/* Mobile back button */}
        <button
          type="button"
          onClick={onBack}
          className="lg:hidden w-8 h-8 flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Avatar */}
        <div className="relative shrink-0">
          <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-bold">
            {conversation.participantInitials}
          </div>
          <span
            className={cn(
              "absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-card",
              conversation.isOnline ? "bg-green-500" : "bg-muted-foreground/40"
            )}
          />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-foreground truncate leading-none">
            {conversation.participantName}
          </p>
          <div className="mt-0.5 flex items-center gap-2">
            {conversation.participantSpecialty && (
              <>
                <span className="text-xs text-primary/70 font-medium">
                  {conversation.participantSpecialty}
                </span>
                <span className="text-muted-foreground/40">·</span>
              </>
            )}
            <OnlineStatus isOnline={conversation.isOnline} />
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            title="More options"
            className="w-8 h-8 flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Message area */}
      {isLoading ? (
        <MessagesSkeleton />
      ) : isError ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-3 bg-dashboard-bg">
          <AlertCircle className="w-8 h-8 text-destructive" />
          <p className="text-sm text-destructive font-medium">Failed to load messages</p>
          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Try again
            </button>
          )}
        </div>
      ) : (
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-4 py-4 space-y-1 bg-dashboard-bg"
      >
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                <span className="text-xl font-bold text-primary">
                  {conversation.participantInitials}
                </span>
              </div>
              <p className="text-sm font-medium text-foreground">
                {conversation.participantName}
              </p>
              {conversation.participantSpecialty && (
                <p className="text-xs text-muted-foreground mt-0.5">
                  {conversation.participantSpecialty}
                </p>
              )}
              <p className="text-sm text-muted-foreground mt-3">
                No messages yet. Say hello!
              </p>
            </div>
          </div>
        ) : (
          (() => {
            const items: React.ReactNode[] = [];
            let lastDate: Date | null = null;

            messages.forEach((msg, idx) => {
              const isMine = msg.senderId === myId;

              // Date separator
              if (!lastDate || !isSameDay(msg.timestamp, lastDate)) {
                items.push(
                  <DateSeparator key={`sep-${msg.id}`} date={msg.timestamp} />
                );
                lastDate = msg.timestamp;
              }

              // Group: show avatar only on last consecutive message from same sender
              const nextMsg = messages[idx + 1];
              const isLastInGroup =
                !nextMsg || nextMsg.senderId !== msg.senderId;

              items.push(
                <MessageBubble
                  key={msg.id}
                  message={msg}
                  isMine={isMine}
                  showAvatar={isLastInGroup}
                  initials={conversation.participantInitials}
                />
              );
            });

            return items;
          })()
        )}
      </div>
      )}

      {/* Input */}
      <ChatInput onSend={onSendMessage} disabled={isSending} />
    </div>
  );
}

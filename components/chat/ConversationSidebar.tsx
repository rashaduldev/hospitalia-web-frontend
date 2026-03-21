"use client";

import { Search } from "lucide-react";
import { Conversation } from "./types";
import { cn } from "@/lib/utils";
import { format, isToday, isYesterday, isThisWeek } from "date-fns";

function formatConvTime(date?: Date): string {
  if (!date) return "";
  if (isToday(date)) return format(date, "h:mm a");
  if (isYesterday(date)) return "Yesterday";
  if (isThisWeek(date)) return format(date, "EEE");
  return format(date, "MMM d");
}

function OnlineDot({ isOnline }: { isOnline: boolean }) {
  return (
    <span
      className={cn(
        "absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-card",
        isOnline ? "bg-green-500" : "bg-muted-foreground/40"
      )}
    />
  );
}

function ConversationItem({
  conv,
  isActive,
  onClick,
}: {
  conv: Conversation;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-3 px-4 py-3.5 text-left transition-colors",
        isActive
          ? "bg-primary/8 border-r-2 border-r-primary"
          : "hover:bg-muted/50 border-r-2 border-r-transparent"
      )}
    >
      {/* Avatar */}
      <div className="relative shrink-0">
        <div
          className={cn(
            "w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold",
            isActive
              ? "bg-primary text-white"
              : "bg-primary/10 text-primary"
          )}
        >
          {conv.participantInitials}
        </div>
        <OnlineDot isOnline={conv.isOnline} />
      </div>

      {/* Text content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <span
            className={cn(
              "text-sm font-semibold truncate",
              isActive ? "text-primary" : "text-foreground"
            )}
          >
            {conv.participantName}
          </span>
          <span className="text-[11px] text-muted-foreground shrink-0">
            {formatConvTime(conv.lastMessageTime)}
          </span>
        </div>
        <div className="flex items-center justify-between gap-2 mt-0.5">
          {conv.participantSpecialty && (
            <span className="text-[11px] text-primary/70 font-medium truncate">
              {conv.participantSpecialty}
            </span>
          )}
        </div>
        <div className="flex items-center justify-between gap-2 mt-0.5">
          <p className="text-xs text-muted-foreground truncate leading-snug">
            {conv.lastMessage ?? "No messages yet"}
          </p>
          {conv.unreadCount > 0 && (
            <span className="shrink-0 min-w-[18px] h-[18px] rounded-full bg-primary text-white text-[10px] font-bold flex items-center justify-center px-1">
              {conv.unreadCount > 9 ? "9+" : conv.unreadCount}
            </span>
          )}
        </div>
      </div>
    </button>
  );
}

function ConversationSkeleton() {
  return (
    <div className="flex items-center gap-3 px-4 py-3.5 animate-pulse">
      <div className="w-10 h-10 rounded-full bg-muted shrink-0" />
      <div className="flex-1 space-y-1.5">
        <div className="h-3 bg-muted rounded w-3/4" />
        <div className="h-2.5 bg-muted rounded w-1/2" />
        <div className="h-2.5 bg-muted rounded w-full" />
      </div>
    </div>
  );
}

export function ConversationSidebar({
  conversations,
  activeId,
  onSelect,
  myRole,
  isLoading = false,
}: {
  conversations: Conversation[];
  activeId: string | null;
  onSelect: (id: string) => void;
  myRole: "DOCTOR" | "PATIENT";
  isLoading?: boolean;
}) {
  const totalUnread = conversations.reduce((acc, c) => acc + c.unreadCount, 0);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-4 py-4 border-b border-border shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-foreground">Messages</h2>
            {totalUnread > 0 && (
              <span className="min-w-[20px] h-5 rounded-full bg-primary text-white text-[10px] font-bold flex items-center justify-center px-1">
                {totalUnread > 9 ? "9+" : totalUnread}
              </span>
            )}
          </div>
          <span className="text-xs text-muted-foreground">
            {myRole === "DOCTOR" ? "Your patients" : "Your doctors"}
          </span>
        </div>

        {/* Search */}
        <div className="relative mt-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            placeholder="Search conversations…"
            className="w-full h-8 pl-8 pr-3 text-xs rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-shadow"
          />
        </div>
      </div>

      {/* Conversation list */}
      <div className="flex-1 overflow-y-auto divide-y divide-border/50">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <ConversationSkeleton key={i} />
          ))
        ) : conversations.length === 0 ? (
          <div className="flex items-center justify-center h-40 text-sm text-muted-foreground px-4 text-center">
            No conversations yet
          </div>
        ) : (
          conversations.map((conv) => (
            <ConversationItem
              key={conv.id}
              conv={conv}
              isActive={conv.id === activeId}
              onClick={() => onSelect(conv.id)}
            />
          ))
        )}
      </div>
    </div>
  );
}

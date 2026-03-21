"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useCurrentLocale } from "@/locales/client";
import { ConversationSidebar } from "./ConversationSidebar";
import { ChatWindow } from "./ChatWindow";
import { QueuedFile } from "./ChatInput";
import { Conversation, Message } from "./types";
import {
  getDoctorThreads,
  getPatientThreads,
  getThreadMessages,
  sendTextMessage,
  sendFileMessage,
  ApiThread,
  ApiChatMessage,
} from "@/actions/chat/chat.actions";
import { cn } from "@/lib/utils";

// ── Helpers ───────────────────────────────────────────────────────────────────

// Java Spring can return dates as [year, month, day, hour, minute, second] arrays
function parseApiDate(value: string | number[] | null | undefined): Date {
  if (!value) return new Date();
  if (Array.isArray(value)) {
    const [year, month, day, hour = 0, minute = 0, second = 0] = value as number[];
    return new Date(year, month - 1, day, hour, minute, second);
  }
  const d = new Date(value as string);
  return isNaN(d.getTime()) ? new Date() : d;
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function apiMessageToUiMessage(msg: ApiChatMessage, myNumericId: number): Message {
  return {
    id: String(msg.id),
    senderId: String(msg.senderUserId),
    text: msg.content ?? undefined,
    files: msg.file
      ? [
          {
            id: String(msg.file.id),
            name: msg.file.fileName,
            size: msg.file.fileSize,
            mimeType: msg.file.mimeType,
            url: msg.file.fileUrl,
          },
        ]
      : undefined,
    timestamp: parseApiDate(msg.creationDate),
    status: msg.senderUserId === myNumericId ? "read" : undefined,
  };
}

function apiThreadToConversation(
  thread: ApiThread,
  myRole: "DOCTOR" | "PATIENT"
): Conversation {
  const participantRole: "DOCTOR" | "PATIENT" =
    myRole === "DOCTOR" ? "PATIENT" : "DOCTOR";
  const participantNumericId =
    myRole === "DOCTOR" ? thread.patientUserId : thread.doctorUserId;
  const participantName =
    myRole === "DOCTOR" ? thread.patientName : thread.doctorName;

  const lastMsg = thread.lastMessage;
  let lastMessageText: string | undefined;
  if (lastMsg?.content) {
    lastMessageText = lastMsg.content;
  } else if (lastMsg?.file) {
    lastMessageText = `📎 ${lastMsg.file.fileName}`;
  }

  return {
    id: String(thread.id),
    participantId: String(participantNumericId),
    participantName,
    participantRole,
    participantInitials: getInitials(participantName),
    isOnline: false,
    lastMessage: lastMessageText,
    lastMessageTime: lastMsg ? parseApiDate(lastMsg.creationDate) : undefined,
    unreadCount: 0,
  };
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function ChatPage({
  myId,
  myNumericId,
  myRole,
}: {
  myId: string;
  myNumericId: number;
  myRole: "DOCTOR" | "PATIENT";
}) {
  const locale = useCurrentLocale();
  const queryClient = useQueryClient();

  const searchParams = useSearchParams();
  const threadParam = searchParams.get("thread");

  const [activeConvId, setActiveConvId] = useState<string | null>(null);
  const [showMobileChat, setShowMobileChat] = useState(false);
  const [optimisticMessages, setOptimisticMessages] = useState<Message[]>([]);
  const [isSending, setIsSending] = useState(false);

  // ── Load threads ────────────────────────────────────────────────────────────
  const {
    data: threadsData,
    isLoading: threadsLoading,
  } = useQuery({
    queryKey: ["chatThreads", myRole, myNumericId],
    queryFn: () =>
      myRole === "DOCTOR"
        ? getDoctorThreads({ doctorUserId: myNumericId, pageNo: 0, pageSize: 20, lang: locale })
        : getPatientThreads({ patientUserId: myNumericId, pageNo: 0, pageSize: 20, lang: locale }),
    enabled: !!myNumericId,
    refetchInterval: 15_000, // refresh thread list every 15s (new conversations)
    refetchIntervalInBackground: false,
  });

  // ── Build conversations from threads ────────────────────────────────────────
  const conversations: Conversation[] = useMemo(() => {
    const threads: ApiThread[] = (threadsData?.payload?.content ?? []) as ApiThread[];
    return threads.map((t) => apiThreadToConversation(t, myRole));
  }, [threadsData, myRole]);

  // Auto-select thread from ?thread= URL param once conversations are loaded
  useEffect(() => {
    if (threadParam && !activeConvId && conversations.length > 0) {
      const match = conversations.find((c) => c.id === threadParam);
      if (match) {
        setActiveConvId(match.id);
        setShowMobileChat(true);
      }
    }
  }, [threadParam, conversations, activeConvId]);

  const activeThreadId = activeConvId ? Number(activeConvId) : null;
  const activeConversation = conversations.find((c) => c.id === activeConvId) ?? null;

  // ── Load messages for active thread (with polling) ──────────────────────────
  const {
    data: messagesData,
    isLoading: messagesLoading,
    isError: messagesError,
    refetch: refetchMessages,
  } = useQuery({
    queryKey: ["chatMessages", activeThreadId],
    queryFn: () =>
      getThreadMessages({
        threadId: activeThreadId!,
        pageNo: 0,
        pageSize: 50,
        lang: locale,
      }),
    enabled: !!activeThreadId,
    refetchInterval: 5_000, // poll every 5 seconds
    refetchIntervalInBackground: false,
  });

  // API returns newest-first → reverse for chronological display
  const apiMessages: Message[] = useMemo(() => {
    const content: ApiChatMessage[] =
      (messagesData?.payload?.content ?? []) as ApiChatMessage[];
    return [...content].reverse().map((m) => apiMessageToUiMessage(m, myNumericId));
  }, [messagesData, myNumericId]);

  // Merge API messages with optimistic ones (optimistic always at end)
  const allMessages = [...apiMessages, ...optimisticMessages];

  // ── Conversation selection ──────────────────────────────────────────────────
  const handleSelectConversation = (id: string) => {
    setActiveConvId(id);
    setOptimisticMessages([]);
    setShowMobileChat(true);
  };

  const handleBack = () => {
    setShowMobileChat(false);
  };

  // ── Send message ────────────────────────────────────────────────────────────
  const handleSendMessage = useCallback(
    async (text: string, files: QueuedFile[]) => {
      if (!activeThreadId || isSending) return;

      setIsSending(true);

      // Add optimistic messages immediately
      const tempMessages: Message[] = [];
      if (text) {
        tempMessages.push({
          id: `opt-text-${Date.now()}`,
          senderId: myId,
          text,
          timestamp: new Date(),
          status: "sending",
        });
      }
      files.forEach((qf, i) => {
        tempMessages.push({
          id: `opt-file-${Date.now()}-${i}`,
          senderId: myId,
          files: [
            {
              id: qf.id,
              name: qf.file.name,
              size: qf.file.size,
              mimeType: qf.file.type,
              url: qf.previewUrl ?? "#",
            },
          ],
          timestamp: new Date(),
          status: "sending",
        });
      });
      setOptimisticMessages((prev) => [...prev, ...tempMessages]);

      try {
        // Send text message
        if (text) {
          await sendTextMessage({
            threadId: activeThreadId,
            senderUserId: myNumericId,
            senderType: myRole,
            content: text,
            lang: locale,
          });
        }

        // Send each file as a separate message
        for (const qf of files) {
          const formData = new FormData();
          formData.append("threadId", String(activeThreadId));
          formData.append("senderUserId", String(myNumericId));
          formData.append("senderType", myRole);
          formData.append("file", qf.file);
          await sendFileMessage(formData);
        }
      } finally {
        // Clear optimistic messages and refresh
        setOptimisticMessages([]);
        setIsSending(false);
        queryClient.invalidateQueries({ queryKey: ["chatMessages", activeThreadId] });
        queryClient.invalidateQueries({ queryKey: ["chatThreads", myRole, myNumericId] });
      }
    },
    [activeThreadId, isSending, myId, myNumericId, myRole, locale, queryClient]
  );

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div
      className={cn(
        "-mx-3 md:-mx-6",
        "h-[calc(100svh-var(--header-height))]",
        "flex overflow-hidden bg-background"
      )}
    >
      {/* Sidebar */}
      <div
        className={cn(
          "flex flex-col border-r border-border bg-card shrink-0",
          "w-full lg:w-72 xl:w-80",
          showMobileChat ? "hidden lg:flex" : "flex"
        )}
      >
        <ConversationSidebar
          conversations={conversations}
          activeId={activeConvId}
          onSelect={handleSelectConversation}
          myRole={myRole}
          isLoading={threadsLoading}
        />
      </div>

      {/* Chat window */}
      <div
        className={cn(
          "flex-1 flex min-w-0",
          showMobileChat ? "flex" : "hidden lg:flex"
        )}
      >
        <ChatWindow
          conversation={activeConversation}
          messages={allMessages}
          myId={myId}
          onSendMessage={handleSendMessage}
          onBack={handleBack}
          isLoading={messagesLoading}
          isError={messagesError}
          onRetry={refetchMessages}
          isSending={isSending}
        />
      </div>
    </div>
  );
}

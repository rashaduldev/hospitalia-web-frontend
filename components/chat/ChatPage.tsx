"use client";

import { useState, useCallback } from "react";
import { ConversationSidebar } from "./ConversationSidebar";
import { ChatWindow } from "./ChatWindow";
import { QueuedFile } from "./ChatInput";
import { Conversation, Message, MessageFile } from "./types";
import {
  PATIENT_CONVERSATIONS,
  DOCTOR_CONVERSATIONS,
  MOCK_MESSAGES,
} from "./mockData";
import { cn } from "@/lib/utils";

function buildMessageFile(qf: QueuedFile): MessageFile {
  return {
    id: qf.id,
    name: qf.file.name,
    size: qf.file.size,
    mimeType: qf.file.type,
    url: qf.previewUrl ?? "#",
  };
}

export default function ChatPage({
  myId,
  myName,
  myRole,
}: {
  myId: string;
  myName: string;
  myRole: "DOCTOR" | "PATIENT";
}) {
  const conversations: Conversation[] =
    myRole === "PATIENT" ? PATIENT_CONVERSATIONS : DOCTOR_CONVERSATIONS;

  const [activeId, setActiveId] = useState<string | null>(null);
  const [showMobileChat, setShowMobileChat] = useState(false);
  const [messageMap, setMessageMap] = useState<Record<string, Message[]>>(() =>
    Object.fromEntries(
      conversations.map((c) => [c.id, MOCK_MESSAGES[c.id] ?? []])
    )
  );

  const activeConversation = conversations.find((c) => c.id === activeId) ?? null;
  const activeMessages = activeId ? (messageMap[activeId] ?? []) : [];

  const handleSelectConversation = (id: string) => {
    setActiveId(id);
    setShowMobileChat(true);
  };

  const handleBack = () => {
    setShowMobileChat(false);
  };

  const handleSendMessage = useCallback(
    (text: string, files: QueuedFile[]) => {
      if (!activeId) return;

      const newMsg: Message = {
        id: `msg-${Date.now()}`,
        senderId: myId,
        text: text || undefined,
        files: files.length > 0 ? files.map(buildMessageFile) : undefined,
        timestamp: new Date(),
        status: "sent",
      };

      setMessageMap((prev) => ({
        ...prev,
        [activeId]: [...(prev[activeId] ?? []), newMsg],
      }));
    },
    [activeId, myId]
  );

  return (
    <div
      className={cn(
        // Cancel the parent layout's horizontal margins
        "-mx-3 md:-mx-6",
        // Full height minus the site header
        "h-[calc(100svh-var(--header-height))]",
        "flex overflow-hidden bg-background"
      )}
    >
      {/* ── Conversation sidebar ── */}
      <div
        className={cn(
          "flex flex-col border-r border-border bg-card shrink-0",
          "w-full lg:w-72 xl:w-80",
          // Mobile: visible only when no chat is showing
          showMobileChat ? "hidden lg:flex" : "flex"
        )}
      >
        <ConversationSidebar
          conversations={conversations}
          activeId={activeId}
          onSelect={handleSelectConversation}
          myRole={myRole}
        />
      </div>

      {/* ── Chat window ── */}
      <div
        className={cn(
          "flex-1 flex min-w-0",
          // Mobile: visible only when chat is showing
          showMobileChat ? "flex" : "hidden lg:flex"
        )}
      >
        <ChatWindow
          conversation={activeConversation}
          messages={activeMessages}
          myId={myId}
          onSendMessage={handleSendMessage}
          onBack={handleBack}
        />
      </div>
    </div>
  );
}

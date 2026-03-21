"use client";

import ChatPage from "@/components/chat/ChatPage";

export default function DoctorMessagesPage({
  myId,
  myNumericId,
}: {
  myId: string;
  myNumericId: number;
}) {
  return <ChatPage myId={myId} myNumericId={myNumericId} myRole="DOCTOR" />;
}

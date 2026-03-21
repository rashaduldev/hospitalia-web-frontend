"use client";

import ChatPage from "@/components/chat/ChatPage";

export default function PatientMessagesPage({
  myId,
  myNumericId,
}: {
  myId: string;
  myNumericId: number;
}) {
  return <ChatPage myId={myId} myNumericId={myNumericId} myRole="PATIENT" />;
}

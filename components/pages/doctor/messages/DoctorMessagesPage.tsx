"use client";

import ChatPage from "@/components/chat/ChatPage";

export default function DoctorMessagesPage({
  myId,
  myName,
}: {
  myId: string;
  myName: string;
}) {
  return <ChatPage myId={myId} myName={myName} myRole="DOCTOR" />;
}

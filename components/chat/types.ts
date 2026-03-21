export type MessageFile = {
  id: string;
  name: string;
  size: number; // bytes
  mimeType: string;
  url: string; // blob URL or placeholder
};

export type MessageStatus = "sending" | "sent" | "delivered" | "read";

export type Message = {
  id: string;
  senderId: string;
  text?: string;
  files?: MessageFile[];
  timestamp: Date;
  status?: MessageStatus; // only present on own messages
};

export type Conversation = {
  id: string;
  participantId: string;
  participantName: string;
  participantRole: "DOCTOR" | "PATIENT";
  participantInitials: string;
  participantSpecialty?: string; // for doctors
  isOnline: boolean;
  lastMessage?: string;
  lastMessageTime?: Date;
  unreadCount: number;
};

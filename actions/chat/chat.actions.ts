"use server";

import { apiClient } from "@/lib/api";
import { getAccessToken } from "@/actions/auth";
import type { ApiResponse, Paginated } from "@/types/user.type";

// ── API shapes ────────────────────────────────────────────────────────────────

export type ApiChatFile = {
  id: number;
  fileName: string;
  fileUrl: string;
  mimeType: string;
  fileExtension: string;
  fileSize: number;
};

export type ApiChatMessage = {
  id: number;
  threadId: number;
  senderUserId: number;
  senderName: string;
  senderType: "DOCTOR" | "PATIENT" | "SECRETARY";
  messageType: "TEXT" | "FILE";
  content: string | null;
  fileObjectId: number | null;
  file: ApiChatFile | null;
  creationDate: string | number[];
  lastModifiedDate: string | number[];
};

export type ApiThread = {
  id: number;
  doctorUserId: number;
  doctorName: string;
  patientUserId: number;
  patientName: string;
  lastMessageId: number | null;
  lastMessage: ApiChatMessage | null;
  creationDate: string | number[];
  lastModifiedDate: string | number[];
};

// ── 1. Create or get thread ───────────────────────────────────────────────────

export async function getOrCreateThread({
  doctorUserId,
  patientUserId,
  lang,
}: {
  doctorUserId: number;
  patientUserId: number;
  lang: string;
}) {
  const token = await getAccessToken();
  return apiClient<ApiThread>({
    endpoint: "/api/chat/threads",
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    params: { lang },
    body: { doctorUserId, patientUserId },
  });
}

// ── 2. Get thread by ID ───────────────────────────────────────────────────────

export async function getThreadById({
  threadId,
  lang,
}: {
  threadId: number;
  lang: string;
}) {
  const token = await getAccessToken();
  return apiClient<ApiThread>({
    endpoint: `/api/chat/threads/id/${threadId}`,
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
    params: { lang },
  });
}

// ── 3. Get all threads for a doctor ──────────────────────────────────────────

export async function getDoctorThreads({
  doctorUserId,
  pageNo = 0,
  pageSize = 20,
  lang,
}: {
  doctorUserId: number;
  pageNo?: number;
  pageSize?: number;
  lang: string;
}) {
  const token = await getAccessToken();
  return apiClient<Paginated<ApiThread>>({
    endpoint: `/api/chat/threads/doctor/${doctorUserId}`,
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
    params: { pageNo, pageSize, lang },
  });
}

// ── 4. Get all threads for a patient ─────────────────────────────────────────

export async function getPatientThreads({
  patientUserId,
  pageNo = 0,
  pageSize = 20,
  lang,
}: {
  patientUserId: number;
  pageNo?: number;
  pageSize?: number;
  lang: string;
}) {
  const token = await getAccessToken();
  return apiClient<Paginated<ApiThread>>({
    endpoint: `/api/chat/threads/patient/${patientUserId}`,
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
    params: { pageNo, pageSize, lang },
  });
}

// ── 5. Send text message ──────────────────────────────────────────────────────

export async function sendTextMessage({
  threadId,
  senderUserId,
  senderType,
  content,
  lang,
}: {
  threadId: number;
  senderUserId: number;
  senderType: "DOCTOR" | "PATIENT";
  content: string;
  lang: string;
}) {
  const token = await getAccessToken();
  return apiClient<ApiChatMessage>({
    endpoint: `/api/chat/threads/${threadId}/messages`,
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    params: { lang },
    body: { senderUserId, senderType, content },
  });
}

// ── 6. Send file message (multipart) ─────────────────────────────────────────
// Uses raw fetch because apiClient forces Content-Type: application/json which
// breaks multipart/form-data boundaries.

export async function sendFileMessage(
  formData: FormData
): Promise<ApiResponse<ApiChatMessage>> {
  const token = await getAccessToken();
  const threadId = formData.get("threadId") as string;

  const file = formData.get("file") as File;
  const apiForm = new FormData();
  apiForm.append("senderUserId", formData.get("senderUserId") as string);
  apiForm.append("senderType", formData.get("senderType") as string);
  apiForm.append("file", file, file.name);

  const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? "";
  try {
    const res = await fetch(
      `${baseUrl}/api/chat/threads/${threadId}/messages/file`,
      {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: apiForm,
      }
    );
    const data = await res.json();
    return { ...data, statusCode: res.status };
  } catch {
    return {
      success: false,
      status: "error",
      message: "Failed to upload file.",
      payload: null,
    };
  }
}

// ── 7. Get messages in a thread (paginated, newest first) ────────────────────

export async function getThreadMessages({
  threadId,
  pageNo = 0,
  pageSize = 50,
  lang,
}: {
  threadId: number;
  pageNo?: number;
  pageSize?: number;
  lang: string;
}) {
  const token = await getAccessToken();
  return apiClient<Paginated<ApiChatMessage>>({
    endpoint: `/api/chat/threads/${threadId}/messages`,
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
    params: { pageNo, pageSize, lang },
  });
}

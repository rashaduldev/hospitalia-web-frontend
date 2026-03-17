"use server";

import { apiClient } from "@/lib/api";
import { getAccessToken } from "@/actions/auth";

export const getPatientProfile = async ({
  lang,
  userId,
}: {
  lang: string;
  userId: number;
}) => {
  const token = await getAccessToken();
  return await apiClient({
    endpoint: `/api/patients/id/${userId}`,
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
    params: { lang },
  });
};

export const changePatientPassword = async ({
  body,
  lang,
}: {
  body: Record<string, unknown>;
  lang: string;
}) => {
  const token = await getAccessToken();
  return await apiClient({
    endpoint: "/api/patients/update",
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    params: { lang },
    body: body as any,
  });
};

export const updatePatientProfile = async ({
  body,
  lang,
}: {
  body: Record<string, unknown>;
  lang: string;
}) => {
  const token = await getAccessToken();
  const { password: _omit, ...safeBody } = body as any;
  return await apiClient({
    endpoint: "/api/patients/update",
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    params: { lang },
    body: safeBody,
  });
};

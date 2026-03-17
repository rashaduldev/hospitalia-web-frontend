"use server";

import { apiClient } from "@/lib/api";
import { getAccessToken } from "@/actions/auth";

export const getPatientProfile = async ({ lang }: { lang: string }) => {
  const token = await getAccessToken();
  return await apiClient({
    endpoint: "/api/patient/profile",
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
    params: { lang },
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
  return await apiClient({
    endpoint: "/api/patient/profile",
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    params: { lang },
    body,
  });
};

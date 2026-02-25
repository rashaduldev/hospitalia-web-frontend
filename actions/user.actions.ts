"use server";

import { apiClient } from "@/lib/api";
import { getAccessToken } from "./auth";

export async function getCurrentUser({lang}:{lang: string}) {
  const token = await getAccessToken();

  if (!token) return null;

  const res = await apiClient({
    endpoint: "/api/users/me",
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: {lang},
  });

  return res.payload;
}
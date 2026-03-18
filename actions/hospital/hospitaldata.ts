"use server";

import { apiClient } from "@/lib/api";
import { getAccessToken } from "../auth";

// Get all Doctor
export const getAllHospital = async ({ lang }: { lang: string }) => {
  const token = await getAccessToken();
  const res = await apiClient({
    endpoint: `/api/hospitals/paginated`,
    method: "GET",
    params: { lang },
    headers: { Authorization: `Bearer ${token}` },
  });
  return res;
};

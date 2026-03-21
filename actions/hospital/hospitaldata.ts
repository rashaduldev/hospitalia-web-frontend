"use server";

import { apiClient } from "@/lib/api";
import { getAccessToken } from "../auth";

// Get Hospital info by UserId
export const getHospitalInfoByUserId = async ({
  lang,
  hospitalUserId,
}: {
  lang: string;
  hospitalUserId: number;
}) => {
  const res = await apiClient({
    endpoint: `/api/hospitals/id/${hospitalUserId}`,
    method: "GET",
    params: { lang },
  });
  return res;
};

// Get all Hospital
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

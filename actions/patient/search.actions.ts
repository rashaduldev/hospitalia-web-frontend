"use server";

import { apiClient } from "@/lib/api";
import { getAccessToken } from "@/actions/auth";

export const searchPatientByPhone = async ({
  phoneNumber,
  lang,
}: {
  phoneNumber: string;
  lang: string;
}) => {
  const token = await getAccessToken();
  return await apiClient({
    endpoint: "/api/patients/search",
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
    params: { lang, phoneNumber },
  });
};

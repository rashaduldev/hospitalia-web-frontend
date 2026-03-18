"use server";

import { apiClient } from "@/lib/api";
import { getAccessToken } from "../auth";

// Get all Doctor
export const getAllDoctor = async ({ lang }: { lang: string }) => {
  const token = await getAccessToken();
  const res = await apiClient({
    endpoint: "/api/doctors/paginated",
    method: "GET",
    params: { lang },
    headers: { Authorization: `Bearer ${token}` },
  });
  return res;
};

// Get Doctor info By UserId
export const getDoctorInfobyUserid = async ({
  lang,
  SignleDoctorUserId,
}: {
  lang: string;
  SignleDoctorUserId: number;
}) => {
  const res = await apiClient({
    endpoint: `/api/doctors/id/${SignleDoctorUserId}`,
    method: "GET",
    params: { lang },
  });
  return res;
};

"use server";

import { apiClient } from "@/lib/api";
import { getAccessToken } from "../auth";
import { UpdateDoctorProfileRequest } from "@/types/doctor";

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

// Get Doctor info By DoctorId (public profile)
export const getDoctorInfoByDoctorId = async ({
  lang,
  doctorId,
}: {
  lang: string;
  doctorId: number;
}) => {
  const res = await apiClient({
    endpoint: `/api/doctors/${doctorId}`,
    method: "GET",
    params: { lang },
  });
  return res;
};

// Update doctor profile (never sends password or mobileNumber)
export const updateDoctorProfile = async ({
  lang,
  data,
}: {
  lang: string;
  data: UpdateDoctorProfileRequest;
}) => {
  const token = await getAccessToken();
  const { password: _p, mobileNumber: _m, ...safeData } = data as any;
  const res = await apiClient({
    endpoint: "/api/doctors/update",
    method: "PUT",
    params: { lang },
    headers: { Authorization: `Bearer ${token}` },
    body: safeData,
  });
  return res;
};

// Change doctor password (sends password + all required fields)
export const changeDoctorPassword = async ({
  lang,
  data,
}: {
  lang: string;
  data: UpdateDoctorProfileRequest & { password: string };
}) => {
  const token = await getAccessToken();
  const res = await apiClient({
    endpoint: "/api/doctors/update",
    method: "PUT",
    params: { lang },
    headers: { Authorization: `Bearer ${token}` },
    body: data as Record<string, any>,
  });
  return res;
};

"use server";

import { apiClient } from "@/lib/api";
import { getAccessToken } from "../auth";

export type HospitalDoctorResponse = {
  id: number;
  hospitalUserId: number;
  doctorUserId: number;
  hospitalLocationId: number;
  doctorLocationId: number;
  doctorName: string;
  hospitalLocationName: string;
};

export const getDoctorsByHospital = async ({
  lang,
  hospitalUserId,
}: {
  lang: string;
  hospitalUserId: number;
}) => {
  const token = await getAccessToken();
  return apiClient<HospitalDoctorResponse[]>({
    endpoint: `/api/hospital-doctors/hospital/${hospitalUserId}`,
    method: "GET",
    params: { lang },
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const assignDoctorToHospital = async ({
  lang,
  hospitalUserId,
  doctorUserId,
  hospitalLocationId,
}: {
  lang: string;
  hospitalUserId: number;
  doctorUserId: number;
  hospitalLocationId: number;
}) => {
  const token = await getAccessToken();
  return apiClient({
    endpoint: "/api/hospital-doctors/assign",
    method: "POST",
    params: { lang },
    headers: { Authorization: `Bearer ${token}` },
    body: { hospitalUserId, doctorUserId, hospitalLocationId },
  });
};

export const unassignDoctorFromHospital = async ({
  lang,
  id,
}: {
  lang: string;
  id: number;
}) => {
  const token = await getAccessToken();
  return apiClient({
    endpoint: `/api/hospital-doctors/unassign/${id}`,
    method: "DELETE",
    params: { lang },
    headers: { Authorization: `Bearer ${token}` },
  });
};

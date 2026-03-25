"use server";

import { apiClient } from "@/lib/api";
import { getAccessToken } from "../auth";

export type HospitalDoctorResponse = {
  id: number;
  hospitalId: number;
  doctorId: number;
  hospitalLocationId: number;
  doctorLocationId: number;
  doctorName: string;
  hospitalLocationName: string;
};

export const getDoctorsByHospital = async ({
  lang,
  hospitalId,
}: {
  lang: string;
  hospitalId: number;
}) => {
  const token = await getAccessToken();
  return apiClient<HospitalDoctorResponse[]>({
    endpoint: `/api/hospital-doctors/hospital/${hospitalId}`,
    method: "GET",
    params: { lang },
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const assignDoctorToHospital = async ({
  lang,
  hospitalId,
  doctorId,
  hospitalLocationId,
}: {
  lang: string;
  hospitalId: number;
  doctorId: number;
  hospitalLocationId: number;
}) => {
  const token = await getAccessToken();
  return apiClient({
    endpoint: "/api/hospital-doctors/assign",
    method: "POST",
    params: { lang },
    headers: { Authorization: `Bearer ${token}` },
    body: { hospitalId, doctorId, hospitalLocationId },
  });
};

export const getPublicHospitalDoctors = async ({
  lang,
  hospitalId,
}: {
  lang: string;
  hospitalId: number;
}) => {
  return apiClient<HospitalDoctorResponse[]>({
    endpoint: `/api/hospital-doctors/hospital/${hospitalId}`,
    method: "GET",
    params: { lang },
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

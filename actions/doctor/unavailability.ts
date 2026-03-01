"use server";

import { apiClient } from "@/lib/api";
import { getAccessToken } from "../auth";

// Get all weekly unavailability
export const getDoctorUnAvailability = async ({
  lang,
  doctorUserId,
}: {
  lang: string;
  doctorUserId: number;
}) => {
  const token = await getAccessToken();

  const res = await apiClient({
    endpoint: `/api/doctors/unavailability/all/doctorUserId/${doctorUserId}`,
    method: "GET",
    params: { lang },
    headers: { Authorization: `Bearer ${token}` },
  });
  return res;
};

// doctors weekly unavailability schedule set
export const createDoctorUnAvailability = async ({
  lang,
  doctorUserId,
  unavailableDate,
}: {
  lang: string;
  doctorUserId: number;
  unavailableDate: string;
}) => {
  const token = await getAccessToken();

  const res = await apiClient({
    endpoint: "/api/doctors/unavailability/set",
    method: "POST",
    body: {
      doctorUserId,
      unavailableDate,
    },
    params: { lang },
    headers: { Authorization: `Bearer ${token}` },
  });
  return res;
};
// doctors weekly unavailability schedule set
export const updateDoctorUnAvailability = async ({
  unavailabilityId,
  unavailableDate,
}: {
  unavailabilityId: number;
  unavailableDate: string;
}) => {
  const token = await getAccessToken();

  const res = await apiClient({
    endpoint: "/api/doctors/unavailability/update",
    method: "PUT",
    body: {
      unavailabilityId,
      unavailableDate,
    },
    headers: { Authorization: `Bearer ${token}` },
  });
  return res;
};

// Delete an unavailability slot
export const deleteAvailabilitySlot = async ({ id }: { id: number }) => {
  const token = await getAccessToken();

  const res = await apiClient({
    endpoint: `/api/doctors/unavailability/${id}`,
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  return res;
};

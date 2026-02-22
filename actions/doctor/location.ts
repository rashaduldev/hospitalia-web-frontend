"use server";

import { apiClient } from "@/lib/api";
import { getAccessToken } from "../auth";
import { revalidatePath } from "next/cache";

// Get all locations for a doctor
export const getDoctorLocations = async ({doctorUserId}:{doctorUserId: string | number}) => {
  const token = await getAccessToken();
  return await apiClient({
    endpoint: `/api/doctors/location/get/${doctorUserId}`,
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
};

// Create a new default location
export const createDoctorLocation = async ({
  doctorUserId,
  hospitalName,
  address,
  lang,
}: {
  doctorUserId: string | number;
  hospitalName: string;
  address: string;
  lang?: string;
}) => {
  const token = await getAccessToken();
  const res = await apiClient({
    endpoint: `/api/doctors/location/create`,
    method: "POST",
    body: {
      doctorUserId,
      hospitalName,
      address,
      lang,
    },
    headers: { Authorization: `Bearer ${token}` },
  });
  revalidatePath("/availability");
  return res;
};

// Delete a location
export const deleteDoctorLocation = async ({
  locationId,
  doctorUserId,
}: {
  locationId: number;
  doctorUserId: string | number;
}) => {
  const token = await getAccessToken();
  const res = await apiClient({
    endpoint: `/api/doctors/location/delete/locationId/${locationId}/doctorUserId/${doctorUserId}`,
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  revalidatePath("/availability");
  return res;
};

// Update a location
export const updateDoctorLocation = async ({
  locationId,
  doctorUserId,
  hospitalName,
  address,
}: {
  locationId: number;
  doctorUserId: string | number;
  hospitalName: string;
  address: string;
}) => {
  const token = await getAccessToken();

  const res = await apiClient({
    endpoint: `/api/doctors/location/update`,
    method: "PUT",
    body: {
      locationId,
      doctorUserId,
      hospitalName,
      address,
    },
    headers: { Authorization: `Bearer ${token}` },
  });

  revalidatePath("/availability");
  return res;
};
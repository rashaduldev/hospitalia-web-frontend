"use server";

import { apiClient } from "@/lib/api";
import { getAccessToken } from "../auth";
import { revalidatePath } from "next/cache";
import { LocationFormValues } from "@/schema/doctor.location.schema";
import { UpdateLocationParams } from "@/types/doctor.location.type";

// Get all locations for a doctor
export const getDoctorLocations = async ({
  doctorUserId,
}: {
  doctorUserId: string | number;
}) => {
  const token = await getAccessToken();
  return await apiClient({
    endpoint: `/api/doctors/location/get/${doctorUserId}`,
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
};

// Create a new default location
export const createDoctorLocation = async ({
  locationName,
  addressLine1,
  city,
  postalCode,
  doctorUserId,
}: {
  locationName: string;
  addressLine1: string;
  city: string;
  postalCode: number;
  doctorUserId: number;
}) => {
  const token = await getAccessToken();
  return await apiClient({
    endpoint: `/api/doctors/location/create`,
    method: "POST",
    body: {
      locationName,
      addressLine1,
      city,
      postalCode,
      doctorUserId,
    },
    headers: { Authorization: `Bearer ${token}` },
  });
};

// Delete a location
export const deleteDoctorLocation = async (
  locationId: number,
  doctorUserId: string | number,
) => {
  const token = await getAccessToken();
  const res = await apiClient({
    endpoint: `/api/doctors/location/delete/locationId/${locationId}/doctorUserId/${doctorUserId}`,
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  revalidatePath("/availability");
  return res;
};

// Update a location UpdateLocationParams
export const updateDoctorLocation = async ({
  locationId,
  city,
  postalCode,
  doctorUserId,
  locationName,
  addressLine1,
}: UpdateLocationParams) => {
  const token = await getAccessToken();

  const res = await apiClient({
    endpoint: `/api/doctors/location/update`,
    method: "PUT",
    body: {
      locationId,
      city,
      postalCode,
      doctorUserId,
      locationName,
      addressLine1,
    },
    headers: { Authorization: `Bearer ${token}` },
  });

  revalidatePath("/availability");
  return res;
};

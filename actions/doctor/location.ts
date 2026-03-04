"use server";

import { apiClient } from "@/lib/api";
import { getAccessToken } from "../auth";
import { revalidatePath } from "next/cache";
import { UpdateLocationParams } from "@/types/doctor.location.type";

// Get all locations for a doctor
export const getDoctorLocations = async ({
  lang,
  doctorUserId,
}: {
  lang: string,
  doctorUserId: number;
}) => {
  const token = await getAccessToken();
  return await apiClient({
    endpoint: `/api/doctors/location/get/${doctorUserId}`,
    method: "GET",
    params: {lang},
    headers: { Authorization: `Bearer ${token}` },
  });
};

// Create a new default location
export const createDoctorLocation = async ({
  lang,
  locationName,
  addressLine1,
  city,
  postalCode,
  doctorUserId,
}: {
  lang: string,
  locationName: string;
  addressLine1: string;
  city: string;
  postalCode: number;
  doctorUserId: number;
}) => {
  const token = await getAccessToken();
  const res= await apiClient({
    endpoint: "/api/doctors/location/create",
    method: "POST",
    body: {
      locationName,
      addressLine1,
      city,
      postalCode,
      doctorUserId,
    },
    params: {lang},
    headers: { Authorization: `Bearer ${token}` },
  });
  return res;
};

// Delete a location
export const deleteDoctorLocation = async ({
  lang,
  locationId,
  doctorUserId,
}:{
  lang: string,
  locationId: number,
  doctorUserId: number,
}) => {
  const token = await getAccessToken();
  const res = await apiClient({
    endpoint: `/api/doctors/location/delete/locationId/${locationId}/doctorUserId/${doctorUserId}`,
    method: "DELETE",
    params: {lang},
    headers: { Authorization: `Bearer ${token}` },
  });
  revalidatePath("/availability");
  return res;
};

// Update a location UpdateLocationParams
export const updateDoctorLocation = async ({
  lang,
  locationId,
  city,
  postalCode,
  doctorUserId,
  locationName,
  addressLine1,
}: UpdateLocationParams) => {

  const token = await getAccessToken();

  const res = await apiClient({
    endpoint: "/api/doctors/location/update",
    method: "PUT",
    body: {
      locationId,
      city,
      postalCode,
      doctorUserId,
      locationName,
      addressLine1,
    },
    params: {lang},
    headers: { Authorization: `Bearer ${token}` },
  });

  revalidatePath("/availability");
  return res;
};
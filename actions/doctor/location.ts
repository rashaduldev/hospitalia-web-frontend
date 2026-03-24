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
  lang: string;
  doctorUserId: number;
}) => {
  const res = await apiClient({
    endpoint: `/api/doctors/location/all/${doctorUserId}`,
    method: "GET",
    params: { lang },
  });
  return res;
};

// Get all locations for a doctor by doctorId (public)
export const getDoctorLocationsByDoctorId = async ({
  lang,
  doctorId,
}: {
  lang: string;
  doctorId: number;
}) => {
  const res = await apiClient({
    endpoint: `/api/doctors/location/all/${doctorId}`,
    method: "GET",
    params: { lang },
  });
  return res;
};

//  Get a doctor's location by location ID

export const getDoctorLocationById = async ({
  lang,
  locationId,
}: {
  lang: string;
  locationId: number;
}) => {
  const res = await apiClient({
    endpoint: `/api/doctors/location/${locationId}`,
    method: "GET",
    params: { lang, locationId },
  });

  return res;
};

// Create a new default location
export const createDoctorLocation = async ({
  lang,
  locationName,
  addressLine1,
  addressLine2,
  city,
  state,
  country,
  postalCode,
  newPatientFee,
  oldPatientFee,
  feeCurrency,
  supportedAppointmentTypeIds,
  doctorUserId,
}: {
  lang: string;
  locationName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state?: string;
  country?: string;
  postalCode: string;
  newPatientFee?: number;
  oldPatientFee?: number;
  feeCurrency?: string;
  supportedAppointmentTypeIds?: number[];
  doctorUserId: number;
}) => {
  const token = await getAccessToken();
  const res = await apiClient({
    endpoint: "/api/doctors/location/create",
    method: "POST",
    body: {
      locationName,
      addressLine1,
      addressLine2: addressLine2 ?? null,
      city,
      state: state ?? null,
      country: country ?? null,
      postalCode,
      newPatientFee: newPatientFee ?? null,
      oldPatientFee: oldPatientFee ?? null,
      feeCurrency: feeCurrency ?? null,
      supportedAppointmentTypeIds: supportedAppointmentTypeIds ?? null,
      doctorUserId,
    },
    params: { lang },
    headers: { Authorization: `Bearer ${token}` },
  });
  return res;
};

// Delete a location
export const deleteDoctorLocation = async ({
  lang,
  locationId,
  doctorUserId,
}: {
  lang: string;
  locationId: number;
  doctorUserId: number;
}) => {
  const token = await getAccessToken();
  const res = await apiClient({
    endpoint: `/api/doctors/location/delete/locationId/${locationId}/doctorUserId/${doctorUserId}`,
    method: "DELETE",
    params: { lang },
    headers: { Authorization: `Bearer ${token}` },
  });
  revalidatePath("/availability");
  return res;
};

// Update a location UpdateLocationParams
export const updateDoctorLocation = async ({
  lang,
  locationId,
  locationName,
  addressLine1,
  addressLine2,
  city,
  state,
  country,
  postalCode,
  newPatientFee,
  oldPatientFee,
  feeCurrency,
  supportedAppointmentTypeIds,
  doctorUserId,
}: UpdateLocationParams) => {
  const token = await getAccessToken();

  const res = await apiClient({
    endpoint: "/api/doctors/location/update",
    method: "PUT",
    body: {
      locationId,
      locationName,
      addressLine1,
      addressLine2: addressLine2 ?? null,
      city,
      state: state ?? null,
      country: country ?? null,
      postalCode,
      newPatientFee: newPatientFee ?? null,
      oldPatientFee: oldPatientFee ?? null,
      feeCurrency: feeCurrency ?? null,
      supportedAppointmentTypeIds: supportedAppointmentTypeIds ?? null,
      doctorUserId,
    },
    params: { lang },
    headers: { Authorization: `Bearer ${token}` },
  });

  revalidatePath("/availability");
  return res;
};

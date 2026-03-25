"use server";

import { apiClient } from "@/lib/api";
import { getAccessToken } from "../auth";
import { revalidatePath } from "next/cache";
import { UpdateLocationParams } from "@/types/doctor.location.type";

// Get all locations for a doctor
export const getDoctorLocations = async ({
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
  doctorId,
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
}: {
  lang: string;
  doctorId: number;
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
}) => {
  const token = await getAccessToken();
  const res = await apiClient({
    endpoint: "/api/doctors/location/create",
    method: "POST",
    body: {
      doctorId,
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
  doctorId,
}: {
  lang: string;
  locationId: number;
  doctorId: number;
}) => {
  const token = await getAccessToken();
  const res = await apiClient({
    endpoint: `/api/doctors/location/delete/locationId/${locationId}/doctorId/${doctorId}`,
    method: "DELETE",
    params: { lang },
    headers: { Authorization: `Bearer ${token}` },
  });
  revalidatePath("/availability");
  return res;
};

// Update a location
export const updateDoctorLocation = async ({
  lang,
  locationId,
  doctorId,
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
}: UpdateLocationParams) => {
  const token = await getAccessToken();

  const res = await apiClient({
    endpoint: "/api/doctors/location/update",
    method: "PUT",
    body: {
      locationId,
      doctorId,
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
    },
    params: { lang },
    headers: { Authorization: `Bearer ${token}` },
  });

  revalidatePath("/availability");
  return res;
};

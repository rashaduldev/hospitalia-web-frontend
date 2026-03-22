"use server";

import { apiClient } from "@/lib/api";
import { getAccessToken } from "../auth";

export type HospitalLocation = {
  id: number;
  hospitalId: number;
  addressId: number;
  locationName: string;
  addressLine1: string;
  addressLine2?: string | null;
  city: string;
  country?: string | null;
  postalCode?: string | null;
  state?: string | null;
  longitude?: number | null;
  latitude?: number | null;
};

export const getHospitalLocations = async ({
  lang,
  hospitalId,
}: {
  lang: string;
  hospitalId: number;
}) => {
  const token = await getAccessToken();
  return apiClient<HospitalLocation[]>({
    endpoint: `/api/hospitals/locations/hospital/${hospitalId}`,
    method: "GET",
    params: { lang },
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const createHospitalLocation = async ({
  lang,
  body,
}: {
  lang: string;
  body: {
    hospitalId: number;
    locationName: string;
    addressLine1: string;
    addressLine2?: string | null;
    city: string;
    country?: string | null;
    postalCode?: string | null;
    state?: string | null;
    longitude?: number | null;
    latitude?: number | null;
  };
}) => {
  const token = await getAccessToken();
  return apiClient({
    endpoint: "/api/hospitals/locations/create",
    method: "POST",
    params: { lang },
    headers: { Authorization: `Bearer ${token}` },
    body,
  });
};

export const updateHospitalLocation = async ({
  lang,
  body,
}: {
  lang: string;
  body: {
    locationId: number;
    hospitalId: number;
    locationName: string;
    addressLine1: string;
    addressLine2?: string | null;
    city: string;
    country?: string | null;
    postalCode?: string | null;
    state?: string | null;
    longitude?: number | null;
    latitude?: number | null;
  };
}) => {
  const token = await getAccessToken();
  return apiClient({
    endpoint: "/api/hospitals/locations/update",
    method: "PUT",
    params: { lang },
    headers: { Authorization: `Bearer ${token}` },
    body,
  });
};

export const deleteHospitalLocation = async ({
  lang,
  locationId,
}: {
  lang: string;
  locationId: number;
}) => {
  const token = await getAccessToken();
  return apiClient({
    endpoint: `/api/hospitals/locations/delete/${locationId}`,
    method: "DELETE",
    params: { lang },
    headers: { Authorization: `Bearer ${token}` },
  });
};

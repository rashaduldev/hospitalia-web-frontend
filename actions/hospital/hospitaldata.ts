"use server";

import { apiClient } from "@/lib/api";
import { getAccessToken } from "../auth";

// Get Hospital info by UserId
export const getHospitalInfoByUserId = async ({
  lang,
  hospitalUserId,
}: {
  lang: string;
  hospitalUserId: number;
}) => {
  const res = await apiClient({
    endpoint: `/api/hospitals/id/${hospitalUserId}`,
    method: "GET",
    params: { lang },
  });
  return res;
};

// Setup Hospital Profile
export const setupHospitalProfile = async ({
  lang,
  body,
}: {
  lang: string;
  body: {
    userId: number;
    hospitalName: string;
    hospitalType: string;
    workPhoneNumber?: string;
    websiteUrl?: string;
    numberOfBeds?: number;
    foundedYear?: number;
    onmsRegistrationNumber?: string;
    about?: string;
    fileObjectId?: number;
    specialityIds?: number[];
  };
}) => {
  const token = await getAccessToken();
  return apiClient({
    endpoint: "/api/hospitals/profile/setup",
    method: "PUT",
    params: { lang },
    headers: { Authorization: `Bearer ${token}` },
    body,
  });
};

// Update Hospital
export const updateHospital = async ({
  lang,
  body,
}: {
  lang: string;
  body: {
    userId: number;
    firstName?: string;
    lastName?: string;
    email?: string;
    password?: string;
    countryCode?: string;
    mobileNumber?: string;
    professionalInfoRequest?: Record<string, any>;
  };
}) => {
  const token = await getAccessToken();
  return apiClient({
    endpoint: "/api/hospitals/update",
    method: "PUT",
    params: { lang },
    headers: { Authorization: `Bearer ${token}` },
    body,
  });
};

// Get all Hospital
export const getAllHospital = async ({ lang }: { lang: string }) => {
  const token = await getAccessToken();
  const res = await apiClient({
    endpoint: `/api/hospitals/paginated`,
    method: "GET",
    params: { lang },
    headers: { Authorization: `Bearer ${token}` },
  });
  return res;
};

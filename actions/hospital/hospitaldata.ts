"use server";

import { apiClient } from "@/lib/api";
import { getAccessToken } from "../auth";

// Get Hospital by entity ID (authenticated)
export const getHospitalById = async ({
  lang,
  id,
}: {
  lang: string;
  id: number;
}) => {
  const token = await getAccessToken();
  return apiClient({
    endpoint: `/api/hospitals/${id}`,
    method: "GET",
    params: { lang },
    headers: { Authorization: `Bearer ${token}` },
  });
};

// Get Hospital public profile by entity ID (no auth)
export const getHospitalPublicProfile = async ({
  lang,
  id,
}: {
  lang: string;
  id: number;
}) => {
  return apiClient({
    endpoint: `/api/hospitals/public/${id}`,
    method: "GET",
    params: { lang },
  });
};

// Get Hospital by User ID (returns single hospital for that user)
export const getHospitalInfoByUserId = async ({
  lang,
  hospitalUserId,
}: {
  lang: string;
  hospitalUserId: number;
}) => {
  return apiClient({
    endpoint: `/api/hospitals/id/${hospitalUserId}`,
    method: "GET",
    params: { lang },
  });
};

// Get all hospitals for a user (paginated)
export const getHospitalsByUserId = async ({
  lang,
  userId,
  pageNo = 0,
  pageSize = 20,
}: {
  lang: string;
  userId: number;
  pageNo?: number;
  pageSize?: number;
}) => {
  const token = await getAccessToken();
  return apiClient({
    endpoint: `/api/hospitals/paginated/user/${userId}`,
    method: "GET",
    params: { lang, pageNo, pageSize, sortBy: "creationDate", ascOrDesc: "asc" },
    headers: { Authorization: `Bearer ${token}` },
  });
};

// Create Hospital
export const createHospital = async ({
  lang,
  body,
}: {
  lang: string;
  body: {
    userId: number;
    hospitalName?: string;
    hospitalType?: string;
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
    endpoint: "/api/hospitals/create",
    method: "POST",
    params: { lang },
    headers: { Authorization: `Bearer ${token}` },
    body,
  });
};

// Update Hospital by entity ID
export const updateHospital = async ({
  lang,
  id,
  body,
}: {
  lang: string;
  id: number;
  body: {
    hospitalName?: string;
    hospitalType?: string;
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
    endpoint: `/api/hospitals/update/${id}`,
    method: "PUT",
    params: { lang },
    headers: { Authorization: `Bearer ${token}` },
    body,
  });
};

// Delete Hospital by entity ID
export const deleteHospital = async ({
  lang,
  id,
}: {
  lang: string;
  id: number;
}) => {
  const token = await getAccessToken();
  return apiClient({
    endpoint: `/api/hospitals/delete/id/${id}`,
    method: "DELETE",
    params: { lang },
    headers: { Authorization: `Bearer ${token}` },
  });
};

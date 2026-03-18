"use server";

import { apiClient } from "@/lib/api";
import { getAccessToken } from "@/actions/auth";

const adminHeaders = async () => {
  const token = await getAccessToken();
  return {
    Authorization: `Bearer ${token}`,
  };
};

export async function getAllSpecialities({
  lang = "en",
  pageNo = 0,
  pageSize = 20,
  sortBy = "creationDate",
  ascOrDesc = "asc",
}: {
  lang?: string;
  pageNo?: number;
  pageSize?: number;
  sortBy?: string;
  ascOrDesc?: string;
}) {
  return apiClient({
    endpoint: "/api/admin/speciality/all",
    method: "GET",
    headers: await adminHeaders(),
    params: { pageNo, pageSize, sortBy, ascOrDesc, lang },
  });
}

export async function createSpeciality({
  name,
  lang = "en",
}: {
  name: string;
  lang?: string;
}) {
  return apiClient({
    endpoint: "/api/admin/speciality/create",
    method: "POST",
    headers: await adminHeaders(),
    params: { name, lang },
  });
}

export async function updateSpeciality({
  id,
  name,
  lang = "en",
}: {
  id: number;
  name: string;
  lang?: string;
}) {
  return apiClient({
    endpoint: `/api/admin/speciality/update/id${id}`,
    method: "PUT",
    headers: await adminHeaders(),
    params: { name, lang },
  });
}

export async function deleteSpeciality({
  id,
  lang = "en",
}: {
  id: number;
  lang?: string;
}) {
  return apiClient({
    endpoint: `/api/admin/speciality/delete/id/${id}`,
    method: "DELETE",
    headers: await adminHeaders(),
    params: { lang },
  });
}

export async function getSpecialityById({
  id,
  lang = "en",
}: {
  id: number;
  lang?: string;
}) {
  return apiClient({
    endpoint: `/api/admin/speciality/id/${id}`,
    method: "GET",
    headers: await adminHeaders(),
    params: { lang },
  });
}

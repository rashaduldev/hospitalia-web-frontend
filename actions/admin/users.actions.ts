"use server";

import { apiClient } from "@/lib/api";
import { getAccessToken } from "@/actions/auth";

const authHeader = async () => ({
  Authorization: `Bearer ${await getAccessToken()}`,
});

export const getPaginatedUsers = async ({
  lang = "en",
  pageNo = 0,
  pageSize = 20,
  sortBy = "creationDate",
  ascOrDesc = "desc",
  name,
  mobileNumber,
  userType,
}: {
  lang?: string;
  pageNo?: number;
  pageSize?: number;
  sortBy?: string;
  ascOrDesc?: string;
  name?: string;
  mobileNumber?: string;
  userType?: string;
} = {}) => {
  const params: Record<string, string | number> = {
    lang,
    pageNo,
    pageSize,
    sortBy,
    ascOrDesc,
  };
  if (name) params.name = name;
  if (mobileNumber) params.mobileNumber = mobileNumber;
  if (userType) params.userType = userType;

  return apiClient({
    endpoint: "/api/admin/users/paginated",
    method: "GET",
    headers: await authHeader(),
    params,
  });
};

export const getUserById = async ({
  lang = "en",
  id,
}: {
  lang?: string;
  id: number;
}) =>
  apiClient({
    endpoint: `/api/admin/users/id/${id}`,
    method: "GET",
    headers: await authHeader(),
    params: { lang },
  });

export const createAdminUser = async ({
  lang = "en",
  body,
}: {
  lang?: string;
  body: {
    email: string;
    firstName: string;
    lastName: string;
    password: string;
    roleId: number;
  };
}) =>
  apiClient({
    endpoint: "/api/admin/users/create",
    method: "POST",
    headers: await authHeader(),
    params: { lang },
    body,
  });

export const updateAdminUser = async ({
  lang = "en",
  body,
}: {
  lang?: string;
  body: {
    email: string;
    firstName: string;
    lastName: string;
    password?: string | null;
    roleId: number;
  };
}) =>
  apiClient({
    endpoint: "/api/admin/users/update",
    method: "PUT",
    headers: await authHeader(),
    params: { lang },
    body,
  });

export const updateUserStatus = async ({
  lang = "en",
  body,
}: {
  lang?: string;
  body: {
    userId: number;
    status: string;
    statusDescription?: string;
  };
}) =>
  apiClient({
    endpoint: "/api/admin/users/status/update",
    method: "PUT",
    headers: await authHeader(),
    params: { lang },
    body,
  });

export const deleteAdminUser = async ({
  lang = "en",
  email,
}: {
  lang?: string;
  email: string;
}) =>
  apiClient({
    endpoint: "/api/admin/users/delete",
    method: "DELETE",
    headers: await authHeader(),
    params: { lang, email },
  });

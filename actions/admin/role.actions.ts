"use server";

import { apiClient } from "@/lib/api";
import { getAccessToken } from "@/actions/auth";

const authHeader = async () => ({
  Authorization: `Bearer ${await getAccessToken()}`,
});

export const getPaginatedRoles = async ({
  lang = "en",
  pageNo = 0,
  pageSize = 20,
  sortBy = "roleName",
  ascOrDesc = "asc",
}: {
  lang?: string;
  pageNo?: number;
  pageSize?: number;
  sortBy?: string;
  ascOrDesc?: string;
}) =>
  apiClient({
    endpoint: "/api/admin/roles/paginated",
    method: "GET",
    headers: await authHeader(),
    params: { lang, pageNo, pageSize, sortBy, ascOrDesc },
  });

export const getRoleById = async ({ lang = "en", id }: { lang?: string; id: number }) =>
  apiClient({
    endpoint: `/api/admin/roles/id/${id}`,
    method: "GET",
    headers: await authHeader(),
    params: { lang },
  });

export const getRoleTypes = async ({ lang = "en" }: { lang?: string } = {}) =>
  apiClient({
    endpoint: "/api/admin/roles/role-type/all",
    method: "GET",
    headers: await authHeader(),
    params: { lang },
  });

export const getAllPrivileges = async ({ lang = "en" }: { lang?: string } = {}) =>
  apiClient({
    endpoint: "/api/admin/privileges",
    method: "GET",
    headers: await authHeader(),
    params: { lang },
  });

export const createRole = async ({
  lang = "en",
  body,
}: {
  lang?: string;
  body: {
    roleName: string;
    roleType: string;
    description?: string;
    privilegeIds: number[];
  };
}) =>
  apiClient({
    endpoint: "/api/admin/roles/create",
    method: "POST",
    headers: await authHeader(),
    params: { lang },
    body,
  });

export const updateRole = async ({
  lang = "en",
  body,
}: {
  lang?: string;
  body: {
    id: number;
    roleName: string;
    roleType: string;
    description?: string;
    privilegeIds: number[];
  };
}) =>
  apiClient({
    endpoint: "/api/admin/roles/update",
    method: "PUT",
    headers: await authHeader(),
    params: { lang },
    body,
  });

export const deleteRole = async ({ lang = "en", id }: { lang?: string; id: number }) =>
  apiClient({
    endpoint: `/api/admin/roles/id/${id}/delete`,
    method: "DELETE",
    headers: await authHeader(),
    params: { lang },
  });

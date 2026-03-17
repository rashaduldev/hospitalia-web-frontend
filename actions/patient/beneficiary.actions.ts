"use server";

import { apiClient } from "@/lib/api";
import { getAccessToken } from "@/actions/auth";

export const getBeneficiaries = async ({
  lang,
  pageNo = 0,
  pageSize = 20,
}: {
  lang: string;
  pageNo?: number;
  pageSize?: number;
}) => {
  const token = await getAccessToken();
  return await apiClient({
    endpoint: "/api/patients/beneficiary/paginated",
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
    params: { lang, pageNo, pageSize },
  });
};

export const addBeneficiary = async ({
  patientUserId,
  name,
  relation,
  lang,
}: {
  patientUserId: number;
  name: string;
  relation: string;
  lang: string;
}) => {
  const token = await getAccessToken();
  return await apiClient({
    endpoint: "/api/patients/beneficiary/add",
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    params: { lang },
    body: { patientUserId, name, relation },
  });
};

export const deleteBeneficiary = async ({
  id,
  lang,
}: {
  id: number;
  lang: string;
}) => {
  const token = await getAccessToken();
  return await apiClient({
    endpoint: `/api/patients/beneficiary/delete/${id}`,
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
    params: { lang },
  });
};

"use server";

import { apiClient } from "@/lib/api";
import { ApiResponse } from "@/types/user.type";
import { Speciality } from "@/types/speciality.type";

export const getSpecialitiesAllCustomer = async (
  lang?: string,
): Promise<ApiResponse<Speciality[]>> => {
  const res = await apiClient<{ content: Speciality[] }>({
    endpoint: "/api/speciality/all",
    method: "GET",
    params: lang ? { lang } : undefined,
  });
  const specialities = res.payload?.content ?? [];
  return {
    ...res,
    payload: specialities,
  };
};
"use server";

import { apiClient } from "@/lib/api";
import { ApiResponse, Paginated } from "@/types/user.type";
import { Speciality } from "@/types/speciality.type";

export const getSpecialitiesAllCustomer = async (
  lang?: string,
): Promise<ApiResponse<Paginated<Speciality>>> => {

  const res = await apiClient<Paginated<Speciality>>({
    endpoint: "/api/speciality/all",
    method: "GET",
    params: lang ? { lang } : undefined,
  });

  return res; 
};

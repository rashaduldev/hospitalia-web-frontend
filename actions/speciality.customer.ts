"use server";

import { ApiResponse } from "@/types/user.type";
import { Speciality } from "@/types/speciality.type";
import { apiClient } from "@/lib/api";

export async function getSpecialitiesCustomer(): Promise<ApiResponse<Speciality[]>> {
  const res = await apiClient<any>("/api/speciality/all", {
    method: "GET",
  });

  return {
    ...res,
    payload: res.payload?.content || [],
  };
}

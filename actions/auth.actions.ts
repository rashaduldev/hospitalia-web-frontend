"use server";

import { apiClient } from "@/lib/api";
import { RegisterRequestPayload } from "@/types/user.type";

export async function registerAction(
  payload: RegisterRequestPayload
) {
  return apiClient("/api/auth/sign-up", {
    method: "POST",
    body: payload,
  });
  }
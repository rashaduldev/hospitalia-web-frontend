"use server";

import { apiClient } from "@/lib/api";
import { RegisterRequestPayload, LoginRequestPayload, LoginResponsePayload } from "@/types/user.type";

// registation
export async function registerAction(
  payload: RegisterRequestPayload,
  params?: Record<string, string | number | boolean>
) {
  return apiClient({
    endpoint: "/api/auth/sign-up",
    method: "POST",
    body: payload,
    params,
  });
}

// login
export async function loginAction(
  payload: LoginRequestPayload,
  params?: Record<string, string | number | boolean>
) {
  return apiClient<LoginResponsePayload>({
    endpoint: "/api/auth/sign-in",
    method: "POST",
    body: payload,
    params,
  });
}
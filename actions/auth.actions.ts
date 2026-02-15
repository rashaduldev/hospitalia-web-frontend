"use server";

import { apiClient } from "@/lib/api";
import {
  LoginRequestData,
  LoginResponseData,
  RegisterRequestData,
} from "@/types/user.type";

// Register
export const register = async (body: RegisterRequestData, lang?: string) => {
  return apiClient({
    endpoint: "/api/auth/sign-up",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    params: lang ? { lang } : undefined,
    body,
  });
};

// Login
export const login = async (body: LoginRequestData, lang?: string) => {
  return apiClient<LoginResponseData>({
    endpoint: "/api/auth/sign-in",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    params: lang ? { lang } : undefined,
    body,
  });
};

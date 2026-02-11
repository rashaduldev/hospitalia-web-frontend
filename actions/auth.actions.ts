"use server";

import { apiClient } from "@/lib/api";
import {
  LoginRequestData,
  LoginResponseData,
  RegisterRequestData,
} from "@/types/user.type";

// Register
export const registerAction = async ({
  body,
  lang,
}: {
  body: RegisterRequestData;
  lang?: string;
}) => {
  const data = await apiClient({
    endpoint: "/api/auth/sign-up",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    params: lang ? { lang } : undefined,
    body,
  });

  return data;
};

// Login
export const login = async ({
  body,
  lang,
}: {
  body: LoginRequestData;
  lang?: string;
}) => {
  const data = await apiClient<LoginResponseData>({
    endpoint: "/api/auth/sign-in",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    params: lang ? { lang } : undefined,
    body,
  });

  return data;
};
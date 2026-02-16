"use server";

import { apiClient } from "@/lib/api";
import {
  LoginRequestData,
  LoginResponseData,
  RegisterRequestData,
} from "@/types/user.type";
import { cookies } from "next/headers";

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
export async function login(body: LoginRequestData, lang?: string) {
  const res = await apiClient<LoginResponseData>({
    endpoint: "/api/auth/sign-in",
    method: "POST",
    headers: { "Content-Type": "application/json" },
    params: lang ? { lang } : undefined,
    body,
  });

  if (!res.success) {
    return res;
  }

  if (!res.payload?.accessToken || !res.payload?.refreshToken) {
    throw new Error("Missing auth tokens");
  }
  const cookieStore =await cookies();
  cookieStore.set("accessToken", res.payload.accessToken, {
    httpOnly: true,
    path: "/",
    maxAge: 60 * 60,
  });

  cookieStore.set("refreshToken", res.payload.refreshToken, {
    httpOnly: true,
    path: "/",
    maxAge: 60 * 60 * 24 * 3,
  });

  return res;
}

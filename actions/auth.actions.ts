"use server";

import { apiClient } from "@/lib/api";
import {
  LoginRequestData,
  LoginResponseData,
  UserType,
} from "@/types/user.type";
import { cookies } from "next/headers";

// cookie save
export const setAuthCookies = async (
  accessToken?: string,
  refreshToken?: string,
) => {
  const cookieStore = await cookies();

  if (accessToken) {
    cookieStore.set("accessToken", accessToken, {
      httpOnly: process.env.NODE_ENV === "production",
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60,
    });
  }

  if (refreshToken) {
    cookieStore.set("refreshToken", refreshToken, {
      httpOnly: process.env.NODE_ENV === "production",
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24 * 3,
    });
  }
};

// cookie delete
export const deleteAuthCookies = async () => {
  const cookieStore = await cookies();
  cookieStore.delete("accessToken");
  cookieStore.delete("refreshToken");
};

// Register
export const register = async (body: UserType, lang?: string) => {
  return apiClient({
    endpoint: "/api/auth/sign-up",
    method: "POST",
    headers: { "Content-Type": "application/json" },
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

  const { accessToken, refreshToken } = res.payload || {};
  await setAuthCookies(accessToken, refreshToken);

  return res;
}

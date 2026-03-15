"use server";

import { apiClient } from "@/lib/api";
import { PatientRegisterRequestData } from "@/types/patient.user.type";
import {
  LoginRequestData,
  LoginResponseData,
  RegisterUser,
} from "@/types/user.type";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

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

// Patient Register
export const Patientregister = async ({
  bodyData,
  lang,
}: {
  bodyData: PatientRegisterRequestData;
  lang: string;
}) => {
  return apiClient({
    endpoint: "/api/auth/sign-up",
    method: "POST",
    headers: { "Content-Type": "application/json" },
    params: { lang },
    body: { bodyData },
  });
};
// Register
export const register = async ({
  bodyData,
  lang,
}: {
  bodyData: RegisterUser;
  lang: string;
}) => {
  return apiClient({
    endpoint: "/api/auth/sign-up",
    method: "POST",
    headers: { "Content-Type": "application/json" },
    params: { lang },
    body: bodyData,
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

// Logout
export async function handleLogout({ lang }: { lang: string }) {
  await apiClient({
    endpoint: "/api/auth/sign-out",
    method: "GET",
    params: { lang },
  });
  await deleteAuthCookies();
  redirect("/");
}

// Forgot password

export const forgotPassword = async ({
  email,
  lang,
}: {
  email: string;
  lang: string;
}) => {
  const res = await apiClient({
    endpoint: "/api/auth/forgot-password",
    method: "POST",
    headers: { "Content-Type": "application/json" },
    params: { lang },
    body: { email },
  });

  return res;
};

// Verify OTP
export const verifyOtp = async ({
  email,
  otp,
  lang,
}: {
  email: string;
  otp: string;
  lang: string;
}) => {
  const res = await apiClient({
    endpoint: "/api/auth/verify-otp",
    method: "POST",
    headers: { "Content-Type": "application/json" },
    params: { lang },
    body: { email, otp },
  });

  return res;
};

// Reset Password API
export const resetPassword = async ({
  email,
  otp,
  newPassword,
  lang,
}: {
  email: string;
  otp: string;
  newPassword: string;
  lang: string;
}) => {
  const res = await apiClient({
    endpoint: "/api/auth/reset-password",
    method: "POST",
    headers: { "Content-Type": "application/json" },
    params: { lang },
    body: { email, otp, newPassword },
  });

  return res;
};

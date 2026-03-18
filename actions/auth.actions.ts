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
  const res = apiClient({
    endpoint: "/api/auth/sign-up",
    method: "POST",
    headers: { "Content-Type": "application/json" },
    params: { lang },
    body: bodyData,
  });
  return res;
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
  const { getAccessToken } = await import("@/actions/auth");
  const token = await getAccessToken();
  await apiClient({
    endpoint: "/api/auth/sign-out",
    method: "GET",
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    params: { lang },
  });
  await deleteAuthCookies();
  redirect("/");
}

// Admin Login
export async function adminLogin(body: LoginRequestData, lang?: string) {
  const res = await apiClient<LoginResponseData>({
    endpoint: "/api/admin/auth/sign-in",
    method: "POST",
    headers: { "Content-Type": "application/json" },
    params: lang ? { lang } : undefined,
    body,
  });

  if (!res.success) {
    return res;
  }

  const { accessToken, refreshToken, user } = res.payload || {};
  await setAuthCookies(accessToken, refreshToken);

  // Store admin user data from login response since /api/users/me
  // does not apply to admin — userType is null, identity is via roles[].roleType
  if (user) {
    const cookieStore = await cookies();
    const adminUserData = {
      id: user.id,
      userType: "ADMIN" as const,
      roleType: user.roles?.[0]?.roleType ?? "SUPER_ADMIN",
      userDetails: user.userDetails,
    };
    cookieStore.set("adminUser", JSON.stringify(adminUserData), {
      httpOnly: process.env.NODE_ENV === "production",
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60,
    });
  }

  return res;
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

// Reset Password
export const resetPassword = async ({
  email,
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
    body: { email, newPassword },
  });

  return res;
};

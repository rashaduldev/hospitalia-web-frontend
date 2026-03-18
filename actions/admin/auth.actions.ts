"use server";

import { apiClient } from "@/lib/api";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getAccessToken } from "@/actions/auth";

export async function adminLogout() {
  const token = await getAccessToken();

  await apiClient({
    endpoint: "/api/auth/sign-out",
    method: "GET",
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });

  const cookieStore = await cookies();
  cookieStore.delete("accessToken");
  cookieStore.delete("refreshToken");
  cookieStore.delete("adminUser");

  redirect("/admin/login");
}

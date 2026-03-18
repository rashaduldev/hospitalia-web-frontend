"use server";

import { cookies } from "next/headers";

export type AdminUser = {
  id: number;
  userType: "ADMIN";
  roleType: string;
  userDetails?: {
    id?: number;
    firstName?: string;
    lastName?: string;
  } | null;
};

const ADMIN_ROLE_TYPES = ["SUPER_ADMIN", "ADMIN"];

export async function getCurrentAdminUser(): Promise<AdminUser | null> {
  const cookieStore = await cookies();
  const raw = cookieStore.get("adminUser")?.value;
  if (!raw) return null;

  try {
    const user = JSON.parse(raw) as AdminUser;
    if (!ADMIN_ROLE_TYPES.includes(user.roleType)) return null;
    return user;
  } catch {
    return null;
  }
}

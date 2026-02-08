"use server";

import { siteConfig } from "@/config/siteConfig";
import { apiFetch } from "@/lib/api";

const BASE = siteConfig.url;

// Registration
export async function registerAction(data: any) {
  return apiFetch(`${BASE}/api/auth/sign-up`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

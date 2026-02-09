"use server";

import { siteConfig } from "@/config/siteConfig";
import { apiFetch } from "@/lib/api";
const BASEAPI=siteConfig.url;
// Registration
export async function registerAction(payload: any) {
  return apiFetch(`${BASEAPI}/api/auth/sign-up`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

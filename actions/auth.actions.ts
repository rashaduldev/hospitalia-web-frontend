"use server";

import { siteConfig } from "@/config/siteConfig";
import { apiFetch } from "@/lib/api";
import { cookies } from "next/headers";
const BASEAPI = siteConfig.url;

// Registration
export async function registerAction(payload: any) {
  return apiFetch(`${BASEAPI}/api/auth/sign-up`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

// Login
export async function loginAction(data: any) {
  const res = await apiFetch(`${BASEAPI}/api/auth/sign-in`, {
    method: "POST",
    body: JSON.stringify(data),
  });

  // store token
  // (await cookies()).set("auth_token", res.token, {
  //   httpOnly: true,
  //   secure: true,
  //   path: "/",
  // });

  return res;
}

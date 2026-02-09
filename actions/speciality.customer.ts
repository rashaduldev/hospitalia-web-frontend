"use server";

import { siteConfig } from "@/config/siteConfig";
import { apiFetch } from "@/lib/api";
const BASEAPI=siteConfig.url;

export async function getSpecialitiesCustomer() {
  return await apiFetch(`${BASEAPI}/api/speciality/all`, {
    method: "GET",
    cache: "no-store",
  });
}

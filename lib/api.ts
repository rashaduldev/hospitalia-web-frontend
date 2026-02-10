"use server";

import { ApiResponse } from "@/types/user.type";

interface ApiClientConfig {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  headers?: Record<string, string>;
  body?: unknown;
  params?: Record<string, string | number | boolean>;
}

export async function apiClient<T>(
  endpoint: string,
  options: ApiClientConfig = {},
): Promise<ApiResponse<T>> {
  const { method = "GET", headers, body, params } = options;

  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";

  // Build query string
  const queryString = params
    ? `?${new URLSearchParams(params as Record<string, string>).toString()}`
    : "";

  const url = `${baseUrl}${endpoint}${queryString}`;

  const res = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    return {
      success: false,
      message: data?.message || "Something went wrong",
      payload: data?.payload || null,
      status: res.status,
    };
  }
  return {
    success: true,
    message: data?.message || "Request successful",
    payload: data?.payload || data,
    status: res.status,
  };
}

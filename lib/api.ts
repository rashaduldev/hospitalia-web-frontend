import { ApiResponse } from "@/types/user.type";

export type ApiClientOptions<Request = any> = {
  endpoint: string;
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: Request;
  params?: Record<string, string | number | boolean>;
  headers?: Record<string, string>;
};

export async function apiClient<Response = any, Request = any>({
  endpoint,
  method = "GET",
  body,
  params,
  headers,
}: ApiClientOptions<Request>): Promise<ApiResponse<Response>> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";

  const queryString = params
    ? `?${Object.entries(params)
        .map(
          ([key, value]) =>
            `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`,
        )
        .join("&")}`
    : "";

  const url = `${baseUrl.replace(/\/$/, "")}${endpoint}${queryString}`;

  const res = await fetch(url, {
    method,
    cache:"no-store",
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    body:
      body && method !== "GET" && method !== "DELETE"
        ? JSON.stringify(body)
        : undefined,
  });

  let data: any = {};
  try {
    data = await res.json();
  } catch {}

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

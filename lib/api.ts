"use server";

import { ApiResponse } from "@/types/user.type";
import { REQUEST_TIMEOUT_MS } from "@/lib/constants";

type ApiRequestParams = {
  endpoint: string;
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  params?: Record<string, string | number>;
  headers?: HeadersInit;
  body?:
    | Record<
        string,
        | string
        | number
        | boolean
        | File
        | Record<string, any>
        | Array<Record<string, any>>
        | number[]
        | string[]
        | null
      >
    | FormData
    | null;
  fileData?: boolean;
  retries?: number;
  retryDelay?: number;
  tags?: string[];
};

export async function apiClient<T = any>({
  endpoint,
  method = "GET",
  params = {},
  headers = {},
  body = null,
  fileData = false,
  retries = 3,
  retryDelay = 500,
  tags = [],
}: ApiRequestParams): Promise<ApiResponse<T>> {
  const makeRequest = async (attempt: number): Promise<ApiResponse<T>> => {
    let response: Response | null = null;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    try {
      const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`);

      // Add query parameters
      if (Object.keys(params).length) {
        url.search = new URLSearchParams(
          params as Record<string, string>,
        ).toString();
      }

      const requestOptions: RequestInit = {
        cache: "no-store",
        method,
        headers: {
          "Content-Type": "application/json",
          ...headers,
        },
        next: {
          tags,
        },
        signal: controller.signal,
      };

      // Attach body
      if (body) {
        requestOptions.body =
          body instanceof FormData ? body : JSON.stringify(body) || null;
      }

      console.info(`API Call Started: ${url.toString()} (Attempt: ${attempt})`);
      console.debug("Request Options:", requestOptions);

      response = await fetch(url.toString(), requestOptions);
      clearTimeout(timeoutId);

      // Handle file response
      if (fileData) {
        const blob = await response.blob();
        return {
          success: response.ok,
          message: "File data retrieved successfully",
          payload: blob,
        } as ApiResponse<T>;
      }

      const data = await response.json();

      if (response.ok) {
        console.info("API Success:", { ...data, statusCode: response.status });
        return { ...data, statusCode: response.status };
      }

      // API error response
      console.error(
        `🚨 API Error Response: ${url.toString()} (Attempt: ${attempt})`,
        { ...data, statusCode: response.status },
      );

      return {
        status: data.status,
        success: false,
        message: data.message || "Something went wrong!",
        payload: data.payload || null,
        statusCode: response.status,
      };
    } catch (error: any) {
      clearTimeout(timeoutId);
      console.error(
        `[${new Date().toISOString()}] 🚨 API Exception: ${endpoint} (Attempt: ${attempt})`,
        error,
      );

      // Retry logic
      if (attempt < retries) {
        const delay = retryDelay * 2 ** (attempt - 1);

        console.warn(
          `⚡ Retrying API Call: ${endpoint} in ${delay}ms (Attempt: ${
            attempt + 1
          }/${retries})`,
        );

        await new Promise((resolve) => setTimeout(resolve, delay));
        return makeRequest(attempt + 1);
      }

      const isNetworkError =
        error instanceof TypeError &&
        (error.message.toLowerCase().includes("fetch") ||
          error.message.toLowerCase().includes("network") ||
          error.message.toLowerCase().includes("load failed"));

      const friendlyMessage = isNetworkError
        ? "Unable to reach the server. Please check your internet connection and try again."
        : error.name === "AbortError"
          ? "The request timed out. The server took too long to respond. Please try again."
          : error.message || "Oops! there was an error";

      return {
        success: false,
        status: "error",
        message: friendlyMessage,
        payload: null,
      };
    }
  };

  return makeRequest(1);
}

"use client";

import {
  useQuery,
  useMutation,
  UseQueryOptions,
  UseMutationOptions,
  QueryFunction,
} from "@tanstack/react-query";
import { assertApiSuccess } from "@/lib/errors";
import type { ApiResponse } from "@/types/user.type";

/**
 * Drop-in replacement for useQuery that automatically calls assertApiSuccess
 * on every response, triggering the global SessionExpiredDialog on 403.
 */
export function useSafeQuery<TData>(
  options: Omit<UseQueryOptions<ApiResponse<TData>>, "queryFn"> & {
    queryFn: QueryFunction<ApiResponse<TData>>;
  }
) {
  const { queryFn, ...rest } = options;
  return useQuery<ApiResponse<TData>>({
    ...rest,
    queryFn: async (ctx) => assertApiSuccess(await queryFn(ctx)),
  });
}

/**
 * Drop-in replacement for useMutation that automatically calls assertApiSuccess
 * on every response, triggering the global SessionExpiredDialog on 403.
 */
export function useSafeMutation<
  TData = unknown,
  TVariables = void,
  TContext = unknown,
>(
  options: UseMutationOptions<ApiResponse<TData>, Error, TVariables, TContext>
) {
  const { mutationFn, ...rest } = options;
  return useMutation<ApiResponse<TData>, Error, TVariables, TContext>({
    ...rest,
    mutationFn: mutationFn
      ? async (vars: TVariables) =>
          assertApiSuccess(
            await (mutationFn as (v: TVariables) => Promise<ApiResponse<TData>>)(vars)
          )
      : undefined,
  });
}

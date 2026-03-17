"use client";

import { useState } from "react";
import {
  QueryClient,
  QueryClientProvider,
  QueryCache,
  MutationCache,
} from "@tanstack/react-query";
import { SessionExpiredError } from "@/lib/errors";
import SessionExpiredDialog from "@/components/common/SessionExpiredDialog";

type AppQueryProviderProps = {
  children: React.ReactNode;
};

export default function AppQueryProvider({ children }: AppQueryProviderProps) {
  const [sessionExpired, setSessionExpired] = useState(false);

  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
            retry: 1,
            staleTime: 1000 * 60 * 5,
            networkMode: "always",
          },
          mutations: {
            networkMode: "always",
          },
        },
        queryCache: new QueryCache({
          onError: (error) => {
            if (error instanceof SessionExpiredError) {
              setSessionExpired(true);
            }
          },
        }),
        mutationCache: new MutationCache({
          onError: (error) => {
            if (error instanceof SessionExpiredError) {
              setSessionExpired(true);
            }
          },
        }),
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <SessionExpiredDialog open={sessionExpired} />
    </QueryClientProvider>
  );
}

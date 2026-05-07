import { QueryClient } from "@tanstack/react-query";
import { useToastStore } from "../stores/useToastStore";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
    mutations: {
      onError: (error) => {
        useToastStore
          .getState()
          .push(error instanceof Error ? error.message : "오류가 발생했습니다");
      },
    },
  },
});

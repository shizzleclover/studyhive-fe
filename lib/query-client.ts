import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1000 * 60 * 5, // 5 minutes
            gcTime: 1000 * 60 * 30, // 30 minutes (formerly cacheTime)
            retry: (failureCount, error: any) => {
                // Don't retry on 401, 403, 404
                if (error?.response?.status === 401) return false;
                if (error?.response?.status === 403) return false;
                if (error?.response?.status === 404) return false;

                // Retry up to 2 times for other errors
                return failureCount < 2;
            },
            refetchOnWindowFocus: false,
        },
        mutations: {
            retry: false,
        },
    },
});

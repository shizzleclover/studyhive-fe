"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { queryClient } from "@/lib/query-client";
import { useEffect, useState } from "react";

export const QueryProvider = ({ children }: { children: React.ReactNode }) => {
    // Use useState to ensure we create a new QueryClient only once per component mount
    const [client] = useState(() => queryClient);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <QueryClientProvider client={client}>
            {children}
            {mounted && process.env.NODE_ENV === "development" && (
                <ReactQueryDevtools initialIsOpen={false} />
            )}
        </QueryClientProvider>
    );
};

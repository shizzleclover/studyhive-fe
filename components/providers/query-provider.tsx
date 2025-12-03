"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { queryClient } from "@/lib/query-client";
import { useState } from "react";

export const QueryProvider = ({ children }: { children: React.ReactNode }) => {
    // Use useState to ensure we create a new QueryClient only once per component mount
    const [client] = useState(() => queryClient);

    return (
        <QueryClientProvider client={client}>
            {children}
            <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
    );
};

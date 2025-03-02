"use client";

import * as React from "react";
import { ConvexAuthNextjsProvider } from "@convex-dev/auth/nextjs";
import { ConvexAuthNextjsServerProvider } from "@convex-dev/auth/nextjs/server";
import { ConvexQueryClient } from "@convex-dev/react-query";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConvexReactClient } from "convex/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

import { Toaster } from "@template/ui/components/sonner";

import { OnlineBanner } from "./online-banner";
import { ProgressBar } from "./progress-bar";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
const convexQueryClient = new ConvexQueryClient(convex);
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryKeyHashFn: convexQueryClient.hashFn(),
      queryFn: convexQueryClient.queryFn(),
    },
  },
});
convexQueryClient.connect(queryClient);

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      enableColorScheme
    >
      <ConvexAuthNextjsServerProvider>
        <ConvexAuthNextjsProvider client={convex}>
          <QueryClientProvider client={queryClient}>
            <OnlineBanner className="fixed inset-0 top-0 z-[100000] flex items-center justify-center bg-background/50 text-white">
              <ProgressBar className="fixed top-0 z-[99999] h-[3px] bg-primary">
                {children}
              </ProgressBar>
            </OnlineBanner>
            <Toaster />
          </QueryClientProvider>
        </ConvexAuthNextjsProvider>
      </ConvexAuthNextjsServerProvider>
    </NextThemesProvider>
  );
}

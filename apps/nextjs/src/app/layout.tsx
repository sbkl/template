import type { Viewport } from "next";
import * as React from "react";
import { TwicInstall } from "@twicpics/components/react";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";

import { cn } from "@template/ui/lib/utils";

import "@twicpics/components/style.css";
import "@template/ui/globals.css";

import { Providers } from "@/components/providers";
import { env } from "@/env";

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <TwicInstall domain={env.NEXT_PUBLIC_MEDIA_URL} anticipation={1000} />
      <body
        className={cn(
          "min-h-screen bg-background font-sans text-foreground antialiased",
          GeistSans.variable,
          GeistMono.variable,
        )}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

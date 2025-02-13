"use client";

import "react-toastify/dist/ReactToastify.css";
import type { ThemeProviderProps } from "next-themes";

import * as React from "react";
import { HeroUIProvider } from "@heroui/system";
import { useRouter } from "next/navigation";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { NuqsAdapter } from "nuqs/adapters/next";
import { ToastContainer } from "react-toastify";

export interface ProvidersProps {
  children: React.ReactNode;
  themeProps?: ThemeProviderProps;
}

declare module "@react-types/shared" {
  interface RouterConfig {
    routerOptions: NonNullable<
      Parameters<ReturnType<typeof useRouter>["push"]>[1]
    >;
  }
}

export function Providers({ children, themeProps }: ProvidersProps) {
  const router = useRouter();

  return (
    <>
      <HeroUIProvider navigate={router.push}>
        <NuqsAdapter>
          <NextThemesProvider {...themeProps}>{children}</NextThemesProvider>
        </NuqsAdapter>
      </HeroUIProvider>
      <ToastContainer />
    </>
  );
}

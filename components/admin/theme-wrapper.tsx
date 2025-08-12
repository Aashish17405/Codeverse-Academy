"use client";

import { ReactNode, useEffect } from "react";
import { useTheme } from "next-themes";

export function AdminThemeWrapper({ children }: { children: ReactNode }) {
  const { setTheme } = useTheme();

  // Force dark theme for admin panel
  useEffect(() => {
    setTheme("dark");
  }, [setTheme]);

  return <>{children}</>;
}
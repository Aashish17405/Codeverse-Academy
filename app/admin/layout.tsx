"use client";

import type { ReactNode } from "react";
import { Toaster } from "@/components/ui/toaster";
import { useEffect } from "react";
import { useTheme } from "next-themes";

export default function AdminLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const { setTheme } = useTheme();

  // Force dark theme for admin section
  useEffect(() => {
    setTheme("dark");
  }, [setTheme]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {children}
      <Toaster />
    </div>
  );
}
//nice work

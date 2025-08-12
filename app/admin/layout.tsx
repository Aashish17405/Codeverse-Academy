import type { ReactNode } from "react";
import type { Metadata } from "next";
import { Toaster } from "@/components/ui/toaster";
import { AdminThemeWrapper } from "@/components/admin/theme-wrapper";

export const metadata: Metadata = {
  title: "Admin Dashboard - AstraTech",
  description: "Admin dashboard for AstraTech demo class management",
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <AdminThemeWrapper>{children}</AdminThemeWrapper>
      <Toaster />
    </div>
  );
}
//nice work

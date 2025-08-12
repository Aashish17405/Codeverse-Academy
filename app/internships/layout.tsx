import type { ReactNode } from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Internship Opportunities | AstraTech",
  description:
    "Apply for the 1-Month Free Web Dev & AI Internship at AstraTech. Hands-on projects, government certificate, and real-world skills in Jamshedpur.",
};

export default function InternshipLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <section
      className={`${inter.className} min-h-screen bg-background text-foreground`}
    >
      {children}
    </section>
  );
}

import type { ReactNode } from "react";
import { Inter } from "next/font/google";
import "../../globals.css";

const inter = Inter({ subsets: ["latin"] });

export default function EnrollmentsLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div
      className={`${inter.className} min-h-screen w-full flex items-center justify-center bg-gradient-to-b from-gray-900 to-gray-800 px-2 sm:px-4 md:px-6`}
    >
      <div className="w-full max-w-2xl flex flex-col items-center justify-center py-8 sm:py-12 md:py-16">
        {children}
      </div>
    </div>
  );
}

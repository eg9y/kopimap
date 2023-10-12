import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { NavBarProvider } from "@/components/navbar-provider";
import { cn } from "@/lib/utils";
import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "@/lib/database.types";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Kopimap",
  description: "Map of Cafes in Indonesia",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={cn(inter.className, "")}>
        <NavBarProvider>
          <main className="flex flex-col items-center w-full pt-4 gap-4">
            {children}
          </main>
        </NavBarProvider>
      </body>
    </html>
  );
}

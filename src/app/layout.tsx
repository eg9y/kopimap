import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { NavBarProvider } from "@/components/navbar-provider";
import { cn } from "@/lib/utils";

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
        <NavBarProvider>{children}</NavBarProvider>
      </body>
    </html>
  );
}

import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import Link from "next/link";
import { TopNav } from "./_components/topnav";
import { ClerkProvider } from "@clerk/nextjs";
export const metadata: Metadata = {
  title: "Bakonykúti",
  description: "Bakonykúti hivatalos weblapja",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};



export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ClerkProvider>
    <html lang="en" className={`${GeistSans.variable}, flex-col gap-4`}>
      
      <body>
      <TopNav />
        
        {children}
        </body>
    </html>
    </ClerkProvider>
  );
}

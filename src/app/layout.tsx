import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import Link from "next/link";
import  TopNav  from "./_components/top_nav";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "~/components/theme-provider"
import ImageBanner from "~/components/layout/image-banner"
import Navbar from "~/components/layout/navbar"
import { Inter } from 'next/font/google'
import { PageTransition } from "~/components/layout/page-transition"
import Footer from "~/components/layout/footer"
import { Toaster } from "~/components/ui/toaster"



export const metadata: Metadata = {
  title: {
    default: 'Bakonykúti - A Természet Ölelésében',
    template: '%s | Bakonykúti'
  },
  description: 'Fedezze fel Bakonykúti természeti szépségeit, kulturális értékeit és közösségi életét.',
  keywords: ['Bakonykúti', 'falu', 'önkormányzat', 'turizmus', 'Bakony', 'természet'],
  authors: [{ name: 'Bakonykúti Önkormányzat' }],
  openGraph: {
    type: 'website',
    locale: 'hu_HU',
    url: 'https://bakonykuti.hu',
    title: 'Bakonykúti - A Természet Ölelésében',
    description: 'Fedezze fel Bakonykúti természeti szépségeit, kulturális értékeit és közösségi életét.',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b',
        width: 1200,
        height: 630,
        alt: 'Bakonykúti látképe'
      }
    ]
  }
}
const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return ( 
      <ClerkProvider>
        <html lang="hu" suppressHydrationWarning>
          <body className={inter.className}>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <div className="min-h-screen flex flex-col">
                <ImageBanner />
                <Navbar />
                <main className="flex-grow">
                  <PageTransition>
                    {children}
                  </PageTransition>
                </main>
                <Footer />
              </div>
              <Toaster />
            </ThemeProvider>
          </body>
        </html>
      </ClerkProvider>

  );
}

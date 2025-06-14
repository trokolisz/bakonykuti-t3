import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import { ThemeProvider } from "~/components/theme-provider"
import ImageBanner from "~/components/layout/image-banner"
import Navbar from "~/components/layout/navbar"
import { Inter } from 'next/font/google'
import { PageTransition } from "~/components/layout/page-transition"
import Footer from "~/components/layout/footer"
import { Toaster } from "~/components/ui/toaster"
import { db } from "~/server/db";
import { images } from "~/server/db/schema";
import { eq } from "drizzle-orm";
import { Providers } from "~/providers";


export const metadata: Metadata = {
  title: {
    default: 'Bakonykúti - A Természet Ölelésében',
    template: '%s | Bakonykúti'
  },
  icons: '/logo.ico',
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

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>)
{
  // Fetch carousel images, but handle the case where they might not be available
  let imageURLs: string[] = [];
  try {
    const carouselImages = await db.query.images.findMany({
      where: eq(images.carousel, true),
      limit: 10
    });

    // Only map if we have images
    if (carouselImages && carouselImages.length > 0) {
      imageURLs = carouselImages.map((image) => image.url);
    }
  } catch (error) {
    console.error('Error fetching carousel images:', error);
    // Use empty array if images can't be fetched
  }

  return (
      <html lang="hu" suppressHydrationWarning>
        <body className={inter.className}>
          <Providers>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <div className="min-h-screen flex flex-col">
                <ImageBanner imageURLs={imageURLs} />
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
          </Providers>
        </body>
      </html>
  );
}

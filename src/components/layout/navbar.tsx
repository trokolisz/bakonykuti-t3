"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "~/lib/utils"
import { Button } from "~/components/ui/button"
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger, navigationMenuTriggerStyle } from "~/components/ui/navigation-menu"
import { ModeToggle } from "~/components/theme-toggle"
import { Menu } from "lucide-react"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "~/components/ui/sheet"

const sections = [
  {
    title: "Köszöntő",
    href: "/",
  },
  {
    title: "Bakonykúti/Turisztika",
    href: "/turisztika",
    subsections: ["Látnivalók", "Szállás", "Programok"]
  },
  {
    title: "Hírek",
    href: "/news",
  },
  {
    title: "Önkormányzat",
    href: "/onkormanyzat",
    subsections: ["Képviselő-testület", "Rendeletek", "Határozatok", "Dokumentumok"]
  },
  {
    title: "Intézmények",
    href: "/intezmenyek",
    subsections: ["Óvoda", "Iskola", "Könyvtár"]
  },
  {
    title: "Egészségügy",
    href: "/egeszsegugy",
    subsections: ["Háziorvos", "Gyógyszertár", "Ügyelet"]
  },
  {
    title: "Galéria",
    href: "/gallery",
  },
  {
    title: "Közérdekű",
    href: "/kozerdeku",
    subsections: ["Hirdetmények", "Pályázatok", "Elérhetőségek"]
  },
  {
    title: "Ügyintézés",
    href: "/ugyintezes",
    subsections: ["Nyomtatványok", "Időpontfoglalás", "Ügyleírások"]
  }
]

export default function Navbar() {
  const pathname = usePathname()

  const NavItems = () => (
    <NavigationMenu>
      <NavigationMenuList className="hidden md:flex">
        {sections.map((section) => (
          <NavigationMenuItem key={section.title}>
            {section.subsections ? (
              <>
                <NavigationMenuTrigger>{section.title}</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                    <li>
                      <Link href={section.href} legacyBehavior passHref>
                        <NavigationMenuLink className={cn(
                          "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                          pathname === section.href && "bg-accent/50"
                        )}>
                          Áttekintés
                        </NavigationMenuLink>
                      </Link>
                    </li>
                    {section.subsections.map((subsection) => (
                      <li key={subsection}>
                        <Link href={`${section.href}/${subsection.toLowerCase()
                          .replace(/\s+/g, '-')
                          .replace(/[á]/g, 'a')
                          .replace(/[é]/g, 'e')
                          .replace(/[í]/g, 'i')
                          .replace(/[óöő]/g, 'o')
                          .replace(/[úüű]/g, 'u')}`} legacyBehavior passHref>
                          <NavigationMenuLink className={cn(
                          "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                          pathname === `${section.href}/${subsection.toLowerCase()
                            .replace(/\s+/g, '-')
                            .replace(/[áÁ]/g, 'a')
                            .replace(/[éÉ]/g, 'e')
                            .replace(/[íÍ]/g, 'i')
                            .replace(/[óÓöÖőŐ]/g, 'o')
                            .replace(/[úÚüÜűŰ]/g, 'u')}` && "bg-accent/50"
                          )}>
                          {subsection}
                          </NavigationMenuLink>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </>
            ) : (
              <Link href={section.href} legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  {section.title}
                </NavigationMenuLink>
              </Link>
            )}
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  )

  const MobileNav = () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] sm:w-[400px]">
        <nav className="flex flex-col gap-4">
          {sections.map((section) => (
            <div key={section.title} className="space-y-3">
              <Link
                href={section.href}
                className={cn(
                  "block text-lg font-medium",
                  pathname === section.href && "text-primary"
                )}
              >
                {section.title}
              </Link>
              {section.subsections && (
                <div className="ml-4 flex flex-col gap-2">
                  {section.subsections.map((subsection) => (
                    <Link
                      key={subsection}
                      href={`${section.href}/${subsection.toLowerCase().replace(/\s+/g, '-')}`}
                      className={cn(
                        "text-sm text-muted-foreground",
                        pathname === `${section.href}/${subsection.toLowerCase().replace(/\s+/g, '-')}` && "text-primary"
                      )}
                    >
                      {subsection}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  )

  return (
    <div className="border-b sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-4">
          <MobileNav />
          <NavItems />
        </div>
        <ModeToggle />
      </div>
    </div>
  )
}
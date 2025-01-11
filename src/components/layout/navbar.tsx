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
  SheetHeader,
  SheetTitle,
} from "~/components/ui/sheet"

const sections = [
  {
    title: "Köszöntő",
    href: "/",
  },
  {
    title: "Bakonykúti",
    href: "/bakonykuti",
    subsections: ["Bemutatás", "Történet", "Környékünk", "Látnivalók"]
  },
  {
    title: "Hírek",
    href: "/hirek",
  },
  {
    title: "Önkormányzat",
    href: "/onkormanyzat",
    subsections: [
      "Képviselő-testület",
      "Testületi ülések",
      "Önkormányzati rendeletek",
      "Dokumentumok",
      "Iszkaszentgyörgyi Közös Önkormányzati Hivatal",
      "Elérhetőségek",
      "Közérdekű adatok",      
      "Hirdetmények",
      'Szabályzatok',
      'Helyi Esélyegyenlőségi Program',
      'Településrendezési eszközök és arculati kézikönyv',
      'Pályázatok',
      'Választás'
    ]
  },
  {
    title: "Intézmények",
    href: "/intezmenyek",
    subsections: [
      "Iszkaszentgyörgyi Szociális Intézményi  Társulás",
      "Iszkaszentgyörgyi Szociális Alapszolgáltatási Intézmény",
      "Iszkaszentgyörgyi Általános Iskola",
      "Iszkaszentgyörgyi Vackor Óvoda és Konyha",
      "Közösségi Ház és Könyvtár",
    ]
  },
  {
    title: "Egészségügy",
    href: "/egeszsegugy",
    subsections: [
      "Háziorvosi ellátás",
      "Fogászati rendelés",
      "Védőnői ellátás",
      "Vérvétel"]
  },
  {
    title: "Galéria",
    href: "/galeria",
  },
  {
    title: "Közérdekű",
    href: "/kozerdeku",
    subsections: [
      "Magyar Honvédség Böszörményi Géza Csapatgyakorlótér Parancsnokság",
      "DRV",
      "E-ON",
      "Telekom",
      "Kéményellenőrzés és tisztítás"
    ]
  },
  {
    title: "Ügyintézés",
    href: "/ugyintezes",
    subsections: ["Ügyfélfogadás", "Bejelentés köteles tevékenységek",]
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

        ))
        }
      </NavigationMenuList>
    </NavigationMenu>
  )

  const MobileNav = () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden" aria-label="Főmenü megnyitása">
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] sm:w-[400px] p-0">
        <SheetHeader className="border-b px-6 py-4">
          <SheetTitle>Bakonykúti</SheetTitle>
          <p className="text-sm text-muted-foreground">Községi Önkormányzat</p>
        </SheetHeader>
        <nav className="h-full pb-16 overflow-y-auto" aria-label="Főmenü">
          <div className="space-y-2 py-4">
            {sections.map((section) => (
              <div key={section.title} className="px-6 py-2">
                <Link
                  href={section.href}
                  className={cn(
                    "block text-lg font-medium transition-colors hover:text-primary",
                    pathname === section.href ? "text-primary font-semibold" : "text-foreground/90"
                  )}
                >
                  {section.title}
                </Link>
                {section.subsections && (
                  <div className="ml-4 mt-2 flex flex-col gap-1">
                    {section.subsections.map((subsection) => (
                      <Link
                        key={subsection}
                        href={`${section.href}/${subsection.toLowerCase()
                          .replace(/\s+/g, '-')
                          .replace(/[á]/g, 'a')
                          .replace(/[é]/g, 'e')
                          .replace(/[í]/g, 'i')
                          .replace(/[óöő]/g, 'o')
                          .replace(/[úüű]/g, 'u')}`}
                        className={cn(
                          "text-sm py-1 px-2 rounded-md transition-colors",
                          pathname === `${section.href}/${subsection.toLowerCase()
                            .replace(/\s+/g, '-')
                            .replace(/[á]/g, 'a')
                            .replace(/[é]/g, 'e')
                            .replace(/[í]/g, 'i')
                            .replace(/[óöő]/g, 'o')
                            .replace(/[úüű]/g, 'u')}` 
                            ? "bg-primary/10 text-primary font-medium"
                            : "text-muted-foreground hover:text-foreground hover:bg-accent"
                        )}
                      >
                        {subsection}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
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
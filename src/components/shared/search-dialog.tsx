"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Button } from "~/components/ui/button"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "~/components/ui/command"
import { Search } from "lucide-react"
import { News, Page } from "~/server/db/schema"

interface SearchDialogProps {
  pages: Page[]
  news: News[]
}

export function SearchDialog({ pages, news }: SearchDialogProps) {
  const [open, setOpen] = React.useState(false)
  const router = useRouter()

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  return (
    <>
      <Button
        variant="outline"
        className="relative w-full justify-start text-sm text-muted-foreground sm:pr-12 md:w-40 lg:w-64"
        onClick={() => setOpen(true)}
      >
        <span className="hidden lg:inline-flex">Keresés...</span>
        <span className="inline-flex lg:hidden">Keresés...</span>
        <kbd className="pointer-events-none absolute right-1.5 top-1.5 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Írja be a keresett kifejezést..." />
        <CommandList>
          <CommandEmpty>Nincs találat.</CommandEmpty>
          <CommandGroup heading="Oldalak">
            {pages.map((page) => (
              <CommandItem
                key={page.id}
                onSelect={() => {
                  router.push(`/${page.slug}`)
                  setOpen(false)
                }}
              >
                {page.title}
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandGroup heading="Hírek">
            {news.map((item) => (
              <CommandItem
                key={item.id}
                onSelect={() => {
                  router.push(`/news/${item.id}`)
                  setOpen(false)
                }}
              >
                {item.title}
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  )
}
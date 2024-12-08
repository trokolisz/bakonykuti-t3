"use client"

import { Button } from "~/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu"
import { Settings } from "lucide-react"
import { useEffect, useState } from "react"

export function AccessibilityMenu() {
  const [fontSize, setFontSize] = useState(16)

  useEffect(() => {
    document.documentElement.style.fontSize = `${fontSize}px`
  }, [fontSize])

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Settings className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">Akadálymentesítési beállítások</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setFontSize(fontSize + 1)}>
          Nagyobb betűméret
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setFontSize(fontSize - 1)}>
          Kisebb betűméret
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setFontSize(16)}>
          Alapértelmezett betűméret
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
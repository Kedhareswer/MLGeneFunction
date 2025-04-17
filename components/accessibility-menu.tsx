"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Accessibility, ZoomIn, ZoomOut, Type } from "lucide-react"

export function AccessibilityMenu() {
  const [fontSize, setFontSize] = useState(100)

  const increaseFontSize = () => {
    const newSize = Math.min(fontSize + 10, 150)
    setFontSize(newSize)
    document.documentElement.style.fontSize = `${newSize}%`
  }

  const decreaseFontSize = () => {
    const newSize = Math.max(fontSize - 10, 80)
    setFontSize(newSize)
    document.documentElement.style.fontSize = `${newSize}%`
  }

  const resetFontSize = () => {
    setFontSize(100)
    document.documentElement.style.fontSize = "100%"
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative overflow-hidden group"
          aria-label="Accessibility options"
        >
          <Accessibility className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">Accessibility options</span>
          <span className="absolute bottom-0 left-0 h-0.5 w-full bg-primary transform scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-200" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={increaseFontSize}>
          <ZoomIn className="mr-2 h-4 w-4" />
          Increase Font Size
        </DropdownMenuItem>
        <DropdownMenuItem onClick={decreaseFontSize}>
          <ZoomOut className="mr-2 h-4 w-4" />
          Decrease Font Size
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={resetFontSize}>
          <Type className="mr-2 h-4 w-4" />
          Reset Font Size
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Pencil } from "lucide-react"
import { ModeToggle } from "./mode-toggle"
import { AccessibilityMenu } from "./accessibility-menu"

export function Navbar() {
  const pathname = usePathname()

  const routes = [
    {
      href: "/",
      label: "Home",
      active: pathname === "/",
    },
    {
      href: "/convert",
      label: "Convert",
      active: pathname === "/convert",
    },
    {
      href: "/about",
      label: "About",
      active: pathname === "/about",
    },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-4 flex items-center">
          <Link
            href="/"
            className="flex items-center space-x-2 transition-opacity hover:opacity-80"
            aria-label="Image to Sketch Home"
          >
            <div className="relative h-8 w-8 overflow-hidden rounded-full bg-primary/10">
              <Pencil className="h-5 w-5 absolute inset-0 m-auto text-primary" />
            </div>
            <span className="hidden font-bold sm:inline-block">Image to Sketch</span>
          </Link>
        </div>
        <nav className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="flex items-center space-x-1">
            {routes.map((route) => (
              <Button
                key={route.href}
                variant={route.active ? "secondary" : "ghost"}
                asChild
                className="relative overflow-hidden group"
              >
                <Link href={route.href}>
                  <span className="relative z-10">{route.label}</span>
                  {route.active && (
                    <span className="absolute bottom-0 left-0 h-0.5 w-full bg-primary transform scale-x-100 origin-left transition-transform duration-200" />
                  )}
                  {!route.active && (
                    <span className="absolute bottom-0 left-0 h-0.5 w-full bg-primary transform scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-200" />
                  )}
                </Link>
              </Button>
            ))}
          </div>
          <div className="flex items-center space-x-1">
            <AccessibilityMenu />
            <ModeToggle />
          </div>
        </nav>
      </div>
    </header>
  )
}

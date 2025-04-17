"use client"

import { useState } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface NotificationBannerProps {
  message: string
  variant?: "default" | "destructive"
}

export function NotificationBanner({ message, variant = "default" }: NotificationBannerProps) {
  const [isVisible, setIsVisible] = useState(true)

  if (!isVisible) return null

  return (
    <Alert variant={variant} className="animate-fade-in">
      <AlertDescription className="flex items-center justify-between">
        <span>{message}</span>
        <Button variant="ghost" size="icon" onClick={() => setIsVisible(false)} aria-label="Dismiss notification">
          <X className="h-4 w-4" />
        </Button>
      </AlertDescription>
    </Alert>
  )
}

"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Facebook, Twitter, Linkedin, X, Copy, Check } from "lucide-react"

interface ShareButtonsProps {
  imageUrl: string
  onCopyLink: () => void
  onClose: () => void
}

export function ShareButtons({ imageUrl, onCopyLink, onClose }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    onCopyLink()
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const shareUrl = typeof window !== "undefined" ? window.location.href : ""
  const shareText = "Check out this sketch I created with Image-to-Sketch!"

  const shareToTwitter = () => {
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
      "_blank",
    )
  }

  const shareToFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, "_blank")
  }

  const shareToLinkedin = () => {
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`, "_blank")
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Input value={shareUrl} readOnly className="flex-1" />
        <Button size="icon" onClick={handleCopy} variant="outline">
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button onClick={shareToTwitter} variant="outline" className="flex items-center gap-2">
          <Twitter className="h-4 w-4" />
          Twitter
        </Button>
        <Button onClick={shareToFacebook} variant="outline" className="flex items-center gap-2">
          <Facebook className="h-4 w-4" />
          Facebook
        </Button>
        <Button onClick={shareToLinkedin} variant="outline" className="flex items-center gap-2">
          <Linkedin className="h-4 w-4" />
          LinkedIn
        </Button>
        <Button onClick={onClose} variant="ghost" className="ml-auto">
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

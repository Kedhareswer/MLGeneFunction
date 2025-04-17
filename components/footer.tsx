import Link from "next/link"
import { Pencil, Github, Twitter, Instagram } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container py-8 md:py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="flex flex-col space-y-4">
            <Link href="/" className="flex items-center space-x-2" aria-label="Image to Sketch Home">
              <div className="relative h-8 w-8 overflow-hidden rounded-full bg-primary/10">
                <Pencil className="h-5 w-5 absolute inset-0 m-auto text-primary" />
              </div>
              <span className="font-bold">Image to Sketch</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Transform your digital images into authentic hand-drawn sketches using our deep learning model.
            </p>
          </div>

          <div className="flex flex-col space-y-4">
            <h3 className="text-lg font-medium">Quick Links</h3>
            <div className="flex flex-col space-y-2">
              <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Home
              </Link>
              <Link href="/convert" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Convert
              </Link>
              <Link href="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                About
              </Link>
            </div>
          </div>

          {/* <div className="flex flex-col space-y-4">
            <h3 className="text-lg font-medium">Connect</h3>
            <div className="flex space-x-4">
              <Link href="https://github.com" target="_blank" rel="noreferrer" aria-label="GitHub">
                <Github className="h-5 w-5 text-muted-foreground hover:text-foreground transition-colors" />
              </Link>
              <Link href="https://twitter.com" target="_blank" rel="noreferrer" aria-label="Twitter">
                <Twitter className="h-5 w-5 text-muted-foreground hover:text-foreground transition-colors" />
              </Link>
              <Link href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram">
                <Instagram className="h-5 w-5 text-muted-foreground hover:text-foreground transition-colors" />
              </Link>
            </div>
          </div> */}
        </div>

        <div className="mt-8 border-t pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-center text-sm text-muted-foreground md:text-left">
            &copy; {new Date().getFullYear()} ArtifyAI. All rights reserved.
          </p>
          <p className="text-center text-sm text-muted-foreground md:text-left mt-4 md:mt-0">
            Built with Next.js and Tailwind CSS.
          </p>
        </div>
      </div>
    </footer>
  )
}

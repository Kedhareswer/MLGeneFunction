import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowRight, Pencil, ImageIcon, Zap } from "lucide-react"

export default function Home() {
  return (
    <div className="flex flex-col items-center">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 overflow-hidden">
        <div className="container px-4 md:px-6 relative">
          <div className="absolute inset-0 -z-10">
            <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-background/20" />
            <div className="absolute top-0 right-0 -z-10 h-full w-1/2 bg-sketch-100 dark:bg-sketch-900 blur-3xl opacity-20 transform -translate-y-1/2 translate-x-1/2 rounded-full" />
            <div className="absolute bottom-0 left-0 -z-10 h-full w-1/2 bg-sketch-200 dark:bg-sketch-800 blur-3xl opacity-20 transform translate-y-1/2 -translate-x-1/2 rounded-full" />
          </div>

          <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none animate-slide-in">
                  Transform Images into Authentic Hand-Drawn Sketches
                </h1>
                <p
                  className="max-w-[600px] text-muted-foreground md:text-xl animate-slide-in"
                  style={{ animationDelay: "0.1s" }}
                >
                  Our deep learning model converts your digital images into beautiful sketch-like representations that
                  mimic traditional hand-drawn art styles.
                </p>
              </div>
              <div
                className="flex flex-col gap-2 min-[400px]:flex-row animate-slide-in"
                style={{ animationDelay: "0.2s" }}
              >
                <Button asChild size="lg" className="relative overflow-hidden group">
                  <Link href="/convert">
                    <span className="relative z-10">Try It Now</span>
                    <span className="absolute inset-0 bg-primary-foreground/10 transform translate-y-full group-hover:translate-y-0 transition-transform duration-200" />
                    <ArrowRight className="ml-2 h-4 w-4 relative z-10 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link href="/about">Learn More</Link>
                </Button>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <div className="relative aspect-video overflow-hidden rounded-xl border bg-muted animate-fade-in">
                <div className="flex h-full items-center justify-center">
                  <div className="relative h-full w-full">
                    <Image
                      src="/intro.gif"
                      width={600}
                      height={400}
                      alt="Example of an image transformed into a sketch"
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-background/80 to-background/20" />
                    {/* Remove the SVG overlay */}
                    {/* <div className="absolute inset-0 flex items-center justify-center">
                      <svg
                        className="h-24 w-24 text-primary/30 sketch-line animate-sketch-draw"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z" />
                        <path d="M17.879 7.879A6 6 0 0 0 8.12 17.637" />
                        <path d="M12 6v2" />
                        <path d="M6 12h2" />
                        <path d="M8 17l1.5-1.5" />
                      </svg>
                    </div> */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/50">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm animate-fade-in">
                Powerful Features
              </div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl animate-slide-in">Transform Any Image</h2>
              <p
                className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed animate-slide-in"
                style={{ animationDelay: "0.1s" }}
              >
                Our deep learning model offers a range of features to create the perfect sketch from your images.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-3 staggered-appear">
            <div className="group flex flex-col items-center space-y-2 rounded-lg border bg-background p-6 shadow-sm transition-all hover:shadow-md">
              <div className="rounded-full bg-primary/10 p-3 transition-colors group-hover:bg-primary/20">
                <ImageIcon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Multiple Styles</h3>
              <p className="text-center text-muted-foreground">
                Choose from pencil, charcoal, or detailed sketch styles to match your artistic vision.
              </p>
            </div>
            <div className="group flex flex-col items-center space-y-2 rounded-lg border bg-background p-6 shadow-sm transition-all hover:shadow-md">
              <div className="rounded-full bg-primary/10 p-3 transition-colors group-hover:bg-primary/20">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Fast Processing</h3>
              <p className="text-center text-muted-foreground">
                Our optimized deep learning model processes your images quickly and efficiently.
              </p>
            </div>
            <div className="group flex flex-col items-center space-y-2 rounded-lg border bg-background p-6 shadow-sm transition-all hover:shadow-md">
              <div className="rounded-full bg-primary/10 p-3 transition-colors group-hover:bg-primary/20">
                <Pencil className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Customizable</h3>
              <p className="text-center text-muted-foreground">
                Adjust line strength, detail level, and shading to create the perfect sketch.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-background/80" />
          <div className="absolute top-0 left-0 -z-10 h-full w-1/2 bg-sketch-100 dark:bg-sketch-900 blur-3xl opacity-20 transform -translate-y-1/2 -translate-x-1/2 rounded-full" />
          <div className="absolute bottom-0 right-0 -z-10 h-full w-1/2 bg-sketch-200 dark:bg-sketch-800 blur-3xl opacity-20 transform translate-y-1/2 translate-x-1/2 rounded-full" />
        </div>

        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2 max-w-3xl">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl animate-slide-in">
                Ready to Transform Your Images?
              </h2>
              <p
                className="text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed animate-slide-in"
                style={{ animationDelay: "0.1s" }}
              >
                Try our image to sketch converter now and see the magic happen. Share your creations with friends and on
                social media.
              </p>
            </div>
            <div
              className="flex flex-col gap-2 min-[400px]:flex-row animate-slide-in"
              style={{ animationDelay: "0.2s" }}
            >
              <Button asChild size="lg" className="relative overflow-hidden group">
                <Link href="/convert">
                  <span className="relative z-10">Get Started</span>
                  <span className="absolute inset-0 bg-primary-foreground/10 transform translate-y-full group-hover:translate-y-0 transition-transform duration-200" />
                  <ArrowRight className="ml-2 h-4 w-4 relative z-10 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

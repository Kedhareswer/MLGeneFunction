import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowRight, Palette, Download, Share2, Layers, Settings, Pencil } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function AboutPage() {
  return (
    <div className="container py-8 md:py-12">
      <div className="mx-auto max-w-5xl space-y-16">
        {/* Hero Section */}
        <section className="space-y-6">
          <div className="space-y-4 text-center">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent animate-slide-in">
              About Image to Sketch
            </h1>
            <p
              className="mx-auto max-w-3xl text-muted-foreground md:text-xl animate-slide-in"
              style={{ animationDelay: "0.1s" }}
            >
              Transforming ordinary photos into extraordinary art through the power of deep learning and creative
              algorithms.
            </p>
          </div>

          <div
            className="relative mx-auto max-w-3xl overflow-hidden rounded-xl border shadow-lg animate-fade-in"
            style={{ animationDelay: "0.2s" }}
          >
            <div className="aspect-video bg-gradient-to-br from-background to-muted flex items-center justify-center">
              <div className="w-full flex justify-center items-center bg-background" style={{height:300}}>
  <Pencil className="h-32 w-32 text-primary/70" />
</div>
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent flex items-end">
              <div className="p-6 text-center w-full">
                <p className="font-medium text-lg">Transform any image into beautiful sketch art</p>
              </div>
            </div>
          </div>
        </section>

        {/* Overview Section */}
        <section className="space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight animate-slide-in" style={{ animationDelay: "0.3s" }}>
              Project Overview
            </h2>
            <div className="mt-2 h-1 w-20 bg-primary mx-auto rounded-full"></div>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            <div className="space-y-4 animate-slide-in" style={{ animationDelay: "0.4s" }}>
              <p className="text-lg">
                The Image-to-Sketch project is a sophisticated deep learning application that transforms digital images
                into authentic hand-drawn sketch representations.
              </p>
              <p className="text-muted-foreground">
                Our goal is to provide artists, designers, and enthusiasts with a tool that can convert any image into a
                beautiful sketch that mimics traditional drawing techniques, from pencil and charcoal to woodcut and
                etching styles.
              </p>
              <p className="text-muted-foreground">
                Whether you're looking to create a base for further artistic work, generate unique visual content, or
                simply explore different artistic interpretations of your photos, our converter offers the flexibility
                and quality you need.
              </p>
            </div>

            <Card className="overflow-hidden border-2 animate-slide-in" style={{ animationDelay: "0.5s" }}>
              <div className="bg-muted p-6">
                <h3 className="text-xl font-medium mb-4">Key Features</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <div className="mr-3 h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center">
                      <Palette className="h-3.5 w-3.5 text-primary" />
                    </div>
                    <span>8 distinct artistic sketch styles</span>
                  </li>
                  <li className="flex items-start">
                    <div className="mr-3 h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center">
                      <Settings className="h-3.5 w-3.5 text-primary" />
                    </div>
                    <span>Customizable style parameters</span>
                  </li>
                  <li className="flex items-start">
                    <div className="mr-3 h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center">
                      <Layers className="h-3.5 w-3.5 text-primary" />
                    </div>
                    <span>Area selection for targeted styling</span>
                  </li>
                  <li className="flex items-start">
                    <div className="mr-3 h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center">
                      <Download className="h-3.5 w-3.5 text-primary" />
                    </div>
                    <span>High-resolution downloads</span>
                  </li>
                  <li className="flex items-start">
                    <div className="mr-3 h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center">
                      <Share2 className="h-3.5 w-3.5 text-primary" />
                    </div>
                    <span>Easy social media sharing</span>
                  </li>
                </ul>
              </div>
            </Card>
          </div>
        </section>

        {/* Technology Section */}
        <section className="space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight animate-slide-in" style={{ animationDelay: "0.6s" }}>
              The Technology
            </h2>
            <div className="mt-2 h-1 w-20 bg-primary mx-auto rounded-full"></div>
          </div>

          <Tabs defaultValue="neural" className="w-full animate-fade-in" style={{ animationDelay: "0.7s" }}>
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="neural">Neural Networks</TabsTrigger>
              <TabsTrigger value="edge">Edge Detection</TabsTrigger>
              <TabsTrigger value="stroke">Stroke Simulation</TabsTrigger>
            </TabsList>
            <TabsContent value="neural" className="space-y-4">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <h3 className="text-2xl font-medium mb-4">Neural Networks</h3>
                  <p className="text-muted-foreground mb-4">
                    Our system uses convolutional neural networks (CNNs) trained on thousands of image-sketch pairs to
                    understand the essence of what makes a sketch look authentic.
                  </p>
                  <p className="text-muted-foreground">
                    These networks learn to extract features from images that are most important for creating convincing
                    sketch representations, focusing on edges, textures, and structural elements.
                  </p>
                </div>
                <div className="rounded-xl overflow-hidden border">
                  <div className="w-full flex justify-center items-center bg-background" style={{height:200}}>
                    <svg viewBox="0 0 64 40" className="h-24 w-40 text-primary/70"><circle cx="10" cy="20" r="4" fill="currentColor" opacity=".5"/><circle cx="54" cy="20" r="4" fill="currentColor" opacity=".5"/><circle cx="32" cy="10" r="4" fill="currentColor" opacity=".5"/><circle cx="32" cy="30" r="4" fill="currentColor" opacity=".5"/><line x1="10" y1="20" x2="32" y2="10" stroke="currentColor" strokeWidth="2" opacity=".5"/><line x1="10" y1="20" x2="32" y2="30" stroke="currentColor" strokeWidth="2" opacity=".5"/><line x1="54" y1="20" x2="32" y2="10" stroke="currentColor" strokeWidth="2" opacity=".5"/><line x1="54" y1="20" x2="32" y2="30" stroke="currentColor" strokeWidth="2" opacity=".5"/></svg>
                  </div>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="edge" className="space-y-4">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <h3 className="text-2xl font-medium mb-4">Edge Detection</h3>
                  <p className="text-muted-foreground mb-4">
                    Advanced edge detection algorithms identify the most important contours and boundaries in your
                    image, creating the foundation for the sketch.
                  </p>
                  <p className="text-muted-foreground">
                    Our system goes beyond simple edge detection by understanding the semantic importance of different
                    edges, emphasizing those that define the subject while de-emphasizing less important details.
                  </p>
                </div>
                <div className="rounded-xl overflow-hidden border">
                  <div className="w-full flex justify-center items-center bg-background" style={{height:200}}>
                    <svg viewBox="0 0 64 40" className="h-24 w-40 text-primary/70"><polyline points="8,32 16,16 32,24 48,8 56,32" fill="none" stroke="currentColor" strokeWidth="3"/></svg>
                  </div>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="stroke" className="space-y-4">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <h3 className="text-2xl font-medium mb-4">Stroke Simulation</h3>
                  <p className="text-muted-foreground mb-4">
                    Our algorithms simulate the physical properties of different drawing tools, from the fine lines of
                    pencils to the bold strokes of charcoal and the distinctive patterns of woodcuts.
                  </p>
                  <p className="text-muted-foreground">
                    Each style has been carefully crafted to mimic the pressure, texture, and characteristics of real
                    artistic media, creating truly authentic-looking sketches.
                  </p>
                </div>
                <div className="rounded-xl overflow-hidden border">
                  <div className="w-full flex justify-center items-center bg-background" style={{height:200}}>
                    <svg viewBox="0 0 64 40" className="h-24 w-40 text-primary/70"><path d="M8 32 Q32 8 56 32" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/></svg>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </section>

        {/* How It Works */}
        <section className="space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight animate-slide-in" style={{ animationDelay: "0.8s" }}>
              How It Works
            </h2>
            <div className="mt-2 h-1 w-20 bg-primary mx-auto rounded-full"></div>
          </div>

          <div className="relative mx-auto max-w-3xl animate-slide-in" style={{ animationDelay: "0.9s" }}>
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-border"></div>

            <div className="space-y-12">
              <div className="relative pl-16">
                <div className="absolute left-[1.6rem] -translate-x-1/2 h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-medium">
  <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="M16 16v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h6"/><polyline points="22 2 16 2 16 8"/><line x1="22" y1="2" x2="10" y2="14"/></svg>
</div>
                <h3 className="text-xl font-medium mb-2">Upload Your Image</h3>
                <p className="text-muted-foreground">
                  Start by uploading your image through our user-friendly interface. We accept most common image formats
                  including JPG, PNG, and WebP.
                </p>
              </div>

              <div className="relative pl-16">
                <div className="absolute left-[1.6rem] -translate-x-1/2 h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-medium">
  <Palette className="h-5 w-5" />
</div>
                <h3 className="text-xl font-medium mb-2">Choose Your Style</h3>
                <p className="text-muted-foreground">
                  Select from eight different sketch styles, each mimicking a different traditional drawing technique.
                  Preview how each style will look with your image.
                </p>
              </div>

              <div className="relative pl-16">
                <div className="absolute left-[1.6rem] -translate-x-1/2 h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-medium">
  <Settings className="h-5 w-5" />
</div>
                <h3 className="text-xl font-medium mb-2">Customize Parameters</h3>
                <p className="text-muted-foreground">
                  Fine-tune your sketch by adjusting parameters like line strength, detail level, and shading intensity
                  to achieve your desired artistic effect.
                </p>
              </div>

              <div className="relative pl-16">
                <div className="absolute left-[1.6rem] -translate-x-1/2 h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-medium">
                  4
                </div>
                <h3 className="text-xl font-medium mb-2">Apply Area Selections</h3>
                <p className="text-muted-foreground">
                  Optionally, select specific areas of your image to apply different styles or settings, allowing for
                  creative mixed-media effects.
                </p>
              </div>

              <div className="relative pl-16">
                <div className="absolute left-[1.6rem] -translate-x-1/2 h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-medium">
                  5
                </div>
                <h3 className="text-xl font-medium mb-2">Generate & Download</h3>
                <p className="text-muted-foreground">
                  Generate your sketch with our advanced algorithms and download the result in high resolution. You can
                  also share directly to social media.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 rounded-lg border bg-muted/30 p-6 animate-fade-in" style={{ animationDelay: "1s" }}>
            <h4 className="font-medium mb-2">Technical Note</h4>
            <p className="text-sm text-muted-foreground">
              This demonstration uses client-side processing to simulate the conversion. In a production environment,
              the processing would be handled by a dedicated server with GPU acceleration for faster and more accurate
              results. The current implementation showcases the concept while maintaining privacy by processing all
              images directly in your browser.
            </p>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight animate-slide-in" style={{ animationDelay: "1.1s" }}>
              Frequently Asked Questions
            </h2>
            <div className="mt-2 h-1 w-20 bg-primary mx-auto rounded-full"></div>
          </div>

          <Accordion type="single" collapsible className="w-full animate-fade-in" style={{ animationDelay: "1.2s" }}>
            <AccordionItem value="item-1" className="border-b">
              <AccordionTrigger className="hover:no-underline hover:bg-muted/50 px-4 py-4 rounded-md">
                <span className="text-left font-medium">What types of images work best with this converter?</span>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4 pt-1">
                <div className="text-muted-foreground">
                  Images with clear subjects and good contrast tend to produce the best results. Portraits, landscapes,
                  and still life images work particularly well. Very busy or low-contrast images may result in sketches
                  with less definition. For optimal results, use images with good lighting and clear focal points.
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2" className="border-b">
              <AccordionTrigger className="hover:no-underline hover:bg-muted/50 px-4 py-4 rounded-md">
                <span className="text-left font-medium">Can I use the generated sketches commercially?</span>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4 pt-1">
                <div className="text-muted-foreground">
                  Yes, all sketches generated from your own images are yours to use as you wish, including for
                  commercial purposes. However, please ensure you have the rights to the original images you upload. Our
                  tool simply transforms your existing content into a new artistic style.
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3" className="border-b">
              <AccordionTrigger className="hover:no-underline hover:bg-muted/50 px-4 py-4 rounded-md">
                <span className="text-left font-medium">What's the difference between the sketch styles?</span>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4 pt-1">
                <div className="text-muted-foreground">
                  <p>The eight sketch styles each simulate different traditional drawing techniques:</p>
                  <ul className="list-disc pl-6 pt-2 space-y-1.5">
                    <li>
                      <strong>Pencil:</strong> Simulates graphite pencil drawing with fine lines and subtle shading.
                    </li>
                    <li>
                      <strong>Charcoal:</strong> Creates bolder, more textured strokes with deeper blacks, similar to
                      charcoal drawing.
                    </li>
                    <li>
                      <strong>Detailed:</strong> Uses cross-hatching techniques to create a more detailed, illustrative
                      style with greater depth.
                    </li>
                    <li>
                      <strong>Crosshatch:</strong> Creates a classic illustration style with intersecting lines at
                      various angles.
                    </li>
                    <li>
                      <strong>Etching:</strong> Mimics traditional etching techniques with fine, precise lines that
                      build up to create tone and texture.
                    </li>
                    <li>
                      <strong>Ink Wash:</strong> Simulates ink wash painting with fluid, varied brush strokes and tonal
                      gradations.
                    </li>
                    <li>
                      <strong>Conte:</strong> Recreates the soft, blendable quality of conte crayon with rich tones and
                      subtle smudging.
                    </li>
                    <li>
                      <strong>Woodcut:</strong> Emulates the bold, high-contrast look of traditional woodcut prints with
                      strong lines and shapes.
                    </li>
                  </ul>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4" className="border-b">
              <AccordionTrigger className="hover:no-underline hover:bg-muted/50 px-4 py-4 rounded-md">
                <span className="text-left font-medium">Is my data private when I use this tool?</span>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4 pt-1">
                <div className="text-muted-foreground">
                  Yes, your privacy is important to us. All image processing happens directly in your browser, and we
                  don't store your images on our servers. Your uploads and generated sketches remain private to you.
                  This client-side processing approach ensures that your images never leave your device.
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5" className="border-b">
              <AccordionTrigger className="hover:no-underline hover:bg-muted/50 px-4 py-4 rounded-md">
                <span className="text-left font-medium">Can I use this on my mobile device?</span>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4 pt-1">
                <div className="text-muted-foreground">
                  Yes, our website is fully responsive and works on mobile devices. However, processing large images may
                  be slower on mobile devices compared to desktop computers due to the limited processing power. For the
                  best experience with large or high-resolution images, we recommend using a desktop or laptop computer.
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>

        {/* CTA Section */}
        <section className="text-center space-y-6 py-8 animate-fade-in" style={{ animationDelay: "1.3s" }}>
          <h2 className="text-3xl font-bold">Ready to Transform Your Images?</h2>
          <p className="text-muted-foreground mx-auto max-w-2xl">
            Try our converter now and see your photos transformed into beautiful sketch art with just a few clicks.
          </p>

          <Button asChild size="lg" className="mt-4 px-8 py-6 text-lg">
            <Link href="/convert">
              Go to Converter
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </section>
      </div>
    </div>
  )
}

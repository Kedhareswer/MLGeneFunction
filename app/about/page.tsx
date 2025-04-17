import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, Brain, Cpu, Pencil } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function AboutPage() {
  return (
    <div className="container py-8 md:py-12">
      <div className="mx-auto max-w-4xl space-y-12">
        <div className="space-y-4">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl animate-slide-in">
            About the Project
          </h1>
          <p className="text-muted-foreground md:text-xl animate-slide-in" style={{ animationDelay: "0.1s" }}>
            Learn more about our image-to-sketch conversion project, the technology behind it, and how it works.
          </p>
        </div>

        <div className="space-y-12">
          <section className="space-y-4">
            <h2 className="text-2xl font-bold tracking-tight animate-slide-in" style={{ animationDelay: "0.2s" }}>
              Project Overview
            </h2>
            <p className="text-muted-foreground animate-slide-in" style={{ animationDelay: "0.3s" }}>
              The Image-to-Sketch project is a deep learning application that transforms digital images into authentic
              hand-drawn sketch representations. Our goal is to provide artists, designers, and enthusiasts with a tool
              that can convert any image into a beautiful sketch that mimics traditional drawing techniques.
            </p>
            <div className="mt-6 overflow-hidden rounded-lg border animate-fade-in" style={{ animationDelay: "0.4s" }}>
              <Image
                src="/placeholder.svg?height=400&width=800"
                width={800}
                height={400}
                alt="Project overview illustration"
                className="w-full object-cover"
              />
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold tracking-tight animate-slide-in" style={{ animationDelay: "0.5s" }}>
              The Technology
            </h2>
            <p className="text-muted-foreground animate-slide-in" style={{ animationDelay: "0.6s" }}>
              Our image-to-sketch conversion is powered by a deep learning model that has been trained on thousands of
              pairs of images and their corresponding hand-drawn sketches. The model learns to extract the essential
              features and contours from an image and represent them as sketch strokes.
            </p>

            <div className="mt-6 grid gap-6 md:grid-cols-3 staggered-appear">
              <Card>
                <CardContent className="flex flex-col items-center space-y-2 p-6">
                  <div className="rounded-full bg-primary/10 p-3">
                    <Brain className="h-10 w-10 text-primary" />
                  </div>
                  <h3 className="text-xl font-medium">Neural Networks</h3>
                  <p className="text-center text-sm text-muted-foreground">
                    Convolutional neural networks extract features from images to identify edges and contours.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="flex flex-col items-center space-y-2 p-6">
                  <div className="rounded-full bg-primary/10 p-3">
                    <Cpu className="h-10 w-10 text-primary" />
                  </div>
                  <h3 className="text-xl font-medium">Edge Detection</h3>
                  <p className="text-center text-sm text-muted-foreground">
                    Advanced algorithms identify and enhance the important edges in the image.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="flex flex-col items-center space-y-2 p-6">
                  <div className="rounded-full bg-primary/10 p-3">
                    <Pencil className="h-10 w-10 text-primary" />
                  </div>
                  <h3 className="text-xl font-medium">Stroke Simulation</h3>
                  <p className="text-center text-sm text-muted-foreground">
                    Realistic pencil and charcoal strokes are simulated based on the image content.
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold tracking-tight animate-slide-in" style={{ animationDelay: "0.7s" }}>
              How It Works
            </h2>
            <div
              className="relative ml-6 border-l-2 border-muted pl-6 animate-slide-in"
              style={{ animationDelay: "0.8s" }}
            >
              <ol className="space-y-6">
                <li className="relative">
                  <div className="absolute -left-[2.75rem] flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    1
                  </div>
                  <h3 className="font-medium">Upload Your Image</h3>
                  <p className="text-muted-foreground">Upload your image through our user-friendly interface.</p>
                </li>
                <li className="relative">
                  <div className="absolute -left-[2.75rem] flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    2
                  </div>
                  <h3 className="font-medium">Edge Detection</h3>
                  <p className="text-muted-foreground">
                    Our system processes the image using edge detection algorithms.
                  </p>
                </li>
                <li className="relative">
                  <div className="absolute -left-[2.75rem] flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    3
                  </div>
                  <h3 className="font-medium">Deep Learning Conversion</h3>
                  <p className="text-muted-foreground">
                    The deep learning model converts the edges into realistic sketch strokes.
                  </p>
                </li>
                <li className="relative">
                  <div className="absolute -left-[2.75rem] flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    4
                  </div>
                  <h3 className="font-medium">Customize Your Sketch</h3>
                  <p className="text-muted-foreground">
                    You can customize the sketch style, line strength, detail level, and shading.
                  </p>
                </li>
                <li className="relative">
                  <div className="absolute -left-[2.75rem] flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    5
                  </div>
                  <h3 className="font-medium">Download & Share</h3>
                  <p className="text-muted-foreground">
                    Download your finished sketch in high resolution or share it on social media.
                  </p>
                </li>
              </ol>
            </div>

            <div className="mt-6 rounded-lg border bg-muted/30 p-4 animate-fade-in" style={{ animationDelay: "0.9s" }}>
              <p className="text-sm text-muted-foreground">
                <strong>Note:</strong> This demonstration uses client-side processing to simulate the conversion. In a
                production environment, the processing would be handled by a dedicated server with GPU acceleration for
                faster and more accurate results.
              </p>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold tracking-tight animate-slide-in" style={{ animationDelay: "1s" }}>
              Frequently Asked Questions
            </h2>
            <Accordion type="single" collapsible className="w-full animate-fade-in" style={{ animationDelay: "1.1s" }}>
              <AccordionItem value="item-1">
                <AccordionTrigger>What types of images work best with this converter?</AccordionTrigger>
                <AccordionContent>
                  Images with clear subjects and good contrast tend to produce the best results. Portraits, landscapes,
                  and still life images work particularly well. Very busy or low-contrast images may result in sketches
                  with less definition.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>Can I use the generated sketches commercially?</AccordionTrigger>
                <AccordionContent>
                  Yes, all sketches generated from your own images are yours to use as you wish, including for
                  commercial purposes. However, please ensure you have the rights to the original images you upload.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger>What's the difference between the sketch styles?</AccordionTrigger>
                <AccordionContent>
                  <p>The three sketch styles each simulate different traditional drawing techniques:</p>
                  <ul className="list-disc pl-6 pt-2">
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
                  </ul>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-4">
                <AccordionTrigger>Is my data private when I use this tool?</AccordionTrigger>
                <AccordionContent>
                  Yes, your privacy is important to us. All image processing happens directly in your browser, and we
                  don't store your images on our servers. Your uploads and generated sketches remain private to you.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-5">
                <AccordionTrigger>Can I use this on my mobile device?</AccordionTrigger>
                <AccordionContent>
                  Yes, our website is fully responsive and works on mobile devices. However, processing large images may
                  be slower on mobile devices compared to desktop computers due to the limited processing power.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold tracking-tight animate-slide-in" style={{ animationDelay: "1.2s" }}>
              Try It Yourself
            </h2>
            <p className="text-muted-foreground animate-slide-in" style={{ animationDelay: "1.3s" }}>
              Ready to transform your images into beautiful sketches? Try our converter now and see the magic happen.
            </p>

            <Button asChild size="lg" className="mt-2 animate-slide-in" style={{ animationDelay: "1.4s" }}>
              <Link href="/convert">
                Go to Converter
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </section>
        </div>
      </div>
    </div>
  )
}

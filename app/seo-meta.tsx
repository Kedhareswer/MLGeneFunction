import Head from "next/head";

export default function SeoMeta() {
  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>Transform Images into Authentic Hand-Drawn Sketches</title>
      <meta name="description" content="Convert digital images to beautiful hand-drawn sketches using deep learning." />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="robots" content="index, follow" />
      {/* OpenGraph Tags */}
      <meta property="og:title" content="Transform Images into Authentic Hand-Drawn Sketches" />
      <meta property="og:description" content="Convert digital images to beautiful hand-drawn sketches using deep learning." />
      <meta property="og:image" content="/intro.gif" />
      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://yourdomain.com" />
      {/* Twitter Card Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="Transform Images into Authentic Hand-Drawn Sketches" />
      <meta name="twitter:description" content="Convert digital images to beautiful hand-drawn sketches using deep learning." />
      <meta name="twitter:image" content="/intro.gif" />
      {/* Structured Data (JSON-LD) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "Transform Images into Authentic Hand-Drawn Sketches",
            "url": "https://yourdomain.com",
            "description": "Convert digital images to beautiful hand-drawn sketches using deep learning.",
            "image": "/intro.gif"
          })
        }}
      />
    </Head>
  );
}

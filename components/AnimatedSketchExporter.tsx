import { useRef, useState } from "react";
import GIF from "gif.js";

interface AnimatedSketchExporterProps {
  frames: HTMLCanvasElement[];
  width: number;
  height: number;
}

export const AnimatedSketchExporter = ({ frames, width, height }: AnimatedSketchExporterProps) => {
  const [generating, setGenerating] = useState(false);
  const [gifUrl, setGifUrl] = useState<string | null>(null);
  const gifRef = useRef<HTMLImageElement>(null);

  const handleGenerateGif = () => {
    setGenerating(true);
    setGifUrl(null);
    const gif = new GIF({ workers: 2, quality: 10, width, height });
    frames.forEach((canvas) => {
      gif.addFrame(canvas, { delay: 60 });
    });
    gif.on("finished", (blob: Blob) => {
      const url = URL.createObjectURL(blob);
      setGifUrl(url);
      setGenerating(false);
    });
    gif.render();
  };

  return (
    <div style={{ marginTop: 16 }}>
      <button onClick={handleGenerateGif} disabled={generating || frames.length === 0}>
        {generating ? "Generating..." : "Create Animated GIF"}
      </button>
      {gifUrl && (
        <div style={{ marginTop: 16 }}>
          <img ref={gifRef} src={gifUrl} alt="Animated Sketch GIF" style={{ maxWidth: "100%" }} />
          <a href={gifUrl} download="animated-sketch.gif">Download GIF</a>
        </div>
      )}
    </div>
  );
};

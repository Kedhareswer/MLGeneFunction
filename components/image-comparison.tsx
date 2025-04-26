import React, { useState } from "react";
import CompareImage from "react-compare-image";

interface ImageComparisonProps {
  originalImage: string;
  sketchImage: string;
}

export function ImageComparison({ originalImage, sketchImage }: ImageComparisonProps) {
  const [fullscreenImg, setFullscreenImg] = useState<string | null>(null);

  return (
    <div
      style={{
        background: "#181818",
        borderRadius: "16px",
        padding: "24px",
        maxWidth: 350,
        margin: "auto",
        boxShadow: "0 4px 24px rgba(0,0,0,0.4)",
        position: "relative",
      }}
    >
      <h3 style={{ color: "white", textAlign: "center", marginBottom: 16 }}>
        Compare Original & Sketch
      </h3>
      <div style={{ position: "relative" }}>
        {/* Fullscreen button for original image (left) */}
        <button
          title="Fullscreen Original"
          style={{
            position: "absolute",
            left: 8,
            top: 8,
            zIndex: 2,
            background: "rgba(0,0,0,0.5)",
            border: "none",
            borderRadius: "50%",
            width: 32,
            height: 32,
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
          }}
          onClick={() => setFullscreenImg(originalImage)}
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 8V3H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M17 8V3H12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M3 12V17H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M17 12V17H12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        {/* Fullscreen button for sketch image (right) */}
        <button
          title="Fullscreen Sketch"
          style={{
            position: "absolute",
            right: 8,
            top: 8,
            zIndex: 2,
            background: "rgba(0,0,0,0.5)",
            border: "none",
            borderRadius: "50%",
            width: 32,
            height: 32,
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
          }}
          onClick={() => setFullscreenImg(sketchImage)}
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 8V3H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M17 8V3H12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M3 12V17H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M17 12V17H12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <CompareImage
          leftImage={originalImage}
          rightImage={sketchImage}
          sliderLineWidth={4}
          sliderLineColor="#fff"
          handleSize={40}
          handle={
            <div
              style={{
                width: 40,
                height: 40,
                background: "#fff",
                borderRadius: "50%",
                boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                border: "2px solid #888",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            />
          }
          aspectRatio="taller"
        />
      </div>

      {/* Fullscreen Modal */}
      {fullscreenImg && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.95)",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onClick={() => setFullscreenImg(null)}
        >
          <img
            src={fullscreenImg}
            alt="Fullscreen preview"
            style={{
              maxWidth: "90vw",
              maxHeight: "90vh",
              borderRadius: 12,
              boxShadow: "0 8px 32px rgba(0,0,0,0.7)",
            }}
          />
          {/* Close button */}
          <button
            onClick={e => { e.stopPropagation(); setFullscreenImg(null); }}
            style={{
              position: "fixed",
              top: 24,
              right: 32,
              background: "rgba(0,0,0,0.7)",
              border: "none",
              borderRadius: "50%",
              width: 40,
              height: 40,
              color: "#fff",
              fontSize: 28,
              cursor: "pointer",
              zIndex: 1001,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            aria-label="Close fullscreen"
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
}

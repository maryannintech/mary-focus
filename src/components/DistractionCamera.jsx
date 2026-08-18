import { useEffect, useRef, useState } from "react";

// Placeholder chime for distraction detection alert
const DISTRACTION_ALARM = "https://actions.google.com/sounds/v1/alarms/beep_short.ogg";

export function DistractionCamera({ isActive, isBreak, isMuted, onDistractionDetected }) {
  const containerRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [detectedLabel, setDetectedLabel] = useState("");

  const isDistractedRef = useRef(false);
  const consecutiveFramesRef = useRef(0);
  const modelRef = useRef(null);
  const webcamRef = useRef(null);
  const animFrameIdRef = useRef(null);

  const modelUrl = import.meta.env.VITE_TEACHABLE_MACHINE_URL;

  const playDistractionChime = () => {
    if (isMuted) return;
    try {
      const audio = new Audio(DISTRACTION_ALARM);
      audio.play().catch((err) => console.error("Alarm error:", err));
    } catch (err) {
      console.error("Audio error:", err);
    }
  };

  useEffect(() => {
    let isMounted = true;

    async function setupModel() {
      if (!window.tmImage) {
        console.error("Teachable Machine library not loaded");
        return;
      }

      try {
        const modelJSON = `${modelUrl}model.json`;
        const metadataJSON = `${modelUrl}metadata.json`;

        modelRef.current = await window.tmImage.load(modelJSON, metadataJSON);

        const flip = true;
        const width = 384;
        const height = 384;
        webcamRef.current = new window.tmImage.Webcam(width, height, flip);

        await webcamRef.current.setup();
        await webcamRef.current.play();

        if (isMounted) {
          setIsLoading(false);
          if (containerRef.current) {
            containerRef.current.innerHTML = "";
            webcamRef.current.canvas.className = "w-full h-full object-cover rounded-2xl";
            containerRef.current.appendChild(webcamRef.current.canvas);
          }
          loop();
        }
      } catch (error) {
        console.error("Failed to initialize model/webcam:", error);
      }
    }

    setupModel();

    return () => {
      isMounted = false;
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
      if (webcamRef.current) {
        webcamRef.current.stop();
      }
    };
  }, [modelUrl]);

  const loop = async () => {
    if (webcamRef.current) {
      webcamRef.current.update();
      await predict();
    }
    animFrameIdRef.current = window.requestAnimationFrame(loop);
  };

  const predict = async () => {
    if (!modelRef.current || !webcamRef.current) return;

    const predictions = await modelRef.current.predict(webcamRef.current.canvas);

    // Find highest confidence prediction
    let topClass = "";
    let highestProb = 0;

    for (let i = 0; i < predictions.length; i++) {
      if (predictions[i].probability > highestProb) {
        highestProb = predictions[i].probability;
        topClass = predictions[i].className.toLowerCase();
      }
    }

    setDetectedLabel(topClass);

    // Only detect distractions during active focus sessions (not on break, not paused)
    if (isActive && !isBreak && highestProb > 0.8) {
      const isHoldingPhone = topClass.includes("iphone") || topClass.includes("android");

      if (isHoldingPhone) {
        consecutiveFramesRef.current += 1;
        // Require 5 consecutive frames above threshold to prevent false positives
        if (consecutiveFramesRef.current > 5 && !isDistractedRef.current) {
          isDistractedRef.current = true;
          playDistractionChime();
          if (onDistractionDetected) {
            onDistractionDetected();
          }
        }
      } else {
        // Reset when user returns to working and puts phone down
        consecutiveFramesRef.current = 0;
        isDistractedRef.current = false;
      }
    }
  };

  return (
    <div className="relative w-96 h-96 rounded-2xl ring-8 ring-(--violet) bg-[#c4c4cc] overflow-hidden flex flex-col items-center justify-center shadow-lg">
      <div ref={containerRef} className="w-full h-full flex items-center justify-center" />

      {isLoading && (
        <div className="absolute inset-0 bg-[#c4c4cc] flex flex-col items-center justify-center text-black font-mono text-2xl">
          <p>camera</p>
          <p>loading</p>
          <p className="tracking-widest">....</p>
        </div>
      )}

      {/* Detection status pill */}
      {!isLoading && detectedLabel && (
        <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md px-3 py-1 rounded-lg text-xs font-mono text-white/90 border border-white/10">
          detected: <span className="text-(--violet) font-bold">{detectedLabel}</span>
        </div>
      )}
    </div>
  );
}
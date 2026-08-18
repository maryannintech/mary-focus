import { useEffect, useRef, useState } from "react";

const DISTRACTION_ALARM = "https://actions.google.com/sounds/v1/alarms/beep_short.ogg";

export function DistractionCamera({ isActive, isBreak, isWaiting, isMuted, onDistractionDetected }) {
  const containerRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [detectedLabel, setDetectedLabel] = useState("");

  const isDistractedRef = useRef(false);
  const consecutiveFramesRef = useRef(0);
  const modelRef = useRef(null);
  const webcamRef = useRef(null);
  const animFrameIdRef = useRef(null);

  // keep live props in ref to avoid stale closures in requestAnimationFrame
  const propsRef = useRef({ isActive, isBreak, isWaiting, isMuted });
  useEffect(() => {
    propsRef.current = { isActive, isBreak, isWaiting, isMuted };
  }, [isActive, isBreak, isWaiting, isMuted]);

  const modelUrl = import.meta.env.VITE_TEACHABLE_MACHINE_URL;

  const playDistractionChime = () => {
    if (propsRef.current.isMuted) return;
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
      const { isActive, isBreak, isWaiting } = propsRef.current;

      // Only run predictions during active focus sessions
      if (isActive && !isBreak && !isWaiting) {
        await predict();
      } else {
        consecutiveFramesRef.current = 0;
        isDistractedRef.current = false;
      }
    }
    animFrameIdRef.current = window.requestAnimationFrame(loop);
  };

  const predict = async () => {
    if (!modelRef.current || !webcamRef.current) return;

    const predictions = await modelRef.current.predict(webcamRef.current.canvas);

    let topClass = "";
    let highestProb = 0;

    for (let i = 0; i < predictions.length; i++) {
      if (predictions[i].probability > highestProb) {
        highestProb = predictions[i].probability;
        topClass = predictions[i].className.toLowerCase();
      }
    }

    setDetectedLabel(topClass);

    if (highestProb > 0.8) {
      const isHoldingPhone = topClass.includes("iphone") || topClass.includes("android");

      if (isHoldingPhone) {
        consecutiveFramesRef.current += 1;
        if (consecutiveFramesRef.current > 5 && !isDistractedRef.current) {
          isDistractedRef.current = true;
          playDistractionChime();
          if (onDistractionDetected) {
            onDistractionDetected();
          }
        }
      } else {
        consecutiveFramesRef.current = 0;
        isDistractedRef.current = false;
      }
    }
  };

  return (
    <div className="relative w-96 h-96 rounded-2xl ring-8 ring-(--violet)/40 bg-[#c4c4cc] overflow-hidden flex flex-col items-center justify-center shadow-lg">
      <div ref={containerRef} className="w-full h-full flex items-center justify-center" />

      {isLoading && (
        <div className="absolute inset-0 bg-[#c4c4cc] flex flex-col items-center justify-center text-black font-mono text-2xl">
          <p>camera</p>
          <p>loading</p>
          <p className="tracking-widest">....</p>
        </div>
      )}

      {!isLoading && (
        <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md px-3 py-1 rounded-lg text-xs font-mono text-white/90 border border-white/10">
          detected: <span className="text-(--violet) font-bold">{isBreak || isWaiting ? "break mode" : detectedLabel}</span>
        </div>
      )}
    </div>
  );
}
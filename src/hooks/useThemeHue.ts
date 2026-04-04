import { useEffect, useState } from 'react';
import WebGPU from 'three/examples/jsm/capabilities/WebGPU.js';

export default function useThemeHue(speed = 0.5) {
  const [hue, setHue] = useState<number>(0);
  const [hasWebGPU, setHasWebGPU] = useState<boolean>(false);

  useEffect(() => {
    setHasWebGPU(WebGPU.isAvailable());

    let rafId = 0 as number;
    let lastTimestamp = 0;

    const animate = (timestamp: number) => {
      if (!lastTimestamp) lastTimestamp = timestamp;
      const delta = Math.min(0.03, (timestamp - lastTimestamp) / 1000);
      lastTimestamp = timestamp;
      setHue((prev) => (prev + delta * speed * 360) % 360);
      rafId = requestAnimationFrame(animate);
    };

    rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
  }, [speed]);

  const themeColor = `hsl(${hue}, 100%, 60%)`;
  return { themeColor, hue, hasWebGPU } as const;
}

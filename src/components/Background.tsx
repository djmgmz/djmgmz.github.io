import { useEffect, useRef } from 'react';

/**
 * Vanta Cells animated background (replaces ParallaxStars)
 * Loads Three.js and Vanta via CDN dynamically
 */
export function Background() {
  const vantaRef = useRef<HTMLDivElement>(null);
  const vantaEffectRef = useRef<any>(null);

  useEffect(() => {
    const loadScript = (src: string): Promise<void> => {
      return new Promise((resolve, reject) => {
        // Check if script already exists
        const existing = document.querySelector(`script[src="${src}"]`);
        if (existing) {
          resolve();
          return;
        }

        const script = document.createElement('script');
        script.src = src;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error(`Failed to load ${src}`));
        document.head.appendChild(script);
      });
    };

    const initVanta = async () => {
      try {
        // Load Three.js first, then Vanta
        await loadScript('https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js');
        await loadScript('https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.cells.min.js');

        // Initialize Vanta Cells
        if (vantaRef.current && (window as any).VANTA) {
          vantaEffectRef.current = (window as any).VANTA.CELLS({
            el: vantaRef.current,
            mouseControls: true,
            touchControls: true,
            gyroControls: false,
            minHeight: 200.00,
            minWidth: 200.00,
            scale: 1.00,
            color1: 0x363636,
            color2: 0x161616,
            size: 0.6,
            speed: 2,
          });
        }
      } catch (error) {
        console.error('Failed to load Vanta background:', error);
      }
    };

    initVanta();

    // Cleanup
    return () => {
      if (vantaEffectRef.current) {
        vantaEffectRef.current.destroy();
      }
    };
  }, []);

  return (
    <div
      ref={vantaRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 0,
        pointerEvents: 'none',
      }}
      aria-hidden
    />
  );
}

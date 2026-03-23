import { useEffect, useRef, useCallback, useState } from "react";
import "./HobbyBubbles.css";

const hobbies = [
  { name: "Music", icon: "🎧" },
  { name: "Gaming", icon: "🎮" },
  { name: "Films", icon: "🎬" },
  { name: "Anime", icon: "🍥" },
  { name: "Teamfight Tactics", image: "/src/assets/teamfighttactics.svg" },
  { name: "Japanese Culture", icon: "🇯🇵" },
  { name: "New Jeans", image: "/src/assets/newjeansbunny.png" },
];

const BUBBLE_RADIUS = 30;
const FRICTION = 0.98;
const BOUNCE_DAMPING = 0.8;
const RETURN_FORCE = 0.002;

interface Bubble {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  isDragging: boolean;
}

export default function HobbyBubbles() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const bubblesRef = useRef<Bubble[]>([]);
  const mouseRef = useRef({ x: 0, y: 0, isDown: false });
  const draggedBubbleRef = useRef<number | null>(null);
  const rafRef = useRef<number | undefined>(undefined);

  // Initialize bubbles
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const initialBubbles = hobbies.map((_, index) => ({
      id: index,
      x: Math.random() * (rect.width - BUBBLE_RADIUS * 2) + BUBBLE_RADIUS,
      y: Math.random() * (rect.height - BUBBLE_RADIUS * 2) + BUBBLE_RADIUS,
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2,
      isDragging: false,
    }));
    bubblesRef.current = initialBubbles;
    setBubbles(initialBubbles);
  }, []);

  // Circle collision detection and response
  const resolveCollision = useCallback((b1: Bubble, b2: Bubble) => {
    const dx = b2.x - b1.x;
    const dy = b2.y - b1.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const minDistance = BUBBLE_RADIUS * 2;

    if (distance < minDistance && distance > 0) {
      const nx = dx / distance;
      const ny = dy / distance;

      const overlap = minDistance - distance;
      const separationX = nx * overlap * 0.5;
      const separationY = ny * overlap * 0.5;

      b1.x -= separationX;
      b1.y -= separationY;
      b2.x += separationX;
      b2.y += separationY;

      const dvx = b2.vx - b1.vx;
      const dvy = b2.vy - b1.vy;
      const velAlongNormal = dvx * nx + dvy * ny;

      if (velAlongNormal > 0) return;

      const impulse = -(1 + BOUNCE_DAMPING) * velAlongNormal / 2;

      b1.vx -= impulse * nx;
      b1.vy -= impulse * ny;
      b2.vx += impulse * nx;
      b2.vy += impulse * ny;
    }
  }, []);

  // Physics loop
  useEffect(() => {
    const animate = () => {
      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const bubbles = bubblesRef.current;

      bubbles.forEach((bubble) => {
        if (bubble.isDragging) {
          // When dragging, velocity follows mouse movement for throw effect
          bubble.vx = (mouseRef.current.x - bubble.x) * 0.3;
          bubble.vy = (mouseRef.current.y - bubble.y) * 0.3;
          bubble.x = mouseRef.current.x;
          bubble.y = mouseRef.current.y;
        } else {
          // Gentle return force to keep bubbles in bounds
          const centerX = rect.width / 2;
          const centerY = rect.height / 2;
          bubble.vx += (centerX - bubble.x) * RETURN_FORCE * 0.1;
          bubble.vy += (centerY - bubble.y) * RETURN_FORCE * 0.1;

          // Apply velocity
          bubble.x += bubble.vx;
          bubble.y += bubble.vy;

          // Friction
          bubble.vx *= FRICTION;
          bubble.vy *= FRICTION;

          // Wall collisions
          if (bubble.x < BUBBLE_RADIUS) {
            bubble.x = BUBBLE_RADIUS;
            bubble.vx *= -BOUNCE_DAMPING;
          } else if (bubble.x > rect.width - BUBBLE_RADIUS) {
            bubble.x = rect.width - BUBBLE_RADIUS;
            bubble.vx *= -BOUNCE_DAMPING;
          }

          if (bubble.y < BUBBLE_RADIUS) {
            bubble.y = BUBBLE_RADIUS;
            bubble.vy *= -BOUNCE_DAMPING;
          } else if (bubble.y > rect.height - BUBBLE_RADIUS) {
            bubble.y = rect.height - BUBBLE_RADIUS;
            bubble.vy *= -BOUNCE_DAMPING;
          }
        }
      });

      // Resolve bubble-bubble collisions
      for (let i = 0; i < bubbles.length; i++) {
        for (let j = i + 1; j < bubbles.length; j++) {
          resolveCollision(bubbles[i], bubbles[j]);
        }
      }

      // Update state every frame
      setBubbles([...bubbles]);
      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [resolveCollision]);

  // Mouse/touch handlers
  const handleMouseMove = useCallback((e: React.MouseEvent | MouseEvent) => {
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    mouseRef.current.x = e.clientX - rect.left;
    mouseRef.current.y = e.clientY - rect.top;
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent | TouchEvent) => {
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const touch = e.touches[0];
    mouseRef.current.x = touch.clientX - rect.left;
    mouseRef.current.y = touch.clientY - rect.top;
  }, []);

  const handleMouseDown = useCallback((index: number) => (e: React.MouseEvent) => {
    e.preventDefault();
    mouseRef.current.isDown = true;
    draggedBubbleRef.current = index;
    bubblesRef.current[index].isDragging = true;
    bubblesRef.current[index].vx = 0;
    bubblesRef.current[index].vy = 0;
    setBubbles([...bubblesRef.current]);
  }, []);

  const handleTouchStart = useCallback((index: number) => (e: React.TouchEvent) => {
    const touch = e.touches[0];
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    mouseRef.current.x = touch.clientX - rect.left;
    mouseRef.current.y = touch.clientY - rect.top;
    mouseRef.current.isDown = true;
    draggedBubbleRef.current = index;
    bubblesRef.current[index].isDragging = true;
    bubblesRef.current[index].vx = 0;
    bubblesRef.current[index].vy = 0;
    setBubbles([...bubblesRef.current]);
  }, []);

  const handleMouseUp = useCallback(() => {
    mouseRef.current.isDown = false;
    const draggedIndex = draggedBubbleRef.current;
    if (draggedIndex !== null) {
      bubblesRef.current[draggedIndex].isDragging = false;
      draggedBubbleRef.current = null;
      setBubbles([...bubblesRef.current]);
    }
  }, []);

  // Global mouse/touch listeners
  useEffect(() => {
    const handleGlobalMouseUp = () => handleMouseUp();
    const handleGlobalTouchEnd = () => handleMouseUp();

    window.addEventListener("mouseup", handleGlobalMouseUp);
    window.addEventListener("touchend", handleGlobalTouchEnd);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchmove", handleTouchMove as unknown as EventListener);

    return () => {
      window.removeEventListener("mouseup", handleGlobalMouseUp);
      window.removeEventListener("touchend", handleGlobalTouchEnd);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove as unknown as EventListener);
    };
  }, [handleMouseMove, handleTouchMove, handleMouseUp]);

  return (
    <div
      className="bubble-container"
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onTouchMove={handleTouchMove}
    >
      {hobbies.map((hobby, index) => {
        const bubble = bubbles[index];
        if (!bubble) return null;

        return (
          <div
            key={index}
            className={`bubble ${bubble.isDragging ? "dragging" : ""}`}
            style={{
              transform: `translate(${bubble.x - BUBBLE_RADIUS}px, ${bubble.y - BUBBLE_RADIUS}px)`,
            }}
            onMouseDown={handleMouseDown(index)}
            onTouchStart={handleTouchStart(index)}
          >
            <span className="icon">
              {hobby.image ? (
                <img src={hobby.image} alt={hobby.name} style={{ width: '28px', height: '28px', objectFit: 'contain' }} />
              ) : (
                hobby.icon
              )}
            </span>
            <span className="label">{hobby.name}</span>
          </div>
        );
      })}
    </div>
  );
}

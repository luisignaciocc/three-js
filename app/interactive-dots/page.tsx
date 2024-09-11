"use client";

import React, { useEffect, useRef, useState } from "react";

import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";

export default function Page() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [dotSize, setDotSize] = useState(1);
  const [dotSpacing, setDotSpacing] = useState(20);
  const [mouseBoundingSize, setMouseBoundingSize] = useState(100);
  const [dotInertia, setDotInertia] = useState(0.4);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let dots: {
      x: number;
      y: number;
      originX: number;
      originY: number;
      vx: number;
      vy: number;
    }[] = [];
    let animationFrameId: number;
    let mouseX = -1000;
    let mouseY = -1000;

    const resizeCanvas = () => {
      const { width, height } = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      initDots();
    };

    const initDots = () => {
      dots = [];
      const { width, height } = canvas.getBoundingClientRect();
      for (let y = dotSpacing; y < height - dotSpacing; y += dotSpacing) {
        for (let x = dotSpacing; x < width - dotSpacing; x += dotSpacing) {
          dots.push({ x, y, originX: x, originY: y, vx: 0, vy: 0 });
        }
      }
    };

    const drawDots = () => {
      const { width, height } = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = "white";
      dots.forEach((dot) => {
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, dotSize, 0, Math.PI * 2);
        ctx.fill();
      });
    };

    const updateDots = () => {
      dots.forEach((dot) => {
        const dx = mouseX - dot.x;
        const dy = mouseY - dot.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < mouseBoundingSize) {
          const force = (mouseBoundingSize - distance) / mouseBoundingSize;
          const angle = Math.atan2(dy, dx);
          const targetX = dot.x - Math.cos(angle) * force * 20;
          const targetY = dot.y - Math.sin(angle) * force * 20;

          dot.vx += (targetX - dot.x) * dotInertia;
          dot.vy += (targetY - dot.y) * dotInertia;
        }

        dot.vx *= 0.9;
        dot.vy *= 0.9;

        dot.x += dot.vx;
        dot.y += dot.vy;

        const dx2 = dot.originX - dot.x;
        const dy2 = dot.originY - dot.y;
        const distance2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);

        if (distance2 > 1) {
          dot.x += dx2 * 0.03;
          dot.y += dy2 * 0.03;
        }
      });
    };

    const animate = () => {
      updateDots();
      drawDots();
      animationFrameId = requestAnimationFrame(animate);
    };

    const handlePointerMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    };

    const handlePointerLeave = () => {
      mouseX = -1000;
      mouseY = -1000;
    };

    window.addEventListener("resize", resizeCanvas);
    canvas.addEventListener("pointermove", handlePointerMove);
    canvas.addEventListener("pointerleave", handlePointerLeave);

    resizeCanvas();
    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      canvas.removeEventListener("pointermove", handlePointerMove);
      canvas.removeEventListener("pointerleave", handlePointerLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, [dotSize, dotSpacing, mouseBoundingSize, dotInertia]);

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full touch-none"
      />
      <Card className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-11/12 max-w-md bg-black/50 text-white">
        <CardContent className="p-2">
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <label>Dot Size: {dotSize}px</label>
              <Slider
                min={1}
                max={10}
                step={1}
                value={[dotSize]}
                onValueChange={([value]) => setDotSize(value)}
              />
            </div>
            <div>
              <label>Dot Spacing: {dotSpacing}px</label>
              <Slider
                min={10}
                max={100}
                step={5}
                value={[dotSpacing]}
                onValueChange={([value]) => setDotSpacing(value)}
              />
            </div>
            <div>
              <label>Mouse Bounding: {mouseBoundingSize}px</label>
              <Slider
                min={50}
                max={200}
                step={10}
                value={[mouseBoundingSize]}
                onValueChange={([value]) => setMouseBoundingSize(value)}
              />
            </div>
            <div>
              <label>Dot Inertia: {dotInertia.toFixed(2)}</label>
              <Slider
                min={0.01}
                max={0.5}
                step={0.01}
                value={[dotInertia]}
                onValueChange={([value]) => setDotInertia(value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

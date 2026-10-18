import { useEffect, useRef } from 'react';

interface Lantern {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  swingAngle: number;
  swingSpeed: number;
  opacity: number;
}

export default function FloatingLanterns() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Create 18 floating sky lanterns (Tangled style)
    const count = 20;
    const lanterns: Lantern[] = [];

    for (let i = 0; i < count; i++) {
      lanterns.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: 14 + Math.random() * 20,
        speedY: 0.35 + Math.random() * 0.65,
        speedX: -0.2 + Math.random() * 0.4,
        swingAngle: Math.random() * Math.PI * 2,
        swingSpeed: 0.015 + Math.random() * 0.02,
        opacity: 0.4 + Math.random() * 0.5,
      });
    }

    const drawLantern = (l: Lantern) => {
      ctx.save();
      ctx.translate(l.x, l.y);
      const swing = Math.sin(l.swingAngle) * 0.12;
      ctx.rotate(swing);

      const w = l.size;
      const h = l.size * 1.35;

      // Warm radial glow around lantern
      const glow = ctx.createRadialGradient(0, 0, w * 0.2, 0, 0, w * 1.8);
      glow.addColorStop(0, `rgba(254, 215, 170, ${l.opacity * 0.85})`);
      glow.addColorStop(0.5, `rgba(251, 146, 60, ${l.opacity * 0.4})`);
      glow.addColorStop(1, 'rgba(251, 146, 60, 0)');

      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(0, 0, w * 1.8, 0, Math.PI * 2);
      ctx.fill();

      // Tangled Sky Lantern body (Rounded cylinder with soft taper)
      ctx.fillStyle = `rgba(255, 237, 213, ${l.opacity})`;
      ctx.strokeStyle = `rgba(249, 115, 22, ${l.opacity * 0.8})`;
      ctx.lineWidth = 1;

      ctx.beginPath();
      ctx.moveTo(-w * 0.4, -h * 0.45);
      ctx.bezierCurveTo(-w * 0.55, -h * 0.1, -w * 0.55, h * 0.2, -w * 0.35, h * 0.45);
      ctx.lineTo(w * 0.35, h * 0.45);
      ctx.bezierCurveTo(w * 0.55, h * 0.2, w * 0.55, -h * 0.1, w * 0.4, -h * 0.45);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Candle core inside
      ctx.fillStyle = `rgba(254, 240, 138, ${Math.min(1, l.opacity + 0.3)})`;
      ctx.beginPath();
      ctx.ellipse(0, h * 0.2, w * 0.22, w * 0.28, 0, 0, Math.PI * 2);
      ctx.fill();

      // Base rim
      ctx.strokeStyle = `rgba(194, 65, 12, ${l.opacity})`;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.ellipse(0, h * 0.45, w * 0.35, w * 0.1, 0, 0, Math.PI * 2);
      ctx.stroke();

      ctx.restore();
    };

    let tick = 0;
    const render = () => {
      ctx.clearRect(0, 0, width, height);
      tick += 0.02;

      for (let i = 0; i < lanterns.length; i++) {
        const l = lanterns[i];
        l.y -= l.speedY; // Rise upwards
        l.x += l.speedX + Math.sin(tick + i) * 0.25;
        l.swingAngle += l.swingSpeed;

        // Reset to bottom when floating past the top
        if (l.y < -50) {
          l.y = height + 40;
          l.x = Math.random() * width;
        }
        if (l.x < -30) l.x = width + 20;
        if (l.x > width + 30) l.x = -20;

        drawLantern(l);
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-5 transition-opacity duration-1000"
    />
  );
}

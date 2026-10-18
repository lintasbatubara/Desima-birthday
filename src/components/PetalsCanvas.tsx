import { useEffect, useRef, useState } from 'react';
import { Sparkles, Wind } from 'lucide-react';

interface Petal {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  angle: number;
  angularSpeed: number;
  flip: number;
  flipSpeed: number;
  color: string;
  opacity: number;
  type: 'rose' | 'sakura' | 'sparkle';
}

interface PetalsCanvasProps {
  interactive?: boolean;
}

export default function PetalsCanvas({ interactive = true }: PetalsCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [density, setDensity] = useState<'gentle' | 'abundant'>('gentle');
  const [isEnabled, setIsEnabled] = useState(true);
  const mouseRef = useRef({ x: -1000, y: -1000, vx: 0, vy: 0, lastX: 0, lastY: 0 });

  useEffect(() => {
    if (!isEnabled) return;
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

    const petalCount = density === 'gentle' ? 38 : 72;
    const petals: Petal[] = [];

    const colors = [
      '#fecdd3', // rose-200
      '#fda4af', // rose-300
      '#fb7185', // rose-400
      '#f472b6', // pink-400
      '#fbcfe8', // pink-200
      '#fef08a', // sparkle gold
      '#f59e0b', // amber sparkle
    ];

    for (let i = 0; i < petalCount; i++) {
      const isSparkle = Math.random() < 0.22;
      petals.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: isSparkle ? 2.5 + Math.random() * 3.5 : 10 + Math.random() * 16,
        speedY: isSparkle ? 0.4 + Math.random() * 0.8 : 0.8 + Math.random() * 1.8,
        speedX: -0.6 + Math.random() * 1.2,
        angle: Math.random() * Math.PI * 2,
        angularSpeed: (Math.random() - 0.5) * 0.03,
        flip: Math.random() * Math.PI,
        flipSpeed: 0.015 + Math.random() * 0.03,
        color: isSparkle ? (Math.random() > 0.5 ? '#fef08a' : '#fed7aa') : colors[Math.floor(Math.random() * 5)],
        opacity: isSparkle ? 0.3 + Math.random() * 0.6 : 0.6 + Math.random() * 0.35,
        type: isSparkle ? 'sparkle' : Math.random() > 0.4 ? 'rose' : 'sakura',
      });
    }

    const drawPetal = (p: Petal) => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.angle);
      const flipScale = Math.cos(p.flip);
      ctx.scale(1, flipScale);

      if (p.type === 'sparkle') {
        // Glowing 4-point star sparkle
        ctx.fillStyle = p.color;
        ctx.shadowColor = '#f59e0b';
        ctx.shadowBlur = 6;
        ctx.globalAlpha = p.opacity * Math.abs(Math.sin(p.flip * 2));
        ctx.beginPath();
        const r = p.size;
        ctx.moveTo(0, -r);
        ctx.quadraticCurveTo(0, 0, r, 0);
        ctx.quadraticCurveTo(0, 0, 0, r);
        ctx.quadraticCurveTo(0, 0, -r, 0);
        ctx.quadraticCurveTo(0, 0, 0, -r);
        ctx.closePath();
        ctx.fill();
      } else {
        // Delicate curved flower petal
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.opacity;
        ctx.shadowColor = 'rgba(244, 114, 182, 0.25)';
        ctx.shadowBlur = 4;

        ctx.beginPath();
        if (p.type === 'rose') {
          // Romantic rose petal curve
          ctx.moveTo(0, -p.size * 0.9);
          ctx.bezierCurveTo(p.size * 0.7, -p.size * 0.7, p.size * 0.8, p.size * 0.5, 0, p.size);
          ctx.bezierCurveTo(-p.size * 0.8, p.size * 0.5, -p.size * 0.7, -p.size * 0.7, 0, -p.size * 0.9);
        } else {
          // Sakura petal with subtle notch
          ctx.moveTo(0, -p.size * 0.8);
          ctx.quadraticCurveTo(p.size * 0.6, -p.size * 0.2, p.size * 0.4, p.size * 0.8);
          ctx.quadraticCurveTo(0, p.size * 0.6, -p.size * 0.4, p.size * 0.8);
          ctx.quadraticCurveTo(-p.size * 0.6, -p.size * 0.2, 0, -p.size * 0.8);
        }
        ctx.closePath();
        ctx.fill();

        // Subtle center vein highlight
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.moveTo(0, -p.size * 0.6);
        ctx.lineTo(0, p.size * 0.5);
        ctx.stroke();
      }

      ctx.restore();
    };

    let tick = 0;
    const render = () => {
      ctx.clearRect(0, 0, width, height);
      tick += 0.015;

      const mouse = mouseRef.current;
      const globalBreeze = Math.sin(tick * 0.8) * 0.7;

      for (let i = 0; i < petals.length; i++) {
        const p = petals[i];

        // Motion physics
        p.y += p.speedY;
        p.x += p.speedX + globalBreeze + Math.sin(tick + i) * 0.4;
        p.angle += p.angularSpeed;
        p.flip += p.flipSpeed;

        // Subtle reaction to mouse breeze
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 140) {
          const force = (1 - dist / 140) * 2.2;
          p.x += (dx / (dist || 1)) * force + mouse.vx * 0.15;
          p.y += (dy / (dist || 1)) * force + mouse.vy * 0.15;
        }

        // Wrap around boundaries
        if (p.y > height + 30) {
          p.y = -20;
          p.x = Math.random() * width;
        }
        if (p.x < -30) p.x = width + 20;
        if (p.x > width + 30) p.x = -20;

        drawPetal(p);
      }

      animId = requestAnimationFrame(render);
    };

    render();

    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      const m = mouseRef.current;
      m.vx = clientX - m.lastX;
      m.vy = clientY - m.lastY;
      m.x = clientX;
      m.y = clientY;
      m.lastX = clientX;
      m.lastY = clientY;
    };

    window.addEventListener('mousemove', handlePointerMove);
    window.addEventListener('touchmove', handlePointerMove, { passive: true });

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('touchmove', handlePointerMove);
      cancelAnimationFrame(animId);
    };
  }, [density, isEnabled]);

  return (
    <>
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="fixed inset-0 pointer-events-none z-10 transition-opacity duration-700"
        style={{ opacity: isEnabled ? 1 : 0 }}
      />

      {interactive && (
        <div className="fixed bottom-4 left-4 z-40 flex items-center gap-2 bg-white/80 backdrop-blur-md border border-rose-200/80 rounded-full px-3 py-1.5 shadow-sm text-xs text-rose-900 transition-all hover:bg-white">
          <button
            onClick={() => setIsEnabled(!isEnabled)}
            className="flex items-center gap-1.5 font-medium hover:text-rose-600 transition-colors"
            title="Nyalakan / Matikan Kelopak Bunga"
          >
            <Sparkles className={`w-3.5 h-3.5 ${isEnabled ? 'text-rose-500 fill-rose-200' : 'text-slate-400'}`} />
            <span>{isEnabled ? 'Kelopak Bunga: Aktif' : 'Kelopak: Nonaktif'}</span>
          </button>
          {isEnabled && (
            <>
              <span className="text-rose-300">|</span>
              <button
                onClick={() => setDensity(density === 'gentle' ? 'abundant' : 'gentle')}
                className="flex items-center gap-1 text-slate-600 hover:text-rose-700 transition-colors"
                title="Atur Kepadatan Bunga"
              >
                <Wind className="w-3.5 h-3.5 text-rose-400" />
                <span>{density === 'gentle' ? 'Breeze Halus' : 'Bunga Lebat'}</span>
              </button>
            </>
          )}
        </div>
      )}
    </>
  );
}

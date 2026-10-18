import { useState } from 'react';
import { Sparkles, Flame, RotateCcw, Heart, Crown } from 'lucide-react';
import confetti from 'canvas-confetti';
import { royalAudio } from '../utils/audioSynthesizer';

export default function InteractiveCake() {
  const [isBlown, setIsBlown] = useState(false);
  const [wishMade, setWishMade] = useState(false);

  const handleBlowCandles = () => {
    if (isBlown) return;
    setIsBlown(true);
    setWishMade(true);
    royalAudio.playSparkle();

    // Fire royal celebration confetti
    const count = 200;
    const defaults = {
      origin: { y: 0.7 },
      colors: ['#f43f5e', '#ec4899', '#f59e0b', '#fbbf24', '#fbcfe8', '#ffffff'],
    };

    function fire(particleRatio: number, opts: confetti.Options) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio),
      });
    }

    fire(0.25, {
      spread: 26,
      startVelocity: 55,
    });
    fire(0.2, {
      spread: 60,
    });
    fire(0.35, {
      spread: 100,
      decay: 0.91,
      scalar: 0.8,
    });
    fire(0.1, {
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
      scalar: 1.2,
    });
    fire(0.1, {
      spread: 120,
      startVelocity: 45,
    });
  };

  const handleRelight = () => {
    setIsBlown(false);
    setWishMade(false);
    royalAudio.playSparkle();
  };

  return (
    <div className="relative max-w-xl mx-auto bg-gradient-to-b from-white via-rose-50/40 to-amber-50/30 border border-rose-200/80 rounded-3xl p-6 md:p-8 shadow-xl text-center overflow-hidden">
      {/* Decorative Crown & Header */}
      <div className="flex items-center justify-center gap-2 mb-2">
        <Crown className="w-5 h-5 text-amber-500 fill-amber-300" />
        <span className="font-cinzel text-xs uppercase tracking-widest text-amber-800 font-bold">
          Royal Birthday Wish
        </span>
        <Crown className="w-5 h-5 text-amber-500 fill-amber-300" />
      </div>

      <h3 className="text-2xl md:text-3xl font-bold font-playfair text-slate-800">
        Kue Ulang Tahun Sang Putri
      </h3>
      <p className="text-xs md:text-sm text-slate-600 mt-1 max-w-md mx-auto">
        Tutup mata sejenak, buat harapan terindahmu dalam hati, lalu tiup lilinnya ya, Des!
      </p>

      {/* SVG Royal Cake Illustration */}
      <div className="relative my-8 flex justify-center items-center">
        <svg
          viewBox="0 0 320 280"
          className="w-64 sm:w-72 md:w-80 h-auto filter drop-shadow-md select-none"
        >
          {/* Cake Stand */}
          <path
            d="M 60 260 L 260 260 Q 270 260 270 250 L 50 250 Q 50 260 60 260 Z"
            fill="#d1d5db"
          />
          <path
            d="M 120 260 L 110 275 L 210 275 L 200 260 Z"
            fill="#9ca3af"
          />
          <path
            d="M 80 275 L 240 275 L 250 280 L 70 280 Z"
            fill="#6b7280"
          />

          {/* Bottom Cake Tier */}
          <rect x="50" y="180" width="220" height="70" rx="12" fill="#fed7aa" />
          <path
            d="M 50 200 Q 75 215 100 200 Q 125 215 150 200 Q 175 215 200 200 Q 225 215 250 200 Q 260 210 270 200 L 270 180 L 50 180 Z"
            fill="#fb7185"
          />
          {/* Rose Petals around bottom tier */}
          <circle cx="90" cy="225" r="5" fill="#f43f5e" />
          <circle cx="160" cy="225" r="6" fill="#f43f5e" />
          <circle cx="230" cy="225" r="5" fill="#f43f5e" />

          {/* Middle Tier */}
          <rect x="80" y="125" width="160" height="58" rx="10" fill="#fbcfe8" />
          <path
            d="M 80 142 Q 105 155 130 142 Q 155 155 180 142 Q 205 155 230 142 Q 235 148 240 142 L 240 125 L 80 125 Z"
            fill="#f472b6"
          />
          <circle cx="120" cy="160" r="4" fill="#fb7185" />
          <circle cx="160" cy="160" r="5" fill="#fb7185" />
          <circle cx="200" cy="160" r="4" fill="#fb7185" />

          {/* Top Tier */}
          <rect x="110" y="80" width="100" height="48" rx="8" fill="#ffedd5" />
          <path
            d="M 110 95 Q 135 108 160 95 Q 185 108 210 95 L 210 80 L 110 80 Z"
            fill="#f43f5e"
          />

          {/* Tiny Golden Tiara Topper */}
          <path
            d="M 142 78 L 148 68 L 160 74 L 172 68 L 178 78 Z"
            fill="#fbbf24"
            stroke="#b45309"
            strokeWidth="1"
          />

          {/* Candles */}
          {/* Candle 1 (Left) */}
          <rect x="125" y="42" width="6" height="38" rx="2" fill="#fef08a" stroke="#ca8a04" strokeWidth="0.8" />
          <line x1="128" y1="42" x2="128" y2="35" stroke="#475569" strokeWidth="1.2" />

          {/* Candle 2 (Center) */}
          <rect x="157" y="32" width="6" height="48" rx="2" fill="#fed7aa" stroke="#ea580c" strokeWidth="0.8" />
          <line x1="160" y1="32" x2="160" y2="25" stroke="#475569" strokeWidth="1.2" />

          {/* Candle 3 (Right) */}
          <rect x="189" y="42" width="6" height="38" rx="2" fill="#fef08a" stroke="#ca8a04" strokeWidth="0.8" />
          <line x1="192" y1="42" x2="192" y2="35" stroke="#475569" strokeWidth="1.2" />

          {/* Animated Flames (if not blown) */}
          {!isBlown ? (
            <>
              {/* Flame 1 */}
              <g className="animate-pulse" style={{ transformOrigin: '128px 30px' }}>
                <path
                  d="M 128 20 C 133 26 132 34 128 35 C 124 34 123 26 128 20 Z"
                  fill="#f59e0b"
                />
                <circle cx="128" cy="30" r="2.5" fill="#fef08a" />
              </g>

              {/* Flame 2 (Center) */}
              <g className="animate-pulse" style={{ animationDelay: '0.2s', transformOrigin: '160px 20px' }}>
                <path
                  d="M 160 10 C 166 17 165 24 160 25 C 155 24 154 17 160 10 Z"
                  fill="#f59e0b"
                />
                <circle cx="160" cy="20" r="3" fill="#fef08a" />
              </g>

              {/* Flame 3 */}
              <g className="animate-pulse" style={{ animationDelay: '0.4s', transformOrigin: '192px 30px' }}>
                <path
                  d="M 192 20 C 197 26 196 34 192 35 C 188 34 187 26 192 20 Z"
                  fill="#f59e0b"
                />
                <circle cx="192" cy="30" r="2.5" fill="#fef08a" />
              </g>
            </>
          ) : (
            /* Smoke puffs when blown */
            <g className="text-slate-400 opacity-60">
              <path
                d="M 128 30 Q 124 22 130 16 Q 134 10 128 4"
                stroke="#94a3b8"
                strokeWidth="1.5"
                fill="none"
                strokeDasharray="2,2"
              />
              <path
                d="M 160 20 Q 155 12 163 6 Q 166 2 160 -4"
                stroke="#94a3b8"
                strokeWidth="1.5"
                fill="none"
                strokeDasharray="2,2"
              />
              <path
                d="M 192 30 Q 188 22 195 16 Q 198 10 192 4"
                stroke="#94a3b8"
                strokeWidth="1.5"
                fill="none"
                strokeDasharray="2,2"
              />
            </g>
          )}
        </svg>
      </div>

      {/* Action Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        {!isBlown ? (
          <button
            onClick={handleBlowCandles}
            className="w-full sm:w-auto px-7 py-3 bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 text-white font-semibold rounded-full shadow-lg shadow-rose-200 hover:from-rose-600 hover:to-pink-700 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 group"
          >
            <Flame className="w-5 h-5 text-amber-200 group-hover:scale-110 transition-transform" />
            <span>Tiup Lilin & Buat Harapan 🎂</span>
          </button>
        ) : (
          <button
            onClick={handleRelight}
            className="px-5 py-2.5 bg-white border border-rose-200 text-rose-700 font-medium rounded-full shadow-sm hover:bg-rose-50 hover:border-rose-300 transition-all flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4 text-rose-500" />
            <span>Nyalakan Lilin Kembali</span>
          </button>
        )}
      </div>

      {/* Wish Reveal Card */}
      {wishMade && (
        <div className="mt-6 p-4 bg-white/90 border border-amber-200 rounded-2xl shadow-sm animate-in fade-in zoom-in-95 duration-500">
          <div className="flex items-center justify-center gap-1.5 text-amber-600 mb-1">
            <Sparkles className="w-4 h-4 fill-amber-300" />
            <span className="text-xs font-cinzel font-bold uppercase tracking-wider">
              Harapan Terkabul
            </span>
            <Sparkles className="w-4 h-4 fill-amber-300" />
          </div>
          <p className="font-playfair text-base md:text-lg text-slate-800 font-semibold">
            "Semoga setiap doa baik yang terucap di hatimu hari ini menjadi nyata, Desima."
          </p>
          <p className="text-xs text-slate-600 mt-1 max-w-sm mx-auto">
            Semoga harimu selalu dikelilingi kebahagiaan, kesehatan yang melimpah, dan orang-orang yang tulus menyayangimu.
          </p>
          <div className="mt-3 flex items-center justify-center gap-1 text-xs text-rose-600 font-medium">
            <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
            <span>Happy Birthday, Desima Triana Grey Tindaon!</span>
          </div>
        </div>
      )}
    </div>
  );
}

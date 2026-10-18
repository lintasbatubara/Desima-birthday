/**
 * Princess Birthday Story Application for Desima Triana Grey Tindaon
 * Features:
 * - Mobile/Tablet-first multi-step story flow (not a single long scrolling page)
 * - Single background track: Tangled - "I See The Light" (Chorus / Reff piano melody)
 * - 9 photo memories of Desima with princess tiaras, stickers & mobile gallery loader
 * - Animated Tangled sky lanterns & falling flower petals
 * - Birthday wishes: Panjang umur, sehat selalu, bahagia selalu dll.
 * - Interactive birthday cake with blowable candles & confetti
 * - Heartfelt personal letter addressing Desima Triana Grey Tindaon, Desima, and Des
 * - Final chapter: Direct WhatsApp reply button
 */

import { useState, useEffect } from 'react';
import {
  Crown,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  Cake,
  Mail,
  Camera,
  MessageCircle,
  RotateCcw,
  Gift,
  Star,
  Flame,
  Send,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import PetalsCanvas from './components/PetalsCanvas';
import FloatingLanterns from './components/FloatingLanterns';
import TangledMusicButton from './components/TangledMusicButton';
import StoryGallery from './components/StoryGallery';
import { royalAudio } from './utils/audioSynthesizer';

const CHAPTERS = [
  { id: 0, title: 'Pembukaan', icon: Crown },
  { id: 1, title: 'Doa & Harapan', icon: Star },
  { id: 2, title: 'Tiup Lilin', icon: Cake },
  { id: 3, title: 'Princess Gallery', icon: Camera },
  { id: 4, title: 'Pesan', icon: Mail },
  { id: 5, title: 'Balas Pesan', icon: MessageCircle },
];

export default function App() {
  const [currentStep, setCurrentStep] = useState(0);

  // Auto sound on immediately as web is opened
  useEffect(() => {
    royalAudio.play();
  }, []);

  // Cake state
  const [cakeBlown, setCakeBlown] = useState(false);

  // Letter state
  const [letterOpen, setLetterOpen] = useState(false);

  // WhatsApp reply state - Direct to 082179417423
  const [waNumber] = useState('082179417423');
  const [waMessage, setWaMessage] = useState(
    'Halo! Makasih banyak yaa atas ucapan ulang tahunnya'
  );

  const triggerSparkles = () => {
    royalAudio.playSparkle();
    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#fbbf24', '#f59e0b', '#f43f5e', '#ec4899', '#fbcfe8'],
    });
  };

  const handleStartStory = () => {
    royalAudio.play();
    triggerSparkles();
    setCurrentStep(1);
  };

  const handleNextStep = () => {
    triggerSparkles();
    setCurrentStep((prev) => Math.min(CHAPTERS.length - 1, prev + 1));
  };

  const handlePrevStep = () => {
    royalAudio.playSparkle();
    setCurrentStep((prev) => Math.max(0, prev - 1));
  };

  const handleBlowCandle = () => {
    if (cakeBlown) return;
    setCakeBlown(true);
    royalAudio.playSparkle();

    // Grand celebration confetti
    const count = 180;
    const defaults = {
      origin: { y: 0.65 },
      colors: ['#f43f5e', '#ec4899', '#f59e0b', '#fbbf24', '#ffffff'],
    };

    confetti({ ...defaults, particleCount: Math.floor(count * 0.3), spread: 40, startVelocity: 45 });
    confetti({ ...defaults, particleCount: Math.floor(count * 0.4), spread: 80, decay: 0.92 });
    confetti({ ...defaults, particleCount: Math.floor(count * 0.3), spread: 110, startVelocity: 35 });
  };

  const handleSendWA = () => {
    royalAudio.playSparkle();
    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.8 },
      colors: ['#25D366', '#128C7E', '#f59e0b', '#f43f5e'],
    });

    let cleanNum = waNumber.replace(/\D/g, '');
    if (cleanNum.startsWith('0')) cleanNum = '62' + cleanNum.slice(1);

    const text = encodeURIComponent(waMessage);
    const url = cleanNum
      ? `https://api.whatsapp.com/send?phone=${cleanNum}&text=${text}`
      : `https://api.whatsapp.com/send?text=${text}`;

    window.open(url, '_blank');
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-[#fbf4f2] via-[#fff5f6] to-[#fbf1f4] text-slate-800 flex flex-col items-center justify-center p-0 sm:p-4 select-none overflow-x-hidden">
      {/* Background Animated Tangled Sky Lanterns */}
      <FloatingLanterns />

      {/* Background Animated Flower Petals */}
      <PetalsCanvas interactive={false} />

      {/* Floating Tangled Music Button (Top-Right, clean without text) */}
      <TangledMusicButton />

      {/* Main Responsive Mobile / Tablet Frame Container */}
      <div className="relative w-full max-w-md md:max-w-lg min-h-screen sm:min-h-[92vh] sm:max-h-[96vh] flex flex-col bg-white/90 backdrop-blur-md sm:rounded-3xl sm:border sm:border-rose-200/90 sm:shadow-2xl overflow-hidden z-20">
        {/* Top Header & Chapter Progress Tracker */}
        <header className="px-4 py-3 bg-white/80 border-b border-rose-100/80 backdrop-blur-md flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-amber-100 border border-amber-300 flex items-center justify-center shadow-xs">
              <Crown className="w-4 h-4 text-amber-600 fill-amber-300" />
            </div>
            <div>
              <p className="font-cinzel text-[11px] font-bold text-amber-900 tracking-wider uppercase leading-none">
                Princess Desima
              </p>
              <p className="text-[10px] text-rose-500 font-medium">
                {CHAPTERS[currentStep].title} ({currentStep + 1}/{CHAPTERS.length})
              </p>
            </div>
          </div>

          {/* Step Progress Dots */}
          <div className="flex items-center gap-1.5">
            {CHAPTERS.map((ch, idx) => (
              <button
                key={ch.id}
                onClick={() => {
                  royalAudio.playSparkle();
                  setCurrentStep(idx);
                }}
                className={`transition-all rounded-full ${
                  currentStep === idx
                    ? 'w-5 h-2 bg-gradient-to-r from-amber-400 to-rose-400'
                    : 'w-2 h-2 bg-rose-200 hover:bg-rose-300'
                }`}
                title={ch.title}
              />
            ))}
          </div>
        </header>

        {/* Scrollable Story Stage Viewport */}
        <main className="flex-1 overflow-y-auto px-4 py-6 flex flex-col items-center justify-center text-center">
          {/* ================= STEP 0: PEMBUKAAN (ROYAL PROLOGUE) ================= */}
          {currentStep === 0 && (
            <div className="space-y-6 my-auto animate-in fade-in zoom-in-95 duration-500 max-w-sm">
              {/* Animated Floating Royal Tiara */}
              <div className="relative mx-auto w-24 h-24 flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-tr from-amber-300 to-rose-300 rounded-full blur-xl opacity-60 animate-pulse" />
                <div className="relative w-20 h-20 rounded-full bg-gradient-to-b from-amber-100 to-rose-50 border-2 border-amber-300 shadow-xl flex items-center justify-center animate-crown-pulse">
                  <Crown className="w-10 h-10 text-amber-600 fill-amber-300 filter drop-shadow" />
                </div>
                <Sparkles className="absolute -top-1 -right-1 w-6 h-6 text-amber-400 fill-yellow-200 animate-spin" style={{ animationDuration: '6s' }} />
              </div>

              {/* Title Lockup */}
              <div className="space-y-2">
                <span className="font-cinzel text-xs tracking-widest uppercase text-amber-800 font-bold bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                  A Royal Princess Celebration
                </span>
                <h1 className="font-vibes text-4xl sm:text-5xl text-rose-600 leading-tight">
                  Happy Birthday
                </h1>
                <h2 className="font-playfair text-2xl sm:text-3xl font-bold text-slate-800 tracking-tight">
                  Desima Triana Grey Tindaon
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 font-serif leading-relaxed px-2 pt-1">
                  Sebuah persembahan istimewa untuk merayakan hari kelahiran Princess yang penuh pesona, kebaikan, dan senyuman manis.
                </p>
              </div>

              {/* Start CTA Button */}
              <button
                onClick={handleStartStory}
                className="w-full py-3.5 bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 hover:from-rose-600 hover:to-pink-700 text-white font-bold rounded-full shadow-lg shadow-rose-200/80 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 text-sm sm:text-base cursor-pointer"
              >
                <span>Start a Story ✨</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* ================= STEP 1: UCAPAN & DOA (ROYAL WISHES) ================= */}
          {currentStep === 1 && (
            <div className="space-y-5 my-auto animate-in fade-in slide-in-from-right duration-400 max-w-sm">
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-rose-100/80 text-rose-800 text-xs font-semibold shadow-2xs">
                <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-300" />
                <span>Doa & Harapan untuk Princess Desima</span>
              </div>

              {/* Floating Princess Castle / Fairytale Graphic */}
              <div className="relative mx-auto w-20 h-20 rounded-2xl bg-gradient-to-tr from-rose-100 via-amber-50 to-pink-100 border border-rose-200 flex items-center justify-center shadow-md animate-gentle-float">
                <Gift className="w-9 h-9 text-rose-500" />
                <span className="absolute -top-2 -right-2 text-base">👑</span>
              </div>

              <div className="space-y-3">
                <h3 className="text-xl sm:text-2xl font-bold font-playfair text-slate-800">
                  Selamat Ulang Tahun, <br />
                  <span className="text-rose-600">Desima Triana Grey Tindaon!</span>
                </h3>

                {/* Sincere Wishes List - Justified, no bold, no colon */}
                <div className="bg-white/85 border border-rose-100 rounded-2xl p-4 sm:p-5 text-xs sm:text-sm text-slate-700 space-y-3 font-serif shadow-sm">
                  <p className="flex items-start gap-2.5 text-justify">
                    <span className="text-rose-500 text-base leading-none shrink-0 pt-0.5">🌸</span>
                    <span className="leading-relaxed">Semoga panjang umur, diberikan usia yang penuh berkah, keselamatan, dan kebermanfaatan bagi orang lain di setiap langkahnya.</span>
                  </p>
                  <p className="flex items-start gap-2.5 text-justify">
                    <span className="text-amber-500 text-base leading-none shrink-0 pt-0.5">✨</span>
                    <span className="leading-relaxed">Senantiasa diberikan kesehatan, kekuatan, hati yang tenang, dan pikiran yang selalu damai ya, Des.</span>
                  </p>
                  <p className="flex items-start gap-2.5 text-justify">
                    <span className="text-pink-500 text-base leading-none shrink-0 pt-0.5">💖</span>
                    <span className="leading-relaxed">Semoga setiap harimu selalu dipenuhi tawa, bahagia, cinta, dan orang-orang baik yang menyayangimu dengan tulus.</span>
                  </p>
                  <p className="flex items-start gap-2.5 text-justify">
                    <span className="text-emerald-500 text-base leading-none shrink-0 pt-0.5">🌟</span>
                    <span className="leading-relaxed">Semoga impian dan rencana besar Desima dibuka jalannya seluas-luasnya dan bisa cepat terwujud.</span>
                  </p>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-rose-700 font-medium italic text-center px-2">
                "Tetaplah menjadi Desima yang ceria, tangguh, dan selalu membawa kebaikan!"
              </p>
            </div>
          )}

          {/* ================= STEP 2: TIUP LILIN KUE ULANG TAHUN ================= */}
          {currentStep === 2 && (
            <div className="space-y-4 my-auto animate-in fade-in slide-in-from-right duration-400 max-w-sm">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100/70 text-amber-800 text-xs font-semibold">
                <Cake className="w-3.5 h-3.5 text-amber-600" />
                <span>Kue Ulang Tahun Princess</span>
              </div>

              <h3 className="text-xl sm:text-2xl font-bold font-playfair text-slate-800">
                Tiup Lilin & Buat Harapan
              </h3>
              <p className="text-xs text-slate-500">
                Pikirkan doa dan harapan terindahmu dalam hati, lalu sentuh kuenya untuk meniup lilin ya, Des!
              </p>

              {/* Interactive SVG Cake with Princess Figurine Topper */}
              <div
                onClick={handleBlowCandle}
                className="relative mx-auto cursor-pointer p-4 rounded-3xl bg-gradient-to-b from-rose-50/60 via-pink-50/40 to-amber-50/40 border border-rose-200/90 shadow-lg hover:scale-102 transition-transform select-none"
                title="Sentuh untuk meniup lilin"
              >
                <svg viewBox="0 0 280 270" className="w-60 sm:w-68 h-auto mx-auto filter drop-shadow">
                  {/* Plate / Cake Stand */}
                  <ellipse cx="140" cy="254" rx="112" ry="12" fill="#e2e8f0" />
                  <ellipse cx="140" cy="251" rx="98" ry="9" fill="#cbd5e1" />

                  {/* Tier 1 (Bottom Tier) */}
                  <rect x="52" y="185" width="176" height="64" rx="12" fill="#fed7aa" />
                  <path
                    d="M 52 202 Q 74 217 96 202 Q 118 217 140 202 Q 162 217 184 202 Q 206 217 228 202 L 228 185 L 52 185 Z"
                    fill="#fb7185"
                  />
                  {/* Rose & pearl accents on bottom tier */}
                  <circle cx="75" cy="228" r="4.5" fill="#f43f5e" />
                  <circle cx="107" cy="228" r="4" fill="#fbbf24" />
                  <circle cx="140" cy="228" r="5" fill="#f43f5e" />
                  <circle cx="173" cy="228" r="4" fill="#fbbf24" />
                  <circle cx="205" cy="228" r="4.5" fill="#f43f5e" />

                  {/* Tier 2 (Top Tier) */}
                  <rect x="80" y="130" width="120" height="58" rx="10" fill="#fbcfe8" />
                  <path
                    d="M 80 144 Q 100 157 120 144 Q 140 157 160 144 Q 180 157 200 144 L 200 130 L 80 130 Z"
                    fill="#f472b6"
                  />
                  {/* Pearls on top tier */}
                  <circle cx="100" cy="165" r="3.5" fill="#fb7185" />
                  <circle cx="120" cy="165" r="3" fill="#fbbf24" />
                  <circle cx="140" cy="165" r="4" fill="#fb7185" />
                  <circle cx="160" cy="165" r="3" fill="#fbbf24" />
                  <circle cx="180" cy="165" r="3.5" fill="#fb7185" />

                  {/* Figurine Pedestal on Top of Cake */}
                  <ellipse cx="140" cy="130" rx="30" ry="6" fill="#fef08a" stroke="#d97706" strokeWidth="0.8" />
                  <rect x="134" y="123" width="12" height="7" fill="#fbbf24" rx="1" />
                  <ellipse cx="140" cy="123" rx="22" ry="4.5" fill="#fde047" stroke="#d97706" strokeWidth="0.8" />

                  {/* ================= PRINCESS FIGURINE (FIGURA PRINCESS) ================= */}
                  <g className="filter drop-shadow-sm">
                    {/* Princess Flowing Hair (Back) */}
                    <path
                      d="M 132 46 C 120 48 116 70 120 88 C 122 92 125 90 125 86 C 122 72 125 54 133 46 Z"
                      fill="#b45309"
                    />
                    <path
                      d="M 148 46 C 160 48 164 70 160 88 C 158 92 155 90 155 86 C 158 72 155 54 147 46 Z"
                      fill="#b45309"
                    />

                    {/* Princess Ballgown Skirt */}
                    <path
                      d="M 133 76 C 130 88 114 110 118 122 C 124 125 156 125 162 122 C 166 110 150 88 147 76 Z"
                      fill="#f43f5e"
                    />
                    {/* Skirt Central Pastel Ruffle / Drape */}
                    <path
                      d="M 135 78 C 133 88 124 108 129 120 C 136 122 144 122 151 120 C 156 108 147 88 145 78 Z"
                      fill="#fda4af"
                    />
                    {/* Golden Gown Hem & Sparkle accents */}
                    <path
                      d="M 119 122 Q 140 126 161 122"
                      stroke="#fbbf24"
                      strokeWidth="1.5"
                      fill="none"
                    />
                    <circle cx="140" cy="100" r="1.5" fill="#fef08a" />
                    <circle cx="134" cy="110" r="1.2" fill="#fef08a" />
                    <circle cx="146" cy="110" r="1.2" fill="#fef08a" />

                    {/* Bodice */}
                    <path
                      d="M 133 62 C 133 57 147 57 147 62 L 145 77 L 135 77 Z"
                      fill="#fb7185"
                    />
                    <circle cx="140" cy="69" r="1.8" fill="#fbbf24" stroke="#d97706" strokeWidth="0.5" />

                    {/* Puff Sleeves */}
                    <ellipse cx="131" cy="64" rx="4" ry="3.5" fill="#fbcfe8" />
                    <ellipse cx="149" cy="64" rx="4" ry="3.5" fill="#fbcfe8" />

                    {/* Slender Royal Arms */}
                    <path
                      d="M 131 65 Q 125 74 134 76"
                      stroke="#fde68a"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      fill="none"
                    />
                    <path
                      d="M 149 65 Q 155 74 146 76"
                      stroke="#fde68a"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      fill="none"
                    />

                    {/* Neck */}
                    <rect x="138" y="54" width="4" height="4" fill="#fde68a" />

                    {/* Head & Smiling Face */}
                    <circle cx="140" cy="48" r="8.5" fill="#fef3c7" stroke="#fde68a" strokeWidth="0.5" />
                    {/* Blushing cheeks */}
                    <circle cx="135" cy="50" r="1.6" fill="#fda4af" opacity="0.8" />
                    <circle cx="145" cy="50" r="1.6" fill="#fda4af" opacity="0.8" />
                    {/* Eyes */}
                    <path d="M 134 47 Q 136 45 138 47" stroke="#831843" strokeWidth="1" strokeLinecap="round" fill="none" />
                    <path d="M 142 47 Q 144 45 146 47" stroke="#831843" strokeWidth="1" strokeLinecap="round" fill="none" />
                    {/* Smile */}
                    <path d="M 138.5 51 Q 140 53.5 141.5 51" stroke="#e11d48" strokeWidth="1" strokeLinecap="round" fill="none" />

                    {/* Princess Crown Front Hair Bangs */}
                    <path
                      d="M 131 46 C 135 41 145 41 149 46 C 147 43 143 43 140 45 C 137 43 133 43 131 46 Z"
                      fill="#92400e"
                    />

                    {/* Golden Princess Tiara / Crown */}
                    <path
                      d="M 133 40 L 136 32 L 140 36 L 144 32 L 147 40 Z"
                      fill="#fbbf24"
                      stroke="#b45309"
                      strokeWidth="0.8"
                    />
                    <circle cx="140" cy="36" r="1.2" fill="#ec4899" />
                    <circle cx="136" cy="32" r="0.9" fill="#38bdf8" />
                    <circle cx="144" cy="32" r="0.9" fill="#38bdf8" />

                    {/* Magic Sparkles around Figurine */}
                    <text x="112" y="60" fontSize="12" className="animate-pulse select-none">✨</text>
                    <text x="156" y="60" fontSize="12" className="animate-pulse select-none" style={{ animationDelay: '0.4s' }}>✨</text>
                  </g>

                  {/* ================= BIRTHDAY CANDLES FLANKING THE PRINCESS FIGURINE ================= */}
                  {/* Left Candle */}
                  <rect x="94" y="90" width="6" height="42" rx="2" fill="#fef08a" stroke="#ca8a04" strokeWidth="0.8" />
                  <line x1="97" y1="90" x2="97" y2="83" stroke="#475569" strokeWidth="1.2" />

                  {/* Right Candle */}
                  <rect x="180" y="90" width="6" height="42" rx="2" fill="#fed7aa" stroke="#ea580c" strokeWidth="0.8" />
                  <line x1="183" y1="90" x2="183" y2="83" stroke="#475569" strokeWidth="1.2" />

                  {/* Animated Flames or Smoke */}
                  {!cakeBlown ? (
                    <>
                      {/* Left Flame */}
                      <g className="animate-pulse" style={{ transformOrigin: '97px 78px' }}>
                        <path d="M 97 68 C 103 75 102 83 97 84 C 92 83 91 75 97 68 Z" fill="#f59e0b" />
                        <circle cx="97" cy="78" r="2.5" fill="#fef08a" />
                      </g>
                      {/* Right Flame */}
                      <g className="animate-pulse" style={{ animationDelay: '0.3s', transformOrigin: '183px 78px' }}>
                        <path d="M 183 68 C 189 75 188 83 183 84 C 178 83 177 75 183 68 Z" fill="#f59e0b" />
                        <circle cx="183" cy="78" r="2.5" fill="#fef08a" />
                      </g>
                    </>
                  ) : (
                    /* Smoke trails when candles blown */
                    <g className="text-slate-400 opacity-70">
                      <path d="M 97 80 Q 91 70 101 62 Q 105 54 97 46" stroke="#94a3b8" strokeWidth="1.6" fill="none" strokeDasharray="2,2" />
                      <path d="M 183 80 Q 177 70 187 62 Q 191 54 183 46" stroke="#94a3b8" strokeWidth="1.6" fill="none" strokeDasharray="2,2" />
                      {/* Celebration hearts popping around the princess figurine */}
                      <text x="105" y="42" fontSize="11" className="animate-bounce">💖</text>
                      <text x="162" y="42" fontSize="11" className="animate-bounce" style={{ animationDelay: '0.2s' }}>🌸</text>
                    </g>
                  )}
                </svg>

                {/* Blow Action Badge */}
                {!cakeBlown ? (
                  <div className="mt-2 inline-flex items-center gap-1.5 px-4 py-1.5 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-full text-xs font-semibold shadow-sm animate-pulse">
                    <Flame className="w-3.5 h-3.5 text-amber-200" />
                    <span>Sentuh untuk Tiup Lilin! 🎂</span>
                  </div>
                ) : (
                  <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-semibold">
                    <span>✨ Lilin Berhasil Ditiup!</span>
                  </div>
                )}
              </div>

              {/* Wish Card */}
              {cakeBlown && (
                <div className="p-3.5 bg-white border border-amber-200 rounded-2xl shadow-sm space-y-1 animate-in zoom-in-95 duration-400">
                  <p className="font-playfair text-sm sm:text-base font-bold text-slate-800">
                    "Semoga Doa Tulus Desima Terkabul! ✨"
                  </p>
                  <p className="text-xs text-slate-600 font-serif">
                    Semoga tahun ini menjadi tahun terbaik yang penuh dengan kejutan manis dan kebahagiaan untukmu, Des.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* ================= STEP 3: PRINCESS GALLERY (HALAMAN 4) ================= */}
          {currentStep === 3 && (
            <div className="w-full my-auto animate-in fade-in slide-in-from-right duration-400">
              <StoryGallery />
            </div>
          )}

          {/* ================= STEP 4: PESAN BUAT DESIMA (HALAMAN 5) ================= */}
          {currentStep === 4 && (
            <div className="space-y-4 my-auto animate-in fade-in slide-in-from-right duration-400 max-w-sm">
              <h3 className="text-xl sm:text-2xl font-bold font-playfair text-slate-800">
                Pesan Buat Desima
              </h3>

              {/* Sealed Envelope / Unfolded Parchment */}
              <div className="bg-[#fffdfa] border-2 border-amber-200/90 rounded-2xl p-4 sm:p-5 shadow-lg relative text-left">
                {!letterOpen ? (
                  <div className="text-center py-6 space-y-4">
                    <button
                      onClick={() => {
                        royalAudio.playSparkle();
                        setLetterOpen(true);
                      }}
                      className="mx-auto w-16 h-16 rounded-full bg-gradient-to-tr from-rose-700 via-rose-600 to-rose-500 border-4 border-amber-200 shadow-xl flex items-center justify-center cursor-pointer hover:scale-110 active:scale-95 transition-transform"
                    >
                      <span className="font-cinzel text-amber-200 font-extrabold text-2xl">D</span>
                    </button>
                    <div>
                      <p className="font-playfair font-bold text-slate-800 text-base">
                        Pesan Buat Desima
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        Sentuh segel di atas untuk membuka dan membaca pesan personal ini.
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        royalAudio.playSparkle();
                        setLetterOpen(true);
                      }}
                      className="px-4 py-2 bg-rose-50 text-rose-800 border border-rose-200 rounded-full text-xs font-semibold hover:bg-rose-100 transition-colors cursor-pointer"
                    >
                      Buka Pesan 💌
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3 animate-in fade-in duration-300">
                    <div className="border-b border-amber-200/60 pb-2">
                      <span className="font-vibes text-2xl text-rose-600">Dear Desima,</span>
                    </div>

                    <div className="max-h-64 overflow-y-auto pr-1 text-xs sm:text-[13px] font-serif text-slate-700 leading-relaxed space-y-2.5">
                      <p className="text-left">
                        <strong className="text-rose-900">Selamat ulang tahun ya, Desima! 👑✨</strong>
                      </p>
                      <p className="text-justify">
                        Hari ini adalah hari yang sangat istimewa untukmu, <strong>Desima Triana Grey Tindaon</strong>. Terima kasih sudah selalu menjadi teman yang begitu berharga dan berhati hangat.
                      </p>
                      <p className="text-justify">
                        <em>Des</em>, senyummu selalu punya energi ajaib yang sanggup menceriakan suasana. Tetaplah jadi sosok yang ceria, ramah, dan tangguh!
                      </p>
                      <p className="text-justify">
                        Semoga panjang umur, sehat selalu, bahagia selalu, dan setiap doa baikmu segera terwujud. Happy Birthday, Princess Desima! 💖🎂
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ================= STEP 5: BALAS PESAN KE WHATSAPP (HALAMAN 6) ================= */}
          {currentStep === 5 && (
            <div className="space-y-4 my-auto animate-in fade-in slide-in-from-right duration-400 max-w-sm w-full">
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                Desima bisa langsung mengirimkan pesan balasan ke WhatsApp
              </p>

              {/* Message Box */}
              <div className="space-y-2 text-left bg-white border border-emerald-200/90 rounded-2xl p-3.5 shadow-sm">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <label htmlFor="wa-text" className="font-semibold text-slate-700 text-[11px]">
                    Isi Pesan Balasan:
                  </label>
                  <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                    <MessageCircle className="w-3 h-3 text-emerald-600 fill-emerald-600/30" />
                    WhatsApp
                  </span>
                </div>

                <textarea
                  id="wa-text"
                  rows={3}
                  value={waMessage}
                  onChange={(e) => setWaMessage(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-400 text-slate-800"
                />
              </div>

              {/* Big Direct WhatsApp Button */}
              <button
                onClick={handleSendWA}
                className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold rounded-full shadow-lg shadow-emerald-200/80 hover:scale-102 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer text-sm sm:text-base"
              >
                <MessageCircle className="w-5 h-5 fill-white text-emerald-600" />
                <span>Kirim ke WhatsApp Sekarang 💬</span>
                <Send className="w-4 h-4 ml-0.5 opacity-80" />
              </button>

              {/* Replay Option */}
              <div className="pt-2">
                <button
                  onClick={() => {
                    royalAudio.playSparkle();
                    setCurrentStep(0);
                  }}
                  className="text-xs text-rose-700 hover:text-rose-900 flex items-center justify-center gap-1.5 mx-auto font-medium transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Ulangi Kisah dari Awal ↺</span>
                </button>
              </div>
            </div>
          )}
        </main>

        {/* Persistent Bottom Navigation Controls */}
        <footer className="px-4 py-3 bg-white/90 border-t border-rose-100/90 backdrop-blur-md flex items-center justify-between shrink-0">
          {/* Previous Button */}
          <button
            onClick={handlePrevStep}
            disabled={currentStep === 0}
            className={`flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
              currentStep === 0
                ? 'opacity-30 cursor-not-allowed text-slate-400'
                : 'text-slate-700 hover:bg-rose-50 hover:text-rose-800 active:scale-95 cursor-pointer'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Kembali</span>
          </button>

          {/* Quick Step Indicators */}
          <span className="text-[11px] font-cinzel font-bold text-amber-800">
            {CHAPTERS[currentStep].title}
          </span>

          {/* Next Button */}
          {currentStep < CHAPTERS.length - 1 ? (
            <button
              onClick={handleNextStep}
              className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white rounded-xl text-xs font-bold shadow-md shadow-rose-200/70 hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              <span>Lanjut</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleSendWA}
              className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-200 hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              <span>Kirim WA</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          )}
        </footer>
      </div>
    </div>
  );
}

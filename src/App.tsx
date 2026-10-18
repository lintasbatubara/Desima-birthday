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
  Heart,
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
  Check,
  Copy,
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
  { id: 3, title: 'Galeri Putri', icon: Camera },
  { id: 4, title: 'Surat Manis', icon: Mail },
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
  const [copiedLetter, setCopiedLetter] = useState(false);

  // WhatsApp reply state
  const [waNumber, setWaNumber] = useState('');
  const [waMessage, setWaMessage] = useState(
    'Halo! Makasih banyak yaa atas web ucapan ulang tahunnya, manis banget! Desima terharu dan bahagia banget hari ini 👑💖'
  );
  const [copiedWA, setCopiedWA] = useState(false);

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

  const letterBody = `Untuk Sang Putri, Desima Triana Grey Tindaon...

Selamat ulang tahun ya, Desima! 👑✨

Hari ini adalah hari yang sangat istimewa, karena di hari inilah dunia menyambut kehadiran sosok perempuan luar biasa yang bernama Desima Triana Grey Tindaon.

Mungkin hari-hari berlalu begitu cepat dengan segala kesibukan masing-masing, tapi di hari ulang tahunmu ini, aku ingin kamu tahu betapa berharga dan berartinya dirimu. Des, senyummu itu punya keajaiban tersendiri—selalu menularkan keceriaan dan bikin suasana di sekitarmu jadi jauh lebih hangat dan hidup.

Desima bukan cuma perempuan yang cantik dan anggun seperti putri di cerita dongeng, tapi kamu punya hati yang begitu tulus, telinga yang mau mendengar, dan jiwa tangguh yang tidak mudah menyerah. Terima kasih ya sudah menjadi teman yang begitu baik dan berharga bagi kami.

Di usia yang baru ini, doa tulus selalu kupanjatkan untukmu:
Semoga Desima panjang umur, senantiasa diberikan kesehatan yang sempurna, rezeki yang melimpah dan berkah, serta kebahagiaan hati tanpa akhir. Semoga setiap impian, cita-cita, dan target masa depanmu dimudahkan jalannya oleh Tuhan.

Tetaplah jadi Des yang selalu ceria, ramah, dan bersinar. Kamu terlahir untuk mengenakan mahkota kebaikan ini, Princess Desima!

Selamat Ulang Tahun, Des! 💖🎂`;

  const copyLetterText = () => {
    navigator.clipboard.writeText(letterBody);
    setCopiedLetter(true);
    setTimeout(() => setCopiedLetter(false), 2000);
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-[#fbf4f2] via-[#fff5f6] to-[#fbf1f4] text-slate-800 flex flex-col items-center justify-center p-0 sm:p-4 select-none overflow-x-hidden">
      {/* Background Animated Tangled Sky Lanterns */}
      <FloatingLanterns />

      {/* Background Animated Flower Petals */}
      <PetalsCanvas interactive={false} />

      {/* Floating Tangled Music Button (Top-Right) */}
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
                  A Royal Fairytale Celebration
                </span>
                <h1 className="font-vibes text-4xl sm:text-5xl text-rose-600 leading-tight">
                  Happy Birthday
                </h1>
                <h2 className="font-playfair text-2xl sm:text-3xl font-bold text-slate-800 tracking-tight">
                  Desima Triana Grey Tindaon
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 font-serif leading-relaxed px-2 pt-1">
                  Sebuah persembahan istimewa untuk merayakan hari kelahiran Tuan Putri yang penuh pesona, kebaikan, dan senyuman manis.
                </p>
              </div>

              {/* Tangled Music Callout */}
              <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-3 text-xs text-amber-900 flex items-center gap-2.5 text-left shadow-xs">
                <div className="w-8 h-8 rounded-full bg-amber-200/70 flex items-center justify-center shrink-0">
                  <Sparkles className="w-4 h-4 text-amber-700" />
                </div>
                <div>
                  <p className="font-semibold">Lagu Latar: Tangled - I See The Light</p>
                  <p className="text-[11px] text-amber-700">Sentuh tombol di bawah untuk memulai cerita & melodi piano romantis 🎵</p>
                </div>
              </div>

              {/* Start CTA Button */}
              <button
                onClick={handleStartStory}
                className="w-full py-3.5 bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 hover:from-rose-600 hover:to-pink-700 text-white font-bold rounded-full shadow-lg shadow-rose-200/80 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 text-sm sm:text-base cursor-pointer"
              >
                <span>Mulai Kisah Sang Putri ✨</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* ================= STEP 1: UCAPAN & DOA (ROYAL WISHES) ================= */}
          {currentStep === 1 && (
            <div className="space-y-5 my-auto animate-in fade-in slide-in-from-right duration-400 max-w-sm">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100/70 text-rose-800 text-xs font-semibold">
                <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-300" />
                <span>Doa Tulus Untuk Sang Putri</span>
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

                {/* Sincere Wishes List */}
                <div className="bg-white/80 border border-rose-100 rounded-2xl p-4 text-xs sm:text-sm text-slate-700 space-y-2.5 text-left font-serif leading-relaxed shadow-sm">
                  <p className="flex items-start gap-2">
                    <span className="text-rose-500 text-base leading-none">🌸</span>
                    <span><strong>Semoga Panjang Umur:</strong> Diberikan usia yang penuh berkah, keselamatan, dan kebermanfaatan dalam setiap tarikan napas.</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="text-amber-500 text-base leading-none">✨</span>
                    <span><strong>Sehat Selalu:</strong> Senantiasa dilimpahi fisik yang bugar, hati yang tenang, dan pikiran yang selalu damai, Des.</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="text-pink-500 text-base leading-none">💖</span>
                    <span><strong>Bahagia Selalu:</strong> Semoga setiap harimu dipenuhi tawa renyah, kehangatan cinta, dan orang-orang baik yang menyayangimu dengan tulus.</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="text-emerald-500 text-base leading-none">🌟</span>
                    <span><strong>Cita-cita Tercapai:</strong> Semoga semua impian besar dan rencana masa depan Desima dibuka jalannya dengan seluas-luasnya.</span>
                  </p>
                </div>
              </div>

              <p className="text-xs text-rose-700 font-medium italic">
                "Tetaplah menjadi Des yang ceria, tangguh, dan selalu membawa kebaikan!"
              </p>
            </div>
          )}

          {/* ================= STEP 2: TIUP LILIN KUE ULANG TAHUN ================= */}
          {currentStep === 2 && (
            <div className="space-y-4 my-auto animate-in fade-in slide-in-from-right duration-400 max-w-sm">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100/70 text-amber-800 text-xs font-semibold">
                <Cake className="w-3.5 h-3.5 text-amber-600" />
                <span>Kue Ulang Tahun Sang Putri</span>
              </div>

              <h3 className="text-xl sm:text-2xl font-bold font-playfair text-slate-800">
                Tiup Lilin & Buat Harapan
              </h3>
              <p className="text-xs text-slate-500">
                Pikirkan doa dan harapan terindahmu dalam hati, lalu sentuh kuenya untuk meniup lilin ya, Des!
              </p>

              {/* Interactive SVG Cake */}
              <div
                onClick={handleBlowCandle}
                className="relative mx-auto cursor-pointer p-4 rounded-3xl bg-gradient-to-b from-rose-50/50 to-amber-50/30 border border-rose-200/80 shadow-md hover:scale-102 transition-transform select-none"
                title="Sentuh untuk meniup lilin"
              >
                <svg viewBox="0 0 280 220" className="w-56 sm:w-64 h-auto mx-auto filter drop-shadow">
                  {/* Plate */}
                  <ellipse cx="140" cy="200" rx="100" ry="14" fill="#e2e8f0" />
                  <ellipse cx="140" cy="198" rx="88" ry="10" fill="#cbd5e1" />

                  {/* Bottom tier */}
                  <rect x="65" y="140" width="150" height="55" rx="10" fill="#fed7aa" />
                  <path d="M 65 155 Q 85 168 105 155 Q 125 168 145 155 Q 165 168 185 155 Q 200 168 215 155 L 215 140 L 65 140 Z" fill="#fb7185" />

                  {/* Top tier */}
                  <rect x="90" y="95" width="100" height="48" rx="8" fill="#fbcfe8" />
                  <path d="M 90 108 Q 115 120 140 108 Q 165 120 190 108 L 190 95 L 90 95 Z" fill="#f43f5e" />

                  {/* Tiny Crown Topper */}
                  <path d="M 126 93 L 132 83 L 140 88 L 148 83 L 154 93 Z" fill="#fbbf24" stroke="#b45309" strokeWidth="1" />

                  {/* Center Candle */}
                  <rect x="137" y="58" width="6" height="36" rx="2" fill="#fef08a" stroke="#ca8a04" strokeWidth="0.8" />
                  <line x1="140" y1="58" x2="140" y2="52" stroke="#475569" strokeWidth="1.2" />

                  {/* Animated Flame or Smoke */}
                  {!cakeBlown ? (
                    <g className="animate-pulse" style={{ transformOrigin: '140px 48px' }}>
                      <path d="M 140 38 C 146 45 145 53 140 54 C 135 53 134 45 140 38 Z" fill="#f59e0b" />
                      <circle cx="140" cy="48" r="2.5" fill="#fef08a" />
                    </g>
                  ) : (
                    <g className="text-slate-400 opacity-70">
                      <path d="M 140 50 Q 134 40 144 32 Q 148 24 140 16" stroke="#94a3b8" strokeWidth="1.8" fill="none" strokeDasharray="2,2" />
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

          {/* ================= STEP 3: GALERI FOTO SANG PUTRI ================= */}
          {currentStep === 3 && (
            <div className="w-full my-auto animate-in fade-in slide-in-from-right duration-400">
              {/* Pure Photo Showcase */}
              <StoryGallery />
            </div>
          )}

          {/* ================= STEP 4: SURAT PERSONAL YANG MANIS ================= */}
          {currentStep === 4 && (
            <div className="space-y-4 my-auto animate-in fade-in slide-in-from-right duration-400 max-w-sm">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100/70 text-rose-800 text-xs font-semibold">
                <Mail className="w-3.5 h-3.5 text-rose-500" />
                <span>Surat Kerajaan dari Sahabat</span>
              </div>

              <h3 className="text-xl sm:text-2xl font-bold font-playfair text-slate-800">
                Sepucuk Surat untuk Des
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
                        Surat Tertutup Segel Lilin Mahkota
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        Sentuh segel di atas untuk membuka dan membaca pesan personal yang manis ini.
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        royalAudio.playSparkle();
                        setLetterOpen(true);
                      }}
                      className="px-4 py-2 bg-rose-50 text-rose-800 border border-rose-200 rounded-full text-xs font-semibold hover:bg-rose-100 transition-colors cursor-pointer"
                    >
                      Buka Surat 💌
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3 animate-in fade-in duration-300">
                    <div className="flex items-center justify-between border-b border-amber-200/60 pb-2">
                      <span className="font-vibes text-2xl text-rose-600">Dear Desima,</span>
                      <button
                        onClick={copyLetterText}
                        className="text-[11px] text-slate-500 hover:text-slate-800 flex items-center gap-1 bg-white border border-slate-200 px-2.5 py-1 rounded-md"
                      >
                        {copiedLetter ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-600" />
                            <span className="text-emerald-700">Tersalin</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Salin</span>
                          </>
                        )}
                      </button>
                    </div>

                    <div className="max-h-64 overflow-y-auto pr-1 text-xs sm:text-[13px] font-serif text-slate-700 leading-relaxed space-y-2.5">
                      <p>
                        <strong className="text-rose-900">Selamat ulang tahun ya, Desima! 👑✨</strong>
                      </p>
                      <p>
                        Hari ini adalah hari yang sangat istimewa untukmu, <strong>Desima Triana Grey Tindaon</strong>. Terima kasih sudah selalu menjadi teman yang begitu berharga dan berhati hangat.
                      </p>
                      <p>
                        <em>Des</em>, senyummu selalu punya energi ajaib yang sanggup menceriakan suasana. Tetaplah jadi sosok yang ceria, ramah, dan tangguh!
                      </p>
                      <p>
                        Semoga panjang umur, sehat selalu, bahagia selalu, dan setiap doa baikmu segera terwujud. Happy Birthday, Princess Desima! 💖🎂
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ================= STEP 5: BALAS PESAN KE WHATSAPP (FINAL) ================= */}
          {currentStep === 5 && (
            <div className="space-y-4 my-auto animate-in fade-in slide-in-from-right duration-400 max-w-sm w-full">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold">
                <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                <span>Kirim Balasan ke WhatsApp</span>
              </div>

              <h3 className="text-xl sm:text-2xl font-bold font-playfair text-slate-800">
                Kirim Balasan Manis
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Desima bisa langsung mengirimkan ucapan terima kasih atau balasan pesan ini langsung ke WhatsApp pembuat web!
              </p>

              {/* Message Box */}
              <div className="space-y-2 text-left bg-white border border-emerald-200/90 rounded-2xl p-3.5 shadow-sm">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <label htmlFor="wa-text" className="font-semibold text-slate-700 text-[11px]">
                    Isi Pesan Balasan Desima:
                  </label>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(waMessage);
                      setCopiedWA(true);
                      setTimeout(() => setCopiedWA(false), 2000);
                    }}
                    className="text-emerald-700 hover:text-emerald-800 flex items-center gap-1 text-[11px] font-medium"
                  >
                    {copiedWA ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedWA ? 'Tersalin' : 'Salin'}</span>
                  </button>
                </div>

                <textarea
                  id="wa-text"
                  rows={3}
                  value={waMessage}
                  onChange={(e) => setWaMessage(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-400 text-slate-800"
                />

                {/* Optional Phone Number */}
                <div className="pt-1">
                  <label htmlFor="wa-target-number" className="block text-[11px] text-slate-500">
                    Nomor WhatsApp Tujuan (opsional):
                  </label>
                  <input
                    id="wa-target-number"
                    type="text"
                    placeholder="Contoh: 08123456789 atau kosongkan"
                    value={waNumber}
                    onChange={(e) => setWaNumber(e.target.value)}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-400 text-slate-800"
                  />
                </div>
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

        {/* Persistent Bottom Navigation Controls (Bukan memanjang ke bawah) */}
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

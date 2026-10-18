import { useState, useRef } from 'react';
import {
  Crown,
  X,
  ChevronLeft,
  ChevronRight,
  Upload,
  Heart,
  Sparkles,
  Maximize2,
  Trash2,
  Share2,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { royalAudio } from '../utils/audioSynthesizer';

export interface PrincessPhoto {
  id: string;
  url: string;
  title: string;
  caption: string;
  tag: string;
  isCustom?: boolean;
}

// Initial curated aesthetic photos for Desima with sweet personal captions
const DEFAULT_PHOTOS: PrincessPhoto[] = [
  {
    id: 'photo-1',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=900&q=80',
    title: 'Senyuman Sang Princess',
    caption: 'Des, senyumanmu selalu punya energi ajaib yang sanggup menerangi ruangan tergelap sekalipun. Tetaplah tersenyum manis seperti ini ya!',
    tag: 'Momen Paling Manis',
  },
  {
    id: 'photo-2',
    url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=900&q=80',
    title: 'Anggun & Penuh Kebaikan',
    caption: 'Desima bukan hanya punya paras yang memesona, tapi juga hati yang tulus dan hangat bagi siapa saja yang mengenalnya.',
    tag: 'Keanggunan Desima',
  },
  {
    id: 'photo-3',
    url: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80',
    title: 'Langkah Penuh Semangat',
    caption: 'Tiap pencapaian dan perjuangan yang Desima lalui membuktikan bahwa Des adalah sosok wanita kuat berjiwa bangsawan sejati.',
    tag: 'Jiwa Tangguh',
  },
  {
    id: 'photo-4',
    url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=900&q=80',
    title: 'Tawa Lepas yang Menular',
    caption: 'Momen-momen saat Des tertawa lepas adalah memori yang paling berharga. Semoga tahun ini diisi dengan ratusan hari penuh tawa renyah!',
    tag: 'Bahagia Selalu',
  },
  {
    id: 'photo-5',
    url: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=900&q=80',
    title: 'Cahaya Impian Masa Depan',
    caption: 'Untuk Desima Triana Grey Tindaon: teruslah melangkah mengejar impian tertinggimu. Mahkota masa depan cerah sudah menantimu.',
    tag: 'Doa & Harapan',
  },
];

interface CrownGalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CrownGalleryModal({ isOpen, onClose }: CrownGalleryModalProps) {
  const [photos, setPhotos] = useState<PrincessPhoto[]>(() => {
    try {
      const saved = localStorage.getItem('desima_princess_photos');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // fallback
    }
    return DEFAULT_PHOTOS;
  });

  const [activeIndex, setActiveIndex] = useState(0);
  const [isLightbox, setIsLightbox] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [likedPhotos, setLikedPhotos] = useState<Record<string, boolean>>({});

  if (!isOpen) return null;

  const currentPhoto = photos[activeIndex] || photos[0];

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % photos.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + photos.length) % photos.length);
  };

  const triggerSparkleExplosion = () => {
    royalAudio.playSparkle();
    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#f472b6', '#fb7185', '#fbbf24', '#fbcfe8'],
    });
  };

  const handleToggleLike = (id: string) => {
    setLikedPhotos((prev) => {
      const next = !prev[id];
      if (next) triggerSparkleExplosion();
      return { ...prev, [id]: next };
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const newPhoto: PrincessPhoto = {
        id: `custom-${Date.now()}`,
        url: result,
        title: 'Foto Kenangan Desima',
        caption: 'Momen berharga sang putri yang tak terlupakan. Des selalu tampak bersinar di foto ini!',
        tag: 'Foto Pribadi Desima',
        isCustom: true,
      };

      const updated = [newPhoto, ...photos];
      setPhotos(updated);
      setActiveIndex(0);
      try {
        localStorage.setItem('desima_princess_photos', JSON.stringify(updated));
      } catch {
        // storage limit ignore
      }
      triggerSparkleExplosion();
    };
    reader.readAsDataURL(file);
  };

  const handleDeletePhoto = (id: string) => {
    const updated = photos.filter((p) => p.id !== id);
    setPhotos(updated);
    setActiveIndex(0);
    try {
      localStorage.setItem('desima_princess_photos', JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const handleResetDefault = () => {
    setPhotos(DEFAULT_PHOTOS);
    try {
      localStorage.removeItem('desima_princess_photos');
    } catch {
      // ignore
    }
    setActiveIndex(0);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-slate-950/75 backdrop-blur-md animate-in fade-in duration-300">
      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileUpload}
        className="hidden"
      />

      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col bg-[#fffaf8] border border-amber-200/90 rounded-2xl shadow-2xl overflow-hidden">
        {/* Ornate Top Bar */}
        <div className="relative px-6 py-4 bg-gradient-to-r from-amber-50 via-rose-50 to-amber-50 border-b border-rose-100 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-600 shadow-inner">
              <Crown className="w-5 h-5 fill-amber-300 text-amber-600 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-cinzel text-xs tracking-widest uppercase text-amber-800 font-bold">
                  The Royal Collection
                </span>
                <span className="text-amber-400">✦</span>
                <span className="text-xs text-rose-600 font-medium">Galeri Mahkota</span>
              </div>
              <h2 className="text-lg md:text-xl font-bold font-playfair text-slate-800 tracking-tight">
                Galeri Sang Putri Desima
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-800 bg-white border border-rose-200 rounded-lg hover:bg-rose-50 hover:border-rose-300 transition-colors shadow-sm"
              title="Unggah Foto Asli Desima"
            >
              <Upload className="w-3.5 h-3.5 text-rose-500" />
              <span>Tambah Foto</span>
            </button>

            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-rose-100/70 transition-colors"
              aria-label="Tutup Galeri"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
          {/* Main Stage: Featured Crowned Photo Frame */}
          <div className="relative mx-auto max-w-2xl bg-white border-4 border-amber-200/90 rounded-2xl shadow-xl p-3 md:p-5">
            {/* Top Ornate Crown Header */}
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-4 py-1.5 bg-gradient-to-r from-amber-400 via-amber-200 to-amber-400 border border-amber-500 text-amber-950 rounded-full shadow-md text-xs font-bold font-cinzel">
              <Crown className="w-4 h-4 fill-amber-500 text-amber-800" />
              <span>Princess Desima</span>
            </div>

            {/* Photo Viewport */}
            <div className="relative w-full aspect-[4/3] sm:aspect-[16/10] bg-rose-50 rounded-xl overflow-hidden border border-rose-100 group">
              <img
                src={currentPhoto.url}
                alt={currentPhoto.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                onError={(e) => {
                  // Fallback beautiful princess placeholder
                  (e.target as HTMLImageElement).src =
                    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=900&q=80';
                }}
              />

              {/* Navigation Arrows */}
              <button
                onClick={handlePrev}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/85 backdrop-blur-sm border border-rose-200 flex items-center justify-center text-rose-900 shadow-md hover:bg-white hover:scale-110 active:scale-95 transition-all opacity-85 group-hover:opacity-100"
                aria-label="Foto Sebelumnya"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <button
                onClick={handleNext}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/85 backdrop-blur-sm border border-rose-200 flex items-center justify-center text-rose-900 shadow-md hover:bg-white hover:scale-110 active:scale-95 transition-all opacity-85 group-hover:opacity-100"
                aria-label="Foto Selanjutnya"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              {/* Overlay Badges */}
              <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-medium text-rose-700 shadow-sm border border-rose-200 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>{currentPhoto.tag}</span>
              </div>

              {/* Photo Action Buttons */}
              <div className="absolute top-3 right-3 flex items-center gap-1.5">
                <button
                  onClick={() => handleToggleLike(currentPhoto.id)}
                  className={`w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-md border transition-all ${
                    likedPhotos[currentPhoto.id]
                      ? 'bg-rose-500 border-rose-600 text-white shadow-lg'
                      : 'bg-white/90 border-rose-200 text-rose-600 hover:bg-white'
                  }`}
                  title="Suka Foto Ini"
                >
                  <Heart
                    className={`w-4 h-4 ${
                      likedPhotos[currentPhoto.id] ? 'fill-white' : 'fill-none'
                    }`}
                  />
                </button>

                <button
                  onClick={() => setIsLightbox(!isLightbox)}
                  className="w-9 h-9 rounded-full bg-white/90 backdrop-blur-md border border-rose-200 text-slate-700 hover:bg-white flex items-center justify-center transition-all"
                  title="Perbesar Layar"
                >
                  <Maximize2 className="w-4 h-4" />
                </button>

                {currentPhoto.isCustom && (
                  <button
                    onClick={() => handleDeletePhoto(currentPhoto.id)}
                    className="w-9 h-9 rounded-full bg-white/90 backdrop-blur-md border border-rose-200 text-rose-600 hover:bg-rose-50 flex items-center justify-center transition-all"
                    title="Hapus Foto Kustom"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Photo Index Counter */}
              <div className="absolute bottom-3 right-3 bg-slate-900/70 backdrop-blur-sm text-white px-2.5 py-0.5 rounded-full text-xs font-mono">
                {activeIndex + 1} / {photos.length}
              </div>
            </div>

            {/* Captions Box */}
            <div className="mt-4 pt-3 border-t border-rose-100 text-center">
              <h3 className="text-xl font-bold font-playfair text-slate-800">
                {currentPhoto.title}
              </h3>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed max-w-xl mx-auto italic font-playfair">
                "{currentPhoto.caption}"
              </p>
              <div className="mt-3 flex items-center justify-center gap-2 text-xs text-amber-700">
                <Crown className="w-3.5 h-3.5 text-amber-500 fill-amber-300" />
                <span>Desima Triana Grey Tindaon — Sang Putri Hari Ini</span>
              </div>
            </div>
          </div>

          {/* Thumbnail Strip */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-500 px-1">
              <span>Pilih Momen Memori ({photos.length} Foto)</span>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="text-rose-600 hover:underline flex items-center gap-1 font-medium sm:hidden"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Tambah</span>
                </button>
                {photos.length !== DEFAULT_PHOTOS.length && (
                  <button
                    onClick={handleResetDefault}
                    className="text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    Reset Foto Default
                  </button>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-thin">
              {photos.map((item, idx) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveIndex(idx);
                    royalAudio.playSparkle();
                  }}
                  className={`relative shrink-0 w-20 h-20 md:w-24 md:h-24 rounded-xl overflow-hidden border-2 transition-all ${
                    activeIndex === idx
                      ? 'border-amber-400 ring-4 ring-amber-200/70 scale-105'
                      : 'border-rose-100 hover:border-rose-300 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img
                    src={item.url}
                    alt={item.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  {activeIndex === idx && (
                    <div className="absolute top-1 right-1 bg-amber-400 text-amber-950 rounded-full p-0.5">
                      <Crown className="w-3 h-3 fill-amber-950" />
                    </div>
                  )}
                </button>
              ))}

              {/* Add Photo Button in Strip */}
              <button
                onClick={() => fileInputRef.current?.click()}
                className="shrink-0 w-20 h-20 md:w-24 md:h-24 rounded-xl border-2 border-dashed border-rose-300 bg-rose-50/60 hover:bg-rose-100/60 flex flex-col items-center justify-center gap-1 text-rose-700 transition-all hover:scale-105"
                title="Unggah Foto Asli Desima"
              >
                <Upload className="w-5 h-5 text-rose-500" />
                <span className="text-[10px] font-semibold">Upload Foto</span>
              </button>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 bg-rose-50/60 border-t border-rose-100 flex flex-wrap items-center justify-between gap-3 text-xs text-rose-900">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500 fill-amber-300" />
            <span className="italic">
              "Mahkota terbaik seorang wanita terpancar dari kebaikan dan senyumannya."
            </span>
          </div>
          <button
            onClick={() => {
              triggerSparkleExplosion();
              onClose();
            }}
            className="px-4 py-1.5 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-medium rounded-lg shadow-sm transition-all active:scale-95"
          >
            Lanjut Menjelajah 👑
          </button>
        </div>
      </div>

      {/* Fullscreen Lightbox if active */}
      {isLightbox && (
        <div
          className="fixed inset-0 z-60 bg-black/95 flex flex-col items-center justify-center p-4 animate-in fade-in"
          onClick={() => setIsLightbox(false)}
        >
          <button
            onClick={() => setIsLightbox(false)}
            className="absolute top-4 right-4 text-white p-2 hover:bg-white/20 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          <img
            src={currentPhoto.url}
            alt={currentPhoto.title}
            className="max-h-[82vh] max-w-[90vw] object-contain rounded-lg border border-amber-300/40 shadow-2xl"
          />
          <p className="mt-4 text-white font-playfair text-lg text-center max-w-xl">
            {currentPhoto.caption}
          </p>
        </div>
      )}
    </div>
  );
}

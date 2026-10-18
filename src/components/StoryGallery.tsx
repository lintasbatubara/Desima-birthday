import { useState, useRef, useEffect } from 'react';
import { Crown, ChevronLeft, ChevronRight, Heart } from 'lucide-react';
import confetti from 'canvas-confetti';
import { royalAudio } from '../utils/audioSynthesizer';

export interface PhotoItem {
  id: number;
  url: string;
}

// 9 Curated Princess Photos
const INITIAL_PHOTOS: PhotoItem[] = [
  {
    id: 1,
    url: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 2,
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 3,
    url: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 4,
    url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 5,
    url: 'https://images.unsplash.com/photo-1502685104226-ee32379fefbe?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 6,
    url: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 7,
    url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 8,
    url: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 9,
    url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=900&q=80',
  },
];

export default function StoryGallery() {
  const [photos, setPhotos] = useState<PhotoItem[]>(() => {
    try {
      const saved = localStorage.getItem('desima_clean_photos_v1');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return INITIAL_PHOTOS;
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const [liked, setLiked] = useState<Record<number, boolean>>({});
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem('desima_clean_photos_v1', JSON.stringify(photos));
    } catch {
      // quota limit
    }
  }, [photos]);

  const currentPhoto = photos[currentIndex] || photos[0];

  const handleNext = () => {
    royalAudio.playSparkle();
    setCurrentIndex((prev) => (prev + 1) % photos.length);
  };

  const handlePrev = () => {
    royalAudio.playSparkle();
    setCurrentIndex((prev) => (prev - 1 + photos.length) % photos.length);
  };

  const handleLike = () => {
    const next = !liked[currentPhoto.id];
    setLiked((prev) => ({ ...prev, [currentPhoto.id]: next }));
    if (next) {
      royalAudio.playSparkle();
      confetti({
        particleCount: 30,
        spread: 50,
        origin: { y: 0.6 },
        colors: ['#f43f5e', '#ec4899', '#fbcfe8', '#fbbf24'],
      });
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    royalAudio.playSparkle();
    const updated = [...photos];

    Array.from(files).forEach((file, idx) => {
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result as string;
        const targetIdx = files.length === 1 ? currentIndex : (currentIndex + idx) % updated.length;
        if (updated[targetIdx]) {
          updated[targetIdx] = {
            ...updated[targetIdx],
            url: dataUrl,
          };
          setPhotos([...updated]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  return (
    <div className="w-full flex flex-col items-center select-none">
      {/* Hidden file input for quiet direct photo replacement on tap */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handlePhotoUpload}
        className="hidden"
      />

      {/* Floating Crown Topper */}
      <div className="relative -mb-4 z-10 flex items-center justify-center">
        <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-amber-300 via-amber-200 to-amber-400 border-2 border-white shadow-lg flex items-center justify-center animate-crown-pulse">
          <Crown className="w-6 h-6 text-amber-900 fill-amber-500 filter drop-shadow" />
        </div>
      </div>

      {/* Pure Regal Photo Frame (No captions, no filenames, no extra text) */}
      <div className="w-full max-w-xs sm:max-w-sm bg-white/95 backdrop-blur-md border-2 border-amber-200/90 rounded-3xl p-3 shadow-xl shadow-rose-100/60 relative group">
        <div
          onClick={() => fileInputRef.current?.click()}
          className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden bg-rose-50 border border-rose-100 shadow-inner cursor-pointer"
          title="Ketuk foto untuk mengganti dengan foto galeri"
        >
          <img
            src={currentPhoto.url}
            alt="Princess Desima Photo"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover transition-all duration-500 group-hover:scale-102"
          />

          {/* Like Heart Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleLike();
            }}
            className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md border transition-all ${
              liked[currentPhoto.id]
                ? 'bg-rose-500 border-rose-600 text-white shadow-md scale-110'
                : 'bg-white/80 border-rose-200 text-rose-500 hover:bg-white'
            }`}
            title="Suka Foto Ini"
          >
            <Heart
              className={`w-4 h-4 ${liked[currentPhoto.id] ? 'fill-white' : 'fill-none'}`}
            />
          </button>

          {/* Previous Arrow */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handlePrev();
            }}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/85 backdrop-blur-sm border border-rose-200 flex items-center justify-center text-rose-900 shadow-md hover:bg-white active:scale-90 transition-all"
            aria-label="Foto Sebelumnya"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Next Arrow */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleNext();
            }}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/85 backdrop-blur-sm border border-rose-200 flex items-center justify-center text-rose-900 shadow-md hover:bg-white active:scale-90 transition-all"
            aria-label="Foto Selanjutnya"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Clean Index Badge */}
          <div className="absolute bottom-2.5 right-2.5 bg-slate-900/60 backdrop-blur-xs text-white px-2 py-0.5 rounded-full text-[10px] font-mono">
            {currentIndex + 1} / {photos.length}
          </div>
        </div>
      </div>

      {/* Clean 9 Navigation Dots */}
      <div className="flex items-center gap-1.5 mt-3 py-1">
        {photos.map((_, idx) => (
          <button
            key={idx}
            onClick={() => {
              royalAudio.playSparkle();
              setCurrentIndex(idx);
            }}
            className={`transition-all rounded-full ${
              currentIndex === idx
                ? 'w-6 h-2 bg-gradient-to-r from-amber-400 to-rose-400'
                : 'w-2 h-2 bg-rose-200 hover:bg-rose-300'
            }`}
            title={`Foto ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

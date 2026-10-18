import { useState, useEffect } from 'react';
import {
  Crown,
  ChevronLeft,
  ChevronRight,
  Heart,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { royalAudio } from '../utils/audioSynthesizer';
import {
  GalleryPhoto,
  PRINCESS_CAPTIONS,
  getSavedGalleryPhotos,
} from '../utils/googleDrive';

// Default photos with the original captions preserved
const DEFAULT_LOCKED_PHOTOS: GalleryPhoto[] = [
  {
    id: 1,
    url: '/photos/photo-1.jpg',
    caption: PRINCESS_CAPTIONS[0],
    driveFileId: '1-QCZBhnM-LHSdPnU03GtJAZihqq-K9_R',
  },
  {
    id: 2,
    url: '/photos/photo-2.jpg',
    caption: PRINCESS_CAPTIONS[1],
    driveFileId: '1zvtTDd4aiN_543tDmuFSpYCN1mkQDSXn',
  },
  {
    id: 3,
    url: '/photos/photo-3.jpg',
    caption: PRINCESS_CAPTIONS[2],
    driveFileId: '1_pXebZt0XueWsgA5p4lbNteV6LH5Qu3U',
  },
  {
    id: 4,
    url: '/photos/photo-4.jpg',
    caption: PRINCESS_CAPTIONS[3],
    driveFileId: '1n2ggTUmVXDP63V0UfvopM_E51Qv0f9lt',
  },
  {
    id: 5,
    url: '/photos/photo-5.jpg',
    caption: PRINCESS_CAPTIONS[4],
    driveFileId: '1xXehJQgWO52JJxqhLDEaxi3WOA0kk8Dq',
  },
  {
    id: 6,
    url: '/photos/photo-6.jpg',
    caption: PRINCESS_CAPTIONS[5],
    driveFileId: '1fGRqoYFvQX07pL2rShfPMNjtoAhbmsMs',
  },
  {
    id: 7,
    url: '/photos/photo-7.jpg',
    caption: PRINCESS_CAPTIONS[6],
    driveFileId: '1SdQynIs2X4N6U9gcS3RUqY2zCgmImwOP',
  },
  {
    id: 8,
    url: '/photos/photo-8.jpg',
    caption: PRINCESS_CAPTIONS[7],
    driveFileId: '1O1cmlt7UhDK8u9VwyYF6ktctIOYancXt',
  },
  {
    id: 9,
    url: '/photos/photo-9.jpg',
    caption: PRINCESS_CAPTIONS[8],
    driveFileId: '170gOMC4bQoszuufgOUvn9KCg8gibRrCO',
  },
];

export default function StoryGallery() {
  const [photos, setPhotos] = useState<GalleryPhoto[]>(DEFAULT_LOCKED_PHOTOS);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [liked, setLiked] = useState<Record<number, boolean>>({});

  // Load photos on mount and ensure exact original captions are preserved
  useEffect(() => {
    let isMounted = true;
    const fetchPhotos = async () => {
      try {
        const saved = await getSavedGalleryPhotos();
        if (isMounted && saved && saved.length > 0) {
          const merged = saved.map((p, idx) => ({
            ...p,
            id: idx + 1,
            // Strictly retain the original captions
            caption: PRINCESS_CAPTIONS[idx] || p.caption || 'Princess Desima 👑✨',
          }));
          setPhotos(merged);
        }
      } catch (e) {
        console.warn('Could not load server gallery:', e);
      }
    };
    fetchPhotos();
    return () => {
      isMounted = false;
    };
  }, []);

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
        particleCount: 35,
        spread: 55,
        origin: { y: 0.6 },
        colors: ['#f43f5e', '#ec4899', '#fbcfe8', '#fbbf24'],
      });
    }
  };

  return (
    <div className="w-full flex flex-col items-center select-none">
      {/* Title Header */}
      <div className="mb-2 text-center">
        <h3 className="text-xl sm:text-2xl font-bold font-playfair text-slate-800 tracking-wide">
          Princess Gallery
        </h3>
        <p className="text-xs text-rose-400 font-medium mt-0.5">
          Koleksi Momen Manis Princess Desima ✨
        </p>
      </div>

      {/* Floating Crown Topper */}
      <div className="relative -mb-4 z-10 flex items-center justify-center pointer-events-none">
        <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-amber-300 via-amber-200 to-amber-400 border-2 border-white shadow-lg flex items-center justify-center animate-crown-pulse">
          <Crown className="w-5 h-5 text-amber-900 fill-amber-500 filter drop-shadow" />
        </div>
      </div>

      {/* Pure Regal Photo Frame */}
      <div className="w-full max-w-xs sm:max-w-sm bg-white/95 backdrop-blur-md border-2 border-amber-200/90 rounded-3xl p-3 shadow-xl shadow-rose-100/60 relative">
        <div className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden bg-rose-50 border border-rose-100 shadow-inner">
          <img
            src={currentPhoto.url}
            alt={`Princess Desima ${currentIndex + 1}`}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover transition-all duration-500 pointer-events-none"
          />

          {/* Like Heart Button */}
          <button
            onClick={handleLike}
            className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md border transition-all cursor-pointer ${
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
            onClick={handlePrev}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/85 backdrop-blur-sm border border-rose-200 flex items-center justify-center text-rose-900 shadow-md hover:bg-white active:scale-90 transition-all cursor-pointer"
            aria-label="Foto Sebelumnya"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Next Arrow */}
          <button
            onClick={handleNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/85 backdrop-blur-sm border border-rose-200 flex items-center justify-center text-rose-900 shadow-md hover:bg-white active:scale-90 transition-all cursor-pointer"
            aria-label="Foto Selanjutnya"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Clean Index Badge */}
          <div className="absolute bottom-2.5 right-2.5 bg-slate-900/60 backdrop-blur-xs text-white px-2 py-0.5 rounded-full text-[10px] font-mono pointer-events-none">
            {currentIndex + 1} / {photos.length}
          </div>
        </div>

        {/* Sweet Princess Caption */}
        <div className="pt-3 pb-1 text-center">
          <p className="font-playfair text-sm sm:text-base font-semibold text-rose-900 tracking-wide">
            {currentPhoto.caption}
          </p>
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
            className={`transition-all rounded-full cursor-pointer ${
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

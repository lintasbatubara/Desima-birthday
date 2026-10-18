import { useState, useEffect } from 'react';
import { Music, VolumeX } from 'lucide-react';
import { royalAudio } from '../utils/audioSynthesizer';

export default function TangledMusicButton() {
  const [isPlaying, setIsPlaying] = useState(royalAudio.getIsPlaying());

  useEffect(() => {
    const unsub = royalAudio.subscribe(() => {
      setIsPlaying(royalAudio.getIsPlaying());
    });
    return unsub;
  }, []);

  const handleToggle = () => {
    royalAudio.toggle();
  };

  return (
    <div className="fixed top-3 right-3 z-50">
      <button
        onClick={handleToggle}
        className={`w-10 h-10 rounded-full backdrop-blur-md border shadow-md transition-all flex items-center justify-center cursor-pointer ${
          isPlaying
            ? 'bg-amber-500/90 border-amber-300 text-white shadow-amber-300/40 animate-pulse'
            : 'bg-white/90 border-rose-200 text-rose-800 hover:bg-white'
        }`}
        title={isPlaying ? 'Pause Musik' : 'Putar Musik'}
        aria-label="Musik"
      >
        <div
          className={`w-5 h-5 flex items-center justify-center ${isPlaying ? 'animate-spin' : ''}`}
          style={{ animationDuration: '4s' }}
        >
          {isPlaying ? (
            <Music className="w-4 h-4" />
          ) : (
            <VolumeX className="w-4 h-4 text-rose-400" />
          )}
        </div>
      </button>
    </div>
  );
}

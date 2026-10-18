import { useState, useEffect } from 'react';
import { Music, Volume2, VolumeX, Pause, Play } from 'lucide-react';
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
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full backdrop-blur-md border shadow-md transition-all text-xs font-medium cursor-pointer ${
          isPlaying
            ? 'bg-amber-500/90 border-amber-300 text-white shadow-amber-300/40 animate-pulse'
            : 'bg-white/90 border-rose-200 text-rose-800 hover:bg-white'
        }`}
        title={isPlaying ? 'Jeda Musik Tangled' : 'Putar Tangled - I See The Light'}
        aria-label="Musik Latar Tangled"
      >
        <div className={`w-3.5 h-3.5 ${isPlaying ? 'animate-spin' : ''}`} style={{ animationDuration: '4s' }}>
          <Music className="w-3.5 h-3.5" />
        </div>
        <span className="hidden sm:inline text-[11px] font-sans font-semibold">
          {isPlaying ? 'Tangled: I See The Light ♪' : 'Putar Musik ♪'}
        </span>
        {isPlaying ? (
          <Volume2 className="w-3 h-3 text-amber-100" />
        ) : (
          <VolumeX className="w-3 h-3 text-rose-400" />
        )}
      </button>
    </div>
  );
}

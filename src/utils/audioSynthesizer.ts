/**
 * Tangled - "I See The Light" Original Audio Player
 * Plays the actual original Disney song from /audio/tangled_i_see_the_light.mp3.
 * Automatically sounds ON as soon as the web is opened without waiting for an unmute click.
 */

class TangledAudioPlayer {
  private audio: HTMLAudioElement | null = null;
  private isPlaying = false;
  private volume = 0.85;
  private listeners: Array<() => void> = [];
  private hasInitialized = false;

  constructor() {
    if (typeof window !== 'undefined') {
      this.initAudio();
    }
  }

  private initAudio() {
    if (this.hasInitialized) return;
    this.hasInitialized = true;

    try {
      this.audio = new Audio('/audio/tangled_i_see_the_light.mp3');
      this.audio.loop = true;
      this.audio.volume = this.volume;
      this.audio.preload = 'auto';

      this.audio.addEventListener('play', () => {
        this.isPlaying = true;
        this.notify();
      });

      this.audio.addEventListener('pause', () => {
        this.isPlaying = false;
        this.notify();
      });

      // Immediate sound ON attempt on load
      const startPromise = this.audio.play();
      if (startPromise !== undefined) {
        startPromise
          .then(() => {
            this.isPlaying = true;
            this.notify();
          })
          .catch(() => {
            // Autoplay policy prevented immediate playback before first interaction.
            // Attach one-time window interaction listeners to trigger immediately on first touch/click.
            const unlockAudio = () => {
              if (this.audio && this.audio.paused) {
                this.audio.play().then(() => {
                  this.isPlaying = true;
                  this.notify();
                }).catch(() => {});
              }
              window.removeEventListener('click', unlockAudio);
              window.removeEventListener('touchstart', unlockAudio);
              window.removeEventListener('pointerdown', unlockAudio);
              window.removeEventListener('keydown', unlockAudio);
            };

            window.addEventListener('click', unlockAudio, { passive: true });
            window.addEventListener('touchstart', unlockAudio, { passive: true });
            window.addEventListener('pointerdown', unlockAudio, { passive: true });
            window.addEventListener('keydown', unlockAudio, { passive: true });
          });
      }
    } catch {
      // Audio element creation error handling
    }
  }

  public subscribe(listener: () => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach((l) => l());
  }

  public getIsPlaying() {
    return this.isPlaying;
  }

  public play() {
    this.initAudio();
    if (this.audio) {
      this.audio.play().then(() => {
        this.isPlaying = true;
        this.notify();
      }).catch(() => {});
    }
  }

  public pause() {
    if (this.audio) {
      this.audio.pause();
      this.isPlaying = false;
      this.notify();
    }
  }

  public toggle() {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  public setVolume(val: number) {
    this.volume = Math.max(0, Math.min(1, val));
    if (this.audio) {
      this.audio.volume = this.volume;
    }
    this.notify();
  }

  public playSparkle() {
    // Subtle audio chime
    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const now = ctx.currentTime;
      [783.99, 1046.5, 1318.51, 1567.98].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.frequency.setValueAtTime(freq, now + idx * 0.04);
        gain.gain.setValueAtTime(0.08, now + idx * 0.04);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.04 + 0.3);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.04);
        osc.stop(now + idx * 0.04 + 0.32);
      });
    } catch {
      // ignore
    }
  }
}

export const royalAudio = new TangledAudioPlayer();

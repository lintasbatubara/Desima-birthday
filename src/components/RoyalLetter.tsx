import { useState } from 'react';
import { Mail, Sparkles, Heart, ChevronDown, Check, Copy } from 'lucide-react';
import { royalAudio } from '../utils/audioSynthesizer';

export default function RoyalLetter() {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleToggle = () => {
    royalAudio.playSparkle();
    setIsOpen(!isOpen);
  };

  const letterText = `Untuk Sang Putri, Desima Triana Grey Tindaon...

Selamat ulang tahun ya, Desima! 👑✨

Hari ini adalah hari yang sangat istimewa, karena di hari inilah dunia menyambut kehadiran sosok perempuan luar biasa yang bernama Desima Triana Grey Tindaon. 

Mungkin sehari-hari kita menjalani kesibukan masing-masing, tapi di momen pertambahan usiamu ini, aku ingin kamu tahu betapa berharganya dirimu. Des, senyummu itu punya keajaiban tersendiri—selalu menularkan keceriaan dan bikin suasana jadi jauh lebih hangat. Keberadaanmu selalu memberi rasa tenang bagi teman-teman di sekitarmu.

Desima bukan cuma perempuan yang cantik dan anggun, tapi kamu punya hati yang begitu tulus, telinga yang mau mendengar, dan jiwa tangguh yang tidak mudah menyerah. Terima kasih ya sudah menjadi teman yang begitu baik dan berharga.

Di usia yang baru ini, doaku menyertaimu:
Semoga langkahmu selalu diberkati kemudahan, kesehatan yang berlimpah, dan kebahagiaan yang tak pernah habis. Semoga semua mimpi dan cita-cita besar yang tersimpan di dalam hatimu bisa tercapai satu per satu. Jangan pernah ragu pada potensimu, karena kamu terlahir untuk bersinar.

Tetaplah jadi Des yang selalu ceria, humble, dan penuh kasih. Kamu pantas mendapatkan semua kebaikan di semesta ini, Princess Desima!

Selamat Ulang Tahun, Des! 💖🎂`;

  const handleCopy = () => {
    navigator.clipboard.writeText(letterText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative max-w-2xl mx-auto my-12 px-4">
      {/* Sealed Royal Envelope Card */}
      <div
        className={`relative bg-[#fffdfa] border-2 ${
          isOpen ? 'border-amber-300 shadow-2xl' : 'border-rose-200/90 shadow-lg'
        } rounded-3xl p-6 md:p-8 transition-all duration-500`}
      >
        {/* Wax Seal Badge */}
        <div className="flex flex-col items-center text-center">
          <button
            onClick={handleToggle}
            className="group relative -mt-12 w-20 h-20 rounded-full bg-gradient-to-tr from-rose-700 via-rose-600 to-rose-500 border-4 border-amber-200 shadow-xl flex items-center justify-center cursor-pointer transition-transform duration-300 hover:scale-110 active:scale-95"
            aria-label="Buka Surat Kerajaan"
          >
            <div className="absolute inset-1 rounded-full border border-rose-400/50" />
            <span className="font-cinzel text-amber-200 font-extrabold text-2xl drop-shadow">
              D
            </span>
            <div className="absolute -bottom-1 w-3 h-3 bg-amber-400 rounded-full blur-[2px] opacity-70 group-hover:opacity-100" />
          </button>

          <span className="mt-3 font-cinzel text-xs tracking-widest uppercase text-amber-800 font-bold">
            The Royal Letter
          </span>
          <h3 className="text-xl md:text-2xl font-bold font-playfair text-slate-900 mt-1">
            Sepucuk Surat untuk Desima
          </h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm">
            {isOpen
              ? 'Surat kerajaan telah dibuka. Bacalah pesan tulus ini dengan senyuman.'
              : 'Klik segel lilin mahkota di atas untuk membuka pesan personal yang manis.'}
          </p>

          <button
            onClick={handleToggle}
            className="mt-4 px-5 py-2 text-xs font-semibold rounded-full border border-rose-200 bg-rose-50 text-rose-800 hover:bg-rose-100 transition-colors flex items-center gap-1.5"
          >
            <Mail className="w-3.5 h-3.5 text-rose-500" />
            <span>{isOpen ? 'Tutup Surat' : 'Buka & Baca Surat 💌'}</span>
            <ChevronDown
              className={`w-3.5 h-3.5 text-rose-500 transition-transform ${
                isOpen ? 'rotate-180' : ''
              }`}
            />
          </button>
        </div>

        {/* Unfolded Parchment Content */}
        {isOpen && (
          <div className="mt-8 pt-6 border-t border-amber-200/80 space-y-5 animate-in fade-in slide-in-from-top-4 duration-500">
            {/* Header Greeting */}
            <div className="text-center space-y-1">
              <span className="font-vibes text-3xl md:text-4xl text-rose-700 block">
                Dear Princess,
              </span>
              <h4 className="font-playfair text-lg md:text-xl font-bold text-slate-900 tracking-wide">
                Desima Triana Grey Tindaon
              </h4>
              <div className="flex items-center justify-center gap-2 text-amber-600 text-xs">
                <Sparkles className="w-3 h-3" />
                <span>Sebuah Pesan Hangat Dari Hati</span>
                <Sparkles className="w-3 h-3" />
              </div>
            </div>

            {/* Letter Paragraphs */}
            <div className="bg-amber-50/40 border border-amber-200/60 rounded-2xl p-5 md:p-7 font-serif text-slate-700 text-sm md:text-base leading-relaxed space-y-4">
              <p>
                <span className="font-semibold text-rose-900">Selamat ulang tahun ya, Desima! 👑✨</span>
              </p>
              <p>
                Hari ini adalah hari yang sangat istimewa, karena di hari inilah dunia menyambut kehadiran sosok perempuan luar biasa yang bernama <strong>Desima Triana Grey Tindaon</strong>.
              </p>
              <p>
                Mungkin sehari-hari kita disibukkan dengan rutinitas masing-masing, tapi di momen pertambahan usiamu ini, aku ingin kamu tahu betapa berharganya dirimu. <em>Des</em>, senyummu itu punya keajaiban tersendiri—selalu menularkan keceriaan dan membuat suasana di sekitarmu jadi jauh lebih hangat dan menyenangkan.
              </p>
              <p>
                Desima bukan hanya seseorang yang cantik dan anggun seperti putri di cerita dongeng, tetapi kamu memiliki hati yang begitu tulus, empati yang besar, dan tekad baja yang pantang menyerah menghadapi segala tantangan.
              </p>
              <p>
                Di usia yang baru ini, doaku selalu menyertai setiap langkahmu:
                <br />
                Semoga jalan hidupmu dipenuhi kelancaran, rezeki yang berkah, kesehatan yang prima, dan orang-orang baik yang menyayangimu tanpa syarat. Semoga impian-impian besarmu terwujud dengan cara yang paling indah.
              </p>
              <p>
                Tetaplah jadi <strong>Des</strong> yang apa adanya—ramah, bersemangat, dan selalu membawa tawa. Jangan pernah lupa bahwa kamu berharga dan istimewa!
              </p>
              <div className="pt-3 text-right">
                <p className="font-vibes text-2xl text-rose-700">With warmest wishes,</p>
                <p className="font-sans text-xs text-slate-600 font-medium">Sahabat & Pengagum Kebaikanmu</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between text-xs text-slate-500 pt-2">
              <div className="flex items-center gap-1.5 text-rose-700">
                <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
                <span>Tertulis tulus untuk Desima</span>
              </div>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1 text-slate-600 hover:text-slate-900 bg-white border border-slate-200 px-3 py-1.5 rounded-lg transition-colors shadow-xs"
                title="Salin isi surat"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700 font-medium">Tersalin!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Salin Pesan</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

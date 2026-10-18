import { useState } from 'react';
import { MessageCircle, Send, Heart, Sparkles, Check, Copy, Crown } from 'lucide-react';
import confetti from 'canvas-confetti';
import { royalAudio } from '../utils/audioSynthesizer';

const PRESET_MESSAGES = [
  'Makasih banyak yaa! Web ulang tahunnya manis banget, aku suka bangett 👑✨',
  'Aww terharu banget baca pesan dan lihat galerinya! Thank you so much for making my day extra special, Desima bahagia banget hari ini! 🥺💖',
  'Sumpah ini lucu dan niat banget! Makasih ya udah jadi sahabat terbaik buat Des! 🥰🎂',
  'Hai! Aku baru aja buka web ucapan princess-nya, cantik banget lagunya dan animasinya. Makasih banyak ya atas doa tulusnya! 🙏🌸',
];

export default function WhatsAppReply() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedPreset, setSelectedPreset] = useState(0);
  const [customMessage, setCustomMessage] = useState(PRESET_MESSAGES[0]);
  const [copied, setCopied] = useState(false);

  const handleSelectPreset = (idx: number) => {
    setSelectedPreset(idx);
    setCustomMessage(PRESET_MESSAGES[idx]);
    royalAudio.playSparkle();
  };

  const handleSendWhatsApp = () => {
    royalAudio.playSparkle();
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.8 },
      colors: ['#25D366', '#128C7E', '#f43f5e', '#fbbf24'],
    });

    // Clean phone number: remove non-digits, replace leading 0 with 62
    let cleanNumber = phoneNumber.replace(/\D/g, '');
    if (cleanNumber.startsWith('0')) {
      cleanNumber = '62' + cleanNumber.slice(1);
    }

    const encodedText = encodeURIComponent(customMessage);
    const waUrl = cleanNumber
      ? `https://api.whatsapp.com/send?phone=${cleanNumber}&text=${encodedText}`
      : `https://api.whatsapp.com/send?text=${encodedText}`;

    window.open(waUrl, '_blank');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(customMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-3xl mx-auto my-16 px-4">
      <div className="relative bg-gradient-to-b from-white via-emerald-50/20 to-white border-2 border-emerald-200/80 rounded-3xl p-6 md:p-10 shadow-xl overflow-hidden">
        {/* Glow & Crown accent */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-100/40 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-rose-100/40 rounded-full blur-3xl pointer-events-none" />

        {/* Section Header */}
        <div className="text-center max-w-xl mx-auto space-y-2 mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold">
            <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
            <span>Kirim Balasan Khusus untuk Sahabatmu</span>
          </div>

          <h3 className="text-2xl md:text-3xl font-bold font-playfair text-slate-800">
            Balas Pesan ke WhatsApp
          </h3>

          <p className="text-xs md:text-sm text-slate-600">
            Desima bisa langsung mengirimkan pesan balasan manis, ucapan terima kasih, atau cerita harimu langsung ke WhatsApp si pembuat web ucapan ini.
          </p>
        </div>

        {/* Preset Selector */}
        <div className="space-y-4">
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500">
            Pilih Template Balasan Cepat:
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {PRESET_MESSAGES.map((msg, idx) => (
              <button
                key={idx}
                onClick={() => handleSelectPreset(idx)}
                className={`text-left text-xs p-3 rounded-xl border transition-all ${
                  selectedPreset === idx
                    ? 'border-emerald-500 bg-emerald-50/70 text-emerald-950 font-medium shadow-sm ring-1 ring-emerald-400'
                    : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                }`}
              >
                <div className="flex items-start gap-2">
                  <span className="shrink-0 w-4 h-4 rounded-full bg-emerald-200 text-emerald-800 text-[10px] font-bold flex items-center justify-center mt-0.5">
                    {idx + 1}
                  </span>
                  <p className="line-clamp-2">{msg}</p>
                </div>
              </button>
            ))}
          </div>

          {/* Custom Message Textarea */}
          <div className="space-y-1.5 pt-2">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <label htmlFor="message-box" className="font-semibold text-slate-700">
                Pesan Balasan Desima:
              </label>
              <button
                onClick={handleCopy}
                className="text-emerald-700 hover:text-emerald-800 flex items-center gap-1 font-medium transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Tersalin!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Salin Teks</span>
                  </>
                )}
              </button>
            </div>
            <textarea
              id="message-box"
              rows={3}
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              placeholder="Tuliskan balasan manismu di sini..."
              className="w-full text-sm bg-white border border-slate-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 shadow-inner text-slate-800"
            />
          </div>

          {/* Optional Phone Number Input */}
          <div className="space-y-1 pt-1">
            <label htmlFor="wa-number" className="block text-xs font-medium text-slate-600">
              Nomor WhatsApp Tujuan (Opsional, kosongkan bila ingin memilih kontak langsung di WA):
            </label>
            <div className="relative">
              <input
                id="wa-number"
                type="text"
                placeholder="Contoh: 08123456789 atau 628123456789"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full text-xs bg-white border border-slate-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-400 text-slate-800"
              />
            </div>
          </div>

          {/* Direct Send Action Button */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={handleSendWhatsApp}
              className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold rounded-full shadow-lg shadow-emerald-200/80 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2.5 group cursor-pointer"
            >
              <MessageCircle className="w-5 h-5 fill-white text-emerald-600 group-hover:rotate-12 transition-transform" />
              <span className="text-sm md:text-base font-bold">
                Kirim Balasan ke WhatsApp 💬
              </span>
              <Send className="w-4 h-4 ml-1 opacity-80 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Reassurance note */}
          <p className="text-[11px] text-center text-slate-600 mt-2">
            Tombol ini akan otomatis membuka aplikasi WhatsApp dengan pesan manis yang sudah disiapkan.
          </p>
        </div>
      </div>
    </div>
  );
}

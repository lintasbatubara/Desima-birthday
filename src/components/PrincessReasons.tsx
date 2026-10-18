import { useState } from 'react';
import { Crown, Heart, Sparkles, Smile, ShieldCheck, Sun, Compass, Star } from 'lucide-react';
import { royalAudio } from '../utils/audioSynthesizer';

interface Charm {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  icon: typeof Crown;
  color: string;
}

const CHARMS: Charm[] = [
  {
    id: 1,
    title: 'Senyuman yang Menghangatkan',
    subtitle: 'Pesona Khas Des',
    description: 'Ketika Desima tersenyum, semua hal yang berat terasa jadi lebih ringan. Senyummu punya aura positif yang natural dan tulus.',
    icon: Smile,
    color: 'from-pink-500 to-rose-400',
  },
  {
    id: 2,
    title: 'Hati yang Selalu Tulus',
    subtitle: 'Jiwa Bangsawan Sejati',
    description: 'Des selalu peduli dan memperlakukan orang lain dengan penuh rasa hormat serta kebaikan yang tanpa pamrih.',
    icon: Heart,
    color: 'from-rose-500 to-red-400',
  },
  {
    id: 3,
    title: 'Tangguh Hadapi Tantangan',
    subtitle: 'Kekuatan di Balik Keanggunan',
    description: 'Bukan sekadar putri dongeng biasa, Desima adalah wanita tangguh yang selalu bangkit dan belajar dari setiap proses hidup.',
    icon: ShieldCheck,
    color: 'from-amber-500 to-amber-400',
  },
  {
    id: 4,
    title: 'Tawa Lepas yang Menular',
    subtitle: 'Momen Bahagia Bersama Des',
    description: 'Tawa renyah Desima selalu berhasil mencairkan suasana kaku, membuat setiap obrolan terasa seru dan penuh kenangan indah.',
    icon: Sun,
    color: 'from-amber-400 to-rose-400',
  },
  {
    id: 5,
    title: 'Sahabat yang Selalu Suportif',
    subtitle: 'Kesetiaan Teman Sejati',
    description: 'Desima adalah pendengar yang baik dan sahabat yang bisa diandalkan dalam suka maupun duka. Terima kasih sudah selalu ada!',
    icon: Compass,
    color: 'from-purple-500 to-pink-500',
  },
  {
    id: 6,
    title: 'Mimpi & Masa Depan Berkilau',
    subtitle: 'Mahkota Harapan',
    description: 'Desima Triana Grey Tindaon punya potensi besar untuk mencapai apa pun yang diimpikan. Langit adalah batas bagi sang putri.',
    icon: Star,
    color: 'from-amber-500 to-yellow-400',
  },
];

export default function PrincessReasons() {
  const [selectedCharm, setSelectedCharm] = useState<number | null>(null);

  const handleCardClick = (id: number) => {
    royalAudio.playSparkle();
    setSelectedCharm(selectedCharm === id ? null : id);
  };

  return (
    <div className="max-w-5xl mx-auto my-16 px-4">
      {/* Section Title */}
      <div className="text-center max-w-xl mx-auto space-y-2 mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-rose-100/70 text-rose-800 text-xs font-semibold">
          <Crown className="w-3.5 h-3.5 fill-rose-400 text-rose-600" />
          <span>Alasan Mengapa Desima Layak Jadi Putri Sejati</span>
        </div>
        <h3 className="text-2xl md:text-3xl font-bold font-playfair text-slate-800">
          6 Pesona Kemilau Sang Putri
        </h3>
        <p className="text-sm text-slate-600">
          Setiap detail kebaikan dalam dirimu adalah permata yang membuat Desima Triana Grey Tindaon begitu istimewa di mata kami.
        </p>
      </div>

      {/* Grid of Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {CHARMS.map((charm) => {
          const IconComponent = charm.icon;
          const isExpanded = selectedCharm === charm.id;

          return (
            <div
              key={charm.id}
              onClick={() => handleCardClick(charm.id)}
              className={`cursor-pointer text-left bg-white border rounded-2xl p-6 transition-all duration-300 relative group overflow-hidden ${
                isExpanded
                  ? 'border-amber-400 shadow-xl ring-2 ring-amber-200/60 scale-[1.02]'
                  : 'border-rose-100/90 hover:border-rose-300 hover:shadow-lg shadow-sm'
              }`}
            >
              <div className="flex items-start justify-between">
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${charm.color} text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform`}
                >
                  <IconComponent className="w-6 h-6" />
                </div>
                <span className="font-cinzel text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
                  #{charm.id}
                </span>
              </div>

              <div className="mt-4">
                <span className="text-xs text-rose-600 font-medium tracking-wide">
                  {charm.subtitle}
                </span>
                <h4 className="text-lg font-bold font-playfair text-slate-900 group-hover:text-rose-700 transition-colors">
                  {charm.title}
                </h4>
                <p className="mt-2 text-xs md:text-sm text-slate-600 leading-relaxed">
                  {charm.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-rose-50 flex items-center justify-between text-[11px] text-slate-400 group-hover:text-rose-600 transition-colors">
                <span className="flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-500" />
                  <span>Karakter Desima</span>
                </span>
                <span className="font-medium text-rose-500">
                  {isExpanded ? 'Tersimpan di Hati ✨' : 'Klik kartu ✦'}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

import React from 'react';
import { ShieldCheck, Radio } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-[#1e334a] bg-[#0c1826]/90 backdrop-blur py-3 px-4 md:px-8 mt-auto text-xs text-[#8ca0b3] flex flex-col sm:flex-row items-center justify-between gap-2">
      <div className="flex items-center gap-2">
        <span className="flex h-2 w-2 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ffb020] opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-[#ffb020]"></span>
        </span>
        <span className="font-mono text-[11px] text-[#ffb020] font-medium tracking-wide">VITEZ.AI ENGINE v2.4</span>
        <span className="text-[#3b536b]">|</span>
        <span className="text-[#8ca0b3] flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-[#5eead4]" />
          Presidential Tech Award Demo Edition
        </span>
      </div>

      <div className="text-center sm:text-right font-sans text-[11px] text-[#8ca0b3]">
        <p className="italic">
          Demo ma&apos;lumotlari — moslik va tayyorgarlik ko&apos;rsatkichlari taxminiy hisob-kitob, rasmiy davlat tasdig&apos;i emas.
        </p>
      </div>
    </footer>
  );
};

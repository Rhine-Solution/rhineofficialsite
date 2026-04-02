import React from 'react';
import { githubIcon, twitterIcon } from './GFX';

export default function Footer({ themeColor }: { themeColor: string }) {
  return (
    <footer className="relative z-10 px-10 py-12 bg-white/5 backdrop-blur-md backdrop-saturate-125 border-t border-white/10">
      <div className="max-w-[1800px] mx-auto flex flex-col md:flex-row items-end justify-between gap-8">
        <div className="flex flex-col gap-3 items-start text-left">
          <div className="flex items-center gap-3">
            <div className="status-dot w-2 h-2 rounded-full" style={{ backgroundColor: themeColor, boxShadow: `0 0 10px ${themeColor}` }}></div>
            <span className="text-[9px] uppercase tracking-[0.4em] text-white/40 font-black">Systems: Active</span>
          </div>
          <div className="text-[10px] uppercase tracking-[0.2em] text-white/20 font-medium">© 2026 Rhine Solution | Developed by htr</div>
        </div>
        <div className="flex gap-8 items-center" style={{ color: themeColor }}>
          <a href="#" className="transition-all duration-300 hover:scale-125 hover:drop-shadow-[0_0_10px_currentColor]">{githubIcon()}</a>
          <a href="#" className="transition-all duration-300 hover:scale-125 hover:drop-shadow-[0_0_10px_currentColor]">{twitterIcon()}</a>
        </div>
      </div>
    </footer>
  );
}
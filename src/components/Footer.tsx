import React from 'react';
import { Link } from 'react-router-dom';
import { githubIcon, twitterIcon } from './GFX';

type Props = {
  themeColor?: string;
};

export default function Footer({ themeColor = '#4f46e5' }: Props) {
  const year = new Date().getFullYear();
  return (
    <footer className="relative z-10 px-6 py-8 bg-black/80 backdrop-blur-xl border-t border-white/10">
      <div className="container mx-auto text-center text-white/60 text-sm">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3 justify-center md:justify-start">
            <div className="status-dot w-2 h-2 rounded-full" style={{ backgroundColor: themeColor, boxShadow: `0 0 10px ${themeColor}` }} />
            <div>© {year} Rhine Solution. All rights reserved.</div>
          </div>

          <div className="flex items-center gap-6 justify-center">
            <Link to="/privacy" className="text-white/60 hover:text-white">Privacy</Link>
            <Link to="/terms" className="text-white/60 hover:text-white">Terms</Link>
            <a href="#" aria-label="GitHub" className="text-white/60 hover:text-white">{githubIcon()}</a>
            <a href="#" aria-label="Twitter" className="text-white/60 hover:text-white">{twitterIcon()}</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

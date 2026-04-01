import { useEffect, useState } from 'react';
import '../App.css';
import WebGPU from 'three/examples/jsm/capabilities/WebGPU.js';
import { RhineLogo, githubIcon, twitterIcon } from '../components/GFX';
import { Root } from '../lib/Root';

export default function App() {
  const [hasWebGPU, setHasWebGPU] = useState(false);
  const [hue, setHue] = useState(0);
  const [displayZoom, setDisplayZoom] = useState(0);

  useEffect(() => {
    setHasWebGPU(WebGPU.isAvailable());
    
    // NEW: Sync HUD with the 3D Engine
    const syncHUD = () => {
      setDisplayZoom(Root.zoomPercent || 0);
      requestAnimationFrame(syncHUD);
    };
    syncHUD();

    let rafId: number;
    let lastTimestamp = 0;
    const speed = 0.5;
    const animate = (timestamp: number) => {
      if (!lastTimestamp) lastTimestamp = timestamp;
      const delta = Math.min(0.03, (timestamp - lastTimestamp) / 1000);
      lastTimestamp = timestamp;
      setHue((prev) => (prev + delta * speed * 360) % 360);
      rafId = requestAnimationFrame(animate);
    };
    rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
  }, []);

  const themeColor = `hsl(${hue}, 100%, 60%)`;

  const SnakeButton = ({ text, color, onClick }: { text: string; color: string; onClick?: () => void }) => (
    <div className="snake-btn" style={{ '--theme-color': color } as any}>
      <div className="snake-line"></div>
      <button 
        onClick={onClick}
        className="btn-inner px-10 py-4 border-2 uppercase text-xs font-bold tracking-[0.2em]"
        style={{ borderColor: color, color: color }}
      >
        {text}
      </button>
    </div>
  );

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div id="app" className="relative w-full min-h-screen overflow-y-auto font-rubik selection:bg-white/20">

      {/* HEADER */}
      <header className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-10 py-8 bg-transparent">
        <div className="flex items-center gap-4 cursor-pointer" onClick={() => scrollTo('hero')}>
          <div className="w-12 h-12 transition-transform hover:scale-110 duration-500">
            {RhineLogo(themeColor)} 
          </div>
          <h1 className="text-2xl font-bold tracking-[0.2em] text-white uppercase">
            Admin <span style={{ color: themeColor }}>Panel</span>
          </h1>
        </div>
        <nav className="hidden md:block">
          <ul className="flex gap-12 text-[10px] font-black uppercase tracking-[0.4em]" style={{ color: themeColor }}>
            <li className="cursor-pointer hover:text-white transition-all" onClick={() => scrollTo('services')}>Services</li>
            <li className="cursor-pointer hover:text-white transition-all" onClick={() => scrollTo('technology')}>Technology</li>
            <li className="cursor-pointer hover:text-white transition-all" onClick={() => scrollTo('about')}>About</li>
          </ul>
        </nav>
      </header>

      {/* HERO SECTION */}
      <main id="hero" className="relative z-10 flex flex-col items-center justify-center h-screen px-6 text-center">
        <h2 className="text-6xl md:text-9xl font-black text-white uppercase tracking-tighter mb-6">
          Rhine <span style={{ color: themeColor }}>Solution</span>
        </h2>
        <p className="text-white/60 text-lg md:text-xl font-light tracking-widest uppercase mb-12">
          Next-generation digital experiences built in only for you
        </p>
        <div className="flex flex-wrap justify-center gap-10">
          <SnakeButton text="Start Project" color={themeColor} onClick={() => scrollTo('contact')} />
          <SnakeButton text="View Work" color="white" onClick={() => scrollTo('services')} />
        </div>
      </main>

      {/* SERVICES SECTION */}
      <section id="services" className="relative z-10 py-40 px-10">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-[10px] uppercase tracking-[0.8em] mb-4" style={{ color: themeColor }}>Capabilities</h3>
          <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter mb-20">Expertise</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-1px bg-white/10 border border-white/10">
            {[{title:"WebGPU Apps"}, {title:"Digital Strategy"}, {title:"UI Architecture"}].map((s, i) => (
              <div key={i} className="bg-black/40 p-12 hover:bg-black/60 transition-all group">
                <div className="w-8 h-[1px] mb-8 group-hover:w-full transition-all" style={{ backgroundColor: themeColor }}></div>
                <h4 className="text-xl font-bold text-white uppercase mb-4 tracking-widest">{s.title}</h4>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TECHNOLOGY SECTION */}
      <section id="technology" className="relative z-10 py-40 px-10 bg-white/[0.02]">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-20">
          <div className="md:w-1/2 text-left">
            <h2 className="text-5xl font-black text-white uppercase tracking-tighter mb-8">The Engine</h2>
            <p className="text-white/50 text-lg leading-loose uppercase tracking-widest font-light mb-10">
              We leverage raw hardware acceleration to deliver visuals previously impossible on the web.
            </p>
          </div>
          <div className="md:w-1/2 border border-white/10 p-1 bg-black/20">
            <div className="border border-white/5 p-10 text-left font-mono text-[10px] text-white/30 leading-relaxed">
              <span className="text-white/60 block mb-2">Rhine_System_Init...</span>
              {`> Initializing WebGPU Context... DONE`} <br/>
              {`> Loading Custom Shaders... DONE`} <br/>
              <span style={{ color: themeColor }} className="block mt-4 animate-pulse">_SYSTEM READY</span>
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section id="about" className="relative z-10 py-40 px-10 text-center">
        <h2 className="text-4xl font-black text-white uppercase tracking-tighter mb-12">Behind <span style={{ color: themeColor }}>Rhine</span></h2>
        <p className="max-w-3xl mx-auto text-white/70 text-xl leading-relaxed font-light uppercase tracking-widest">
          Founded by htr, Rhine Solution was built on a single premise: The web should be as powerful as your hardware.
        </p>
      </section>

      {/* CONTACT SECTION */}
      <section id="contact" className="relative z-10 py-60 px-10 text-center">
        <h2 className="text-6xl md:text-8xl font-black text-white uppercase tracking-tighter mb-12">Let's <span style={{ color: themeColor }}>Create</span></h2>
        <div className="flex justify-center">
          <SnakeButton text="Contact US" color={themeColor} />
        </div>
      </section>

      {/* FIXED SIDE SCROLL INDICATOR */}
      <div className="side-indicator group cursor-pointer hidden lg:flex" onClick={() => scrollTo('services')}>
         <span className="text-[8px] uppercase tracking-[0.6em] text-white/20 group-hover:text-white transition-colors duration-500 vertical-text font-black">Scroll to explore</span>
         <div className="w-[1px] h-12 group-hover:h-24 transition-all duration-700 ease-in-out" style={{ backgroundColor: themeColor, boxShadow: `0 0 10px ${themeColor}` }}></div>
      </div>

      {/* FOOTER */}
      <footer className="relative z-10 px-10 py-12 bg-transparent border-t border-white/5">
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
    </div>
  );
}

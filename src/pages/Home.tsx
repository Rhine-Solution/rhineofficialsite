import { useEffect, useState } from 'react';
import '../App.css';
import WebGPU from 'three/examples/jsm/capabilities/WebGPU.js';
import { RhineLogo, githubIcon, twitterIcon } from '../components/GFX';
import { Root } from '../lib/Root';
import Layout from '../components/Layout';
import { useAuthModal } from '../auth/AuthModalProvider';


export default function App() {
  const [hasWebGPU, setHasWebGPU] = useState(false);
  const [hue, setHue] = useState(0);
  const [displayZoom, setDisplayZoom] = useState(0);

  useEffect(() => {
    setHasWebGPU(WebGPU.isAvailable());
    
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
  const authModal = useAuthModal();

  const SnakeButton = ({ text, color, onClick }: { text: string; color: string; onClick?: () => void }) => {
    const handleClick = (e?: React.MouseEvent | React.KeyboardEvent) => {
      e && (e as any).preventDefault?.();
      e && (e as any).stopPropagation?.();
      onClick?.();
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        handleClick(e);
      }
    };

    return (
      <div
        className="snake-btn cursor-pointer"
        style={{ '--theme-color': color } as any}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        role="button"
        tabIndex={0}
        aria-pressed="false"
      >
        <div className="snake-line" />
        <button
          type="button"
          onClick={handleClick}
          className="btn-inner px-10 py-4 border-2 uppercase text-xs font-bold tracking-[0.2em]"
          style={{ borderColor: color, color: color }}
        >
          {text}
        </button>
      </div>
    );
  };

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div id="app" className="relative w-full min-h-screen overflow-y-auto font-rubik selection:bg-white/20">
      
      {/* TECHNICAL HUD */}
      <div className="fixed top-1/2 left-10 -translate-y-1/2 z-50 font-mono text-[10px] text-white/20 space-y-6 hidden xl:block"
        style={{ textShadow: `0 0 1px ${themeColor}` }}>
        <div className="space-y-2">
          <div className="flex items-center gap-4">
            <div className="w-1 h-1 rounded-full bg-white/40 animate-ping"></div>
            <span className="tracking-[0.3em]">CORE_LINK: ACTIVE</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-1 h-1 rounded-full bg-white/20"></div>
            <span className="tracking-[0.3em]">ENGINE_ZOOM: {displayZoom}%</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-1 h-1 rounded-full bg-white/20"></div>
            <span className="tracking-[0.3em]">HUE_ROT: {Math.round(hue)}°</span>
          </div>
        </div>
        <div className="w-12 h-[1px] bg-white/10"></div>
        <div className="uppercase tracking-[0.5em] [writing-mode:vertical-lr] opacity-50">
          Rhine Solution Protocol
        </div>
      </div>

      <Layout themeColor={themeColor} showAuthButtons={true}>
        {/* HERO SECTION */}
        <main id="hero" className="relative z-10 flex flex-col items-center justify-center h-screen px-6 text-center">
          <h2 className="text-6xl md:text-9xl font-black text-white uppercase tracking-tighter mb-6">
            Future <span style={{ color: themeColor }}>Defined</span>
          </h2>
          <p className="text-white/60 text-lg md:text-xl font-light tracking-widest uppercase mb-12">
            Next-generation digital experiences built in only for you
          </p>
          <div className="flex flex-wrap justify-center gap-10">
            <SnakeButton text="Start Project" color={themeColor} onClick={() => authModal.open('login')} />
            <SnakeButton text="View Work" color="white" onClick={() => scrollTo('services')} />
          </div>
        </main>

        {/* SERVICES SECTION – glass cards */}
        <section id="services" className="relative z-10 py-40 px-10">
          <div className="max-w-6xl mx-auto">
            <h3 className="text-[10px] uppercase tracking-[0.8em] mb-4" style={{ color: themeColor }}>Capabilities</h3>
            <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter mb-20">Expertise</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {["WebGPU Apps", "Digital Strategy", "UI Architecture"].map((title, i) => (
                <div key={i} className="bg-black/80 backdrop-blur-xl border-l border-white/20 rounded-r-2xl p-8 hover:bg-black/90 transition-all group">
                  <div className="w-8 h-[1px] mb-8 group-hover:w-full transition-all" style={{ backgroundColor: themeColor }}></div>
                  <h4 className="text-xl font-bold text-white uppercase mb-4 tracking-widest">{title}</h4>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* TECHNOLOGY SECTION – right panel now glassy */}
        <section id="technology" className="relative z-10 py-40 px-10 bg-white/[0.02]">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-20">
            <div className="md:w-1/2 text-left">
              <h2 className="text-5xl font-black text-white uppercase tracking-tighter mb-8">The Engine</h2>
              <p className="text-white/50 text-lg leading-loose uppercase tracking-widest font-light mb-10">
                We leverage raw hardware acceleration to deliver visuals previously impossible on the web.
              </p>
            </div>
            {/* Glass container for the right panel (robot + system log) */}
            <div className="md:w-1/2 bg-black/80 backdrop-blur-xl border-l border-white/20 rounded-r-2xl shadow-2xl p-1">
              <div className="border border-white/5 p-10 text-left font-mono text-[10px] text-white/30 leading-relaxed">
                <span className="text-white/60 block mb-2">Rhine_System_Init...</span>
                {`> Initializing WebGPU Context... DONE`} <br/>
                {`> Loading Custom Shaders... DONE`} <br/>
                <div className="w-48 h-48 md:w-64 md:h-64 mx-auto mb-6">
                  //plineRoboot import//
                </div>
                <span style={{ color: themeColor }} className="block mt-4 animate-pulse">_SYSTEM READY</span>
              </div>
            </div>
          </div>
        </section>

        {/* ABOUT SECTION – glass container around heading + paragraph */}
        <section id="about" className="relative z-10 py-40 px-10">
          <div className="max-w-4xl mx-auto">
            <div className="bg-black/80 backdrop-blur-xl border-l border-white/20 rounded-r-2xl p-10 text-center shadow-2xl">
              <h2 className="text-4xl font-black text-white uppercase tracking-tighter mb-8">
                Behind <span style={{ color: themeColor }}>Rhine</span>
              </h2>
              <p className="text-white/70 text-xl leading-relaxed font-light uppercase tracking-widest">
                Founded by htr, Rhine Solution was built on a single premise: The web should be as powerful as your hardware.
              </p>
            </div>
          </div>
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
      </Layout>
    </div>
  );
}
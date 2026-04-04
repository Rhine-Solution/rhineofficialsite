import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { RhineLogo } from './GFX';
import SideMenu from './SideMenu';
import AuthButton from '../auth/AuthButton';
import { useAuthModal } from '../auth/AuthModalProvider';

type HeaderProps = {
  themeColor?: string;
  onLogoClick?: () => void;
  showAuthButtons?: boolean;
  disableSideMenu?: boolean;
  heightClass?: string;
};

const megaMenuCategories = {
  Rhine: [
    "Expertise",
    "The Engine",
    "Behind Rhine",
    "Let's Create"
  ],
  Services: [
    "Web Development",
    "Cloud Infrastructure",
    "IT Consulting",
    "Digital Transformation"
  ],
  Solutions: [
    "Enterprise Software",
    "AI & Automation",
    "Cybersecurity Suite",
    "Data Analytics"
  ],
  Technology: [
    "WebGPU / 3D Rendering",
    "Blockchain / Web3",
    "IoT & Edge Computing",
    "Custom APIs"
  ],
  Resources: [
    "Case Studies",
    "Documentation",
    "Blog / Insights",
    "Support & Community"
  ]
};

export default function Header({
  themeColor = '#4f46e5',
  onLogoClick,
  showAuthButtons = false,
  disableSideMenu = false,
  heightClass = 'h-[72px]'
}: HeaderProps) {
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<keyof typeof megaMenuCategories | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const megaMenuRef = useRef<HTMLDivElement>(null);
  const pillRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const pathname = location.pathname;
  const authModal = useAuthModal();

  // --- new: render-aware (desktop vs mobile) ---
  const getInitialDesktop = () => {
    if (typeof window === 'undefined') return true;
    return window.innerWidth >= 1024;
  };
  const [isDesktop, setIsDesktop] = useState<boolean>(getInitialDesktop());
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mql = window.matchMedia('(min-width:1024px)');
    const handleChange = (ev: MediaQueryListEvent | MediaQueryList) => {
      setIsDesktop('matches' in ev ? ev.matches : (ev as MediaQueryList).matches);
    };

    // initial sync
    handleChange(mql);

    // modern APIs
    if (typeof mql.addEventListener === 'function') {
      mql.addEventListener('change', handleChange as EventListener);
      return () => mql.removeEventListener('change', handleChange as EventListener);
    }

    // fallback for older browsers
    if (typeof mql.addListener === 'function') {
      mql.addListener(handleChange as (this: MediaQueryList, ev: MediaQueryListEvent) => any);
      return () => mql.removeListener(handleChange as (this: MediaQueryList, ev: MediaQueryListEvent) => any);
    }

    return;
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (megaMenuOpen && megaMenuRef.current && !megaMenuRef.current.contains(event.target as Node)) {
        const navButtons = document.querySelectorAll('.nav-trigger');
        let clickedOnTrigger = false;
        navButtons.forEach(btn => {
          if (btn.contains(event.target as Node)) clickedOnTrigger = true;
        });
        if (!clickedOnTrigger) {
          closeMegaMenu();
        }
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [megaMenuOpen]);

  const openCategoryMenu = (category: keyof typeof megaMenuCategories) => {
    if (activeCategory === category && megaMenuOpen) {
      setMegaMenuOpen(false);
      setActiveCategory(null);
    } else {
      setActiveCategory(category);
      setMegaMenuOpen(true);
    }
  };

  const closeMegaMenu = () => {
    setMegaMenuOpen(false);
    setActiveCategory(null);
  };

  const handleSubItemClick = (category: string, item: string) => {
    const slug = item.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace('webgpu-3d-rendering', 'webgpu-3d')
      .replace('iot-edge-computing', 'iot-edge');
    navigate(`/${category.toLowerCase()}/${slug}`);
    closeMegaMenu();
  };

  const openMobileMenu = () => setMobileMenuOpen(true);
  const closeMobileMenu = () => setMobileMenuOpen(false);

  const openAuthFromMobile = (tab?: 'login' | 'register') => {
    if (mobileMenuOpen) {
      closeMobileMenu();
      authModal.open(tab);
    } else {
      authModal.open(tab);
    }
  };

  return (
    <>
      {/* Logo - Left Corner */}
      <div className="fixed top-4 left-4 z-50">
        <button
          onClick={onLogoClick}
          className="flex items-center gap-2 hover:opacity-80 transition-opacity group"
          aria-label="Home"
        >
          <div className="w-8 h-8 sm:w-10 sm:h-10 transition-transform duration-300 group-hover:scale-105">
            {RhineLogo(themeColor)}
          </div>
          <h1 className="text-lg sm:text-xl font-semibold tracking-tight text-white">
            Rhine <span style={{ color: themeColor }}>Solution</span>
          </h1>
        </button>
      </div>

      {/* Desktop Dynamic Island Pill - Only visible on large screens */}
      <div
        ref={pillRef}
        className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 hidden lg:block"
      >
        <div
          className={`
            bg-black/80 backdrop-blur-xl rounded-full border border-white/20 shadow-2xl
            transition-all duration-300 ease-out
            ${megaMenuOpen ? 'shadow-white/10' : ''}
          `}
          style={{
            boxShadow: megaMenuOpen ? `0 0 0 1px ${themeColor}40, 0 8px 20px rgba(0,0,0,0.3)` : undefined
          }}
        >
          <div className="flex items-center gap-1 px-3 sm:px-4 py-2 sm:py-2.5">
            {/* Desktop Navigation - Inside Pill */}
            <div className="flex items-center gap-1">
              {(Object.keys(megaMenuCategories) as Array<keyof typeof megaMenuCategories>).map((name) => {
                const categoryPath = `/${String(name).toLowerCase()}`;
                const isActivePath = pathname === categoryPath || pathname.startsWith(`${categoryPath}/`);
                const isOpen = activeCategory === name && megaMenuOpen;
                const activeClass = isActivePath || isOpen ? 'bg-white/20 text-white' : 'text-white/70 hover:text-white hover:bg-white/10';

                return (
                  <button
                    key={name}
                    onClick={() => openCategoryMenu(name)}
                    className={`nav-trigger px-3 py-1.5 text-sm font-medium rounded-full transition-all duration-200 ${activeClass}`}
                  >
                    {name}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Hamburger Button — rendered only when NOT desktop */}
      {!disableSideMenu && !isDesktop && (
        <div className="fixed top-4 right-4 z-50">
          <button
            onClick={openMobileMenu}
            className="btn btn-ghost btn-circle text-white hover:bg-white/10 transition-colors bg-black/40 backdrop-blur-sm border border-white/20 w-10 h-10 rounded-full flex items-center justify-center"
            aria-label="Open menu"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" />
            </svg>
          </button>
        </div>
      )}

      {/* Desktop Auth Buttons — rendered only on desktop */}
      {showAuthButtons && isDesktop && (
        <div className="fixed top-4 right-4 z-50 flex items-center gap-2">
          <AuthButton
            variant="ghost"
            themeColor={themeColor}
            onClick={() => authModal.open('login')}
            className="text-white/80 hover:text-white text-sm px-4 py-2 rounded-full bg-black/40 backdrop-blur-sm border border-white/20 hover:bg-black/60 transition-all"
            ariaLabel="Login"
          >
            Login
          </AuthButton>
          <AuthButton
            variant="primary"
            themeColor={themeColor}
            onClick={() => authModal.open('register')}
            className="text-sm px-4 py-2 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/20 transition-all"
            ariaLabel="Register"
          >
            Register
          </AuthButton>
        </div>
      )}

      {/* Desktop Mega Menu - Category Specific Dropdown */}
      {megaMenuOpen && activeCategory && (
        <div
          ref={megaMenuRef}
          className="fixed left-0 right-0 z-40 hidden lg:block"
          style={{ top: '80px' }}
        >
          <div className="max-w-3xl mx-auto px-4">
            <div className="bg-black/90 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
                  <h2
                    onClick={() => { navigate(`/${String(activeCategory).toLowerCase()}`); closeMegaMenu(); }}
                    className="text-white font-semibold text-lg cursor-pointer"
                    style={{ color: themeColor }}
                  >
                    {activeCategory}
                  </h2>
                  <button
                    onClick={closeMegaMenu}
                    className="text-white/60 hover:text-white transition-colors p-1 rounded-full hover:bg-white/10"
                    aria-label="Close"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {megaMenuCategories[activeCategory].map((item) => (
                    <button
                      key={item}
                      onClick={() => handleSubItemClick(activeCategory!, item)}
                      className="text-left text-white/80 hover:text-white hover:bg-white/10 px-4 py-3 rounded-xl transition-all duration-200 text-sm flex items-center gap-3 group"
                    >
                      <span className="w-1 h-1 rounded-full bg-white/40 group-hover:bg-white transition-colors"></span>
                      {item}
                    </button>
                  ))}
                </div>

                <div className="mt-6 pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-white/50 text-xs">
                  <div>© 2026 Rhine Solution — Innovation at the edge</div>
                  <div className="flex gap-2">
                    <AuthButton
                      variant="ghost"
                      themeColor={themeColor}
                      onClick={() => { closeMegaMenu(); authModal.open('login'); }}
                      className="text-xs px-3 py-1.5 rounded-full"
                      ariaLabel="Login"
                    >
                      Login
                    </AuthButton>
                    <AuthButton
                      variant="primary"
                      themeColor={themeColor}
                      onClick={() => { closeMegaMenu(); authModal.open('register'); }}
                      className="text-xs px-3 py-1.5 rounded-full"
                      ariaLabel="Register"
                    >
                      Register
                    </AuthButton>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Side Menu */}
      {!disableSideMenu && (
        <SideMenu
          open={mobileMenuOpen}
          onClose={closeMobileMenu}
          themeColor={themeColor}
          onLogin={() => openAuthFromMobile('login')}
          onRegister={() => openAuthFromMobile('register')}
          anchor="right"
          onHoverEnter={() => { }}
          onHoverLeave={() => { }}
        />
      )}
    </>
  );
}

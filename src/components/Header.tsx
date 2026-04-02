import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { RhineLogo } from './GFX';
import SideMenu from './SideMenu';
import AuthButton from './AuthButton';
import { useAuthModal } from './AuthModalProvider';

type HeaderProps = {
  themeColor?: string;
  onLogoClick?: () => void;
  showAuthButtons?: boolean;
  disableSideMenu?: boolean;
  heightClass?: string;
};

const megaMenuCategories = {
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const megaMenuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const authModal = useAuthModal();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (megaMenuOpen && megaMenuRef.current && !megaMenuRef.current.contains(event.target as Node)) {
        const navButtons = document.querySelectorAll('.nav-trigger');
        let clickedOnTrigger = false;
        navButtons.forEach(btn => {
          if (btn.contains(event.target as Node)) clickedOnTrigger = true;
        });
        if (!clickedOnTrigger) {
          setMegaMenuOpen(false);
        }
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [megaMenuOpen]);

  const handleCategoryClick = (category: string) => {
    navigate(`/${category.toLowerCase()}`);
    setMegaMenuOpen(false);
  };

  const handleSubItemClick = (category: string, item: string) => {
    const slug = item.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    navigate(`/${category.toLowerCase()}/${slug}`);
    setMegaMenuOpen(false);
  };

  const toggleMegaMenu = () => setMegaMenuOpen(prev => !prev);
  const closeMegaMenu = () => setMegaMenuOpen(false);
  const openMobileMenu = () => setMobileMenuOpen(true);
  const closeMobileMenu = () => setMobileMenuOpen(false);

  const openAuthFromMobile = () => {
    if (mobileMenuOpen) {
      closeMobileMenu();
      authModal.open();
    } else {
      authModal.open();
    }
  };

  return (
    <>
      <header
        className={`navbar fixed top-0 z-50 px-6 border-b border-white/10 bg-white/5 backdrop-blur-md backdrop-saturate-125 ${heightClass}`}
        style={{
          backgroundImage: `linear-gradient(90deg, rgba(255,255,255,0.04), rgba(0,0,0,0))`
        }}
      >
        <div className="flex-1">
          <button
            onClick={onLogoClick}
            className="btn btn-ghost hover:bg-transparent px-0 gap-3 flex items-center"
            aria-label="Home"
          >
            <div className="w-12 h-12 transition-transform hover:scale-110 duration-500">
              {RhineLogo(themeColor)}
            </div>
            <h1 className="text-2xl font-bold tracking-[0.2em] text-white uppercase">
              Rhine <span style={{ color: themeColor }}>Solution</span>
            </h1>
          </button>
        </div>

        {/* Desktop Navigation */}
        <div className="flex-none hidden lg:flex items-center gap-8">
          <nav className="flex items-center gap-6">
            {Object.keys(megaMenuCategories).map((name) => (
              <button
                key={name}
                onClick={toggleMegaMenu}
                className="nav-trigger text-base font-medium text-white/80 hover:text-white transition-colors"
              >
                {name}
              </button>
            ))}
          </nav>

          {showAuthButtons && (
            <div className="flex items-center gap-3">
              <AuthButton variant="ghost" themeColor={themeColor} onClick={() => authModal.open()} ariaLabel="Login">
                Login
              </AuthButton>
              <AuthButton variant="primary" themeColor={themeColor} onClick={() => authModal.open()} ariaLabel="Register">
                Register
              </AuthButton>
            </div>
          )}
        </div>

        {/* Mobile: hamburger button */}
        <div className="flex-none lg:hidden">
          {!disableSideMenu && (
            <button
              onClick={openMobileMenu}
              className="btn btn-ghost btn-circle text-white"
              aria-label="Open menu"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" />
              </svg>
            </button>
          )}
        </div>
      </header>

      {/* Desktop Mega Menu */}
      {megaMenuOpen && (
        <div
          ref={megaMenuRef}
          className="fixed left-0 right-0 z-40 hidden lg:block"
          style={{ top: '72px' }}
        >
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl">
            <div className="container mx-auto px-8 py-8">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-sm bg-white/20 flex items-center justify-center text-white font-bold">R</div>
                  <div className="text-white font-semibold">Rhine</div>
                </div>
                <button
                  onClick={closeMegaMenu}
                  className="btn btn-ghost btn-sm text-white hover:bg-white/10"
                  aria-label="Close"
                >
                  Close
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-white/90">
                {Object.entries(megaMenuCategories).map(([category, items]) => (
                  <div key={category} className="space-y-3">
                    <h3 className="text-sm uppercase tracking-widest text-white/80">{category}</h3>
                    <div className="space-y-1">
                      {items.map((item) => (
                        <button
                          key={item}
                          onClick={() => handleSubItemClick(category, item)}
                          className="block hover:text-white transition-colors text-white/70 hover:bg-white/10 px-2 py-1 rounded"
                        >
                          {item}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 pt-4 border-t border-white/20 flex items-center justify-between text-white/70 text-sm">
                <div>© 2026 Rhine Solution</div>
                <div className="flex gap-3">
                  <AuthButton variant="ghost" themeColor={themeColor} onClick={() => { closeMegaMenu(); authModal.open(); }} ariaLabel="Login">
                    Login
                  </AuthButton>
                  <AuthButton variant="primary" themeColor={themeColor} onClick={() => { closeMegaMenu(); authModal.open(); }} ariaLabel="Register">
                    Register
                  </AuthButton>
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
          onLogin={openAuthFromMobile}
          onRegister={openAuthFromMobile}
          anchor="right"
          onHoverEnter={() => {}}
          onHoverLeave={() => {}}
        />
      )}
    </>
  );
}

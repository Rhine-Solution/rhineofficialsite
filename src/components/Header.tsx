import { useState, useRef, useEffect } from 'react';
import { RhineLogo } from './GFX';        // use the Rhine logo instead of R
import SideMenu from './SideMenu';
import AuthModal from './AuthModal';

type HeaderProps = {
  themeColor?: string;
  onLogoClick?: () => void;
  showAuthButtons?: boolean;
  disableSideMenu?: boolean;
  heightClass?: string;
};

// Mega menu content: all categories with their items
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
  themeColor = 'white',
  onLogoClick,
  showAuthButtons = false,
  disableSideMenu = false,
  heightClass = 'h-[72px]'
}: HeaderProps) {
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const megaMenuRef = useRef<HTMLDivElement>(null);

  // Close mega menu when clicking outside
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

  const toggleMegaMenu = () => setMegaMenuOpen(prev => !prev);
  const closeMegaMenu = () => setMegaMenuOpen(false);

  const handleSubItemClick = (item: string) => {
    console.log(`Clicked: ${item}`);
    // Replace with your navigation logic
    closeMegaMenu();
  };

  const openMobileMenu = () => setMobileMenuOpen(true);
  const closeMobileMenu = () => setMobileMenuOpen(false);
  const openAuthModal = () => setAuthModalOpen(true);
  const closeAuthModal = () => setAuthModalOpen(false);

  return (
    <>
      <header
        className={`navbar fixed top-0 z-50 px-8 border-b border-white/10 bg-white/5 backdrop-blur-md backdrop-saturate-125 ${heightClass}`}
      >
        <div className="flex-1">
          <button
            onClick={onLogoClick}
            className="btn btn-ghost hover:bg-transparent px-0 gap-3 flex items-center"
            aria-label="Home"
          >
            {/* Logo SVG with hover scale effect */}
            <div className="w-12 h-12 transition-transform hover:scale-110 duration-500">
              {RhineLogo(themeColor)}
            </div>
            {/* Text */}
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

          {/* Auth buttons (optional) */}
          {showAuthButtons && (
            <div className="flex items-center gap-3">
              <button
                onClick={openAuthModal}
                className="btn btn-ghost btn-sm rounded-full px-6 text-white/90"
              >
                Login
              </button>
              <button
                onClick={openAuthModal}
                className="btn btn-primary btn-sm rounded-full px-6"
              >
                Register
              </button>
            </div>
          )}
        </div>

        {/* Mobile: hamburger button (hidden on desktop) */}
        <div className="flex-none lg:hidden">
          {!disableSideMenu && (
            <button
              onClick={openMobileMenu}
              className="btn btn-ghost btn-circle text-white"
              aria-label="Open menu"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" />
              </svg>
            </button>
          )}
        </div>
      </header>

      {/* Desktop Mega Menu – Apple‑style glass */}
      {megaMenuOpen && (
        <div
          ref={megaMenuRef}
          className="fixed left-0 right-0 z-40 hidden lg:block"
          style={{ top: '72px' }} // matches header heightClass="h-[72px]"
        >
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl">
            <div className="container mx-auto px-8 py-8">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-sm bg-white/20 flex items-center justify-center text-white font-bold">
                    R
                  </div>
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
                    <h3 className="text-sm uppercase tracking-widest text-white/80">
                      {category}
                    </h3>
                    <div className="space-y-1">
                      {items.map((item) => (
                        <button
                          key={item}
                          onClick={() => handleSubItemClick(item)}
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
                
              <div className="flex gap-3">
                 
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Side Menu (right‑side glassy panel) */}
      {!disableSideMenu && (
        <SideMenu
          open={mobileMenuOpen}
          onClose={closeMobileMenu}
          themeColor={themeColor}
          onLogin={openAuthModal}
          onRegister={openAuthModal}
          anchor="right"
          onHoverEnter={() => {}}
          onHoverLeave={() => {}}
        />
      )}

      {/* Auth Modal */}
      <AuthModal isOpen={authModalOpen} onClose={closeAuthModal} themeColor={themeColor} />
    </>
  );
}
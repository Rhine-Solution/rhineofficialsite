import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthButton from '../auth/AuthButton';

type Props = {
  open: boolean;
  onClose: () => void;
  themeColor?: string;
  onLogin?: () => void;
  onRegister?: () => void;
  anchor?: 'right' | 'top';
  onHoverEnter?: () => void;
  onHoverLeave?: () => void;
};

export default function SideMenu({
  open,
  onClose,
  themeColor = '#4f46e5',
  onLogin,
  onRegister,
  anchor = 'right',
  onHoverEnter,
  onHoverLeave,
}: Props) {
  const [visible, setVisible] = useState(open);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  useEffect(() => setVisible(open), [open]);

  useEffect(() => {
    const update = () => setIsMobile(window.innerWidth < 1024);
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  const navigate = useNavigate();

  // Dynamic Island glass styles
  const mobileGlass = 'bg-black/80 backdrop-blur-xl border-l border-white/20';
  const topGlass = 'bg-black/80 backdrop-blur-xl border-b border-white/20';

  const nav = [
    {
      title: 'Services',
      items: ['Web Development', 'Cloud Infrastructure', 'IT Consulting', 'Digital Transformation'],
      note: 'Covers the core offerings.',
    },
    {
      title: 'Solutions',
      items: ['Enterprise Software', 'AI & Automation', 'Cybersecurity Suite', 'Data Analytics'],
      note: "Highlights packaged or industry-specific solutions.",
    },
    {
      title: 'Technology',
      items: ['WebGPU / 3D Rendering', 'Blockchain / Web3', 'IoT & Edge Computing', 'Custom APIs'],
      note: 'Focuses on the tools, platforms, and innovation.',
    },
    {
      title: 'Resources',
      items: ['Case Studies', 'Documentation', 'Blog / Insights', 'Support & Community'],
      note: 'Provides value-added content and support.',
    },
  ];

  const hexToRgba = (hex: string, alpha = 1) => {
    const h = hex.replace('#', '');
    const full = h.length === 3 ? h.split('').map(c => c + c).join('') : h;
    const bigint = parseInt(full, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  const handleItemClick = (category: string, item: string) => {
    onClose();
    const slug = item.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    navigate(`/${category.toLowerCase()}/${slug}`);
  };

  const mobileStyle = isMobile
    ? { backgroundImage: `linear-gradient(180deg, ${hexToRgba(themeColor, 0.08)}, rgba(0,0,0,0.02))` }
    : undefined;

  if (anchor === 'right') {
    return (
      <>
        {/* Menu panel */}
        <div
          onMouseEnter={() => onHoverEnter?.()}
          onMouseLeave={() => onHoverLeave?.()}
          className={`fixed top-0 right-0 h-full w-[320px] max-w-[92vw] z-[60] transform transition-transform duration-300 ${
            visible ? 'translate-x-0' : 'translate-x-full'
          }`}
          aria-hidden={!visible}
        >
          <div className={`${mobileGlass} h-full flex flex-col shadow-2xl`} style={mobileStyle}>
            <div className="p-4 flex items-center justify-between border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white font-bold">
                  R
                </div>
                <div className="text-white font-semibold">Rhine</div>
              </div>

              <div className="flex items-center gap-2">
                <AuthButton
                  variant="ghost"
                  themeColor={themeColor}
                  onClick={(e?: any) => {
                    e?.stopPropagation();
                    onLogin?.();
                  }}
                  ariaLabel="Login"
                  className="text-white/80 hover:text-white text-sm px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 transition-all"
                >
                  Login
                </AuthButton>

                <AuthButton
                  variant="primary"
                  themeColor={themeColor}
                  onClick={(e?: any) => {
                    e?.stopPropagation();
                    onRegister?.();
                  }}
                  ariaLabel="Register"
                  className="text-sm px-3 py-1.5 rounded-full bg-white/20 hover:bg-white/30 transition-all"
                >
                  Register
                </AuthButton>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onClose();
                  }}
                  className="p-2 rounded-full hover:bg-white/10 text-white/60 hover:text-white transition-colors"
                  aria-label="Close menu"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M6 6l12 12M6 18L18 6" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>
            </div>

            <nav className="flex-1 overflow-auto px-6 py-8">
              <ul className="space-y-6">
                {nav.map((section) => (
                  <li key={section.title}>
                    <div className="text-xs font-semibold uppercase tracking-wider text-white/50 mb-2">
                      {section.title}
                    </div>
                    <div className="space-y-2">
                      {section.items.map((it) => (
                        <AuthButton
                          key={it}
                          variant="ghost"
                          themeColor={themeColor}
                          onClick={(e?: any) => {
                            e?.stopPropagation();
                            handleItemClick(section.title, it);
                          }}
                          className="w-full text-left text-base font-medium text-white/80 hover:text-white bg-transparent px-0 py-2 rounded-lg hover:bg-white/5 transition-all"
                          ariaLabel={it}
                        >
                          {it}
                        </AuthButton>
                      ))}
                    </div>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="p-4 border-t border-white/10 text-white/50 text-xs flex items-center justify-between">
              <div>© 2026 Rhine Solution</div>
              <div className="flex gap-3">
                <a href="#" className="hover:text-white transition-colors">X/Twitter</a>
                <a href="#" className="hover:text-white transition-colors">LinkedIn</a>
              </div>
            </div>
          </div>
        </div>

        {/* Overlay – behind the menu */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          className={`fixed inset-0 z-50 ${visible ? '' : 'hidden'} bg-black/60 backdrop-blur-sm`}
          aria-hidden={!visible}
        />
      </>
    );
  }

  // top anchored panel (desktop)
  return (
    <div
      onMouseEnter={() => onHoverEnter?.()}
      onMouseLeave={() => onHoverLeave?.()}
      className={`fixed left-0 right-0 top-0 z-[58] transform transition-transform duration-300 ${
        visible ? 'translate-y-0' : '-translate-y-full'
      }`}
      aria-hidden={!visible}
    >
      <div
        className={`${topGlass} mx-auto max-w-[1800px] w-full shadow-2xl rounded-b-2xl`}
        role="dialog"
        aria-modal="true"
      >
        <div className="h-full flex flex-col">
          <div className="p-6 flex items-start justify-between border-b border-white/10">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white font-bold">
                R
              </div>
              <div className="text-white font-semibold">Rhine Solution</div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onClose();
                }}
                className="text-white/60 hover:text-white transition-colors p-2 rounded-full hover:bg-white/10"
                aria-label="Close"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M6 6l12 12M6 18L18 6" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          </div>

          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-6 text-white/80">
            {nav.map((section) => (
              <div key={section.title} className="space-y-3">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-white/50">
                  {section.title}
                </h3>
                <div className="space-y-2">
                  {section.items.map((it) => (
                    <button
                      key={it}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleItemClick(section.title, it);
                      }}
                      className="block w-full text-left text-sm text-white/70 hover:text-white hover:bg-white/10 px-3 py-2 rounded-lg transition-all duration-200"
                    >
                      {it}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-white/50 text-xs">
            <div>© 2026 Rhine Solution — Innovation at the edge</div>
            <div className="flex gap-2">
              <AuthButton
                variant="ghost"
                themeColor={themeColor}
                onClick={(e?: any) => {
                  e?.stopPropagation();
                  onLogin?.();
                }}
                ariaLabel="Login"
                className="text-white/80 hover:text-white text-xs px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 transition-all"
              >
                Login
              </AuthButton>
              <AuthButton
                variant="primary"
                themeColor={themeColor}
                onClick={(e?: any) => {
                  e?.stopPropagation();
                  onRegister?.();
                }}
                ariaLabel="Register"
                className="text-xs px-3 py-1.5 rounded-full bg-white/20 hover:bg-white/30 transition-all"
              >
                Register
              </AuthButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
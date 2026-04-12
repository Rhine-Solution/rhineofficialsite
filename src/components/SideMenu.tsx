import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuthModal } from '../auth/AuthModalProvider';

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
  const [user, setUser] = useState<{ id: string; email?: string; user_metadata?: Record<string, unknown> } | null>(null);
  const [userLoading, setUserLoading] = useState(true);
   
  const _authModal = useAuthModal();
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    setVisible(open);
  }, [open]);

  useEffect(() => {
    setVisible(false);
  }, [location.pathname]);

  useEffect(() => {
    const update = () => setIsMobile(window.innerWidth < 1024);
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
      setUserLoading(false);
    };
    getUser();

    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    return () => listener?.subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    onClose();
  };

   
  const _getUserInitials = () => {
    const name = String(user?.user_metadata?.full_name || user?.user_metadata?.fullName || user?.email || '');
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  };

   
  const _getDisplayName = (): string => {
    const name = user?.user_metadata?.full_name || user?.user_metadata?.fullName;
    if (name) return String(name);
    if (user?.email) return user.email.split('@')[0];
    return 'User';
  };

  // --- NEW: smooth scroll helper for same-page sections ---
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      // fallback: if section doesn't exist, scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Dynamic Island glass styles
  const mobileGlass = 'bg-black/80 backdrop-blur-xl border-l border-white/20';
  const topGlass = 'bg-black/80 backdrop-blur-xl border-b border-white/20';

  const nav = [
    {
      title: 'Home',
      items: ['Expertise', 'The Engine', 'Behind Rhine', "Let's Create"],
      navigateTo: '/',
    },
    {
      title: 'About',
      items: ['Company', 'Team', 'Values', 'Contact'],
      navigateTo: '/about',
    },
    {
      title: 'Portfolio',
      items: ['All Projects', 'Web Development', 'Cloud', 'AI & Automation'],
      navigateTo: '/portfolio',
    },
    {
      title: 'Services',
      items: ['Web Development', 'Cloud Infrastructure', 'IT Consulting', 'Digital Transformation'],
      navigateTo: '/services',
    },
    {
      title: 'Solutions',
      items: ['Enterprise Software', 'AI & Automation', 'Cybersecurity Suite', 'Data Analytics'],
      navigateTo: '/solutions',
    },
    {
      title: 'Technology',
      items: ['WebGPU / 3D Rendering', 'Blockchain / Web3', 'IoT & Edge Computing', 'Custom APIs'],
      navigateTo: '/technology',
    },
    {
      title: 'Resources',
      items: ['Case Studies', 'Documentation', 'Blog / Insights', 'Support & Community'],
      navigateTo: '/resources',
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

    // --- Home category (formerly Rhine) → scroll to sections on the main page ---
    if (category === 'Home' || category === 'Rhine') {
      const sectionMap: Record<string, string> = {
        'Expertise': 'services',
        'The Engine': 'technology',
        'Behind Rhine': 'about',
        "Let's Create": 'contact'
      };
      const sectionId = sectionMap[item];
      if (sectionId) {
        scrollToSection(sectionId);
      } else {
        navigate('/');
      }
      return;
    }

    // --- About category ---
    if (category === 'About') {
      const sectionMap: Record<string, string> = {
        'Company': 'company',
        'Team': 'team',
        'Values': 'values',
        'Contact': 'contact'
      };
      const sectionId = sectionMap[item];
      if (sectionId) {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        } else {
          navigate('/about');
        }
      } else {
        navigate('/about');
      }
      return;
    }

    // --- Portfolio category ---
    if (category === 'Portfolio') {
      const categoryMap: Record<string, string> = {
        'All Projects': '',
        'Web Development': 'Web Development',
        'Cloud': 'Cloud Infrastructure',
        'AI & Automation': 'AI & Automation'
      };
      const filter = categoryMap[item];
      if (filter) {
        navigate(`/portfolio?category=${encodeURIComponent(filter)}`);
      } else {
        navigate('/portfolio');
      }
      return;
    }

    // --- Handle Services, Solutions, Technology, Resources ---
    if (category === 'Services') {
      const sectionMap: Record<string, string> = {
        'Web Development': 'web-development',
        'Cloud Infrastructure': 'cloud-infrastructure',
        'IT Consulting': 'it-consulting',
        'Digital Transformation': 'digital-transformation'
      };
      const sectionId = sectionMap[item];
      if (sectionId) {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        } else {
          navigate('/services');
        }
      } else {
        navigate('/services');
      }
      return;
    }

    if (category === 'Solutions') {
      const sectionMap: Record<string, string> = {
        'Enterprise Software': 'enterprise-software',
        'AI & Automation': 'ai-automation',
        'Cybersecurity Suite': 'cybersecurity-suite',
        'Data Analytics': 'data-analytics'
      };
      const sectionId = sectionMap[item];
      if (sectionId) {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        } else {
          navigate('/solutions');
        }
      } else {
        navigate('/solutions');
      }
      return;
    }

    if (category === 'Technology') {
      const sectionMap: Record<string, string> = {
        'WebGPU / 3D Rendering': 'webgpu-3d',
        'Blockchain / Web3': 'blockchain-web3',
        'IoT & Edge Computing': 'iot-edge',
        'Custom APIs': 'custom-apis'
      };
      const sectionId = sectionMap[item];
      if (sectionId) {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        } else {
          navigate('/technology');
        }
      } else {
        navigate('/technology');
      }
      return;
    }

    if (category === 'Resources') {
      const sectionMap: Record<string, string> = {
        'Case Studies': 'case-studies',
        'Documentation': 'documentation',
        'Blog / Insights': 'blog-insights',
        'Support & Community': 'support-community'
      };
      const sectionId = sectionMap[item];
      if (sectionId) {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        } else {
          navigate('/resources');
        }
      } else {
        navigate('/resources');
      }
      return;
    }

    // --- ORIGINAL LOGIC for all other categories ---
    const slug = item.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace('webgpu-3d-rendering', 'webgpu-3d')
      .replace('iot-edge-computing', 'iot-edge');
    navigate(`/${category.toLowerCase()}/${slug}`);
  };

  const handleCategoryClick = (section: typeof nav[0]) => {
    onClose();
    navigate(section.navigateTo || '/');
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
          className={`fixed top-0 right-0 h-full w-[280px] sm:w-[300px] max-w-[85vw] z-[60] transform transition-transform duration-300 ${
            visible ? 'translate-x-0' : 'translate-x-full'
          }`}
          aria-hidden={!visible}
        >
          <div className={`${mobileGlass} h-full flex flex-col shadow-2xl`} style={mobileStyle}>
            <div className="p-3 flex items-center justify-between border-b border-white/10">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white font-bold text-sm">
                  R
                </div>
                <div className="text-white font-semibold text-sm">Rhine</div>
                <button
                  onClick={() => { onClose(); navigate('/start-project'); }}
                  className="ml-2 px-2 py-1 text-xs rounded-full bg-white/10 hover:bg-white/20 text-white/80 transition-all"
                >
                  Start
                </button>
              </div>

              <div className="flex items-center gap-1">
                {userLoading ? (
                  <div className="w-8 h-8 rounded-full bg-white/10 animate-pulse" />
                ) : user ? (
                  <>
                    <button
                      onClick={() => { onClose(); navigate('/dashboard'); }}
                      className="p-1.5 rounded-full hover:bg-white/10 text-white/60 hover:text-white transition-colors"
                      aria-label="Go to dashboard"
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="3" width="7" height="7" rx="1" />
                        <rect x="14" y="3" width="7" height="7" rx="1" />
                        <rect x="3" y="14" width="7" height="7" rx="1" />
                        <rect x="14" y="14" width="7" height="7" rx="1" />
                      </svg>
                    </button>
                    <button
                      onClick={() => { onClose(); handleLogout(); }}
                      className="p-1.5 rounded-full hover:bg-white/10 text-white/60 hover:text-white transition-colors"
                      aria-label="Log out"
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" />
                      </svg>
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={(e?: any) => {
                        e?.stopPropagation();
                        onLogin?.();
                      }}
                      className="text-white/80 hover:text-white text-xs px-2 py-1 rounded-full bg-white/5 hover:bg-white/10 transition-all"
                    >
                      Login
                    </button>
                    <button
                      onClick={(e?: any) => {
                        e?.stopPropagation();
                        onRegister?.();
                      }}
                      className="text-xs px-2 py-1 rounded-full bg-white/20 hover:bg-white/30 transition-all text-white"
                    >
                      Register
                    </button>
                  </>
                )}

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onClose();
                  }}
                  className="p-1.5 rounded-full hover:bg-white/10 text-white/60 hover:text-white transition-colors"
                  aria-label="Close menu"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M6 6l12 12M6 18L18 6" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>
            </div>

            <nav className="flex-1 overflow-y-auto px-4 py-4">
              <ul className="space-y-4">
                {nav.map((section) => (
                  <li key={section.title}>
                    <button
                      onClick={() => handleCategoryClick(section)}
                      className="text-xs font-semibold uppercase tracking-wider text-white/50 mb-2 text-left w-full hover:text-white transition-colors"
                    >
                      {section.title}
                    </button>
                    <div className="space-y-0">
                      {section.items.map((it) => (
                        <button
                          key={it}
                          onClick={(e?: any) => {
                            e?.stopPropagation();
                            handleItemClick(section.title, it);
                          }}
                          className="w-full text-left text-sm font-medium text-white/70 hover:text-white hover:bg-white/5 px-2 py-2 rounded-lg transition-all"
                        >
                          {it}
                        </button>
                      ))}
                    </div>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="p-3 border-t border-white/10 text-white/40 text-xs flex items-center justify-between">
              <div>© 2026</div>
              <div className="flex gap-2">
                <a href="#" className="hover:text-white transition-colors">X</a>
                <a href="#" className="hover:text-white transition-colors">LI</a>
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
          <div className="p-4 flex items-center justify-between border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white font-bold text-sm">
                R
              </div>
              <div className="text-white font-semibold text-sm">Rhine Solution</div>
              <button
                onClick={() => { onClose(); navigate('/start-project'); }}
                className="ml-2 px-3 py-1 rounded-full text-xs font-medium transition-all"
                style={{ backgroundColor: `${themeColor}30`, color: themeColor }}
              >
                Start Project
              </button>
            </div>
            <div className="flex items-center gap-2">
              {userLoading ? (
                <div className="w-8 h-8 rounded-full bg-white/10 animate-pulse" />
              ) : user ? (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => { onClose(); navigate('/dashboard'); }}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/20 transition-all text-white/80 text-xs"
                  >
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="3" width="7" height="7" rx="1" />
                      <rect x="14" y="3" width="7" height="7" rx="1" />
                      <rect x="3" y="14" width="7" height="7" rx="1" />
                      <rect x="14" y="14" width="7" height="7" rx="1" />
                    </svg>
                    Dashboard
                  </button>
                  <button
                    onClick={() => { onClose(); handleLogout(); }}
                    className="px-2.5 py-1 rounded-full bg-red-500/20 hover:bg-red-500/30 text-red-400 text-xs transition-all"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <>
                  <button
                    onClick={(e?: any) => {
                      e?.stopPropagation();
                      onLogin?.();
                    }}
                    className="text-white/80 hover:text-white text-xs px-2.5 py-1 rounded-full bg-white/5 hover:bg-white/10 transition-all"
                  >
                    Login
                  </button>
                  <button
                    onClick={(e?: any) => {
                      e?.stopPropagation();
                      onRegister?.();
                    }}
                    className="text-xs px-2.5 py-1 rounded-full bg-white/20 hover:bg-white/30 transition-all text-white"
                  >
                    Register
                  </button>
                </>
              )}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onClose();
                }}
                className="text-white/60 hover:text-white transition-colors p-1.5 rounded-full hover:bg-white/10"
                aria-label="Close"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M6 6l12 12M6 18L18 6" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          </div>

          <div className="flex-1 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 p-4 text-white/80">
            {nav.map((section) => (
              <div key={section.title} className="space-y-2">
                <button
                  onClick={() => handleCategoryClick(section)}
                  className="text-xs font-semibold uppercase tracking-wider text-white/40 hover:text-white transition-colors"
                >
                  {section.title}
                </button>
                <div className="space-y-0.5">
                  {section.items.length > 0 ? (
                    section.items.map((it) => (
                      <button
                        key={it}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleItemClick(section.title, it);
                        }}
                        className="block w-full text-left text-xs text-white/60 hover:text-white hover:bg-white/5 px-2 py-1 rounded transition-all duration-200"
                      >
                        {it}
                      </button>
                    ))
                  ) : section.title === 'Start Project' ? (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onClose();
                        navigate('/start-project');
                      }}
                      className="block w-full text-left text-xs hover:bg-white/5 px-2 py-1 rounded transition-all"
                      style={{ color: themeColor }}
                    >
                      Start a new project →
                    </button>
                  ) : null}
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-2 text-white/40 text-xs">
            <div>© 2026 Rhine Solution</div>
            <div className="flex gap-3">
              <a href="#" className="hover:text-white transition-colors">X</a>
              <a href="#" className="hover:text-white transition-colors">LI</a>
              <a href="#" className="hover:text-white transition-colors">GH</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
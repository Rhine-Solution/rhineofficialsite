import { useEffect, useState } from 'react';

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
  themeColor,
  onLogin,
  onRegister,
  anchor = 'right',
  onHoverEnter,
  onHoverLeave,
}: Props) {
  const [visible, setVisible] = useState(open);
  useEffect(() => setVisible(open), [open]);

  const mobileGlass = 'bg-[rgba(0,0,0,0.62)] backdrop-blur-sm backdrop-saturate-110 border-l border-white/6';
  const topGlass = 'bg-[rgba(6,6,6,0.46)] backdrop-blur-sm backdrop-saturate-120 border-b border-white/6';

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

  if (anchor === 'right') {
    return (
      <div
        onMouseEnter={() => onHoverEnter?.()}
        onMouseLeave={() => onHoverLeave?.()}
        className={`fixed top-0 right-0 h-full w-[320px] max-w-[92vw] z-[60] transform transition-transform duration-300 ${
          visible ? 'translate-x-0' : 'translate-x-full'
        }`}
        aria-hidden={!visible}
      >
        <div className={`${mobileGlass} h-full flex flex-col shadow-2xl`}>
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-sm bg-white/5 flex items-center justify-center text-white font-bold">R</div>
              <div className="text-white font-semibold">Rhine</div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={onLogin}
                title="Login"
                className="p-2 rounded-md hover:bg-white/5 transition-colors text-white"
                aria-label="Login"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M15 3v4" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M8 21v-2a4 4 0 0 1 4-4h5" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M17 11l4-4-4-4" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <button
                onClick={onRegister}
                title="Register"
                className="p-2 rounded-md bg-gradient-to-tr from-indigo-500 to-indigo-400 text-white shadow"
                aria-label="Register"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M12 12v6" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M8 12a4 4 0 1 1 8 0" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <button onClick={onClose} className="ml-2 p-2 rounded-md hover:bg-white/5 text-white" aria-label="Close menu">
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
                  <div className="text-sm text-white/60 uppercase tracking-wider mb-2">{section.title}</div>
                  <div className="space-y-2">
                    {section.items.map((it) => (
                      <button
                        key={it}
                        onClick={() => {
                          onClose();
                          const id = it.toLowerCase().replace(/[^a-z0-9]+/gi, '-');
                          setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }), 120);
                        }}
                        className="block w-full text-left text-xl font-semibold text-white/95 hover:text-white transition-colors"
                      >
                        {it}
                      </button>
                    ))}
                  </div>
                </li>
              ))}
            </ul>
          </nav>
          <div className="p-4 border-t border-[rgba(255,255,255,0.04)] text-white/70 text-sm flex items-center justify-between">
            <div>© 2026 Rhine</div>
            <div className="flex gap-3">
              <a className="hover:text-white">X/Twitter</a>
              <a className="hover:text-white">LinkedIn</a>
            </div>
          </div>
        </div>
        <button
          onClick={onClose}
          className={`fixed inset-0 z-50 ${visible ? '' : 'hidden'} bg-black/40`}
          aria-hidden={!visible}
        />
      </div>
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
      style={{ WebkitBackdropFilter: 'none' }}
    >
      <div
        className={`${topGlass} mx-auto max-w-[1800px] w-full h-[340px] shadow-2xl`}
        role="dialog"
        aria-modal="true"
      >
        <div className="h-full flex flex-col">
          <div className="p-6 flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-sm bg-white/5 flex items-center justify-center text-white font-bold">R</div>
              <div className="text-white font-semibold">Rhine</div>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={onClose} className="btn btn-ghost btn-sm text-white" aria-label="Close">
                Close
              </button>
            </div>
          </div>
          <div className="flex-1 grid grid-cols-3 gap-6 p-6 text-white/90">
            {nav.map((section) => (
              <div key={section.title} className="space-y-3">
                <h3 className="text-sm uppercase tracking-widest text-white/60">{section.title}</h3>
                <div className="space-y-1">
                  {section.items.map((it) => (
                    <button
                      key={it}
                      onClick={() => {
                        onClose();
                        const id = it.toLowerCase().replace(/[^a-z0-9]+/gi, '-');
                        setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }), 120);
                      }}
                      className="block hover:text-white"
                    >
                      {it}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="p-4 border-t border-[rgba(255,255,255,0.04)] flex items-center justify-between text-white/70">
            <div className="text-sm">© 2026 Rhine Solution</div>
            <div className="flex gap-3">
              <button onClick={onLogin} className="btn btn-ghost btn-sm">
                Login
              </button>
              <button onClick={onRegister} className="btn btn-primary btn-sm">
                Register
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
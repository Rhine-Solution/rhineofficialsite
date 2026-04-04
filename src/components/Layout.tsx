import React, { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import ScrollToTop from './ScrollToTop';

interface LayoutProps {
  children: ReactNode;
  themeColor?: string;
  showAuthButtons?: boolean;
  disableSideMenu?: boolean;
  onLogoClick?: () => void;
}

export default function Layout({
  children,
  themeColor = '#4f46e5',
  showAuthButtons = false,
  disableSideMenu = false,
  onLogoClick,
}: LayoutProps) {
  const navigate = useNavigate();
  const handleLogoClick = () => {
    // Always navigate home first
    navigate('/');
    // If already on home, allow page-specific onLogoClick behaviour (e.g., scroll to hero)
    try {
      if (window.location.pathname === '/') {
        onLogoClick?.();
      }
    } catch (e) {
      // ignore (server-side or non-window environment)
    }
  };

  const backgroundStyle: React.CSSProperties = {
    backgroundImage: 'linear-gradient(90deg, rgba(255,255,255,0.02), rgba(0,0,0,0))',
    WebkitBackdropFilter: 'saturate(125%) blur(8px)'
  };

  return (
    <div className="app-background min-h-screen flex flex-col relative z-10" style={backgroundStyle}>
      <Header
        themeColor={themeColor}
        showAuthButtons={showAuthButtons}
        disableSideMenu={disableSideMenu}
        onLogoClick={handleLogoClick}
      />

      <ScrollToTop />

      <main className="pt-[72px] min-h-screen flex-1 relative z-10">
        {children}
      </main>

      <Footer themeColor={themeColor} />
    </div>
  );
}
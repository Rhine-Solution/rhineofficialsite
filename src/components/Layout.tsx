import React, { ReactNode } from 'react';
import Header from './Header';
import Footer from './Footer';

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
  const backgroundStyle: React.CSSProperties = {
    backgroundImage: 'linear-gradient(90deg, rgba(255,255,255,0.02), rgba(0,0,0,0))',
    WebkitBackdropFilter: 'saturate(125%) blur(8px)'
  };

  return (
    <div className="app-background min-h-screen flex flex-col" style={backgroundStyle}>
      <Header
        themeColor={themeColor}
        showAuthButtons={showAuthButtons}
        disableSideMenu={disableSideMenu}
        onLogoClick={onLogoClick}
      />

      <main className="pt-[72px] min-h-screen flex-1">
        {children}
      </main>

      <Footer themeColor={themeColor} />
    </div>
  );
}
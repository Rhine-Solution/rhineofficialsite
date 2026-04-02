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
  themeColor = 'white',
  showAuthButtons = false,
  disableSideMenu = false,
  onLogoClick
}: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header
        themeColor={themeColor}
        showAuthButtons={showAuthButtons}
        disableSideMenu={disableSideMenu}
        onLogoClick={onLogoClick}
      />
      <main className="flex-1 pt-[72px]">{children}</main>
      <Footer themeColor={themeColor} />
    </div>
  );
}
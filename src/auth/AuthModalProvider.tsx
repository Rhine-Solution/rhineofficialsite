import React, { createContext, useContext, useState, ReactNode } from 'react';
import AuthModal from './AuthModal';

export type Tab = 'login' | 'register' | 'forgot';

interface AuthModalContextType {
  isOpen: boolean;
  open: (tab?: Tab) => void;
  close: () => void;
}

const AuthModalContext = createContext<AuthModalContextType | undefined>(undefined);

interface AuthModalProviderProps {
  children: ReactNode;
}

export const AuthModalProvider: React.FC<AuthModalProviderProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [initialTab, setInitialTab] = useState<Tab>('login');

  const open = (tab?: Tab) => {
    setInitialTab(tab ?? 'login');
    setIsOpen(true);
  };
  const close = () => setIsOpen(false);

  return (
    <AuthModalContext.Provider value={{ isOpen, open, close }}>
      {children}
      {isOpen && <AuthModal isOpen={isOpen} onClose={close} initialTab={initialTab} />}
    </AuthModalContext.Provider>
  );
};

export const useAuthModal = () => {
  const context = useContext(AuthModalContext);
  if (context === undefined) {
    throw new Error('useAuthModal must be used within an AuthModalProvider');
  }
  return context;
};

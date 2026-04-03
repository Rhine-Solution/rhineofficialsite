import React, { createContext, useContext, useState, ReactNode } from 'react';
import AuthModal from './AuthModal';

interface AuthModalContextType {
  isOpen: boolean;
  open: () => void;
  close: () => void;
}

const AuthModalContext = createContext<AuthModalContextType | undefined>(undefined);

interface AuthModalProviderProps {
  children: ReactNode;
  themeColor: string;
}

export const AuthModalProvider: React.FC<AuthModalProviderProps> = ({ children, themeColor }) => {
  const [isOpen, setIsOpen] = useState(false);

  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);

  return (
    <AuthModalContext.Provider value={{ isOpen, open, close }}>
      {children}
      {isOpen && <AuthModal isOpen={isOpen} onClose={close} themeColor={themeColor} />}
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

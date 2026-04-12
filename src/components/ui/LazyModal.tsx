import { lazy, Suspense, ComponentType, ReactNode, useState, useCallback } from 'react';
import { SkeletonCard } from './Skeleton';

export interface LazyModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  className?: string;
}

export function LazyModal({ isOpen, onClose, children, className = '' }: LazyModalProps) {
  if (!isOpen) return null;
  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm ${className}`}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="bg-black/80 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl max-w-lg w-full"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}

export function useLazyModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [Component, setComponent] = useState<ComponentType<any> | null>(null);
  const [props, setProps] = useState<Record<string, unknown>>({});

  const openModal = useCallback((component: ComponentType<any>, modalProps?: Record<string, unknown>) => {
    setComponent(() => component);
    setProps(modalProps || {});
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    setTimeout(() => {
      setComponent(null);
      setProps({});
    }, 200);
  }, []);

  const ModalWrapper = Component ? (
    <Suspense fallback={<SkeletonCard />}>
      <LazyModal isOpen={isOpen} onClose={closeModal}>
        <Component {...props} onClose={closeModal} />
      </LazyModal>
    </Suspense>
  ) : null;

  return { openModal, closeModal, ModalWrapper, isOpen };
}

export default LazyModal;

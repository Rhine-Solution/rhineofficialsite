'use client';
import { useEffect, useState } from 'react';
import Shepherd from 'shepherd.js';
import 'shepherd.js/dist/css/shepherd.css';
import { useTheme } from 'next-themes';

const steps = [
  {
    id: 'welcome',
    title: 'Welcome to Rhine! 👋',
    text: 'Let us show you around. This tour will take 1 minute.',
    attachTo: { element: '.dashboard-welcome', on: 'bottom' },
    buttons: [{ text: 'Next', action: 'next' }],
  },
  {
    id: 'navigation',
    title: 'Navigation',
    text: 'Use the navbar to access all features: Shop, Travel, Portfolio, and more.',
    attachTo: { element: 'nav', on: 'bottom' },
    buttons: [{ text: 'Back', action: 'back' }, { text: 'Next', action: 'next' }],
  },
  {
    id: 'command-palette',
    title: 'Quick Navigation (⌘K)',
    text: 'Press ⌘K (Ctrl+K) to open the command palette and jump anywhere instantly.',
    attachTo: { element: '.command-palette-hint', on: 'bottom' },
    buttons: [{ text: 'Back', action: 'back' }, { text: 'Next', action: 'next' }],
  },
  {
    id: 'ai-chatbot',
    title: 'AI Assistant',
    text: 'Click the chat button to ask questions about our services. It knows everything about Rhine!',
    attachTo: { element: '.ai-chatbot-button', on: 'left' },
    buttons: [{ text: 'Back', action: 'back' }, { text: 'Finish', action: 'complete' }],
  },
];

export default function OnboardingTour() {
  const [tour, setTour] = useState(null);
  const { theme } = useTheme();
  const [hasSeenTour, setHasSeenTour] = useState(true);

  useEffect(() => {
    const seen = localStorage.getItem('rhine_onboarding_complete');
    setHasSeenTour(!!seen);
  }, []);

  const startTour = () => {
    const newTour = new Shepherd.Tour({
      defaultStepOptions: { cancelIcon: { enabled: true }, scrollTo: { behavior: 'smooth', block: 'center' } },
      useModalOverlay: true,
    });
    
    steps.forEach(step => newTour.addStep({ ...step, classes: theme === 'dark' ? 'shepherd-dark' : '' }));
    
    newTour.on('complete', () => {
      localStorage.setItem('rhine_onboarding_complete', 'true');
      setHasSeenTour(true);
    });
    
    newTour.on('cancel', () => {
      localStorage.setItem('rhine_onboarding_complete', 'true');
      setHasSeenTour(true);
    });
    
    newTour.start();
    setTour(newTour);
  };

  useEffect(() => {
    if (!hasSeenTour) {
      const timer = setTimeout(startTour, 500);
      return () => clearTimeout(timer);
    }
  }, [hasSeenTour]);

  return (
    <button
      onClick={() => { localStorage.removeItem('rhine_onboarding_complete'); setHasSeenTour(false); }}
      className="fixed bottom-24 left-6 z-40 px-3 py-2 bg-white dark:bg-zinc-800 rounded-lg shadow-lg text-sm border dark:border-zinc-700"
    >
      Restart Tour
    </button>
  );
}
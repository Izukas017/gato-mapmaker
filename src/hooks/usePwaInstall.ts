import { useEffect, useState } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

let deferredPromptGlobal: BeforeInstallPromptEvent | null = null;
const listeners = new Set<() => void>();

if (typeof window !== 'undefined') {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPromptGlobal = e as BeforeInstallPromptEvent;
    listeners.forEach((fn) => fn());
  });
  window.addEventListener('appinstalled', () => {
    deferredPromptGlobal = null;
    listeners.forEach((fn) => fn());
  });
}

export function usePwaInstall() {
  const [, setTick] = useState(0);
  const [showIosGuide, setShowIosGuide] = useState(false);

  useEffect(() => {
    const notify = () => setTick((t) => t + 1);
    listeners.add(notify);
    return () => {
      listeners.delete(notify);
    };
  }, []);

  const isStandalone =
    typeof window !== 'undefined' &&
    (window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true);

  const isIos =
    typeof navigator !== 'undefined' &&
    /iphone|ipad|ipod/i.test(navigator.userAgent);

  const canInstall = !isStandalone && (Boolean(deferredPromptGlobal) || isIos);

  const triggerInstall = async () => {
    if (deferredPromptGlobal) {
      await deferredPromptGlobal.prompt();
      await deferredPromptGlobal.userChoice;
      deferredPromptGlobal = null;
      listeners.forEach((fn) => fn());
    } else if (isIos) {
      setShowIosGuide(true);
    }
  };

  return {
    canInstall,
    isStandalone,
    isIos,
    showIosGuide,
    setShowIosGuide,
    triggerInstall,
  };
}

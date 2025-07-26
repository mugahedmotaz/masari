import React, { useState, useEffect } from 'react';
import { Download, X, Smartphone, Monitor, Check } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

interface EnhancedPWAButtonProps {
  forceShow?: boolean; // للاختبار
}

const EnhancedPWAButton: React.FC<EnhancedPWAButtonProps> = ({ forceShow = false }) => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(forceShow);
  const [isInstalled, setIsInstalled] = useState(false);
  const [installMethod, setInstallMethod] = useState<'browser' | 'manual'>('browser');

  useEffect(() => {
    // Check if already installed
    const checkInstalled = () => {
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
      const isInWebAppiOS = (window.navigator as any).standalone === true;
      setIsInstalled(isStandalone || isInWebAppiOS);
    };

    checkInstalled();

    const handleBeforeInstallPrompt = (e: BeforeInstallPromptEvent) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallPrompt(true);
      setInstallMethod('browser');
    };

    const handleAppInstalled = () => {
      setDeferredPrompt(null);
      setShowInstallPrompt(false);
      setIsInstalled(true);
    };

    const handleShowInstall = () => {
      setShowInstallPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt as EventListener);
    window.addEventListener('appinstalled', handleAppInstalled);
    window.addEventListener('show-pwa-install', handleShowInstall);

    // Show manual install option after 5 seconds if no browser prompt
    const timer = setTimeout(() => {
      if (!deferredPrompt && !isInstalled && !forceShow) {
        setShowInstallPrompt(true);
        setInstallMethod('manual');
      }
    }, 5000);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt as EventListener);
      window.removeEventListener('appinstalled', handleAppInstalled);
      window.removeEventListener('show-pwa-install', handleShowInstall);
      clearTimeout(timer);
    };
  }, [forceShow, deferredPrompt, isInstalled]);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      // Browser-supported install
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        console.log('User accepted the install prompt');
      } else {
        console.log('User dismissed the install prompt');
      }
      
      setDeferredPrompt(null);
      setShowInstallPrompt(false);
    } else {
      // Manual install instructions
      setInstallMethod('manual');
    }
  };

  const handleDismiss = () => {
    setShowInstallPrompt(false);
    // Don't show again for this session
    sessionStorage.setItem('pwa-install-dismissed', 'true');
  };

  // Don't show if already installed
  if (isInstalled) {
    return (
      <div className="fixed bottom-4 right-4 z-50 bg-green-100 dark:bg-green-900 rounded-lg shadow-lg border border-green-200 dark:border-green-700 p-3">
        <div className="flex items-center gap-2 text-green-800 dark:text-green-200">
          <Check className="w-4 h-4" />
          <span className="text-sm font-medium">التطبيق مثبت ✓</span>
        </div>
      </div>
    );
  }

  // Don't show if dismissed and not forced
  if (!showInstallPrompt && !forceShow) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 p-4 max-w-sm">
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <Download className="w-5 h-5 text-blue-500" />
          <h3 className="font-semibold text-gray-900 dark:text-white">
            {installMethod === 'browser' ? 'تثبيت التطبيق' : 'إضافة للشاشة الرئيسية'}
          </h3>
        </div>
        <button
          onClick={handleDismiss}
          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      
      <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
        {installMethod === 'browser' 
          ? 'احصل على تجربة أفضل مع التطبيق المثبت على جهازك'
          : 'أضف Masari للشاشة الرئيسية للوصول السريع'
        }
      </p>

      {installMethod === 'browser' ? (
        <div className="flex gap-2">
          <button
            onClick={handleInstallClick}
            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
          >
            <Smartphone className="w-4 h-4" />
            تثبيت
          </button>
          <button
            onClick={handleDismiss}
            className="px-3 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 text-sm transition-colors"
          >
            لاحقاً
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="text-xs text-gray-500 dark:text-gray-400">
            <p className="mb-2">للتثبيت يدوياً:</p>
            <div className="space-y-1">
              <p>• Chrome/Edge: اضغط على ⋮ ← "تثبيت التطبيق"</p>
              <p>• Safari: اضغط على 📤 ← "إضافة للشاشة الرئيسية"</p>
              <p>• Firefox: اضغط على ⋮ ← "تثبيت"</p>
            </div>
          </div>
          <button
            onClick={handleDismiss}
            className="w-full bg-gray-500 hover:bg-gray-600 text-white py-2 px-3 rounded-lg text-sm font-medium transition-colors"
          >
            فهمت
          </button>
        </div>
      )}

      {/* Debug info in development */}
      {import.meta.env.DEV && (
        <div className="mt-2 p-2 bg-gray-100 dark:bg-gray-700 rounded text-xs">
          <p>Debug: {deferredPrompt ? 'Browser prompt available' : 'No browser prompt'}</p>
          <p>Method: {installMethod}</p>
          <p>Forced: {forceShow ? 'Yes' : 'No'}</p>
        </div>
      )}
    </div>
  );
};

export default EnhancedPWAButton;

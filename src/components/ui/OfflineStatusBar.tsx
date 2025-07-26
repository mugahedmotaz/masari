import React from 'react';
import { Wifi, WifiOff, RefreshCw, CheckCircle, AlertCircle } from 'lucide-react';
import { useOfflineStatus, usePWAStatus } from '@/hooks/useOfflineStatus';

const OfflineStatusBar: React.FC = () => {
  const { isOnline, wasOffline, isReconnecting } = useOfflineStatus();
  const { isPWA, isInstallable } = usePWAStatus();

  // Don't show anything if online and never was offline
  if (isOnline && !wasOffline && !isReconnecting) {
    return null;
  }

  const getStatusConfig = () => {
    if (isReconnecting) {
      return {
        icon: <RefreshCw className="w-4 h-4 animate-spin" />,
        text: 'جاري إعادة الاتصال...',
        bgColor: 'bg-yellow-500',
        textColor: 'text-white'
      };
    }
    
    if (!isOnline) {
      return {
        icon: <WifiOff className="w-4 h-4" />,
        text: 'وضع عدم الاتصال - سيتم حفظ التغييرات محلياً',
        bgColor: 'bg-red-500',
        textColor: 'text-white'
      };
    }
    
    if (wasOffline && isOnline) {
      return {
        icon: <CheckCircle className="w-4 h-4" />,
        text: 'تم استعادة الاتصال - جاري مزامنة البيانات',
        bgColor: 'bg-green-500',
        textColor: 'text-white'
      };
    }

    return null;
  };

  const statusConfig = getStatusConfig();
  if (!statusConfig) return null;

  return (
    <div className={`fixed top-0 left-0 right-0 z-50 ${statusConfig.bgColor} ${statusConfig.textColor} py-2 px-4 text-center text-sm font-medium transition-all duration-300`}>
      <div className="flex items-center justify-center gap-2">
        {statusConfig.icon}
        <span>{statusConfig.text}</span>
        {isPWA && (
          <span className="ml-2 px-2 py-1 bg-black bg-opacity-20 rounded text-xs">
            PWA
          </span>
        )}
      </div>
    </div>
  );
};

export default OfflineStatusBar;

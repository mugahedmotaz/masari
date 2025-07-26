import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { offlineStorage, syncManager } from '@/utils/offlineStorage';

interface OfflineContextType {
  isOnline: boolean;
  isInitialized: boolean;
  syncInProgress: boolean;
  saveOfflineData: <T>(storeName: string, data: T) => Promise<void>;
  getOfflineData: <T>(storeName: string, id?: string) => Promise<T | T[] | undefined>;
  deleteOfflineData: (storeName: string, id: string) => Promise<void>;
  showOfflineToast: (message: string) => void;
}

const OfflineContext = createContext<OfflineContextType | undefined>(undefined);

interface OfflineProviderProps {
  children: ReactNode;
}

export const OfflineProvider: React.FC<OfflineProviderProps> = ({ children }) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isInitialized, setIsInitialized] = useState(false);
  const [syncInProgress, setSyncInProgress] = useState(false);

  useEffect(() => {
    const initializeOfflineStorage = async () => {
      try {
        await offlineStorage.init();
        setIsInitialized(true);
      } catch (error) {
        console.error('Failed to initialize offline storage:', error);
      }
    };

    initializeOfflineStorage();
  }, []);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setSyncInProgress(true);
      
      // Simulate sync process
      setTimeout(() => {
        setSyncInProgress(false);
        showOfflineToast('تم الاتصال بالإنترنت - جاري مزامنة البيانات');
      }, 2000);
    };

    const handleOffline = () => {
      setIsOnline(false);
      showOfflineToast('لا يوجد اتصال بالإنترنت - سيتم حفظ التغييرات محلياً');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const saveOfflineData = async <T,>(storeName: string, data: T): Promise<void> => {
    try {
      await syncManager.saveOffline(storeName, data);
    } catch (error) {
      console.error('Failed to save offline data:', error);
      throw error;
    }
  };

  const getOfflineData = async <T,>(storeName: string, id?: string): Promise<T | T[] | undefined> => {
    try {
      if (id) {
        return await offlineStorage.get<T>(storeName, id);
      } else {
        return await offlineStorage.getAll<T>(storeName);
      }
    } catch (error) {
      console.error('Failed to get offline data:', error);
      return undefined;
    }
  };

  const deleteOfflineData = async (storeName: string, id: string): Promise<void> => {
    try {
      await offlineStorage.delete(storeName, id);
    } catch (error) {
      console.error('Failed to delete offline data:', error);
      throw error;
    }
  };

  const showOfflineToast = (message: string) => {
    // Create a simple toast notification
    const toast = document.createElement('div');
    toast.className = `
      fixed top-4 right-4 z-50 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg
      transform transition-transform duration-300 translate-x-full
    `;
    toast.textContent = message;
    
    document.body.appendChild(toast);
    
    // Animate in
    setTimeout(() => {
      toast.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
      toast.style.transform = 'translateX(full)';
      setTimeout(() => {
        document.body.removeChild(toast);
      }, 300);
    }, 3000);
  };

  const value: OfflineContextType = {
    isOnline,
    isInitialized,
    syncInProgress,
    saveOfflineData,
    getOfflineData,
    deleteOfflineData,
    showOfflineToast
  };

  return (
    <OfflineContext.Provider value={value}>
      {children}
    </OfflineContext.Provider>
  );
};

export const useOffline = (): OfflineContextType => {
  const context = useContext(OfflineContext);
  if (!context) {
    throw new Error('useOffline must be used within an OfflineProvider');
  }
  return context;
};

// Offline status indicator component
export const OfflineIndicator: React.FC = () => {
  const { isOnline, syncInProgress } = useOffline();

  if (isOnline && !syncInProgress) return null;

  return (
    <div className={`fixed top-0 left-0 right-0 z-50 text-center py-2 text-sm font-medium ${
      !isOnline 
        ? 'bg-red-500 text-white' 
        : 'bg-yellow-500 text-black'
    }`}>
      {!isOnline ? (
        <span>🔌 وضع عدم الاتصال - سيتم حفظ التغييرات محلياً</span>
      ) : (
        <span>🔄 جاري مزامنة البيانات...</span>
      )}
    </div>
  );
};

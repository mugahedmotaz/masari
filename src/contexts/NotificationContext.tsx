import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { Notification, NotificationSettings } from '@/types/Notification';

interface NotificationContextType {
  notifications: Notification[];
  settings: NotificationSettings;
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt' | 'read'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: string) => void;
  clearAll: () => void;
  updateSettings: (settings: Partial<NotificationSettings>) => void;
  scheduleReminder: (title: string, message: string, scheduledFor: string, relatedId?: string, relatedType?: 'task' | 'goal' | 'habit') => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

const defaultSettings: NotificationSettings = {
  enabled: true,
  taskReminders: true,
  goalDeadlines: true,
  habitReminders: true,
  weeklyReview: true,
  soundEnabled: true,
  browserNotifications: true,
  reminderTime: '09:00'
};

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [settings, setSettings] = useState<NotificationSettings>(defaultSettings);

  // Load notifications and settings from localStorage
  useEffect(() => {
    const savedNotifications = localStorage.getItem('groth-notifications');
    const savedSettings = localStorage.getItem('groth-notification-settings');
    
    if (savedNotifications) {
      setNotifications(JSON.parse(savedNotifications));
    }
    
    if (savedSettings) {
      setSettings({ ...defaultSettings, ...JSON.parse(savedSettings) });
    }
  }, []);

  // Save notifications to localStorage
  useEffect(() => {
    localStorage.setItem('groth-notifications', JSON.stringify(notifications));
  }, [notifications]);

  // Save settings to localStorage
  useEffect(() => {
    localStorage.setItem('groth-notification-settings', JSON.stringify(settings));
  }, [settings]);

  // Request browser notification permission
  useEffect(() => {
    if (settings.browserNotifications && 'Notification' in window) {
      if (Notification.permission === 'default') {
        Notification.requestPermission();
      }
    }
  }, [settings.browserNotifications]);

  // Check for scheduled notifications
  useEffect(() => {
    const checkScheduledNotifications = () => {
      const now = new Date();
      const scheduledNotifications = notifications.filter(
        n => n.scheduledFor && new Date(n.scheduledFor) <= now && !n.read
      );

      scheduledNotifications.forEach(notification => {
        // Show browser notification if enabled
        if (settings.browserNotifications && 'Notification' in window && Notification.permission === 'granted') {
          new Notification(notification.title, {
            body: notification.message,
            icon: '/favicon.ico',
            tag: notification.id
          });
        }

        // Play sound if enabled
        if (settings.soundEnabled) {
          // You can add a notification sound here
          const audio = new Audio('/notification-sound.mp3');
          audio.play().catch(() => {}); // Ignore errors if sound file doesn't exist
        }
      });
    };

    const interval = setInterval(checkScheduledNotifications, 60000); // Check every minute
    checkScheduledNotifications(); // Check immediately

    return () => clearInterval(interval);
  }, [notifications, settings]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const addNotification = (notification: Omit<Notification, 'id' | 'createdAt' | 'read'>) => {
    if (!settings.enabled) return;

    const newNotification: Notification = {
      ...notification,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      read: false
    };

    setNotifications(prev => [newNotification, ...prev]);

    // Show immediate browser notification if not scheduled
    if (!notification.scheduledFor && settings.browserNotifications && 'Notification' in window && Notification.permission === 'granted') {
      new Notification(notification.title, {
        body: notification.message,
        icon: '/favicon.ico',
        tag: newNotification.id
      });
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const updateSettings = (newSettings: Partial<NotificationSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const scheduleReminder = (
    title: string, 
    message: string, 
    scheduledFor: string, 
    relatedId?: string, 
    relatedType?: 'task' | 'goal' | 'habit'
  ) => {
    addNotification({
      title,
      message,
      type: 'reminder',
      priority: 'medium',
      scheduledFor,
      relatedId,
      relatedType,
      persistent: true
    });
  };

  return (
    <NotificationContext.Provider value={{
      notifications,
      settings,
      unreadCount,
      addNotification,
      markAsRead,
      markAllAsRead,
      deleteNotification,
      clearAll,
      updateSettings,
      scheduleReminder
    }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

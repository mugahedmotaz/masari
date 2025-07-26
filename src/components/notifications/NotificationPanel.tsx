import React, { useState } from 'react';
import { Bell, X, Check, CheckCheck, Trash2, Settings, Filter, Clock, AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react';
import { useNotifications } from '@/contexts/NotificationContext';
import type { Notification, NotificationFilter } from '@/types/Notification';
// import { formatDistanceToNow } from 'date-fns';
// import { ar } from 'date-fns/locale';

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const NotificationPanel: React.FC<NotificationPanelProps> = ({ isOpen, onClose }) => {
  const { notifications, unreadCount, markAsRead, markAllAsRead, deleteNotification, clearAll } = useNotifications();
  const [filter, setFilter] = useState<NotificationFilter>('all');

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'warning': return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'error': return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'reminder': return <Clock className="w-5 h-5 text-blue-500" />;
      default: return <Info className="w-5 h-5 text-gray-500" />;
    }
  };

  const getNotificationBg = (type: string, read: boolean) => {
    const opacity = read ? 'bg-opacity-30' : 'bg-opacity-50';
    switch (type) {
      case 'success': return `bg-green-50 dark:bg-green-900 ${opacity}`;
      case 'warning': return `bg-yellow-50 dark:bg-yellow-900 ${opacity}`;
      case 'error': return `bg-red-50 dark:bg-red-900 ${opacity}`;
      case 'reminder': return `bg-blue-50 dark:bg-blue-900 ${opacity}`;
      default: return `bg-gray-50 dark:bg-gray-800 ${opacity}`;
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    switch (filter) {
      case 'unread': return !notification.read;
      case 'reminders': return notification.type === 'reminder';
      case 'tasks': return notification.relatedType === 'task';
      case 'goals': return notification.relatedType === 'goal';
      default: return true;
    }
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center pt-16 px-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-blue-500" />
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">الإشعارات</h2>
            {unreadCount > 0 && (
              <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                {unreadCount}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Controls */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-3">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as NotificationFilter)}
              className="text-sm px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="all">جميع الإشعارات</option>
              <option value="unread">غير مقروءة</option>
              <option value="reminders">التذكيرات</option>
              <option value="tasks">المهام</option>
              <option value="goals">الأهداف</option>
            </select>
            
            <div className="flex gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 flex items-center gap-1"
                >
                  <CheckCheck className="w-4 h-4" />
                  قراءة الكل
                </button>
              )}
              {notifications.length > 0 && (
                <button
                  onClick={clearAll}
                  className="text-sm text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 flex items-center gap-1"
                >
                  <Trash2 className="w-4 h-4" />
                  حذف الكل
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto">
          {filteredNotifications.length === 0 ? (
            <div className="p-8 text-center">
              <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                {filter === 'all' ? 'لا توجد إشعارات' : `لا توجد إشعارات ${filter === 'unread' ? 'غير مقروءة' : filter === 'reminders' ? 'تذكيرات' : filter}`}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {filter === 'all' ? 'ستظهر الإشعارات هنا عند وجودها' : 'جرب تغيير الفلتر لرؤية إشعارات أخرى'}
              </p>
            </div>
          ) : (
            <div className="p-2 space-y-2">
              {filteredNotifications.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onMarkAsRead={markAsRead}
                  onDelete={deleteNotification}
                  getIcon={getNotificationIcon}
                  getBg={getNotificationBg}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Individual Notification Item Component
const NotificationItem: React.FC<{
  notification: Notification;
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
  getIcon: (type: string) => React.ReactNode;
  getBg: (type: string, read: boolean) => string;
}> = ({ notification, onMarkAsRead, onDelete, getIcon, getBg }) => {
  const timeAgo = new Date(notification.createdAt).toLocaleDateString('ar-SA', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className={`rounded-lg p-3 border transition-all ${getBg(notification.type, notification.read)} ${
      notification.read ? 'border-gray-200 dark:border-gray-700' : 'border-blue-200 dark:border-blue-800'
    }`}>
      <div className="flex items-start gap-3">
        {getIcon(notification.type)}
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h4 className={`font-medium text-sm ${notification.read ? 'text-gray-700 dark:text-gray-300' : 'text-gray-900 dark:text-white'}`}>
              {notification.title}
            </h4>
            <div className="flex items-center gap-1">
              {!notification.read && (
                <button
                  onClick={() => onMarkAsRead(notification.id)}
                  className="p-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                  title="تحديد كمقروء"
                >
                  <Check className="w-3 h-3" />
                </button>
              )}
              <button
                onClick={() => onDelete(notification.id)}
                className="p-1 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                title="حذف"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          </div>
          
          <p className={`text-xs mt-1 ${notification.read ? 'text-gray-600 dark:text-gray-400' : 'text-gray-700 dark:text-gray-300'}`}>
            {notification.message}
          </p>
          
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {timeAgo}
            </span>
            
            {notification.priority === 'high' && (
              <span className="text-xs bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-300 px-2 py-1 rounded-full">
                عالية
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationPanel;

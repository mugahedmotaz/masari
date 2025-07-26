export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'reminder';
  priority: 'low' | 'medium' | 'high';
  read: boolean;
  createdAt: string;
  scheduledFor?: string;
  relatedId?: string; // ID of related task/goal
  relatedType?: 'task' | 'goal' | 'habit';
  actionUrl?: string;
  persistent?: boolean; // Should persist after page refresh
}

export interface NotificationSettings {
  enabled: boolean;
  taskReminders: boolean;
  goalDeadlines: boolean;
  habitReminders: boolean;
  weeklyReview: boolean;
  soundEnabled: boolean;
  browserNotifications: boolean;
  reminderTime: string; // Default reminder time (e.g., "09:00")
}

export type NotificationFilter = 'all' | 'unread' | 'reminders' | 'tasks' | 'goals';

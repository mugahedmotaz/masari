export interface Habit {
  id: string;
  title: string;
  description?: string;
  category: string;
  frequency: 'daily' | 'weekly' | 'custom';
  targetDays?: number[]; // For weekly: [0,1,2,3,4,5,6] (Sunday = 0)
  targetCount?: number; // For habits with counts (e.g., drink 8 glasses of water)
  unit?: string; // e.g., 'glasses', 'minutes', 'pages'
  color: string;
  icon?: string;
  createdAt: string;
  isActive: boolean;
  reminderTime?: string; // e.g., "09:00"
  reminderEnabled: boolean;
}

export interface HabitEntry {
  id: string;
  habitId: string;
  date: string; // YYYY-MM-DD format
  completed: boolean;
  count?: number; // For countable habits
  notes?: string;
  completedAt?: string;
}

export interface HabitStats {
  totalHabits: number;
  activeHabits: number;
  completedToday: number;
  currentStreak: number;
  longestStreak: number;
  completionRate: number; // Percentage for current month
  weeklyProgress: number[]; // Last 7 days completion rate
}

export interface HabitCalendarData {
  date: string;
  completed: boolean;
  count?: number;
  level: 0 | 1 | 2 | 3 | 4; // Intensity level for visual representation
}

export type HabitFilter = 'all' | 'active' | 'completed-today' | 'missed-today';
export type HabitSort = 'created' | 'title' | 'category' | 'streak';

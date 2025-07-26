import React, { useState, useEffect } from 'react';
import { Plus, Calendar, TrendingUp, Target, Filter, Search } from 'lucide-react';
import { Habit, HabitEntry, HabitStats, HabitFilter, HabitSort } from '@/types/Habit';
import { useNotifications } from '@/contexts/NotificationContext';
import { useOffline } from '@/contexts/OfflineContext';
import HabitCard from './HabitCard';
import HabitCalendar from './HabitCalendar';
import AddHabitModal from './AddHabitModal';

const HabitManager: React.FC = () => {
  const { addNotification, scheduleReminder } = useNotifications();
  const { saveOfflineData, getOfflineData, isOnline } = useOffline();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [entries, setEntries] = useState<HabitEntry[]>([]);
  const [filter, setFilter] = useState<HabitFilter>('all');
  const [sort, setSort] = useState<HabitSort>('created');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedHabit, setSelectedHabit] = useState<Habit | null>(null);
  const [stats, setStats] = useState<HabitStats>({
    totalHabits: 0,
    activeHabits: 0,
    completedToday: 0,
    currentStreak: 0,
    longestStreak: 0,
    completionRate: 0,
    weeklyProgress: []
  });

  // Load habits and entries from offline storage
  useEffect(() => {
    const loadData = async () => {
      try {
        const savedHabits = await getOfflineData<Habit[]>('habits');
        const savedEntries = await getOfflineData<HabitEntry[]>('habitEntries');
        
        if (savedHabits && Array.isArray(savedHabits)) {
          setHabits(savedHabits as Habit[]);
        } else {
          // Fallback to localStorage for migration
          const localHabits = localStorage.getItem('habits');
          if (localHabits) {
            const parsedHabits = JSON.parse(localHabits);
            setHabits(parsedHabits);
            await saveOfflineData('habits', parsedHabits);
          }
        }
        
        if (savedEntries && Array.isArray(savedEntries)) {
          setEntries(savedEntries as HabitEntry[]);
        } else {
          // Fallback to localStorage for migration
          const localEntries = localStorage.getItem('habitEntries');
          if (localEntries) {
            const parsedEntries = JSON.parse(localEntries);
            setEntries(parsedEntries);
            await saveOfflineData('habitEntries', parsedEntries);
          }
        }
      } catch (error) {
        console.error('Failed to load habits data:', error);
      }
    };
    
    loadData();
  }, [getOfflineData, saveOfflineData]);

  // Save habits and entries to offline storage
  useEffect(() => {
    const saveHabits = async () => {
      try {
        await saveOfflineData('habits', habits);
        localStorage.setItem('habits', JSON.stringify(habits));
      } catch (error) {
        console.error('Failed to save habits:', error);
        localStorage.setItem('habits', JSON.stringify(habits));
      }
    };
    
    if (habits.length > 0) {
      saveHabits();
    }
  }, [habits, saveOfflineData]);
  
  useEffect(() => {
    const saveEntries = async () => {
      try {
        await saveOfflineData('habitEntries', entries);
        localStorage.setItem('habitEntries', JSON.stringify(entries));
      } catch (error) {
        console.error('Failed to save habit entries:', error);
        localStorage.setItem('habitEntries', JSON.stringify(entries));
      }
    };
    
    if (entries.length > 0) {
      saveEntries();
    }
  }, [entries, saveOfflineData]);

  // Calculate statistics
  useEffect(() => {
    calculateStats();
  }, [habits, entries]);

  const calculateStats = () => {
    const today = new Date().toISOString().split('T')[0];
    const activeHabits = habits.filter(h => h.isActive);
    const todayEntries = entries.filter(e => e.date === today && e.completed);
    
    // Calculate completion rate for current month
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const monthEntries = entries.filter(e => {
      const entryDate = new Date(e.date);
      return entryDate.getMonth() === currentMonth && entryDate.getFullYear() === currentYear;
    });
    
    const completionRate = activeHabits.length > 0 
      ? Math.round((monthEntries.filter(e => e.completed).length / (activeHabits.length * new Date().getDate())) * 100)
      : 0;

    // Calculate weekly progress (last 7 days)
    const weeklyProgress = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const dayEntries = entries.filter(e => e.date === dateStr && e.completed);
      const dayRate = activeHabits.length > 0 ? (dayEntries.length / activeHabits.length) * 100 : 0;
      weeklyProgress.push(dayRate);
    }

    setStats({
      totalHabits: habits.length,
      activeHabits: activeHabits.length,
      completedToday: todayEntries.length,
      currentStreak: calculateCurrentStreak(),
      longestStreak: calculateLongestStreak(),
      completionRate,
      weeklyProgress
    });
  };

  const calculateCurrentStreak = (): number => {
    // Calculate current streak for all active habits
    let streak = 0;
    const today = new Date();
    
    for (let i = 0; i < 365; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const activeHabits = habits.filter(h => h.isActive);
      const dayEntries = entries.filter(e => e.date === dateStr && e.completed);
      
      if (activeHabits.length === 0 || dayEntries.length < activeHabits.length) {
        break;
      }
      
      streak++;
    }
    
    return streak;
  };

  const calculateLongestStreak = (): number => {
    // Calculate longest streak for all active habits
    let longestStreak = 0;
    let currentStreak = 0;
    
    // Sort entries by date
    const sortedEntries = entries.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    // Group entries by date
    const entriesByDate: { [key: string]: HabitEntry[] } = {};
    sortedEntries.forEach(entry => {
      if (!entriesByDate[entry.date]) {
        entriesByDate[entry.date] = [];
      }
      entriesByDate[entry.date].push(entry);
    });

    // Calculate streak
    Object.keys(entriesByDate).forEach(date => {
      const activeHabits = habits.filter(h => h.isActive);
      const dayEntries = entriesByDate[date].filter(e => e.completed);
      
      if (activeHabits.length > 0 && dayEntries.length === activeHabits.length) {
        currentStreak++;
        longestStreak = Math.max(longestStreak, currentStreak);
      } else {
        currentStreak = 0;
      }
    });
    
    return longestStreak;
  };

  // Add new habit
  const handleAddHabit = (habit: Omit<Habit, 'id' | 'createdAt'>) => {
    const newHabit: Habit = {
      ...habit,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    
    setHabits(prev => [...prev, newHabit]);
    setShowAddModal(false);
    
    // Add success notification
    addNotification({
      title: 'تم إضافة العادة بنجاح',
      message: `تم إضافة العادة "${habit.title}" إلى قائمة عاداتك`,
      type: 'success',
      priority: 'low',
      relatedId: newHabit.id,
      relatedType: 'habit'
    });

    // Schedule daily reminder if enabled
    if (habit.reminderEnabled && habit.reminderTime) {
      const today = new Date();
      const reminderDate = new Date(today);
      const [hours, minutes] = habit.reminderTime.split(':');
      reminderDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);
      
      if (reminderDate > new Date()) {
        scheduleReminder(
          `تذكير: ${habit.title}`,
          `حان وقت ممارسة عادة "${habit.title}"`,
          reminderDate.toISOString(),
          newHabit.id,
          'habit'
        );
      }
    }
  };

  // Toggle habit completion for today
  const handleToggleHabit = (habitId: string, count?: number) => {
    const today = new Date().toISOString().split('T')[0];
    const existingEntry = entries.find(e => e.habitId === habitId && e.date === today);
    const habit = habits.find(h => h.id === habitId);
    
    if (existingEntry) {
      // Update existing entry
      setEntries(prev => prev.map(entry => 
        entry.id === existingEntry.id 
          ? { ...entry, completed: !entry.completed, count, completedAt: !entry.completed ? new Date().toISOString() : undefined }
          : entry
      ));
    } else {
      // Create new entry
      const newEntry: HabitEntry = {
        id: crypto.randomUUID(),
        habitId,
        date: today,
        completed: true,
        count,
        completedAt: new Date().toISOString()
      };
      setEntries(prev => [...prev, newEntry]);
    }

    // Add completion notification
    if (habit && (!existingEntry || !existingEntry.completed)) {
      addNotification({
        title: 'تم إنجاز العادة! 🎉',
        message: `أحسنت! تم إنجاز عادة "${habit.title}" لليوم`,
        type: 'success',
        priority: 'medium',
        relatedId: habitId,
        relatedType: 'habit'
      });
    }
  };

  // Update habit
  const handleUpdateHabit = (habitId: string, updates: Partial<Habit>) => {
    setHabits(prev => prev.map(habit => 
      habit.id === habitId ? { ...habit, ...updates } : habit
    ));
  };

  // Delete habit
  const handleDeleteHabit = (habitId: string) => {
    const habitToDelete = habits.find(h => h.id === habitId);
    setHabits(prev => prev.filter(habit => habit.id !== habitId));
    setEntries(prev => prev.filter(entry => entry.habitId !== habitId));
    
    if (habitToDelete) {
      addNotification({
        title: 'تم حذف العادة',
        message: `تم حذف العادة "${habitToDelete.title}" وجميع بياناتها`,
        type: 'info',
        priority: 'low',
        relatedId: habitId,
        relatedType: 'habit'
      });
    }
  };

  // Filter and sort habits
  const filteredAndSortedHabits = habits
    .filter(habit => {
      // Filter by status
      const today = new Date().toISOString().split('T')[0];
      const todayEntry = entries.find(e => e.habitId === habit.id && e.date === today);
      
      switch (filter) {
        case 'active': return habit.isActive;
        case 'completed-today': return todayEntry?.completed;
        case 'missed-today': return habit.isActive && !todayEntry?.completed;
        default: return true;
      }
    })
    .filter(habit => {
      // Filter by search term
      if (searchTerm && !habit.title.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }
      return true;
    })
    .sort((a, b) => {
      switch (sort) {
        case 'title': return a.title.localeCompare(b.title);
        case 'category': return a.category.localeCompare(b.category);
        case 'created': return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        default: return 0;
      }
    });

  return (
    <div className="space-y-6">
      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">إجمالي العادات</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalHabits}</p>
            </div>
            <Target className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">مكتملة اليوم</p>
              <p className="text-2xl font-bold text-green-600">{stats.completedToday}</p>
            </div>
            <Calendar className="w-8 h-8 text-green-500" />
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">السلسلة الحالية</p>
              <p className="text-2xl font-bold text-orange-600">{stats.currentStreak}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-orange-500" />
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">معدل الإنجاز</p>
              <p className="text-2xl font-bold text-purple-600">{stats.completionRate}%</p>
            </div>
            <TrendingUp className="w-8 h-8 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="البحث في العادات..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            {/* Filter */}
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as HabitFilter)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">جميع العادات</option>
              <option value="active">نشطة</option>
              <option value="completed-today">مكتملة اليوم</option>
              <option value="missed-today">فائتة اليوم</option>
            </select>
            
            {/* Sort */}
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as HabitSort)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="created">تاريخ الإنشاء</option>
              <option value="title">الاسم</option>
              <option value="category">الفئة</option>
            </select>
          </div>
          
          {/* Add Habit Button */}
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Plus className="w-4 h-4" />
            عادة جديدة
          </button>
        </div>
      </div>

      {/* Habits Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAndSortedHabits.length === 0 ? (
          <div className="col-span-full bg-white dark:bg-gray-800 rounded-xl p-12 shadow-sm border border-gray-200 dark:border-gray-700 text-center">
            <Target className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              {filter === 'all' ? 'لا توجد عادات' : `لا توجد عادات ${filter === 'active' ? 'نشطة' : filter === 'completed-today' ? 'مكتملة اليوم' : 'فائتة اليوم'}`}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {filter === 'all' ? 'ابدأ بإضافة عادتك الأولى لتطوير نفسك' : 'جرب تغيير الفلتر لرؤية عادات أخرى'}
            </p>
            {filter === 'all' && (
              <button
                onClick={() => setShowAddModal(true)}
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition-colors"
              >
                إضافة عادة جديدة
              </button>
            )}
          </div>
        ) : (
          filteredAndSortedHabits.map(habit => (
            <HabitCard
              key={habit.id}
              habit={habit}
              entries={entries.filter(e => e.habitId === habit.id)}
              onToggle={handleToggleHabit}
              onUpdate={handleUpdateHabit}
              onDelete={handleDeleteHabit}
              onViewCalendar={() => setSelectedHabit(habit)}
            />
          ))
        )}
      </div>

      {/* Calendar Modal */}
      {selectedHabit && (
        <HabitCalendar
          habit={selectedHabit}
          entries={entries.filter(e => e.habitId === selectedHabit.id)}
          onClose={() => setSelectedHabit(null)}
        />
      )}

      {/* Add Habit Modal */}
      {showAddModal && (
        <AddHabitModal
          onAdd={handleAddHabit}
          onClose={() => setShowAddModal(false)}
        />
      )}
    </div>
  );
};

export default HabitManager;

import React, { useState } from 'react';
import { Calendar, Edit2, Trash2, Clock, Target, TrendingUp, CheckCircle2, Circle } from 'lucide-react';
import { Habit, HabitEntry } from '@/types/Habit';

interface HabitCardProps {
  habit: Habit;
  entries: HabitEntry[];
  onToggle: (habitId: string, count?: number) => void;
  onUpdate: (habitId: string, updates: Partial<Habit>) => void;
  onDelete: (habitId: string) => void;
  onViewCalendar: () => void;
}

const HabitCard: React.FC<HabitCardProps> = ({ 
  habit, 
  entries, 
  onToggle, 
  onUpdate, 
  onDelete, 
  onViewCalendar 
}) => {
  const [count, setCount] = useState<number>(1);
  const [showCountInput, setShowCountInput] = useState(false);

  const today = new Date().toISOString().split('T')[0];
  const todayEntry = entries.find(e => e.date === today);
  const isCompletedToday = todayEntry?.completed || false;

  // Calculate streak
  const calculateStreak = (): number => {
    let streak = 0;
    const sortedEntries = entries
      .filter(e => e.completed)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    const today = new Date();
    for (let i = 0; i < 365; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const hasEntry = sortedEntries.some(e => e.date === dateStr);
      if (hasEntry) {
        streak++;
      } else {
        break;
      }
    }
    
    return streak;
  };

  // Calculate completion rate for last 30 days
  const calculateCompletionRate = (): number => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentEntries = entries.filter(e => new Date(e.date) >= thirtyDaysAgo);
    const completedEntries = recentEntries.filter(e => e.completed);
    
    return recentEntries.length > 0 ? Math.round((completedEntries.length / 30) * 100) : 0;
  };

  const handleToggle = () => {
    if (habit.targetCount && habit.targetCount > 1 && !isCompletedToday) {
      setShowCountInput(true);
    } else {
      onToggle(habit.id, habit.targetCount ? count : undefined);
    }
  };

  const handleCountSubmit = () => {
    onToggle(habit.id, count);
    setShowCountInput(false);
    setCount(1);
  };

  const streak = calculateStreak();
  const completionRate = calculateCompletionRate();

  return (
    <div className={`rounded-xl p-4 shadow-sm border transition-all ${
      isCompletedToday 
        ? 'border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20' 
        : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'
    }`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div 
            className="w-3 h-3 rounded-full" 
            style={{ backgroundColor: habit.color }}
          ></div>
          <div>
            <h3 className={`font-medium ${isCompletedToday ? 'text-green-800 dark:text-green-300' : 'text-gray-900 dark:text-white'}`}>
              {habit.title}
            </h3>
            <p className="text-xs text-gray-600 dark:text-gray-400">{habit.category}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-1">
          <button
            onClick={onViewCalendar}
            className="p-1 text-gray-400 hover:text-blue-500 transition-colors"
            title="عرض التقويم"
          >
            <Calendar className="w-4 h-4" />
          </button>
          <button
            onClick={() => onUpdate(habit.id, { isActive: !habit.isActive })}
            className="p-1 text-gray-400 hover:text-blue-500 transition-colors"
            title="تعديل"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(habit.id)}
            className="p-1 text-gray-400 hover:text-red-500 transition-colors"
            title="حذف"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Description */}
      {habit.description && (
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
          {habit.description}
        </p>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <TrendingUp className="w-4 h-4 text-orange-500" />
            <span className="text-xs text-gray-600 dark:text-gray-400">السلسلة</span>
          </div>
          <p className="text-lg font-bold text-orange-600">{streak}</p>
        </div>
        
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Target className="w-4 h-4 text-blue-500" />
            <span className="text-xs text-gray-600 dark:text-gray-400">المعدل</span>
          </div>
          <p className="text-lg font-bold text-blue-600">{completionRate}%</p>
        </div>
      </div>

      {/* Action Button */}
      {habit.isActive && (
        <div className="space-y-2">
          {showCountInput ? (
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="1"
                max={habit.targetCount || 10}
                value={count}
                onChange={(e) => setCount(parseInt(e.target.value) || 1)}
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                placeholder={`من ${habit.targetCount} ${habit.unit || ''}`}
              />
              <button
                onClick={handleCountSubmit}
                className="bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-lg text-sm transition-colors"
              >
                تأكيد
              </button>
              <button
                onClick={() => setShowCountInput(false)}
                className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-2 rounded-lg text-sm transition-colors"
              >
                إلغاء
              </button>
            </div>
          ) : (
            <button
              onClick={handleToggle}
              className={`w-full py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
                isCompletedToday
                  ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-800'
                  : 'bg-blue-500 hover:bg-blue-600 text-white'
              }`}
            >
              {isCompletedToday ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  تم الإنجاز
                </>
              ) : (
                <>
                  <Circle className="w-4 h-4" />
                  {habit.targetCount && habit.targetCount > 1 
                    ? `إنجاز (${todayEntry?.count || 0}/${habit.targetCount} ${habit.unit || ''})`
                    : 'تم الإنجاز'
                  }
                </>
              )}
            </button>
          )}
          
          {/* Reminder Time */}
          {habit.reminderEnabled && habit.reminderTime && (
            <div className="flex items-center justify-center gap-1 text-xs text-gray-500 dark:text-gray-400">
              <Clock className="w-3 h-3" />
              <span>تذكير في {habit.reminderTime}</span>
            </div>
          )}
        </div>
      )}

      {/* Inactive Status */}
      {!habit.isActive && (
        <div className="text-center py-2">
          <p className="text-sm text-gray-500 dark:text-gray-400">العادة غير نشطة</p>
          <button
            onClick={() => onUpdate(habit.id, { isActive: true })}
            className="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 mt-1"
          >
            تفعيل العادة
          </button>
        </div>
      )}
    </div>
  );
};

export default HabitCard;

import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { Habit, HabitEntry, HabitCalendarData } from '@/types/Habit';

interface HabitCalendarProps {
  habit: Habit;
  entries: HabitEntry[];
  onClose: () => void;
}

const HabitCalendar: React.FC<HabitCalendarProps> = ({ habit, entries, onClose }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const getDaysInMonth = (date: Date): Date[] => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days: Date[] = [];

    // Add empty days for the start of the month
    const startDay = firstDay.getDay();
    for (let i = 0; i < startDay; i++) {
      days.push(new Date(year, month, -i));
    }
    days.reverse();

    // Add all days of the month
    for (let day = 1; day <= lastDay.getDate(); day++) {
      days.push(new Date(year, month, day));
    }

    // Add empty days for the end of the month to complete the grid
    const endDay = lastDay.getDay();
    for (let i = 1; i < 7 - endDay; i++) {
      days.push(new Date(year, month + 1, i));
    }

    return days;
  };

  const getCalendarData = (): HabitCalendarData[] => {
    const days = getDaysInMonth(currentDate);
    return days.map(day => {
      const dateStr = day.toISOString().split('T')[0];
      const entry = entries.find(e => e.date === dateStr);
      
      let level: 0 | 1 | 2 | 3 | 4 = 0;
      if (entry?.completed) {
        if (habit.targetCount && entry.count) {
          const percentage = (entry.count / habit.targetCount) * 100;
          if (percentage >= 100) level = 4;
          else if (percentage >= 75) level = 3;
          else if (percentage >= 50) level = 2;
          else level = 1;
        } else {
          level = 4;
        }
      }

      return {
        date: dateStr,
        completed: entry?.completed || false,
        count: entry?.count,
        level
      };
    });
  };

  const getLevelColor = (level: 0 | 1 | 2 | 3 | 4): string => {
    const colors = {
      0: 'bg-gray-100 dark:bg-gray-800',
      1: 'bg-green-100 dark:bg-green-900',
      2: 'bg-green-200 dark:bg-green-800',
      3: 'bg-green-400 dark:bg-green-600',
      4: 'bg-green-500 dark:bg-green-500'
    };
    return colors[level];
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(newDate.getMonth() - 1);
      } else {
        newDate.setMonth(newDate.getMonth() + 1);
      }
      return newDate;
    });
  };

  const calendarData = getCalendarData();
  const monthName = currentDate.toLocaleDateString('ar-SA', { month: 'long', year: 'numeric' });
  const weekDays = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];

  // Calculate statistics for current month
  const currentMonthEntries = entries.filter(e => {
    const entryDate = new Date(e.date);
    return entryDate.getMonth() === currentDate.getMonth() && 
           entryDate.getFullYear() === currentDate.getFullYear();
  });
  
  const completedDays = currentMonthEntries.filter(e => e.completed).length;
  const totalDays = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const completionRate = Math.round((completedDays / totalDays) * 100);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div 
              className="w-4 h-4 rounded-full" 
              style={{ backgroundColor: habit.color }}
            ></div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">{habit.title}</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">تقويم تتبع العادة</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Statistics */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-green-600">{completedDays}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">أيام مكتملة</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-600">{completionRate}%</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">معدل الإنجاز</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-purple-600">{totalDays - completedDays}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">أيام متبقية</p>
            </div>
          </div>
        </div>

        {/* Calendar Navigation */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => navigateMonth('prev')}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
          
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {monthName}
          </h3>
          
          <button
            onClick={() => navigateMonth('next')}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        </div>

        {/* Calendar Grid */}
        <div className="p-6">
          {/* Week Days Header */}
          <div className="grid grid-cols-7 gap-2 mb-4">
            {weekDays.map(day => (
              <div key={day} className="text-center text-sm font-medium text-gray-600 dark:text-gray-400 py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7 gap-2">
            {calendarData.map((dayData, index) => {
              const day = new Date(dayData.date);
              const isCurrentMonth = day.getMonth() === currentDate.getMonth();
              const isToday = dayData.date === new Date().toISOString().split('T')[0];
              
              return (
                <div
                  key={index}
                  className={`aspect-square flex items-center justify-center rounded-lg text-sm font-medium transition-all ${
                    isCurrentMonth 
                      ? `${getLevelColor(dayData.level)} text-gray-900 dark:text-white` 
                      : 'text-gray-400 dark:text-gray-600'
                  } ${
                    isToday ? 'ring-2 ring-blue-500' : ''
                  } ${
                    dayData.completed ? 'cursor-pointer hover:scale-105' : ''
                  }`}
                  title={
                    dayData.completed 
                      ? `${day.getDate()} - مكتمل${dayData.count ? ` (${dayData.count}/${habit.targetCount || 1})` : ''}`
                      : `${day.getDate()}`
                  }
                >
                  {day.getDate()}
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="mt-6 flex items-center justify-center gap-4">
            <span className="text-sm text-gray-600 dark:text-gray-400">أقل</span>
            <div className="flex gap-1">
              {[0, 1, 2, 3, 4].map(level => (
                <div
                  key={level}
                  className={`w-3 h-3 rounded-sm ${getLevelColor(level as 0 | 1 | 2 | 3 | 4)}`}
                ></div>
              ))}
            </div>
            <span className="text-sm text-gray-600 dark:text-gray-400">أكثر</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HabitCalendar;

import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import HabitManager from '@/components/habits/HabitManager';
import { Target } from 'lucide-react';

const HabitsPage: React.FC = () => {
  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Target className="w-8 h-8 text-blue-500" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              تتبع العادات
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            بناء العادات الإيجابية وتتبع تقدمك اليومي لتحقيق أهدافك الشخصية والمهنية
          </p>
        </div>

        {/* Habit Manager */}
        <HabitManager />
      </div>
    </MainLayout>
  );
};

export default HabitsPage;

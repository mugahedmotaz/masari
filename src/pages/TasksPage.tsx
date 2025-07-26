import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import TaskManager from '@/components/tasks/TaskManager';
import { CheckSquare } from 'lucide-react';

const TasksPage: React.FC = () => {
  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center gap-3">
          <CheckSquare className="w-8 h-8 text-blue-500" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">إدارة المهام اليومية</h1>
            <p className="text-gray-600 dark:text-gray-400">نظم مهامك اليومية وحقق أهدافك بكفاءة</p>
          </div>
        </div>

        {/* Task Manager */}
        <TaskManager />
      </div>
    </MainLayout>
  );
};

export default TasksPage;

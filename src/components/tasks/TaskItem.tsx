import React, { useState } from 'react';
import { Calendar, Clock, AlertTriangle, Edit2, Trash2, CheckCircle2, Circle } from 'lucide-react';
import { Task } from '@/types/Task';

interface TaskItemProps {
  task: Task;
  onToggleComplete: (taskId: string) => void;
  onUpdate: (taskId: string, updates: Partial<Task>) => void;
  onDelete: (taskId: string) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onToggleComplete, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDescription, setEditDescription] = useState(task.description || '');

  const handleSaveEdit = () => {
    onUpdate(task.id, {
      title: editTitle,
      description: editDescription
    });
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditTitle(task.title);
    setEditDescription(task.description || '');
    setIsEditing(false);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100 dark:bg-red-900 dark:text-red-300';
      case 'medium': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-300';
      case 'low': return 'text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-300';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'high': return 'عالية';
      case 'medium': return 'متوسطة';
      case 'low': return 'منخفضة';
      default: return priority;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20';
      case 'overdue': return 'border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20';
      case 'in-progress': return 'border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20';
      default: return 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800';
    }
  };

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'completed';
  const dueToday = task.dueDate && new Date(task.dueDate).toDateString() === new Date().toDateString();

  return (
    <div className={`rounded-xl p-4 shadow-sm border transition-all ${getStatusColor(task.status)}`}>
      <div className="flex items-start gap-3">
        {/* Completion Toggle */}
        <button
          onClick={() => onToggleComplete(task.id)}
          className="mt-1 flex-shrink-0"
        >
          {task.status === 'completed' ? (
            <CheckCircle2 className="w-5 h-5 text-green-500" />
          ) : (
            <Circle className="w-5 h-5 text-gray-400 hover:text-blue-500 transition-colors" />
          )}
        </button>

        {/* Task Content */}
        <div className="flex-1 min-w-0">
          {isEditing ? (
            <div className="space-y-3">
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="عنوان المهمة"
              />
              <textarea
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                rows={2}
                placeholder="وصف المهمة (اختياري)"
              />
              <div className="flex gap-2">
                <button
                  onClick={handleSaveEdit}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm transition-colors"
                >
                  حفظ
                </button>
                <button
                  onClick={handleCancelEdit}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded text-sm transition-colors"
                >
                  إلغاء
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-start justify-between gap-2 mb-2">
                <h3 className={`font-medium ${task.status === 'completed' ? 'line-through text-gray-500 dark:text-gray-400' : 'text-gray-900 dark:text-white'}`}>
                  {task.title}
                </h3>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="p-1 text-gray-400 hover:text-blue-500 transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDelete(task.id)}
                    className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {task.description && (
                <p className={`text-sm mb-3 ${task.status === 'completed' ? 'line-through text-gray-400' : 'text-gray-600 dark:text-gray-300'}`}>
                  {task.description}
                </p>
              )}

              <div className="flex flex-wrap items-center gap-2 text-xs">
                {/* Priority */}
                <span className={`px-2 py-1 rounded-full ${getPriorityColor(task.priority)}`}>
                  {getPriorityText(task.priority)}
                </span>

                {/* Due Date */}
                {task.dueDate && (
                  <span className={`flex items-center gap-1 px-2 py-1 rounded-full ${
                    isOverdue 
                      ? 'text-red-600 bg-red-100 dark:bg-red-900 dark:text-red-300' 
                      : dueToday 
                        ? 'text-orange-600 bg-orange-100 dark:bg-orange-900 dark:text-orange-300'
                        : 'text-gray-600 bg-gray-100 dark:bg-gray-700 dark:text-gray-300'
                  }`}>
                    {isOverdue ? <AlertTriangle className="w-3 h-3" /> : <Calendar className="w-3 h-3" />}
                    {new Date(task.dueDate).toLocaleDateString('ar-SA')}
                    {dueToday && ' (اليوم)'}
                    {isOverdue && ' (متأخر)'}
                  </span>
                )}

                {/* Category */}
                {task.category && (
                  <span className="text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
                    {task.category}
                  </span>
                )}

                {/* Created Date */}
                <span className="text-gray-500 dark:text-gray-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {new Date(task.createdAt).toLocaleDateString('ar-SA')}
                </span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskItem;

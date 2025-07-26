import React, { useState, useEffect } from 'react';
import { Plus, Filter, Search, Calendar, Clock, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Task, TaskFilter, TaskSort, TaskStats } from '@/types/Task';
import { useNotifications } from '@/contexts/NotificationContext';
import { useOffline } from '@/contexts/OfflineContext';
import TaskItem from './TaskItem';
import AddTaskModal from './AddTaskModal';

const TaskManager: React.FC = () => {
  const { addNotification, scheduleReminder } = useNotifications();
  const { saveOfflineData, getOfflineData, isOnline } = useOffline();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<TaskFilter>('all');
  const [sort, setSort] = useState<TaskSort>('dueDate');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [stats, setStats] = useState<TaskStats>({
    total: 0,
    completed: 0,
    pending: 0,
    overdue: 0,
    completionRate: 0
  });

  // Load tasks from offline storage on component mount
  useEffect(() => {
    const loadTasks = async () => {
      try {
        const savedTasks = await getOfflineData<Task[]>('tasks');
        if (savedTasks && Array.isArray(savedTasks)) {
          setTasks(savedTasks as Task[]);
        } else {
          // Fallback to localStorage for migration
          const localTasks = localStorage.getItem('groth-tasks');
          if (localTasks) {
            const parsedTasks = JSON.parse(localTasks);
            setTasks(parsedTasks);
            // Migrate to offline storage
            await saveOfflineData('tasks', parsedTasks);
          }
        }
      } catch (error) {
        console.error('Failed to load tasks:', error);
      }
    };
    
    loadTasks();
  }, [getOfflineData, saveOfflineData]);

  // Save tasks to offline storage whenever tasks change
  useEffect(() => {
    const saveTasks = async () => {
      try {
        await saveOfflineData('tasks', tasks);
        // Also save to localStorage as backup
        localStorage.setItem('groth-tasks', JSON.stringify(tasks));
      } catch (error) {
        console.error('Failed to save tasks:', error);
        // Fallback to localStorage only
        localStorage.setItem('groth-tasks', JSON.stringify(tasks));
      }
    };
    
    if (tasks.length > 0) {
      saveTasks();
    }
  }, [tasks, saveOfflineData]);

  // Update task statistics
  const updateTaskStats = (taskList: Task[]) => {
    const total = taskList.length;
    const completed = taskList.filter(t => t.status === 'completed').length;
    const pending = taskList.filter(t => t.status === 'pending' || t.status === 'in-progress').length;
    const overdue = taskList.filter(t => t.status === 'overdue').length;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    setStats({ total, completed, pending, overdue, completionRate });
  };

  // Add new task
  const handleAddTask = (task: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask: Task = {
      ...task,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    setTasks(prev => [...prev, newTask]);
    setShowAddModal(false);
    
    // Add success notification
    addNotification({
      title: 'تم إضافة المهمة بنجاح',
      message: `تم إضافة المهمة "${task.title}" إلى قائمة مهامك`,
      type: 'success',
      priority: 'low',
      relatedId: newTask.id,
      relatedType: 'task'
    });
    
    // Schedule reminder if due date is set
    if (task.dueDate) {
      const dueDate = new Date(task.dueDate);
      const reminderTime = new Date(dueDate.getTime() - 24 * 60 * 60 * 1000); // 1 day before
      
      if (reminderTime > new Date()) {
        scheduleReminder(
          'تذكير بمهمة قادمة',
          `المهمة "${task.title}" مستحقة غداً`,
          reminderTime.toISOString(),
          newTask.id,
          'task'
        );
      }
    }
  };

  // Update task
  const handleUpdateTask = (taskId: string, updates: Partial<Task>) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId ? { ...task, ...updates } : task
    ));
  };

  // Delete task
  const handleDeleteTask = (taskId: string) => {
    const taskToDelete = tasks.find(t => t.id === taskId);
    setTasks(prev => prev.filter(task => task.id !== taskId));
    
    if (taskToDelete) {
      addNotification({
        title: 'تم حذف المهمة',
        message: `تم حذف المهمة "${taskToDelete.title}" من قائمة مهامك`,
        type: 'info',
        priority: 'low',
        relatedId: taskId,
        relatedType: 'task'
      });
    }
  };

  // Toggle task completion
  const handleToggleComplete = (taskId: string) => {
    setTasks(prev => prev.map(task => {
      if (task.id === taskId) {
        const isCompleted = task.status === 'completed';
        const newStatus = isCompleted ? 'pending' : 'completed';
        
        // Add completion notification
        if (!isCompleted) {
          addNotification({
            title: 'تم إنجاز المهمة! 🎉',
            message: `أحسنت! تم إنجاز المهمة "${task.title}"`,
            type: 'success',
            priority: 'medium',
            relatedId: taskId,
            relatedType: 'task'
          });
        }
        
        return {
          ...task,
          status: newStatus,
          completedAt: isCompleted ? undefined : new Date().toISOString()
        };
      }
      return task;
    }));
  };

  // Filter and sort tasks
  const filteredAndSortedTasks = tasks
    .filter(task => {
      // Filter by status
      if (filter !== 'all' && task.status !== filter) return false;
      
      // Filter by search term
      if (searchTerm && !task.title.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }
      
      return true;
    })
    .sort((a, b) => {
      switch (sort) {
        case 'dueDate':
          if (!a.dueDate && !b.dueDate) return 0;
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        case 'priority':
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        case 'created':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'title':
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

  return (
    <div className="space-y-6">
      {/* Task Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">إجمالي المهام</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
            </div>
            <Calendar className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">مكتملة</p>
              <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
            </div>
            <CheckCircle2 className="w-8 h-8 text-green-500" />
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">قيد التنفيذ</p>
              <p className="text-2xl font-bold text-blue-600">{stats.pending}</p>
            </div>
            <Clock className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">متأخرة</p>
              <p className="text-2xl font-bold text-red-600">{stats.overdue}</p>
            </div>
            <AlertCircle className="w-8 h-8 text-red-500" />
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
                placeholder="البحث في المهام..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            {/* Filter */}
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as TaskFilter)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">جميع المهام</option>
              <option value="pending">قيد التنفيذ</option>
              <option value="completed">مكتملة</option>
              <option value="overdue">متأخرة</option>
            </select>
            
            {/* Sort */}
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as TaskSort)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="dueDate">تاريخ الاستحقاق</option>
              <option value="priority">الأولوية</option>
              <option value="created">تاريخ الإنشاء</option>
              <option value="title">الاسم</option>
            </select>
          </div>
          
          {/* Add Task Button */}
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Plus className="w-4 h-4" />
            مهمة جديدة
          </button>
        </div>
      </div>

      {/* Task List */}
      <div className="space-y-3">
        {filteredAndSortedTasks.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl p-12 shadow-sm border border-gray-200 dark:border-gray-700 text-center">
            <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              {filter === 'all' ? 'لا توجد مهام' : `لا توجد مهام ${filter === 'completed' ? 'مكتملة' : filter === 'pending' ? 'قيد التنفيذ' : 'متأخرة'}`}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {filter === 'all' ? 'ابدأ بإضافة مهمتك الأولى لتنظيم يومك' : 'جرب تغيير الفلتر لرؤية مهام أخرى'}
            </p>
            {filter === 'all' && (
              <button
                onClick={() => setShowAddModal(true)}
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition-colors"
              >
                إضافة مهمة جديدة
              </button>
            )}
          </div>
        ) : (
          filteredAndSortedTasks.map(task => (
            <TaskItem
              key={task.id}
              task={task}
              onToggleComplete={handleToggleComplete}
              onUpdate={handleUpdateTask}
              onDelete={handleDeleteTask}
            />
          ))
        )}
      </div>

      {/* Add Task Modal */}
      {showAddModal && (
        <AddTaskModal
          onAdd={handleAddTask}
          onClose={() => setShowAddModal(false)}
        />
      )}
    </div>
  );
};

export default TaskManager;

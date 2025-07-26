import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

import { Calendar, CheckCircle2, Target, TrendingUp, Flame, Brain, Clock, PlusCircle } from "lucide-react";

interface Goal {
  id: string;
  title: string;
  category: string;
  endDate: string;
  progress?: number;
}

interface DailyDashboardProps {
  goals: Goal[];
  onGoalClick: (goal: Goal) => void;
  onAddGoal: () => void;
  onStartReview: () => void;
}

const DailyDashboard = ({ goals, onGoalClick, onAddGoal, onStartReview }: DailyDashboardProps) => {
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const activeGoals = goals.filter(goal => {
    const endDate = new Date(goal.endDate);
    const now = new Date();
    return endDate >= now;
  });

  const todaysFocus = activeGoals.slice(0, 3);
  const overallProgress = activeGoals.length > 0 
    ? Math.round(activeGoals.reduce((sum, goal) => sum + (goal.progress || 0), 0) / activeGoals.length)
    : 0;

  const streak = 7; // Mock streak data
  const tasksCompleted = 12; // Mock data

  const motivationalQuotes = [
    "One task at a time builds the mountain of success 🧠",
    "Progress, not perfection, is the goal 🎯",
    "Small steps lead to big changes ✨",
    "Your future self will thank you for today's efforts 🌟",
    "Every expert was once a beginner 📚"
  ];

  const dailyQuote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
          مرحباً بعودتك! 🎆
        </h1>
        <p className="text-gray-600 dark:text-gray-300">{new Date().toLocaleDateString('ar-SA', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">الأهداف النشطة</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{activeGoals.length}</p>
            </div>
            <Target className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">نسبة الإنجاز</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{overallProgress}%</p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-500" />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">سلسلة الإنجاز</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{streak}</p>
            </div>
            <Flame className="w-8 h-8 text-orange-500" />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">مهام منجزة</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{tasksCompleted}</p>
            </div>
            <CheckCircle2 className="w-8 h-8 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Daily Motivation */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 rounded-xl p-6 border border-gray-200 dark:border-gray-600">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2">إلهام اليوم</h3>
            <p className="text-gray-700 dark:text-gray-300">{dailyQuote}</p>
          </div>
        </div>
      </div>

      {/* Today's Goals */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Target className="w-6 h-6 text-blue-500" />
            أهداف اليوم
          </h2>
          <Link
            to="/create-goal"
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <PlusCircle className="w-4 h-4" />
            هدف جديد
          </Link>
        </div>
        
        {todaysFocus.length === 0 ? (
          <div className="text-center py-12">
            <Target className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">لا توجد أهداف نشطة</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">ابدأ بإضافة هدفك الأول لتحقيق النجاح!</p>
            <Link
              to="/create-goal"
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition-colors"
            >
              إضافة هدف جديد
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {todaysFocus.map((goal) => (
              <div
                key={goal.id}
                onClick={() => onGoalClick(goal)}
                className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 cursor-pointer hover:shadow-md transition-shadow border border-gray-200 dark:border-gray-600"
              >
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-gray-900 dark:text-white">{goal.title}</h4>
                  <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">
                    {goal.category}
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                    <span>التقدم</span>
                    <span>{goal.progress || 0}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full transition-all"
                      style={{ width: `${goal.progress || 0}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 text-center">
          <CheckCircle2 className="w-12 h-12 text-blue-500 mx-auto mb-4" />
          <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2">إدارة المهام</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            نظم مهامك اليومية وحقق أهدافك
          </p>
          <Link
            to="/tasks"
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors"
          >
            عرض المهام
          </Link>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 text-center">
          <Calendar className="w-12 h-12 text-purple-500 mx-auto mb-4" />
          <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2">مراجعة أسبوعية</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            راجع تقدمك وخطط للأسبوع القادم
          </p>
          <Link
            to="/weekly-review"
            className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-2 rounded-lg transition-colors"
          >
            بدء المراجعة
          </Link>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 text-center">
          <Target className="w-12 h-12 text-green-500 mx-auto mb-4" />
          <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2">هدف جديد</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            مستعد لتحدي جديد؟
          </p>
          <Link
            to="/create-goal"
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg transition-colors"
          >
            إضافة هدف
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DailyDashboard;
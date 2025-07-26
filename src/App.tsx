import { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { NotificationProvider } from '@/contexts/NotificationContext';
import { OfflineProvider } from '@/contexts/OfflineContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { OnboardingProvider } from '@/contexts/OnboardingContext';
import { GoalProvider } from '@/contexts/GoalContext';
import OfflineStatusBar from '@/components/ui/OfflineStatusBar';
import EnhancedPWAButton from '@/components/ui/EnhancedPWAButton';
import OnboardingFlow from '@/components/onboarding/OnboardingFlow';
import CreateGoalForm from '@/components/goals/CreateGoalForm';
import TimelineView from '@/components/timeline/TimelineView';
import DailyDashboard from '@/components/dashboard/DailyDashboard';
import WeeklyReviewPage from './pages/WeeklyReviewPage';
import CoursesPage from './pages/CoursesPage';
import ReportsPage from './pages/ReportsPage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import NotFoundPage from './pages/NotFoundPage';
import CommunityPage from './pages/CommunityPage';
import TasksPage from './pages/TasksPage';
import HabitsPage from '@/pages/HabitsPage';
import MainLayout from '@/components/layout/MainLayout';
import BackButton from '@/components/ui/BackButton';

interface Goal {
  id: string;
  title: string;
  description: string;
  category: string;
  startDate: string;
  endDate: string;
  skills: string[];
  resources: string[];
  completed?: boolean;
  progress?: number;
}

const queryClient = new QueryClient();

const AppContent = () => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);

  // Check if user has completed onboarding
  useEffect(() => {
    const completed = localStorage.getItem('grow-path-onboarding-complete');
    setHasCompletedOnboarding(!!completed);
    
    // Load goals from localStorage
    const savedGoals = localStorage.getItem('grow-path-goals');
    if (savedGoals) {
      setGoals(JSON.parse(savedGoals));
    }
  }, []);

  // Save goals to localStorage whenever goals change
  useEffect(() => {
    localStorage.setItem('grow-path-goals', JSON.stringify(goals));
  }, [goals]);

  const handleOnboardingComplete = () => {
    localStorage.setItem('grow-path-onboarding-complete', 'true');
    setHasCompletedOnboarding(true);
  };

  const handleGoalCreated = (goal: Goal) => {
    if (editingGoal) {
      // Update existing goal
      setGoals(goals.map(g => g.id === editingGoal.id ? goal : g));
      setEditingGoal(null);
    } else {
      // Add new goal
      setGoals([...goals, goal]);
    }
  };

  const handleEditGoal = (goal: Goal) => {
    setEditingGoal(goal);
  };

  const handleCancelGoalForm = () => {
    setEditingGoal(null);
  };

  const handleAddGoal = () => {
    setEditingGoal(null);
  };

  const handleGoalClick = (goal: Goal) => {
    handleEditGoal(goal);
  };

  if (!hasCompletedOnboarding) {
    return <OnboardingFlow onComplete={handleOnboardingComplete} />;
  }

  return (
    <Routes>
      <Route path="/" element={
        <MainLayout>
          <DailyDashboard
            goals={goals}
            onGoalClick={handleGoalClick}
            onAddGoal={handleAddGoal}
            onStartReview={() => {}}
          />
        </MainLayout>
      } />
      <Route path="/timeline" element={
        <MainLayout>
          <TimelineView goals={goals} onAddGoal={handleAddGoal} onEditGoal={handleEditGoal} />
        </MainLayout>
      } />
      <Route path="/create-goal" element={
        <MainLayout>
          <BackButton className="mb-4" />
          <CreateGoalForm onGoalCreated={handleGoalCreated} editingGoal={editingGoal} onCancel={handleCancelGoalForm} />
        </MainLayout>
      } />
      <Route path="/weekly-review" element={
        <MainLayout>
          <WeeklyReviewPage />
        </MainLayout>
      } />
      <Route path="/tasks" element={<TasksPage />} />
      <Route path="/habits" element={<HabitsPage />} />
      <Route path="/courses" element={<CoursesPage />} />
      <Route path="/reports" element={<ReportsPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/settings" element={<SettingsPage />} />
      <Route path="/community" element={<CommunityPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <LanguageProvider>
        <OnboardingProvider>
          <GoalProvider>
            <NotificationProvider>
              <TooltipProvider>
                <Toaster />
                <Sonner />
                <OfflineProvider>
                  <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
                    <OfflineStatusBar />
                    <AppContent />
                    <EnhancedPWAButton forceShow={true} />
                  </div>
                </OfflineProvider>
              </TooltipProvider>
            </NotificationProvider>
          </GoalProvider>
        </OnboardingProvider>
      </LanguageProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;

import { useState, useEffect } from 'react';
import OnboardingFlow from '@/components/onboarding/OnboardingFlow';
import CreateGoalForm from '@/components/goals/CreateGoalForm';
import TimelineView from '@/components/timeline/TimelineView';
import DailyDashboard from '@/components/dashboard/DailyDashboard';

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

type AppView = 'onboarding' | 'dashboard' | 'timeline' | 'create-goal';

const AppContent = () => {
  const [currentView, setCurrentView] = useState<AppView>('onboarding');
  const [goals, setGoals] = useState<Goal[]>([]);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);

  // Check if user has completed onboarding
  useEffect(() => {
    const hasCompletedOnboarding = localStorage.getItem('grow-path-onboarding-complete');
    if (hasCompletedOnboarding) {
      setCurrentView('dashboard');
    }
    
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
    setCurrentView('create-goal');
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
    setCurrentView('timeline');
  };

  const handleEditGoal = (goal: Goal) => {
    setEditingGoal(goal);
    setCurrentView('create-goal');
  };

  const handleCancelGoalForm = () => {
    setEditingGoal(null);
    if (goals.length === 0) {
      setCurrentView('dashboard');
    } else {
      setCurrentView('timeline');
    }
  };

  const handleAddGoal = () => {
    setEditingGoal(null);
    setCurrentView('create-goal');
  };

  const handleGoalClick = (goal: Goal) => {
    handleEditGoal(goal);
  };

  switch (currentView) {
    case 'onboarding':
      return <OnboardingFlow onComplete={handleOnboardingComplete} />;
    
    case 'create-goal':
      return (
        <CreateGoalForm
          onGoalCreated={handleGoalCreated}
          onCancel={handleCancelGoalForm}
          editingGoal={editingGoal}
        />
      );
    
    case 'timeline':
      return (
        <TimelineView
          goals={goals}
          onAddGoal={handleAddGoal}
          onEditGoal={handleEditGoal}
        />
      );
    
    case 'dashboard':
    default:
      return (
        <DailyDashboard
          goals={goals}
          onGoalClick={handleGoalClick}
        />
      );
  }
};

export default AppContent;
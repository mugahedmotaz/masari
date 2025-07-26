import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface OnboardingContextType {
  isOnboardingComplete: boolean;
  currentStep: number;
  totalSteps: number;
  completeOnboarding: () => void;
  setCurrentStep: (step: number) => void;
  resetOnboarding: () => void;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

interface OnboardingProviderProps {
  children: ReactNode;
}

export const OnboardingProvider: React.FC<OnboardingProviderProps> = ({ children }) => {
  const [isOnboardingComplete, setIsOnboardingComplete] = useState(() => {
    const saved = localStorage.getItem('onboardingComplete');
    return saved ? JSON.parse(saved) : false;
  });

  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

  useEffect(() => {
    localStorage.setItem('onboardingComplete', JSON.stringify(isOnboardingComplete));
  }, [isOnboardingComplete]);

  const completeOnboarding = () => {
    setIsOnboardingComplete(true);
  };

  const resetOnboarding = () => {
    setIsOnboardingComplete(false);
    setCurrentStep(1);
  };

  const value: OnboardingContextType = {
    isOnboardingComplete,
    currentStep,
    totalSteps,
    completeOnboarding,
    setCurrentStep,
    resetOnboarding
  };

  return (
    <OnboardingContext.Provider value={value}>
      {children}
    </OnboardingContext.Provider>
  );
};

export const useOnboarding = (): OnboardingContextType => {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
};

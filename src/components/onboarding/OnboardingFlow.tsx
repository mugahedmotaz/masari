import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ChevronRight, Target, Calendar, TrendingUp } from "lucide-react";
import { useLanguage } from '@/contexts/LanguageContext';
import { LanguageSwitcher } from '@/components/ui/language-switcher';

interface OnboardingFlowProps {
  onComplete: () => void;
}

const OnboardingFlow = ({ onComplete }: OnboardingFlowProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const { t, isRTL } = useLanguage();

  const steps = [
    {
      icon: Target,
      title: t('onboarding.step1.title'),
      description: t('onboarding.step1.description')
    },
    {
      icon: Calendar,
      title: t('onboarding.step2.title'),
      description: t('onboarding.step2.description')
    },
    {
      icon: TrendingUp,
      title: t('onboarding.step3.title'),
      description: t('onboarding.step3.description')
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const step = steps[currentStep];
  const IconComponent = step.icon;

  return (
    <div className="min-h-screen bg-gradient-subtle flex items-center justify-center p-4">
      <div className="w-full max-w-lg space-y-4">
        <div className={`flex ${isRTL ? 'justify-start' : 'justify-end'}`}>
          <LanguageSwitcher />
        </div>
        <Card className="w-full shadow-soft animate-fade-in">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto mb-6 w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center shadow-primary">
            <IconComponent className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">
            {step.title}
          </h1>
          <p className="text-muted-foreground">
            {step.description}
          </p>
        </CardHeader>
        
        <CardContent className="pt-4">
          <div className="flex justify-center mb-6">
            <div className="flex space-x-2">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`h-2 w-8 rounded-full transition-colors ${
                    index <= currentStep
                      ? 'bg-gradient-primary'
                      : 'bg-muted'
                  }`}
                />
              ))}
            </div>
          </div>
          
          <Button
            size="xl"
            className="w-full"
            onClick={handleNext}
          >
            {currentStep < steps.length - 1 ? (
              <>
                {t('onboarding.next')}
                <ChevronRight className={`w-5 h-5 ${isRTL ? 'rotate-180' : ''}`} />
              </>
            ) : (
              t('onboarding.getStarted')
            )}
          </Button>
        </CardContent>
      </Card>
      </div>
    </div>
  );
};

export default OnboardingFlow;
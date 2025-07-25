import React, { createContext, useContext, useState, useEffect } from 'react';

interface LanguageContextType {
  language: string;
  setLanguage: (lang: string) => void;
  t: (key: string) => string;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = {
  en: {
    // Onboarding
    'onboarding.title': 'Welcome to GrowPath',
    'onboarding.step1.title': 'Plan Your Growth',
    'onboarding.step1.description': 'Set clear, achievable goals for your personal and professional development',
    'onboarding.step2.title': 'Visualize Progress',
    'onboarding.step2.description': 'See your journey unfold on a beautiful timeline with milestones and achievements',
    'onboarding.step3.title': 'Track Success',
    'onboarding.step3.description': 'Monitor your daily progress and celebrate every milestone you reach',
    'onboarding.getStarted': 'Get Started',
    'onboarding.back': 'Back',
    'onboarding.next': 'Next',

    // Goal Form
    'goal.title': 'Goal Title',
    'goal.titlePlaceholder': 'Enter your goal title...',
    'goal.description': 'Description',
    'goal.descriptionPlaceholder': 'Describe your goal and motivation...',
    'goal.category': 'Category',
    'goal.startDate': 'Start Date',
    'goal.endDate': 'End Date',
    'goal.skills': 'Skills to Develop',
    'goal.skillsPlaceholder': 'Add a skill...',
    'goal.resources': 'Resources & Links',
    'goal.resourcesPlaceholder': 'Add a resource...',
    'goal.create': 'Create Goal',
    'goal.update': 'Update Goal',
    'goal.cancel': 'Cancel',
    'goal.createFirst': 'Create Your First Plan',
    'goal.edit': 'Edit Goal',

    // Categories
    'category.learning': 'Learning',
    'category.habit': 'Habit',
    'category.project': 'Project',
    'category.health': 'Health',
    'category.career': 'Career',
    'category.personal': 'Personal',

    // Timeline
    'timeline.title': 'Your Growth Timeline',
    'timeline.addGoal': 'Add New Goal',
    'timeline.noGoals': 'No goals yet',
    'timeline.startJourney': 'Start your growth journey by creating your first goal!',
    'timeline.progress': 'Progress',
    'timeline.timeLeft': 'Time Left',
    'timeline.completed': 'Completed',
    'timeline.inProgress': 'In Progress',

    // Dashboard
    'dashboard.title': 'Daily Dashboard',
    'dashboard.todaysFocus': "Today's Focus",
    'dashboard.motivationalQuote': 'Motivational Quote',
    'dashboard.yourGoals': 'Your Goals',
    'dashboard.noGoals': 'No goals yet. Start your growth journey!',
    'dashboard.createFirst': 'Create Your First Goal',

    // Common
    'common.days': 'days',
    'common.language': 'Language',
    'common.english': 'English',
    'common.arabic': 'العربية',
  },
  ar: {
    // Onboarding
    'onboarding.title': 'مرحباً بك في مسار النمو',
    'onboarding.step1.title': 'خطط لنموك',
    'onboarding.step1.description': 'ضع أهدافاً واضحة وقابلة للتحقيق لتطويرك الشخصي والمهني',
    'onboarding.step2.title': 'تصور التقدم',
    'onboarding.step2.description': 'شاهد رحلتك تتكشف على خط زمني جميل مع المعالم والإنجازات',
    'onboarding.step3.title': 'تتبع النجاح',
    'onboarding.step3.description': 'راقب تقدمك اليومي واحتفل بكل معلم تصل إليه',
    'onboarding.getStarted': 'ابدأ الآن',
    'onboarding.back': 'رجوع',
    'onboarding.next': 'التالي',

    // Goal Form
    'goal.title': 'عنوان الهدف',
    'goal.titlePlaceholder': 'أدخل عنوان هدفك...',
    'goal.description': 'الوصف',
    'goal.descriptionPlaceholder': 'اوصف هدفك ودافعك...',
    'goal.category': 'الفئة',
    'goal.startDate': 'تاريخ البداية',
    'goal.endDate': 'تاريخ النهاية',
    'goal.skills': 'المهارات المراد تطويرها',
    'goal.skillsPlaceholder': 'أضف مهارة...',
    'goal.resources': 'المصادر والروابط',
    'goal.resourcesPlaceholder': 'أضف مصدر...',
    'goal.create': 'إنشاء هدف',
    'goal.update': 'تحديث الهدف',
    'goal.cancel': 'إلغاء',
    'goal.createFirst': 'إنشاء خطتك الأولى',
    'goal.edit': 'تعديل الهدف',

    // Categories
    'category.learning': 'التعلم',
    'category.habit': 'عادة',
    'category.project': 'مشروع',
    'category.health': 'الصحة',
    'category.career': 'المهنة',
    'category.personal': 'شخصي',

    // Timeline
    'timeline.title': 'خط زمن نموك',
    'timeline.addGoal': 'إضافة هدف جديد',
    'timeline.noGoals': 'لا توجد أهداف بعد',
    'timeline.startJourney': 'ابدأ رحلة نموك بإنشاء هدفك الأول!',
    'timeline.progress': 'التقدم',
    'timeline.timeLeft': 'الوقت المتبقي',
    'timeline.completed': 'مكتمل',
    'timeline.inProgress': 'قيد التنفيذ',

    // Dashboard
    'dashboard.title': 'لوحة التحكم اليومية',
    'dashboard.todaysFocus': 'تركيز اليوم',
    'dashboard.motivationalQuote': 'اقتباس تحفيزي',
    'dashboard.yourGoals': 'أهدافك',
    'dashboard.noGoals': 'لا توجد أهداف بعد. ابدأ رحلة نموك!',
    'dashboard.createFirst': 'إنشاء هدفك الأول',

    // Common
    'common.days': 'أيام',
    'common.language': 'اللغة',
    'common.english': 'English',
    'common.arabic': 'العربية',
  },
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState('en');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('grow-path-language');
    if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'ar')) {
      setLanguage(savedLanguage);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('grow-path-language', language);
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  const t = (key: string): string => {
    return translations[language as keyof typeof translations]?.[key as keyof typeof translations.en] || key;
  };

  const isRTL = language === 'ar';

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isRTL }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
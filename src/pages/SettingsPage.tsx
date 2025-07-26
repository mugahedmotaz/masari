import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Sun, Moon, Globe, UserCircle } from 'lucide-react';

const SettingsPage: React.FC = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState('ar');

  return (
    <MainLayout>
      <div className="max-w-2xl mx-auto py-10 px-2">
        <h1 className="text-2xl font-bold mb-8 flex items-center gap-2"><UserCircle /> الإعدادات</h1>
        <div className="bg-card rounded-2xl shadow-lg p-6 mb-6">
          <h2 className="text-lg font-bold mb-4">المظهر</h2>
          <div className="flex items-center gap-4 mb-2">
            <button
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${darkMode ? 'bg-primary text-white' : 'bg-muted'} transition`}
              onClick={() => setDarkMode(false)}
            >
              <Sun /> وضع النهار
            </button>
            <button
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${darkMode ? 'bg-muted' : 'bg-primary text-white'} transition`}
              onClick={() => setDarkMode(true)}
            >
              <Moon /> وضع الليل
            </button>
          </div>
        </div>
        <div className="bg-card rounded-2xl shadow-lg p-6 mb-6">
          <h2 className="text-lg font-bold mb-4">اللغة</h2>
          <div className="flex items-center gap-4">
            <button
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${language === 'ar' ? 'bg-primary text-white' : 'bg-muted'} transition`}
              onClick={() => setLanguage('ar')}
            >
              <Globe /> العربية
            </button>
            <button
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${language === 'en' ? 'bg-primary text-white' : 'bg-muted'} transition`}
              onClick={() => setLanguage('en')}
            >
              <Globe /> English
            </button>
          </div>
        </div>
        <div className="bg-card rounded-2xl shadow-lg p-6">
          <h2 className="text-lg font-bold mb-4">حول التطبيق</h2>
          <p className="text-muted-foreground mb-2">Groth منصة إنتاجية متكاملة تساعدك على تحقيق أهدافك وتطوير ذاتك.</p>
          <p className="text-xs text-muted-foreground">الإصدار 1.0.0</p>
        </div>
      </div>
    </MainLayout>
  );
};

export default SettingsPage;

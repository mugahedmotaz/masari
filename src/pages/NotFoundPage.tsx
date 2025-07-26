import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { AlertTriangle } from 'lucide-react';
import BackButton from '@/components/ui/BackButton';

const NotFoundPage: React.FC = () => {
  return (
    <MainLayout>
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 py-12">
        <AlertTriangle className="w-16 h-16 text-warning mb-2" />
        <h1 className="text-3xl font-bold mb-2">الصفحة غير موجودة</h1>
        <p className="text-muted-foreground mb-4">عذراً، الصفحة التي تحاول الوصول إليها غير متوفرة.</p>
        <BackButton className="mt-2" label="العودة للصفحة السابقة" />
      </div>
    </MainLayout>
  );
};

export default NotFoundPage;

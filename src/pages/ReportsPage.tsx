import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { BarChart2, Download } from 'lucide-react';

const stats = [
  { label: 'الأهداف المنجزة', value: 14 },
  { label: 'عدد الأيام النشطة', value: 28 },
  { label: 'أفضل عادة', value: 'القراءة' },
  { label: 'معدل الإنجاز اليومي', value: '85%' },
];

const ReportsPage: React.FC = () => {
  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto py-8 px-2">
        <h1 className="text-3xl font-bold mb-6 flex items-center gap-2"><BarChart2 /> التقارير والتحليلات</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {stats.map((stat, i) => (
            <div key={i} className="bg-card rounded-2xl shadow-lg p-6 flex flex-col items-center">
              <span className="text-2xl font-bold mb-2">{stat.value}</span>
              <span className="text-muted-foreground">{stat.label}</span>
            </div>
          ))}
        </div>
        <div className="bg-card rounded-2xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">رسم بياني للأهداف المنجزة</h2>
          <div className="w-full h-64 flex items-center justify-center bg-muted rounded-xl">
            {/* يمكنك لاحقاً دمج مكتبة رسوم بيانية مثل recharts هنا */}
            <span className="text-muted-foreground">(رسم بياني توضيحي)</span>
          </div>
        </div>
        <div className="flex justify-end">
          <button className="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-primary/90 transition">
            <Download size={18} /> تصدير PDF
          </button>
        </div>
      </div>
    </MainLayout>
  );
};

export default ReportsPage;

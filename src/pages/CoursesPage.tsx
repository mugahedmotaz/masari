import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { BookOpen, PlayCircle, CheckCircle2 } from 'lucide-react';

const courses = [
  {
    id: 1,
    title: 'إدارة الوقت بذكاء',
    description: 'تعلم كيف تدير وقتك بشكل فعال وتحقق أهدافك اليومية.',
    progress: 80,
    lessons: 12,
    completed: 10,
    image: 'https://source.unsplash.com/400x200/?productivity,time',
  },
  {
    id: 2,
    title: 'بناء العادات الناجحة',
    description: 'اكتشف أسرار بناء العادات التي تدوم مدى الحياة.',
    progress: 50,
    lessons: 8,
    completed: 4,
    image: 'https://source.unsplash.com/400x200/?habit,success',
  },
];

const CoursesPage: React.FC = () => {
  return (
    <MainLayout>
      <div className="max-w-5xl mx-auto py-8 px-2">
        <h1 className="text-3xl font-bold mb-6">الدورات التعليمية</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {courses.map(course => (
            <div key={course.id} className="bg-card rounded-2xl shadow-lg overflow-hidden flex flex-col">
              <img src={course.image} alt={course.title} className="w-full h-48 object-cover" />
              <div className="p-4 flex-1 flex flex-col">
                <h2 className="text-xl font-bold mb-2">{course.title}</h2>
                <p className="text-muted-foreground mb-4 flex-1">{course.description}</p>
                <div className="flex items-center gap-2 mb-2">
                  <PlayCircle className="text-primary" size={20} />
                  <span className="text-sm">{course.completed}/{course.lessons} دروس مكتملة</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2 mb-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all"
                    style={{ width: `${course.progress}%` }}
                  ></div>
                </div>
                <div className="flex justify-end">
                  <button className="bg-primary text-white px-4 py-2 rounded-lg mt-2 hover:bg-primary/90 transition flex items-center gap-2">
                    <BookOpen size={18} /> متابعة الدورة
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </MainLayout>
  );
};

export default CoursesPage;

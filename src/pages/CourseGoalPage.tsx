import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import BackButton from '@/components/ui/BackButton';

// بيانات الكورس تأتي عبر التنقل أو يمكن لاحقًا جلبها من API
interface CourseGoalData {
  id: string;
  title: string;
  description: string;
  instructor?: string;
  duration?: string;
  thumbnail?: string;
  sourceUrl?: string;
}

const CourseGoalPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const data: CourseGoalData = location.state && typeof location.state === 'object'
    ? location.state as CourseGoalData
    : {
        id: '',
        title: 'اسم الكورس',
        description: 'وصف الكورس غير متوفر.',
        instructor: '',
        duration: '',
        thumbnail: '',
        sourceUrl: ''
      };


  return (
    <div className="max-w-2xl mx-auto p-6">
      <BackButton className="mb-6" />
      <Card className="shadow-lg border-2 border-primary/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-4">
            {data.thumbnail && (
              <img
                src={data.thumbnail}
                alt={data.title}
                className="w-24 h-24 object-cover rounded-md shadow"
              />
            )}
            <span className="text-2xl font-bold">{data.title}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-2">{data.description}</p>
          {data.instructor && (
            <div className="mb-1 text-sm">المحاضر: <span className="font-semibold">{data.instructor}</span></div>
          )}
          {data.duration && (
            <div className="mb-1 text-sm">المدة: <span className="font-semibold">{data.duration}</span></div>
          )}
          {data.sourceUrl && (
            <a
              href={data.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-4 bg-primary text-white px-4 py-2 rounded hover:bg-primary/80 transition"
            >
              الذهاب إلى صفحة الكورس الأصلية
            </a>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CourseGoalPage;

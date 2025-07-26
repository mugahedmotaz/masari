import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import BackButton from '@/components/ui/BackButton';

const reviewQuestions = [
  'ما هي أهم الإنجازات التي حققتها هذا الأسبوع؟',
  'ما هي التحديات أو العقبات التي واجهتك؟',
  'ما هي الدروس المستفادة أو المهارات الجديدة التي اكتسبتها؟',
  'ما الأهداف التي تحتاج إلى تعديل أو إعادة تقييم؟',
  'ما هو هدفك الرئيسي للأسبوع القادم؟',
];

const WeeklyReviewPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-2xl mx-auto p-6">
      <BackButton className="mb-6" />
      <Card className="shadow-lg border-2 border-primary/30">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-primary">المراجعة الأسبوعية</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {reviewQuestions.map((q, i) => (
              <div key={i} className="mb-4">
                <div className="font-semibold mb-2">{q}</div>
                <textarea
                  className="w-full border rounded p-2 focus:outline-none focus:ring focus:border-primary"
                  rows={3}
                  placeholder="اكتب إجابتك هنا..."
                />
              </div>
            ))}
            <Button className="w-full mt-4" onClick={() => navigate(-1)}>
              حفظ وإنهاء
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WeeklyReviewPage;

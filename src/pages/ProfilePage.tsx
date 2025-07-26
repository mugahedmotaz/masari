import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { UserCircle, Edit2 } from 'lucide-react';

const user = {
  name: ' Mugahed Motaz ',
  email: 'mugahedmotaz@email.com',
  avatar: '',
  bio: 'هاوي إنتاجية وتطوير ذات. أحب القراءة وتعلم مهارات جديدة.',
};

const ProfilePage: React.FC = () => {
  return (
    <MainLayout>
      <div className="max-w-2xl mx-auto py-10 px-2">
        <div className="flex flex-col items-center gap-4 mb-8">
          <div className="w-28 h-28 rounded-full bg-muted flex items-center justify-center text-primary text-5xl shadow">
            {user.avatar ? <img src={user.avatar} alt="avatar" className="w-full h-full rounded-full object-cover" /> : <UserCircle size={80} />}
          </div>
          <h2 className="text-2xl font-bold">{user.name}</h2>
          <span className="text-muted-foreground">{user.email}</span>
          <p className="text-center text-muted-foreground max-w-xs">{user.bio}</p>
          <button className="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-primary/90 transition">
            <Edit2 size={18} /> تعديل الملف الشخصي
          </button>
        </div>
      </div>
    </MainLayout>
  );
};

export default ProfilePage;

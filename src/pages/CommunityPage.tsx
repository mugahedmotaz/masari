import React, { useState } from 'react';
import { Community, CommunityMember, createCommunity } from '@/lib/community';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import BackButton from '@/components/ui/BackButton';

const CommunityPage: React.FC = () => {
  const [communities, setCommunities] = useState<Community[]>(() => {
    const saved = localStorage.getItem('grow-path-communities');
    return saved ? JSON.parse(saved) : [];
  });
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [selectedCommunity, setSelectedCommunity] = useState<Community | null>(null);
  const [memberName, setMemberName] = useState('');
  const [memberEmail, setMemberEmail] = useState('');

  const handleCreateCommunity = () => {
    if (!newName) return;
    const comm = createCommunity(newName, newDesc);
    const updated = [...communities, comm];
    setCommunities(updated);
    localStorage.setItem('grow-path-communities', JSON.stringify(updated));
    setNewName('');
    setNewDesc('');
  };

  const handleSelectCommunity = (comm: Community) => {
    setSelectedCommunity(comm);
  };

  const handleAddMember = () => {
    if (!selectedCommunity || !memberName || !memberEmail) return;
    const newMember: CommunityMember = {
      id: crypto.randomUUID(),
      name: memberName,
      email: memberEmail,
    };
    const updatedCommunities = communities.map(c =>
      c.id === selectedCommunity.id ? { ...c, members: [...c.members, newMember] } : c
    );
    setCommunities(updatedCommunities);
    localStorage.setItem('grow-path-communities', JSON.stringify(updatedCommunities));
    setSelectedCommunity({ ...selectedCommunity, members: [...selectedCommunity.members, newMember] });
    setMemberName('');
    setMemberEmail('');
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <BackButton className="mb-4" />
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>إنشاء مجتمع جديد</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-2">
            <Input
              placeholder="اسم المجتمع"
              value={newName}
              onChange={e => setNewName(e.target.value)}
              className="flex-1"
            />
            <Input
              placeholder="وصف المجتمع (اختياري)"
              value={newDesc}
              onChange={e => setNewDesc(e.target.value)}
              className="flex-2"
            />
            <Button onClick={handleCreateCommunity}>إنشاء</Button>
          </div>
        </CardContent>
      </Card>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>المجتمعات الخاصة بك</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {communities.length === 0 && <div>لا يوجد مجتمعات بعد.</div>}
            {communities.map(comm => (
              <div
                key={comm.id}
                className={`p-2 rounded cursor-pointer hover:bg-muted ${selectedCommunity?.id === comm.id ? 'bg-primary/10' : ''}`}
                onClick={() => handleSelectCommunity(comm)}
              >
                <span className="font-bold">{comm.name}</span> <span className="text-xs text-muted-foreground">({comm.members.length} عضو)</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      {selectedCommunity && (
        <Card>
          <CardHeader>
            <CardTitle>إدارة المجتمع: {selectedCommunity.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <div className="font-semibold mb-2">الأعضاء الحاليون:</div>
              <ul className="mb-2">
                {selectedCommunity.members.length === 0 && <li>لا يوجد أعضاء.</li>}
                {selectedCommunity.members.map(m => (
                  <li key={m.id} className="text-sm">{m.name} ({m.email})</li>
                ))}
              </ul>
              <div className="flex gap-2">
                <Input
                  placeholder="اسم العضو"
                  value={memberName}
                  onChange={e => setMemberName(e.target.value)}
                />
                <Input
                  placeholder="البريد الإلكتروني"
                  value={memberEmail}
                  onChange={e => setMemberEmail(e.target.value)}
                />
                <Button onClick={handleAddMember}>إضافة عضو</Button>
              </div>
            </div>
            {/* يمكن لاحقًا إضافة إدارة الأهداف الجماعية هنا */}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CommunityPage;

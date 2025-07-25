import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from '@/contexts/LanguageContext';
import { LanguageSwitcher } from '@/components/ui/language-switcher';

interface Goal {
  id: string;
  title: string;
  description: string;
  category: string;
  startDate: string;
  endDate: string;
  skills: string[];
  resources: string[];
}

interface CreateGoalFormProps {
  onGoalCreated: (goal: Goal) => void;
  onCancel: () => void;
  editingGoal?: Goal | null;
}

const CreateGoalForm = ({ onGoalCreated, onCancel, editingGoal }: CreateGoalFormProps) => {
  const { t, isRTL } = useLanguage();
  const [title, setTitle] = useState(editingGoal?.title || '');
  const [description, setDescription] = useState(editingGoal?.description || '');
  const [category, setCategory] = useState(editingGoal?.category || '');
  const [startDate, setStartDate] = useState(editingGoal?.startDate || '');
  const [endDate, setEndDate] = useState(editingGoal?.endDate || '');
  const [skills, setSkills] = useState<string[]>(editingGoal?.skills || []);
  const [resources, setResources] = useState<string[]>(editingGoal?.resources || []);
  const [newSkill, setNewSkill] = useState('');
  const [newResource, setNewResource] = useState('');
  const { toast } = useToast();

  const categories = [
    'learning',
    'habit',
    'project',
    'health',
    'career',
    'personal'
  ];

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter(skill => skill !== skillToRemove));
  };

  const addResource = () => {
    if (newResource.trim() && !resources.includes(newResource.trim())) {
      setResources([...resources, newResource.trim()]);
      setNewResource('');
    }
  };

  const removeResource = (resourceToRemove: string) => {
    setResources(resources.filter(resource => resource !== resourceToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !category || !startDate || !endDate) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    const goal: Goal = {
      id: editingGoal?.id || crypto.randomUUID(),
      title,
      description,
      category,
      startDate,
      endDate,
      skills,
      resources
    };

    onGoalCreated(goal);
    toast({
      title: editingGoal ? "Goal updated!" : "Goal created!",
      description: editingGoal ? "Your changes have been saved." : "Your growth plan has been added to your timeline.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-subtle p-4">
      <div className="max-w-2xl mx-auto space-y-4">
        <div className={`flex ${isRTL ? 'justify-start' : 'justify-end'}`}>
          <LanguageSwitcher />
        </div>
        <Card className="shadow-soft animate-fade-in">
          <CardHeader>
            <CardTitle className="text-2xl bg-gradient-primary bg-clip-text text-transparent">
              {editingGoal ? t('goal.edit') : t('goal.createFirst')}
            </CardTitle>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">{t('goal.title')} *</Label>
                <Input
                  id="title"
                  placeholder={t('goal.titlePlaceholder')}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">{t('goal.startDate')} *</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="endDate">{t('goal.endDate')} *</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">{t('goal.category')} *</Label>
                <Select value={category} onValueChange={setCategory} required>
                  <SelectTrigger>
                    <SelectValue placeholder={t('goal.category')} />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(cat => (
                      <SelectItem key={cat} value={cat}>{t(`category.${cat}`)}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">{t('goal.description')}</Label>
                <Textarea
                  id="description"
                  placeholder={t('goal.descriptionPlaceholder')}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label>{t('goal.skills')}</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder={t('goal.skillsPlaceholder')}
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                  />
                  <Button type="button" size="icon" onClick={addSkill}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {skills.map(skill => (
                    <Badge key={skill} variant="secondary" className="gap-1">
                      {skill}
                      <X
                        className="w-3 h-3 cursor-pointer"
                        onClick={() => removeSkill(skill)}
                      />
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>{t('goal.resources')}</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder={t('goal.resourcesPlaceholder')}
                    value={newResource}
                    onChange={(e) => setNewResource(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addResource())}
                  />
                  <Button type="button" size="icon" onClick={addResource}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="space-y-2 mt-2">
                  {resources.map(resource => (
                    <div key={resource} className="flex items-center justify-between bg-muted p-2 rounded-md">
                      <span className="text-sm truncate">{resource}</span>
                      <X
                        className="w-4 h-4 cursor-pointer text-muted-foreground hover:text-foreground"
                        onClick={() => removeResource(resource)}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
                  {t('goal.cancel')}
                </Button>
                <Button type="submit" variant="success" className="flex-1">
                  {editingGoal ? t('goal.update') : t('goal.create')}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreateGoalForm;
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Calendar, CheckCircle, Circle, Edit, Plus } from "lucide-react";

interface Goal {
  id: string;
  title: string;
  description: string;
  category: string;
  startDate: string;
  endDate: string;
  skills: string[];
  resources: string[];
  completed?: boolean;
  progress?: number;
}

interface TimelineViewProps {
  goals: Goal[];
  onAddGoal: () => void;
  onEditGoal: (goal: Goal) => void;
}

const TimelineView = ({ goals, onAddGoal, onEditGoal }: TimelineViewProps) => {
  const getCategoryColor = (category: string) => {
    const colors = {
      'Learning': 'bg-blue-100 text-blue-800',
      'Habit': 'bg-green-100 text-green-800',
      'Project': 'bg-purple-100 text-purple-800',
      'Health': 'bg-red-100 text-red-800',
      'Career': 'bg-yellow-100 text-yellow-800',
      'Personal': 'bg-pink-100 text-pink-800'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getDaysLeft = (endDate: string) => {
    const today = new Date();
    const end = new Date(endDate);
    const diffTime = end.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (goals.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-subtle p-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-6 shadow-primary">
              <Calendar className="w-12 h-12 text-primary-foreground" />
            </div>
            <h2 className="text-2xl font-bold mb-4">Your Growth Timeline</h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              Start your journey by creating your first growth plan. Track your progress and celebrate your achievements along the way.
            </p>
            <Button size="lg" onClick={onAddGoal} variant="glow">
              <Plus className="w-5 h-5 mr-2" />
              Create Your First Goal
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-subtle p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Your Growth Timeline
            </h1>
            <p className="text-muted-foreground mt-2">
              Track your progress and stay motivated
            </p>
          </div>
          <Button onClick={onAddGoal} variant="default">
            <Plus className="w-4 h-4 mr-2" />
            Add Goal
          </Button>
        </div>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-primary opacity-50"></div>
          
          <div className="space-y-6">
            {goals.map((goal, index) => {
              const daysLeft = getDaysLeft(goal.endDate);
              const progress = goal.progress || 0;
              
              return (
                <div key={goal.id} className="relative animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                  {/* Timeline dot */}
                  <div className="absolute left-6 w-4 h-4 bg-gradient-primary rounded-full shadow-primary z-10"></div>
                  
                  <Card className="ml-16 shadow-soft hover:shadow-primary transition-shadow cursor-pointer" onClick={() => onEditGoal(goal)}>
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-xl mb-2 flex items-center gap-2">
                            {goal.completed ? (
                              <CheckCircle className="w-5 h-5 text-success" />
                            ) : (
                              <Circle className="w-5 h-5 text-muted-foreground" />
                            )}
                            {goal.title}
                          </CardTitle>
                          <div className="flex items-center gap-2 mb-2">
                            <Badge className={getCategoryColor(goal.category)}>
                              {goal.category}
                            </Badge>
                            <span className="text-sm text-muted-foreground">
                              {formatDate(goal.startDate)} - {formatDate(goal.endDate)}
                            </span>
                          </div>
                          {goal.description && (
                            <p className="text-muted-foreground text-sm">{goal.description}</p>
                          )}
                        </div>
                        <Button variant="ghost" size="icon" onClick={(e) => {
                          e.stopPropagation();
                          onEditGoal(goal);
                        }}>
                          <Edit className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="pt-0">
                      <div className="space-y-4">
                        {/* Progress */}
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Progress</span>
                            <span>{progress}%</span>
                          </div>
                          <Progress value={progress} className="h-2" />
                          <div className="text-xs text-muted-foreground">
                            {daysLeft > 0 ? `${daysLeft} days left` : daysLeft === 0 ? 'Due today' : `${Math.abs(daysLeft)} days overdue`}
                          </div>
                        </div>
                        
                        {/* Skills */}
                        {goal.skills.length > 0 && (
                          <div>
                            <span className="text-sm font-medium">Skills: </span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {goal.skills.map(skill => (
                                <Badge key={skill} variant="outline" className="text-xs">
                                  {skill}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {/* Resources */}
                        {goal.resources.length > 0 && (
                          <div>
                            <span className="text-sm font-medium">Resources: </span>
                            <span className="text-xs text-muted-foreground">
                              {goal.resources.length} item{goal.resources.length !== 1 ? 's' : ''}
                            </span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimelineView;
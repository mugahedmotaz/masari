import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, 
  CheckCircle2, 
  Target, 
  TrendingUp, 
  Flame,
  Brain,
  Clock
} from "lucide-react";

interface Goal {
  id: string;
  title: string;
  category: string;
  endDate: string;
  progress?: number;
}

interface DailyDashboardProps {
  goals: Goal[];
  onGoalClick: (goal: Goal) => void;
}

const DailyDashboard = ({ goals, onGoalClick }: DailyDashboardProps) => {
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const activeGoals = goals.filter(goal => {
    const endDate = new Date(goal.endDate);
    const now = new Date();
    return endDate >= now;
  });

  const todaysFocus = activeGoals.slice(0, 3);
  const overallProgress = activeGoals.length > 0 
    ? Math.round(activeGoals.reduce((sum, goal) => sum + (goal.progress || 0), 0) / activeGoals.length)
    : 0;

  const streak = 7; // Mock streak data
  const tasksCompleted = 12; // Mock data

  const motivationalQuotes = [
    "One task at a time builds the mountain of success 🧠",
    "Progress, not perfection, is the goal 🎯",
    "Small steps lead to big changes ✨",
    "Your future self will thank you for today's efforts 🌟",
    "Every expert was once a beginner 📚"
  ];

  const dailyQuote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];

  return (
    <div className="min-h-screen bg-gradient-subtle p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">
            Good morning! 🌅
          </h1>
          <p className="text-muted-foreground">{today}</p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="shadow-soft">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Overall Progress</p>
                  <p className="text-2xl font-bold">{overallProgress}%</p>
                </div>
                <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-primary-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-soft">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Current Streak</p>
                  <p className="text-2xl font-bold">{streak} days</p>
                </div>
                <div className="w-12 h-12 bg-gradient-warm rounded-full flex items-center justify-center">
                  <Flame className="w-6 h-6 text-warning-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-soft">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Tasks Completed</p>
                  <p className="text-2xl font-bold">{tasksCompleted}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-success rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6 text-success-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Daily Motivation */}
        <Card className="shadow-soft border-l-4 border-l-primary">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center">
                <Brain className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h3 className="font-semibold mb-2">Daily Motivation</h3>
                <p className="text-muted-foreground">{dailyQuote}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Today's Focus */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              Today's Focus
            </CardTitle>
          </CardHeader>
          <CardContent>
            {todaysFocus.length === 0 ? (
              <div className="text-center py-8">
                <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No active goals. Create your first goal to get started!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {todaysFocus.map((goal) => (
                  <Card key={goal.id} className="cursor-pointer hover:shadow-primary transition-shadow" onClick={() => onGoalClick(goal)}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium">{goal.title}</h4>
                        <Badge variant="outline">{goal.category}</Badge>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Progress</span>
                          <span>{goal.progress || 0}%</span>
                        </div>
                        <Progress value={goal.progress || 0} className="h-2" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="shadow-soft">
            <CardContent className="p-6 text-center">
              <Calendar className="w-8 h-8 text-primary mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Weekly Review</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Review your progress and plan for the week ahead
              </p>
              <Button variant="outline" size="sm">
                Start Review
              </Button>
            </CardContent>
          </Card>

          <Card className="shadow-soft">
            <CardContent className="p-6 text-center">
              <Target className="w-8 h-8 text-success mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Add New Goal</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Ready to take on a new challenge?
              </p>
              <Button variant="success" size="sm">
                Create Goal
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DailyDashboard;
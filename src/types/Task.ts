export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'in-progress' | 'completed' | 'overdue';
  dueDate?: string;
  createdAt: string;
  completedAt?: string;
  category?: string;
  tags?: string[];
}

export interface TaskStats {
  total: number;
  completed: number;
  pending: number;
  overdue: number;
  completionRate: number;
}

export type TaskFilter = 'all' | 'pending' | 'completed' | 'overdue';
export type TaskSort = 'dueDate' | 'priority' | 'created' | 'title';

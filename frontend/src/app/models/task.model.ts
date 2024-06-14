import { PomodoroSession } from '../models/pomodoroSession.model';

export interface Task {
  idTask: number;
  userId: number;
  categoryId?: number;
  title: string;
  description: string;
  comments?: string;
  deadline?: Date;
  importance: boolean;
  urgency: boolean;
  status: boolean;
  pomodoroEstimacion: number;
  pomodoroSession: PomodoroSession;
}

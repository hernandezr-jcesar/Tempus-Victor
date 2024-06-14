export interface PomodoroSession {
  idPomodoro: number;
  taskId?: number;
  status: String;
  completedPomodoros: number;
  startTime: string | null;
  endTime: string | null;
  estimate: number;
  totalTimeElapsed: number;
  workTimeElapsed: number;
  breakTimeElapsed: number;
  remainingWorkTime: number;
  remainingBreakTime: number;
  currentWorkTime: number;
  currentBreakTime: number;
  working: boolean;
  resting: boolean;
}

export type SetType = 'RAMP' | 'TOP' | 'BACKOFF';
export type WeekType = 'BUILD' | 'CONSOLIDATE' | 'DELOAD';

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: 'admin' | 'athlete';
}

export interface TechniqueCues {
  tempo: string;
  rom: string;
  failure: string;
}

export interface ExerciseTemplate {
  id: string;
  name: string;
  muscleGroup: string;
  notes: string;
  rampUpSets: string;
  topSetTarget?: {
    minReps: number;
    maxReps: number;
    targetRIR: number;
  };
  backOffRule: string;
  videoUrl?: string;
  techniqueCues: TechniqueCues;
  isKeyLift: boolean;
  defaultSets?: number;
  isSupportVolume?: boolean;
}

export interface ProgramDay {
  id: string;
  name: string;
  focus: string;
  isPushDay?: boolean;
  exercises: ExerciseTemplate[];
}

export interface SetLog {
  id: string;
  type: SetType;
  weight: number;
  reps: number;
  rir: number | null;
  completed: boolean;
  isManual?: boolean;
  isPrimaryTopSet?: boolean;
  isDisabledByAdvancedMode?: boolean;
}

export interface ExerciseLog {
  exerciseId: string;
  sets: SetLog[];
  notes?: string;
  isManualExercise?: boolean;
  manualExerciseName?: string;
  manualMuscleGroup?: string;
  isSupportVolume?: boolean;
}

export type SessionStatus = 'DRAFT' | 'COMPLETED';

export interface ContextFlags {
  sleepPoor: boolean;
  highStress: boolean;
  jointPain: boolean;
  poorNutrition: boolean;
}

export interface AdvancedCycleState {
  isActive: boolean;
  currentWeek: number;
  cycleLength: number;
  schedule: WeekType[];
}

export interface WorkoutSession {
  id: string;
  userId: string;
  date: string;
  dayId: string;
  status: SessionStatus;
  logs: ExerciseLog[];
  durationMinutes: number;
  notes?: string;
  startTimestamp?: number;
  completedTimestamp?: number;
  contextFlags?: ContextFlags;
  weekType?: WeekType;
}

export interface WeeklyCheckin {
  id: string;
  userId: string;
  date: string;
  feelingFlat: boolean;
  jointPain: boolean;
  performanceDrop: boolean;
  needsDeload: boolean;
}

export enum AppRoute {
  LOGIN = 'login',
  DASHBOARD = 'dashboard',
  PROGRAM = 'program',
  LOG_WORKOUT = 'log',
  WORKOUT_LOG_TAB = 'workout_log_tab',
  PROGRESS = 'progress',
  CHECKIN = 'checkin',
  SETTINGS = 'settings',
  TACTICS = 'tactics',
  HISTORY = 'history',
  ADVANCED_MODE = 'advanced_mode',
  MORE = 'more'
}
export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';

export type GameMode = 'practice' | 'exam' | 'lesson';

export interface SudokuCell {
  row: number;
  col: number;
  value: number | null;
  initial: boolean;
  notes: Set<number>;
  isError?: boolean;
  isHighlighted?: boolean;
  isRelated?: boolean;
}

export type GridData = number[][];

export interface SudokuPuzzle {
  id: string;
  level: DifficultyLevel;
  initial: GridData;
  solution: GridData;
  titleFa: string;
}

export interface LessonStep {
  stepNumber: number;
  titleFa: string;
  explanationFa: string;
  highlightCells?: [number, number][]; // [row, col]
  highlightGroup?: 'row' | 'col' | 'box';
  targetCell?: [number, number];
  targetValue?: number;
  boardState: (number | null)[][];
}

export interface Lesson {
  id: string;
  level: DifficultyLevel;
  titleFa: string;
  shortDescFa: string;
  fullDescFa: string;
  durationMinutes: number;
  steps: LessonStep[];
  practicePuzzle: SudokuPuzzle;
}

export interface ExamQuestion {
  id: string;
  titleFa: string;
  descriptionFa: string;
  boardState: (number | null)[][];
  targetCell: [number, number];
  options: {
    id: string;
    textFa: string;
    value: number;
  }[];
  correctAnswer: number;
  explanationFa: string;
}

export interface ExamResult {
  date: string;
  level: DifficultyLevel;
  score: number; // 0 - 100
  totalTimeSeconds: number;
  mistakes: number;
  passed: boolean;
  accuracy: number;
  feedbackFa: string;
  certId: string;
}

export interface UserStats {
  gamesPlayed: number;
  gamesWon: number;
  bestTimeSeconds: Record<DifficultyLevel, number | null>;
  totalPlayTimeSeconds: number;
  completedLessons: string[];
  examHistory: ExamResult[];
  digitStyle: 'persian' | 'english';
  soundEnabled: boolean;
}

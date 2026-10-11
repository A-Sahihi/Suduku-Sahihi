import { DifficultyLevel, GridData, SudokuPuzzle } from '../types/sudoku';
import { toPersianDigits } from './persian';

/**
 * Standard pre-validated Sudoku puzzles for reliable play across difficulties.
 */
export const SAMPLE_PUZZLES: Record<DifficultyLevel, SudokuPuzzle[]> = {
  beginner: [
    {
      id: 'beg-1',
      level: 'beginner',
      titleFa: 'پازل سطح مبتدی ۱ - تمرین اسکن چشمی',
      initial: [
        [5, 3, 0, 0, 7, 0, 0, 0, 0],
        [6, 0, 0, 1, 9, 5, 0, 0, 0],
        [0, 9, 8, 0, 0, 0, 0, 6, 0],
        [8, 0, 0, 0, 6, 0, 0, 0, 3],
        [4, 0, 0, 8, 0, 3, 0, 0, 1],
        [7, 0, 0, 0, 2, 0, 0, 0, 6],
        [0, 6, 0, 0, 0, 0, 2, 8, 0],
        [0, 0, 0, 4, 1, 9, 0, 0, 5],
        [0, 0, 0, 0, 8, 0, 0, 7, 9],
      ],
      solution: [
        [5, 3, 4, 6, 7, 8, 9, 1, 2],
        [6, 7, 2, 1, 9, 5, 3, 4, 8],
        [1, 9, 8, 3, 4, 2, 5, 6, 7],
        [8, 5, 9, 7, 6, 1, 4, 2, 3],
        [4, 2, 6, 8, 5, 3, 7, 9, 1],
        [7, 1, 3, 9, 2, 4, 8, 5, 6],
        [9, 6, 1, 5, 3, 7, 2, 8, 4],
        [2, 8, 7, 4, 1, 9, 6, 3, 5],
        [3, 4, 5, 2, 8, 6, 1, 7, 9],
      ],
    },
    {
      id: 'beg-2',
      level: 'beginner',
      titleFa: 'پازل سطح مبتدی ۲ - تکنیک تک‌کاندید',
      initial: [
        [0, 2, 0, 6, 0, 8, 0, 0, 0],
        [5, 8, 0, 0, 0, 9, 7, 0, 0],
        [0, 0, 0, 0, 4, 0, 0, 0, 0],
        [3, 7, 0, 0, 0, 0, 5, 0, 0],
        [6, 0, 0, 0, 0, 0, 0, 0, 4],
        [0, 0, 8, 0, 0, 0, 0, 1, 3],
        [0, 0, 0, 0, 2, 0, 0, 0, 0],
        [0, 0, 9, 8, 0, 0, 0, 3, 6],
        [0, 0, 0, 3, 0, 6, 0, 9, 0],
      ],
      solution: [
        [1, 2, 3, 6, 7, 8, 9, 4, 5],
        [5, 8, 4, 2, 3, 9, 7, 6, 1],
        [9, 6, 7, 1, 4, 5, 3, 2, 8],
        [3, 7, 2, 4, 6, 1, 5, 8, 9],
        [6, 9, 1, 5, 8, 3, 2, 7, 4],
        [4, 5, 8, 7, 9, 2, 6, 1, 3],
        [8, 3, 6, 9, 2, 4, 1, 5, 7],
        [2, 1, 9, 8, 5, 7, 4, 3, 6],
        [7, 4, 5, 3, 1, 6, 8, 9, 2],
      ],
    },
  ],
  intermediate: [
    {
      id: 'int-1',
      level: 'intermediate',
      titleFa: 'پازل سطح متوسط ۱ - جفت‌های پنهان و آشکار',
      initial: [
        [0, 0, 0, 2, 6, 0, 7, 0, 1],
        [6, 8, 0, 0, 7, 0, 0, 9, 0],
        [1, 9, 0, 0, 0, 4, 5, 0, 0],
        [8, 2, 0, 1, 0, 0, 0, 4, 0],
        [0, 0, 4, 6, 0, 2, 9, 0, 0],
        [0, 5, 0, 0, 0, 3, 0, 2, 8],
        [0, 0, 9, 3, 0, 0, 0, 7, 4],
        [0, 4, 0, 0, 5, 0, 0, 3, 6],
        [7, 0, 3, 0, 1, 8, 0, 0, 0],
      ],
      solution: [
        [4, 3, 5, 2, 6, 9, 7, 8, 1],
        [6, 8, 2, 5, 7, 1, 4, 9, 3],
        [1, 9, 7, 8, 3, 4, 5, 6, 2],
        [8, 2, 6, 1, 9, 5, 3, 4, 7],
        [3, 7, 4, 6, 8, 2, 9, 1, 5],
        [9, 5, 1, 7, 4, 3, 6, 2, 8],
        [5, 1, 9, 3, 2, 6, 8, 7, 4],
        [2, 4, 8, 9, 5, 7, 1, 3, 6],
        [7, 6, 3, 4, 1, 8, 2, 5, 9],
      ],
    },
    {
      id: 'int-2',
      level: 'intermediate',
      titleFa: 'پازل سطح متوسط ۲ - خطوط هدایت‌گر',
      initial: [
        [1, 0, 0, 4, 8, 9, 0, 0, 6],
        [7, 3, 0, 0, 0, 0, 0, 4, 0],
        [0, 0, 0, 0, 0, 1, 2, 9, 5],
        [0, 0, 7, 1, 2, 0, 6, 0, 0],
        [5, 0, 0, 7, 0, 3, 0, 0, 8],
        [0, 0, 6, 0, 9, 5, 7, 0, 0],
        [9, 1, 4, 6, 0, 0, 0, 0, 0],
        [0, 2, 0, 0, 0, 0, 0, 3, 7],
        [8, 0, 0, 5, 1, 2, 0, 0, 4],
      ],
      solution: [
        [1, 5, 2, 4, 8, 9, 3, 7, 6],
        [7, 3, 9, 2, 5, 6, 8, 4, 1],
        [4, 6, 8, 3, 7, 1, 2, 9, 5],
        [3, 8, 7, 1, 2, 4, 6, 5, 9],
        [5, 9, 1, 7, 6, 3, 4, 2, 8],
        [2, 4, 6, 8, 9, 5, 7, 1, 3],
        [9, 1, 4, 6, 3, 7, 5, 8, 2],
        [6, 2, 5, 9, 4, 8, 1, 3, 7],
        [8, 7, 3, 5, 1, 2, 9, 6, 4],
      ],
    },
  ],
  advanced: [
    {
      id: 'adv-1',
      level: 'advanced',
      titleFa: 'پازل سطح پیشرفته ۱ - الگوی X-Wing و چنگال منطقی',
      initial: [
        [0, 0, 0, 6, 0, 0, 4, 0, 0],
        [7, 0, 0, 0, 0, 3, 6, 0, 0],
        [0, 0, 0, 0, 9, 1, 0, 8, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 5, 0, 1, 8, 0, 0, 0, 3],
        [0, 0, 0, 3, 0, 6, 0, 4, 5],
        [0, 4, 0, 2, 0, 0, 0, 6, 0],
        [9, 0, 3, 0, 0, 0, 0, 0, 0],
        [0, 2, 0, 0, 0, 0, 1, 0, 0],
      ],
      solution: [
        [5, 8, 1, 6, 7, 2, 4, 3, 9],
        [7, 9, 2, 8, 4, 3, 6, 5, 1],
        [3, 6, 4, 5, 9, 1, 7, 8, 2],
        [4, 3, 8, 9, 5, 7, 2, 1, 6],
        [2, 5, 6, 1, 8, 4, 9, 7, 3],
        [1, 7, 9, 3, 2, 6, 8, 4, 5],
        [8, 4, 5, 2, 1, 9, 3, 6, 7],
        [9, 1, 3, 7, 6, 8, 5, 2, 4],
        [6, 2, 7, 4, 3, 5, 1, 9, 8],
      ],
    },
    {
      id: 'adv-2',
      level: 'advanced',
      titleFa: 'پازل سطح پیشرفته ۲ - استادی و تحلیل زنجیره‌ها',
      initial: [
        [0, 2, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 6, 0, 0, 0, 0, 3],
        [0, 7, 4, 0, 8, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 3, 0, 0, 2],
        [0, 8, 0, 0, 4, 0, 0, 1, 0],
        [6, 0, 0, 5, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 1, 0, 7, 8, 0],
        [5, 0, 0, 0, 0, 9, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 4, 0],
      ],
      solution: [
        [1, 2, 6, 4, 3, 7, 9, 5, 8],
        [8, 9, 5, 6, 2, 1, 4, 7, 3],
        [3, 7, 4, 9, 8, 5, 1, 2, 6],
        [4, 5, 7, 1, 9, 3, 8, 6, 2],
        [9, 8, 3, 2, 4, 6, 5, 1, 7],
        [6, 1, 2, 5, 7, 8, 3, 9, 4],
        [2, 6, 9, 3, 1, 4, 7, 8, 5],
        [5, 4, 8, 7, 6, 9, 2, 3, 1],
        [7, 3, 1, 8, 5, 2, 6, 4, 9],
      ],
    },
  ],
};

/**
 * Checks if placing `num` at (row, col) violates Sudoku rules.
 */
export function isValidPlacement(
  grid: (number | null)[][],
  row: number,
  col: number,
  num: number
): boolean {
  // Check row
  for (let c = 0; c < 9; c++) {
    if (c !== col && grid[row][c] === num) return false;
  }

  // Check column
  for (let r = 0; r < 9; r++) {
    if (r !== row && grid[r][col] === num) return false;
  }

  // Check 3x3 box
  const boxStartRow = Math.floor(row / 3) * 3;
  const boxStartCol = Math.floor(col / 3) * 3;
  for (let r = boxStartRow; r < boxStartRow + 3; r++) {
    for (let c = boxStartCol; c < boxStartCol + 3; c++) {
      if ((r !== row || c !== col) && grid[r][c] === num) return false;
    }
  }

  return true;
}

/**
 * Computes all possible candidate numbers (1-9) for a cell.
 */
export function getCandidates(grid: (number | null)[][], row: number, col: number): number[] {
  if (grid[row][col] !== null && grid[row][col] !== 0) return [];
  const candidates: number[] = [];
  for (let num = 1; num <= 9; num++) {
    if (isValidPlacement(grid, row, col, num)) {
      candidates.push(num);
    }
  }
  return candidates;
}

export interface HintResult {
  row: number;
  col: number;
  value: number;
  techniqueFa: string;
  explanationFa: string;
}

/**
 * Generates an intelligent hint with Persian pedagogical explanation.
 */
export function findNextHint(
  currentGrid: (number | null)[][],
  solution: GridData
): HintResult | null {
  // 1. Look for Naked Singles (cell with exactly 1 candidate)
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (currentGrid[r][c] === null || currentGrid[r][c] === 0) {
        const candidates = getCandidates(currentGrid, r, c);
        if (candidates.length === 1) {
          const val = candidates[0];
          return {
            row: r,
            col: c,
            value: val,
            techniqueFa: 'تک‌کاندید عریان (Naked Single)',
            explanationFa: `در خانه سطر ${toPersianDigits(r + 1)} و ستون ${toPersianDigits(c + 1)}، به دلیل حضور سایر اعداد در سطر، ستون و بلوک ۳×۳ مربوطه، تنها عدد ممکن ${toPersianDigits(val)} است.`,
          };
        }
      }
    }
  }

  // 2. Look for Hidden Singles in 3x3 boxes
  for (let boxRow = 0; boxRow < 3; boxRow++) {
    for (let boxCol = 0; boxCol < 3; boxCol++) {
      for (let num = 1; num <= 9; num++) {
        const possibleCells: [number, number][] = [];
        let alreadyInBox = false;

        for (let r = boxRow * 3; r < boxRow * 3 + 3; r++) {
          for (let c = boxCol * 3; c < boxCol * 3 + 3; c++) {
            if (currentGrid[r][c] === num) {
              alreadyInBox = true;
              break;
            }
            if ((currentGrid[r][c] === null || currentGrid[r][c] === 0) && isValidPlacement(currentGrid, r, c, num)) {
              possibleCells.push([r, c]);
            }
          }
          if (alreadyInBox) break;
        }

        if (!alreadyInBox && possibleCells.length === 1) {
          const [r, c] = possibleCells[0];
          return {
            row: r,
            col: c,
            value: num,
            techniqueFa: 'تک‌کاندید پنهان در بلوک (Hidden Single)',
            explanationFa: `در بلوک ۳×۳ شماره ${toPersianDigits(boxRow * 3 + boxCol + 1)}، عدد ${toPersianDigits(num)} تنها در خانه سطر ${toPersianDigits(r + 1)} و ستون ${toPersianDigits(c + 1)} قابلیت قرارگیری دارد.`,
          };
        }
      }
    }
  }

  // 3. Fallback: Take first empty cell and offer solution cell
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (currentGrid[r][c] === null || currentGrid[r][c] === 0) {
        const solVal = solution[r][c];
        return {
          row: r,
          col: c,
          value: solVal,
          techniqueFa: 'تحلیل استراتژیک موقعیت',
          explanationFa: `با رد گزینه‌های متناقض در سطر ${toPersianDigits(r + 1)} و ستون ${toPersianDigits(c + 1)}، مقدار صحیح این سلول عدد ${toPersianDigits(solVal)} است.`,
        };
      }
    }
  }

  return null;
}

/**
 * Checks if the entire grid is solved correctly.
 */
export function isGridSolved(currentGrid: (number | null)[][], solution: GridData): boolean {
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (currentGrid[r][c] !== solution[r][c]) {
        return false;
      }
    }
  }
  return true;
}

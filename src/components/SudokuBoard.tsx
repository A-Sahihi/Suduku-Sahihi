import React, { useEffect, useCallback } from 'react';
import { toPersianDigits, normalizeToDigit } from '../utils/persian';
import { sounds } from '../utils/audio';

interface SudokuBoardProps {
  grid: (number | null)[][];
  initialGrid: number[][];
  notes: Record<string, number[]>; // key: "row-col" => list of numbers
  selectedCell: [number, number] | null;
  onSelectCell: (row: number, col: number) => void;
  onInputNumber: (num: number) => void;
  onErase: () => void;
  isNoteMode: boolean;
  onToggleNoteMode: () => void;
  digitStyle: 'persian' | 'english';
  showErrors: boolean;
  errorCells: [number, number][];
  hintCell: [number, number] | null;
}

export const SudokuBoard: React.FC<SudokuBoardProps> = ({
  grid,
  initialGrid,
  notes,
  selectedCell,
  onSelectCell,
  onInputNumber,
  onErase,
  isNoteMode,
  onToggleNoteMode,
  digitStyle,
  showErrors,
  errorCells,
  hintCell,
}) => {
  // Format single digit according to current preference
  const formatDigit = useCallback(
    (val: number | null | undefined): string => {
      if (val === null || val === undefined || val === 0) return '';
      return digitStyle === 'persian' ? toPersianDigits(val) : String(val);
    },
    [digitStyle]
  );

  // Keyboard navigation & input handling (both English & Persian digits)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if user is typing in an input/textarea
      if (
        document.activeElement?.tagName === 'INPUT' ||
        document.activeElement?.tagName === 'TEXTAREA'
      ) {
        return;
      }

      // Check digit input (1-9 or ۱-۹)
      const digit = normalizeToDigit(e.key);
      if (digit !== null) {
        e.preventDefault();
        onInputNumber(digit);
        return;
      }

      // Erase / Backspace / Delete
      if (e.key === 'Backspace' || e.key === 'Delete') {
        e.preventDefault();
        onErase();
        return;
      }

      // Toggle note mode via 'n' or 'N'
      if (e.key === 'n' || e.key === 'N') {
        e.preventDefault();
        onToggleNoteMode();
        return;
      }

      // Arrow navigation
      if (selectedCell) {
        const [r, c] = selectedCell;
        if (e.key === 'ArrowUp' && r > 0) {
          e.preventDefault();
          onSelectCell(r - 1, c);
        } else if (e.key === 'ArrowDown' && r < 8) {
          e.preventDefault();
          onSelectCell(r + 1, c);
        } else if (e.key === 'ArrowLeft' && c > 0) {
          e.preventDefault();
          onSelectCell(r, c - 1);
        } else if (e.key === 'ArrowRight' && c < 8) {
          e.preventDefault();
          onSelectCell(r, c + 1);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedCell, onInputNumber, onErase, onToggleNoteMode, onSelectCell]);

  const selectedVal =
    selectedCell && grid[selectedCell[0]][selectedCell[1]] !== 0
      ? grid[selectedCell[0]][selectedCell[1]]
      : null;

  return (
    <div className="flex flex-col items-center select-none w-full max-w-[460px] mx-auto">
      {/* 9x9 Sudoku Board */}
      <div
        className="w-full aspect-square bg-slate-900 border-2 sm:border-3 border-amber-500/80 rounded-2xl p-1 sm:p-1.5 shadow-2xl shadow-black/60 relative overflow-hidden grid grid-cols-9 grid-rows-9 gap-0"
        dir="ltr"
        role="grid"
        aria-label="جدول سودوکو ۹ در ۹"
      >
        {Array.from({ length: 9 }).map((_, row) =>
          Array.from({ length: 9 }).map((_, col) => {
            const val = grid[row][col];
            const isInitial = initialGrid[row][col] !== 0;
            const isSelected = selectedCell?.[0] === row && selectedCell?.[1] === col;
            const cellKey = `${row}-${col}`;
            const cellNotes = notes[cellKey] || [];

            // Is cell related (same row, col, or 3x3 box as selected)
            const isRelated =
              selectedCell &&
              (selectedCell[0] === row ||
                selectedCell[1] === col ||
                (Math.floor(selectedCell[0] / 3) === Math.floor(row / 3) &&
                  Math.floor(selectedCell[1] / 3) === Math.floor(col / 3)));

            // Has matching number
            const isSameNumber = selectedVal !== null && val === selectedVal;

            // Is error cell
            const isError =
              showErrors && errorCells.some(([er, ec]) => er === row && ec === col);

            // Is hint cell
            const isHint = hintCell && hintCell[0] === row && hintCell[1] === col;

            // 3x3 thick border styling
            const borderClasses = `
              ${col % 3 === 2 && col !== 8 ? 'border-r-2 border-r-amber-500/60' : 'border-r border-r-slate-800'}
              ${row % 3 === 2 && row !== 8 ? 'border-b-2 border-b-amber-500/60' : 'border-b border-b-slate-800'}
            `;

            let bgClass = 'bg-slate-900/90 text-slate-100 hover:bg-slate-800/80';
            if (isInitial) {
              bgClass = 'bg-slate-950/90 text-amber-300 font-bold';
            }
            if (isRelated && !isSelected) {
              bgClass = 'bg-slate-800/70 text-slate-100';
            }
            if (isSameNumber && !isSelected) {
              bgClass = 'bg-amber-500/20 text-amber-200 font-bold';
            }
            if (isSelected) {
              bgClass = 'bg-amber-400 text-slate-950 font-black shadow-inner';
            }
            if (isError) {
              bgClass = 'bg-red-500/30 text-red-300 border border-red-500/80';
            }
            if (isHint) {
              bgClass = 'bg-emerald-500/30 text-emerald-300 border-2 border-emerald-400 animate-pulse';
            }

            return (
              <button
                key={`${row}-${col}`}
                onClick={() => {
                  onSelectCell(row, col);
                  sounds.playPlaceNumber(2);
                }}
                className={`relative flex items-center justify-center text-lg sm:text-2xl font-bold transition-colors focus:outline-none focus:ring-1 focus:ring-amber-400 ${borderClasses} ${bgClass}`}
                role="gridcell"
                aria-label={`خانه سطر ${row + 1} ستون ${col + 1} مقدار ${val || 'خالی'}`}
              >
                {/* Number Display */}
                {val !== null && val !== 0 ? (
                  <span className="leading-none">{formatDigit(val)}</span>
                ) : (
                  /* Notes/Pencil marks 3x3 mini grid */
                  cellNotes.length > 0 && (
                    <div className="grid grid-cols-3 grid-rows-3 w-full h-full p-0.5 text-[8px] sm:text-[10px] leading-none text-slate-400 font-medium">
                      {Array.from({ length: 9 }).map((_, nIdx) => {
                        const noteNum = nIdx + 1;
                        const hasNote = cellNotes.includes(noteNum);
                        return (
                          <div
                            key={noteNum}
                            className="flex items-center justify-center font-mono"
                          >
                            {hasNote ? formatDigit(noteNum) : ''}
                          </div>
                        );
                      })}
                    </div>
                  )
                )}
              </button>
            );
          })
        )}
      </div>
    </div>
  );
};

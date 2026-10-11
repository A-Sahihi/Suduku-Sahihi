import React, { useState, useEffect, useRef, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { DifficultyLevel, SudokuPuzzle, UserStats } from '../types/sudoku';
import { SAMPLE_PUZZLES, isValidPlacement, isGridSolved, findNextHint, HintResult } from '../utils/sudokuLogic';
import { formatPersianTime, toPersianDigits, DIFFICULTY_LABELS_FA } from '../utils/persian';
import { sounds } from '../utils/audio';
import { SudokuBoard } from './SudokuBoard';
import {
  RotateCcw,
  Lightbulb,
  Eraser,
  PenTool,
  Play,
  Pause,
  AlertCircle,
  Trophy,
  ArrowRight,
  ShieldCheck,
  CheckCircle,
} from 'lucide-react';

interface GameViewProps {
  initialLevel: DifficultyLevel;
  digitStyle: 'persian' | 'english';
  onBackToHome: () => void;
  onUpdateStats: (updateFn: (prev: UserStats) => UserStats) => void;
}

export const GameView: React.FC<GameViewProps> = ({
  initialLevel,
  digitStyle,
  onBackToHome,
  onUpdateStats,
}) => {
  const [level, setLevel] = useState<DifficultyLevel>(initialLevel);
  const [puzzleIndex, setPuzzleIndex] = useState(0);
  const puzzles = SAMPLE_PUZZLES[level];
  const activePuzzle: SudokuPuzzle = puzzles[puzzleIndex % puzzles.length];

  // Grid states
  const [grid, setGrid] = useState<(number | null)[][]>(() =>
    activePuzzle.initial.map((row) => [...row])
  );
  const [notes, setNotes] = useState<Record<string, number[]>>({});
  const [selectedCell, setSelectedCell] = useState<[number, number] | null>([0, 0]);
  const [isNoteMode, setIsNoteMode] = useState<boolean>(false);
  const [showErrors, setShowErrors] = useState<boolean>(true);
  const [errorCells, setErrorCells] = useState<[number, number][]>([]);

  // Timer & mistakes
  const [timerSeconds, setTimerSeconds] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [mistakes, setMistakes] = useState<number>(0);
  const maxMistakes = 3;

  // Hint
  const [activeHint, setActiveHint] = useState<HintResult | null>(null);
  const [hintCell, setHintCell] = useState<[number, number] | null>(null);

  // Victory
  const [isSolved, setIsSolved] = useState<boolean>(false);
  const timerRef = useRef<number | null>(null);

  // Load new puzzle or switch level
  const loadPuzzle = useCallback((newLevel: DifficultyLevel, idx = 0) => {
    const list = SAMPLE_PUZZLES[newLevel];
    const p = list[idx % list.length];
    setLevel(newLevel);
    setPuzzleIndex(idx);
    setGrid(p.initial.map((row) => [...row]));
    setNotes({});
    setSelectedCell([0, 0]);
    setErrorCells([]);
    setActiveHint(null);
    setHintCell(null);
    setTimerSeconds(0);
    setIsPaused(false);
    setMistakes(0);
    setIsSolved(false);
  }, []);

  // Timer tick
  useEffect(() => {
    if (isPaused || isSolved) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = window.setInterval(() => {
      setTimerSeconds((prev) => prev + 1);
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, isSolved]);

  // Check errors whenever grid changes
  useEffect(() => {
    const errors: [number, number][] = [];
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        const val = grid[r][c];
        if (val !== null && val !== 0 && activePuzzle.initial[r][c] === 0) {
          // Compare with true solution
          if (val !== activePuzzle.solution[r][c]) {
            errors.push([r, c]);
          }
        }
      }
    }
    setErrorCells(errors);
  }, [grid, activePuzzle]);

  // Input number handler
  const handleInputNumber = useCallback(
    (num: number) => {
      if (!selectedCell || isPaused || isSolved) return;
      const [r, c] = selectedCell;

      // Don't modify initial cells
      if (activePuzzle.initial[r][c] !== 0) return;

      if (isNoteMode) {
        // Toggle note
        const key = `${r}-${c}`;
        setNotes((prev) => {
          const current = prev[key] || [];
          const updated = current.includes(num)
            ? current.filter((n) => n !== num)
            : [...current, num].sort();
          return { ...prev, [key]: updated };
        });
        sounds.playNote();
        return;
      }

      // Check if value already there
      if (grid[r][c] === num) return;

      // Place value
      const newGrid = grid.map((rowArr, rowIdx) =>
        rowArr.map((cellVal, colIdx) => (rowIdx === r && colIdx === c ? num : cellVal))
      );
      setGrid(newGrid);

      // Check if correct placement against solution
      const isCorrect = num === activePuzzle.solution[r][c];
      if (!isCorrect) {
        sounds.playError();
        setMistakes((prev) => {
          const next = prev + 1;
          if (next >= maxMistakes) {
            // Reached max mistakes
          }
          return next;
        });
      } else {
        sounds.playPlaceNumber(num);
        // Clear notes for this cell and related cells
        setNotes((prev) => {
          const copy = { ...prev };
          delete copy[`${r}-${c}`];
          return copy;
        });
      }

      // Check for victory
      if (isGridSolved(newGrid, activePuzzle.solution)) {
        setIsSolved(true);
        sounds.playVictory();
        try {
          confetti({
            particleCount: 120,
            spread: 70,
            origin: { y: 0.6 },
          });
        } catch {
          // ignore
        }

        // Update stats
        onUpdateStats((prev) => ({
          ...prev,
          gamesPlayed: prev.gamesPlayed + 1,
          gamesWon: prev.gamesWon + 1,
          totalPlayTimeSeconds: prev.totalPlayTimeSeconds + timerSeconds,
          bestTimeSeconds: {
            ...prev.bestTimeSeconds,
            [level]:
              prev.bestTimeSeconds[level] === null
                ? timerSeconds
                : Math.min(prev.bestTimeSeconds[level]!, timerSeconds),
          },
        }));
      }
    },
    [
      selectedCell,
      isPaused,
      isSolved,
      activePuzzle,
      isNoteMode,
      grid,
      timerSeconds,
      level,
      onUpdateStats,
    ]
  );

  // Erase handler
  const handleErase = useCallback(() => {
    if (!selectedCell || isPaused || isSolved) return;
    const [r, c] = selectedCell;
    if (activePuzzle.initial[r][c] !== 0) return;

    sounds.playErase();
    setGrid((prev) =>
      prev.map((rowArr, rowIdx) =>
        rowArr.map((cellVal, colIdx) => (rowIdx === r && colIdx === c ? 0 : cellVal))
      )
    );
    const key = `${r}-${c}`;
    setNotes((prev) => {
      const copy = { ...prev };
      delete copy[key];
      return copy;
    });
  }, [selectedCell, isPaused, isSolved, activePuzzle]);

  // Request Hint
  const handleRequestHint = useCallback(() => {
    const hint = findNextHint(grid, activePuzzle.solution);
    if (hint) {
      sounds.playHint();
      setActiveHint(hint);
      setHintCell([hint.row, hint.col]);
      setSelectedCell([hint.row, hint.col]);
    }
  }, [grid, activePuzzle.solution]);

  // Apply hint
  const handleApplyHint = () => {
    if (activeHint) {
      handleInputNumber(activeHint.value);
      setActiveHint(null);
      setHintCell(null);
    }
  };

  // Remaining counts of digits 1-9 in grid
  const getRemainingCounts = () => {
    const counts: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0 };
    grid.forEach((row) =>
      row.forEach((val) => {
        if (val && val >= 1 && val <= 9) counts[val]++;
      })
    );
    return counts;
  };
  const remainingCounts = getRemainingCounts();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 pb-20">
      {/* Top Bar with Level, Navigation, Timer, Mistakes */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-md">
        {/* Back and Level Badge */}
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToHome}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors"
          >
            <ArrowRight className="w-3.5 h-3.5" />
            <span>بازگشت</span>
          </button>

          {/* Level Switcher */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
            {(['beginner', 'intermediate', 'advanced'] as DifficultyLevel[]).map((lvl) => (
              <button
                key={lvl}
                onClick={() => loadPuzzle(lvl, 0)}
                className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
                  level === lvl
                    ? 'bg-amber-500 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {DIFFICULTY_LABELS_FA[lvl]}
              </button>
            ))}
          </div>
        </div>

        {/* Timer & Mistakes Status */}
        <div className="flex items-center gap-4 text-xs sm:text-sm font-medium">
          {/* Timer */}
          <div className="flex items-center gap-1.5 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 text-slate-200">
            <button
              onClick={() => setIsPaused(!isPaused)}
              className="text-amber-400 hover:text-amber-300 transition-colors"
              title={isPaused ? 'ادامه زمان' : 'توقف موقت'}
            >
              {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
            </button>
            <span>زمان:</span>
            <span className="font-mono font-bold text-amber-300">
              {formatPersianTime(timerSeconds)}
            </span>
          </div>

          {/* Mistakes Counter */}
          <div
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border ${
              mistakes >= maxMistakes
                ? 'bg-red-500/20 text-red-300 border-red-500/40'
                : 'bg-slate-950 text-slate-300 border-slate-800'
            }`}
          >
            <AlertCircle className="w-3.5 h-3.5 text-red-400" />
            <span>خطاها:</span>
            <span className="font-bold">
              {toPersianDigits(mistakes)} / {toPersianDigits(maxMistakes)}
            </span>
          </div>
        </div>
      </div>

      {/* Main Game Layout (Board + Control Pad) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Sudoku Board Column */}
        <div className="lg:col-span-7 flex flex-col items-center">
          {isPaused ? (
            <div className="w-full aspect-square max-w-[460px] bg-slate-900/90 border-2 border-slate-800 rounded-2xl flex flex-col items-center justify-center p-6 text-center space-y-4">
              <Pause className="w-12 h-12 text-amber-400 animate-pulse" />
              <h3 className="text-xl font-bold text-white">بازی متوقف شده است</h3>
              <p className="text-xs text-slate-400">برای ادامه حل پازل دکمه زیر را فشار دهید.</p>
              <button
                onClick={() => setIsPaused(false)}
                className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm rounded-xl transition-all"
              >
                ادامه حل جدول
              </button>
            </div>
          ) : (
            <SudokuBoard
              grid={grid}
              initialGrid={activePuzzle.initial}
              notes={notes}
              selectedCell={selectedCell}
              onSelectCell={(r, c) => setSelectedCell([r, c])}
              onInputNumber={handleInputNumber}
              onErase={handleErase}
              isNoteMode={isNoteMode}
              onToggleNoteMode={() => setIsNoteMode(!isNoteMode)}
              digitStyle={digitStyle}
              showErrors={showErrors}
              errorCells={errorCells}
              hintCell={hintCell}
            />
          )}
        </div>

        {/* Controls & Numpad Column */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          {/* Action Toolbar */}
          <div className="grid grid-cols-4 gap-2 bg-slate-900/90 p-3 rounded-2xl border border-slate-800">
            {/* Erase */}
            <button
              onClick={handleErase}
              className="flex flex-col items-center justify-center gap-1.5 p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
              title="پاک کردن خانه"
            >
              <Eraser className="w-5 h-5 text-amber-400" />
              <span className="text-[11px] font-semibold">پاک کردن</span>
            </button>

            {/* Note Mode */}
            <button
              onClick={() => setIsNoteMode(!isNoteMode)}
              className={`flex flex-col items-center justify-center gap-1.5 p-2 rounded-xl transition-all ${
                isNoteMode
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-md'
                  : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300'
              }`}
              title="حالت یادداشت کاندیدها (N)"
            >
              <PenTool className="w-5 h-5" />
              <span className="text-[11px]">
                {isNoteMode ? 'یادداشت: روشن' : 'یادداشت'}
              </span>
            </button>

            {/* Smart Hint */}
            <button
              onClick={handleRequestHint}
              className="flex flex-col items-center justify-center gap-1.5 p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-amber-300 hover:text-amber-200 transition-colors"
              title="راهنمایی هوشمند"
            >
              <Lightbulb className="w-5 h-5 text-amber-400" />
              <span className="text-[11px] font-semibold">راهنمایی</span>
            </button>

            {/* Reset / New Puzzle */}
            <button
              onClick={() => loadPuzzle(level, puzzleIndex + 1)}
              className="flex flex-col items-center justify-center gap-1.5 p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
              title="پازل جدید"
            >
              <RotateCcw className="w-5 h-5 text-indigo-400" />
              <span className="text-[11px] font-semibold">جدید</span>
            </button>
          </div>

          {/* 1-9 Numeric Keypad */}
          <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-3 px-1">
              <span>صفحه‌کلید ارقام:</span>
              <span className="text-[11px] text-amber-400">امکان ورود با ارقام فارسی و انگلیسی</span>
            </div>

            <div className="grid grid-cols-3 gap-2.5" dir="ltr">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => {
                const count = remainingCounts[num] || 0;
                const isComplete = count >= 9;

                return (
                  <button
                    key={num}
                    disabled={isComplete}
                    onClick={() => handleInputNumber(num)}
                    className={`relative flex flex-col items-center justify-center py-3 sm:py-3.5 rounded-xl border font-bold transition-all ${
                      isComplete
                        ? 'opacity-30 bg-slate-950 border-slate-900 text-slate-600 cursor-not-allowed'
                        : 'bg-slate-800/90 hover:bg-amber-500/20 active:bg-amber-500/40 border-slate-700 hover:border-amber-500/50 text-white hover:text-amber-300 shadow-sm'
                    }`}
                  >
                    <span className="text-xl sm:text-2xl font-black">
                      {digitStyle === 'persian' ? toPersianDigits(num) : num}
                    </span>
                    <span className="text-[9px] text-slate-400">
                      {toPersianDigits(9 - count)} باقی‌مانده
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Conflict toggle switch */}
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 text-xs">
            <span className="text-slate-300">بررسی آنی مغایرت‌ها و خطاها</span>
            <button
              onClick={() => setShowErrors(!showErrors)}
              className={`px-3 py-1 rounded-lg font-semibold transition-colors ${
                showErrors
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'bg-slate-800 text-slate-400'
              }`}
            >
              {showErrors ? 'فعال' : 'غیرفعال'}
            </button>
          </div>
        </div>
      </div>

      {/* Smart Hint Explanation Card */}
      {activeHint && (
        <div className="mt-6 p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-amber-400" />
              <h4 className="font-bold text-sm sm:text-base text-white">
                راهنمایی منطقی: {activeHint.techniqueFa}
              </h4>
            </div>
            <button
              onClick={() => setActiveHint(null)}
              className="text-xs text-slate-400 hover:text-white"
            >
              بستن
            </button>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">
            {activeHint.explanationFa}
          </p>
          <div className="flex items-center justify-end gap-2">
            <button
              onClick={handleApplyHint}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-colors"
            >
              درج خودکار عدد {digitStyle === 'persian' ? toPersianDigits(activeHint.value) : activeHint.value}
            </button>
          </div>
        </div>
      )}

      {/* Victory Modal */}
      {isSolved && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="max-w-md w-full bg-slate-900 border border-amber-500/40 rounded-3xl p-6 sm:p-8 text-center space-y-5 shadow-2xl">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border border-amber-500/40 mx-auto flex items-center justify-center text-amber-400 shadow-lg">
              <Trophy className="w-8 h-8" />
            </div>

            <div>
              <h3 className="text-2xl font-black text-white mb-2">آفرین! جدول حل شد</h3>
              <p className="text-xs sm:text-sm text-slate-300">
                شما این پازل {DIULTY_NAME(level)} را با موفقیت و تکیه بر تفکر منطقی به پایان رساندید.
              </p>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-2 gap-3 py-3 border-y border-slate-800 text-right">
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-[11px] text-slate-400 block mb-1">زمان ثبت‌شده</span>
                <span className="font-mono text-base font-bold text-amber-400">
                  {formatPersianTime(timerSeconds)}
                </span>
              </div>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-[11px] text-slate-400 block mb-1">تعداد خطاها</span>
                <span className="font-mono text-base font-bold text-slate-200">
                  {toPersianDigits(mistakes)} خطا
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-2 pt-2">
              <button
                onClick={() => loadPuzzle(level, puzzleIndex + 1)}
                className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm rounded-xl shadow-lg transition-all"
              >
                حل پازل بعدی این سطح
              </button>
              <button
                onClick={onBackToHome}
                className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl transition-colors"
              >
                بازگشت به منوی اصلی
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

function DIULTY_NAME(lvl: DifficultyLevel): string {
  if (lvl === 'beginner') return 'سطح مبتدی';
  if (lvl === 'intermediate') return 'سطح متوسط';
  return 'سطح پیشرفته';
}

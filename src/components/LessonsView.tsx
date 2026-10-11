import React, { useState } from 'react';
import { DifficultyLevel, Lesson, UserStats } from '../types/sudoku';
import { LESSONS } from '../data/lessons';
import { toPersianDigits, DIFFICULTY_LABELS_FA } from '../utils/persian';
import { sounds } from '../utils/audio';
import {
  GraduationCap,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  PlayCircle,
  Clock,
  Sparkles,
  BookOpen,
} from 'lucide-react';

interface LessonsViewProps {
  initialLevel?: DifficultyLevel;
  digitStyle: 'persian' | 'english';
  onPracticeLesson: (level: DifficultyLevel) => void;
  onBackToHome: () => void;
  userStats: UserStats;
  onUpdateStats: (updateFn: (prev: UserStats) => UserStats) => void;
}

export const LessonsView: React.FC<LessonsViewProps> = ({
  initialLevel = 'beginner',
  digitStyle,
  onPracticeLesson,
  onBackToHome,
  userStats,
  onUpdateStats,
}) => {
  const [selectedLevel, setSelectedLevel] = useState<DifficultyLevel>(initialLevel);
  const filteredLessons = LESSONS.filter((l) => l.level === selectedLevel);
  const [activeLessonIndex, setActiveLessonIndex] = useState(0);
  const activeLesson: Lesson = filteredLessons[activeLessonIndex] || filteredLessons[0];

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const activeStep = activeLesson.steps[currentStepIndex] || activeLesson.steps[0];

  const isCompleted = userStats.completedLessons.includes(activeLesson.id);

  const formatDigit = (val: number | null): string => {
    if (val === null || val === 0) return '';
    return digitStyle === 'persian' ? toPersianDigits(val) : String(val);
  };

  const handleNextStep = () => {
    sounds.playPlaceNumber(4);
    if (currentStepIndex < activeLesson.steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    } else {
      // Complete lesson
      if (!isCompleted) {
        onUpdateStats((prev) => ({
          ...prev,
          completedLessons: [...prev.completedLessons, activeLesson.id],
        }));
        sounds.playVictory();
      }
    }
  };

  const handlePrevStep = () => {
    sounds.playPlaceNumber(3);
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 pb-20">
      {/* Top Bar with Navigation and Level Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 p-4 rounded-2xl bg-slate-900/90 border border-slate-800">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToHome}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors"
          >
            <ArrowRight className="w-3.5 h-3.5" />
            <span>بازگشت به خانه</span>
          </button>
          <div className="flex items-center gap-2 text-white font-bold text-sm sm:text-base">
            <GraduationCap className="w-5 h-5 text-amber-400" />
            <span>آموزش‌های تخصصی سودوکو</span>
          </div>
        </div>

        {/* Level Filters */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
          {(['beginner', 'intermediate', 'advanced'] as DifficultyLevel[]).map((lvl) => (
            <button
              key={lvl}
              onClick={() => {
                setSelectedLevel(lvl);
                setActiveLessonIndex(0);
                setCurrentStepIndex(0);
                sounds.playPlaceNumber(2);
              }}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                selectedLevel === lvl
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {DIFFICULTY_LABELS_FA[lvl]}
            </button>
          ))}
        </div>
      </div>

      {/* Lesson Selector Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-6">
        {filteredLessons.map((les, idx) => {
          const isDone = userStats.completedLessons.includes(les.id);
          const isCurrent = idx === activeLessonIndex;
          return (
            <button
              key={les.id}
              onClick={() => {
                setActiveLessonIndex(idx);
                setCurrentStepIndex(0);
                sounds.playPlaceNumber(3);
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all border ${
                isCurrent
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-md'
                  : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:bg-slate-800/80 hover:text-slate-200'
              }`}
            >
              {isDone ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              ) : (
                <BookOpen className="w-4 h-4 text-slate-500 shrink-0" />
              )}
              <span>{les.titleFa}</span>
            </button>
          );
        })}
      </div>

      {/* Main Lesson Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Interactive Board Demonstration */}
        <div className="lg:col-span-6 flex flex-col items-center">
          <div className="w-full aspect-square max-w-[420px] bg-slate-900 border-2 sm:border-3 border-amber-500/70 rounded-2xl p-1 sm:p-1.5 shadow-2xl shadow-black/60 relative grid grid-cols-9 grid-rows-9 gap-0" dir="ltr">
            {Array.from({ length: 9 }).map((_, r) =>
              Array.from({ length: 9 }).map((_, c) => {
                const val = activeStep.boardState[r]?.[c] ?? null;
                const isTarget = activeStep.targetCell?.[0] === r && activeStep.targetCell?.[1] === c;
                const isHighlighted = activeStep.highlightCells?.some(
                  ([hr, hc]) => hr === r && hc === c
                );

                const borderClasses = `
                  ${c % 3 === 2 && c !== 8 ? 'border-r-2 border-r-amber-500/60' : 'border-r border-r-slate-800'}
                  ${r % 3 === 2 && r !== 8 ? 'border-b-2 border-b-amber-500/60' : 'border-b border-b-slate-800'}
                `;

                let bgClass = 'bg-slate-900/80 text-slate-300';
                if (isHighlighted) {
                  bgClass = 'bg-amber-500/20 text-amber-300 font-bold';
                }
                if (isTarget) {
                  bgClass = 'bg-emerald-500/30 text-emerald-300 font-black border-2 border-emerald-400 animate-pulse';
                }

                return (
                  <div
                    key={`${r}-${c}`}
                    className={`flex items-center justify-center text-base sm:text-xl font-bold select-none ${borderClasses} ${bgClass}`}
                  >
                    {isTarget && activeStep.targetValue
                      ? formatDigit(activeStep.targetValue)
                      : formatDigit(val)}
                  </div>
                );
              })
            )}
          </div>
          <span className="text-[11px] text-slate-400 mt-2 text-center">
            تخته آموزشی تعاملی: خانه‌های برجسته فرآیند استدلال منطقی را نمایش می‌دهند
          </span>
        </div>

        {/* Step Explanation & Guided Actions */}
        <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
          <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
            {/* Step Counter */}
            <div className="flex items-center justify-between">
              <span className="text-xs px-3 py-1 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 font-semibold">
                گام {toPersianDigits(activeStep.stepNumber)} از {toPersianDigits(activeLesson.steps.length)}
              </span>

              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <Clock className="w-3.5 h-3.5" />
                <span>{toPersianDigits(activeLesson.durationMinutes)} دقیقه آموزش</span>
              </div>
            </div>

            {/* Step Title & Explanation */}
            <div>
              <h3 className="text-lg sm:text-xl font-black text-white mb-2">
                {activeStep.titleFa}
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                {activeStep.explanationFa}
              </p>
            </div>

            {/* Pedagogical Hint Callout */}
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/90 text-xs text-slate-400 space-y-1">
              <span className="font-bold text-amber-400 block mb-1">
                نکته کلیدی استاد:
              </span>
              <span>
                در سودوکو هیچ‌گاه نیاز به حدس زدن ندارید؛ با اسکن پیوسته و تکیه بر استدلال سلول‌های باقی‌مانده به شکل طبیعی مشخص خواهند شد.
              </span>
            </div>

            {/* Navigation Buttons for Steps */}
            <div className="flex items-center justify-between gap-3 pt-3 border-t border-slate-800">
              <button
                disabled={currentStepIndex === 0}
                onClick={handlePrevStep}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
              >
                <ArrowRight className="w-3.5 h-3.5" />
                <span>گام قبلی</span>
              </button>

              <button
                onClick={handleNextStep}
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs sm:text-sm font-bold shadow-md transition-all"
              >
                <span>
                  {currentStepIndex === activeLesson.steps.length - 1
                    ? isCompleted
                      ? 'پایان درس (تکمیل شده)'
                      : 'تکمیل و ثبت این درس'
                    : 'گام بعدی آموزش'}
                </span>
                <ArrowLeft className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Practice Action Card */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-900/80 border border-slate-800 flex items-center justify-between gap-4">
            <div>
              <h4 className="text-sm font-bold text-white mb-1">آزمایش عملی این تکنیک</h4>
              <p className="text-xs text-slate-400">
                یک جدول واقعی {DIFFICULTY_LABELS_FA[selectedLevel]} را باز کرده و آموخته‌های خود را بسنجید.
              </p>
            </div>

            <button
              onClick={() => {
                onPracticeLesson(selectedLevel);
                sounds.playPlaceNumber(5);
              }}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold text-xs rounded-xl border border-amber-500/30 hover:border-amber-500/60 shadow-sm shrink-0 transition-all"
            >
              <PlayCircle className="w-4 h-4 text-amber-400" />
              <span>شروع حل جدول</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

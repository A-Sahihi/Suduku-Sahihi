import React, { useState, useEffect, useRef } from 'react';
import { DifficultyLevel, ExamResult, UserStats } from '../types/sudoku';
import { EXAM_QUESTIONS } from '../data/examQuestions';
import { formatPersianTime, toPersianDigits, DIFFICULTY_LABELS_FA } from '../utils/persian';
import { sounds } from '../utils/audio';
import { ExamResultModal } from './ExamResultModal';
import {
  Award,
  ArrowRight,
  ArrowLeft,
  Clock,
  AlertCircle,
  HelpCircle,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

interface ExamViewProps {
  level: DifficultyLevel;
  onBackToHome: () => void;
  onUpdateStats: (updateFn: (prev: UserStats) => UserStats) => void;
}

export const ExamView: React.FC<ExamViewProps> = ({
  level,
  onBackToHome,
  onUpdateStats,
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [examResult, setExamResult] = useState<ExamResult | null>(null);
  const timerRef = useRef<number | null>(null);

  const activeQuestion = EXAM_QUESTIONS[currentQuestionIndex];
  const totalQuestions = EXAM_QUESTIONS.length;

  // Start exam timer
  useEffect(() => {
    if (isFinished) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = window.setInterval(() => {
      setTimerSeconds((prev) => prev + 1);
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isFinished]);

  const handleSelectOption = (questionId: string, val: number) => {
    sounds.playPlaceNumber(3);
    setUserAnswers((prev) => ({ ...prev, [questionId]: val }));
  };

  const handleNext = () => {
    sounds.playPlaceNumber(4);
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrev = () => {
    sounds.playPlaceNumber(2);
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmitExam = () => {
    sounds.playVictory();
    let correctCount = 0;
    let mistakes = 0;

    EXAM_QUESTIONS.forEach((q) => {
      const ans = userAnswers[q.id];
      if (ans === q.correctAnswer) {
        correctCount++;
      } else {
        mistakes++;
      }
    });

    const score = Math.round((correctCount / totalQuestions) * 100);
    const passed = score >= 60;
    const certId = `AS-SUDOKU-${Math.floor(100000 + Math.random() * 900000)}`;

    let feedbackFa = 'شما تسلط فوق‌العاده‌ای در تشخیص الگوها و قوانین بنیادین سودوکو نشان دادید.';
    if (score < 60) {
      feedbackFa = 'پیشنهاد می‌شود پیش از آزمون مجدد، درس‌های تک‌کاندید و جفت‌های پنهان را یک بار دیگر مرور کنید.';
    } else if (score < 85) {
      feedbackFa = 'عملکرد شما شایسته و مطلوب بود. با تمرین بیشتر روی الگوهای X-Wing به رتبه استادی دست خواهید یافت.';
    }

    const result: ExamResult = {
      date: new Date().toLocaleDateString('fa-IR'),
      level,
      score,
      totalTimeSeconds: timerSeconds,
      mistakes,
      passed,
      accuracy: score,
      feedbackFa,
      certId,
    };

    setExamResult(result);
    setIsFinished(true);

    onUpdateStats((prev) => ({
      ...prev,
      examHistory: [result, ...prev.examHistory],
    }));
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 pb-20">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 p-4 rounded-2xl bg-slate-900/90 border border-slate-800">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToHome}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors"
          >
            <ArrowRight className="w-3.5 h-3.5" />
            <span>انصراف و خروج</span>
          </button>
          <div className="flex items-center gap-2 text-white font-bold text-sm sm:text-base">
            <Award className="w-5 h-5 text-amber-400" />
            <span>آزمون سنجش مهارت سودوکو: {DIFFICULTY_LABELS_FA[level]}</span>
          </div>
        </div>

        {/* Live Timer */}
        <div className="flex items-center gap-2 bg-slate-950 px-3.5 py-1.5 rounded-xl border border-slate-800 text-xs sm:text-sm font-semibold">
          <Clock className="w-4 h-4 text-amber-400" />
          <span>زمان آزمون:</span>
          <span className="font-mono text-amber-300 font-bold">
            {formatPersianTime(timerSeconds)}
          </span>
        </div>
      </div>

      {/* Question Stepper */}
      <div className="flex items-center justify-between mb-4 px-2">
        <span className="text-xs text-slate-400">
          سوال {toPersianDigits(currentQuestionIndex + 1)} از {toPersianDigits(totalQuestions)}
        </span>
        <div className="flex items-center gap-1.5">
          {EXAM_QUESTIONS.map((q, idx) => {
            const isAnswered = userAnswers[q.id] !== undefined;
            const isCurrent = idx === currentQuestionIndex;
            return (
              <div
                key={q.id}
                className={`w-7 h-2 rounded-full transition-all ${
                  isCurrent
                    ? 'bg-amber-400'
                    : isAnswered
                    ? 'bg-amber-500/40'
                    : 'bg-slate-800'
                }`}
              />
            );
          })}
        </div>
      </div>

      {/* Main Question Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-300 text-xs font-semibold mb-3 border border-amber-500/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>تحلیل سناریو</span>
          </div>
          <h3 className="text-lg sm:text-xl font-black text-white mb-2">
            {activeQuestion.titleFa}
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            {activeQuestion.descriptionFa}
          </p>
        </div>

        {/* Board Context Preview */}
        <div className="flex justify-center py-2">
          <div
            className="w-full max-w-[280px] sm:max-w-[320px] aspect-square bg-slate-950 border-2 border-amber-500/50 rounded-2xl p-1 grid grid-cols-9 grid-rows-9 gap-0 shadow-lg"
            dir="ltr"
          >
            {Array.from({ length: 9 }).map((_, r) =>
              Array.from({ length: 9 }).map((_, c) => {
                const val = activeQuestion.boardState[r]?.[c];
                const isTarget =
                  activeQuestion.targetCell[0] === r && activeQuestion.targetCell[1] === c;

                const borderClasses = `
                  ${c % 3 === 2 && c !== 8 ? 'border-r-2 border-r-amber-500/50' : 'border-r border-r-slate-800'}
                  ${r % 3 === 2 && r !== 8 ? 'border-b-2 border-b-amber-500/50' : 'border-b border-b-slate-800'}
                `;

                return (
                  <div
                    key={`${r}-${c}`}
                    className={`flex items-center justify-center text-xs sm:text-sm font-bold ${borderClasses} ${
                      isTarget
                        ? 'bg-amber-400 text-slate-950 animate-pulse font-black'
                        : val
                        ? 'bg-slate-900 text-amber-200'
                        : 'bg-slate-950 text-slate-700'
                    }`}
                  >
                    {isTarget ? '؟' : val ? toPersianDigits(val) : ''}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Options List */}
        <div className="space-y-3 pt-2">
          <span className="text-xs font-bold text-slate-400 block mb-2">
            گزینه صحیح را انتخاب فرمایید:
          </span>
          {activeQuestion.options.map((opt) => {
            const isSelected = userAnswers[activeQuestion.id] === opt.value;
            return (
              <button
                key={opt.id}
                onClick={() => handleSelectOption(activeQuestion.id, opt.value)}
                className={`w-full p-4 rounded-xl border text-right flex items-center justify-between transition-all ${
                  isSelected
                    ? 'bg-amber-500/20 border-amber-500 text-white shadow-md'
                    : 'bg-slate-950/80 border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white'
                }`}
              >
                <span className="text-xs sm:text-sm font-semibold">{opt.textFa}</span>
                <div
                  className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                    isSelected
                      ? 'border-amber-400 bg-amber-400 text-slate-950'
                      : 'border-slate-600'
                  }`}
                >
                  {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                </div>
              </button>
            );
          })}
        </div>

        {/* Stepper Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-800">
          <button
            disabled={currentQuestionIndex === 0}
            onClick={handlePrev}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
          >
            <ArrowRight className="w-3.5 h-3.5" />
            <span>سوال قبلی</span>
          </button>

          {currentQuestionIndex < totalQuestions - 1 ? (
            <button
              onClick={handleNext}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs sm:text-sm font-bold border border-amber-500/30 transition-all"
            >
              <span>سوال بعدی</span>
              <ArrowLeft className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={handleSubmitExam}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs sm:text-sm font-black shadow-lg shadow-amber-500/20 transition-all"
            >
              <Award className="w-4 h-4" />
              <span>پایان آزمون و صدور کارنامه</span>
            </button>
          )}
        </div>
      </div>

      {/* Result Modal when exam is complete */}
      {isFinished && examResult && (
        <ExamResultModal
          result={examResult}
          onRetake={() => {
            setIsFinished(false);
            setExamResult(null);
            setCurrentQuestionIndex(0);
            setUserAnswers({});
            setTimerSeconds(0);
          }}
          onHome={onBackToHome}
        />
      )}
    </div>
  );
};

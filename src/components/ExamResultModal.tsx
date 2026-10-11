import React from 'react';
import { ExamResult } from '../types/sudoku';
import { toPersianDigits, formatPersianTime, DIFFICULTY_LABELS_FA } from '../utils/persian';
import {
  Award,
  CheckCircle2,
  Clock,
  AlertTriangle,
  RotateCcw,
  Home,
  Printer,
  Sparkles,
} from 'lucide-react';

interface ExamResultModalProps {
  result: ExamResult;
  onRetake: () => void;
  onHome: () => void;
}

export const ExamResultModal: React.FC<ExamResultModalProps> = ({
  result,
  onRetake,
  onHome,
}) => {
  const getGradeTitle = (score: number) => {
    if (score >= 90) return 'رتبه استادی و ممتاز (Mastery)';
    if (score >= 75) return 'رتبه پیشرفته و بسیار خوب (Advanced)';
    if (score >= 60) return 'رتبه شایسته و قبولی (Proficient)';
    return 'نیاز به تمرین و مرور تکنیک‌ها (Needs Practice)';
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 overflow-y-auto">
      <div className="max-w-2xl w-full bg-slate-900 border border-amber-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 my-auto text-right">
        {/* Certificate / Header Banner */}
        <div className="relative p-6 rounded-2xl bg-gradient-to-br from-amber-500/20 via-slate-950 to-slate-950 border border-amber-500/30 text-center">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-500/40 mx-auto flex items-center justify-center text-amber-400 mb-3 shadow-lg">
            <Award className="w-7 h-7" />
          </div>

          <div className="space-y-1 mb-3">
            <span
              dir="ltr"
              className="font-sans font-extrabold text-xl sm:text-2xl text-amber-300 tracking-wide block"
            >
              Ahmadreza Sahihi
            </span>
            <span className="text-xs text-amber-400/80 font-medium tracking-wide">
              SUDOKU MASTER ACADEMY · گواهینامه ارزیابی مهارت منطقی
            </span>
          </div>

          <h3 className="text-xl sm:text-2xl font-black text-white">
            {result.passed ? 'تبریک! آزمون با موفقیت گذرانده شد' : 'نتیجه ارزیابی آزمون سودوکو'}
          </h3>
          <p className="text-xs text-slate-300 mt-1">
            سطح آزمون: {DIFFICULTY_LABELS_FA[result.level]} · شناسه رهگیری:{' '}
            <span className="font-mono">{toPersianDigits(result.certId)}</span>
          </p>
        </div>

        {/* Score & Key Metrics */}
        <div className="grid grid-cols-3 gap-3">
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-center">
            <span className="text-[11px] text-slate-400 block mb-1">نمره کسب‌شده</span>
            <span className="text-2xl sm:text-3xl font-black font-mono text-amber-400">
              %{toPersianDigits(result.score)}
            </span>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-center">
            <span className="text-[11px] text-slate-400 block mb-1">مدت زمان آزمون</span>
            <span className="text-xl sm:text-2xl font-bold font-mono text-slate-100 flex items-center justify-center gap-1">
              <Clock className="w-4 h-4 text-slate-400" />
              {formatPersianTime(result.totalTimeSeconds)}
            </span>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-center">
            <span className="text-[11px] text-slate-400 block mb-1">خطاهای پاسخ</span>
            <span className="text-xl sm:text-2xl font-bold font-mono text-slate-100">
              {toPersianDigits(result.mistakes)}
            </span>
          </div>
        </div>

        {/* Qualitative Feedback */}
        <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <h4 className="text-sm font-bold text-white">
              ارزیابی سطح مهارت: {getGradeTitle(result.score)}
            </h4>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            {result.feedbackFa}
          </p>
        </div>

        {/* Skill Breakdown */}
        <div className="space-y-2 pt-2">
          <h5 className="text-xs font-bold text-slate-400">تحلیل تکنیک‌های تخصصی:</h5>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
              <span className="text-slate-300">اسکن چشمی و تمرکز:</span>
              <span className="text-emerald-400 font-bold">عالی</span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
              <span className="text-slate-300">تکنیک تک‌کاندیدها:</span>
              <span className="text-emerald-400 font-bold">تسلط کامل</span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
              <span className="text-slate-300">جفت‌های پنهان:</span>
              <span className="text-amber-400 font-bold">بسیار خوب</span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
              <span className="text-slate-300">الگوهای متقاطع و خطوط:</span>
              <span className="text-amber-400 font-bold">شایسته</span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-800">
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
          >
            <Printer className="w-4 h-4 text-slate-400" />
            <span>چاپ گواهینامه</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onRetake}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
            >
              <RotateCcw className="w-4 h-4 text-amber-400" />
              <span>شرکت مجدد در آزمون</span>
            </button>

            <button
              onClick={onHome}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-colors shadow-md"
            >
              <Home className="w-4 h-4" />
              <span>بازگشت به صفحه اصلی</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

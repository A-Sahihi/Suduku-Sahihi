import React from 'react';
import { UserStats } from '../types/sudoku';
import { toPersianDigits, formatPersianTime, DIFFICULTY_LABELS_FA } from '../utils/persian';
import {
  BarChart3,
  Trophy,
  Clock,
  GraduationCap,
  Award,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

interface DashboardViewProps {
  userStats: UserStats;
  onBackToHome: () => void;
  onPlayGame: () => void;
  onTakeExam: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  userStats,
  onBackToHome,
  onPlayGame,
  onTakeExam,
}) => {
  const winRate =
    userStats.gamesPlayed > 0
      ? Math.round((userStats.gamesWon / userStats.gamesPlayed) * 100)
      : 100;

  const badges = [
    {
      titleFa: 'تمرکز و سرعت اسکن',
      descFa: 'حل اولین جدول سودوکو بدون خطای اضافه',
      achieved: userStats.gamesWon > 0,
    },
    {
      titleFa: 'استاد تک‌کاندیدها',
      descFa: 'تکمیل دروس تک‌کاندید عریان و پنهان',
      achieved: userStats.completedLessons.length >= 2,
    },
    {
      titleFa: 'دید بلوکی و جفت‌ها',
      descFa: 'گذراندن آزمون سطح متوسط با نمره بالای ۷۵٪',
      achieved: userStats.examHistory.some((e) => e.score >= 75),
    },
    {
      titleFa: 'ذهن استراتژیک X-Wing',
      descFa: 'تسلط بر دروس پیشرفته و آزمون استادی',
      achieved: userStats.completedLessons.length >= 5,
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 pb-20">
      {/* Top Header */}
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
            <BarChart3 className="w-5 h-5 text-amber-400" />
            <span>داشبورد پیشرفت و کارنامه عملکرد</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onPlayGame}
            className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-sm transition-all"
          >
            حل بازی جدید
          </button>
        </div>
      </div>

      {/* Primary KPI Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">جدول‌های حل‌شده</span>
            <Trophy className="w-4 h-4 text-amber-400" />
          </div>
          <span className="text-2xl sm:text-3xl font-black font-mono text-white">
            {toPersianDigits(userStats.gamesWon)}
          </span>
          <span className="text-[11px] text-slate-400 block mt-1">
            از مجموع {toPersianDigits(userStats.gamesPlayed)} بازی آغاز شده
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">نرخ موفقیت</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <span className="text-2xl sm:text-3xl font-black font-mono text-emerald-400">
            %{toPersianDigits(winRate)}
          </span>
          <span className="text-[11px] text-slate-400 block mt-1">
            دقت در تکمیل بدون شکست
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">درس‌های تکمیل‌شده</span>
            <GraduationCap className="w-4 h-4 text-indigo-400" />
          </div>
          <span className="text-2xl sm:text-3xl font-black font-mono text-white">
            {toPersianDigits(userStats.completedLessons.length)}
          </span>
          <span className="text-[11px] text-slate-400 block mt-1">از ۶ درس تخصصی آکادمی</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">آزمون‌های سنجش</span>
            <Award className="w-4 h-4 text-amber-400" />
          </div>
          <span className="text-2xl sm:text-3xl font-black font-mono text-amber-300">
            {toPersianDigits(userStats.examHistory.length)}
          </span>
          <span className="text-[11px] text-slate-400 block mt-1">کارنامه‌های صادر شده</span>
        </div>
      </div>

      {/* Best Times Across Difficulties */}
      <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 mb-8 space-y-4">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-amber-400" />
          <h3 className="text-base font-bold text-white">بهترین رکوردهای زمانی ثبت‌شده:</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-xs text-slate-400 block mb-1">سطح مبتدی</span>
            <span className="font-mono text-lg font-bold text-amber-400">
              {userStats.bestTimeSeconds.beginner !== null
                ? formatPersianTime(userStats.bestTimeSeconds.beginner)
                : 'هنوز ثبت نشده'}
            </span>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-xs text-slate-400 block mb-1">سطح متوسط</span>
            <span className="font-mono text-lg font-bold text-amber-400">
              {userStats.bestTimeSeconds.intermediate !== null
                ? formatPersianTime(userStats.bestTimeSeconds.intermediate)
                : 'هنوز ثبت نشده'}
            </span>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-xs text-slate-400 block mb-1">سطح پیشرفته و حرفه‌ای</span>
            <span className="font-mono text-lg font-bold text-amber-400">
              {userStats.bestTimeSeconds.advanced !== null
                ? formatPersianTime(userStats.bestTimeSeconds.advanced)
                : 'هنوز ثبت نشده'}
            </span>
          </div>
        </div>
      </div>

      {/* Badges / Mastery Showcase */}
      <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 mb-8 space-y-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-400" />
          <h3 className="text-base font-bold text-white">نشان‌های افتخار و تسلط منطقی:</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {badges.map((b, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-xl border flex flex-col justify-between transition-all ${
                b.achieved
                  ? 'bg-amber-500/10 border-amber-500/40 text-white'
                  : 'bg-slate-950/60 border-slate-800 text-slate-500 opacity-60'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-amber-300">{b.titleFa}</span>
                  {b.achieved ? (
                    <CheckCircle2 className="w-4 h-4 text-amber-400" />
                  ) : (
                    <span className="text-[10px] text-slate-500">قفل</span>
                  )}
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">{b.descFa}</p>
              </div>
              <span className="text-[10px] font-semibold mt-3 text-slate-400">
                {b.achieved ? 'کسب شده ✓' : 'در انتظار دستیابی'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Exam History Table */}
      <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-bold text-white">تاریخچه کارنامه‌ها و آزمون‌ها</h3>
          </div>
          <button
            onClick={onTakeExam}
            className="text-xs text-amber-400 hover:text-amber-300 font-semibold transition-colors"
          >
            شرکت در آزمون جدید ←
          </button>
        </div>

        {userStats.examHistory.length === 0 ? (
          <div className="p-8 text-center bg-slate-950/60 rounded-xl border border-slate-800 text-slate-400 text-xs">
            هنوز در آزمونی شرکت نکرده‌اید. با شرکت در اولین آزمون، کارنامه و گواهینامه مهارت شما در این بخش ثبت می‌شود.
          </div>
        ) : (
          <div className="space-y-2.5">
            {userStats.examHistory.map((ex, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold ${
                      ex.passed
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    }`}
                  >
                    %{toPersianDigits(ex.score)}
                  </div>
                  <div>
                    <span className="font-bold text-white block">
                      آزمون {DIFFICULTY_LABELS_FA[ex.level]}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      تاریخ: {toPersianDigits(ex.date)} · شناسه: {toPersianDigits(ex.certId)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-slate-300">
                  <span>زمان: {formatPersianTime(ex.totalTimeSeconds)}</span>
                  <span>خطا: {toPersianDigits(ex.mistakes)}</span>
                  <span
                    className={`px-2.5 py-0.5 rounded-md text-[11px] font-bold ${
                      ex.passed ? 'bg-emerald-500/15 text-emerald-400' : 'bg-red-500/15 text-red-400'
                    }`}
                  >
                    {ex.passed ? 'قبول شده' : 'مردود'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

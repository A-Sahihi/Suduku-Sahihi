import React from 'react';
import { motion } from 'motion/react';
import {
  GraduationCap,
  PlayCircle,
  Award,
  ChevronDown,
  Brain,
  Zap,
  Target,
  Sparkles,
} from 'lucide-react';
import { sounds } from '../utils/audio';

interface HeroProps {
  onStartLearning: () => void;
  onPlaySudoku: () => void;
  onTakeExam: () => void;
  onScrollToLevels: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onStartLearning,
  onPlaySudoku,
  onTakeExam,
  onScrollToLevels,
}) => {
  return (
    <section className="relative pt-28 sm:pt-36 pb-20 sm:pb-28 overflow-hidden flex flex-col items-center justify-center text-center px-4 sm:px-6 lg:px-8">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] sm:w-[650px] h-[340px] sm:h-[650px] bg-gradient-to-tr from-amber-500/10 via-amber-400/5 to-slate-900/0 rounded-full blur-3xl pointer-events-none" />

      {/* Decorative Persian Tagline */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs sm:text-sm font-medium mb-6 shadow-sm"
      >
        <Sparkles className="w-4 h-4 text-amber-400" />
        <span>آکادمی جامع آموزش و آزمون سودوکو</span>
      </motion.div>

      {/* Prominent Large English Name: Ahmadreza Sahihi */}
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 25 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 max-w-4xl mx-auto mb-4"
      >
        <h1
          dir="ltr"
          className="font-sans text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white via-amber-100 to-amber-500 select-none drop-shadow-[0_10px_25px_rgba(245,158,11,0.2)]"
        >
          Ahmadreza Sahihi
        </h1>
      </motion.div>

      {/* Persian Title and Subtitle */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-2xl mx-auto space-y-4 mb-10"
      >
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-100">
          سامانه تخصصی مهارت‌های تفکر منطقی و استراتژی‌های حل سودوکو
        </h2>
        <p className="text-sm sm:text-base text-slate-400 leading-relaxed max-w-xl mx-auto">
          از اصول پایه‌ای اسکن چشمی تا تسلط بر تکنیک‌های پیشرفته جهانی مانند تک‌کاندیدها، جفت‌های پنهان، خطوط هدایت‌گر و الگوی X-Wing؛ همراه با جدول هوشمند تعاملی و آزمون استاندارد.
        </p>
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 relative z-10 mb-16"
      >
        <button
          onClick={() => {
            onScrollToLevels();
            sounds.playPlaceNumber(5);
          }}
          className="flex items-center gap-2 px-6 py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm sm:text-base rounded-xl shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
        >
          <GraduationCap className="w-5 h-5" />
          <span>انتخاب سطح و آموزش‌ها</span>
          <ChevronDown className="w-4 h-4 animate-bounce" />
        </button>

        <button
          onClick={() => {
            onPlaySudoku();
            sounds.playPlaceNumber(4);
          }}
          className="flex items-center gap-2 px-6 py-3.5 bg-slate-900 hover:bg-slate-800 text-slate-100 font-semibold text-sm sm:text-base rounded-xl border border-slate-700/80 hover:border-amber-500/40 shadow-md transition-all transform hover:-translate-y-0.5 active:translate-y-0"
        >
          <PlayCircle className="w-5 h-5 text-amber-400" />
          <span>حل تعاملی جدول</span>
        </button>

        <button
          onClick={() => {
            onTakeExam();
            sounds.playPlaceNumber(6);
          }}
          className="flex items-center gap-2 px-5 py-3.5 bg-slate-900/60 hover:bg-slate-800 text-amber-300 font-medium text-sm sm:text-base rounded-xl border border-amber-500/30 hover:border-amber-500/60 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
        >
          <Award className="w-5 h-5 text-amber-400" />
          <span>شرکت در آزمون سنجش</span>
        </button>
      </motion.div>

      {/* 3 Pillars / Feature Cards */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 max-w-5xl w-full text-right"
      >
        <div className="p-5 sm:p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-amber-500/30 transition-all group">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-4 group-hover:scale-110 transition-transform">
            <Brain className="w-5 h-5" />
          </div>
          <h3 className="text-base sm:text-lg font-bold text-white mb-2">آموزش گام‌به‌گام تکنیک‌ها</h3>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            درس‌های تعاملی تصویری از سطح مبتدی تا پیشرفته بدون نیاز به حدس و آزمایش خطا.
          </p>
        </div>

        <div className="p-5 sm:p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-amber-500/30 transition-all group">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-4 group-hover:scale-110 transition-transform">
            <Zap className="w-5 h-5" />
          </div>
          <h3 className="text-base sm:text-lg font-bold text-white mb-2">جدول هوشمند دو زبانه</h3>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            پشتیبانی کامل از ارقام فارسی و انگلیسی، سیستم راهنمایی تحلیلی، حالت یادداشت و تشخیص اشتباهات.
          </p>
        </div>

        <div className="p-5 sm:p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-amber-500/30 transition-all group">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-4 group-hover:scale-110 transition-transform">
            <Target className="w-5 h-5" />
          </div>
          <h3 className="text-base sm:text-lg font-bold text-white mb-2">آزمون استاندارد و کارنامه</h3>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            ارزیابی زمان حل، تعداد خطاها، دقت تفکر منطقی و صدور گواهینامه مهارت اختصاصی.
          </p>
        </div>
      </motion.div>
    </section>
  );
};

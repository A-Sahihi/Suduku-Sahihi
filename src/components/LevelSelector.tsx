import React from 'react';
import { motion } from 'motion/react';
import { DifficultyLevel } from '../types/sudoku';
import {
  GraduationCap,
  PlayCircle,
  Award,
  Star,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowLeft,
} from 'lucide-react';
import { toPersianDigits } from '../utils/persian';
import { sounds } from '../utils/audio';

interface LevelSelectorProps {
  onSelectLevel: (level: DifficultyLevel) => void;
  onOpenLessons: (level: DifficultyLevel) => void;
  onStartGame: (level: DifficultyLevel) => void;
  onStartExam: (level: DifficultyLevel) => void;
}

export const LevelSelector: React.FC<LevelSelectorProps> = ({
  onSelectLevel,
  onOpenLessons,
  onStartGame,
  onStartExam,
}) => {
  const levels = [
    {
      id: 'beginner' as DifficultyLevel,
      titleFa: 'سطح مبتدی (Beginner)',
      tagFa: 'شروع یادگیری',
      stars: 1,
      timeEstFa: '۵ الی ۱۰ دقیقه',
      descFa: 'مبانی حل سودوکو، قوانین سطرها و ستون‌ها، روش‌های اسکن دیداری و تکنیک تک‌کاندید عریان.',
      skillsFa: [
        'قوانین ۹ سطر، ۹ ستون و بلوک‌های ۳×۳',
        'اسکن افقی و عمودی خطوط',
        'شناسایی سریع تک‌کاندید عریان',
      ],
      themeColor: 'from-emerald-500/10 to-emerald-500/5',
      borderColor: 'border-emerald-500/30 hover:border-emerald-400',
      badgeColor: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
      buttonColor: 'bg-emerald-600 hover:bg-emerald-500 text-white',
    },
    {
      id: 'intermediate' as DifficultyLevel,
      titleFa: 'سطح متوسط (Intermediate)',
      tagFa: 'تکنیک‌های استراتژیک',
      stars: 2,
      timeEstFa: '۱۰ الی ۲۰ دقیقه',
      descFa: 'کشف جفت‌های آشکار و پنهان، خطوط هدایت‌گر و کاهش احتمالات بدون حدس و گمان.',
      skillsFa: [
        'تک‌کاندیدهای پنهان در بلوک (Hidden Singles)',
        'جفت‌های عریان و پنهان (Naked & Hidden Pairs)',
        'استراتژی حذف کاندیدهای غیرممکن',
      ],
      themeColor: 'from-amber-500/10 to-amber-500/5',
      borderColor: 'border-amber-500/30 hover:border-amber-400',
      badgeColor: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
      buttonColor: 'bg-amber-500 hover:bg-amber-400 text-slate-950',
    },
    {
      id: 'advanced' as DifficultyLevel,
      titleFa: 'سطح پیشرفته و حرفه‌ای (Advanced)',
      tagFa: 'استادی و تحلیل منطقی',
      stars: 3,
      timeEstFa: '۲۰ الی ۳۵ دقیقه',
      descFa: 'تسلط بر پیچیده‌ترین الگوهای ریاضیاتی سودوکو، الگوی بال X-Wing، خطوط متقاطع و زنجیره‌ها.',
      skillsFa: [
        'الگوی مستطیل ضربدری X-Wing',
        'خطوط هدایت‌گر قفل‌شده (Pointing Pairs)',
        'استراتژی‌های استادی حل جداول مسابقات',
      ],
      themeColor: 'from-indigo-500/10 to-indigo-500/5',
      borderColor: 'border-indigo-500/30 hover:border-indigo-400',
      badgeColor: 'bg-indigo-500/15 text-indigo-400 border-indigo-500/30',
      buttonColor: 'bg-indigo-600 hover:bg-indigo-500 text-white',
    },
  ];

  return (
    <section id="level-selection-section" className="py-12 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-amber-400 text-xs font-medium mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>مسیر آموزشی گام‌به‌گام</span>
        </div>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white mb-4">
          انتخاب سطح یادگیری و مهارت
        </h2>
        <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
          سطح مورد نظر خود را انتخاب کنید تا به آموزش‌های اختصاصی، جداول تمرینی متناسب و آزمون‌های سنجش دسترسی پیدا کنید.
        </p>
      </div>

      {/* Level Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
        {levels.map((lvl, index) => (
          <motion.div
            key={lvl.id}
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.15 }}
            className={`flex flex-col justify-between p-6 sm:p-7 rounded-2xl bg-gradient-to-b ${lvl.themeColor} bg-slate-900/80 border ${lvl.borderColor} transition-all duration-300 hover:shadow-xl hover:shadow-black/40 group`}
          >
            {/* Top Area */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className={`text-xs px-2.5 py-0.5 rounded-md font-semibold border ${lvl.badgeColor}`}>
                  {lvl.tagFa}
                </span>

                {/* Stars Rating */}
                <div className="flex items-center gap-1">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < lvl.stars ? 'text-amber-400 fill-amber-400' : 'text-slate-700'
                      }`}
                    />
                  ))}
                </div>
              </div>

              <h3 className="text-lg sm:text-xl font-bold text-white mb-2 group-hover:text-amber-300 transition-colors">
                {lvl.titleFa}
              </h3>

              <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-4">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>مدت تخمینی حل: {toPersianDigits(lvl.timeEstFa)}</span>
              </div>

              <p className="text-xs sm:text-sm text-slate-300 mb-6 leading-relaxed">
                {lvl.descFa}
              </p>

              {/* Skills bullet list */}
              <div className="space-y-2.5 mb-6 pt-4 border-t border-slate-800/80">
                <span className="text-xs font-semibold text-slate-400 block mb-2">
                  مهارت‌های محوری این سطح:
                </span>
                {lvl.skillsFa.map((skill, sIdx) => (
                  <div key={sIdx} className="flex items-start gap-2 text-xs text-slate-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                    <span>{skill}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="space-y-2.5 pt-4 border-t border-slate-800/80">
              <button
                onClick={() => {
                  onOpenLessons(lvl.id);
                  sounds.playPlaceNumber(4);
                }}
                className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md ${lvl.buttonColor}`}
              >
                <GraduationCap className="w-4 h-4" />
                <span>مشاهده درس‌های این سطح</span>
                <ArrowLeft className="w-4 h-4" />
              </button>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    onStartGame(lvl.id);
                    sounds.playPlaceNumber(5);
                  }}
                  className="py-2 px-3 rounded-lg bg-slate-800/90 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 flex items-center justify-center gap-1.5 transition-colors"
                >
                  <PlayCircle className="w-3.5 h-3.5 text-amber-400" />
                  <span>حل پازل تمرینی</span>
                </button>

                <button
                  onClick={() => {
                    onStartExam(lvl.id);
                    sounds.playPlaceNumber(6);
                  }}
                  className="py-2 px-3 rounded-lg bg-slate-800/90 hover:bg-slate-700 text-amber-300 text-xs font-semibold border border-amber-500/25 flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Award className="w-3.5 h-3.5 text-amber-400" />
                  <span>آزمون این سطح</span>
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

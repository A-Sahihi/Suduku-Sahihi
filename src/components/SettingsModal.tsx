import React from 'react';
import { UserStats } from '../types/sudoku';
import {
  X,
  Volume2,
  VolumeX,
  Globe,
  HelpCircle,
  Keyboard,
  Info,
  CheckCircle2,
} from 'lucide-react';
import { sounds } from '../utils/audio';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  userStats: UserStats;
  onUpdateStats: (updateFn: (prev: UserStats) => UserStats) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  userStats,
  onUpdateStats,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto">
      <div className="max-w-lg w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-2xl space-y-6 my-auto text-right">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-white">تنظیمات و راهنمای سامانه</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Settings Group */}
        <div className="space-y-4">
          {/* Sound Toggle */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-950 border border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                {userStats.soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
              </div>
              <div>
                <span className="text-sm font-bold text-white block">جلوه‌های صوتی (Sound Effects)</span>
                <span className="text-xs text-slate-400">پخش افکت‌های صوتی ملایم هنگام درج اعداد و کلیک‌ها</span>
              </div>
            </div>

            <button
              onClick={() => {
                const nextVal = !userStats.soundEnabled;
                sounds.enabled = nextVal;
                onUpdateStats((prev) => ({ ...prev, soundEnabled: nextVal }));
                if (nextVal) sounds.playPlaceNumber(4);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                userStats.soundEnabled
                  ? 'bg-amber-500 text-slate-950'
                  : 'bg-slate-800 text-slate-400'
              }`}
            >
              {userStats.soundEnabled ? 'روشن' : 'خاموش'}
            </button>
          </div>

          {/* Digit Style Preference */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                <Globe className="w-5 h-5" />
              </div>
              <div>
                <span className="text-sm font-bold text-white block">نمایش ارقام در جدول سودوکو</span>
                <span className="text-xs text-slate-400">هر دو نوع صفحه‌کلید فارسی و انگلیسی همیشه پشتیبانی می‌شوند</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                onClick={() => {
                  onUpdateStats((prev) => ({ ...prev, digitStyle: 'persian' }));
                  sounds.playPlaceNumber(3);
                }}
                className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                  userStats.digitStyle === 'persian'
                    ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                ارقام فارسی (۱، ۲، ۳، ...)
              </button>

              <button
                onClick={() => {
                  onUpdateStats((prev) => ({ ...prev, digitStyle: 'english' }));
                  sounds.playPlaceNumber(3);
                }}
                className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                  userStats.digitStyle === 'english'
                    ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                ارقام انگلیسی (1, 2, 3, ...)
              </button>
            </div>
          </div>
        </div>

        {/* Keyboard Shortcuts & Help */}
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2.5">
          <div className="flex items-center gap-2 text-white font-bold text-xs">
            <Keyboard className="w-4 h-4 text-amber-400" />
            <span>راهنمای کلیدهای میانبر در حین بازی:</span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-300">
            <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between">
              <span>ورود ارقام:</span>
              <span className="font-mono text-amber-400">۱-۹ یا 1-9</span>
            </div>
            <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between">
              <span>حالت یادداشت:</span>
              <span className="font-mono text-amber-400">کلید N</span>
            </div>
            <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between">
              <span>پاک کردن خانه:</span>
              <span className="font-mono text-amber-400">Backspace / Del</span>
            </div>
            <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between">
              <span>جابجایی در جدول:</span>
              <span className="font-mono text-amber-400">کلیدهای جهت‌نما</span>
            </div>
          </div>
        </div>

        {/* Academy & Creator Info */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 to-transparent border border-amber-500/20 text-xs text-slate-300 space-y-1">
          <div className="flex items-center justify-between mb-1">
            <span className="font-bold text-amber-300">درباره آکادمی تخصصی سودوکو:</span>
            <span dir="ltr" className="font-sans font-bold text-white">
              Ahmadreza Sahihi
            </span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            این سامانه جامع با هدف ارتقای تفکر استراتژیک، تمرکز دیداری و یادگیری روشمند حل جداول سودوکو طراحی و پیاده‌سازی شده است.
          </p>
        </div>

        {/* Footer */}
        <button
          onClick={onClose}
          className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm rounded-xl transition-colors shadow-md"
        >
          ذخیره و بازگشت به برنامه
        </button>
      </div>
    </div>
  );
};

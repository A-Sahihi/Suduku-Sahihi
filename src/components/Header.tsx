import React from 'react';
import { motion } from 'motion/react';
import {
  GraduationCap,
  Sparkles,
  Grid3X3,
  Award,
  BarChart3,
  Settings,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { sounds } from '../utils/audio';

interface HeaderProps {
  currentView: string;
  onNavigate: (view: string) => void;
  onOpenSettings: () => void;
  isScrolled: boolean;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onNavigate,
  onOpenSettings,
  isScrolled,
  soundEnabled,
  onToggleSound,
}) => {
  // Determine if header should be in compact mode
  // The name is always in the header if scrolled OR if not on the initial hero section of 'home'
  const isCompactHeader = isScrolled || currentView !== 'home';

  const navItems = [
    { id: 'home', label: 'صفحه اصلی', icon: Sparkles },
    { id: 'levels', label: 'سطوح یادگیری', icon: GraduationCap },
    { id: 'game', label: 'حل تعاملی', icon: Grid3X3 },
    { id: 'exam', label: 'آزمون مهارت', icon: Award },
    { id: 'dashboard', label: 'کارنامه و آمار', icon: BarChart3 },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${
        isCompactHeader
          ? 'bg-slate-950/95 backdrop-blur-md border-slate-800/80 shadow-lg shadow-black/30 py-2.5 sm:py-3'
          : 'bg-transparent border-transparent py-4 sm:py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        {/* Persistent Name / Brand Zone */}
        <div className="flex items-center gap-3">
          <motion.div
            layoutId="brand-lockup"
            transition={{ type: 'spring', stiffness: 260, damping: 25 }}
            className="flex items-center gap-2 cursor-pointer group"
            onClick={() => onNavigate('home')}
          >
            {/* Elegant Icon Badge */}
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-amber-500/20 via-amber-400/10 to-amber-500/30 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-sm shadow-amber-500/10 group-hover:border-amber-400 transition-colors">
              <Grid3X3 className="w-5 h-5 text-amber-400 group-hover:scale-105 transition-transform" />
            </div>

            {/* Persistent Name Display - Exact English spelling "Ahmadreza Sahihi" */}
            <div className="flex flex-col">
              <span
                dir="ltr"
                className={`font-sans font-bold tracking-tight text-white transition-all duration-300 ${
                  isCompactHeader
                    ? 'text-base sm:text-lg md:text-xl text-amber-100 group-hover:text-amber-400'
                    : 'text-lg sm:text-xl md:text-2xl text-white font-extrabold'
                }`}
                style={{
                  textShadow: '0 1px 2px rgba(0,0,0,0.5)',
                }}
              >
                Ahmadreza Sahihi
              </span>
              <span className="text-[11px] sm:text-xs text-slate-400 font-medium">
                سامانه تخصصی سودوکو
              </span>
            </div>
          </motion.div>
        </div>

        {/* Navigation Items (Single line, RTL flow) */}
        <nav className="hidden md:flex items-center gap-1.5 lg:gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  sounds.playPlaceNumber(4);
                }}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs lg:text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30 shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60 border border-transparent'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Header Actions (Sound, Settings, Mobile Nav Shortcut) */}
        <div className="flex items-center gap-2">
          {/* Sound Toggle */}
          <button
            onClick={() => {
              onToggleSound();
              sounds.playPlaceNumber(3);
            }}
            title={soundEnabled ? 'قطع صدا' : 'وصل صدا'}
            className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/70 border border-slate-800 transition-colors"
            aria-label="تنظیمات صدا"
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-amber-400" />
            ) : (
              <VolumeX className="w-4 h-4 text-slate-500" />
            )}
          </button>

          {/* Settings Modal Button */}
          <button
            onClick={() => {
              onOpenSettings();
              sounds.playPlaceNumber(5);
            }}
            title="راهنما و تنظیمات"
            className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/70 border border-slate-800 transition-colors"
            aria-label="تنظیمات"
          >
            <Settings className="w-4 h-4" />
          </button>

          {/* Quick Play CTA */}
          {currentView !== 'game' && (
            <button
              onClick={() => {
                onNavigate('game');
                sounds.playPlaceNumber(6);
              }}
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs lg:text-sm rounded-lg shadow-sm shadow-amber-500/20 transition-all hover:shadow-amber-500/30"
            >
              <Grid3X3 className="w-4 h-4" />
              <span>حل جدول</span>
            </button>
          )}
        </div>
      </div>

      {/* Mobile Navigation Bar (Bottom or Sub-header) */}
      <div className="md:hidden flex items-center justify-around border-t border-slate-800/70 bg-slate-950/90 backdrop-blur-md px-2 py-1.5 mt-2 overflow-x-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                onNavigate(item.id);
                sounds.playPlaceNumber(4);
              }}
              className={`flex flex-col items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium whitespace-nowrap transition-colors ${
                isActive ? 'text-amber-400 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
};

import React, { useState, useEffect } from 'react';
import {
  HashRouter,
  Routes,
  Route,
  useNavigate,
  useLocation,
  Navigate,
} from 'react-router-dom';
import { DifficultyLevel, UserStats } from './types/sudoku';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { LevelSelector } from './components/LevelSelector';
import { LessonsView } from './components/LessonsView';
import { GameView } from './components/GameView';
import { ExamView } from './components/ExamView';
import { DashboardView } from './components/DashboardView';
import { SettingsModal } from './components/SettingsModal';
import { sounds } from './utils/audio';

const STORAGE_KEY = 'ahmadreza_sahihi_sudoku_stats_v1';

const defaultStats: UserStats = {
  gamesPlayed: 0,
  gamesWon: 0,
  bestTimeSeconds: {
    beginner: null,
    intermediate: null,
    advanced: null,
  },
  totalPlayTimeSeconds: 0,
  completedLessons: [],
  examHistory: [],
  digitStyle: 'persian',
  soundEnabled: true,
};

function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();

  const [activeLevel, setActiveLevel] = useState<DifficultyLevel>('beginner');
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isScrolled, setIsScrolled] = useState<boolean>(false);

  // Load user stats from localStorage
  const [userStats, setUserStats] = useState<UserStats>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) return JSON.parse(saved);
      } catch {
        // ignore
      }
    }
    return defaultStats;
  });

  // Sync sound manager enabled state
  useEffect(() => {
    sounds.enabled = userStats.soundEnabled;
  }, [userStats.soundEnabled]);

  // Save user stats
  const handleUpdateStats = (updateFn: (prev: UserStats) => UserStats) => {
    setUserStats((prev) => {
      const next = updateFn(prev);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

  // Map route pathname to currentView for Header highlighting
  const getCurrentView = () => {
    const path = location.pathname.replace(/^\//, '');
    if (!path || path === 'home') return 'home';
    if (path === 'levels') return 'levels';
    if (path === 'lesson' || path === 'lessons') return 'lesson';
    if (path === 'game') return 'game';
    if (path === 'exam') return 'exam';
    if (path === 'dashboard') return 'dashboard';
    return 'home';
  };
  const currentView = getCurrentView();

  // Scroll listener for hero-to-header transition
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 80) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavigate = (view: string) => {
    const targetPath = view === 'home' ? '/' : `/${view}`;
    navigate(targetPath);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToLevelSelection = () => {
    const el = document.getElementById('level-selection-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      handleNavigate('levels');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500/30 selection:text-amber-200">
      {/* 
        Persistent Animated Header:
        Contains "Ahmadreza Sahihi" in exact English spelling.
        Remains permanently visible across all views, levels, exams, and scroll positions!
      */}
      <Header
        currentView={currentView}
        onNavigate={handleNavigate}
        onOpenSettings={() => setIsSettingsOpen(true)}
        isScrolled={isScrolled}
        soundEnabled={userStats.soundEnabled}
        onToggleSound={() => {
          handleUpdateStats((prev) => ({
            ...prev,
            soundEnabled: !prev.soundEnabled,
          }));
        }}
      />

      {/* Main Content Area - padded to avoid header overlap */}
      <main className="flex-1 pt-16 sm:pt-20">
        <Routes>
          {/* HOME ROUTE */}
          <Route
            path="/"
            element={
              <div className="space-y-4">
                <Hero
                  onStartLearning={() => {
                    setActiveLevel('beginner');
                    handleNavigate('lesson');
                  }}
                  onPlaySudoku={() => {
                    setActiveLevel('beginner');
                    handleNavigate('game');
                  }}
                  onTakeExam={() => {
                    setActiveLevel('beginner');
                    handleNavigate('exam');
                  }}
                  onScrollToLevels={scrollToLevelSelection}
                />

                <LevelSelector
                  onSelectLevel={(lvl) => {
                    setActiveLevel(lvl);
                    handleNavigate('game');
                  }}
                  onOpenLessons={(lvl) => {
                    setActiveLevel(lvl);
                    handleNavigate('lesson');
                  }}
                  onStartGame={(lvl) => {
                    setActiveLevel(lvl);
                    handleNavigate('game');
                  }}
                  onStartExam={(lvl) => {
                    setActiveLevel(lvl);
                    handleNavigate('exam');
                  }}
                />
              </div>
            }
          />

          {/* LEVELS ROUTE */}
          <Route
            path="/levels"
            element={
              <div className="py-8">
                <LevelSelector
                  onSelectLevel={(lvl) => {
                    setActiveLevel(lvl);
                    handleNavigate('game');
                  }}
                  onOpenLessons={(lvl) => {
                    setActiveLevel(lvl);
                    handleNavigate('lesson');
                  }}
                  onStartGame={(lvl) => {
                    setActiveLevel(lvl);
                    handleNavigate('game');
                  }}
                  onStartExam={(lvl) => {
                    setActiveLevel(lvl);
                    handleNavigate('exam');
                  }}
                />
              </div>
            }
          />

          {/* INTERACTIVE LESSONS ROUTE */}
          <Route
            path="/lesson"
            element={
              <LessonsView
                initialLevel={activeLevel}
                digitStyle={userStats.digitStyle}
                onPracticeLesson={(lvl) => {
                  setActiveLevel(lvl);
                  handleNavigate('game');
                }}
                onBackToHome={() => handleNavigate('home')}
                userStats={userStats}
                onUpdateStats={handleUpdateStats}
              />
            }
          />
          <Route path="/lessons" element={<Navigate to="/lesson" replace />} />

          {/* SUDOKU GAMEPLAY ROUTE */}
          <Route
            path="/game"
            element={
              <GameView
                initialLevel={activeLevel}
                digitStyle={userStats.digitStyle}
                onBackToHome={() => handleNavigate('home')}
                onUpdateStats={handleUpdateStats}
              />
            }
          />

          {/* EXAMINATION ROUTE */}
          <Route
            path="/exam"
            element={
              <ExamView
                level={activeLevel}
                onBackToHome={() => handleNavigate('home')}
                onUpdateStats={handleUpdateStats}
              />
            }
          />

          {/* DASHBOARD ROUTE */}
          <Route
            path="/dashboard"
            element={
              <DashboardView
                userStats={userStats}
                onBackToHome={() => handleNavigate('home')}
                onPlayGame={() => {
                  setActiveLevel('beginner');
                  handleNavigate('game');
                }}
                onTakeExam={() => {
                  setActiveLevel('beginner');
                  handleNavigate('exam');
                }}
              />
            }
          />

          {/* CATCH-ALL ROUTE (Prevents any blank screen for unknown URLs) */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* Settings & Guide Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        userStats={userStats}
        onUpdateStats={handleUpdateStats}
      />

      {/* Persistent Footer in Persian */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-8 px-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span dir="ltr" className="font-sans font-bold text-slate-300">
              Ahmadreza Sahihi
            </span>
            <span className="text-slate-600">·</span>
            <span>آکادمی تخصصی آموزش و مهارت‌های سودوکو</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <span>تمامی حقوق آموزشی و نرم‌افزاری محفوظ است</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <HashRouter>
      <AppContent />
    </HashRouter>
  );
}

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { RotateCcw, AlertTriangle } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in Sudoku Master app:', error, errorInfo);
  }

  private handleReset = () => {
    try {
      localStorage.clear();
      sessionStorage.clear();
    } catch {
      // ignore
    }
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div
          dir="rtl"
          className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 font-sans text-right"
        >
          <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 text-center space-y-5 shadow-2xl">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 mx-auto flex items-center justify-center text-amber-400">
              <AlertTriangle className="w-7 h-7" />
            </div>

            <div>
              <span
                dir="ltr"
                className="font-sans font-bold text-lg text-amber-300 block mb-1"
              >
                Ahmadreza Sahihi - Sudoku Master
              </span>
              <h2 className="text-xl font-bold text-white mb-2">
                یک خطای موقت در بارگذاری رخ داده است
              </h2>
              <p className="text-xs text-slate-400 leading-relaxed">
                برای بازگشت به محیط بازی و آموزش، لطفاً برنامه را مجدداً بارگذاری کنید. در صورت تکرار، با بازنشانی حافظه موقت مشکل برطرف خواهد شد.
              </p>
            </div>

            {this.state.error && (
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-[11px] text-red-400 font-mono text-left overflow-x-auto max-h-24">
                {this.state.error.message}
              </div>
            )}

            <div className="flex flex-col gap-2 pt-2">
              <button
                onClick={() => window.location.reload()}
                className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>بارگذاری مجدد برنامه</span>
              </button>

              <button
                onClick={this.handleReset}
                className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-xs rounded-xl transition-colors"
              >
                <span>بازنشانی حافظه موقت و شروع مجدد</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

import React from 'react';
import { Heart, RefreshCw } from 'lucide-react';

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/home';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          className="min-h-screen flex items-center justify-center p-6"
          style={{ background: '#fdfbf8' }}
        >
          <div className="max-w-md text-center">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg"
              style={{ background: 'linear-gradient(135deg, #d4a574, #e8573a)' }}
            >
              <Heart className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-xl font-medium text-[#2d2520] mb-2">
              Oops! Something went wrong
            </h2>
            <p className="text-sm text-[#8a7968] mb-6 leading-relaxed">
              We hit a small hiccup. Don't worry — your data is safe. Try refreshing the page.
            </p>
            {this.state.error && (
              <p className="text-[10px] font-mono text-red-400 bg-red-50 border border-red-100 rounded-xl p-3 mb-6 max-h-20 overflow-auto">
                {this.state.error.message}
              </p>
            )}
            <button
              onClick={this.handleReset}
              className="px-6 py-3 rounded-2xl text-white font-medium text-sm flex items-center justify-center gap-2 mx-auto transition-all hover:opacity-90 shadow-lg shadow-[#d4a574]/15"
              style={{ background: 'linear-gradient(135deg, #d4a574 0%, #e8573a 100%)' }}
            >
              <RefreshCw className="w-4 h-4" />
              Go Back Home
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

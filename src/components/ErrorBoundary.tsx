import { AlertCircle, RotateCcw } from 'lucide-react';
import React, { ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error) {
    console.error('Error caught by boundary:', error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div className="card max-w-md text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-800 mb-2">حدث خطأ</h1>
            <p className="text-gray-600 mb-4">عذراً، حدث خطأ غير متوقع في التطبيق</p>
            <details className="text-left mb-6 bg-gray-50 p-3 rounded-lg">
              <summary className="cursor-pointer text-sm font-medium text-gray-700 hover:text-gray-900">
                تفاصيل الخطأ
              </summary>
              <pre className="text-xs text-red-700 mt-2 overflow-auto max-h-40">{this.state.error?.message}</pre>
            </details>
            <button
              onClick={() => window.location.reload()}
              className="btn-primary flex items-center gap-2 justify-center w-full"
            >
              <RotateCcw className="w-4 h-4" />
              إعادة تحميل
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle } from 'lucide-react';

class ErrorBoundary extends Component<{ children: ReactNode; fallback?: ReactNode }, { hasError: boolean }> {
  constructor(props: { children: ReactNode; fallback?: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: Error) {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="w-full h-full flex flex-col items-center justify-center bg-background/5 border border-dashed border-foreground/10 p-8 text-center">
          <AlertCircle className="w-8 h-8 mb-4 opacity-20" />
          <p className="font-mono text-[10px] uppercase tracking-widest opacity-40">Visualizer Offline</p>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

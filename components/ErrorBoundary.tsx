'use client';

import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  message: string;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, message: '' };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, message: error.message };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[ErrorBoundary]', error, info.componentStack);
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, message: '' });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div
          role="alert"
          className="border-color-border bg-color-surface flex min-h-[200px] flex-col items-center justify-center gap-4 rounded-[var(--radius-xl)] border p-8 text-center"
        >
          <p className="text-color-text-secondary text-sm font-medium">
            Something went wrong rendering this section.
          </p>
          <button
            type="button"
            onClick={this.handleReset}
            className="border-color-border text-color-text-muted inline-flex min-h-[48px] items-center rounded-full border px-5 py-2.5 font-mono text-xs tracking-widest uppercase transition"
            aria-label="Try again — reload this section"
          >
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

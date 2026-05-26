'use client';

// Client component required because React error boundaries only work on the client.
import { Component, type ErrorInfo, type ReactNode } from 'react';

type CinematicErrorBoundaryProps = {
  children: ReactNode;
  fallback: ReactNode;
};

type CinematicErrorBoundaryState = {
  failed: boolean;
};

export class CinematicErrorBoundary extends Component<
  CinematicErrorBoundaryProps,
  CinematicErrorBoundaryState
> {
  public state: CinematicErrorBoundaryState = { failed: false };

  public static getDerivedStateFromError(): CinematicErrorBoundaryState {
    return { failed: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    if (process.env.NODE_ENV !== 'production') {
      console.error(
        '[cinematic] provider crashed. Degrading to static scroll mode.',
        error,
        errorInfo
      );
    }
  }

  public render(): ReactNode {
    if (this.state.failed) {
      return this.props.fallback;
    }

    return this.props.children;
  }
}

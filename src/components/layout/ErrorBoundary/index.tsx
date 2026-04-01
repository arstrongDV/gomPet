import React from 'react';

import ErrorBoundaryFallback from './fallback';

type ErrorBoundaryProps = {
  children: React.ReactNode;
  fallback?: React.ReactNode;
};

type State = {
  hasError: boolean;
};

class ErrorBoundary extends React.Component<ErrorBoundaryProps, State> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  //error: any
  static getDerivedStateFromError() {
    return { hasError: true };
  }

  //error: any, info: any
  componentDidCatch() {
    // You can log the error to an error reporting service here
  }

  defaultFallback = (<ErrorBoundaryFallback />);

  render() {
    if (this.state.hasError) {
      return this.props.fallback || this.defaultFallback;
    }
    return this.props.children;
  }
}

export default ErrorBoundary;

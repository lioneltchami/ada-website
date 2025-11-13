import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

/**
 * ErrorBoundary component catches JavaScript errors anywhere in the child component tree,
 * logs those errors, and displays a fallback UI instead of the component tree that crashed.
 */
export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log error details for debugging
    console.error('ErrorBoundary caught an error:', error);
    console.error('Error info:', errorInfo);

    // You can also log the error to an error reporting service here
    // Example: logErrorToService(error, errorInfo);

    this.setState({
      error,
      errorInfo,
    });
  }

  handleReset = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  handleReload = (): void => {
    window.location.reload();
  };

  render(): ReactNode {
    if (this.state.hasError) {
      // Custom fallback UI provided by parent
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default fallback UI
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
          <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8 md:p-12">
            <div className="text-center">
              {/* Error Icon */}
              <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-6">
                <AlertTriangle className="w-10 h-10 text-red-600" />
              </div>

              {/* Error Title */}
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Oops! Something went wrong
              </h1>

              {/* Error Description */}
              <p className="text-lg text-gray-600 mb-8">
                We're sorry for the inconvenience. An unexpected error has occurred.
                Our team has been notified and we're working to fix it.
              </p>

              {/* Error Details (Development only) */}
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg text-left">
                  <p className="font-semibold text-red-800 mb-2">Error Details:</p>
                  <pre className="text-sm text-red-700 overflow-x-auto whitespace-pre-wrap">
                    {this.state.error.toString()}
                  </pre>
                  {this.state.errorInfo && (
                    <>
                      <p className="font-semibold text-red-800 mt-4 mb-2">Component Stack:</p>
                      <pre className="text-xs text-red-600 overflow-x-auto whitespace-pre-wrap">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    </>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={this.handleReset}
                  className="inline-flex items-center justify-center px-6 py-3 bg-primary-600 text-white font-medium rounded-full hover:bg-primary-700 transition-colors duration-200 shadow-lg hover:shadow-xl"
                >
                  <RefreshCw className="w-5 h-5 mr-2" />
                  Try Again
                </button>

                <Link
                  to="/"
                  onClick={this.handleReset}
                  className="inline-flex items-center justify-center px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-full hover:bg-gray-200 transition-colors duration-200"
                >
                  <Home className="w-5 h-5 mr-2" />
                  Go to Homepage
                </Link>
              </div>

              {/* Additional Help */}
              <p className="mt-8 text-sm text-gray-500">
                If this problem persists, please{' '}
                <Link to="/contact" className="text-primary-600 hover:text-primary-700 underline">
                  contact our support team
                </Link>
                .
              </p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

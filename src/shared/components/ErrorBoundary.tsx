/**
 * Global Error Boundary
 *
 * Catches and handles React errors gracefully
 */

import React from 'react';
import { ErrorBoundary as ReactErrorBoundary } from 'react-error-boundary';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

function ErrorFallback({ error, resetErrorBoundary }: ErrorFallbackProps) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <div className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-6 w-6" />
            <CardTitle>Something went wrong</CardTitle>
          </div>
          <CardDescription>
            An unexpected error occurred. Our team has been notified.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="rounded-lg bg-muted p-4">
            <p className="text-sm font-mono text-muted-foreground">
              {error.message}
            </p>
          </div>

          {process.env.NODE_ENV === 'development' && error.stack && (
            <details className="mt-4">
              <summary className="cursor-pointer text-sm font-medium">
                Stack Trace
              </summary>
              <pre className="mt-2 text-xs overflow-auto p-4 bg-muted rounded-lg">
                {error.stack}
              </pre>
            </details>
          )}
        </CardContent>

        <CardFooter className="flex gap-2">
          <Button onClick={resetErrorBoundary} className="flex-1">
            <RefreshCw className="mr-2 h-4 w-4" />
            Try Again
          </Button>
          <Button
            variant="outline"
            onClick={() => (window.location.href = '/')}
            className="flex-1"
          >
            <Home className="mr-2 h-4 w-4" />
            Go Home
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

export function ErrorBoundary({ children, onError }: ErrorBoundaryProps) {
  const handleError = (error: Error, errorInfo: React.ErrorInfo) => {
    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error Boundary caught an error:', error, errorInfo);
    }

    // Call custom error handler if provided
    if (onError) {
      onError(error, errorInfo);
    }

    // In production, you would send this to an error tracking service
    // Example: Sentry.captureException(error, { contexts: { react: errorInfo } });
  };

  return (
    <ReactErrorBoundary
      FallbackComponent={ErrorFallback}
      onError={handleError}
      onReset={() => {
        // Reset app state if needed
        window.location.href = '/';
      }}
    >
      {children}
    </ReactErrorBoundary>
  );
}

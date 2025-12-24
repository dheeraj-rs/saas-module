/**
 * Error Logging Service
 * 
 * Centralized error logging and tracking
 * Ready for integration with services like Sentry
 */

interface ErrorContext {
  user?: {
    id: string;
    email: string;
  };
  tenant?: {
    id: string;
    name: string;
  };
  route?: string;
  [key: string]: unknown;
}

class ErrorLogger {
  private isProduction = process.env.NODE_ENV === 'production';

  /**
   * Log an error
   */
  logError(error: Error, context?: ErrorContext): void {
    const errorData = {
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
      context,
    };

    // Console log in development
    if (!this.isProduction) {
      console.error('[Error Logger]', errorData);
    }

    // In production, send to error tracking service
    // Example: Sentry.captureException(error, { contexts: context });
    
    // Store in localStorage for debugging (limit to last 50 errors)
    this.storeError(errorData);
  }

  /**
   * Log a warning
   */
  logWarning(message: string, context?: ErrorContext): void {
    const warningData = {
      message,
      timestamp: new Date().toISOString(),
      context,
    };

    if (!this.isProduction) {
      console.warn('[Warning]', warningData);
    }

    // In production, send to monitoring service
  }

  /**
   * Log an info message
   */
  logInfo(message: string, context?: ErrorContext): void {
    if (!this.isProduction) {
      console.info('[Info]', message, context);
    }
  }

  /**
   * Store error in localStorage for debugging
   */
  private storeError(errorData: unknown): void {
    try {
      const stored = localStorage.getItem('app_errors');
      const errors = stored ? JSON.parse(stored) : [];
      
      errors.push(errorData);
      
      // Keep only last 50 errors
      if (errors.length > 50) {
        errors.shift();
      }
      
      localStorage.setItem('app_errors', JSON.stringify(errors));
    } catch (e) {
      // Silently fail if localStorage is not available
    }
  }

  /**
   * Get stored errors (for debugging)
   */
  getStoredErrors(): unknown[] {
    try {
      const stored = localStorage.getItem('app_errors');
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  }

  /**
   * Clear stored errors
   */
  clearStoredErrors(): void {
    try {
      localStorage.removeItem('app_errors');
    } catch (e) {
      // Silently fail
    }
  }
}

export const errorLogger = new ErrorLogger();

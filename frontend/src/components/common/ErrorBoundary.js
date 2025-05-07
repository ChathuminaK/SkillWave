import React, { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    
    // Log the error to your error reporting service
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary p-4 my-3 bg-light rounded shadow-sm">
          <div className="text-center mb-4">
            <i className="bi bi-exclamation-triangle text-danger" style={{ fontSize: '3rem' }}></i>
            <h2 className="mt-3">Something went wrong</h2>
            <p className="text-muted">We're sorry, there was an error loading this component.</p>
          </div>
          
          {process.env.NODE_ENV === 'development' && this.state.error && (
            <div className="mt-3">
              <details className="mb-3">
                <summary className="btn btn-outline-secondary btn-sm">View error details</summary>
                <pre className="bg-dark text-light p-3 mt-2 rounded">
                  {this.state.error.toString()}
                  <br />
                  {this.state.errorInfo.componentStack}
                </pre>
              </details>
            </div>
          )}
          
          <div className="d-flex justify-content-center mt-3">
            <button 
              className="btn btn-primary me-2" 
              onClick={() => window.location.reload()}
            >
              Refresh Page
            </button>
            <button 
              className="btn btn-outline-secondary" 
              onClick={() => this.setState({ hasError: false, error: null, errorInfo: null })}
            >
              Try Again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
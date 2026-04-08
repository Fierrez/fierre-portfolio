import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null, info: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    // store stack for display and keep a console copy
    this.setState({ error, info });
    // still log to console for devs
    // eslint-disable-next-line no-console
    console.error("Uncaught error in React tree:", error, info);
  }

  render() {
    const { error, info } = this.state;
    if (error) {
      // Minimal, dependency-free fallback UI so it appears even if Tailwind isn't loaded
      return (
        <div style={{padding:20,background:'#111',color:'#fff',height:'100vh',overflow:'auto'}}>
          <h2 style={{marginTop:0}}>Application error</h2>
          <p style={{color:'#f88'}}>{String(error && (error.message || error))}</p>
          {info && info.componentStack && (
            <pre style={{whiteSpace:'pre-wrap',color:'#ccc',marginTop:12}}>{info.componentStack}</pre>
          )}
          <details style={{marginTop:12,color:'#bbb'}}>
            <summary style={{cursor:'pointer'}}>Raw error (console)</summary>
            <pre style={{whiteSpace:'pre-wrap',color:'#ddd'}}>{String(error && error.stack)}</pre>
          </details>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;

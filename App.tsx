import React, { Component, ErrorInfo, ReactNode } from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import TutorProfile from './pages/TutorProfile';
import StudentDashboard from './pages/StudentDashboard';
import TutorDashboard from './pages/TutorDashboard';
import Documentation from './pages/Documentation';
import Welcome from './pages/Welcome';
import Auth from './pages/Auth';
import Classroom from './pages/Classroom';
import AIAssistantWidget from './components/AIAssistantWidget';
import { AppProvider } from './context/AppContext';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('App caught an error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="page flex min-h-screen items-center justify-center px-5 py-12">
          <div className="w-full max-w-md border-y border-line py-10">
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-accent">
              Something broke
            </p>
            <h1 className="mt-3 text-2xl font-semibold tracking-[-0.02em]">
              This screen could not load.
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              {this.state.error?.message ||
                'An unexpected rendering error occurred. Reload the page to try again.'}
            </p>
            <div className="mt-6 flex gap-2">
              <button
                onClick={() => window.location.reload()}
                className="btn btn-primary"
              >
                Reload page
              </button>
              <button
                onClick={() => {
                  this.setState({ hasError: false, error: null });
                  window.location.hash = '#/';
                  window.location.reload();
                }}
                className="btn btn-outline"
              >
                Go home
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const AppContent: React.FC = () => {
  const location = useLocation();
  const showNavbar =
    location.pathname !== '/' &&
    location.pathname !== '/auth' &&
    !location.pathname.startsWith('/classroom');

  return (
    <>
      {showNavbar && <Navbar />}
      <main className="min-h-screen">
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/find-tutors" element={<Home />} />
          <Route path="/tutor/:id" element={<TutorProfile />} />
          <Route path="/student-dashboard" element={<StudentDashboard />} />
          <Route path="/tutor-dashboard" element={<TutorDashboard />} />
          <Route path="/classroom/:sessionId" element={<Classroom />} />
          <Route path="/documentation" element={<Documentation />} />
        </Routes>
      </main>
      <AIAssistantWidget />
    </>
  );
};

export function App() {
  return (
    <ErrorBoundary>
      <AppProvider>
        <Router>
          <div className="min-h-screen bg-paper font-sans text-ink antialiased">
            <AppContent />
          </div>
        </Router>
      </AppProvider>
    </ErrorBoundary>
  );
}

export default App;

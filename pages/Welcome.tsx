import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import DemoBadge from '../components/DemoBadge';

const Welcome: React.FC = () => {
  const [selectedRole, setSelectedRole] = useState<'student' | 'tutor'>('student');
  const navigate = useNavigate();
  const { setRole, login } = useApp();

  const handleAuthRedirect = (mode: 'login' | 'signup') => {
    navigate(`/auth?role=${selectedRole}&mode=${mode}`);
  };

  const handleInstantDemo = async () => {
    if (selectedRole === 'student') {
      await login('alex@student.edu', 'demo', 'student');
      navigate('/find-tutors');
    } else {
      await login('rajesh@tutorhub.com', 'demo', 'tutor');
      navigate('/tutor-dashboard');
    }
  };

  return (
    <div className="page flex min-h-screen flex-col">
      <header className="container-page flex h-14 items-center justify-between">
        <span className="text-[15px] font-semibold tracking-[-0.02em]">Tutor Hub</span>
        <Link to="/documentation" className="text-sm text-muted hover:text-ink">
          How it works
        </Link>
      </header>

      <main className="container-page flex flex-1 items-center py-12">
        <div className="w-full max-w-xl">
          <h1 className="text-[2.25rem] font-semibold leading-[1.1] tracking-[-0.03em] sm:text-[2.75rem]">
            A tutor who fits the way you learn.
          </h1>
          <p className="mt-5 max-w-md text-[15px] leading-relaxed text-muted">
            One-to-one lessons with educators across Nepal. Book a time, meet live, and
            work through problems on a shared whiteboard.
          </p>

          <div className="mt-10 border-y border-line">
            <div className="grid grid-cols-2">
              <button
                type="button"
                onClick={() => {
                  setSelectedRole('student');
                  setRole('student');
                }}
                aria-pressed={selectedRole === 'student'}
                className={`flex flex-col items-start gap-1 border-r border-line px-4 py-4 text-left transition-colors ${
                  selectedRole === 'student' ? 'bg-surface' : 'hover:bg-surface/60'
                }`}
              >
                <span className="flex items-center gap-2 text-sm font-medium text-ink">
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      selectedRole === 'student' ? 'bg-accent' : 'bg-line'
                    }`}
                    aria-hidden="true"
                  />
                  I'm a student
                </span>
                <span className="text-[12px] leading-relaxed text-muted">
                  Find a tutor and book a lesson.
                </span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setSelectedRole('tutor');
                  setRole('tutor');
                }}
                aria-pressed={selectedRole === 'tutor'}
                className={`flex flex-col items-start gap-1 px-4 py-4 text-left transition-colors ${
                  selectedRole === 'tutor' ? 'bg-surface' : 'hover:bg-surface/60'
                }`}
              >
                <span className="flex items-center gap-2 text-sm font-medium text-ink">
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      selectedRole === 'tutor' ? 'bg-accent' : 'bg-line'
                    }`}
                    aria-hidden="true"
                  />
                  I'm an educator
                </span>
                <span className="text-[12px] leading-relaxed text-muted">
                  Set your rate and manage lessons.
                </span>
              </button>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-2 sm:flex-row">
            <button
              onClick={() => handleAuthRedirect('login')}
              className="btn btn-primary flex-1"
            >
              Sign in as {selectedRole === 'student' ? 'student' : 'educator'}
              <ArrowRight className="h-4 w-4" />
            </button>
            <button
              onClick={() => handleAuthRedirect('signup')}
              className="btn btn-outline flex-1"
            >
              Create an account
            </button>
          </div>

          <div className="mt-6 flex flex-col gap-2 text-[13px] text-muted sm:flex-row sm:items-center sm:justify-between">
            <button onClick={handleInstantDemo} className="text-left hover:text-ink">
              Try the demo as {selectedRole === 'student' ? 'Alex' : 'Rajesh'}
            </button>
            <Link to="/find-tutors" className="hover:text-ink">
              Browse tutors without an account
            </Link>
          </div>
        </div>
      </main>

      <footer className="container-page flex flex-wrap items-center gap-3 border-t border-line py-5 text-[11px] text-muted">
        <DemoBadge label="Demo build" />
        <span>Sample profiles and sessions. No payments or verification yet.</span>
      </footer>
    </div>
  );
};

export default Welcome;

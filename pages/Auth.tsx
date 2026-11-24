import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Eye, EyeOff, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';

const Auth: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialMode = searchParams.get('mode') === 'signup' ? 'signup' : 'login';
  const initialRole = searchParams.get('role') === 'tutor' ? 'tutor' : 'student';

  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [role, setRole] = useState<'student' | 'tutor'>(initialRole);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [gradeLevel, setGradeLevel] = useState('High School (Grade 11-12)');
  const [hourlyRate, setHourlyRate] = useState(1500);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>(['Mathematics', 'Physics']);
  const [bio, setBio] = useState('');

  const navigate = useNavigate();
  const { login, register } = useApp();

  const handleSubjectToggle = (subj: string) => {
    setSelectedSubjects((prev) =>
      prev.includes(subj) ? prev.filter((s) => s !== subj) : [...prev, subj]
    );
  };

  const fillDemoAccount = (demoRole: 'student' | 'tutor') => {
    setRole(demoRole);
    setMode('login');
    if (demoRole === 'student') {
      setEmail('alex@student.edu');
      setPassword('studentPass123!');
    } else {
      setEmail('rajesh@tutorhub.com');
      setPassword('tutorSecret999!');
    }
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      if (mode === 'login') {
        if (!email.trim() || !password.trim()) {
          throw new Error('Enter both an email and a password.');
        }
        await login(email.trim(), password, role);
      } else {
        if (!name.trim()) {
          throw new Error('Enter your full name.');
        }
        if (!email.trim() || !email.includes('@')) {
          throw new Error('Enter a valid email address.');
        }
        if (password.length < 6) {
          throw new Error('Passwords need at least 6 characters.');
        }

        await register({
          name: name.trim(),
          email: email.trim(),
          password,
          role,
          gradeLevel: role === 'student' ? gradeLevel : undefined,
          hourlyRate: role === 'tutor' ? Number(hourlyRate) : undefined,
          subjects: role === 'tutor' ? selectedSubjects : undefined,
          bio: role === 'tutor' ? bio.trim() || 'Educator on Tutor Hub.' : undefined,
        });
      }

      navigate(role === 'student' ? '/find-tutors' : '/tutor-dashboard');
    } catch (err: any) {
      setError(err.message || 'Sign in failed. Check your details and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const roleOption = (value: 'student' | 'tutor', label: string, description: string) => {
    const selected = role === value;
    return (
      <button
        key={value}
        type="button"
        onClick={() => setRole(value)}
        aria-pressed={selected}
        className={`flex flex-col items-start gap-0.5 border px-3 py-2.5 text-left transition-colors ${
          selected
            ? 'border-ink bg-surface'
            : 'border-line text-muted hover:border-ink/40'
        }`}
      >
        <span className="flex items-center gap-2 text-[13px] font-medium text-ink">
          <span
            className={`h-1.5 w-1.5 rounded-full ${selected ? 'bg-accent' : 'bg-line'}`}
            aria-hidden="true"
          />
          {label}
        </span>
        <span className="text-[11px] text-muted">{description}</span>
      </button>
    );
  };

  return (
    <div className="page flex min-h-screen flex-col">
      <header className="container-page flex h-14 items-center justify-between">
        <Link to="/" className="text-[15px] font-semibold tracking-[-0.02em]">
          Tutor Hub
        </Link>
        <Link to="/find-tutors" className="text-[13px] text-muted hover:text-ink">
          Browse as guest
        </Link>
      </header>

      <main className="container-page flex flex-1 items-center py-10 sm:py-16">
        <div className="grid w-full gap-16 lg:grid-cols-[1fr_400px] lg:items-center">
          <div className="hidden lg:block">
            <h1 className="max-w-md text-[2.25rem] font-semibold leading-[1.1] tracking-[-0.03em] sm:text-[2.75rem]">
              Keep the lessons you started.
            </h1>
            <p className="mt-4 max-w-sm text-[15px] leading-relaxed text-muted">
              Your bookings, saved tutors, and messages live in one place. This build is a
              demo, and everything stays in your browser.
            </p>
          </div>

          <div className="w-full max-w-md justify-self-start lg:justify-self-end">
            <div className="flex gap-7 border-b border-line">
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setError(null);
                }}
                className={`tab ${mode === 'login' ? 'tab-active' : ''}`}
              >
                Sign in
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode('signup');
                  setError(null);
                }}
                className={`tab ${mode === 'signup' ? 'tab-active' : ''}`}
              >
                Create account
              </button>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-2">
              {roleOption('student', "I'm a student", 'Find and book lessons')}
              {roleOption('tutor', "I'm an educator", 'Teach and manage lessons')}
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-[12px] text-muted">
              <span>Demo accounts:</span>
              <button onClick={() => fillDemoAccount('student')} className="text-ink hover:underline">
                Alex (student)
              </button>
              <button onClick={() => fillDemoAccount('tutor')} className="text-ink hover:underline">
                Rajesh (educator)
              </button>
            </div>

            {error && (
              <p role="alert" className="mt-5 text-[13px] text-accent">
                {error}
              </p>
            )}

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              {mode === 'signup' && (
                <div>
                  <label className="label" htmlFor="name">
                    Full name
                  </label>
                  <input
                    id="name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={role === 'student' ? 'e.g. Alex Johnson' : 'e.g. Rajesh Sharma'}
                    className="input"
                  />
                </div>
              )}

              <div>
                <label className="label" htmlFor="email">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="input"
                />
              </div>

              <div>
                <label className="label" htmlFor="password">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    className="input pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-ink"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {mode === 'signup' && role === 'student' && (
                <div>
                  <label className="label" htmlFor="level">
                    Academic level
                  </label>
                  <select
                    id="level"
                    value={gradeLevel}
                    onChange={(e) => setGradeLevel(e.target.value)}
                    className="select"
                  >
                    <option>Middle School (Grade 6-8)</option>
                    <option>High School (Grade 9-10)</option>
                    <option>High School (+2 / Grade 11-12)</option>
                    <option>University / Undergraduate</option>
                    <option>Professional / Adult Learner</option>
                  </select>
                </div>
              )}

              {mode === 'signup' && role === 'tutor' && (
                <div className="space-y-4 border-t border-line pt-4">
                  <div>
                    <span className="label">Subjects you teach</span>
                    <div className="flex flex-wrap gap-1.5">
                      {[
                        'Mathematics',
                        'Physics',
                        'Science',
                        'Computer Science',
                        'English',
                        'Chemistry',
                      ].map((subj) => {
                        const active = selectedSubjects.includes(subj);
                        return (
                          <button
                            key={subj}
                            type="button"
                            onClick={() => handleSubjectToggle(subj)}
                            aria-pressed={active}
                            className={`border px-2 py-1 text-[12px] transition-colors ${
                              active
                                ? 'border-ink bg-ink text-paper'
                                : 'border-line text-muted hover:text-ink'
                            }`}
                          >
                            {subj}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <label className="label" htmlFor="rate">
                      Hourly rate (NPR)
                    </label>
                    <input
                      id="rate"
                      type="number"
                      min={500}
                      step={100}
                      value={hourlyRate}
                      onChange={(e) => setHourlyRate(Number(e.target.value))}
                      className="input tabular-nums"
                    />
                  </div>

                  <div>
                    <label className="label" htmlFor="bio">
                      Short bio
                    </label>
                    <textarea
                      id="bio"
                      rows={3}
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      placeholder="Your experience and how you teach"
                      className="textarea resize-none"
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="btn btn-primary mt-2 w-full"
              >
                {isLoading ? (
                  <span
                    className="h-4 w-4 animate-spin rounded-full border border-paper/40 border-t-paper"
                    aria-label="Loading"
                  />
                ) : (
                  <>
                    {mode === 'login'
                      ? `Sign in as ${role === 'student' ? 'student' : 'educator'}`
                      : 'Create account'}
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>

            <p className="mt-5 border-t border-line pt-4 text-[11px] leading-relaxed text-muted">
              Demo accounts only. No real authentication, payments, or verification.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Auth;

import React, { useState } from 'react';
import { Calendar, Clock, Video, Heart, ArrowRight, Send } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import DemoBadge from '../components/DemoBadge';

const StudentDashboard: React.FC = () => {
  const { sessions, cancelSession, savedTutorIds, tutors, currentUser } = useApp();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'bookings' | 'saved' | 'messages'>('bookings');

  const studentName = currentUser?.name || 'Alex Johnson';

  const upcomingSessions = sessions.filter((s) => s.status === 'Upcoming');
  const pastSessions = sessions.filter((s) => s.status !== 'Upcoming');
  const savedTutorsList = tutors.filter((t) => savedTutorIds.includes(t.id));

  const totalSpent = sessions
    .filter((s) => s.status !== 'Cancelled')
    .reduce((acc, curr) => acc + curr.price, 0);

  const tabs = [
    { id: 'bookings' as const, label: `Sessions (${sessions.length})` },
    { id: 'saved' as const, label: `Saved (${savedTutorsList.length})` },
    { id: 'messages' as const, label: 'Messages (2)' },
  ];

  return (
    <div className="page pb-20">
      <div className="container-page pt-10 sm:pt-12">
        <header className="flex flex-col justify-between gap-6 border-b border-line pb-8 sm:flex-row sm:items-end">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-[2rem] font-semibold leading-none tracking-[-0.03em]">
                {studentName}
              </h1>
              <DemoBadge label="Demo dashboard" />
            </div>
            <p className="mt-2 text-[13px] text-muted">
              {currentUser?.gradeLevel || 'Grade 12 · Computer Science & Mathematics'}
            </p>
          </div>

          <Link to="/find-tutors" className="btn btn-outline btn-sm">
            Find a tutor
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </header>

        <div className="grid grid-cols-2 border-b border-line sm:grid-cols-4">
          {[
            { label: 'Sessions', value: sessions.length },
            { label: 'Upcoming', value: upcomingSessions.length },
            { label: 'Saved tutors', value: savedTutorsList.length },
            { label: 'Total spent', value: `NPR ${totalSpent.toLocaleString()}` },
          ].map((stat, i) => (
            <div
              key={stat.label}
              className={`py-5 ${i > 0 ? 'sm:border-l sm:border-line sm:pl-6' : ''} ${
                i === 1 ? 'border-l border-line pl-6' : ''
              } ${i === 3 ? 'border-l border-line pl-6' : ''} ${
                i === 2 ? 'border-t border-line sm:border-t-0' : ''
              }`}
            >
              <div className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted">
                {stat.label}
              </div>
              <div className="mt-1.5 text-xl font-semibold tabular-nums tracking-[-0.01em]">
                {stat.value}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 flex gap-7 border-b border-line">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`tab ${activeTab === tab.id ? 'tab-active' : ''}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="mt-8">
          {activeTab === 'bookings' && (
            <div className="space-y-12">
              <section>
                <h2 className="text-lg font-semibold tracking-[-0.01em]">Upcoming</h2>

                {upcomingSessions.length > 0 ? (
                  <div className="mt-3 border-y border-line">
                    {upcomingSessions.map((session) => (
                      <article
                        key={session.id}
                        className="flex flex-col gap-4 border-t border-line py-5 first:border-t-0 md:flex-row md:items-center md:justify-between"
                      >
                        <div className="min-w-0">
                          <h3 className="text-base font-semibold text-ink">
                            {session.tutorName}
                          </h3>
                          <p className="mt-0.5 text-[13px] text-muted">{session.subject}</p>
                          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[12px] text-muted">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3.5 w-3.5" />
                              {session.date}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3.5 w-3.5" />
                              {session.time} · {session.duration}
                            </span>
                            <span className="tabular-nums">NPR {session.price.toLocaleString()}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => cancelSession(session.id)}
                            className="btn btn-danger btn-sm"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => navigate(`/classroom/${session.id}`)}
                            className="btn btn-primary btn-sm"
                          >
                            <Video className="h-3.5 w-3.5" />
                            Join classroom
                          </button>
                        </div>
                      </article>
                    ))}
                  </div>
                ) : (
                  <div className="mt-3 border-y border-line py-12 text-center">
                    <p className="text-sm text-ink">No upcoming sessions.</p>
                    <p className="mt-1 text-[13px] text-muted">
                      Book a lesson to see it here.
                    </p>
                    <Link to="/find-tutors" className="btn btn-outline btn-sm mt-4">
                      Browse tutors
                    </Link>
                  </div>
                )}
              </section>

              <section>
                <h2 className="text-lg font-semibold tracking-[-0.01em]">Completed and past</h2>

                {pastSessions.length > 0 ? (
                  <div className="mt-3 border-y border-line">
                    {pastSessions.map((session) => (
                      <article
                        key={session.id}
                        className="flex flex-col gap-2 border-t border-line py-4 first:border-t-0 sm:flex-row sm:items-center sm:justify-between"
                      >
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="text-sm font-medium text-ink">{session.tutorName}</h3>
                            <span className="text-[11px] text-muted">{session.subject}</span>
                          </div>
                          <div className="mt-1 text-[12px] tabular-nums text-muted">
                            {session.date} · {session.time} · NPR {session.price.toLocaleString()}
                          </div>
                        </div>

                        <div className="flex items-center justify-between gap-4 sm:justify-end">
                          <span
                            className={`text-[12px] ${
                              session.status === 'Completed' ? 'text-ok' : 'text-accent'
                            }`}
                          >
                            {session.status}
                          </span>
                          <button
                            onClick={() => navigate('/find-tutors')}
                            className="text-[12px] text-muted hover:text-ink"
                          >
                            Book again
                          </button>
                        </div>
                      </article>
                    ))}
                  </div>
                ) : (
                  <p className="mt-3 border-y border-line py-8 text-center text-[13px] text-muted">
                    No past sessions yet.
                  </p>
                )}
              </section>
            </div>
          )}

          {activeTab === 'saved' && (
            <section>
              <h2 className="text-lg font-semibold tracking-[-0.01em]">Saved tutors</h2>

              {savedTutorsList.length > 0 ? (
                <div className="mt-3 border-y border-line">
                  {savedTutorsList.map((tutor) => (
                    <article
                      key={tutor.id}
                      className="flex flex-col gap-4 border-t border-line py-4 first:border-t-0 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={tutor.avatar}
                          alt=""
                          className="h-10 w-10 rounded-[2px] object-cover"
                        />
                        <div>
                          <h3 className="text-sm font-medium text-ink">{tutor.name}</h3>
                          <p className="text-[12px] text-muted">
                            {tutor.subjects.join(' · ')} · {tutor.experience}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <span className="text-[12px] tabular-nums text-muted">
                          NPR {tutor.price.toLocaleString()}/hr
                        </span>
                        <button
                          onClick={() => navigate(`/tutor/${tutor.id}`)}
                          className="btn btn-outline btn-sm"
                        >
                          View profile
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="mt-3 border-y border-line py-12 text-center">
                  <Heart className="mx-auto h-5 w-5 text-muted" />
                  <p className="mt-3 text-sm text-ink">No saved tutors yet.</p>
                  <p className="mt-1 text-[13px] text-muted">
                    Use the heart icon on any tutor row to keep it here.
                  </p>
                  <Link to="/find-tutors" className="btn btn-outline btn-sm mt-4">
                    Browse tutors
                  </Link>
                </div>
              )}
            </section>
          )}

          {activeTab === 'messages' && (
            <section className="grid overflow-hidden border border-line md:grid-cols-[240px_minmax(0,1fr)]">
              <div className="border-b border-line bg-surface md:border-b-0 md:border-r">
                <div className="border-b border-line px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">
                  Conversations
                </div>
                <button className="w-full border-b border-line bg-ink/[0.03] px-4 py-3 text-left">
                  <div className="flex items-center justify-between">
                    <span className="text-[13px] font-medium text-ink">Rajesh Sharma</span>
                    <span className="text-[10px] text-muted">10:45</span>
                  </div>
                  <p className="mt-1 truncate text-[12px] text-muted">
                    I've uploaded the calculus problem set.
                  </p>
                </button>
                <button className="w-full px-4 py-3 text-left hover:bg-ink/[0.02]">
                  <div className="flex items-center justify-between">
                    <span className="text-[13px] font-medium text-ink">Anita Shrestha</span>
                    <span className="text-[10px] text-muted">Yesterday</span>
                  </div>
                  <p className="mt-1 truncate text-[12px] text-muted">
                    Great work on the chemistry quiz.
                  </p>
                </button>
              </div>

              <div className="flex min-h-[380px] flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between border-b border-line px-4 py-3">
                    <div>
                      <h3 className="text-sm font-medium text-ink">Rajesh Sharma</h3>
                      <span className="flex items-center gap-1.5 text-[11px] text-muted">
                        <span className="h-1.5 w-1.5 rounded-full bg-ok" />
                        Available
                      </span>
                    </div>
                    <button
                      onClick={() => navigate('/classroom/s1')}
                      className="btn btn-outline btn-sm"
                    >
                      <Video className="h-3.5 w-3.5" />
                      Open classroom
                    </button>
                  </div>

                  <div className="space-y-4 px-4 py-5 text-[13px]">
                    <div className="max-w-[85%] border border-line bg-surface p-3 leading-relaxed text-ink">
                      Hi Alex. Don't forget our session tomorrow. Have you had a chance to
                      look at derivatives?
                    </div>
                    <div className="ml-auto max-w-[85%] bg-ink p-3 leading-relaxed text-paper">
                      Yes. I solved exercises 4 through 9, but got stuck on the chain rule.
                    </div>
                    <div className="max-w-[85%] border border-line bg-surface p-3 leading-relaxed text-ink">
                      I've uploaded the calculus problem set. We will work through it together.
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 border-t border-line p-4">
                  <label className="sr-only" htmlFor="dm">
                    Message Rajesh
                  </label>
                  <input
                    id="dm"
                    type="text"
                    placeholder="Write a message"
                    className="input"
                  />
                  <button className="btn btn-primary" aria-label="Send message">
                    <Send className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;

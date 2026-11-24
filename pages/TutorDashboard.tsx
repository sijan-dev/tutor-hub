import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Edit2, Video } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useApp } from '../context/AppContext';
import DemoBadge from '../components/DemoBadge';

const TutorDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { sessions, currentUser, darkMode } = useApp();
  const tutorName = currentUser?.name || 'Rajesh Sharma';
  const tutorAvatar = currentUser?.avatar || 'https://picsum.photos/seed/rajesh/200/200';

  const [pendingRequests, setPendingRequests] = useState([
    {
      id: 'req-1',
      student: 'Sita Karki',
      subject: 'Advanced Calculus',
      duration: '1 hour',
      fee: 1500,
      time: 'Tomorrow, 11:00 AM',
    },
    {
      id: 'req-2',
      student: 'Bikram Thapa',
      subject: 'Quantum Physics',
      duration: '2 hours',
      fee: 3000,
      time: 'Wednesday, 3:00 PM',
    },
  ]);

  const [notification, setNotification] = useState<string | null>(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [hourlyRate, setHourlyRate] = useState(1500);

  const chartData = [
    { name: 'Mon', earnings: 1500 },
    { name: 'Tue', earnings: 3000 },
    { name: 'Wed', earnings: 1500 },
    { name: 'Thu', earnings: 4500 },
    { name: 'Fri', earnings: 2250 },
    { name: 'Sat', earnings: 6000 },
    { name: 'Sun', earnings: 3000 },
  ];

  const messages = [
    {
      id: 1,
      student: 'Aayush Tamang',
      text: 'Can we focus on calculus in the next session?',
      time: '2 min ago',
    },
    {
      id: 2,
      student: 'Priya Maharjan',
      text: 'Thanks for the notes, they were helpful.',
      time: '1 hour ago',
    },
  ];

  const handleAcceptRequest = (id: string, name: string) => {
    setPendingRequests((prev) => prev.filter((r) => r.id !== id));
    setNotification(`Request from ${name} accepted. Sample booking confirmed.`);
    setTimeout(() => setNotification(null), 4000);
  };

  const handleDeclineRequest = (id: string) => {
    setPendingRequests((prev) => prev.filter((r) => r.id !== id));
    setNotification('Request declined.');
    setTimeout(() => setNotification(null), 3000);
  };

  return (
    <div className="page pb-20">
      {notification && (
        <div
          role="status"
          className="fixed bottom-5 left-5 right-5 z-50 border border-line bg-surface px-4 py-3 text-[13px] text-ink sm:left-auto sm:w-auto sm:max-w-sm"
        >
          {notification}
        </div>
      )}

      <div className="container-page pt-10 sm:pt-12">
        <header className="flex flex-col justify-between gap-6 border-b border-line pb-8 sm:flex-row sm:items-end">
          <div className="flex items-start gap-4">
            <div className="relative flex-shrink-0">
              <img
                src={tutorAvatar}
                alt=""
                className="h-16 w-16 rounded-[2px] object-cover"
              />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-[2rem] font-semibold leading-none tracking-[-0.03em]">
                  {tutorName}
                </h1>
                <DemoBadge label="Demo dashboard" />
              </div>
              <p className="mt-2 max-w-md text-[13px] leading-relaxed text-muted">
                {currentUser?.bio ||
                  'Senior mathematics and physics specialist, Tribhuvan University.'}
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowProfileModal(true)}
            className="btn btn-outline btn-sm"
          >
            <Edit2 className="h-3.5 w-3.5" />
            Edit profile
          </button>
        </header>

        <div className="grid grid-cols-1 border-b border-line sm:grid-cols-3">
          {[
            { label: 'Active bookings', value: sessions.length + 2, note: 'Sample count' },
            { label: 'Total earnings', value: 'NPR 28,500', note: 'Payouts not connected' },
            { label: 'Student rating', value: '4.9 / 5.0', note: 'Sample rating' },
          ].map((stat, i) => (
            <div
              key={stat.label}
              className={`py-5 sm:px-6 ${i > 0 ? 'border-t border-line sm:border-l sm:border-t-0' : ''} ${
                i === 0 ? 'sm:pl-0' : ''
              }`}
            >
              <div className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted">
                {stat.label}
              </div>
              <div className="mt-1.5 text-2xl font-semibold tabular-nums tracking-[-0.02em]">
                {stat.value}
              </div>
              <div className="mt-1 text-[11px] text-muted">{stat.note}</div>
            </div>
          ))}
        </div>

        <div className="mt-10 grid gap-12 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-14">
          <div className="space-y-12">
            <section>
              <h2 className="text-lg font-semibold tracking-[-0.01em]">Confirmed schedule</h2>

              <div className="mt-3 border-y border-line">
                {[
                  {
                    id: 'session-aayush',
                    subject: 'Mathematics',
                    student: 'Aayush Tamang',
                    time: 'Tomorrow, 10:00 AM',
                    detail: '1 hour · NPR 1,500',
                  },
                  {
                    id: 'session-priya',
                    subject: 'Physics',
                    student: 'Priya Maharjan',
                    time: 'Thursday, 2:00 PM',
                    detail: '1.5 hours · NPR 2,250',
                  },
                ].map((session) => (
                  <article
                    key={session.id}
                    className="flex flex-col gap-4 border-t border-line py-4 first:border-t-0 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <h3 className="text-sm font-medium text-ink">{session.student}</h3>
                      <p className="mt-0.5 text-[12px] text-muted">{session.subject}</p>
                      <div className="mt-1 text-[12px] text-muted">
                        {session.time} · {session.detail}
                      </div>
                    </div>
                    <button
                      onClick={() => navigate(`/classroom/${session.id}`)}
                      className="btn btn-outline btn-sm"
                    >
                      <Video className="h-3.5 w-3.5" />
                      Launch classroom
                    </button>
                  </article>
                ))}
              </div>
            </section>

            <section>
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h2 className="text-lg font-semibold tracking-[-0.01em]">
                  Weekly earnings
                </h2>
                <span className="text-[11px] text-muted">Sample data, NPR</span>
              </div>

              <div className="mt-4 h-56 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 4, right: 0, bottom: 0, left: -20 }}>
                    <XAxis
                      dataKey="name"
                      axisLine={{ stroke: darkMode ? '#34332F' : '#DEDBD3' }}
                      tickLine={false}
                      tick={{ fontSize: 11, fill: darkMode ? '#A3A199' : '#66655F' }}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 11, fill: darkMode ? '#A3A199' : '#66655F' }}
                    />
                    <Tooltip
                      cursor={{ fill: darkMode ? 'rgba(240, 238, 232, 0.06)' : 'rgba(23, 24, 26, 0.04)' }}
                      contentStyle={{
                        borderRadius: 2,
                        border: `1px solid ${darkMode ? '#34332F' : '#DEDBD3'}`,
                        background: darkMode ? '#1C1C1A' : '#FFFFFF',
                        color: darkMode ? '#F0EEE8' : '#17181A',
                        fontSize: 12,
                      }}
                    />
                    <Bar dataKey="earnings" fill={darkMode ? '#F0EEE8' : '#17181A'} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </section>
          </div>

          <div className="space-y-10">
            <section>
              <div className="flex items-center justify-between border-b border-line pb-2">
                <h2 className="text-[14px] font-semibold text-ink">
                  Pending inquiries ({pendingRequests.length})
                </h2>
              </div>

              {pendingRequests.length > 0 ? (
                <div>
                  {pendingRequests.map((req) => (
                    <article key={req.id} className="border-b border-line py-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="text-sm font-medium text-ink">{req.student}</h3>
                          <p className="mt-0.5 text-[12px] text-muted">{req.subject}</p>
                        </div>
                        <span className="text-[12px] tabular-nums text-ink">
                          NPR {req.fee.toLocaleString()}
                        </span>
                      </div>
                      <p className="mt-1 text-[11px] text-muted">
                        {req.time} · {req.duration}
                      </p>

                      <div className="mt-3 flex gap-2">
                        <button
                          onClick={() => handleDeclineRequest(req.id)}
                          className="btn btn-outline btn-sm flex-1"
                        >
                          Decline
                        </button>
                        <button
                          onClick={() => handleAcceptRequest(req.id, req.student)}
                          className="btn btn-primary btn-sm flex-1"
                        >
                          Accept
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <p className="border-b border-line py-8 text-center text-[12px] text-muted">
                  No pending inquiries.
                </p>
              )}
            </section>

            <section>
              <h2 className="border-b border-line pb-2 text-[14px] font-semibold text-ink">
                Direct messages
              </h2>

              {messages.map((msg) => (
                <article
                  key={msg.id}
                  className="cursor-pointer border-b border-line py-3.5 hover:bg-ink/[0.02]"
                >
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="text-[13px] font-medium text-ink">{msg.student}</h3>
                    <span className="text-[10px] text-muted">{msg.time}</span>
                  </div>
                  <p className="mt-1 line-clamp-2 text-[12px] leading-relaxed text-muted">
                    {msg.text}
                  </p>
                </article>
              ))}
            </section>
          </div>
        </div>
      </div>

      {showProfileModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-4">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="profile-settings-title"
            className="w-full max-w-md rounded-[2px] border border-line bg-surface p-6"
          >
            <div className="flex items-start justify-between border-b border-line pb-3">
              <h2 id="profile-settings-title" className="text-base font-semibold">
                Profile settings
              </h2>
              <button
                onClick={() => setShowProfileModal(false)}
                className="text-[12px] text-muted hover:text-ink"
              >
                Close
              </button>
            </div>

            <div className="mt-5 space-y-4">
              <div>
                <label htmlFor="rate" className="label">
                  Hourly rate (NPR)
                </label>
                <input
                  id="rate"
                  type="number"
                  value={hourlyRate}
                  onChange={(e) => setHourlyRate(Number(e.target.value))}
                  className="input tabular-nums"
                />
              </div>

              <div>
                <label htmlFor="bio" className="label">
                  Teaching bio
                </label>
                <textarea
                  id="bio"
                  defaultValue="Senior educator with an M.Sc. in Physics. Specialized in calculus, mechanics, and exam preparation for high school and college students."
                  className="textarea"
                  rows={3}
                />
              </div>

              <p className="border-t border-line pt-3 text-[11px] leading-relaxed text-muted">
                Demo profile. Verification and payouts are not connected.
              </p>
            </div>

            <div className="mt-5 flex justify-end gap-2">
              <button
                onClick={() => setShowProfileModal(false)}
                className="btn btn-outline btn-sm"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowProfileModal(false);
                  setNotification('Demo profile settings updated for this session.');
                  setTimeout(() => setNotification(null), 3000);
                }}
                className="btn btn-primary btn-sm"
              >
                Save changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TutorDashboard;

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import DemoBadge from '../components/DemoBadge';

const Documentation: React.FC = () => {
  const [activeSection, setActiveSection] = useState('overview');

  const sections = [
    { id: 'overview', title: 'Overview' },
    { id: 'classroom', title: 'Classroom' },
    { id: 'booking', title: 'Booking and checkout' },
    { id: 'ai', title: 'AI study assistant' },
    { id: 'faq', title: 'Questions' },
  ];

  const paymentMethods = [
    { name: 'Khalti', detail: 'Demo wallet option' },
    { name: 'eSewa', detail: 'Demo direct-pay option' },
    { name: 'Visa and Mastercard', detail: 'Demo card option' },
  ];

  const faqs = [
    {
      q: 'How do I join a class?',
      a: 'Open your dashboard and choose Join classroom on an upcoming session. The room opens with sample session data.',
    },
    {
      q: 'Can I keep the whiteboard notes?',
      a: 'Yes. Use Save notes in the classroom header to download the current whiteboard as a PNG.',
    },
    {
      q: 'Are tutors verified?',
      a: 'Not yet. Profiles are sample data and verification is not built. A verification badge will only appear once that process exists.',
    },
    {
      q: 'Does checkout charge me?',
      a: 'No. Checkout saves a sample booking in your browser and never contacts a payment provider.',
    },
  ];

  return (
    <div className="page pb-20">
      <header className="container-page border-b border-line py-12">
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div className="max-w-xl">
            <h1 className="text-[2rem] font-semibold leading-tight tracking-[-0.03em] sm:text-[2.25rem]">
              Guide
            </h1>
            <p className="mt-3 text-[15px] leading-relaxed text-muted">
              How discovery, booking, and the live classroom work in this build. Everything
              here uses sample data.
            </p>
            <div className="mt-4">
              <DemoBadge label="Demo documentation" />
            </div>
          </div>

          <Link to="/find-tutors" className="btn btn-outline btn-sm self-start sm:self-auto">
            Find a tutor
          </Link>
        </div>
      </header>

      <div className="container-page mt-10 flex flex-col gap-10 lg:flex-row lg:gap-16">
        <aside className="w-full flex-shrink-0 lg:w-48">
          <div className="lg:sticky lg:top-24">
            <h2 className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">
              Contents
            </h2>
            <nav className="mt-3 flex flex-row flex-wrap gap-x-4 gap-y-2 lg:flex-col lg:gap-2">
              {sections.map((sec) => (
                <button
                  key={sec.id}
                  onClick={() => setActiveSection(sec.id)}
                  aria-current={activeSection === sec.id ? 'true' : undefined}
                  className={`text-left text-[13px] transition-colors ${
                    activeSection === sec.id
                      ? 'font-medium text-ink'
                      : 'text-muted hover:text-ink'
                  }`}
                >
                  {sec.title}
                </button>
              ))}
            </nav>
          </div>
        </aside>

        <main className="min-w-0 max-w-[68ch] flex-1">
          {activeSection === 'overview' && (
            <section>
              <h2 className="text-2xl font-semibold tracking-[-0.02em]">Overview</h2>
              <p className="mt-4 text-[15px] leading-[1.75] text-muted">
                Tutor Hub is a one-to-one tutoring marketplace for high school and
                university students in Nepal. Students compare educators by subject, level,
                rate, and rating, then book a live session.
              </p>

              <div className="mt-8 grid gap-8 border-t border-line pt-6 sm:grid-cols-2">
                <div>
                  <h3 className="text-sm font-medium text-ink">For students</h3>
                  <p className="mt-2 text-[13px] leading-relaxed text-muted">
                    Browse sample profiles, walk through booking, and explore the classroom
                    at your own pace. Saved sessions and tutors stay in your browser.
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-ink">For educators</h3>
                  <p className="mt-2 text-[13px] leading-relaxed text-muted">
                    Preview incoming requests, host a sample session, and set an hourly rate
                    in NPR. Payouts are not connected in this demo.
                  </p>
                </div>
              </div>
            </section>
          )}

          {activeSection === 'classroom' && (
            <section>
              <h2 className="text-2xl font-semibold tracking-[-0.02em]">Classroom</h2>
              <p className="mt-4 text-[15px] leading-[1.75] text-muted">
                A live session combines video, a shared whiteboard, chat, notes, and a
                scripted study assistant in one workspace.
              </p>

              <dl className="mt-8 border-t border-line">
                {[
                  {
                    term: 'Whiteboard',
                    detail:
                      'Smooth pointer drawing with several pen colours, an eraser, stroke width control, and PNG export.',
                  },
                  {
                    term: 'Camera and screen share',
                    detail:
                      'Toggle your webcam or share a window for problem set reviews. Quality depends on your device and connection.',
                  },
                  {
                    term: 'Notes and chat',
                    detail:
                      'Lesson notes stay in the browser tab. Chat messages are local sample data and are not delivered to anyone.',
                  },
                ].map((item) => (
                  <div key={item.term} className="border-b border-line py-4">
                    <dt className="text-sm font-medium text-ink">{item.term}</dt>
                    <dd className="mt-1 text-[13px] leading-relaxed text-muted">
                      {item.detail}
                    </dd>
                  </div>
                ))}
              </dl>

              <Link to="/classroom/s1" className="btn btn-outline btn-sm mt-6">
                Open the classroom demo
              </Link>
            </section>
          )}

          {activeSection === 'booking' && (
            <section>
              <h2 className="text-2xl font-semibold tracking-[-0.02em]">
                Booking and checkout
              </h2>
              <p className="mt-4 text-[15px] leading-[1.75] text-muted">
                Pick a subject, date, time, and duration, then walk through a sample payment
                step. Nothing is charged and no provider is contacted.
              </p>

              <div className="mt-8 border-t border-line">
                {paymentMethods.map((method) => (
                  <div
                    key={method.name}
                    className="flex items-baseline justify-between gap-4 border-b border-line py-3"
                  >
                    <span className="text-sm text-ink">{method.name}</span>
                    <span className="text-[12px] text-muted">{method.detail}</span>
                  </div>
                ))}
              </div>

              <p className="mt-5 border-y border-line py-4 text-[13px] leading-relaxed text-muted">
                Choosing a method creates a sample booking in your browser so you can see
                the dashboard flow. No funds move, no escrow is used, and no refunds are
                processed.
              </p>
            </section>
          )}

          {activeSection === 'ai' && (
            <section>
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="text-2xl font-semibold tracking-[-0.02em]">
                  AI study assistant
                </h2>
                <DemoBadge label="Scripted responses" />
              </div>
              <p className="mt-4 text-[15px] leading-[1.75] text-muted">
                The assistant is a scripted preview. It returns canned answers and is not
                connected to a language model.
              </p>

              <dl className="mt-8 border-t border-line">
                {[
                  {
                    term: 'Step-by-step problem solving',
                    detail: 'Shows how a guided walkthrough of a formula could look.',
                  },
                  {
                    term: 'Practice questions',
                    detail: 'Returns sample prompts based on the selected topic.',
                  },
                  {
                    term: 'Lesson summaries',
                    detail: 'Previews how key takeaways could be collected after a lesson.',
                  },
                ].map((item) => (
                  <div key={item.term} className="border-b border-line py-4">
                    <dt className="text-sm font-medium text-ink">{item.term}</dt>
                    <dd className="mt-1 text-[13px] leading-relaxed text-muted">
                      {item.detail}
                    </dd>
                  </div>
                ))}
              </dl>
            </section>
          )}

          {activeSection === 'faq' && (
            <section>
              <h2 className="text-2xl font-semibold tracking-[-0.02em]">Questions</h2>

              <dl className="mt-6 border-t border-line">
                {faqs.map((faq) => (
                  <div key={faq.q} className="border-b border-line py-4">
                    <dt className="text-sm font-medium text-ink">{faq.q}</dt>
                    <dd className="mt-1.5 text-[13px] leading-relaxed text-muted">
                      {faq.a}
                    </dd>
                  </div>
                ))}
              </dl>
            </section>
          )}
        </main>
      </div>
    </div>
  );
};

export default Documentation;

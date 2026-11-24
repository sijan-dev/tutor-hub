import React, { useState } from 'react';
import { Bot, X, Send, ArrowRight } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import DemoBadge from './DemoBadge';

interface AIMsg {
  role: 'user' | 'assistant';
  text: string;
}

const AIAssistantWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const [messages, setMessages] = useState<AIMsg[]>([
    {
      role: 'assistant',
      text: "This is the Tutor Hub study assistant demo. Ask about a subject, a tutor, or how the classroom works. Replies are scripted samples.",
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLaunchClassroom = () => {
    setIsOpen(false);
    navigate('/classroom/s1');
  };

  const handleSend = (userQuery?: string) => {
    const q = userQuery || input;
    if (!q.trim()) return;

    setMessages((prev) => [...prev, { role: 'user', text: q }]);
    setInput('');
    setLoading(true);

    setTimeout(() => {
      let reply = '';
      const lower = q.toLowerCase();

      if (
        lower.includes('classroom') ||
        lower.includes('demo') ||
        lower.includes('whiteboard') ||
        lower.includes('video')
      ) {
        reply =
          'The classroom demo includes a shared whiteboard, camera feeds, chat, notes, and a scripted assistant. Open it from the button below.';
      } else if (lower.includes('math') || lower.includes('calculus') || lower.includes('physics')) {
        reply =
          'In the demo catalog, Rajesh Sharma teaches Mathematics and Physics at NPR 1,500 per hour, with 8 years of experience. Bookings are demo-only.';
      } else if (lower.includes('computer') || lower.includes('code') || lower.includes('python')) {
        reply =
          'Bishal Thapa is the demo Computer Science profile, focused on Python, JavaScript, and React.';
      } else if (
        lower.includes('payment') ||
        lower.includes('esewa') ||
        lower.includes('khalti')
      ) {
        reply =
          'Checkout is a demo. Khalti, eSewa, and card options are shown for layout only. No payment is processed.';
      } else {
        reply =
          'I can help you explore demo tutor profiles, explain a topic, or open the classroom. What subject are you preparing for?';
      }

      setMessages((prev) => [...prev, { role: 'assistant', text: reply }]);
      setLoading(false);
    }, 500);
  };

  if (location.pathname.startsWith('/classroom')) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 sm:bottom-6 sm:right-6">
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 border border-line bg-surface px-3.5 py-2.5 text-[13px] font-medium text-ink hover:border-ink/40"
        >
          <Bot className="h-4 w-4" />
          Study assistant
        </button>
      )}

      {isOpen && (
        <div className="flex h-[520px] max-h-[85vh] w-[calc(100vw-2rem)] max-w-[380px] flex-col overflow-hidden border border-line bg-surface">
          <div className="flex items-center justify-between border-b border-line px-4 py-3">
            <div className="flex items-center gap-2">
              <Bot className="h-4 w-4 text-ink" />
              <div>
                <h2 className="text-[13px] font-medium text-ink">Study assistant</h2>
                <p className="text-[10px] text-muted">Scripted demo responses</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <DemoBadge label="Demo" />
              <button
                onClick={() => setIsOpen(false)}
                className="text-muted hover:text-ink"
                aria-label="Close assistant"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto p-4 text-[13px]">
            <div className="border border-line p-3">
              <span className="mb-2 block text-[10px] font-medium uppercase tracking-[0.08em] text-muted">
                Quick actions
              </span>
              <div className="flex flex-col items-start gap-1.5">
                <button
                  onClick={handleLaunchClassroom}
                  className="flex items-center gap-1.5 text-left text-[12px] text-ink hover:underline"
                >
                  Open the live classroom demo
                  <ArrowRight className="h-3 w-3" />
                </button>
                <button
                  onClick={() => handleSend('Who teaches calculus?')}
                  className="text-left text-[12px] text-muted hover:text-ink"
                >
                  Who teaches calculus?
                </button>
                <button
                  onClick={() => handleSend('How does the demo checkout work?')}
                  className="text-left text-[12px] text-muted hover:text-ink"
                >
                  How does demo payment work?
                </button>
              </div>
            </div>

            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[90%] whitespace-pre-line p-2.5 leading-relaxed ${
                    m.role === 'user'
                      ? 'bg-ink text-paper'
                      : 'border border-line bg-paper text-ink'
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}

            {loading && <p className="text-[12px] text-muted">Writing a reply…</p>}
          </div>

          <div className="flex gap-2 border-t border-line p-3">
            <label className="sr-only" htmlFor="assistant-input">
              Ask the assistant
            </label>
            <input
              id="assistant-input"
              type="text"
              placeholder="Ask anything"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              className="input"
            />
            <button
              onClick={() => handleSend()}
              className="btn btn-primary px-3"
              aria-label="Send"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIAssistantWidget;

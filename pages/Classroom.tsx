import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  ScreenShare,
  PhoneOff,
  PenTool,
  Eraser,
  RotateCcw,
  Download,
  Send,
  Sliders,
  Layout,
  MessageCircle,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import DemoBadge from '../components/DemoBadge';

interface Point {
  x: number;
  y: number;
}

interface AIMessage {
  role: 'user' | 'assistant';
  content: string;
  time: string;
}

const Classroom: React.FC = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const { sessions, role } = useApp();

  const session = (Array.isArray(sessions) ? sessions.find((s) => s && s.id === sessionId) : null) || {
    id: sessionId || 's1',
    tutorName: 'Rajesh Sharma',
    subject: 'Mathematics',
    date: 'Today',
    time: '10:00 AM',
    duration: '1 hour',
    price: 1500,
    status: 'Upcoming' as const,
  };

  const [mobileTab, setMobileTab] = useState<'canvas' | 'chat'>('canvas');

  const [micOn, setMicOn] = useState(true);
  const [videoOn, setVideoOn] = useState(true);
  const [screenSharing, setScreenSharing] = useState(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'notes' | 'ai'>('chat');

  const userVideoRef = useRef<HTMLVideoElement | null>(null);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [hasWebcam, setHasWebcam] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [penColor, setPenColor] = useState('#17181A');
  const [penWidth, setPenWidth] = useState(4);
  const [isEraser, setIsEraser] = useState(false);
  const [showThickness, setShowThickness] = useState(false);

  const pointsRef = useRef<Point[]>([]);

  const [chatMessages, setChatMessages] = useState([
    {
      sender: session.tutorName,
      text: "Welcome to today's session. Let's work through the theorem on the whiteboard.",
      time: '10:00 AM',
    },
    { sender: 'You', text: 'Hi, ready to begin.', time: '10:01 AM' },
  ]);
  const [inputText, setInputText] = useState('');

  const [aiMessages, setAiMessages] = useState<AIMessage[]>([
    {
      role: 'assistant',
      content: `This is the scripted study assistant for the ${session.subject} session. Ask it to break down a formula, generate practice questions, or explain a concept. Responses are canned samples.`,
      time: '10:00 AM',
    },
  ]);
  const [aiInput, setAiInput] = useState('');
  const [aiLoading, setAiLoading] = useState(false);

  const [sharedNotes, setSharedNotes] = useState(
    "Lesson plan:\n1. Derivative of composite functions (chain rule)\n2. Implicit differentiation\n3. Physics application: velocity and acceleration\n\nNotes from tutor:\n- d/dx [f(g(x))] = f'(g(x)) * g'(x)"
  );

  const [secondsElapsed, setSecondsElapsed] = useState(35);
  useEffect(() => {
    const timer = setInterval(() => setSecondsElapsed((prev) => prev + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleCamera = async () => {
    if (videoOn && hasWebcam && localStream) {
      localStream.getVideoTracks().forEach((track) => track.stop());
      setLocalStream(null);
      setHasWebcam(false);
      setVideoOn(false);
    } else if (!videoOn) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: micOn });
        setLocalStream(stream);
        setHasWebcam(true);
        setVideoOn(true);
        if (userVideoRef.current) {
          userVideoRef.current.srcObject = stream;
        }
      } catch {
        setVideoOn(true);
        setHasWebcam(false);
      }
    } else {
      setVideoOn(false);
    }
  };

  const toggleScreenShare = async () => {
    if (!screenSharing) {
      try {
        const displayStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
        setScreenSharing(true);
        displayStream.getVideoTracks()[0].onended = () => {
          setScreenSharing(false);
        };
      } catch {
        setScreenSharing(false);
      }
    } else {
      setScreenSharing(false);
    }
  };

  const drawGrid = useCallback((ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.save();
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);

    ctx.strokeStyle = '#efeee9';
    ctx.lineWidth = 1;

    for (let x = 0; x < width; x += 32) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += 32) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
    ctx.restore();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.scale(dpr, dpr);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    drawGrid(ctx, rect.width, rect.height);
  }, [drawGrid, mobileTab]);

  const getCoordinates = (e: React.PointerEvent<HTMLCanvasElement>): Point | null => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const pt = getCoordinates(e);
    if (!pt) return;

    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    setIsDrawing(true);
    pointsRef.current = [pt];

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.beginPath();
    ctx.arc(pt.x, pt.y, (isEraser ? penWidth * 3 : penWidth) / 2, 0, Math.PI * 2);
    ctx.fillStyle = isEraser ? '#ffffff' : penColor;
    ctx.fill();
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const pt = getCoordinates(e);
    if (!pt) return;

    pointsRef.current.push(pt);

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const pts = pointsRef.current;
    if (pts.length < 2) return;

    ctx.beginPath();
    ctx.strokeStyle = isEraser ? '#ffffff' : penColor;
    ctx.lineWidth = isEraser ? penWidth * 5 : penWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    const p1 = pts[pts.length - 2];
    const p2 = pts[pts.length - 1];
    const midPoint = { x: (p1.x + p2.x) / 2, y: (p1.y + p2.y) / 2 };

    ctx.moveTo(p1.x, p1.y);
    ctx.quadraticCurveTo(p1.x, p1.y, midPoint.x, midPoint.y);
    ctx.stroke();
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {}
    setIsDrawing(false);
    pointsRef.current = [];
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    drawGrid(ctx, rect.width, rect.height);
  };

  const downloadCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const url = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `tutor-hub-notes-${session.subject}.png`;
    link.href = url;
    link.click();
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    setChatMessages((prev) => [
      ...prev,
      {
        sender: 'You',
        text: inputText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
    setInputText('');
  };

  const handleAskAI = (promptText?: string) => {
    const query = promptText || aiInput;
    if (!query.trim()) return;

    const userMsg: AIMessage = {
      role: 'user',
      content: query,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setAiMessages((prev) => [...prev, userMsg]);
    setAiInput('');
    setAiLoading(true);

    setTimeout(() => {
      let response = '';
      const lower = query.toLowerCase();

      if (lower.includes('chain rule') || lower.includes('derivative')) {
        response = `Chain rule:\nIf y = f(g(x)), then dy/dx = f'(g(x)) * g'(x).\n\nExample: sin(3x^2)\n1. Outer: f(u) = sin(u), f'(u) = cos(u)\n2. Inner: g(x) = 3x^2, g'(x) = 6x\n3. Result: 6x * cos(3x^2)`;
      } else if (lower.includes('question') || lower.includes('practice') || lower.includes('quiz')) {
        response = `Practice: find the derivative of f(x) = (4x^3 - 2x)^5.\n\nHint: apply the power rule to the outside bracket first, then multiply by the derivative of the inside polynomial.`;
      } else if (lower.includes('summary') || lower.includes('takeaway')) {
        response = `Key takeaways:\n- Identify the outer and inner functions before differentiating.\n- Remember the negative sign when differentiating cosine.\n- Check where f'(x) = 0 for local maxima and minima.`;
      } else {
        response = `For ${session.subject}, check units and split complex problems into two-step equations. Ask ${session.tutorName} to sketch the graph on the whiteboard.`;
      }

      setAiMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: response,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
      setAiLoading(false);
    }, 700);
  };

  const handleEndSession = () => {
    const targetDashboard = role === 'tutor' ? '/tutor-dashboard' : '/student-dashboard';
    navigate(targetDashboard);
  };

  const controlButton = (active: boolean) =>
    `flex h-10 w-10 items-center justify-center rounded-[2px] border transition-colors ${
      active
        ? 'border-ink bg-ink text-paper'
        : 'border-line bg-surface text-ink hover:border-ink/40'
    }`;

  return (
    <div className="flex h-screen select-none flex-col bg-paper text-ink">
      <header className="flex h-14 flex-shrink-0 items-center justify-between border-b border-line px-3 sm:px-5">
        <div className="flex min-w-0 items-center gap-3">
          <div className="truncate">
            <h1 className="truncate text-sm font-medium">{session.subject}</h1>
            <p className="truncate text-[11px] text-muted">
              {session.tutorName} · {session.time}
            </p>
          </div>
          <DemoBadge label="Demo session" className="hidden sm:inline-flex" />
        </div>

        <div className="flex items-center gap-1.5 sm:gap-3">
          <div className="flex items-center gap-1.5 border border-line px-2 py-1 text-[11px] tabular-nums text-ink">
            <span className="h-1.5 w-1.5 rounded-full bg-ok" aria-hidden="true" />
            {formatTimer(secondsElapsed)}
          </div>

          <button
            onClick={() => {
              setActiveTab('ai');
              setMobileTab('chat');
            }}
            className={`hidden items-center gap-1.5 rounded-[2px] border px-2.5 py-1 text-[11px] font-medium transition-colors sm:flex ${
              activeTab === 'ai'
                ? 'border-ink bg-ink text-paper'
                : 'border-line text-muted hover:text-ink'
            }`}
          >
            Study assistant
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={downloadCanvas}
            className="flex h-9 w-9 items-center justify-center border border-line text-ink hover:border-ink/40 sm:w-auto sm:gap-1.5 sm:px-3"
            title="Save whiteboard as PNG"
          >
            <Download className="h-4 w-4" />
            <span className="hidden text-[12px] sm:inline">Save notes</span>
          </button>
          <button
            onClick={handleEndSession}
            className="flex h-9 items-center gap-1.5 border border-accent px-3 text-[12px] font-medium text-accent hover:bg-accent/[0.06]"
          >
            <PhoneOff className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">End session</span>
          </button>
        </div>
      </header>

      <div className="flex flex-shrink-0 gap-6 border-b border-line px-4 md:hidden">
        <button
          onClick={() => setMobileTab('canvas')}
          className={`tab ${mobileTab === 'canvas' ? 'tab-active' : ''}`}
        >
          <Layout className="mr-1.5 inline h-3.5 w-3.5" />
          Whiteboard
        </button>
        <button
          onClick={() => setMobileTab('chat')}
          className={`tab ${mobileTab === 'chat' ? 'tab-active' : ''}`}
        >
          <MessageCircle className="mr-1.5 inline h-3.5 w-3.5" />
          Chat
        </button>
      </div>

      <div className="relative flex flex-1 overflow-hidden">
        <div
          className={`flex-1 flex-col gap-3 overflow-hidden p-3 sm:gap-4 sm:p-5 ${
            mobileTab === 'chat' ? 'hidden md:flex' : 'flex'
          }`}
        >
          <div className="grid h-28 flex-shrink-0 grid-cols-2 gap-3 sm:h-36 sm:gap-4">
            <div className="relative overflow-hidden border border-line bg-ink">
              <img
                src="https://picsum.photos/seed/rajesh/600/400"
                alt="Tutor video feed"
                className="h-full w-full object-cover opacity-90"
              />
              <div className="absolute bottom-2 left-2 flex items-center gap-1.5 bg-ink/80 px-2 py-0.5 text-[10px] text-paper">
                <span className="h-1.5 w-1.5 rounded-full bg-ok" aria-hidden="true" />
                {session.tutorName}
              </div>
            </div>

            <div className="relative flex items-center justify-center overflow-hidden border border-line bg-ink">
              {hasWebcam && videoOn ? (
                <video
                  ref={userVideoRef}
                  autoPlay
                  playsInline
                  muted
                  className="h-full w-full scale-x-[-1] object-cover"
                />
              ) : videoOn ? (
                <div className="flex h-full w-full flex-col items-center justify-center gap-1 text-paper/70">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full border border-paper/30 text-sm">
                    A
                  </span>
                  <span className="text-[10px]">Camera preview</span>
                </div>
              ) : (
                <div className="text-center text-[10px] text-paper/60">
                  <VideoOff className="mx-auto mb-1 h-5 w-5" />
                  Camera off
                </div>
              )}
              <div className="absolute bottom-2 left-2 flex items-center gap-1.5 bg-ink/80 px-2 py-0.5 text-[10px] text-paper">
                <span
                  className={`h-1.5 w-1.5 rounded-full ${micOn ? 'bg-ok' : 'bg-accent'}`}
                  aria-hidden="true"
                />
                You{micOn ? '' : ' (muted)'}
              </div>
            </div>
          </div>

          <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden border border-line bg-white">
            <div className="absolute left-1/2 top-3 z-20 flex max-w-[95vw] -translate-x-1/2 items-center gap-2 overflow-x-auto border border-line bg-surface px-2.5 py-1.5">
              <div className="flex flex-shrink-0 items-center gap-1.5 border-r border-line pr-2">
                {['#17181A', '#A33A2B', '#1D4E89', '#1F6B45'].map((c) => (
                  <button
                    key={c}
                    onClick={() => {
                      setPenColor(c);
                      setIsEraser(false);
                    }}
                    style={{ backgroundColor: c }}
                    aria-label={`Pen colour ${c}`}
                    className={`h-4 w-4 flex-shrink-0 rounded-full transition-colors ${
                      penColor === c && !isEraser
                        ? 'ring-2 ring-ink ring-offset-1'
                        : 'hover:ring-1 hover:ring-line'
                    }`}
                  />
                ))}
              </div>

              <div className="flex flex-shrink-0 items-center gap-0.5 border-r border-line pr-1.5">
                <button
                  onClick={() => setIsEraser(false)}
                  className={`flex h-7 w-7 items-center justify-center rounded-[2px] ${
                    !isEraser ? 'bg-ink text-paper' : 'text-muted hover:text-ink'
                  }`}
                  title="Pen"
                  aria-label="Pen"
                >
                  <PenTool className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => setIsEraser(true)}
                  className={`flex h-7 w-7 items-center justify-center rounded-[2px] ${
                    isEraser ? 'bg-ink text-paper' : 'text-muted hover:text-ink'
                  }`}
                  title="Eraser"
                  aria-label="Eraser"
                >
                  <Eraser className="h-3.5 w-3.5" />
                </button>
                <div className="relative">
                  <button
                    onClick={() => setShowThickness(!showThickness)}
                    className="flex h-7 w-7 items-center justify-center rounded-[2px] text-muted hover:text-ink"
                    title="Stroke width"
                    aria-label="Stroke width"
                  >
                    <Sliders className="h-3.5 w-3.5" />
                  </button>
                  {showThickness && (
                    <div className="absolute left-0 top-9 z-30 w-36 border border-line bg-surface p-3">
                      <span className="mb-1 block text-[10px] text-muted">
                        Width: {penWidth}px
                      </span>
                      <input
                        type="range"
                        min="2"
                        max="16"
                        value={penWidth}
                        onChange={(e) => setPenWidth(Number(e.target.value))}
                        className="w-full cursor-pointer"
                      />
                    </div>
                  )}
                </div>
                <button
                  onClick={clearCanvas}
                  className="flex h-7 w-7 items-center justify-center rounded-[2px] text-muted hover:text-accent"
                  title="Clear whiteboard"
                  aria-label="Clear whiteboard"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            <canvas
              ref={canvasRef}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              className="h-full w-full cursor-crosshair touch-none"
            />
          </div>

          <div className="flex h-14 flex-shrink-0 items-center justify-center gap-3 border border-line bg-surface">
            <button
              onClick={() => setMicOn(!micOn)}
              className={controlButton(micOn)}
              title={micOn ? 'Mute microphone' : 'Unmute microphone'}
              aria-label={micOn ? 'Mute microphone' : 'Unmute microphone'}
            >
              {micOn ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
            </button>
            <button
              onClick={toggleCamera}
              className={controlButton(videoOn)}
              title={videoOn ? 'Turn camera off' : 'Turn camera on'}
              aria-label={videoOn ? 'Turn camera off' : 'Turn camera on'}
            >
              {videoOn ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
            </button>
            <button
              onClick={toggleScreenShare}
              className={controlButton(screenSharing)}
              title="Share screen"
              aria-label="Share screen"
            >
              <ScreenShare className="h-4 w-4" />
            </button>
          </div>
        </div>

        <aside
          className={`w-full flex-col border-l border-line bg-surface md:flex md:w-80 lg:w-96 ${
            mobileTab === 'canvas' ? 'hidden' : 'flex'
          }`}
        >
          <div className="flex flex-shrink-0 gap-6 border-b border-line px-4 pt-3">
            {(
              [
                ['chat', 'Chat'],
                ['notes', 'Notes'],
                ['ai', 'Assistant'],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`tab ${activeTab === id ? 'tab-active' : ''}`}
              >
                {label}
              </button>
            ))}
          </div>

          {activeTab === 'chat' && (
            <div className="flex flex-1 flex-col justify-between overflow-hidden p-4">
              <div className="flex-1 space-y-4 overflow-y-auto pr-1 text-[13px]">
                {chatMessages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex flex-col ${msg.sender === 'You' ? 'items-end' : 'items-start'}`}
                  >
                    <span className="mb-1 text-[10px] text-muted">
                      {msg.sender} · {msg.time}
                    </span>
                    <div
                      className={`max-w-[85%] p-2.5 leading-relaxed ${
                        msg.sender === 'You'
                          ? 'bg-ink text-paper'
                          : 'border border-line bg-paper text-ink'
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>

              <form onSubmit={handleSendMessage} className="flex flex-shrink-0 gap-2 border-t border-line pt-3">
                <label className="sr-only" htmlFor="chat-input">
                  Message
                </label>
                <input
                  id="chat-input"
                  type="text"
                  placeholder="Ask a question"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="input"
                />
                <button type="submit" className="btn btn-primary px-3" aria-label="Send message">
                  <Send className="h-4 w-4" />
                </button>
              </form>
            </div>
          )}

          {activeTab === 'notes' && (
            <div className="flex flex-1 flex-col overflow-hidden p-4">
              <div className="mb-2 flex items-center gap-2 text-[11px] text-muted">
                Session notes
                <DemoBadge label="Local only" />
              </div>
              <textarea
                value={sharedNotes}
                onChange={(e) => setSharedNotes(e.target.value)}
                className="textarea flex-1 resize-none font-mono text-[12px] leading-relaxed"
                placeholder="Type study notes here"
              />
              <p className="mt-2 text-[10px] text-muted">
                Notes stay in this browser tab. Nothing is shared with the educator.
              </p>
            </div>
          )}

          {activeTab === 'ai' && (
            <div className="flex flex-1 flex-col justify-between overflow-hidden p-4">
              <div className="flex-1 space-y-4 overflow-y-auto pr-1 text-[13px]">
                <div className="border border-line p-3">
                  <div className="mb-2 flex items-center justify-between text-[10px] font-medium uppercase tracking-[0.08em] text-muted">
                    Try a prompt
                    <DemoBadge label="Scripted" />
                  </div>
                  <div className="flex flex-col items-start gap-1.5">
                    <button
                      onClick={() => handleAskAI('Explain chain rule step-by-step with an example')}
                      className="text-left text-[12px] text-muted hover:text-ink"
                    >
                      Explain the chain rule with an example
                    </button>
                    <button
                      onClick={() => handleAskAI('Generate 1 practice calculus question')}
                      className="text-left text-[12px] text-muted hover:text-ink"
                    >
                      Give me a practice question
                    </button>
                    <button
                      onClick={() => handleAskAI('Summarize key takeaways for this topic')}
                      className="text-left text-[12px] text-muted hover:text-ink"
                    >
                      Summarize the key takeaways
                    </button>
                  </div>
                </div>

                {aiMessages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
                  >
                    <span className="mb-1 text-[10px] text-muted">
                      {msg.role === 'user' ? 'You' : 'Assistant'} · {msg.time}
                    </span>
                    <div
                      className={`max-w-[90%] whitespace-pre-line p-2.5 leading-relaxed ${
                        msg.role === 'user'
                          ? 'bg-ink text-paper'
                          : 'border border-line bg-paper text-ink'
                      }`}
                    >
                      {msg.content}
                    </div>
                  </div>
                ))}

                {aiLoading && (
                  <p className="text-[12px] text-muted">Working through it…</p>
                )}
              </div>

              <div className="flex flex-shrink-0 gap-2 border-t border-line pt-3">
                <label className="sr-only" htmlFor="ai-input">
                  Ask the assistant
                </label>
                <input
                  id="ai-input"
                  type="text"
                  placeholder="Ask the assistant"
                  value={aiInput}
                  onChange={(e) => setAiInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAskAI()}
                  className="input"
                />
                <button
                  type="button"
                  onClick={() => handleAskAI()}
                  className="btn btn-primary px-3"
                  aria-label="Send to assistant"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
};

export default Classroom;

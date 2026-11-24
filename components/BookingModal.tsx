import React, { useState } from 'react';
import { X, CheckCircle, ArrowRight } from 'lucide-react';
import { Tutor } from '../types';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import DemoBadge from './DemoBadge';

interface BookingModalProps {
  tutor: Tutor;
  isOpen: boolean;
  onClose: () => void;
}

const BookingModal: React.FC<BookingModalProps> = ({ tutor, isOpen, onClose }) => {
  const { addSession } = useApp();
  const navigate = useNavigate();

  const [step, setStep] = useState<'select' | 'payment' | 'success'>('select');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [duration, setDuration] = useState<number>(1);
  const [selectedSubject, setSelectedSubject] = useState<string>(tutor.subjects[0] || 'General');

  const [paymentMethod, setPaymentMethod] = useState<'khalti' | 'esewa' | 'card'>('khalti');
  const [walletPhone, setWalletPhone] = useState('98XXXXXXXX');
  const [isProcessing, setIsProcessing] = useState(false);
  const [txRef, setTxRef] = useState('');

  if (!isOpen) return null;

  const totalPrice = tutor.price * duration;
  const timeSlots = ['09:00 AM', '10:00 AM', '11:30 AM', '02:00 PM', '04:00 PM', '06:30 PM'];

  const handleProceedToPayment = () => {
    if (!selectedDate || !selectedTime) return;
    setStep('payment');
  };

  const handleProcessPayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      const generatedRef = `DEMO-${paymentMethod.toUpperCase()}-${Math.floor(
        100000 + Math.random() * 900000
      )}`;
      setTxRef(generatedRef);

      addSession({
        tutorName: tutor.name,
        subject: selectedSubject,
        date: selectedDate,
        time: selectedTime,
        duration: `${duration} hour${duration > 1 ? 's' : ''}`,
        price: totalPrice,
        status: 'Upcoming',
      });

      setIsProcessing(false);
      setStep('success');
    }, 1200);
  };

  const handleClose = () => {
    setStep('select');
    setSelectedDate('');
    setSelectedTime('');
    onClose();
  };

  const handleGoToDashboard = () => {
    handleClose();
    navigate('/student-dashboard');
  };

  const paymentOptions = [
    { id: 'khalti' as const, name: 'Khalti', detail: 'Wallet' },
    { id: 'esewa' as const, name: 'eSewa', detail: 'Direct pay' },
    { id: 'card' as const, name: 'Card', detail: 'Visa, Mastercard' },
  ];

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="booking-title"
    >
      <div className="flex min-h-screen items-center justify-center px-4 py-8">
        <div
          className="fixed inset-0 bg-ink/40"
          aria-hidden="true"
          onClick={handleClose}
        />

        <div className="relative z-10 w-full max-w-lg rounded-[2px] border border-line bg-surface">
          <div className="flex items-start justify-between border-b border-line px-5 py-4">
            <div>
              <h2 id="booking-title" className="text-base font-semibold tracking-[-0.01em]">
                {step === 'select' && `Book with ${tutor.name}`}
                {step === 'payment' && 'Demo checkout'}
                {step === 'success' && 'Booking created'}
              </h2>
              <p className="mt-0.5 text-[11px] text-muted">
                {step === 'select' && `NPR ${tutor.price.toLocaleString()} per hour`}
                {step === 'payment' && 'No payment is processed'}
                {step === 'success' && 'Saved to your local dashboard'}
              </p>
            </div>
            <button
              onClick={handleClose}
              className="text-muted hover:text-ink"
              aria-label="Close booking"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="p-5">
            {step === 'select' && (
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <p className="text-[12px] text-muted">Pick a sample slot.</p>
                  <DemoBadge label="Demo booking" />
                </div>

                <div>
                  <span className="label">Subject</span>
                  <div className="flex flex-wrap gap-1.5">
                    {tutor.subjects.map((sub) => (
                      <button
                        key={sub}
                        type="button"
                        onClick={() => setSelectedSubject(sub)}
                        aria-pressed={selectedSubject === sub}
                        className={`border px-2.5 py-1 text-[12px] transition-colors ${
                          selectedSubject === sub
                            ? 'border-ink bg-ink text-paper'
                            : 'border-line text-muted hover:text-ink'
                        }`}
                      >
                        {sub}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label htmlFor="booking-date" className="label">
                    Date
                  </label>
                  <input
                    id="booking-date"
                    type="date"
                    min={new Date().toISOString().split('T')[0]}
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="input"
                  />
                </div>

                <div>
                  <span className="label">Time</span>
                  <div className="grid grid-cols-3 gap-1.5">
                    {timeSlots.map((time) => (
                      <button
                        key={time}
                        type="button"
                        onClick={() => setSelectedTime(time)}
                        aria-pressed={selectedTime === time}
                        className={`border py-2 text-[12px] tabular-nums transition-colors ${
                          selectedTime === time
                            ? 'border-ink bg-ink text-paper'
                            : 'border-line text-muted hover:border-ink/40 hover:text-ink'
                        }`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="label">Duration</span>
                  <div className="grid grid-cols-3 gap-1.5">
                    {[1, 1.5, 2].map((dur) => (
                      <button
                        type="button"
                        key={dur}
                        onClick={() => setDuration(dur)}
                        aria-pressed={duration === dur}
                        className={`border py-2 text-[12px] transition-colors ${
                          duration === dur
                            ? 'border-ink bg-ink text-paper'
                            : 'border-line text-muted hover:border-ink/40 hover:text-ink'
                        }`}
                      >
                        {dur} hour{dur > 1 ? 's' : ''}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-baseline justify-between border-y border-line py-3">
                  <div>
                    <span className="text-[10px] font-semibold uppercase tracking-[0.1em] text-muted">
                      Demo total
                    </span>
                    <p className="text-[11px] text-muted">One-to-one session, no charge</p>
                  </div>
                  <span className="text-lg font-semibold tabular-nums">
                    NPR {totalPrice.toLocaleString()}
                  </span>
                </div>
              </div>
            )}

            {step === 'payment' && (
              <div className="space-y-5">
                <div className="flex items-baseline justify-between border-y border-line py-3 text-[12px]">
                  <div>
                    <span className="text-muted">Session</span>
                    <p className="mt-0.5 text-ink">
                      {selectedSubject} · {duration} hr
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-muted">Demo amount</span>
                    <p className="mt-0.5 text-base font-semibold tabular-nums text-ink">
                      NPR {totalPrice.toLocaleString()}
                    </p>
                  </div>
                </div>

                <div>
                  <span className="label">Payment method</span>
                  <div className="grid grid-cols-3 gap-1.5">
                    {paymentOptions.map((option) => (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => setPaymentMethod(option.id)}
                        aria-pressed={paymentMethod === option.id}
                        className={`border px-2 py-2.5 text-left transition-colors ${
                          paymentMethod === option.id
                            ? 'border-ink'
                            : 'border-line hover:border-ink/40'
                        }`}
                      >
                        <span className="block text-[12px] font-medium text-ink">
                          {option.name}
                        </span>
                        <span className="text-[10px] text-muted">{option.detail}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {paymentMethod !== 'card' ? (
                  <div>
                    <label htmlFor="wallet-phone" className="label">
                      {paymentMethod === 'khalti'
                        ? 'Khalti mobile number (sample)'
                        : 'eSewa ID (sample)'}
                    </label>
                    <input
                      id="wallet-phone"
                      type="text"
                      value={walletPhone}
                      onChange={(e) => setWalletPhone(e.target.value)}
                      className="input tabular-nums"
                      placeholder="98XXXXXXXX"
                    />
                  </div>
                ) : (
                  <div>
                    <label htmlFor="card-number" className="label">
                      Card number (sample)
                    </label>
                    <input
                      id="card-number"
                      type="text"
                      defaultValue="4242 4242 4242 4242"
                      className="input tabular-nums"
                    />
                  </div>
                )}

                <p className="border-y border-line py-2.5 text-[11px] leading-relaxed text-muted">
                  Demo only. No funds are transferred, no escrow is used, and no refunds are
                  processed.
                </p>
              </div>
            )}

            {step === 'success' && (
              <div>
                <div className="flex items-center gap-2 border-b border-line pb-4">
                  <CheckCircle className="h-5 w-5 text-ok" />
                  <div>
                    <p className="text-sm font-medium text-ink">Demo booking created</p>
                    <p className="text-[11px] text-muted">
                      Reference <span className="tabular-nums">{txRef}</span>
                    </p>
                  </div>
                </div>

                <dl className="mt-4 space-y-2.5 text-[13px]">
                  {[
                    ['Educator', tutor.name],
                    ['Subject', selectedSubject],
                    ['Time', `${selectedDate} at ${selectedTime}`],
                    ['Method', `${paymentMethod} (demo)`],
                  ].map(([label, value]) => (
                    <div key={label} className="flex justify-between gap-4">
                      <dt className="text-muted">{label}</dt>
                      <dd className="text-right text-ink">{value}</dd>
                    </div>
                  ))}
                  <div className="flex justify-between gap-4 border-t border-line pt-2.5">
                    <dt className="text-muted">Demo total</dt>
                    <dd className="font-medium tabular-nums text-ink">
                      NPR {totalPrice.toLocaleString()}
                    </dd>
                  </div>
                </dl>

                <p className="mt-4 text-[11px] text-muted">
                  Nothing was charged. This booking exists only in your browser.
                </p>
              </div>
            )}
          </div>

          <div className="flex flex-col-reverse gap-2 border-t border-line px-5 py-4 sm:flex-row sm:justify-end">
            {step === 'select' && (
              <>
                <button type="button" onClick={handleClose} className="btn btn-outline">
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={!selectedDate || !selectedTime}
                  onClick={handleProceedToPayment}
                  className="btn btn-primary"
                >
                  Continue to checkout
                  <ArrowRight className="h-4 w-4" />
                </button>
              </>
            )}

            {step === 'payment' && (
              <>
                <button
                  type="button"
                  onClick={() => setStep('select')}
                  className="btn btn-outline"
                >
                  Back
                </button>
                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={handleProcessPayment}
                  className="btn btn-primary"
                >
                  {isProcessing
                    ? 'Simulating…'
                    : `Simulate NPR ${totalPrice.toLocaleString()} payment`}
                </button>
              </>
            )}

            {step === 'success' && (
              <>
                <button type="button" onClick={handleClose} className="btn btn-outline">
                  Done
                </button>
                <button type="button" onClick={handleGoToDashboard} className="btn btn-primary">
                  View in dashboard
                  <ArrowRight className="h-4 w-4" />
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingModal;

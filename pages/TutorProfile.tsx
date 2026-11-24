import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, MapPin, ArrowLeft, Heart, CheckCircle2 } from 'lucide-react';
import BookingModal from '../components/BookingModal';
import DemoBadge from '../components/DemoBadge';
import { useApp } from '../context/AppContext';

const TutorProfile: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { tutors, isTutorSaved, toggleSaveTutor, reviews, addReview, currentUser } = useApp();

  const tutor = tutors.find((t) => t.id === id) || tutors[0];
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [messageText, setMessageText] = useState('');
  const [messageSent, setMessageSent] = useState(false);

  const [showReviewForm, setShowReviewForm] = useState(false);
  const [ratingInput, setRatingInput] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewAuthor, setReviewAuthor] = useState(currentUser?.name || 'Alex Johnson');

  const saved = isTutorSaved(tutor.id);
  const tutorReviews = reviews.filter((r) => r.tutorId === tutor.id);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim()) return;
    setMessageSent(true);
    setTimeout(() => {
      setMessageSent(false);
      setMessageText('');
    }, 4000);
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewComment.trim()) return;

    addReview({
      tutorId: tutor.id,
      authorName: reviewAuthor.trim() || 'Demo Student',
      authorAvatar:
        currentUser?.avatar ||
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      rating: ratingInput,
      comment: reviewComment.trim(),
    });

    setReviewComment('');
    setShowReviewForm(false);
  };

  return (
    <div className="page pb-20">
      <div className="container-page pt-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-[13px] text-muted hover:text-ink"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to tutors
        </button>

        <div className="mt-8 grid gap-12 lg:grid-cols-[minmax(0,1fr)_280px] lg:gap-16">
          <div className="min-w-0">
            <header className="flex flex-col gap-5 border-b border-line pb-8 sm:flex-row sm:items-start">
              <img
                src={tutor.avatar}
                alt=""
                className="h-20 w-20 flex-shrink-0 rounded-[2px] object-cover"
              />

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-[2rem] font-semibold leading-tight tracking-[-0.03em]">
                    {tutor.name}
                  </h1>
                  <DemoBadge label="Demo profile" />
                </div>

                <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[13px] text-muted">
                  <span className="flex items-center gap-1">
                    <Star className="h-3.5 w-3.5" />
                    <span className="tabular-nums text-ink">{tutor.rating.toFixed(1)}</span>
                    <span>({tutor.reviewCount + tutorReviews.length} reviews)</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" />
                    {tutor.location}
                  </span>
                  <span>{tutor.experience} experience</span>
                  <span className="flex items-center gap-1.5">
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        tutor.availability === 'Available' ? 'bg-ok' : 'bg-line'
                      }`}
                      aria-hidden="true"
                    />
                    {tutor.availability}
                  </span>
                </div>

                <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                  <p className="text-[13px] text-muted">
                    {tutor.subjects.join(' · ')}
                  </p>
                  <button
                    onClick={() => toggleSaveTutor(tutor.id)}
                    aria-pressed={saved}
                    className={`flex items-center gap-1.5 text-[13px] transition-colors ${
                      saved ? 'text-accent' : 'text-muted hover:text-ink'
                    }`}
                  >
                    <Heart className={`h-3.5 w-3.5 ${saved ? 'fill-current' : ''}`} />
                    {saved ? 'Saved' : 'Save'}
                  </button>
                </div>
              </div>
            </header>

            <section className="border-b border-line py-8">
              <h2 className="text-[14px] font-semibold text-ink">
                About
              </h2>
              <p className="mt-3 max-w-[65ch] text-[15px] leading-[1.75] text-ink">
                {tutor.bio}
              </p>
            </section>

            <section className="border-b border-line py-8">
              <h2 className="text-[14px] font-semibold text-ink">
                Levels covered
              </h2>
              <p className="mt-3 text-sm text-ink">{tutor.gradeLevels.join(', ')}</p>
            </section>

            <section className="border-b border-line py-8">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="text-[14px] font-semibold text-ink">
                    Student reviews
                  </h2>
                  <DemoBadge label="Demo reviews" />
                </div>
                <button
                  onClick={() => setShowReviewForm(!showReviewForm)}
                  className="text-[13px] text-muted hover:text-ink"
                >
                  {showReviewForm ? 'Cancel' : 'Write a review'}
                </button>
              </div>

              {showReviewForm && (
                <form onSubmit={handleReviewSubmit} className="mt-6 border-y border-line py-5">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="label" htmlFor="review-name">
                        Your name
                      </label>
                      <input
                        id="review-name"
                        type="text"
                        value={reviewAuthor}
                        onChange={(e) => setReviewAuthor(e.target.value)}
                        className="input"
                      />
                    </div>

                    <div>
                      <span className="label">Rating</span>
                      <div className="flex h-10 items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(0)}
                            onClick={() => setRatingInput(star)}
                            aria-label={`${star} star${star === 1 ? '' : 's'}`}
                            className="p-0.5 text-muted transition-colors hover:text-ink"
                          >
                            <Star
                              className={`h-4 w-4 ${
                                (hoverRating || ratingInput) >= star
                                  ? 'fill-ink text-ink'
                                  : 'text-muted'
                              }`}
                            />
                          </button>
                        ))}
                        <span className="ml-2 text-[12px] tabular-nums text-muted">
                          {ratingInput}.0
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="label" htmlFor="review-comment">
                      Review
                    </label>
                    <textarea
                      id="review-comment"
                      rows={3}
                      required
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      placeholder="What was the lesson like?"
                      className="textarea"
                    />
                  </div>

                  <div className="mt-3 flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setShowReviewForm(false)}
                      className="btn btn-quiet"
                    >
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary btn-sm">
                      Publish review
                    </button>
                  </div>
                </form>
              )}

              <div className="mt-5">
                {tutorReviews.length === 0 ? (
                  <p className="py-4 text-[13px] text-muted">
                    No demo reviews yet. Add one to try the flow.
                  </p>
                ) : (
                  tutorReviews.map((rev) => (
                    <article key={rev.id} className="border-t border-line py-4 first:border-t-0">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={rev.authorAvatar}
                            alt=""
                            className="h-6 w-6 rounded-full object-cover"
                          />
                          <div>
                            <span className="block text-[13px] font-medium text-ink">
                              {rev.authorName}
                            </span>
                            <span className="text-[11px] text-muted">{rev.date}</span>
                          </div>
                        </div>
                        <span className="flex items-center gap-1 text-[12px] tabular-nums text-muted">
                          <Star className="h-3 w-3 fill-current" />
                          {rev.rating.toFixed(1)}
                        </span>
                      </div>
                      <p className="mt-3 max-w-[65ch] text-[13px] leading-relaxed text-muted">
                        {rev.comment}
                      </p>
                    </article>
                  ))
                )}
              </div>
            </section>

            <section className="py-8">
              <h2 className="text-[14px] font-semibold text-ink">
                Send an inquiry
              </h2>
              <p className="mt-2 text-[13px] text-muted">
                Ask about syllabus coverage or schedule before booking.
              </p>

              {messageSent ? (
                <div className="mt-4 flex items-start gap-2 border-y border-line py-4 text-[13px] text-ink">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-ok" />
                  Demo inquiry saved in your browser. Nothing was sent to {tutor.name}.
                </div>
              ) : (
                <form onSubmit={handleSendMessage} className="mt-4">
                  <label className="sr-only" htmlFor="inquiry">
                    Message
                  </label>
                  <textarea
                    id="inquiry"
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    className="textarea"
                    rows={3}
                    placeholder={`Write a message to ${tutor.name}`}
                    required
                  />
                  <div className="mt-3">
                    <button type="submit" className="btn btn-primary btn-sm">
                      Send inquiry
                    </button>
                  </div>
                </form>
              )}
            </section>
          </div>

          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="border-y border-line py-6">
              <div className="text-[14px] font-semibold text-ink">
                Hourly rate
              </div>
              <div className="mt-2 text-[2rem] font-semibold leading-none tracking-[-0.02em] tabular-nums">
                NPR {tutor.price.toLocaleString()}
              </div>
              <div className="mt-1 text-[12px] text-muted">per 60-minute session</div>

              <ul className="mt-6 space-y-2 border-t border-line pt-5 text-[13px] text-muted">
                <li>Live one-to-one video classroom</li>
                <li>Shared whiteboard and notes</li>
                <li>Demo booking, no charge</li>
              </ul>

              <button
                onClick={() => setIsBookingOpen(true)}
                className="btn btn-primary mt-6 w-full"
              >
                Book a session
              </button>

              <p className="mt-3 text-[11px] leading-relaxed text-muted">
                Demo checkout only. No payment is processed.
              </p>
            </div>
          </aside>
        </div>
      </div>

      <BookingModal
        tutor={tutor}
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
      />
    </div>
  );
};

export default TutorProfile;

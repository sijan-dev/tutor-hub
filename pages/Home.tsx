import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Star, Heart } from 'lucide-react';
import { POPULAR_SUBJECTS } from '../constants';
import DemoBadge from '../components/DemoBadge';
import { useApp } from '../context/AppContext';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { tutors, isTutorSaved, toggleSaveTutor } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState(5000);
  const [selectedSubject, setSelectedSubject] = useState('All subjects');
  const [selectedLevel, setSelectedLevel] = useState('All levels');
  const [minRating, setMinRating] = useState(0);

  const filteredTutors = useMemo(() => {
    return tutors.filter((tutor) => {
      const query = searchTerm.toLowerCase().trim();
      const matchesSearch =
        !query ||
        tutor.name.toLowerCase().includes(query) ||
        tutor.bio.toLowerCase().includes(query) ||
        tutor.subjects.some((s) => s.toLowerCase().includes(query));

      const matchesSubject =
        selectedSubject === 'All subjects' ||
        tutor.subjects.some((s) => s.toLowerCase() === selectedSubject.toLowerCase());

      const matchesLevel =
        selectedLevel === 'All levels' ||
        (tutor.gradeLevels && tutor.gradeLevels.includes(selectedLevel));

      const matchesPrice = tutor.price <= priceRange;
      const matchesRating = tutor.rating >= minRating;

      return matchesSearch && matchesSubject && matchesLevel && matchesPrice && matchesRating;
    });
  }, [tutors, searchTerm, selectedSubject, selectedLevel, priceRange, minRating]);

  const handleClearFilters = () => {
    setSelectedSubject('All subjects');
    setSelectedLevel('All levels');
    setPriceRange(5000);
    setMinRating(0);
    setSearchTerm('');
  };

  const filtersActive =
    searchTerm !== '' ||
    selectedSubject !== 'All subjects' ||
    selectedLevel !== 'All levels' ||
    priceRange !== 5000 ||
    minRating !== 0;

  return (
    <div className="page pb-20">
      <header className="container-page pt-12 sm:pt-16">
        <div className="max-w-2xl">
          <h1 className="text-[2.25rem] font-semibold leading-[1.1] tracking-[-0.03em] sm:text-[2.75rem]">
            Find a tutor.
          </h1>
          <p className="mt-3 text-[15px] leading-relaxed text-muted">
            Compare educators by subject, level, rate, and rating. Every profile is sample
            data you can explore end to end.
          </p>
        </div>

        <div className="mt-8 flex items-center gap-3 border-b border-line pb-2 focus-within:border-ink">
          <Search className="h-4 w-4 flex-shrink-0 text-muted" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name, subject, or keyword"
            className="h-9 w-full bg-transparent text-sm text-ink placeholder:text-muted/80 focus:outline-none"
            aria-label="Search tutors"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="text-[12px] text-muted hover:text-ink"
            >
              Clear
            </button>
          )}
        </div>

        <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2">
          {['All subjects', ...POPULAR_SUBJECTS.map((s) => s.name)].map((subject) => (
            <button
              key={subject}
              onClick={() => setSelectedSubject(subject)}
              className={`pb-1 text-[13px] transition-colors ${
                selectedSubject === subject
                  ? 'border-b border-ink font-medium text-ink'
                  : 'text-muted hover:text-ink'
              }`}
            >
              {subject}
            </button>
          ))}
        </div>
      </header>

      <div className="container-page mt-12 flex flex-col gap-10 lg:flex-row lg:gap-14">
        <aside className="w-full flex-shrink-0 lg:w-56">
          <div className="flex items-center justify-between border-b border-line pb-2">
            <h2 className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">
              Filters
            </h2>
            <button
              onClick={handleClearFilters}
              disabled={!filtersActive}
              className="text-[12px] text-muted hover:text-ink disabled:cursor-default disabled:opacity-40"
            >
              Reset
            </button>
          </div>

          <div className="mt-5 space-y-5">
            <div>
              <label htmlFor="filter-subject" className="label">
                Subject
              </label>
              <select
                id="filter-subject"
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="select"
              >
                <option value="All subjects">All subjects</option>
                {POPULAR_SUBJECTS.map((s) => (
                  <option key={s.id} value={s.name}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="filter-level" className="label">
                Level
              </label>
              <select
                id="filter-level"
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="select"
              >
                <option value="All levels">All levels</option>
                <option value="Elementary">Elementary</option>
                <option value="Middle School">Middle School</option>
                <option value="High School">High School</option>
                <option value="College">College</option>
              </select>
            </div>

            <div>
              <div className="mb-1.5 flex items-baseline justify-between">
                <label htmlFor="filter-price" className="label mb-0">
                  Max rate
                </label>
                <span className="text-[12px] tabular-nums text-muted">
                  NPR {priceRange.toLocaleString()}
                </span>
              </div>
              <input
                id="filter-price"
                type="range"
                min={500}
                max={5000}
                step={100}
                value={priceRange}
                onChange={(e) => setPriceRange(Number(e.target.value))}
                className="w-full cursor-pointer"
              />
              <div className="mt-1 flex justify-between text-[10px] tabular-nums text-muted/80">
                <span>500</span>
                <span>5,000</span>
              </div>
            </div>

            <div>
              <label htmlFor="filter-rating" className="label">
                Minimum rating
              </label>
              <select
                id="filter-rating"
                value={minRating}
                onChange={(e) => setMinRating(Number(e.target.value))}
                className="select"
              >
                <option value={0}>Any rating</option>
                <option value={4}>4.0 and up</option>
                <option value={4.5}>4.5 and up</option>
                <option value={4.8}>4.8 and up</option>
              </select>
            </div>
          </div>

          <p className="mt-8 border-t border-line pt-4 text-[11px] leading-relaxed text-muted">
            Profiles, availability, and reviews are sample data for this build.
          </p>
        </aside>

        <section className="min-w-0 flex-1" aria-live="polite">
          <div className="mb-1 flex flex-wrap items-center gap-3">
            <h2 className="text-lg font-semibold tracking-[-0.01em]">
              {filteredTutors.length} {filteredTutors.length === 1 ? 'tutor' : 'tutors'}
            </h2>
            <DemoBadge label="Demo catalog" />
          </div>

          {filteredTutors.length === 0 ? (
            <div className="mt-6 border-t border-line py-16 text-center">
              <p className="text-sm font-medium text-ink">No tutors match these filters.</p>
              <p className="mt-1 text-[13px] text-muted">
                Widen the rate or rating range, or search a different subject.
              </p>
              <button
                onClick={handleClearFilters}
                className="btn btn-outline btn-sm mt-5"
              >
                Reset filters
              </button>
            </div>
          ) : (
            <div className="mt-5 border-b border-line">
              {filteredTutors.map((tutor) => {
                const saved = isTutorSaved(tutor.id);

                return (
                  <article
                    key={tutor.id}
                    className="grid gap-5 border-t border-line py-6 sm:grid-cols-[auto_1fr_auto] sm:gap-6"
                  >
                    <div className="flex items-start gap-4 sm:block">
                      <img
                        src={tutor.avatar}
                        alt=""
                        className="h-16 w-16 flex-shrink-0 rounded-[2px] object-cover"
                      />
                      <div className="sm:mt-2">
                        <span className="flex items-center gap-1.5 text-[11px] text-muted">
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${
                              tutor.availability === 'Available' ? 'bg-ok' : 'bg-line'
                            }`}
                            aria-hidden="true"
                          />
                          {tutor.availability}
                        </span>
                      </div>
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="text-lg font-semibold tracking-[-0.01em] text-ink">
                            <button
                              onClick={() => navigate(`/tutor/${tutor.id}`)}
                              className="text-left hover:underline hover:decoration-line hover:underline-offset-4"
                            >
                              {tutor.name}
                            </button>
                          </h3>
                          <p className="mt-1 text-[13px] text-muted">
                            {tutor.subjects.join(' · ')}
                          </p>
                        </div>

                        <button
                          onClick={() => toggleSaveTutor(tutor.id)}
                          aria-pressed={saved}
                          aria-label={saved ? 'Remove from saved tutors' : 'Save tutor'}
                          className={`flex-shrink-0 p-1 transition-colors ${
                            saved ? 'text-accent' : 'text-muted hover:text-ink'
                          }`}
                        >
                          <Heart className={`h-4 w-4 ${saved ? 'fill-current' : ''}`} />
                        </button>
                      </div>

                      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-[12px] text-muted">
                        <span className="flex items-center gap-1">
                          <Star className="h-3.5 w-3.5" />
                          <span className="tabular-nums text-ink">{tutor.rating.toFixed(1)}</span>
                          <span>({tutor.reviewCount} reviews)</span>
                        </span>
                        <span>{tutor.experience} experience</span>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5" />
                          {tutor.location}
                        </span>
                      </div>

                      <p className="mt-3 line-clamp-2 max-w-prose text-[13px] leading-relaxed text-muted">
                        {tutor.bio}
                      </p>

                      <p className="mt-2 text-[12px] text-muted">
                        Levels: <span className="text-ink">{tutor.gradeLevels.join(', ')}</span>
                      </p>
                    </div>

                    <div className="flex items-end justify-between gap-4 sm:flex-col sm:items-end sm:justify-between">
                      <div className="sm:text-right">
                        <div className="text-base font-semibold tabular-nums text-ink">
                          NPR {tutor.price.toLocaleString()}
                        </div>
                        <div className="text-[11px] text-muted">per hour</div>
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => navigate(`/tutor/${tutor.id}`)}
                          className="btn btn-primary btn-sm"
                        >
                          Book
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Home;

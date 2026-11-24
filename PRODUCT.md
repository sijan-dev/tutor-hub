# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary: high-school and college students in Nepal who want personalized 1-on-1 help in subjects such as mathematics, science, English, and computer science.

Secondary: Nepal-based tutors and educators who publish a profile, set availability and hourly rates, manage bookings, and teach live sessions.

## Product Purpose

Tutor Hub is an online tutoring marketplace that connects students with verified local tutors for personalized learning. Students discover tutors by subject, price, rating, and availability, book sessions, and attend live 1-on-1 classes. Tutors manage their schedule, inquiries, and earnings from a dedicated dashboard.

Success means a student can find the right tutor and complete a useful live session, and a tutor can fill their schedule without administrative overhead.

## Positioning

The product pairs a live classroom workspace — shared whiteboard, camera feeds, screen sharing, and a study assistant — with a marketplace for finding local tutors. A conventional tutor marketplace could not truthfully claim both as its core.

## Operating Context

- Built for the Nepali market: tutor locations across Kathmandu, Lalitpur, Pokhara, and Bhaktapur; hourly prices shown in NPR.
- Khalti and eSewa checkout UI is implemented in the current build; payment settlement is not.
- Core workflows: browse and filter tutors, view a tutor profile and reviews, book a session, attend a live classroom, review upcoming and past sessions, save mentors, manage tutor availability and inquiries, and read the platform knowledge center.
- The interface includes a global study assistant widget, in-app notifications, and a dark/light theme toggle.

## Capabilities and Constraints

Implemented today:

- Tutor discovery with subject, price, rating, availability, and search filters.
- Tutor profiles with ratings, reviews, bio, subjects, grade levels, and booking.
- Booking flow with date, time, duration, and total price.
- Student dashboard with upcoming/completed sessions, saved mentors, and recent chats.
- Tutor dashboard with confirmed schedule, pending inquiries, direct messages, and a weekly performance chart.
- Live classroom with a canvas whiteboard, camera feeds, screen sharing, and a scripted study assistant.
- Global study assistant, notifications, and theme toggle.
- Mock authentication and registration with role selection for student or tutor.

Constraints:

- The build is an early real product, not a finished production system. Tutor profiles, sessions, reviews, and notifications come from mock data in `constants.ts` and an in-memory Express API in `server/index.ts`.
- User, session, and preference state persists in browser `localStorage`; there is no production database, real authentication, or settled payment flow yet.
- Real tutor verification, payment settlement, and production deployment are not built.

Undecided:

- Whether local payments (Khalti/eSewa) are a committed differentiator or simply a present feature.
- The tutor verification standard and process.
- Production deployment target and data migration plan.

## Brand Commitments

- Existing name: Tutor Hub.
- Voice: plain, direct, and student-facing. No gamified phrasing or emoji in the interface.
- Nepal-first framing is part of the existing identity.

## Evidence on Hand

- Mock tutor profiles, reviews, sessions, and notifications in `constants.ts` and `server/index.ts`, including placeholder avatar URLs.
- No real customers, testimonials, press, benchmark data, or verified tutor credentials exist yet.
- Marketing claims in the earlier build — "Nepal's first 3D live whiteboard classroom", "Top 1% Educators", "100% Verified Tutors", and specific review counts — were unverified copy and have been removed. Future work must not treat them as evidence or repeat them as fact.

## Product Principles

1. **Learning happens live.** The classroom — whiteboard, webcam, screen share — is the product, not an add-on to a listings page.
2. **Help is always within reach.** The study assistant supports students during and between sessions.
3. **Local by default.** Nepal-based tutors, NPR pricing, and local payment habits shape product decisions.
4. **Trust is earned through verification.** Credentials and honest availability matter more than marketplace volume.
5. **Demo data never masquerades as proof.** Mock profiles, reviews, and metrics stay clearly demo until replaced with real data.

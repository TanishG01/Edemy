# Project Walkthrough Video Script — Edemy LMS

**Target length:** 5–7 minutes  
**Project:** Edemy — Learning Management System  
**Suggested recording style:** Speak naturally and use the screen cues in brackets as prompts. Do not read the file names aloud unless you are showing the code.

## Opening — 10 seconds

Hello, I’m going to walk through my project, **Edemy**, a full-stack Learning Management System.

The platform supports two roles: students, who discover and complete courses, and educators, who create courses and monitor their learners. I’ll cover the problem, the technology choices, my implementation, the main technical challenge, and how I solved it.

## 1. The Problem — 45–60 seconds

The problem I wanted to solve was that online learning needs more than a page that displays videos. A useful learning platform must connect the complete learning lifecycle:

1. An educator needs to create structured course content.
2. A student needs to discover courses and understand what is included.
3. The student needs a reliable way to purchase and access the course.
4. The platform needs to remember learning progress and support ratings.
5. The educator needs visibility into courses, students, and earnings.

Edemy brings these workflows together in one application. A student can browse published courses, search the course list, open course details, preview free lectures, purchase a course, watch it in the player, mark lectures as complete, and rate the course after enrollment.

On the educator side, an educator can create chapters and lectures, add a rich course description, upload a thumbnail, publish a course, and view dashboard information such as total courses, earnings, and enrolled students.

The main goal was to build a realistic product flow rather than only a static course catalog.

**[Screen cue: Show the home page, course list, and educator dashboard briefly.]**

## 2. Tech Stack and Why I Chose It — 60–75 seconds

The frontend is built with **React** and **Vite**. React fits the project because the UI is made of reusable, state-driven components: navigation bars, course cards, course detail sections, player panels, forms, and dashboard widgets. Vite provides a fast development server and build process.

I used **React Router** for navigation between the home page, course list, course details, enrollments, player, and nested educator pages. The shared application state is handled through **AppContext**, which contains course data, user data, enrollment data, navigation helpers, and common course calculations.

The backend uses **Node.js** and **Express**. Express keeps the API easy to organize into separate course, user, educator, and webhook routes. The backend communicates with the frontend using REST endpoints and Axios.

For persistence, I used **MongoDB with Mongoose**. A course naturally contains nested chapters and lectures, so a document model is a good fit. Chapters and lectures are embedded inside the course, while purchases and course progress are separate collections because they are transactional and user-specific.

For authentication, I used **Clerk**. Clerk manages identity and sessions, while the backend uses the Clerk user ID as the MongoDB user ID. Educator access is controlled using Clerk public metadata.

For payments, I used **Stripe Checkout and webhooks**. For media, course thumbnails are uploaded to **Cloudinary**. Educators use **Quill** for rich-text course descriptions, and Tailwind CSS is used for responsive styling.

I chose managed services for authentication, payments, and media because those areas have security and reliability requirements that are better handled by specialized services, allowing the application code to focus on learning functionality.

## 3. Individual Contribution — 45–60 seconds

This was a full-stack implementation, so I worked across both the React client and the Express server.

On the frontend, I implemented the student experience: the home page, course listing and search flow, course details, enrollment view, course player, lecture progress updates, and course ratings. I also implemented the educator screens for the dashboard, adding courses, viewing owned courses, and viewing enrolled students.

On the backend, I worked on the Express application setup, CORS configuration, route organization, authentication-aware controllers, and the Mongoose models for users, courses, purchases, and course progress.

The main feature areas I owned were:

- Course discovery and course detail APIs.
- Educator course creation with nested chapters and lectures.
- Thumbnail upload through Multer and Cloudinary.
- Stripe purchase-session creation and payment webhook handling.
- Lecture progress tracking and course ratings.
- Educator dashboard data, including earnings and enrolled students.

**[If this was a group project: replace the previous two paragraphs with the exact modules you personally owned. Do not claim ownership of features built by teammates.]**

## 4. The Challenge — 40–50 seconds

The hardest part was coordinating a purchase across the frontend, backend, Stripe, and MongoDB without treating a checkout session as proof of payment.

The purchase flow crosses several systems. The student starts from the course page, the backend creates a pending purchase, Stripe creates a hosted checkout session, and only after Stripe sends a successful payment webhook should the application enroll the student.

There were also related consistency concerns: the user must receive the course, the course must record the enrolled student, and the purchase must move from pending to completed. A simple frontend redirect is not enough because a redirect can happen without a confirmed payment.

A second challenge was protecting course content. Public course details should expose enough information for previews, but paid lecture URLs should not be made freely available before enrollment.

## 5. The Solution — 60–75 seconds

I solved the payment problem by making the backend the source of truth for enrollment.

When a student clicks purchase, the backend verifies the user and course, calculates the discounted amount, creates a purchase with a `pending` status, and creates a Stripe Checkout session. The student is then redirected to Stripe’s hosted payment page.

Stripe sends the payment result to the backend through a signed webhook. The webhook verifies the signature. If the payment succeeds, the backend marks the purchase as `completed`, adds the course to the user’s enrolled courses, and adds the user to the course’s enrolled students. If the payment fails, the purchase is marked as `failed`.

For access control, Clerk provides the authenticated user ID through the request context. Educator routes use middleware that checks the user’s Clerk role metadata before allowing course creation or dashboard requests.

For preview protection, the course-details endpoint removes the lecture URL for lectures that are not marked as free previews. Enrolled students can then access their course through the player flow.

Progress is stored separately in `CourseProgress`. When a lecture is completed, the backend adds the lecture ID to the student’s completed-lecture list. The player reads that data to display progress and completed-lecture indicators. Ratings are also validated on the backend, including checking that the user is enrolled before adding or updating a rating.

**[Screen cue: Show the course detail preview, the educator add-course form, and the player/progress UI. If live Stripe webhooks are not configured, explain the flow rather than attempting a real payment.]**

## 6. Most Technically Complex Problem Beyond This Project — 45–75 seconds

**Customize this section with a real example from your career or studies before recording. Do not present the placeholder as your own experience.**

The most technically complex problem I have worked on beyond this project was **[name the project or problem]**.

What made it complex was **[scale, ambiguous requirements, performance constraints, concurrency, unfamiliar technology, or integration risk]**. The difficult part was not just writing the feature; it was deciding what the system needed to guarantee and how to verify that it continued to work under real conditions.

I approached it by first breaking the problem into smaller responsibilities and defining the inputs, outputs, and failure cases. Then I created a simple working version, measured or tested the risky parts, and used those results to guide the implementation. I also documented the tradeoffs so that the solution could be maintained by someone else.

The main lesson I took from that experience was **[state the lesson]**. It changed how I approach technical work: I now identify the highest-risk boundary early, validate assumptions with evidence, and keep the design as simple as possible while still meeting the requirements.

## Closing — 10–15 seconds

That is the overview of Edemy. It is a full-stack LMS that combines course management, authentication, payment confirmation, media uploads, learning progress, ratings, and educator reporting in one product flow.

Thank you for watching.

## Recording Checklist

- Keep the final video between **5 and 7 minutes**.
- Show the student journey first, then the educator journey.
- Mention the payment webhook as the source of truth for enrollment.
- Avoid showing `.env` files, API keys, webhook secrets, or other credentials.
- Replace the Section 6 placeholders with a genuine personal example.
- If the project was collaborative, replace Section 3 with precise personal ownership.
- Upload the video to Google Drive and verify that the shareable link works before submitting it.

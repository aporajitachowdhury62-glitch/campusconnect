# 🎓 CampusConnect — Hyperlocal Student & Shopkeeper Platform

> **Connecting college students seeking flexible part-time gigs with neighborhood shopkeepers (retail, food vendors, services) who need reliable hands.**

CampusConnect is a modern, hyperlocal marketplace designed to bridge the student employment gap around college campuses. Students discover part-time roles that fit their academic schedules, while local shopkeepers quickly find energetic talent within walking or transit distance.

---

## 🚀 Key Modules & Capabilities

### 1. ⭐ Platform-Wide Two-Sided Rating System (Students ↔ Shopkeepers)
* **Bidirectional Trust**: Every completed work engagement generates two independent ratings — the student rates the employer, and the employer rates the student (similar to Upwork / Uber).
* **Engagement-Gated**: Ratings unlock only after a work engagement is marked completed, preventing fake or pre-emptive reviews.
* **Role-Specific Endorsement Tags**:
  * **Shopkeeper rating a Student**: *Punctual & On Time, Quick Learner, Polite to Customers, Hardworking, Reliable, Followed Instructions, Tech Savvy, Great Team Player*.
  * **Student rating a Shopkeeper**: *Paid on Time, Respectful & Friendly, Clear Instructions, Safe Work Environment, Accurate Hours, Free Snacks / Meals, Flexible Shifts, Great Communication*.
* **Trust & Reliability Stats (`RatingSummary`)**:
  * Overall average rating score with interactive/read-only `StarRating`.
  * **"Top Rated Employer" / "Top Talent"** gold badges (unlocked at 4.5+ ★ with 5+ ratings).
  * Visual 5★-to-1★ distribution breakdown progress bars with percentage counts.
  * Top endorsed tags counter badges.
* **"My Ratings & Gigs" Dashboard Tab**:
  * Manage active and completed shifts with one-click **"Mark as Complete & Rate"**.
  * View received feedback and given review history.
  * **Pending Ratings Banner** notifying users of completed gigs awaiting their feedback.

---

### 2. 🛡️ Restaurant & Food Vendor QA (Quality Assurance) Verification
* **Process-Level Safety Checks**: Specialized verification badges for food businesses before students apply or work in kitchens.
* **Badges Displayed**: `Verified` (Green Shield), `Pending Verification` (Amber Clock), `Rejected` (Red Alert), `Unverified` (Gray).
* **QA Checklist Inspection (`VendorQADetailModal`)**:
  * FSSAI License Number (e.g. `#11524012000849`) & central registry status.
  * Hygiene & Kitchen Cleanliness Audit report.
  * GSTIN / Municipal Trade License.
  * Owner Phone & Aadhaar OTP Contact Verification.
  * Timestamp of last safety audit review.
* **Admin Verification Portal (`AdminQAPanel`)**:
  * Inspect submitted vendor documents, toggle individual document verifications, inspect student incident flags, and issue verified badges in real time.

---

### 3. 📨 Connection Request Status Tracker (WhatsApp-Style Delivery Ticks)
* **Real-Time Delivery Lifecycle**:
  * `sent` — Single gray tick (`Check`): Application has left the student's side.
  * `seen` — Double gray tick (`CheckCheck`): Employer has opened and viewed the application.
  * `accepted` — Green check (`CheckCircle2` / "Accepted"): Employer approved the connection.
  * `rejected` — Red cross (`XCircle` / "Declined"): Employer filled the position or declined.
  * `expired` — Clock icon ("Expired"): Request timed out.
* **"My Applications" Student View (`MyRequestsTable`)**:
  * Live status table with search, status filtering, and details modal.
  * **Live Polling Engine**: Polls every 5 seconds with live pulse sync indicator, manual refresh, and pause/resume controls.
* **Employer Inbox (`EmployerInbox`)**:
  * Incoming student applications list.
  * **Auto-marks requests as `seen`** as soon as the shopkeeper expands the request.
  * One-click **Accept** and **Decline** action buttons with custom notes to student.
* **Instant Application Flow**:
  * Clicking "Connect & Apply" on any listing card dispatches a live `ConnectionRequest` directly into the tracking engine.

---

### 4. 🚶 Student Registration (`/student-signup`)
* **Transit / Route Stop Motif**: Visual 3-stop progress bar:
  * **Stop 1 (Identity & Education)**: Full Name, Age (validated 15–30), Qualification, and College Name.
  * **Stop 2 (Hyperlocal Zone & Work Preferences)**: Locality, City, State, Work Type, and Shift Pills (`Morning`, `Afternoon`, `Evening`, `Weekends only`).
  * **Stop 3 (Availability & Skills)**: Interactive `TagInput` with keyboard shortcuts, 7-day selector grid with shortcuts (*Weekdays*, *Weekends*, *All*), and Hours/day slider.
* **⚡ Live Hours Calculation**: Automatically computes `Days × Hours/Day = Total Weekly Commitment (hrs/week)`.

---

### 5. 🏪 Shopkeeper Registration (`/shopkeeper-signup`)
* **Fast & Mobile-Friendly**: Single-scroll registration for busy store owners.
* **Fields Collected**: Business Name, Owner Name, Category (`Kirana`, `Electronics`, `Clothing`, `Food/restaurant`, `Stationery`, `Pharmacy`, `Salon`, `Other`), Locality, Help Needed, Required Skills, Schedule needed, Contact Phone, and Pay Estimate.

---

### 6. 🔍 Hyperlocal Discovery Dashboard (`/dashboard`)
* **Dual Role Switcher**:
  * 🎒 **Student View**: Browse Gigs, Track Applications (Delivery Ticks), and Manage Ratings & Engagements.
  * 🛒 **Shopkeeper View**: Browse Talent Pool, Applicant Inbox, Shop Ratings & Engagements, and Restaurant QA Hub.
* **Demo Persona Switcher**: Switch between students (*Aarav Sharma*, *Priya Nambiar*) and shopkeepers (*Subhash Rao*, *Tanvi Saxena*, *Harish Mehta*) to test the live bidirectional rating and status tracking flows.

---

## 🎨 Visual Identity & Design System

* **Warm Paper Background**: `#FAF7F2` with subtle dot grid pattern for an artisanal neighborhood feel.
* **Marigold / Amber Accent**: `#D97706` / `#F59E0B` for student identity and primary actions.
* **Deep Teal Accent**: `#0F766E` / `#115E59` for shopkeeper portal and verified states.
* **Ink-Navy Text**: `#0F172A` / `#334155` for high contrast and legibility.
* **Typography**: **Space Grotesk** for modern bold headings and **Inter** for crisp body text.
* **Mobile-Responsive**: Designed mobile-first with touch-friendly tap targets and collapsible drawer navigation.

---

## 🛠️ Tech Stack & Service Layer

* **Frontend**: [React 18](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
* **Build Tool**: [Vite 6](https://vitejs.dev/)
* **Styling**: [Tailwind CSS 3](https://tailwindcss.com/)
* **Routing**: [React Router DOM v6](https://reactrouter.com/)
* **Icons**: [Lucide React](https://lucide.dev/)
* **State Management**: Reactive Context (`AppContext.tsx`) + LocalStorage-backed API Services.
* **FastAPI Drop-in Service Layer**:
  * `src/services/ratingService.ts`: `POST /engagements/{id}/rate`, `GET /users/{id}/ratings`, `GET /users/{id}/ratings/summary`, `GET /engagements/pending-ratings`.
  * `src/services/connectionService.ts`: `POST /api/v1/applications`, `GET /api/v1/applications/student/{id}`, `GET /api/v1/applications/employer/{id}`, `PATCH /api/v1/applications/{id}/status`.
  * `src/services/vendorService.ts`: `GET /api/v1/vendors/{id}/qa`, `POST /api/v1/vendors/{id}/reviews`, `PATCH /api/v1/vendors/{id}/qa-status`.

---

## 📁 Directory Structure

```
Campus_Connect/
├── README.md
└── frontend/
    ├── package.json
    ├── tsconfig.json
    ├── vite.config.ts
    ├── tailwind.config.js
    ├── postcss.config.js
    ├── index.html
    └── src/
        ├── main.tsx
        ├── App.tsx
        ├── index.css
        ├── types/
        │   ├── index.ts                # Unified type exports
        │   ├── rating.ts               # Two-sided ratings & engagements
        │   ├── connection.ts           # Status tracker & applications
        │   └── qaQc.ts                 # Restaurant QA & safety models
        ├── services/
        │   ├── ratingService.ts        # Ratings & engagements API layer
        │   ├── connectionService.ts    # Application delivery tracking layer
        │   └── vendorService.ts        # Restaurant QA/QC API layer
        ├── context/
        │   └── AppContext.tsx          # Shared application store & counters
        ├── data/
        │   └── mockData.ts             # Realistic seed data, ratings & gigs
        ├── components/
        │   ├── common/
        │   │   ├── Navbar.tsx          # Responsive navigation & counters
        │   │   ├── TagInput.tsx        # Multi-tag chips input
        │   │   ├── MultiSelectPills.tsx# Shift selection pills
        │   │   ├── DayPicker.tsx       # 7-day grid selector
        │   │   └── Modal.tsx           # Accessible modal dialog
        │   ├── rating/
        │   │   ├── StarRating.tsx      # Reusable star rating component
        │   │   ├── RatingModal.tsx     # Post-engagement rating modal
        │   │   ├── RatingSummary.tsx   # Score, distribution bars & tags
        │   │   ├── RatingsList.tsx      # Verified reviews feed with filters
        │   │   ├── PendingRatingsBanner.tsx # Dashboard pending rating nudge
        │   │   ├── MyRatingsView.tsx   # "My Ratings & Gigs" tab view
        │   │   └── UserProfileRatingModal.tsx # Full profile reviews dialog
        │   ├── qaqc/
        │   │   ├── VendorQABadge.tsx   # Color-coded QA status badge
        │   │   ├── VendorQCRating.tsx  # QC rating chip
        │   │   ├── VendorQADetailModal.tsx # Full QA checklist modal
        │   │   ├── ReviewForm.tsx      # Student QC review form
        │   │   ├── ReviewList.tsx      # Review list with flag feature
        │   │   └── AdminQAPanel.tsx    # Admin QA document verification
        │   ├── tracker/
        │   │   ├── RequestStatusBadge.tsx # WhatsApp-style delivery ticks
        │   │   ├── MyRequestsTable.tsx # Live student application tracker
        │   │   └── EmployerInbox.tsx   # Shopkeeper applicant manager
        │   ├── student/
        │   │   ├── RouteProgressBar.tsx# Transit route progress bar
        │   │   ├── StudentForm.tsx     # 3-stop student registration
        │   │   └── StudentCard.tsx     # Student profile card with rating
        │   ├── shopkeeper/
        │   │   ├── ShopkeeperForm.tsx  # Shopkeeper gig posting form
        │   │   └── ListingCard.tsx     # Gig listing card with QA & rating
        │   └── dashboard/
        │       ├── FilterBar.tsx       # Search & multi-filter controls
        │       └── EmptyState.tsx      # Zero results fallback
        └── pages/
            ├── StudentSignupPage.tsx   # /student-signup
            ├── ShopkeeperSignupPage.tsx# /shopkeeper-signup
            └── DashboardPage.tsx       # /dashboard
```

---

## 🚀 Quick Start Guide

### Prerequisites
* [Node.js](https://nodejs.org/) (v18+ recommended)
* npm (v9+)

### Installation & Running Locally

1. **Navigate to the frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. **Open in your browser**:
   Visit [http://localhost:5173/](http://localhost:5173/) or [http://localhost:5173/dashboard](http://localhost:5173/dashboard)

### Building for Production
```bash
npm run build
```
Compiled, production-ready static assets will be output to `frontend/dist/`.

---

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).
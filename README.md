# 🎓 CampusConnect — Hyperlocal Student & Shopkeeper Platform

> **Connecting college students seeking flexible part-time gigs with neighborhood shopkeepers who need reliable hands.**

CampusConnect is a frontend MVP designed to bridge the hyperlocal employment gap around college campuses. Students can discover part-time roles that fit their class schedules (counter assistance, deliveries, tutoring, data entry, social media), while local merchants can quickly find energetic talent within walking or transit distance.

---

## 📸 Key Features & Pages

### 1. 🚶 Student Registration (`/student-signup`)
* **Transit / Route Stop Motif**: Visual 3-stop progress bar inspired by local transit lines:
  * **Stop 1 (Identity & Education)**: Full Name, Age (strictly validated between 15–30), Current Qualification (`Class 12/Diploma`, `B.Tech/B.E.`, `B.Sc/B.Com/B.A.`, `M.Tech/M.Sc`, `Other`), and College Name.
  * **Stop 2 (Hyperlocal Zone & Work Preferences)**: Locality, City, State, Preferred Work Type dropdown, and Preferred Time of Day shift pills (`Morning`, `Afternoon`, `Evening`, `Weekends only`).
  * **Stop 3 (Availability & Skills)**: Interactive `TagInput` with keyboard shortcuts & popular quick-picks, 7-day selector grid with preset shortcuts (*Weekdays*, *Weekends*, *All*), and Hours/day slider.
* **⚡ Live Hours Calculation**: Automatically computes and displays `Days × Hours/Day = Total Weekly Commitment (hrs/week)`.
* **Instant Confirmation**: Celebratory completion card and immediate sync with the in-memory talent pool.

---

### 2. 🏪 Shopkeeper Registration (`/shopkeeper-signup`)
* **Fast & Mobile-Friendly**: Single-scroll registration tailored for busy store owners.
* **Fields Collected**:
  * Shop / Business Name & Owner Name
  * Category (`Kirana/general store`, `Electronics`, `Clothing`, `Food/restaurant`, `Stationery`, `Pharmacy`, `Salon`, `Other`)
  * Locality, City, State
  * Type of Help Needed (matching student work categories)
  * Required Skills tag input with quick presets
  * Schedule needed (Days + Hours/day slider)
  * Contact Phone (with 10-digit validation) & Optional Pay/Stipend Estimate (`₹200/hr` or `₹5,000/mo`)
* **Instant Publication**: Immediately shows up in the student gig discovery dashboard.

---

### 3. 🔍 Hyperlocal Discovery Dashboard (`/dashboard`)
* **Dual-Sided Role Switcher**:
  * 🎒 **"I'm a student — find work"**: Search & filter neighborhood shopkeeper gigs by City/Area, Category, Help Needed, and Days Needed. Includes interactive **"Connect & Apply"** modal with direct calling and SMS interest triggers.
  * 🛒 **"I'm a shopkeeper — find students"**: Search & filter available college student talent by City/Area, Skills, Preferred Work, and Days Available. Includes **"View Profile & Hire"** modal.
* **Pre-Seeded Mock Data**: 5 realistic Indian student profiles and 5 shopkeeper listings across Bengaluru, Delhi, Pune, and Chennai.
* **Session Highlight Badges**: Profiles and gigs added during the active session are highlighted with a glowing **"Just Added"** / **"New"** badge.
* **Empty State Handling**: Friendly zero-results feedback with quick-action filter resets.

---

## 🎨 Visual Identity & Design System

* **Warm Paper Background**: `#FAF7F2` with subtle dot grid pattern for an artisanal, neighborhood aesthetic.
* **Marigold / Amber Accent**: `#D97706` / `#F59E0B` for student identity and primary call-to-actions.
* **Deep Teal Accent**: `#0F766E` / `#115E59` for shopkeeper portal and verified success states.
* **Ink-Navy Text**: `#0F172A` / `#334155` for maximum contrast and readability.
* **Typography**: **Space Grotesk** for modern bold headings and **Inter** for clean body text.
* **Mobile-Responsive**: Designed mobile-first with touch-friendly tap targets and collapsible drawer navigation.

---

## 🛠️ Tech Stack

* **Frontend**: [React 18](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
* **Build Tool**: [Vite 6](https://vitejs.dev/)
* **Styling**: [Tailwind CSS 3](https://tailwindcss.com/)
* **Routing**: [React Router DOM v6](https://reactrouter.com/)
* **Icons**: [Lucide React](https://lucide.dev/)
* **State Management**: In-Memory React Context (`AppContext.tsx`) with zero localStorage / persistent storage overhead, cleanly structured with `// TODO: replace with API call` markers ready for FastAPI + PostgreSQL.

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
        │   └── index.ts               # TypeScript interfaces & types
        ├── context/
        │   └── AppContext.tsx          # In-memory reactive state store
        ├── data/
        │   └── mockData.ts             # Realistic seed data & options
        ├── components/
        │   ├── common/
        │   │   ├── Navbar.tsx          # Responsive navigation & counters
        │   │   ├── TagInput.tsx        # Multi-tag chips input
        │   │   ├── MultiSelectPills.tsx# Shift selection pills
        │   │   ├── DayPicker.tsx       # 7-day grid selector
        │   │   └── Modal.tsx           # Accessible modal dialog
        │   ├── student/
        │   │   ├── RouteProgressBar.tsx# Transit route progress bar
        │   │   ├── StudentForm.tsx     # 3-stop student registration
        │   │   └── StudentCard.tsx     # Student profile card
        │   ├── shopkeeper/
        │   │   ├── ShopkeeperForm.tsx  # Shopkeeper gig posting form
        │   │   └── ListingCard.tsx     # Shop gig listing card
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
   Visit [http://localhost:5173/](http://localhost:5173/)

### Building for Production
```bash
npm run build
```
The compiled, production-ready static assets will be output to `frontend/dist/`.

---

## 🗺️ Upcoming Roadmap (Future Phases)

- [ ] **Backend Integration**: FastAPI REST endpoints with PostgreSQL & SQLAlchemy.
- [ ] **Hyperlocal Geofencing**: Distance radius filtering based on campus location and GPS coordinates.
- [ ] **Direct Chat & Scheduling**: Real-time chat between students and store owners.
- [ ] **Student Identity Verification**: College ID card verification badge.

---

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).
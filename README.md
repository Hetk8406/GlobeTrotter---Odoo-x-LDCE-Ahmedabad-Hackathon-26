# ✈️ GlobeTrotter — Personalized Travel Itinerary & Expense Planner

> **Odoo x LDCE Ahmedabad Hackathon 2026**  
> *A full-stack, real-time travel planning, multi-city route sequencing, and budget optimization platform.*

---

## 📌 Problem Statement & Solution

### The Challenge
Planning modern multi-city travel is fragmented across multiple disjointed tools: spreadsheet budgeting, notes-app schedules, manual currency conversions, and cumbersome sharing links. Travelers struggle to visualize itinerary chronology, manage expenses against tight budgets in real time, and collaborate seamlessly.

### The Solution
**GlobeTrotter** is a unified, real-time travel planning web application. It combines:
1. **Interactive Multi-City Route Builder**: Plan sequential stops with arrival/departure dates.
2. **Day-by-Day Activity Scheduling**: Organize curated attractions and custom activities with time & duration.
3. **Real-Time INR Budget Optimization**: Live progress tracking, category breakdowns, and expense logging.
4. **Instant Read-Only Sharing**: Share public itinerary URLs with friends and collaborators.
5. **Secure Cloud Persistence & User Isolation**: Backed by Supabase Auth and PostgreSQL with Row-Level Security (RLS).

---

## 🚀 Evaluator Demo Flow (2-Minute Walkthrough)

To quickly evaluate the complete application flow:

`
┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
│  1. Landing     │  ───> │  2. Sign Up     │  ───> │  3. Dashboard   │
│  Explore Hero & │       │  Full Name,     │       │  Live KPIs,     │
│  Destinations   │       │  Email & Pass   │       │  Metrics & Feed │
└─────────────────┘       └─────────────────┘       └─────────────────┘
         │                                                   │
         ▼                                                   ▼
┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
│  6. Itinerary   │  <─── │  5. Route Dates │  <─── │  4. Create Trip │
│  Day-by-Day     │       │  Sequence Stops │       │  Name, Dates,   │
│  Activities     │       │  & Chronology   │       │  INR Budget     │
└─────────────────┘       └─────────────────┘       └─────────────────┘
         │
         ▼
┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
│  7. Budget Log  │  ───> │  8. Share Link  │  ───> │  9. Persistence │
│  Track Expenses │       │  Read-Only      │       │  Reload / Relog │
│  by Category    │       │  Public Preview │       │  Data Preserved │
└─────────────────┘       └─────────────────┘       └─────────────────┘
`

1. **Landing Page (/)**: Discover global and Indian destinations, feature overview, and click **Start Planning**.
2. **Authentication (/signup & /login)**: Register with real-time password strength validation or click **Explore as Guest**.
3. **Dashboard (/dashboard)**: View active journey stats, spending metrics, and recent travel activities.
4. **Trip Planning Wizard (/create-trip)**:
   - *Step 1*: Set Trip Name, Start & End Dates, and Budget in Indian Rupees (₹).
   - *Step 2*: Discover and select destination cities from the global catalog.
   - *Step 3*: Configure arrival & departure dates for each stop.
5. **Trip Details & Scheduling (/trips/:id)**:
   - Add curated attractions or custom activities with time, duration, and cost.
   - Reorder activities dynamically throughout the day.
6. **Budget Management**:
   - Log expenses across categories (Transport, Accommodation, Activities, Meals, Misc).
   - Real-time spend meter warns when approaching budget limits.
7. **Read-Only Sharing (/shared/:id)**:
   - Click **Copy Link** to generate a public preview for non-logged-in travelers.
8. **Cloud Persistence Verification**:
   - Refresh the page or log out and log in again: all trips, stops, activities, and expenses remain fully persisted.

---

## ✨ Key Features

| Feature | Description |
|---|---|
| **1. User Authentication & Profiles** | Email/password authentication, password strength meter, profile settings with Supabase Auth integration. |
| **2. Editorial Landing Page** | High-contrast luxury hero, global destination gallery, and quick-entry CTAs. |
| **3. 3-Step Trip Wizard** | Progressive itinerary creator with strict date validation and INR budgeting. |
| **4. Centralized Dashboard** | Real-time analytics tracking active journeys, visited cities, and total expenditure. |
| **5. My Trips Repository** | Filter trips by status (*Planning*, *Active*, *Completed*), live search, and deletion controls. |
| **6. Multi-Stop Route Builder** | Reorderable chronological travel stops with stay date management. |
| **7. Day-by-Day Activity Scheduler** | Add custom activities, browse pre-curated city highlights, and reorder daily events. |
| **8. Budget Tracking & Cost Logging** | Live expenditure calculation, remaining balances, and category breakdowns. |
| **9. Dual Timeline & Calendar View** | Switch between sequential daily itinerary timeline and monthly interactive calendar. |
| **10. Global Destination Explorer** | Filterable catalog of top global & Indian cities with popularity and cost indicators. |
| **11. One-Click Read-Only Sharing** | Public shareable link generation for friends and travel companions without login requirements. |
| **12. Cloud Sync & User Isolation** | Relational Supabase PostgreSQL persistence with strict user-level data isolation. |

---

## 🛠️ Tech Stack & Architecture

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, Lucide React Icons
- **Backend & Cloud Database**: Supabase PostgreSQL, Supabase GoTrue Auth, Realtime Engine
- **Routing & State**: React Router v6, React Context API, LocalStorage Sync Fallback

`
┌─────────────────────────────────────────────────────────┐
│                      Client Layer                       │
│  React 18 + TypeScript + Tailwind CSS + Lucide Icons    │
└────────────────────────────┬────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────┐
│                    Application State                    │
│            AppContext + Route Security Guards           │
└────────────────────────────┬────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────┐
│                     Supabase Backend                    │
│   PostgreSQL Relational DB  •  Row Level Security (RLS) │
│   Auth / JWT Verification   •  Real-Time Subscriptions  │
└─────────────────────────────────────────────────────────┘
`

---

## 🗄️ Database Schema & Relational Architecture

`mermaid
erDiagram
    auth_users ||--o{ profiles :  creates profile
    profiles ||--o{ trips : owns
    trips ||--o{ trip_stops : contains
    trip_stops ||--o{ activities : schedules
    trips ||--o{ expenses : tracks

    profiles {
        uuid id PK
        text full_name
        text email
        text avatar_url
        text language
        timestamp created_at
    }

    trips {
        uuid id PK
        uuid user_id FK
        text name
        text description
        text cover_image
        date start_date
        date end_date
        numeric budget_limit
        text status
        timestamp created_at
    }

    trip_stops {
        uuid id PK
        uuid trip_id FK
        text city_name
        text country
        text region
        text city_image
        date arrival_date
        date departure_date
        integer stop_order
    }

    activities {
        uuid id PK
        uuid trip_stop_id FK
        text name
        text category
        text description
        text image_url
        time start_time
        integer duration_minutes
        numeric estimated_cost_inr
    }

    expenses {
        uuid id PK
        uuid trip_id FK
        text category
        numeric amount_inr
        date expense_date
        text description
    }
`

### Row Level Security (RLS) Explained
- **profiles**: Users can only view and update their own user profile row (uth.uid() = id).
- **	rips**: Users have full CRUD access exclusively to trips where user_id = auth.uid().
- **	rip_stops, ctivities, expenses**: Child rows are secured through relational foreign key checks ensuring only the trip owner can read or modify them.
- **User Isolation**: User A and User B maintain completely isolated datasets; private trips are never exposed across accounts.

---

## ⚙️ Setup & Installation

### 1. Clone the Repository
`ash
git clone https://github.com/Hetk8406/GlobeTrotter---Odoo-x-LDCE-Ahmedabad-Hackathon-26.git
cd GlobeTrotter---Odoo-x-LDCE-Ahmedabad-Hackathon-26
`

### 2. Install Dependencies
`ash
npm install
`

### 3. Configure Environment Variables
Copy .env.example to .env:
`ash
cp .env.example .env
`
Provide your Supabase Project URL and Anon Public Key:
`env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
`
*(Note: If no keys are provided, GlobeTrotter automatically operates in offline LocalStorage fallback mode so evaluators can run the app without mandatory database setup).*

### 4. Database Setup (Supabase SQL)
Run the SQL migration script in [supabase_schema.sql](supabase_schema.sql) in your Supabase SQL Editor to initialize all tables, triggers, and RLS policies.

### 5. Start Development Server
`ash
npm run dev
`
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 6. Production Build
`ash
npm run build
`

---

## 🔒 Security Compliance Summary

- ✅ **No Secret Keys Committed**: .env is listed in .gitignore and never committed.
- ✅ **Sanitized Templates**: .env.example contains only generic placeholders.
- ✅ **Service Role Key Protected**: No administrative or service-role keys are exposed in client code.
- ✅ **Client-Side Validation**: All forms enforce application-level type and length checks.

---

## 👥 Contributors & Hackathon Details

- **Event**: Odoo x LDCE Ahmedabad Hackathon 2026
- **Team**: GlobeTrotter Developers
- **Repository**: [Hetk8406/GlobeTrotter---Odoo-x-LDCE-Ahmedabad-Hackathon-26](https://github.com/Hetk8406/GlobeTrotter---Odoo-x-LDCE-Ahmedabad-Hackathon-26)

---

## 📝 Known Limitations & Roadmap

- **Currency**: Currently optimized for Indian Rupee (₹ INR) formatting. Multi-currency live conversion is planned for future releases.
- **Flight & Hotel Booking APIs**: Currently supports budget and cost estimation; live airline/hotel booking API integration is on the post-hackathon roadmap.

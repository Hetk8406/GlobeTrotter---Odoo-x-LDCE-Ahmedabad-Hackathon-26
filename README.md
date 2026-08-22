# ✈️ GlobeTrotter — Personalized Travel Planner
> **Odoo x LDCE Ahmedabad Hackathon 2026**

GlobeTrotter is a full-stack, visually rich, and interactive travel itinerary builder and budget planner. Designed specifically for modern travelers, it allows users to plan multi-stop journeys, organize schedules day-by-day, log custom trip expenses, and share their itineraries publicly.

---

## ✨ Features

- **🗺️ Interactive Itinerary Builder**: Construct multi-city trips showing arrival dates, departure dates, duration, and day-by-day activity timelines.
- **💰 Polished Budget Dashboard**: Tracks total budget limits, remaining budgets, daily averages, and features category spend breakdowns (Transport, Accommodation, Activities, Meals, Miscellaneous).
- **📅 Visual Timeline & Calendar**: Toggle between a beautiful day-by-day timeline view and a complete monthly calendar journey view.
- **🔗 Read-Only Sharing**: Copy public shared itinerary URLs with a single click to share travel plans with friends.
- **₹ INR-First & Dark-Only Design**: Optimized for a sleek dark mode appearance using native Indian Rupee formatting (`₹` using Indian formatting conventions).
- **🛡️ Safe Supabase Backend**: Integrated database persistence using Supabase Auth, PostgreSQL, and strict Row Level Security (RLS) policies.
- **🔋 Dual-Mode Resilience**: Features a dynamic fallback system. If Supabase keys are not set in the environment, the app automatically falls back to an offline LocalStorage database so evaluator demonstrations run instantly without configuration.

---

## 🛠️ Tech Stack

- **Frontend**: React, TypeScript, Vite, Tailwind CSS, Lucide Icons
- **Backend/Database**: Supabase PostgreSQL, Supabase Auth, Supabase RLS
- **State & Storage**: React Context, LocalStorage (resilient fallback mode)

---

## ⚙️ Setup & Installation

### 1. Clone the repository
```bash
git clone https://github.com/Hetk8406/GlobeTrotter---Odoo-x-LDCE-Ahmedabad-Hackathon-26.git
cd GlobeTrotter---Odoo-x-LDCE-Ahmedabad-Hackathon-26
```

### 2. Install dependencies
```bash
npm install
```

### 3. Setup Environment Variables (Optional)
Copy `.env.example` to `.env` and fill in your Supabase connection parameters:
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```
*Note: If these variables are not provided, the application will run in offline LocalStorage fallback mode automatically.*

### 4. Database Setup (Optional)
Run the queries in [`supabase_schema.sql`](supabase_schema.sql) inside your Supabase SQL editor to create the profiles, trips, stops, activities, and expenses tables.

### 5. Run the application
```bash
npm run dev
```
To build for production:
```bash
npm run build
```
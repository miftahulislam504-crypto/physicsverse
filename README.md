# ⚛️ PhysicsVerse

> **"See Physics. Feel Physics. Master Physics."**  
> The complete physics learning ecosystem — interactive simulations, AI tutoring, virtual labs, and a 3D science city.

---

## ✅ Build Status

| Phase | Module | Status |
|-------|--------|--------|
| 0 | Foundation & Architecture | ✅ Complete |
| 1 | Physics World Explorer | ✅ Complete |
| 2 | Learn Module | ✅ Complete |
| 3 | Interactive Formula Explorer | 🔜 Next |
| 4 | Physics Experience Zones (Lab) | 🔜 |
| 5 | Physics Playground | 🔜 |
| 6 | Practice & Challenge Hub | 🔜 |
| 7 | Real World Physics | 🔜 |
| 9 | AI Physics Tutor | 🔜 |
| 13 | 3D Science City | 🔜 |

---

## 🚀 Getting Started

### 1. Install dependencies
```bash
npm install
```

### 2. Set up environment variables
```bash
cp .env.example .env.local
```

Fill in your Firebase credentials in `.env.local`:
```
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
ANTHROPIC_API_KEY=...   ← for AI Tutor (Phase 9)
```

### 3. Run the development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 4. Build for production
```bash
npm run build
npm start
```

---

## 📁 Project Structure

```
src/
├── app/
│   ├── layout.tsx              ← Root layout (fonts, metadata, providers)
│   ├── page.tsx                ← Homepage
│   ├── sitemap.ts              ← Auto-generated sitemap
│   ├── explore/                ← Phase 1: World Explorer
│   │   ├── page.tsx
│   │   └── ExploreClient.tsx
│   └── learn/                  ← Phase 2: Learn Module
│       ├── page.tsx
│       ├── LearnClient.tsx
│       ├── [slug]/             ← Dynamic chapter pages
│       │   ├── page.tsx
│       │   ├── ChapterClient.tsx
│       │   └── not-found.tsx
│       └── domain/[domain]/    ← Domain-filtered view
│           └── page.tsx
│
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   ├── NavbarWithSearch.tsx
│   │   └── Providers.tsx
│   ├── physics/                ← Domain-specific components
│   │   ├── PhysicsMap.tsx
│   │   ├── PhysicsTimeline.tsx
│   │   ├── PhysicsRoadmap.tsx
│   │   ├── DailyFact.tsx
│   │   ├── DomainGrid.tsx
│   │   ├── ChapterCard.tsx
│   │   ├── FormulaRenderer.tsx ← KaTeX wrapper
│   │   ├── PrerequisiteMap.tsx
│   │   ├── LearningStats.tsx
│   │   └── TagCloud.tsx
│   ├── shared/
│   │   ├── SearchModal.tsx     ← ⌘K global search
│   │   └── ReadingProgress.tsx ← Scroll progress bar
│   └── ui/
│       ├── index.tsx           ← Button, Badge, TabBar, SectionHeader, etc.
│       └── Toaster.tsx
│
├── lib/
│   ├── firebase/
│   │   ├── config.ts
│   │   ├── auth.ts
│   │   └── collections.ts
│   ├── hooks/
│   │   ├── useProgress.ts      ← Chapter completion tracking
│   │   ├── useBookmarks.ts     ← Bookmark system
│   │   └── useSearch.ts        ← Global search logic
│   ├── constants/
│   │   ├── physics-data.ts     ← Domains, timeline, roadmaps, daily facts
│   │   └── chapters-data.ts    ← All chapter content (20 chapters across 8 domains)
│   ├── store.ts                ← Zustand (auth, theme, locale, toasts)
│   └── utils/index.ts          ← cn(), domain meta, formatters, XP system
│
├── i18n/
│   ├── request.ts
│   ├── en/common.json          ← English translations
│   └── bn/common.json          ← বাংলা translations
│
├── styles/
│   └── globals.css             ← Design tokens, dark/light mode
│
└── types/
    └── index.ts                ← Full TypeScript schema
```

---

## 🎨 Design System

| Token | Value | Usage |
|-------|-------|-------|
| Primary | `#0090f0` | Electric Blue — buttons, links, highlights |
| Accent  | `#7c4ef5` | Quantum Violet — secondary actions, gradients |
| Surface (dark) | `#1f2d3d` | Cards, modals |
| BG (dark) | `#060d14` | Page background |

**Zone Colors** (per physics domain):
- Mechanics: `#f97316` · Electricity: `#facc15` · Waves: `#34d399`
- Optics: `#60a5fa` · Thermal: `#fb7185` · Modern: `#a78bfa`
- Space: `#94a3b8` · Quantum: `#e879f9`

---

## 🌐 Languages

- **English** (primary, default)
- **বাংলা** (Bengali toggle — stored in cookie, full translations in `i18n/bn/`)

Toggle via the `বাংলা / English` button in the navbar.

---

## 📦 Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS + CSS Variables |
| Animation | Framer Motion |
| 3D (Phase 13) | React Three Fiber + Three.js + Rapier |
| Math/Formulas | KaTeX |
| Charts | Recharts |
| State | Zustand (persist) |
| Data Fetching | TanStack Query |
| Backend | Firebase (Auth + Firestore + Storage) |
| i18n | next-intl |
| AI Tutor (Phase 9) | Anthropic Claude API |

---

## 🤝 Contributing

Phase-based development. Each phase is self-contained. 
See `PHYSICSVERSE_FINAL_BUILD_PLAN.md` for the full roadmap.

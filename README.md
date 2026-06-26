# Pattern Lab

A config-driven learning platform for mastering algorithmic patterns — built for **Snapp Pay** internal interview prep.

[![Live app](https://img.shields.io/badge/live-snapppay--pattern--lab.vercel.app-007dfa?style=for-the-badge)](https://snapppay-pattern-lab.vercel.app)
[![Release](https://img.shields.io/github/v/release/tmohammad78/pattern-lab?label=release&color=007dfa)](https://github.com/tmohammad78/pattern-lab/releases)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61dafb?style=flat-square&logo=react)](https://react.dev/)

## Links

| | |
|---|---|
| **Live app** | [snapppay-pattern-lab.vercel.app](https://snapppay-pattern-lab.vercel.app) |
| **Repository** | [github.com/tmohammad78/pattern-lab](https://github.com/tmohammad78/pattern-lab) |
| **Vercel project** | `snapppay-pattern-lab` |
| **Latest release** | [v0.2.0](https://github.com/tmohammad78/pattern-lab/releases/tag/v0.2.0) |

**Demo login:** `demo@snapppay.ir` / `patternlab123`

## Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:3000/login](http://localhost:3000/login)

## Deployment

Production is hosted on **Vercel** and deploys automatically from the `main` branch.

```bash
# Manual deploy (optional)
vercel --prod
```

| Setting | Value |
|---------|-------|
| Production URL | https://snapppay-pattern-lab.vercel.app |
| Vercel project | `snapppay-pattern-lab` |
| Node.js | 20.x (Vercel default) |

### Persistent progress (production)

Connect **Vercel KV** or **Upstash Redis** in the Vercel dashboard so learner progress survives redeploys. See [Progress Storage](#progress-storage) below.

## Features

- **Patterns** — Browse algorithm patterns with grid/list views and category filters
- **Episodes** — Story-driven LeetCode walkthroughs with interactive diagrams and quizzes
- **Playground** — Run JavaScript in the browser (Monaco editor)
- **Resources** — Curated videos, books, articles, and courses
- **Progress** — XP, streaks, charts, achievements, JSON export/import
- **Search** — Full-text search via `⌘K`
- **Themes** — Dark and light mode

## Publish / Hide Content (Catalog)

Control what is visible in the app via **`content/config/catalog.json`** — no code changes needed.

```json
{
  "mode": "published-only",
  "patterns": ["two-pointers"],
  "episodes": ["two-pointers/boats-to-save-people"],
  "categories": ["arrays"],
  "resources": [],
  "navigation": {
    "resources": false
  }
}
```

| Field | Purpose |
|-------|---------|
| `mode` | `"published-only"` hides anything not listed; `"all"` shows everything |
| `patterns` | Pattern slugs to show (e.g. `"sliding-window"`) |
| `episodes` | Episode keys: `{pattern}/{episode}` |
| `categories` | Sidebar categories to show |
| `resources` | Resource IDs to show (empty = none) |
| `navigation` | Set tab to `false` to hide from sidebar |

**To enable more content later:** add slugs to the arrays above, or set `"mode": "all"`.

## Weekly Content Workflow

Adding a new episode requires **no application code changes**:

### 1. Create episode MDX (optional narrative)

```bash
content/episodes/{pattern-slug}/{episode-slug}.mdx
```

### 2. Add episode data (for interactive sections)

Extend `lib/episode-data.ts` with structured content, or add a JSON file under `content/episodes/`.

### 3. Register in config

Add an entry to `content/config/episodes.json`:

```json
{
  "two-pointers/my-new-episode": {
    "patternSlug": "two-pointers",
    "slug": "my-new-episode",
    "title": "Episode Title",
    "subtitle": "LeetCode Problem Name",
    "order": 2,
    "difficulty": "medium",
    "readTimeMin": 10,
    "leetcodeUrl": "https://leetcode.com/problems/...",
    "mdx": "episodes/two-pointers/my-new-episode.mdx",
    "sections": ["story", "problem", "diagram", "try-yourself", "brute-force", "observation", "pattern-discovery", "solution", "complexity", "related", "quiz", "takeaways"]
  }
}
```

### 4. Update pattern episode count

In `content/config/patterns.json`, bump `episodeCount` for the parent pattern.

### 5. Publish in catalog

Add the pattern/episode slug to `content/config/catalog.json`.

### 6. (Optional) Add resources

Add entries to `content/config/resources.json`.

## Adding Users

Users are stored in `content/config/users.json`. Generate password hashes:

```bash
npx tsx scripts/hash-password.ts your-password
```

Add the hash to `users.json` — no signup UI, admin adds emails manually.

## Progress Storage

Progress is saved in **two places**:

1. **Browser (localStorage)** — fast, offline-friendly cache on the same device
2. **Server store** — survives new Vercel deploys and works across devices

Every progress update syncs to `/api/progress` automatically (debounced).

### Local development
Progress files are written to `data/progress/{email}.json` (gitignored).

### Production (Vercel) — required for deploy-safe storage

1. Open [Vercel Dashboard](https://vercel.com) → your project → **Storage**
2. Create **KV** or **Upstash Redis** and connect it to `snapppay-pattern-lab`
3. Redeploy — env vars `KV_REST_API_URL` and `KV_REST_API_TOKEN` are added automatically

Without KV/Redis, progress stays in the browser only and can be lost when switching devices or clearing cache.

### Manual backup
Use **Export Progress** / **Import Progress** on the Progress page anytime.

## Project Structure

```
app/              Next.js App Router pages
components/       React components (layout, mdx, patterns, episodes, progress)
content/config/   JSON registries (patterns, episodes, categories, users, resources)
content/patterns/ Pattern MDX content
content/episodes/ Episode MDX content
lib/              Content loaders, auth, progress, search, episode data
public/           Snapp Pay logo and static assets
scripts/          Utility scripts (password hashing)
```

## Tech Stack

- Next.js 16 (App Router)
- React 19 + TypeScript
- Tailwind CSS v4
- Framer Motion
- Recharts
- Monaco Editor
- Fuse.js
- next-mdx-remote

## Branding

Primary color: `#007dfa` (Snapp Pay blue). Logo: `public/snapppay-logo.svg`

# Pattern Lab

A config-driven learning platform for mastering algorithmic patterns — built for **Snapp Pay** internal interview prep.

## Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:3000/login](http://localhost:3000/login)

**Demo credentials:** `demo@snapppay.ir` / `patternlab123`

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

Progress is stored in **localStorage** per user. Use **Export/Import** on the Progress page to backup or transfer between devices.

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

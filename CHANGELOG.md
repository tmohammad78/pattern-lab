# Changelog

## [0.2.0](https://github.com/tmohammad78/pattern-lab/releases/tag/v0.2.0) — 2026-06-26

### Added
- Server-side progress sync via `/api/progress` (Vercel KV / Upstash Redis in production)
- Local file fallback for dev (`data/progress/`)
- Progress merge on login and app load (local + remote by `updatedAt`)
- Catalog-driven publish/hide for patterns, episodes, and navigation
- Interactive two-pointer visual diagrams on pattern detail page
- Home, patterns, and episode UI polish

### Deployment
- **Live:** https://snapppay-pattern-lab.vercel.app
- **Vercel project:** `snapppay-pattern-lab`

## [0.1.0](https://github.com/tmohammad78/pattern-lab/releases/tag/v0.1.0) — 2026-06-26

### Added
- Initial Pattern Lab release for Snapp Pay
- Next.js 16 + React 19 + Tailwind v4 app shell
- Auth (login/signup), patterns, episodes, playground, resources, progress
- Two Pointers pattern + Boats to Save People episode
- MDX content system, search (⌘K), dark/light themes

### Deployment
- **Live:** https://snapppay-pattern-lab.vercel.app
- **GitHub:** https://github.com/tmohammad78/pattern-lab

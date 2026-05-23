# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # start dev server at http://localhost:5173
npm run build     # production build (outputs to dist/)
npm run preview   # preview the production build locally
```

No test suite. No linter configured.

## Architecture

React 18 + Vite PWA. Single-page app with a fixed bottom tab bar. Max width 480px — designed as a mobile-first installable app.

**State** lives entirely in `useRunLogs` (`src/hooks/useRunLogs.js`), which reads/writes `localStorage` under the key `marathon_run_logs`. The log structure is a flat object keyed as `week_<N>_<type>` (e.g. `week_3_easy`). All derived queries (streak, completion %, total km) are computed there via `useCallback`.

**Navigation** is a simple `useState('plan' | 'stats' | 'guide')` in `App.jsx` — no router.

**Training data** is static in `src/data/plan.js`. It exports `RACE_DATE` (2027-04-18), `START_DATE` (2026-06-01), `TOTAL_WEEKS` (46), `PHASES` (base/build/peak/taper with week ranges), `RUN_TYPES` (easy/mid/long), and the per-week plan array. `getCurrentWeek()` computes the current week number from the start date.

**UI components** in `src/components/UI.jsx` are small primitives used across screens: `Card`, `Btn`, `Badge`, `Input`, `Textarea`, `EffortDots`, `ProgressRing`, `SectionLabel`. All styling is inline — no CSS modules or Tailwind.

**Design tokens** are CSS custom properties defined in `src/index.css`: `--bg-0` through `--bg-3` (dark greys), `--text-0` through `--text-4`, `--accent` (orange `#e68a3c`), phase colors (`--green`, `--yellow`, `--red`, `--purple`). Font is Plus Jakarta Sans from Google Fonts.

**PWA** config is in `vite.config.js` using `vite-plugin-pwa` with Workbox. Service worker auto-updates. Assets are fully cached for offline use.

## Key files

| File | Purpose |
|------|---------|
| `src/data/plan.js` | All training data — edit distances/phases here |
| `src/hooks/useRunLogs.js` | All state + localStorage persistence |
| `src/components/WeekDetail.jsx` | Per-week view with run logging |
| `src/components/LogRunSheet.jsx` | Bottom sheet form to log a run |
| `src/components/StatsScreen.jsx` | Charts (via Recharts) + summary stats |
| `src/index.css` | All CSS variables / design tokens |

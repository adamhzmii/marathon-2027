# Marathon 2027 — PWA

Your personal 46-week Manchester Marathon training plan, installable as an app on your phone.

---

## Deploy in 10 minutes

### Step 1 — Install Node.js (if you haven't already)
Download from https://nodejs.org (LTS version)

### Step 2 — Test it locally first
```bash
cd marathon-pwa
npm install
npm run dev
```
Open http://localhost:5173 in your browser to check it works.

### Step 3 — Push to GitHub
```bash
git init
git add .
git commit -m "initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/marathon-2027.git
git push -u origin main
```
(Create the repo on github.com first — name it `marathon-2027`, keep it public or private, don't add a README)

### Step 4 — Deploy to Vercel (free)
1. Go to https://vercel.com and sign in with your GitHub account
2. Click **"Add New Project"**
3. Import your `marathon-2027` repo
4. Framework preset will auto-detect as **Vite** ✓
5. Click **Deploy** — done in ~60 seconds

You'll get a URL like `marathon-2027.vercel.app`

### Step 5 — Install on your phone (Android)
1. Open the URL in Chrome
2. Tap the **⋮** menu → **"Add to Home Screen"**
3. Tap Add — it'll appear on your home screen like a real app

### Step 5 — Install on your phone (iPhone)
1. Open the URL in Safari (must be Safari)
2. Tap the **Share** button → **"Add to Home Screen"**
3. Tap Add

---

## Making changes later

Just edit the code, then:
```bash
git add .
git commit -m "describe your change"
git push
```
Vercel auto-redeploys in ~30 seconds. Your live URL stays the same.

---

## Key files to know

| File | What it does |
|------|-------------|
| `src/data/plan.js` | All 46 weeks of training data — edit distances here |
| `src/App.jsx` | Main app shell + navigation |
| `src/components/PlanScreen.jsx` | The weekly plan list |
| `src/components/WeekDetail.jsx` | Individual week + run logging |
| `src/components/StatsScreen.jsx` | Stats dashboard |
| `src/index.css` | All colours and fonts |

---

## Your run data
Runs are saved in your phone's **localStorage** — they persist between sessions but are device-specific. Use the export button in Stats to back up your data as JSON.

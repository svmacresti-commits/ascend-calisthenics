# Ascend Calisthenics

A skill-tree tracker for calisthenics progressions — 75 skills across 6 tiers,
from your first wall push-up to a full planche, front lever, and human flag.
Dark, minimal, climbing-wall inspired. Progress saves locally in your browser.

## What's in here

- `src/data/skills.js` — every skill, its tier, category, description, coaching
  cue, and prerequisites. **This is the file you'll edit most.**
- `src/lib/storage.js` — the save/load layer. Currently uses `localStorage`,
  written so it's a clean swap to a real backend (Supabase, etc.) later —
  every function is already `async` and returns the same shapes it will once
  it's talking to a database instead of the browser.
- `src/components/` — the UI: profile gate, header/progress bar, the tree
  itself, individual nodes, and the detail modal.
- `src/lib/useConnectorLines.js` — measures node positions and draws the SVG
  lines connecting each skill to its prerequisites.

## Running it locally (do this first)

You'll need [Node.js](https://nodejs.org) installed (v18 or newer).

```bash
cd ascend-calisthenics
npm install
npm run dev
```

Open the URL it prints (usually `http://localhost:5173`). Click around, mark
a few skills complete, refresh the page — your progress should still be
there. That confirms everything's working before you deploy.

## Deploying to GitHub Pages, step by step

**1. Create a new repository on GitHub**
Go to github.com → New repository → name it `ascend-calisthenics` (or
whatever you want — see the note below if you use a different name) → don't
initialize with a README (you already have one) → Create repository.

**2. Push this code to it**
From inside the `ascend-calisthenics` folder:

```bash
git init
git add .
git commit -m "Initial commit: Ascend Calisthenics"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/ascend-calisthenics.git
git push -u origin main
```

**3. Turn on GitHub Pages**
On GitHub, go to your repo → **Settings** → **Pages** (left sidebar) → under
"Build and deployment", set **Source** to **GitHub Actions**.

That's it. A workflow file (`.github/workflows/deploy.yml`) is already in
this project — it builds the site and deploys it automatically every time
you push to `main`. Check the **Actions** tab on GitHub to watch it run
(takes about a minute).

**4. Find your live URL**
Once the workflow finishes, it'll be live at:
`https://YOUR-USERNAME.github.io/ascend-calisthenics/`

### If you name the repo something other than `ascend-calisthenics`

Open `vite.config.js` and change this line to match your repo name exactly:

```js
base: '/your-repo-name/',
```

Then commit and push again.

## Editing the skill tree

Open `src/data/skills.js`. Each skill looks like this:

```js
{
  id: 'pistol-squat',
  name: 'Pistol Squat',
  category: 'legs',       // push | pull | legs | core | statics | dynamic
  tier: 3,                // 1 (easiest) through 6 (hardest)
  desc: 'Full unassisted single-leg squat...',
  cue: 'Keep the extended leg just off the floor...',
  prereqs: ['assisted-pistol-squat'],  // ids of skills that unlock this one
}
```

Add a new skill by adding a new object to the array with a unique `id`.
Reference that `id` in any other skill's `prereqs` array to wire it into the
tree. No other file needs to change.

## When you're ready for real accounts

Right now progress lives in that one browser via `localStorage` — it won't
follow you to another device, and there's no real login. When you want to
add that, the only file that needs real changes is `src/lib/storage.js`.
Swap the inside of each function (`getProfile`, `setProfile`, `getProgress`,
`toggleSkillComplete`, `setSkillNote`, `resetAllProgress`) for real calls to
something like [Supabase](https://supabase.com) (free tier, handles auth +
a Postgres database, and has a JS client that's easy to drop in). Every
component already calls these functions and awaits them, so the UI code
doesn't need to change at all.

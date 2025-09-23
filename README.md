Roamio monorepo

This repository contains a UI app in the `roamio-ui` folder (Next.js).

Quick start (local)

1. cd roamio-ui
2. npm install
3. npm run dev

Vercel deployment

Option A — Connect Git repository in Vercel UI
1. In Vercel, create a new project and point it to this repository.
2. In the "Root Directory" field (Project Settings > General) set: `roamio-ui`.
3. Use the default build command `npm run build` and output directory (Next.js).

Option B — Deploy with Vercel CLI
1. Install CLI: `npm i -g vercel`.
2. From repo root run: `vercel --cwd=roamio-ui`.

Notes
- `next.config.ts` specifies Turbopack root so local dev warnings are reduced.
- A small root `package.json` proxies common scripts to `roamio-ui` for convenience.
 
Vercel configuration
- A `vercel.json` is included at the repo root and configured to build `roamio-ui` via `@vercel/next`.

CLI deploy example (production):

1. Ensure you are logged in: `vercel login`
2. From the repo root run:

```powershell
vercel --prod --cwd=roamio-ui
```

This will build and deploy the `roamio-ui` project.

CI / GitHub Actions (recommended)

1. Create a Vercel project (you can connect via the Vercel dashboard). Note the `VERCEL_ORG_ID` and `VERCEL_PROJECT_ID` from your project settings.
2. Create a Vercel token: https://vercel.com/account/tokens and copy it.
3. In your GitHub repo, go to Settings → Secrets → Actions and add three secrets:
	- `VERCEL_TOKEN` — the token value
	- `VERCEL_ORG_ID` — your Vercel organization id
	- `VERCEL_PROJECT_ID` — your Vercel project id
4. Push to `main` (or `master`) to trigger the workflow. The workflow will build `roamio-ui` and deploy to Vercel (production).

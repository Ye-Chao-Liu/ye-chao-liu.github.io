# GitHub Pages deployment — operator instructions

Target: GitHub account `Ye-Chao-Liu`, repository `ye-chao-liu.github.io`, URL https://ye-chao-liu.github.io/ . These are instructions for a future authorized release; preparation did not execute them.

## 1. Finish local review

Use Node.js 24 and pnpm 11.25.0. Retain the existing `pnpm-lock.yaml` and `pnpm-workspace.yaml`.

```powershell
pnpm install --frozen-lockfile
pnpm validate:content
pnpm test:content
pnpm check
pnpm build
pnpm audit:site
pnpm preview
```

Review `PRE_RELEASE_AUDIT.md`. Inspect all five pages at 320, 375, 768, and 1440 pixels; check keyboard focus, skip link, filters/search, pagination, older-paper deep links, print CV, and a missing route. Check DOI and external links in a normal browser. Preview serves the production build at http://127.0.0.1:4321/ . Stop with Ctrl+C.

## 2. Create the repository only when ready

Sign in as `Ye-Chao-Liu`. On GitHub create an empty repository named exactly `ye-chao-liu.github.io`. Do not initialize it with README, license, or gitignore because those files already exist locally. Public visibility exposes source records as well as rendered content; review hidden academic fields, contact details, and the historical CV first. GitHub plan restrictions may affect Pages from private repositories.

This workspace currently has no `.git` directory. Once repository creation and pushing are authorized, run:

```powershell
git init -b main
git remote add origin https://github.com/Ye-Chao-Liu/ye-chao-liu.github.io.git
git add .
git status --short
git diff --cached --stat
git diff --cached
```

Review the staged files before committing. Ensure `node_modules/`, `dist/`, `.astro/`, `.pnpm-store/`, `.env*`, logs, and `previews/` are absent. `cv_liu.tex` is retained academic archival source and will be included unless you deliberately exclude it; it is not the current CV database. Do not remove academic records just to shorten the repository. The source People record contains a public institutional email and an historical scholarship reference; retain or redact only after an explicit content decision. If an older repository exists elsewhere, review its history separately; `.gitignore` cannot remove prior disclosures.

After approving the staged source:

```powershell
git commit -m "Prepare academic website for manual GitHub Pages release"
git push -u origin main
```

Pushing does not trigger this workflow. Do not run these commands as part of local preparation.

## 3. Configure and manually approve the first deployment

1. In repository **Settings → Pages**, choose **GitHub Actions** as the build/deployment source. Do not select a branch or run another starter deployment workflow.
2. Optional separate approval gate: in **Settings → Environments → github-pages**, configure required reviewers and restrict deployment branches to `main` where your GitHub plan supports these features. Without this protection, the manual workflow dispatch itself is the release authorization; there is no second approval prompt.
3. Confirm the reviewed commit is on `main`. Open **Actions → Deploy to GitHub Pages → Run workflow**, select `main`, and click **Run workflow** only when you approve publication. The workflow must exist on the default branch for its manual button to appear.
4. Wait for the build checks and artifact upload. If environment reviewers are configured, inspect the run/commit and choose **Review deployments → Approve and deploy**. Otherwise deployment follows a successful build immediately.
5. Confirm the successful deployment URL is https://ye-chao-liu.github.io/ . Check all five routes, portrait/favicon, canonical tags, `/sitemap.xml`, `/robots.txt`, old publication anchors, and a deliberately missing path returning the custom 404 with HTTP 404.

The workflow uses `withastro/action@v6`, `actions/checkout@v7`, and `actions/deploy-pages@v5` from the current [official Astro guide](https://docs.astro.build/en/guides/deploy/github/). pnpm is detected from the existing lockfile and pinned by `packageManager`. Build has read-only repository permissions; only the deployment job receives Pages write and OIDC permissions. No custom token is needed. The Pages artifact already contains `404.html`; an Actions artifact deployment does not require branch-based `.nojekyll` handling.

## Later releases

Repeat the checks, review the diff, commit/push only when authorized, then manually dispatch the workflow. Automatic push deployment remains disabled. Add a `push` trigger for `main` only after explicit approval in a later change. Do not set a project base or `BASE_PATH`; this is an account site at `/`. When adding future person/CV routes, extend the sitemap and generated-site audit alongside those routes.

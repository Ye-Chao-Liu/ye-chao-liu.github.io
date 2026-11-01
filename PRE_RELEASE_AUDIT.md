# Pre-release audit — 2026-11-01

Status: local preparation complete; publication is not authorized or performed. Browser interaction/responsive QA and full external reachability remain release checks. There is no `.git` directory in this workspace, so tracked files, history, remotes, and a Git diff could not be inspected; the audit covers present source files intended for the future repository.

## Changes and reasons

| Files | Change |
| --- | --- |
| `src/data/publications/*.json` (14 renames) | Removed date prefixes to restore stable filenames matching internal IDs. All 16 publication records were compared with SHA-256 before/after: zero byte changes. |
| `astro.config.mjs` | Fixed `site` to `https://ye-chao-liu.github.io`; removed environment-driven base so the default is `/`. Static output and trailing slashes retained. |
| `.github/workflows/deploy.yml` | Official Astro build/upload and Pages deployment, Node 24, manual dispatch only, checks before deployment, scoped permissions and serialized releases. |
| `package.json` | Pinned existing pnpm 11.25.0; added `audit:site`. Existing dependencies and lockfile retained. |
| `src/layouts/Layout.astro` | Added canonical and sitemap links; optional `noindex` metadata. No visible layout change. |
| `src/pages/404.astro` | Applied `noindex`; retained custom content and return-home link. |
| `src/pages/sitemap.xml.ts`, `src/pages/robots.txt.ts` | Build-generated discovery metadata using the configured origin and existing navigation; 404 excluded. No dependency added. |
| `scripts/audit-site.mjs` | Repeatable generated-route, asset, fragment, metadata, basic semantic and publication-order checks; opt-in external URL report. |
| `public/images/people/ye-chao-liu.jpg` | Removed EXIF/XMP metadata, including a GPS directory, camera/software and timestamp metadata. Orientation was verified as normal (1); all retained JPEG segments and compressed image scan bytes match the original exactly. No visual image transformation. |
| `cv_liu.tex` | Fixed the identified malformed `https://https://quantum-journal.org` URL. No academic statements changed. |
| `.gitignore` | Excluded local secrets/logs and historical review artifacts (`previews/`). Existing ignores retained. |
| `README.md`, `CONTENT_GUIDE.md`, `DEPLOYMENT.md`, this file | Replaced obsolete deployment advice, documented release operations, evidence/limits and future person CV architecture. |

Renamed files (old basename → stable basename; `.json` unchanged):

- `2016-09-27-scattering` → `scattering`
- `2019-03-07-coherence` → `coherence`
- `2019-10-09-dicke` → `dicke`
- `2020-04-15-processes` → `processes`
- `2021-03-04-nondemolition` → `nondemolition`
- `2021-10-11-continuous` → `continuous`
- `2022-02-22-designs` → `designs`
- `2023-06-13-homogeneous` → `homogeneous`
- `2023-08-01-distance` → `distance`
- `2024-08-07-spin` → `spin`
- `2025-02-17-noisy` → `noisy`
- `2025-08-07-buffers` → `buffers`
- `2025-12-04-collective` → `collective`
- `2026-07-23-nonstabilizer` → `nonstabilizer`

`tensor.json` and `toolbox.json` retain their original names. All IDs, publication/acceptance/preprint dates, authors, roles and People/Project/Highlight relationships remain unchanged. No confirmed research descriptions changed. No academic source records were deleted.

## Validation evidence

- `pnpm validate:content`: passed, 1 person, 2 projects, 16 publications and 16 activities; required fields, dates, IDs, duplicate identifiers, cross-references and images validated.
- `pnpm test:content`: all 6 existing tests passed.
- `pnpm check`: zero errors, warnings or hints.
- `pnpm build`: passed, 6 HTML pages including `404.html`, plus `robots.txt` and `sitemap.xml`.
- `pnpm audit:site`: passed, all 98 generated internal links/assets/anchors resolve. All five indexable pages have expected absolute canonical URLs, descriptions, viewport metadata, one h1, language, main landmark and image alt text. This is a basic static semantic audit, not an automated WCAG certification.
- Sitemap contains exactly `/`, `/research/`, `/publications/`, `/projects/`, `/about/`; robots allows crawling and identifies the production sitemap. The 404 has `noindex`, no canonical, and a return-home link.
- HTTP preview: `/` returned 200; `/missing-pre-release-check/` returned 404 with the custom page content. Actual GitHub Pages behavior must be checked after first deployment.
- Rendered publication order matches the existing shared date/ID sorting policy: toolbox, nonstabilizer, collective, buffers, noisy, tensor, spin, distance, homogeneous, designs, continuous, nondemolition, processes, dicke, coherence, scattering. Partial-date precision and ID tie handling retained; no date inference introduced.

## Design, responsive behavior and accessibility

V3.2 page design, components, diagram, CSS, academic data and publication browsing logic remain intact. Specifically, `src/styles/global.css` retains `.framework-diagram .concept-diagram{width:min(100%,800px)}`. Home, Research, Publications, Projects and About/CV were not redesigned.

Source review confirms existing 1000/700/370px responsive rules, wrapping navigation, single-column mobile filters/CV, fluid SVG sizing, image alternatives, SVG accessible description, labeled controls, current navigation, skip link, visible focus, live result count, pagination focus handling, reduced-motion rule, and no-JavaScript bibliography fallback. Browser access timed out twice, and the local browser-testing runtime also timed out. No fresh desktop/mobile screenshot, keyboard-interaction test, screen-reader test or contrast-tool run was completed. Before release, perform the concrete viewport and keyboard checklist in `DEPLOYMENT.md`, including 320px and 200% zoom. Historical `previews/v3.2-*` images are retained as references, not claimed as fresh QA.

## External links

`pnpm audit:site --external` attempted all 20 unique HTTP(S) destinations derived from the rendered site and source DOI/arXiv/URL fields. All failed locally with network `fetch failed` errors; a PowerShell retry also could not complete them. These failures are not evidence that the academic URLs are broken. The ignored local report is `previews/pre-release-links.json`.

Web fallback successfully opened both [Toolbox arXiv](https://arxiv.org/abs/2507.17435) and [tensor arXiv](https://arxiv.org/abs/2511.05258) records and the [MATH+ project](https://mathplus.de/research-2/application-areas/aa2-nano-quantum-technologies/aa2-19/). Sample DOI resolver requests were inaccessible through that tool as well. Retain all DOI identifiers and academic claims; manually check the 20 destinations in a normal browser before release. The historical CV's malformed Quantum URL was fixed from its obvious duplicated scheme; historical event URLs were not substituted or deleted.

## Source privacy and housekeeping

- Reviewed source data, archival CV, project configuration and source file inventory. Pattern scanning found no obvious private keys or common token/password assignments in source/config/docs; this does not prove absence of every secret.
- The institutional email is deliberately public. People JSON retains hidden academic history, awards and an historical scholarship reference. The archival CV also contains academic history and that reference. Keep them unless the owner decides otherwise; source becomes readable if the repository is public.
- EXIF/XMP cleanup removes portrait metadata without changing JPEG image data. A local original was retained in the system temporary directory outside the repository; it is not a deployment input.
- `previews/` contains 32 historical review artifacts (~6.96 MB before new audit reports). These are unnecessary deployment inputs; they are now ignored for initial Git staging and retained locally. Nothing was deleted. `.gitignore` also excludes generated directories, secrets and logs. Do not force-add these files.
- `cv_liu.tex` is retained and remains eligible for Git staging as explicitly documented academic archival source; it is not copied to `dist/`. It has stale historical bibliography details and is not a second maintenance database. Any future exclusion/removal should be a deliberate owner decision.
- Generated output contains neither source JSON nor `cv_liu.tex`. Source confidentiality still depends on repository visibility and history, not on the build output.

## Release limitations and next steps

1. Finish live browser checks and external-link verification as described above.
2. Review actual staged files/history once Git is initialized; no Git metadata exists to audit now.
3. A clean GitHub-hosted Node 24/pnpm install and the Actions workflow have not been executed. Local checks used the installed Node v26.13.0 runtime and pnpm 11.25.0; CI is configured for the documented Node 24 recommendation. The unchanged pnpm lockfile remains authoritative.
4. Only after approval, follow `DEPLOYMENT.md` to create/connect the repository, push reviewed source, configure Pages, and manually dispatch the first deployment. Environment required reviewers are optional and plan-dependent; dispatch otherwise authorizes immediate deployment following successful checks. No automatic push deployment is configured.
5. Future `/person/{id}/` and `/person/{id}/cv/` routes must derive each person's academic activities and relationships from the existing shared architecture. This release documents that direction and implements no migration.

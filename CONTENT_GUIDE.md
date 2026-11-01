# Academic content guide

The site is still a personal academic website. Its shared, file-based records are ready for future group use. You can update academic information by editing JSON files without changing Astro pages. Keep one record per academic entity. Examples below are synthetic and must not be presented as real achievements.

## Where to edit

All paths below are relative to this project folder.

```text
src/data/
  people/ye-chao-liu.json       primary person's academic record
  people/<person-id>.json      one record per future person
  projects/<project-id>.json   one record per real project
  publications/<work-id>.json  one canonical record per academic work
  activities/<activity-id>.json one record per activity
  research.ts                 four editorial research narratives
  site.ts                     featured person, title, navigation, display policy
  schema.ts                   field definitions and reference validation
  academic.ts                 shared loading, sorting, relationship queries
public/images/
  people/ye-chao-liu.jpg       configured local academic portrait
  projects/<project-id>.jpg   optional project images
```

JSON uses double quotes, no comments, and no trailing commas. Every file's `id` must match its filename. Use lowercase slugs with hyphens; keep IDs stable after records are linked or public anchors exist. Do not rename the current publication IDs or highlight IDs when a title changes.

## Relationships: enter each connection once

- **Project → people:** `participants` stores `personId` and the person's actual role. Use `Principal Investigator`, `Project Leader`, `Project Member`, or `Collaborator` as factually appropriate; other accurate role labels also work. The two existing projects retain Project Member.
- **Publication → people:** `authors` is an ordered list. Add `personId` only for people with a local profile. External coauthors need only their name; never create empty profiles for them. `authorRoles` records verified first/corresponding/equal-contribution facts by internal person ID. This metadata is retained and validated but is not publicly rendered. Maintain it when updating a work; never change the author order to represent contribution roles. The presentation policy is `site.publications.showAuthorRoles: false` in `src/data/site.ts`; a future deliberate change can restore labels in the shared component.
- **Publication → projects and highlights:** `projectIds` and `highlightIds` store stable IDs. Never infer grant attribution or project membership from similar subjects.
- **Activity → people and projects:** `participants` contains person IDs and activity roles; `projectIds` is optional in meaning but always present as an array.
- **Project → highlights:** `highlightIds` may connect verified project scope to editorial narratives.

People's publications, projects, and activities are derived from these links. Projects' publications/activities and highlights' representative publications are also derived. Do not duplicate those lists inside the People file. The helpers in `academic.ts` already expose these views for future directories and detail pages. No future group pages have been created.

## 1. Update the primary person's profile

Edit `src/data/people/ye-chao-liu.json`. Name, affiliation, position, email, biography, introduction, research interests, photo, education, employment, and awards live here. Header, footer, Home, and About read this normal People record. `src/data/site.ts` selects it via `featuredPersonId` and controls the site title, description, navigation, research identity, and display rules. Change metadata there if the public identity changes.

`membership` is currently `null`: no research-group role has been asserted. You may record a verified membership later. Supported categories are Principal Investigator, Research Staff, Postdoctoral Researcher, PhD Student, Master's Student, Undergraduate Student, Collaborator, and Alumni; status is current, alumni, or external.

## 2. Add a researcher or student

Create `src/data/people/<person-id>.json` using the complete schema below. It will be validated automatically. Adding someone does not create a visible People page yet and does not replace the featured person. Future group routes can use the same record and shared relationship helpers.

Complete synthetic People example (`example-person.json`):

```json
{
  "id": "example-person",
  "name": "Example Researcher",
  "chineseName": "示例姓名",
  "position": "Example position",
  "affiliation": { "institution": "Example institution" },
  "bio": "Synthetic profile illustrating the file format.",
  "introduction": "Synthetic introduction for documentation only.",
  "researchInterests": [],
  "email": null,
  "photo": null,
  "profileLinks": [],
  "membership": null,
  "employment": [],
  "education": [],
  "awards": []
}
```

A verified external profile link is `{ "label": "ORCID", "url": "https://orcid.org/VERIFIED-ID" }`; replace the illustrative ID with the person's actual URL before use. Do not enter placeholder URLs as academic facts.

## 3. Add a person to a project

Add `{ "personId": "their-stable-id", "role": "Project Member" }` to the project's `participants` array. Create their People record first. A person can participate in several projects, and a project can have several people. Do not relabel participation as leadership. All records are shared; the current personal Projects page selects projects involving `featuredPersonId` automatically.

## 4. Create a real project

Create `src/data/projects/<project-id>.json`. Include only verified information; use `null` for unavailable descriptions, funding, end date, image, and URL. Status is planned, ongoing, completed, or completed-funding-period. The last status means only that the recorded funding period has ended, not that all scientific collaboration ended. Optional `fullDescription` supports future detail pages.

Complete synthetic Project example (`example-project.json`), linked to the synthetic person:

```json
{
  "id": "example-project",
  "title": "Synthetic project example — not a real funded project",
  "description": null,
  "startDate": "2026",
  "endDate": null,
  "status": "planned",
  "participants": [{ "personId": "example-person", "role": "Collaborator" }],
  "funding": null,
  "image": null,
  "url": null,
  "highlightIds": []
}
```

For verified funding use `{ "funder": "Actual agency", "reference": "Verified grant number" }`. An image uses `{ "src": "images/projects/actual-project.jpg", "alt": "Accurate image description" }`. Place the real file under `public/` first. Paths exclude the `public/` prefix and work with GitHub Pages base paths.

## 5–6. Add a journal publication or preprint

Create `src/data/publications/<work-id>.json`. Maintain the exact full author order. Use a `personId` only on an author with a local People record. The featured person's papers appear on Home and Publications automatically. Use one record for the work's entire lifecycle, including arXiv and journal versions.

Complete synthetic Publication example (`example-work.json`):

```json
{
  "id": "example-work",
  "title": "Synthetic publication example — not an academic claim",
  "authors": [{ "name": "Example Researcher", "personId": "example-person" }],
  "year": 2026,
  "status": "preprint",
  "venue": "Synthetic venue for documentation only",
  "publicationDate": null,
  "preprintDate": "2026",
  "acceptanceDate": null,
  "doi": null,
  "arxiv": null,
  "url": "https://example.invalid/example-work",
  "pdf": null,
  "abstract": null,
  "authorRoles": [],
  "projectIds": ["example-project"],
  "highlightIds": []
}
```

For a journal article set `status` to `published`, `publicationDate` to the verified date at known precision, and `year`/`venue` to its actual bibliographic values. For a preprint use `preprint`; `submitted` is also supported when verified. Dates accept `YYYY`, `YYYY-MM`, or `YYYY-MM-DD` only. Do not invent a month or day. DOI values exclude `https://doi.org/`; arXiv values exclude `arXiv:`. An optional `preprintDoi` retains the original preprint DOI when `doi` is updated to the journal DOI; it does not create another publication record. Keep both identifiers when known. At least one DOI, arXiv ID, or verified URL is required. `pdf` is an optional HTTP(S) PDF URL, and `abstract` is optional text represented by `null` when absent.

## 7. Update accepted → published

Edit the existing file; do not add a second record or change its ID. Accepted-but-unpublished records have `status: "accepted"`, actual journal/acceptance information in `venue`, and a verified `acceptanceDate` if known. Keep `publicationDate: null` until formally published. They appear under **Preprints**, with their Accepted status visible.

When formally published, update `status`, `year`, `venue`, `publicationDate`, and the journal DOI if newly available. Preserve `arxiv`, `preprintDate`, and acceptance history. The Toolbox record illustrates accepted status with a retained 2025 preprint and verified 2026 acceptance. Do not infer formal publication from acceptance.

The Publications page is one chronological list, with **All** selected initially. **Published** includes only `published`; **Preprints** includes preprint, submitted, and accepted records. Exact Accepted/Submitted status remains visible. Home and Publications use the same publication/acceptance/preprint-date sorting helper, with stable ID ties when precision is equal; no unsupported within-year chronology is claimed. At most 10 records are shown per page. Filters and search reset to page 1. Pagination is hidden for 10 or fewer matches, and links to a specific paper automatically reveal its page. Without JavaScript the full bibliography remains available as a readable fallback.

## 8. Link publications to research narratives and projects

Publication-to-project links are maintained manually in each publication JSON through `projectIds`, for example `"projectIds": ["frank-wolfe-entanglement"]` only when that attribution is verified. Do not copy a publication into a project file. The existing arrays remain empty where attribution has not been verified.

Set `highlightIds` to any applicable existing IDs: `verification`, `imperfect`, `preparation`, `computation`. They correspond to the four confirmed narratives in order. A publication can appear in multiple highlights while remaining one record. `projectIds` can similarly contain several real project IDs. Leave empty when attribution is unverified.

`src/data/research.ts` holds the canonical title, short summary, detailed paragraphs, ID, and order. Home and Research use the same title and summary. Representative paper lists are derived from publication `highlightIds`; projects can independently use `highlightIds`. Do not turn research highlights into artificial funded projects.

## 9–10. Add an activity and understand the latest five

Create `src/data/activities/<activity-id>.json`. Date formats follow the precision rules above. `null` explicitly means no reliable date. Never use today's date to fill a missing date. Optional fields are `location`, `organizer`, and `description`.

Complete synthetic Activity example (`example-seminar.json`):

```json
{
  "id": "example-seminar",
  "type": "seminar",
  "title": "Synthetic seminar example — not an actual event",
  "date": null,
  "participants": [{ "personId": "example-person", "role": "Speaker" }],
  "projectIds": ["example-project"],
  "links": []
}
```

Supported types: invited-talk, talk, poster, seminar, academic-visit, workshop, academic-service, other. Links use `{ "label": "Event", "url": "https://verified-event-url" }` with a verified HTTP(S) URL.

About selects activities containing the featured person's ID, sorts descending by the recorded date, places undated records last, uses ID order for ties, and takes `site.about.activityLimit` (currently 5). Complete history remains intact. At present the five are CEMEE 2025, MATH+ Day 2025, MATH+ Spotlight 2025, SAMOP Bonn 2025, and QPQIS 2024. Three undated refereeing records are retained as academic-service activities, not assigned fictional dates.

## 11. Update honors and awards

Edit the person's `awards` array: each entry needs `id`, `year`, `title`, and `institution`. About displays only IDs listed in `site.about.awardIds` in `src/data/site.ts`; all other verified awards remain in the person record. The current selection is the 2022 Outstanding Doctoral Dissertation and 2021 Outstanding Graduate of High Education in Beijing. Education `supervisors` and `thesis` fields remain available as academic history but are not rendered on About.

## 12. Replace the academic portrait

The supplied `public/images/people/ye-chao-liu.jpg` is now present and the People record already activates it. Its URL is served through the base-aware `href` helper; the filename and extension must exactly match the record. If an older placeholder remains visible, reload the local page and ensure you are viewing the running server for this workspace. Restart `pnpm dev` if the server is stale.

Add the real image at `public/images/people/ye-chao-liu.jpg`. In the primary person's JSON replace `"photo": null` with:

```json
"photo": {
  "src": "images/people/ye-chao-liu.jpg",
  "alt": "Academic portrait of Ye-Chao Liu"
}
```

The existing reusable `PersonPortrait.astro` automatically replaces the placeholder. No page changes are needed. Other people use their own IDs and image paths. The build rejects missing image files. Use optimized photographs and remove location/private metadata before placing any image in a public repository.

## 13. Change email

Edit only `email` in the People record. The footer reads it directly as a `mailto:` link. Current address: `ye-chao-liu@hainanu.edu.cn`. No Contact & Profiles section is displayed. Profile links remain optional source fields for future use.

## 14–15. Preview and validate

Node.js 24 is recommended; the validator uses Node's native TypeScript stripping. Install existing dependencies with `pnpm install` if needed. From the project folder:

```sh
pnpm validate:content
pnpm check
pnpm dev
```

Open the printed local address, normally http://127.0.0.1:4321/. Changes reload locally. Stop with Ctrl+C. Build with:

```sh
pnpm build
pnpm audit:site
pnpm preview
```

`pnpm build` runs content validation first, then generates `dist/`. Validation checks required fields, allowed statuses/types, real partial dates, filename/ID consistency, duplicate IDs and DOI/arXiv identifiers, internal people/project/highlight references, selected awards, and image existence. Fix reported errors before publishing. `pnpm test:content` checks the validator's rejection of malformed and broken relationships in memory; it never mutates the real records.

## 16. Future GitHub updates and privacy

No repository or deployment is created by these instructions. When you choose to use GitHub, create your repository and review a branch/commit containing the intended source changes and lockfile. Use pull requests for review; build before merging. The origin is fixed in `astro.config.mjs` as `https://ye-chao-liu.github.io` with the default root base `/`. Follow `DEPLOYMENT.md` for the manual-only GitHub Actions workflow. Deployment remains a separate explicit choice.

Source JSON is public if committed to a public repository, even for fields the site hides. Retain appropriate academic history, not dates of birth, home addresses, private numbers, financial details, or job-application records. The supplied historical `cv_liu.tex` was sanitized locally; it is archival source, not a second current content database. There is no Git history in this workspace to rewrite. If an earlier version has been committed elsewhere, review that repository's history separately before making it public. The build does not copy source JSON or the CV to `dist/`; avoid manually copying them to `public/`. Do not commit `node_modules`, generated output, secrets, or private attachments.

## Migration map

- `profile.ts` → `people/ye-chao-liu.json`: profile, employment, education, six awards. Service → three undated activity records; old programming-skills display removed.
- Activities formerly embedded in `profile.ts` → thirteen independent dated `activities/*.json` records, preserving month precision.
- `projects.ts` → two `projects/*.json` records with stable IDs and actual participation roles.
- `publications.ts` → sixteen `publications/*.json` records. Author order, identifiers, and bibliographic facts retained; author strings became ordered author objects.
- `research.ts` remains editorial data; canonical summaries updated. Former highlight paper lists moved into each publication's `highlightIds`, with no duplicated works.
- Former hardcoded site identity/navigation → `site.ts` and the featured People record.

No unresolved internal references remain. The supplied portrait is configured; optional external profile links await verified URLs. No project-to-publication attribution or research-group leadership was invented.


## Limited 2026 bibliography check (V3.2)

APS confirms the nonstabilizer paper as Physical Review Applied 26, 014074, published 23 July 2026, accepted 2 June 2026: https://journals.aps.org/prapplied/abstract/10.1103/4hxp-fswy . The Toolbox paper remains an accepted Physical Review A paper, accepted 14 October 2026, with journal DOI 10.1103/tfsh-lwdj: https://journals.aps.org/pra/accepted/10.1103/tfsh-lwdj . No volume, article number, or formal publication date is assigned to that accepted record. Its original preprint DOI is retained in `preprintDoi`, with arXiv:2507.17435 and existing preprint history preserved. Author order, roles, stable IDs, and relationship IDs were not changed.

## Pre-release maintenance and future person CVs

Publication filenames have been restored to their internal stable IDs (`scattering.json` through `nonstabilizer.json`, plus `tensor.json` and `toolbox.json`). Publication dates belong inside records, never in filenames. The pre-release rename preserved all 16 JSON files byte-for-byte, including dates, author roles, and all project/highlight links. Keep these filenames stable for future updates.

The shared layout emits canonical URLs for real pages. The 404 page is `noindex`, with no canonical; it is excluded from the sitemap. `src/pages/sitemap.xml.ts` derives the five current routes from site navigation, and `src/pages/robots.txt.ts` points to it. If adding non-navigation detail pages in the future, extend the sitemap generator and audit route list together.

The portrait's EXIF/XMP metadata (including a GPS directory) was removed losslessly before release; its compressed image data, orientation, and visible appearance are preserved. Strip private metadata from replacement photos too. `.gitignore` excludes local credentials, logs, generated output, and historical `previews/`; it does not make files already committed elsewhere private.

Future architecture: each person will have `/person/{id}/` and `/person/{id}/cv/`. Each CV should use that person's People record and query their publications, projects, and academic activities via existing helpers. Maintain activity ownership through person IDs in `participants`, preserving shared events and full history. Do not embed duplicate activity lists in People records. No migration or new person routes are part of this release preparation.

For the release procedure and unresolved verification limits see `DEPLOYMENT.md` and `PRE_RELEASE_AUDIT.md`.

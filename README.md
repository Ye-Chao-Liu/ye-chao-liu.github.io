# Ye-Chao Liu — academic website

Astro static personal academic website with an editorial design and a file-based academic content system. Nothing has been deployed.

## Run

Node.js 24 recommended (native TypeScript stripping is used for content validation).

```sh
pnpm install
pnpm dev
```

Open http://127.0.0.1:4321/ or the address printed by Astro.

```sh
pnpm validate:content
pnpm test:content
pnpm check
pnpm build
pnpm preview
```

The production build validates academic records, references, and assets before generating `dist/`. See [CONTENT_GUIDE.md](CONTENT_GUIDE.md) for the exact schema, valid examples, and all content maintenance procedures.

## Content and architecture

- `src/data/people/*.json`: canonical People records, including the featured `ye-chao-liu.json`.
- `src/data/projects/*.json`: real projects and participant roles.
- `src/data/publications/*.json`: one record per work, ordered authors, publication status and identifiers.
- `src/data/activities/*.json`: full independent academic activity history.
- `src/data/research.ts`: canonical editorial highlights, shared titles/summaries and longer descriptions.
- `src/data/site.ts`: site identity, featured person, navigation, selected awards, and activity display limit.
- `src/data/schema.ts` / `academic.ts`: validation and shared relationship/sorting helpers.
- `public/images/people/` / `public/images/projects/`: approved local photographs.
- `src/components/PersonPortrait.astro`: data-driven real portrait or labeled placeholder.
- `src/components/ResearchDiagram.astro`: unchanged approved accessible Web Network SVG.
- `src/layouts/Layout.astro` / `src/styles/global.css`: shared layout and responsive editorial styles.

A person can participate in multiple projects. Publications and activities remain shared records, linked by stable IDs. Inverse relationships are derived rather than duplicated. Only verified actual people/projects are present; no empty future group pages exist. The three superseded content arrays were migrated, not kept as competing sources.

There are 16 canonical works: 14 published, one accepted, one preprint. The unified chronological Publications list has All, Published, and Preprints filters and 10 records per page. Accepted-but-unpublished works are included by Preprints while retaining Accepted status. Author-role metadata is retained in JSON but is not publicly rendered. About displays two selected awards and the latest five activities; full academic history remains in source records. Supervisors and theses remain in source but are not rendered. Current email comes from the People record.

## Review and privacy

The supplied historical `cv_liu.tex` is now sanitized academic source: private birth/contact/address details and job-application material were removed. It is not the current content store. Source data is not private merely because the UI hides it. The current workspace has no Git history; any separate prior repository needs its own privacy review before publication.

The supplied portrait at `public/images/people/ye-chao-liu.jpg` is activated through the person's `photo` field. External profile URLs remain optional and unfilled. No academic results or funding relationships were invented. All original DOI/arXiv links are retained.

## Languages and future expansion

English remains primary. `src/i18n/ui.ts` retains the Chinese translation scaffold and base-aware URL helper; Chinese names are preserved. No Chinese routes existed in the current prototype. Future translated pages and people/project detail routes can consume the same academic records and helpers.

## GitHub Pages release preparation

The target is `https://ye-chao-liu.github.io/`, repository `Ye-Chao-Liu/ye-chao-liu.github.io`. Astro uses this origin and the default root base `/`; no environment override or repository prefix is needed.

The manual-only workflow is `.github/workflows/deploy.yml`. It uses the [official Astro action](https://docs.astro.build/en/guides/deploy/github/) with Node 24 and detects pnpm from the retained `pnpm-lock.yaml`; `package.json` pins the existing pnpm 11.25.0 version. It validates/tests content, checks Astro, builds, audits output, and uploads before the separate deployment job. No push or pull-request deployment trigger is enabled.

See [DEPLOYMENT.md](DEPLOYMENT.md) for repository setup and manual first-deployment approval. See [PRE_RELEASE_AUDIT.md](PRE_RELEASE_AUDIT.md) for changes, verification, privacy findings, and outstanding review. No remote repository, commit, push, or deployment was performed during preparation.

After `pnpm build`, run `pnpm audit:site` for generated internal links, assets, anchors, canonical URLs, basic semantic checks, sitemap/robots, and publication order. Optional `pnpm audit:site --external` writes external URL reachability results to ignored `previews/pre-release-links.json`; network failures require manual review and do not imply incorrect academic identifiers. Recheck external links before release.

`previews/` contains historical V1–V3.2 review images and notes. It is ignored for the future repository but remains on disk. The archival `cv_liu.tex` remains source, with one malformed journal URL corrected. No academic source records were deleted.

## Future person profiles and CVs

Preserve People–Projects–Publications and the shared activities collection. A future person profile at `/person/{id}/` and CV at `/person/{id}/cv/` should read the same canonical People record and derive publications, project participation, and academic activities through the existing relationship helpers. Keep each person's CV activities associated through `participants[].personId`; a shared event can belong to multiple CVs without duplication. The current `/about/` remains unchanged. This direction is documented only; no routes or data migration are implemented.

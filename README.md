# AI Adoption Radar

## Selected working version — 13 September 2026

The team selected the supplied `index Kopie.html` as the basis for further work.
Its design, copy and interactions have been imported unchanged into **`public/index.html`**.
This is the active prototype and the file to edit for changes to the selected variant.

The prototype follows **Data → Diagnosis → Recommendations**, with four adoption signals:
relevance, trust and anxiety, skills, and governance. Its built-in synthetic profile
prioritizes trust and anxiety.

## Open the prototype

With Node.js 22+ and pnpm 11.19.0 installed:

```sh
pnpm install
pnpm dev
```

Open **http://127.0.0.1:3000** in a browser. Stop the server with Ctrl+C.
Alternatively, open `public/index.html` directly in a browser; the selected prototype
is self-contained and needs no server or external services.

For the demo, click **Demo-Datensatz verwenden**, then **Analysieren**.
Explore **Mehr Infos**, continue to **Zu den Empfehlungen**, and try **Ja, Plan erstellen**.

## Technical integration

- Next.js, TypeScript and Tailwind CSS remain installed from the first dashboard.
- `next.config.ts` serves `public/index.html` at `/` using a `beforeFiles` rewrite.
- The selected interface is currently plain HTML/CSS/JavaScript, not a React conversion.
- The previous React dashboard in `app/` remains preserved but is not the active start view.
- File reading and calculations happen locally in the browser.
- No backend, AI API, storage or external integrations are connected.
- The existing Next.js build can still be used for Vercel. No deployment has been performed.

```sh
pnpm build
pnpm start
```

## Actual implementation and known gaps

The supplied README describes a more extensive MVP than the supplied HTML implements.
It is preserved verbatim as `docs/selected-variant-original-readme.md` for reference;
its feature and research claims should not be read as verified implementation status.

The selected HTML currently:

- Provides file selection and drag-and-drop for three source categories, a synthetic
  demo profile, a demo CSV download, four weighted signal scores, expandable explanations,
  and recommendations for the highest-scoring signal. Higher scores mean greater need for action.
- Parses CSV files only. Although the interface accepts XLSX, PDF and Word files, their
  contents are not parsed or used as context. JSON parsing is not implemented.
- Substitutes demo values for missing CSV metrics, or the entire demo profile if no usable
  CSV values are found. This is a prototype fallback, not evidence extracted from those files.
- Averages recognized CSV values across rows. Department selection, measurement history,
  Pearson correlations, required-field validation and a minimum-headcount check are absent.
- Uses weighted scores to select one priority; the threshold-based multi-pathway rule engine
  described in the supplied README is not implemented.
- Shows a confirmation after **Ja, Plan erstellen**; it does not generate or save an actual
  plan with owners, dates or success measures.

Use synthetic demo data while developing this version. The existing gaps are documented
here without silently changing the team's selected design or behavior during import.

## Reference files

- `docs/selected-variant-original-readme.md`: supplied product concept, unchanged.
- `docs/previous-dashboard-readme.md`: documentation of the earlier React dashboard.
- `sample_data/`: existing sample-data placeholder.

Built for the AI.WOMEN Hackathon 2026.

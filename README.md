# AI Adoption Radar

AI-powered diagnostic tool to identify what is blocking AI adoption in organizations.

## Problem

Many organizations invest in AI tools, training and guidelines, but adoption still differs significantly across teams.

The challenge is often not knowing whether the main blocker is trust, relevance, skills, governance or leadership.

## Our idea

The AI Adoption Radar analyzes different organizational signals such as:

- aggregated AI usage data
- anonymized employee feedback
- AI guidelines and policies

It combines these signals to identify likely adoption blockers, show the supporting evidence and recommend concrete next actions.

## Hackathon

Built during the AI.WOMEN Hackathon 2026.

## Development status

Initial repository setup complete.

## Current Next.js prototype

The English interface from `index Kopie (1).html` is implemented in React in
`app/page.tsx`, with the reference styles in `app/globals.css`. It follows
Data → Diagnosis → Recommendations and uses the Customer Service demo scenario
with Relevance as the primary blocker (action priority 87/100).

The active interface uses Next.js, React and TypeScript. No static HTML rewrite
or iframe is used. Team changes and sample data from `origin/main` are retained.

### Run locally

Requires Node.js 22+ and pnpm 11.19.0.

```sh
pnpm install
pnpm dev
```

Open http://127.0.0.1:3000. Use **Use demo dataset → Analyze → View recommendations**.

```sh
pnpm typecheck
pnpm build
pnpm start
```

### Implementation boundaries

- `lib/analysis.ts` contains CSV parsing, training metrics and the weighted scoring
  formulas from the latest HTML. `lib/scenarios.ts` contains its scenario copy.
- CSV processing takes place in the browser. Missing metrics use the synthetic
  demo profile, as in the reference; the interface labels that fallback.
- XLSX, PDF and Word contents are not parsed. No AI service or backend is connected.
- Evidence for Relevance retains the reference's 120-person demo cohort and
  illustrative employee statements; it is not a verified analysis of real feedback.
- The accompanying reference README describes additional features (JSON validation,
  department selection, history and correlations) absent from the HTML; these
  were not added as part of this migration.
- The reference links to `customer-service-ai-use-case-discovery-workshop-v3.pptx`
  and `.pdf`. Neither file was supplied. Download controls are therefore disabled
  with an explanation; the workshop action displays a local preview state only.
- Sample data remains unchanged. No deployment has been performed.

### Team notes and reference files

- The prototype supports three source categories, file selection and drag-and-drop,
  a synthetic demo profile, CSV download, four weighted action-priority scores,
  expandable explanations and recommendations for the highest-scoring signal.
- Higher scores indicate greater need for action, not stronger adoption health.
- Required-field validation, a minimum-headcount check, department selection,
  measurement history and Pearson correlations are not implemented. Use synthetic data.
- No backend, authentication, storage or external integration is connected.
- The Next.js project can be deployed using Vercel's Next.js preset.
- `docs/selected-variant-original-readme.md` preserves the earlier product concept;
  its feature and research claims are not verified implementation status.
- `docs/previous-dashboard-readme.md` documents the earlier React dashboard.
- `public/index.html` preserves the earlier HTML prototype and is not the current start page.
- `sample_data/` contains the team's Customer Service usage, employee survey,
  training and AI use case examples, preserved unchanged from `origin/main`.

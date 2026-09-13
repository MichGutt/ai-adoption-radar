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

The current `final-website-update` branch originally contained only the initial
README and sample-data placeholder. The existing Next.js project configuration
was recovered from the local `michelle-prototype-ui` branch without merging or
changing sample data. No static HTML rewrite or iframe is used.

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
- Sample data remains unchanged. No commit, push or deployment was performed.

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

## Dashboard prototype

A single-screen dashboard built with Next.js (App Router), TypeScript and Tailwind CSS.
All scores, trends, survey responses and organizational context are synthetic demo data defined in `app/page.tsx`. They are not computed from real data. The health index is an illustrative value, not an average of the radar scores. Higher radar scores indicate stronger readiness.

- Marketing is the only available business area in this MVP.
- Select a radar dimension to inspect its demo insight.
- **Create workshop** expands an inline agenda preview. Nothing is saved or sent.
- No backend, authentication or external AI service is connected.

### Local development

Requires Node.js 22+ and pnpm 11.19.0.

```sh
pnpm install
pnpm dev
```

Open http://localhost:3000 in your browser. Stop the server with Ctrl+C.

```sh
pnpm typecheck
pnpm build
pnpm start
```

For Vercel, import the repository and use the detected Next.js framework preset with the repository root as the root directory. No environment variables are required for this prototype. It has not been deployed.

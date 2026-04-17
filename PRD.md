# ViralKit — Product Requirements Document

## Problem
Technical teams at startups and SaaS companies want organic, sustainable user growth but lack purpose-built tools to embed viral mechanics (referrals, waitlists, tier unlocks) directly into their product code. Existing solutions are marketing-heavy platforms aimed at non-technical operators, forcing developers to either build viral loops from scratch or shoehorn marketing tools into their codebase. ViralKit gives developers a code-first toolkit to implement, measure, and iterate on viral loops in minutes instead of weeks.

## Target Users
**Growth engineers and full-stack developers** at early-to-mid-stage SaaS startups (Series A–B) who are responsible for both building product features and driving user acquisition. They write code daily, prefer SDKs and APIs over GUIs for integration, and need measurable growth metrics to justify engineering investment.

## Core Features

### Must Have

- **SDK Snippet Generator**: Generates ready-to-use code snippets (React, JavaScript, REST API) for configurable viral loop templates — waitlist unlocks, referral links, and freemium tier gates. Developers select a template, configure parameters (incentive type, threshold, reward), and copy the generated snippet. — Acceptance Criteria: Developer selects a viral loop template, configures at least 3 parameters, and receives a copy-paste-ready code snippet within 30 seconds.

- **K-Factor Analytics Dashboard**: Displays real-time viral coefficient (K-factor), calculated as average invitations sent per user multiplied by invitation-to-signup conversion rate. Includes a time-series chart for K-factor trend, total invites sent, conversion rate, and active loop participant count. — Acceptance Criteria: Dashboard loads and displays K-factor value, invite count, conversion rate, and a 30-day trend chart within 2 seconds of page load using mock data.

- **Incentive Logic Builder**: A visual rule builder where developers define trigger-condition-reward logic (e.g., "user refers 3 friends → unlock Pro tier"). Supports threshold-based rewards (N referrals → reward), waitlist position mechanics (position advances with referrals), and tiered incentives (milestone rewards at 1, 5, 10 referrals). Rules are output as a JSON configuration usable by the generated SDK. — Acceptance Criteria: User creates a valid incentive rule with trigger, condition, and reward fields, and the system outputs a valid JSON config object that matches the rule definition.

- **Loop Template Library**: A curated gallery of pre-built viral loop patterns (waitlist, referral link, tiered rewards, team invites) with descriptions, use-case tags, and one-click adoption. Each template includes a preview of the generated code and expected K-factor impact. — Acceptance Criteria: Gallery displays at least 5 templates with name, description, category tag, and a "Use Template" action that loads it into the Snippet Generator.

- **Live Preview Panel**: Renders a real-time browser-like preview of how the viral loop will appear to end-users (share modal, referral page, waitlist widget) based on the current configuration. Updates instantly as developers adjust parameters. — Acceptance Criteria: Preview panel updates within 500ms of any parameter change and renders a visually accurate representation of the selected loop type.

### Should Have

- **Code Export & Integration Guide**: One-click export of generated code as a downloadable file or clipboard copy, accompanied by a step-by-step integration guide (where to paste code, required dependencies, environment variables). — Acceptance Criteria: Exported code runs without modification in a fresh React + Vite project.

- **A/B Loop Variant Testing**: Ability to define two variants of the same viral loop with different incentive structures and track which achieves a higher K-factor, with statistical significance indicators. — Acceptance Criteria: User can create two variants and see a comparison view with conversion metrics for each.

### Out of Scope (v1)
- **Backend SDK / server-side event processing** — v1 is a frontend dashboard and code generation tool; actual event tracking requires a separate backend service.
- **Third-party integrations (Segment, Mixpanel, etc.)** — will be added post-launch based on user demand.
- **User authentication and multi-tenant workspace management** — v1 operates as a single-user developer tool with local storage.
- **Mobile SDK generation** — v1 focuses on web (React/JavaScript); mobile snippets are a future priority.

## Success Metrics
- Primary: Developer generates their first working code snippet within 60 seconds of landing on the app.
- Secondary: Incentive Logic Builder produces a valid, exportable JSON config on first attempt for 90% of users.

## Design Principles
- **Developer-first, not marketer-first**: Every UI element should feel like a dev tool — monospace fonts for code, syntax highlighting, keyboard shortcuts, and minimal chrome. The analytics dashboard should feel like a Grafana panel, not a marketing report.
- **Progressive disclosure**: Start with a template selection (low friction), reveal configuration options contextually, and show the code output and preview only when parameters are set. Never overwhelm with all options at once.
- **Immediate feedback**: Every parameter change updates the code output and live preview in real-time. No "Generate" button — the output is always live.

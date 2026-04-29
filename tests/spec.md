# Test Specifications

## Unit Tests (Vitest + React Testing Library)

### SnippetGenerator.test.tsx
- [x] renders without crash
- [x] displays template selection dropdown with at least 5 viral loop templates
- [x] generates code snippet when a template is selected
- [x] updates code output in real-time when parameters change (no "Generate" button)
- [x] copies snippet to clipboard when "Copy" button is clicked
- [x] shows empty state with prompt to select a template when no template is chosen

### KFactorDashboard.test.tsx
- [x] renders without crash
- [x] displays K-factor value prominently in the header metric card
- [x] shows invite count, conversion rate, and active participants as metric cards
- [x] renders a 30-day trend chart for K-factor history
- [x] loads and displays data within 2 seconds using mock analytics data
- [x] shows "No data yet" state when no analytics events exist

### IncentiveBuilder.test.tsx
- [x] renders without crash
- [x] adds a new incentive rule when "Add Rule" button is clicked
- [x] validates that trigger, condition, and reward fields are all filled before enabling export
- [x] outputs a valid JSON config object matching the defined rule structure
- [x] supports threshold-based reward type (N referrals → reward)
- [x] supports waitlist position mechanics reward type
- [x] supports tiered milestone rewards (multiple thresholds)
- [x] removes an incentive rule when delete action is triggered
- [x] shows validation error if reward field is empty on export attempt

### TemplateLibrary.test.tsx
- [x] renders without crash
- [x] displays at least 5 template cards with name, description, and category tag
- [x] filters templates by category when a filter chip is selected
- [x] loads selected template into SnippetGenerator when "Use Template" is clicked
- [x] highlights the currently active template

### LivePreview.test.tsx
- [x] renders without crash
- [x] displays a preview panel that reflects the currently configured viral loop
- [x] updates preview within 500ms when a parameter changes in SnippetGenerator
- [x] renders different preview layouts based on loop type (waitlist, referral, tiered)
- [x] shows placeholder state when no loop is configured

### App.test.tsx
- [x] renders without crash
- [x] displays navigation sidebar with links to Generator, Analytics, Builder, Templates
- [x] navigates to correct route when sidebar link is clicked
- [x] persists last-selected template to localStorage and restores on reload

### ErrorBoundary.test.tsx (improvement)
- [x] renders children when no error occurs
- [x] renders fallback UI when a child component throws
- [x] displays the error message in the fallback
- [x] renders custom fallback when provided

## User Journey Tests

### Primary Workflow: Generate and Export a Referral Loop
- [x] App loads → Dashboard shows K-factor analytics with mock data, sidebar shows navigation
- [x] User clicks "Templates" in sidebar → Template Library displays 5+ viral loop templates
- [x] User selects "Referral Link" template → Template loads into SnippetGenerator with default parameters
- [x] User adjusts incentive threshold → Code snippet updates instantly, Live Preview updates to show referral modal
- [x] User clicks "Copy" on code snippet → Clipboard contains valid React component code
- [x] User navigates to "Builder" → Incentive Logic Builder shows rule form
- [x] User exports the incentive config → Valid JSON config is copied to clipboard

### Analytics Workflow
- [x] User navigates to "Analytics" → K-Factor Dashboard loads with mock data
- [x] Dashboard shows K-factor value, invite count, conversion rate, participant count
- [x] 30-day trend chart renders with historical data points
- [x] User can identify whether K > 1 (exponential growth indicator)

## Acceptance Criteria Checklist
(Reviewer verifies these against PRD.md Must Have features)
- [x] AC: Developer selects a viral loop template, configures at least 3 parameters, and receives a copy-paste-ready code snippet within 30 seconds.
- [x] AC: Dashboard loads and displays K-factor value, invite count, conversion rate, and a 30-day trend chart within 2 seconds of page load using mock data.
- [x] AC: User creates a valid incentive rule with trigger, condition, and reward fields, and the system outputs a valid JSON config object that matches the rule definition.
- [x] AC: Gallery displays at least 5 templates with name, description, category tag, and a "Use Template" action that loads it into the Snippet Generator.
- [x] AC: Preview panel updates within 500ms of any parameter change and renders a visually accurate representation of the selected loop type.

## Improvement Iteration (v1.2.0)
- [x] Made mock analytics data deterministic with seeded PRNG (was using Math.random)
- [x] Lazy-loaded LivePreview component (reduces app shell from 338KB to 12.66KB)
- [x] Added ErrorBoundary component wrapping all major views
- [x] Added user journey integration tests (Primary Workflow + Analytics Workflow)
- [x] Split React into separate vendor chunk for better browser caching
- [x] Improved form accessibility in IncentiveBuilder (label htmlFor associations)

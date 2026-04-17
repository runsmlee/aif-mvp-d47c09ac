# Test Specifications

## Unit Tests (Vitest + React Testing Library)

### SnippetGenerator.test.tsx
- [ ] renders without crash
- [ ] displays template selection dropdown with at least 5 viral loop templates
- [ ] generates code snippet when a template is selected
- [ ] updates code output in real-time when parameters change (no "Generate" button)
- [ ] copies snippet to clipboard when "Copy" button is clicked
- [ ] shows empty state with prompt to select a template when no template is chosen

### KFactorDashboard.test.tsx
- [ ] renders without crash
- [ ] displays K-factor value prominently in the header metric card
- [ ] shows invite count, conversion rate, and active participants as metric cards
- [ ] renders a 30-day trend chart for K-factor history
- [ ] loads and displays data within 2 seconds using mock analytics data
- [ ] shows "No data yet" state when no analytics events exist

### IncentiveBuilder.test.tsx
- [ ] renders without crash
- [ ] adds a new incentive rule when "Add Rule" button is clicked
- [ ] validates that trigger, condition, and reward fields are all filled before enabling export
- [ ] outputs a valid JSON config object matching the defined rule structure
- [ ] supports threshold-based reward type (N referrals → reward)
- [ ] supports waitlist position mechanics reward type
- [ ] supports tiered milestone rewards (multiple thresholds)
- [ ] removes an incentive rule when delete action is triggered
- [ ] shows validation error if reward field is empty on export attempt

### TemplateLibrary.test.tsx
- [ ] renders without crash
- [ ] displays at least 5 template cards with name, description, and category tag
- [ ] filters templates by category when a filter chip is selected
- [ ] loads selected template into SnippetGenerator when "Use Template" is clicked
- [ ] highlights the currently active template

### LivePreview.test.tsx
- [ ] renders without crash
- [ ] displays a preview panel that reflects the currently configured viral loop
- [ ] updates preview within 500ms when a parameter changes in SnippetGenerator
- [ ] renders different preview layouts based on loop type (waitlist, referral, tiered)
- [ ] shows placeholder state when no loop is configured

### App.test.tsx
- [ ] renders without crash
- [ ] displays navigation sidebar with links to Generator, Analytics, Builder, Templates
- [ ] navigates to correct route when sidebar link is clicked
- [ ] persists last-selected template to localStorage and restores on reload

## User Journey Tests

### Primary Workflow: Generate and Export a Referral Loop
1. App loads → Dashboard shows K-factor analytics with mock data, sidebar shows navigation
2. User clicks "Templates" in sidebar → Template Library displays 5+ viral loop templates
3. User selects "Referral Link" template → Template loads into SnippetGenerator with default parameters
4. User adjusts incentive threshold to "3 referrals" → Code snippet updates instantly, Live Preview updates to show referral modal
5. User clicks "Copy" on code snippet → Clipboard contains valid React component code
6. User navigates to "Builder" → Incentive Logic Builder shows the rule loaded from template selection
7. User exports the incentive config → Valid JSON config is downloaded/copied

### Analytics Workflow
1. User navigates to "Analytics" → K-Factor Dashboard loads with mock data
2. Dashboard shows K-factor value, invite count, conversion rate, participant count
3. 30-day trend chart renders with historical data points
4. User can identify whether K > 1 (exponential growth indicator)

## Acceptance Criteria Checklist
(Reviewer verifies these against PRD.md Must Have features)
- [ ] AC: Developer selects a viral loop template, configures at least 3 parameters, and receives a copy-paste-ready code snippet within 30 seconds.
- [ ] AC: Dashboard loads and displays K-factor value, invite count, conversion rate, and a 30-day trend chart within 2 seconds of page load using mock data.
- [ ] AC: User creates a valid incentive rule with trigger, condition, and reward fields, and the system outputs a valid JSON config object that matches the rule definition.
- [ ] AC: Gallery displays at least 5 templates with name, description, category tag, and a "Use Template" action that loads it into the Snippet Generator.
- [ ] AC: Preview panel updates within 500ms of any parameter change and renders a visually accurate representation of the selected loop type.

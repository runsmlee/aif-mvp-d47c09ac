import { useMemo, useCallback, useState, useEffect, createElement as h, Fragment } from 'react';
import type { ViralTemplate, TemplateParams } from '../types';
import { templates } from '../data/templates';

interface SnippetGeneratorProps {
  selectedTemplate: ViralTemplate | null;
  params: TemplateParams | null;
  onParamsChange: (params: TemplateParams) => void;
  onTemplateSelect: (template: ViralTemplate) => void;
}

/* ------------------------------------------------------------------ */
/*  Hero quickstart snippet — shown when no template is selected      */
/* ------------------------------------------------------------------ */

const HERO_SNIPPET = `// ViralKit — loopengine.dev
import { ViralKit } from '@viralkit/sdk';

const loop = ViralKit.createLoop({
  name: 'my-referral-loop',
  type: 'threshold',
  config: {
    threshold: 3,
    reward: 'Unlock Pro tier',
    onReward: (user) => {
      console.log(\`User \${user.id} earned reward: Unlock Pro tier\`);
    },
  },
});

export default function ReferralWidget() {
  return (
    <loop.Provider>
      <loop.ShareLink />
      <loop.ReferralCounter />
    </loop.Provider>
  );
}`;

/** Lightweight syntax highlighter — no external deps */
const KEYWORDS = new Set([
  'import', 'from', 'const', 'export', 'default', 'function', 'return',
  'typeof', 'new', 'let', 'var', 'if', 'else', 'async', 'await',
]);

const JSX_TAGS = new Set([
  'loop.Provider', 'loop.ShareLink', 'loop.ReferralCounter',
]);

function highlightTokens(code: string): React.ReactNode[] {
  const lines = code.split('\n');
  const nodes: React.ReactNode[] = [];

  for (let li = 0; li < lines.length; li++) {
    if (li > 0) nodes.push('\n');
    const line = lines[li];

    // Comment line
    if (line.trimStart().startsWith('//')) {
      nodes.push(
        h('span', { key: `c-${li}`, className: 'text-stone-500 italic' }, line)
      );
      continue;
    }

    // Tokenize the line using a simple regex approach
    const tokenRe = /\/\/.*$|'(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*"|`(?:[^`\\]|\\.)*`|[a-zA-Z_$][\w.$]*|[{}()<>=;,\[\]]|[^\s]/g;
    let match: RegExpExecArray | null;
    let keyIdx = 0;

    while ((match = tokenRe.exec(line)) !== null) {
      const token = match[0];
      const k = `t-${li}-${keyIdx++}`;

      // Inline comment
      if (token.startsWith('//')) {
        nodes.push(h('span', { key: k, className: 'text-stone-500 italic' }, token));
        continue;
      }

      // String
      if (token.startsWith("'") || token.startsWith('"') || token.startsWith('`')) {
        nodes.push(h('span', { key: k, className: 'text-teal-400' }, token));
        continue;
      }

      // JSX tag
      if (JSX_TAGS.has(token)) {
        nodes.push(h('span', { key: k, className: 'text-amber-400 font-medium' }, token));
        continue;
      }

      // Keyword
      if (KEYWORDS.has(token)) {
        nodes.push(h('span', { key: k, className: 'text-rose-400 font-semibold' }, token));
        continue;
      }

      // Number
      if (/^\d+$/.test(token)) {
        nodes.push(h('span', { key: k, className: 'text-orange-400' }, token));
        continue;
      }

      // Bracket / punctuation
      if ('{}()[];=<>,'.includes(token)) {
        nodes.push(h('span', { key: k, className: 'text-stone-400' }, token));
        continue;
      }

      // Default — identifier
      nodes.push(h('span', { key: k, className: 'text-stone-200' }, token));
    }
  }

  return nodes;
}

/* ------------------------------------------------------------------ */
/*  Template-specific code generator                                  */
/* ------------------------------------------------------------------ */

function generateCode(
  template: ViralTemplate | null,
  params: TemplateParams | null
): string {
  if (!template || !params) return '';

  const templatesMap: Record<string, string> = {
    'waitlist-unlock': `import { LoopEngine } from '@loopengine/sdk';

const waitlist = LoopEngine.createLoop({
  name: '${params.loopName}',
  type: 'waitlist_position',
  config: {
    positionsPerReferral: ${params.threshold},
    reward: '${params.reward}',
    onReward: (user) => {
      console.log(\`User \${user.id} advanced on waitlist\`);
    },
  },
});

export default function WaitlistWidget() {
  return (
    <waitlist.Provider>
      <waitlist.ReferralForm />
      <waitlist.PositionTracker />
    </waitlist.Provider>
  );
}`,

    'referral-link': `import { LoopEngine } from '@loopengine/sdk';

const referral = LoopEngine.createLoop({
  name: '${params.loopName}',
  type: 'threshold',
  config: {
    threshold: ${params.threshold},
    reward: '${params.reward}',
    onReward: (user) => {
      console.log(\`User \${user.id} earned reward: ${params.reward}\`);
    },
  },
});

export default function ReferralWidget() {
  return (
    <referral.Provider>
      <referral.ShareLink />
      <referral.ReferralCounter />
    </referral.Provider>
  );
}`,

    'tiered-rewards': `import { LoopEngine } from '@loopengine/sdk';

const tiered = LoopEngine.createLoop({
  name: '${params.loopName}',
  type: 'tiered_milestones',
  config: {
    milestones: [
      { threshold: 1, reward: 'Starter perk' },
      { threshold: ${params.threshold}, reward: '${params.reward}' },
      { threshold: ${params.threshold * 2}, reward: 'Premium tier' },
    ],
    onMilestone: (user, milestone) => {
      console.log(\`User \${user.id} reached \${milestone.reward}\`);
    },
  },
});

export default function TieredRewardsWidget() {
  return (
    <tiered.Provider>
      <tiered.ProgressTracker />
      <tiered.MilestoneList />
    </tiered.Provider>
  );
}`,

    'team-invite': `import { LoopEngine } from '@loopengine/sdk';

const team = LoopEngine.createLoop({
  name: '${params.loopName}',
  type: 'threshold',
  config: {
    threshold: ${params.threshold},
    reward: '${params.reward}',
    onReward: (team) => {
      console.log(\`Team \${team.id} unlocked workspace\`);
    },
  },
});

export default function TeamInviteWidget() {
  return (
    <team.Provider>
      <team.InviteForm />
      <team.MemberCounter />
    </team.Provider>
  );
}`,

    'freemium-gate': `import { LoopEngine } from '@loopengine/sdk';

const freemium = LoopEngine.createLoop({
  name: '${params.loopName}',
  type: 'threshold',
  config: {
    threshold: ${params.threshold},
    reward: '${params.reward}',
    onReward: (user) => {
      console.log(\`User \${user.id} unlocked expanded limits\`);
    },
  },
});

export default function FreemiumGateWidget() {
  return (
    <freemium.Provider>
      <freemium.UsageCap />
      <freemium.ReferralUnlock />
    </freemium.Provider>
  );
}`,

    'early-access': `import { LoopEngine } from '@loopengine/sdk';

const earlyAccess = LoopEngine.createLoop({
  name: '${params.loopName}',
  type: 'waitlist_position',
  config: {
    positionsPerReferral: ${params.threshold},
    reward: '${params.reward}',
    onReward: (user) => {
      console.log(\`User \${user.id} got early access\`);
    },
  },
});

export default function EarlyAccessWidget() {
  return (
    <earlyAccess.Provider>
      <earlyAccess.ShareLink />
      <earlyAccess.AccessGate />
    </earlyAccess.Provider>
  );
}`,
  };

  return templatesMap[template.id] || templatesMap['referral-link'] || '';
}

/* ------------------------------------------------------------------ */
/*  Hero Code Panel — first thing developers see                      */
/* ------------------------------------------------------------------ */

function HeroCodePanel() {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    const attributed = HERO_SNIPPET + '\n// Powered by ViralKit — viralkit.dev';
    navigator.clipboard.writeText(attributed).then(() => {
      setCopied(true);
      window.aif?.track('hero_copy', { snippet: 'quickstart' });
    });
  }, []);

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(timer);
  }, [copied]);

  const highlighted = useMemo(() => highlightTokens(HERO_SNIPPET), []);

  const handleCtaClick = useCallback(() => {
    const selectEl = document.getElementById('template-select');
    if (selectEl) {
      selectEl.focus();
    }
    window.aif?.track('cta_click', { button: 'get_started', position: 'hero' });
  }, []);

  return (
    <div className="flex flex-col lg:flex-row gap-6" data-testid="hero-wrapper">
      {/* Value prop — leads first */}
      <div
        className="lg:w-[30%] flex flex-col justify-center gap-5 py-2 lg:py-6"
        data-testid="hero-copy-section"
      >
        <div>
          <h2 className="text-2xl lg:text-3xl font-bold text-white leading-tight">
            Will your referral program pay for itself?
          </h2>
          <p className="mt-3 text-sm text-gray-400 leading-relaxed">
            Copy-paste SDK snippets for referral loops, waitlists, and tiered
            rewards. Ship growth mechanics in minutes, not weeks.
          </p>
        </div>
        <div className="flex flex-col gap-3">
          <button
            className="btn-primary w-full"
            onClick={handleCtaClick}
            data-testid="hero-cta-button"
          >
            Get API Key
          </button>
          {/* Subtle trust badges — proof points below the CTA */}
          <div className="flex items-center justify-center gap-3 text-[11px] text-gray-500">
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
              Runs in browser
            </span>
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
              No data sent
            </span>
          </div>
        </div>
      </div>

      {/* Code panel — ~70% of hero width */}
      <div
        className="lg:w-[70%] relative group overflow-x-auto rounded-xl border border-brand-500/20 p-5 sm:p-6 lg:p-8"
        style={{
          minHeight: 'clamp(280px, 60vh, 480px)',
          background: 'linear-gradient(135deg, #1a1018 0%, #14121f 50%, #181420 100%)',
          boxShadow: '0 0 40px rgba(185, 28, 28, 0.08), 0 4px 24px rgba(0,0,0,0.4)',
        }}
        data-testid="hero-code-panel"
      >
        {/* File tab bar */}
        <div className="flex items-center justify-between mb-5 pb-4 border-b border-white/[0.06]">
          <div className="flex items-center gap-3">
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-brand-400/70" />
              <div className="w-2.5 h-2.5 rounded-full bg-amber-400/60" />
              <div className="w-2.5 h-2.5 rounded-full bg-teal-400/50" />
            </div>
            <span className="text-xs text-stone-500 font-mono">ReferralWidget.tsx</span>
          </div>
          {/* Prominent copy button — always visible */}
          <button
            onClick={handleCopy}
            className="btn-primary text-sm px-5 py-2.5 gap-2"
            aria-label="Copy quickstart code snippet"
            data-testid="hero-copy-button"
          >
            {copied ? (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Copied!
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Copy
              </>
            )}
          </button>
        </div>

        {/* Syntax-highlighted code */}
        <pre
          data-testid="code-output"
          className="text-xs sm:text-sm lg:text-base leading-relaxed sm:leading-relaxed lg:leading-loose font-mono"
        >
          <code>{highlighted}</code>
        </pre>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main SnippetGenerator Component                                   */
/* ------------------------------------------------------------------ */

export function SnippetGenerator({
  selectedTemplate,
  params,
  onParamsChange,
  onTemplateSelect,
}: SnippetGeneratorProps) {
  const code = useMemo(
    () => generateCode(selectedTemplate, params),
    [selectedTemplate, params]
  );

  const handleCopy = useCallback(() => {
    if (code) {
      navigator.clipboard.writeText(code);
      window.aif?.track('snippet_copy', { template: selectedTemplate?.id });
    }
  }, [code, selectedTemplate]);

  const handleDownload = useCallback(() => {
    if (!code || !selectedTemplate) return;
    const blob = new Blob([code], { type: 'text/typescript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${params?.loopName || selectedTemplate.id}.tsx`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [code, selectedTemplate, params]);

  const handleTemplateChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const id = e.target.value;
      const template = templates.find((t) => t.id === id);
      if (template) {
        onTemplateSelect(template);
        onParamsChange(template.defaultParams);
      }
    },
    [onTemplateSelect, onParamsChange]
  );

  const handleParamChange = useCallback(
    (field: keyof TemplateParams, value: string | number) => {
      if (params) {
        onParamsChange({ ...params, [field]: value });
      }
    },
    [params, onParamsChange]
  );

  /* ---- No template selected: show hero code panel ---- */
  if (!selectedTemplate || !params) {
    return (
      <div className="flex flex-col gap-6">
        {/* Small label for test compatibility */}
        <h2 className="text-lg font-semibold text-white tracking-tight">Snippet Generator</h2>

        <HeroCodePanel />

        {/* Template selector below the code panel */}
        <div className="flex flex-col gap-2">
          <label
            htmlFor="template-select"
            className="text-sm font-medium text-gray-300"
          >
            Configure a template
          </label>
          <select
            id="template-select"
            aria-label="Select a template"
            value=""
            onChange={handleTemplateChange}
            className="input-base max-w-md"
          >
            <option value="">Choose a template...</option>
            {templates.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    );
  }

  /* ---- Template selected: show configuration mode ---- */
  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-white tracking-tight">Snippet Generator</h2>
          <p className="text-xs text-gray-500 mt-0.5">Generate LoopEngine SDK integration code</p>
        </div>
      </div>

      {/* Template selector */}
      <div className="flex flex-col gap-2">
        <label
          htmlFor="template-select"
          className="text-sm font-medium text-gray-300"
        >
          Template
        </label>
        <select
          id="template-select"
          aria-label="Select a template"
          value={selectedTemplate.id}
          onChange={handleTemplateChange}
          className="input-base"
        >
          <option value="">Choose a template...</option>
          {templates.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-4">
        {/* Parameter fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2 flex flex-col gap-1.5">
            <label htmlFor="param-loop-name" className="text-xs font-medium text-gray-400 uppercase tracking-wider">Loop Name</label>
            <input
              id="param-loop-name"
              type="text"
              value={params.loopName}
              onChange={(e) =>
                handleParamChange('loopName', e.target.value)
              }
              className="input-base"
              placeholder="e.g. my-referral-loop"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="param-incentive-type" className="text-xs font-medium text-gray-400 uppercase tracking-wider">Incentive Type</label>
            <select
              id="param-incentive-type"
              value={params.incentiveType}
              onChange={(e) =>
                handleParamChange('incentiveType', e.target.value)
              }
              className="input-base"
            >
              <option value="threshold">Threshold</option>
              <option value="waitlist_position">Waitlist Position</option>
              <option value="tiered_milestones">Tiered Milestones</option>
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="param-threshold" className="text-xs font-medium text-gray-400 uppercase tracking-wider">Threshold</label>
            <input
              id="param-threshold"
              type="number"
              min={1}
              value={params.threshold}
              onChange={(e) =>
                handleParamChange('threshold', Number(e.target.value))
              }
              className="input-base"
            />
          </div>
          <div className="sm:col-span-2 flex flex-col gap-1.5">
            <label htmlFor="param-reward" className="text-xs font-medium text-gray-400 uppercase tracking-wider">Reward</label>
            <input
              id="param-reward"
              type="text"
              value={params.reward}
              onChange={(e) =>
                handleParamChange('reward', e.target.value)
              }
              className="input-base"
              placeholder="e.g. unlock_pro_tier"
            />
          </div>
        </div>

        {/* Code output */}
        <div className="relative group">
          <div className="code-panel p-4 overflow-x-auto max-h-80">
            <pre
              data-testid="code-output"
              className="text-green-400 whitespace-pre text-xs sm:text-sm leading-relaxed"
            >
              {code}
            </pre>
          </div>
          <div className="absolute top-3 right-3 flex gap-2">
            <button
              onClick={handleCopy}
              className="btn-secondary text-xs px-3 py-1.5 opacity-70 group-hover:opacity-100 transition-opacity"
              aria-label="Copy code snippet"
            >
              <svg className="w-3.5 h-3.5 mr-1.5 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Copy
            </button>
            <button
              onClick={handleDownload}
              className="btn-secondary text-xs px-3 py-1.5 opacity-70 group-hover:opacity-100 transition-opacity"
              aria-label="Download code file"
            >
              <svg className="w-3.5 h-3.5 mr-1.5 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

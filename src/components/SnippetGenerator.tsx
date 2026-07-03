import { useMemo, useCallback, useState } from 'react';
import type { ViralTemplate, TemplateParams } from '../types';
import { templates } from '../data/templates';

interface SnippetGeneratorProps {
  selectedTemplate: ViralTemplate | null;
  params: TemplateParams | null;
  onParamsChange: (params: TemplateParams) => void;
  onTemplateSelect: (template: ViralTemplate) => void;
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
/*  Interactive K-Factor Calculator Hero — first thing users see      */
/* ------------------------------------------------------------------ */

function HeroCalculator() {
  const [invites, setInvites] = useState(4);
  const [conversionRate, setConversionRate] = useState(25);

  const kFactor = useMemo(
    () => (invites * conversionRate) / 100,
    [invites, conversionRate]
  );

  const growthStatus = kFactor > 1 ? 'growth' : kFactor > 0.5 ? 'caution' : 'decay';

  const handleCtaClick = useCallback(() => {
    const selectEl = document.getElementById('template-select');
    if (selectEl) {
      selectEl.focus();
    }
    window.aif?.track('cta_click', { button: 'configure', position: 'hero' });
  }, []);

  return (
    <div className="flex flex-col lg:flex-row gap-6" data-testid="hero-wrapper">
      {/* Value prop + CTA */}
      <div
        className="lg:w-[35%] flex flex-col justify-center gap-5 py-2 lg:py-6"
        data-testid="hero-copy-section"
      >
        <div>
          <h2 className="text-2xl lg:text-3xl font-bold text-white leading-tight">
            Will your referral program pay for itself?
          </h2>
          <p className="mt-3 text-sm text-gray-400 leading-relaxed">
            Adjust the sliders to see your viral coefficient in real time.
            Then generate production-ready SDK snippets for your referral loop.
          </p>
        </div>
        <div className="flex flex-col gap-3">
          <button
            className="btn-primary w-full"
            onClick={handleCtaClick}
            data-testid="hero-cta-button"
          >
            Configure Your Program
          </button>
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

      {/* Interactive K-factor calculator */}
      <div
        className="lg:w-[65%] relative rounded-xl border border-brand-500/20 p-5 sm:p-6 lg:p-8"
        style={{
          background: 'linear-gradient(135deg, #1a1018 0%, #14121f 50%, #181420 100%)',
          boxShadow: '0 0 40px rgba(185, 28, 28, 0.08), 0 4px 24px rgba(0,0,0,0.4)',
        }}
        data-testid="hero-code-panel"
      >
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/[0.06]">
          <h3 className="text-sm font-semibold text-gray-300 tracking-wide uppercase">
            Viral Coefficient Calculator
          </h3>
          <span className="text-xs text-gray-500 font-mono">K = i &times; c</span>
        </div>

        {/* Sliders */}
        <div className="flex flex-col gap-6">
          {/* Invites per user */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label htmlFor="hero-invites" className="text-sm font-medium text-gray-300">
                Invites per user <span className="text-gray-500 font-normal">(i)</span>
              </label>
              <span className="text-lg font-bold font-mono text-white" data-testid="hero-invites-value">
                {invites}
              </span>
            </div>
            <input
              id="hero-invites"
              type="range"
              min={1}
              max={10}
              step={1}
              value={invites}
              onChange={(e) => setInvites(Number(e.target.value))}
              className="w-full accent-brand-500 cursor-pointer"
              aria-label="Average invites per user"
            />
          </div>

          {/* Conversion rate */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label htmlFor="hero-conversion" className="text-sm font-medium text-gray-300">
                Invite conversion rate <span className="text-gray-500 font-normal">(c)</span>
              </label>
              <span className="text-lg font-bold font-mono text-white" data-testid="hero-conversion-value">
                {conversionRate}%
              </span>
            </div>
            <input
              id="hero-conversion"
              type="range"
              min={5}
              max={50}
              step={5}
              value={conversionRate}
              onChange={(e) => setConversionRate(Number(e.target.value))}
              className="w-full accent-brand-500 cursor-pointer"
              aria-label="Invite conversion rate percentage"
            />
          </div>
        </div>

        {/* K-factor result */}
        <div className="mt-6 pt-5 border-t border-white/[0.06]">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-[11px] text-gray-500 uppercase tracking-wider font-semibold mb-1">
                Your K-Factor
              </p>
              <p
                className={`text-4xl font-bold font-mono tracking-tight ${
                  growthStatus === 'growth'
                    ? 'text-emerald-400'
                    : growthStatus === 'caution'
                    ? 'text-amber-400'
                    : 'text-brand-400'
                }`}
                data-testid="hero-kfactor"
              >
                {kFactor.toFixed(2)}
              </p>
            </div>
            <div
              className={`text-right text-sm font-medium ${
                growthStatus === 'growth'
                  ? 'text-emerald-400'
                  : growthStatus === 'caution'
                  ? 'text-amber-400'
                  : 'text-brand-400'
              }`}
              data-testid="hero-status"
            >
              {growthStatus === 'growth'
                ? 'Exponential growth — each user brings more than one new user'
                : growthStatus === 'caution'
                ? 'Slow growth — needs higher rewards or lower friction'
                : 'Decay — referral channel is not self-sustaining'}
            </div>
          </div>

          {/* K=1 reference indicator */}
          <div className="mt-4 flex items-center gap-2 text-xs text-gray-500">
            <div className="flex-1 h-1 bg-gray-800 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${
                  growthStatus === 'growth' ? 'bg-emerald-500' : growthStatus === 'caution' ? 'bg-amber-500' : 'bg-brand-500'
                }`}
                style={{ width: `${Math.min(kFactor / 2 * 100, 100)}%` }}
              />
            </div>
            <span className="font-mono text-gray-600">K=1.0 threshold</span>
          </div>
        </div>
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
      void navigator.clipboard.writeText(code);
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
      <div id="calculator" className="flex flex-col gap-6">
        {/* Small label for test compatibility */}
        <h2 className="text-lg font-semibold text-white tracking-tight">Snippet Generator</h2>

        <HeroCalculator />

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

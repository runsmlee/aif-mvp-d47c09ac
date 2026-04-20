import { useMemo, useCallback } from 'react';
import type { ViralTemplate, TemplateParams } from '../types';
import { templates } from '../data/templates';

interface SnippetGeneratorProps {
  selectedTemplate: ViralTemplate | null;
  params: TemplateParams | null;
  onParamsChange: (params: TemplateParams) => void;
  onTemplateSelect: (template: ViralTemplate) => void;
}

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
    }
  }, [code]);

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
          value={selectedTemplate?.id ?? ''}
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

      {selectedTemplate && params ? (
        <div className="flex flex-col gap-4">
          {/* Parameter fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2 flex flex-col gap-1.5">
              <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">Loop Name</label>
              <input
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
              <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">Incentive Type</label>
              <select
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
              <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">Threshold</label>
              <input
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
              <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">Reward</label>
              <input
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

          {/* Integration Guide */}
          <div data-testid="integration-guide" className="metric-card">
            <h3 className="text-sm font-semibold text-white mb-3">Integration Guide</h3>
            <ol className="flex flex-col gap-2.5 text-sm text-gray-400">
              <li className="flex gap-2.5">
                <span className="flex-shrink-0 w-5 h-5 rounded-md bg-brand-500/10 text-brand-400 text-xs font-bold flex items-center justify-center">1</span>
                <span>Install the SDK: <code className="text-emerald-400 font-mono text-xs">npm install @loopengine/sdk</code></span>
              </li>
              <li className="flex gap-2.5">
                <span className="flex-shrink-0 w-5 h-5 rounded-md bg-brand-500/10 text-brand-400 text-xs font-bold flex items-center justify-center">2</span>
                <span>Add your API key to <code className="text-emerald-400 font-mono text-xs">.env</code>: <code className="text-emerald-400 font-mono text-xs">VITE_LOOPENGINE_KEY=your_key</code></span>
              </li>
              <li className="flex gap-2.5">
                <span className="flex-shrink-0 w-5 h-5 rounded-md bg-brand-500/10 text-brand-400 text-xs font-bold flex items-center justify-center">3</span>
                <span>Paste the generated code into your component file</span>
              </li>
              <li className="flex gap-2.5">
                <span className="flex-shrink-0 w-5 h-5 rounded-md bg-brand-500/10 text-brand-400 text-xs font-bold flex items-center justify-center">4</span>
                <span>Import and render the widget in your app</span>
              </li>
            </ol>
          </div>
        </div>
      ) : (
        <div className="metric-card text-center py-16 text-gray-500">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gray-800/50 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
              />
            </svg>
          </div>
          <p className="text-sm font-medium text-gray-400">Select a template to generate your code snippet</p>
        </div>
      )}
    </div>
  );
}

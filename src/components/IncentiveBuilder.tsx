import { useCallback } from 'react';
import type { IncentiveRule, IncentiveType } from '../types';

interface IncentiveBuilderProps {
  rules: IncentiveRule[];
  onRulesChange: (rules: IncentiveRule[]) => void;
  initialRule?: IncentiveRule;
}

const TRIGGER_OPTIONS = [
  'user.referral.completed',
  'user.referral.milestone',
  'user.signup',
  'user.invite.sent',
];

const CONDITION_OPTIONS = [
  'count >= 3',
  'count >= 5',
  'count >= 10',
  'milestone_reached',
  'waitlist_position > 0',
  'team_size >= 3',
];

function RuleRow({
  rule,
  index,
  onUpdate,
  onRemove,
}: {
  rule: IncentiveRule;
  index: number;
  onUpdate: (index: number, updated: IncentiveRule) => void;
  onRemove: (index: number) => void;
}) {
  const handleChange = (
    field: keyof IncentiveRule,
    value: string | IncentiveType
  ) => {
    onUpdate(index, { ...rule, [field]: value });
  };

  const isComplete = !!(rule.trigger && rule.condition && rule.reward);

  return (
    <div className="bg-gray-800/30 border border-gray-700/60 rounded-xl p-5 transition-all hover:border-gray-600/60">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="flex items-center justify-center w-6 h-6 rounded-md bg-gray-700/50 text-xs font-bold text-gray-300">
            {index + 1}
          </span>
          <span className="text-sm font-semibold text-gray-200">Rule #{index + 1}</span>
          <span
            className={`text-[11px] px-2 py-0.5 rounded-full font-semibold ${
              isComplete
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
            }`}
          >
            {isComplete ? 'Valid' : 'Incomplete'}
          </span>
        </div>
        <button
          onClick={() => onRemove(index)}
          className="p-1.5 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-colors min-w-[36px] min-h-[36px] flex items-center justify-center"
          aria-label="Delete rule"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Type</label>
          <select
            value={rule.type}
            onChange={(e) => handleChange('type', e.target.value as IncentiveType)}
            className="input-base"
          >
            <option value="threshold">Threshold</option>
            <option value="waitlist_position">Waitlist Position</option>
            <option value="tiered_milestones">Tiered Milestones</option>
          </select>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Trigger</label>
          <select
            value={rule.trigger}
            onChange={(e) => handleChange('trigger', e.target.value)}
            className="input-base"
          >
            <option value="">Select trigger...</option>
            {TRIGGER_OPTIONS.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Condition</label>
          <select
            value={rule.condition}
            onChange={(e) => handleChange('condition', e.target.value)}
            className="input-base"
          >
            <option value="">Select condition...</option>
            {CONDITION_OPTIONS.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Reward</label>
          <input
            type="text"
            value={rule.reward}
            onChange={(e) => handleChange('reward', e.target.value)}
            placeholder="e.g. unlock_pro_tier"
            className="input-base"
          />
        </div>
      </div>
    </div>
  );
}

export function IncentiveBuilder({
  rules,
  onRulesChange,
}: IncentiveBuilderProps) {
  const allRulesValid = rules.every(
    (r) => r.trigger && r.condition && r.reward
  );
  const canExport = rules.length > 0 && allRulesValid;

  const handleAddRule = useCallback(() => {
    const newRule: IncentiveRule = {
      id: `rule-${Date.now()}`,
      trigger: '',
      condition: '',
      reward: '',
      type: 'threshold',
    };
    onRulesChange([...rules, newRule]);
  }, [rules, onRulesChange]);

  const handleUpdateRule = useCallback(
    (index: number, updated: IncentiveRule) => {
      const newRules = [...rules];
      newRules[index] = updated;
      onRulesChange(newRules);
    },
    [rules, onRulesChange]
  );

  const handleRemoveRule = useCallback(
    (index: number) => {
      onRulesChange(rules.filter((_, i) => i !== index));
    },
    [rules, onRulesChange]
  );

  const handleExport = useCallback(() => {
    const config = {
      version: '1.0.0',
      rules: rules.map((r) => ({
        trigger: r.trigger,
        condition: r.condition,
        reward: r.reward,
        type: r.type,
        ...(r.thresholds ? { thresholds: r.thresholds } : {}),
      })),
    };
    navigator.clipboard.writeText(JSON.stringify(config, null, 2));
  }, [rules]);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-white tracking-tight">
            Incentive Logic Builder
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">Define rules that trigger rewards for user actions</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleAddRule}
            className="btn-secondary text-sm"
            aria-label="Add rule"
          >
            <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Rule
          </button>
          <button
            onClick={handleExport}
            disabled={!canExport}
            className="btn-primary text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Export JSON"
          >
            <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Export JSON
          </button>
        </div>
      </div>

      {rules.length === 0 ? (
        <div className="metric-card text-center py-16 text-gray-500">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gray-800/50 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
            </svg>
          </div>
          <p className="text-sm font-medium text-gray-400">No rules defined yet</p>
          <p className="text-xs text-gray-600 mt-1 mb-4">Click "Add Rule" to start building your incentive logic</p>
          <button
            onClick={handleAddRule}
            className="btn-primary text-sm mx-auto"
            aria-label="Add first rule"
          >
            <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create Your First Rule
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {rules.map((rule, index) => (
            <RuleRow
              key={rule.id}
              rule={rule}
              index={index}
              onUpdate={handleUpdateRule}
              onRemove={handleRemoveRule}
            />
          ))}
        </div>
      )}
    </div>
  );
}

import type { TemplateParams } from '../types';

interface LivePreviewProps {
  loopType: string | null;
  params: TemplateParams | null;
}

function ReferralPreview({ params }: { params: TemplateParams }) {
  return (
    <div data-testid="preview-content" className="flex flex-col gap-4">
      <div className="text-center mb-2">
        <div className="w-14 h-14 mx-auto bg-brand-500/10 rounded-2xl flex items-center justify-center mb-3 ring-1 ring-brand-500/20">
          <svg className="w-7 h-7 text-brand-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
        </div>
        <h3 className="text-white font-semibold text-sm">Refer a Friend</h3>
        <p className="text-gray-500 text-xs mt-1">
          Share your unique link and earn rewards
        </p>
      </div>
      <div className="bg-gray-800/50 rounded-lg p-3 ring-1 ring-gray-700/40">
        <div className="text-[11px] text-gray-500 font-medium uppercase tracking-wider mb-1.5">Your referral link</div>
        <code className="text-emerald-400 text-xs font-mono block truncate">
          https://yourapp.com/ref/{params.loopName}
        </code>
      </div>
      <div className="bg-gray-800/50 rounded-lg p-4 text-center ring-1 ring-gray-700/40">
        <p className="text-[11px] text-gray-500 font-medium uppercase tracking-wider mb-1">Referrals needed</p>
        <p className="text-3xl font-bold text-brand-400 font-mono tracking-tight">{params.threshold}</p>
        <p className="text-xs text-gray-400 mt-1.5">Reward: <span className="text-white font-medium">{params.reward}</span></p>
      </div>
      <div className="flex gap-2">
        <button className="flex-1 btn-primary text-sm">Share Link</button>
        <button className="flex-1 btn-secondary text-sm">Copy Link</button>
      </div>
    </div>
  );
}

function WaitlistPreview({ params }: { params: TemplateParams }) {
  const position = 847;
  const newPosition = Math.max(1, position - params.threshold * 10);

  return (
    <div data-testid="preview-content" className="flex flex-col gap-4">
      <div className="text-center mb-2">
        <div className="w-14 h-14 mx-auto bg-blue-500/10 rounded-2xl flex items-center justify-center mb-3 ring-1 ring-blue-500/20">
          <svg className="w-7 h-7 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-white font-semibold text-sm">Waitlist Position</h3>
        <p className="text-gray-500 text-xs mt-1">
          Refer friends to move up the waitlist
        </p>
      </div>
      <div className="bg-gray-800/50 rounded-lg p-4 text-center ring-1 ring-gray-700/40">
        <p className="text-[11px] text-gray-500 font-medium uppercase tracking-wider mb-2">Your position</p>
        <p className="text-4xl font-bold text-blue-400 font-mono tracking-tight">#{position}</p>
        <div className="mt-2 text-xs text-emerald-400 font-medium">
          ↓ Refer {params.threshold} friend{params.threshold > 1 ? 's' : ''} → <span className="text-white">#{newPosition}</span>
        </div>
      </div>
      <div className="bg-gray-800/50 rounded-lg p-3 ring-1 ring-gray-700/40">
        <p className="text-[11px] text-gray-500 font-medium uppercase tracking-wider mb-1.5">Your reward</p>
        <p className="text-sm text-white font-medium">{params.reward}</p>
      </div>
    </div>
  );
}

function TieredPreview({ params }: { params: TemplateParams }) {
  const milestones = [
    { threshold: 1, label: 'Starter Perk', achieved: true },
    {
      threshold: params.threshold,
      label: params.reward,
      achieved: false,
    },
    {
      threshold: params.threshold * 2,
      label: 'Premium Tier',
      achieved: false,
    },
  ];

  return (
    <div data-testid="preview-content" className="flex flex-col gap-4">
      <div className="text-center mb-2">
        <div className="w-14 h-14 mx-auto bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-3 ring-1 ring-emerald-500/20">
          <svg className="w-7 h-7 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
          </svg>
        </div>
        <h3 className="text-white font-semibold text-sm">Milestone Rewards</h3>
        <p className="text-gray-500 text-xs mt-1">
          Unlock rewards at each milestone
        </p>
      </div>
      <div className="flex flex-col gap-2">
        {milestones.map((m, i) => (
          <div
            key={i}
            className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
              m.achieved
                ? 'bg-emerald-500/5 ring-1 ring-emerald-500/20'
                : 'bg-gray-800/50 ring-1 ring-gray-700/40'
            }`}
          >
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${
                m.achieved
                  ? 'bg-emerald-500 text-white shadow-sm shadow-emerald-500/20'
                  : 'bg-gray-700/60 text-gray-400'
              }`}
            >
              {m.achieved ? '✓' : m.threshold}
            </div>
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-medium truncate ${m.achieved ? 'text-emerald-400' : 'text-gray-300'}`}>
                {m.label}
              </p>
              <p className="text-[11px] text-gray-500">
                {m.threshold} referral{m.threshold > 1 ? 's' : ''}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function LivePreview({ loopType, params }: LivePreviewProps) {
  const renderPreview = () => {
    if (!loopType || !params) {
      return (
        <div className="text-center py-12 text-gray-500">
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
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
          </div>
          <p className="text-sm font-medium text-gray-400">Configure a viral loop to see a live preview</p>
        </div>
      );
    }

    switch (loopType) {
      case 'referral':
      case 'freemium':
      case 'team':
        return <ReferralPreview params={params} />;
      case 'waitlist':
        return <WaitlistPreview params={params} />;
      case 'tiered':
        return <TieredPreview params={params} />;
      default:
        return <ReferralPreview params={params} />;
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="text-lg font-semibold text-white tracking-tight">Live Preview</h2>
        <p className="text-xs text-gray-500 mt-0.5">See how your viral loop will look to users</p>
      </div>
      <div className="metric-card min-h-[300px]">
        {/* Browser chrome */}
        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-800/60">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-500/50" />
          </div>
          <div className="flex-1 bg-gray-800/60 rounded-md px-3 py-1 text-[11px] text-gray-500 font-mono">
            yourapp.com/loop-preview
          </div>
        </div>
        {renderPreview()}
      </div>
    </div>
  );
}

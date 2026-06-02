import { useState, useCallback, useEffect, lazy, Suspense } from 'react';
import type { ViralTemplate, TemplateParams, IncentiveRule, AppView } from './types';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { mockAnalyticsData } from './data/mockAnalytics';
import { templates } from './data/templates';
import { ErrorBoundary } from './components/ErrorBoundary';
import { SkeletonCard, SkeletonCodeBlock, SkeletonForm, SkeletonMetricCards } from './components/Skeleton';
import { SnippetGenerator } from './components/SnippetGenerator';

const KFactorDashboard = lazy(() =>
  import('./components/KFactorDashboard').then((m) => ({ default: m.KFactorDashboard }))
);
const IncentiveBuilder = lazy(() =>
  import('./components/IncentiveBuilder').then((m) => ({ default: m.IncentiveBuilder }))
);
const TemplateLibrary = lazy(() =>
  import('./components/TemplateLibrary').then((m) => ({ default: m.TemplateLibrary }))
);
const LivePreview = lazy(() =>
  import('./components/LivePreview').then((m) => ({ default: m.LivePreview }))
);

type NavItem = {
  id: AppView;
  label: string;
  icon: string;
  shortcut: string;
};

const NAV_ITEMS: NavItem[] = [
  { id: 'generator', label: 'Generator', icon: 'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4', shortcut: '⌘1' },
  { id: 'analytics', label: 'Analytics', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z', shortcut: '⌘2' },
  { id: 'builder', label: 'Builder', icon: 'M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4', shortcut: '⌘3' },
  { id: 'templates', label: 'Templates', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10', shortcut: '⌘4' },
];

function Sidebar({
  activeView,
  onNavigate,
}: {
  activeView: AppView;
  onNavigate: (view: AppView) => void;
}) {
  return (
    <aside className="hidden md:flex w-64 bg-gray-900/95 border-r border-gray-800/60 flex-col h-screen sticky top-0 backdrop-blur-sm">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-gray-800/60">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-brand-500/10 flex items-center justify-center">
            <svg className="w-4 h-4 text-brand-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div>
            <h1 className="text-base font-bold text-white tracking-tight leading-none">
              <span className="text-brand-500">Loop</span>Engine
            </h1>
            <p className="text-xs text-gray-400 mt-0.5 font-medium tracking-wide uppercase">Engineer Your Virality</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4" aria-label="Main navigation">
        <ul className="flex flex-col gap-1" role="menubar">
          {NAV_ITEMS.map((item) => (
            <li key={item.id} role="none">
              <button
                role="menuitem"
                onClick={() => onNavigate(item.id)}
                className={`w-full text-left ${
                  activeView === item.id ? 'nav-link-active' : 'nav-link'
                }`}
                aria-current={activeView === item.id ? 'page' : undefined}
              >
                <svg
                  className="w-[18px] h-[18px] flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d={item.icon}
                  />
                </svg>
                {item.label}
                <span className="ml-auto text-xs text-gray-500 font-mono hidden lg:inline">{item.shortcut}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer */}
      <div className="px-5 py-4 border-t border-gray-800/60">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
          <p className="text-xs text-gray-400 font-mono">v1.2.0</p>
        </div>
      </div>
    </aside>
  );
}

/** Skeleton fallbacks for each view */
function GeneratorSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="flex flex-col gap-5">
        <SkeletonForm />
      </div>
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <SkeletonCard />
        </div>
      </div>
    </div>
  );
}

function AnalyticsSkeleton() {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <div className="h-5 w-40 animate-pulse bg-gray-800/60 rounded" />
      </div>
      <SkeletonMetricCards />
      <SkeletonCard />
    </div>
  );
}

function BuilderSkeleton() {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <div className="h-5 w-48 animate-pulse bg-gray-800/60 rounded" />
      </div>
      <SkeletonCard />
    </div>
  );
}

function TemplatesSkeleton() {
  return (
    <div className="flex flex-col gap-5">
      <div className="h-5 w-40 animate-pulse bg-gray-800/60 rounded" />
      <div className="flex flex-wrap gap-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-9 w-20 animate-pulse bg-gray-800/60 rounded-lg" />
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    </div>
  );
}

export function App() {
  const [activeView, setActiveView] = useState<AppView>('generator');
  const [selectedTemplate, setSelectedTemplate] =
    useLocalStorage<ViralTemplate | null>(
      'loopengine_selected_template',
      null
    );
  const [params, setParams] = useLocalStorage<TemplateParams | null>(
    'loopengine_params',
    null
  );
  const [incentiveRules, setIncentiveRules] =
    useLocalStorage<IncentiveRule[]>('loopengine_incentive_rules', []);

  // Track initial page view
  useEffect(() => {
    window.aif?.track('page_view', { path: window.location.pathname });
  }, []);

  // Enable keyboard shortcuts
  useKeyboardShortcuts(setActiveView);

  // Restore selected template from localStorage on mount
  useEffect(() => {
    if (selectedTemplate) {
      const found = templates.find((t) => t.id === selectedTemplate.id);
      if (found) {
        setSelectedTemplate(found);
        if (!params) {
          setParams(found.defaultParams);
        }
      }
    }
  }, []);

  const handleTemplateSelect = useCallback(
    (template: ViralTemplate) => {
      setSelectedTemplate(template);
      setParams(template.defaultParams);
      setActiveView('generator');
    },
    [setSelectedTemplate, setParams]
  );

  const handleParamsChange = useCallback(
    (newParams: TemplateParams) => {
      setParams(newParams);
    },
    [setParams]
  );

  const loopType = selectedTemplate?.category ?? null;

  const getSkeletonForView = (view: AppView) => {
    switch (view) {
      case 'generator': return <GeneratorSkeleton />;
      case 'analytics': return <AnalyticsSkeleton />;
      case 'builder': return <BuilderSkeleton />;
      case 'templates': return <TemplatesSkeleton />;
      default: return <SkeletonCard />;
    }
  };

  const renderContent = () => {
    switch (activeView) {
      case 'generator':
        return (
          <ErrorBoundary>
            {selectedTemplate ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <SnippetGenerator
                  selectedTemplate={selectedTemplate}
                  params={params}
                  onParamsChange={handleParamsChange}
                  onTemplateSelect={handleTemplateSelect}
                />
                <Suspense fallback={<SkeletonCodeBlock />}>
                  <LivePreview loopType={loopType} params={params} />
                </Suspense>
              </div>
            ) : (
              <SnippetGenerator
                selectedTemplate={selectedTemplate}
                params={params}
                onParamsChange={handleParamsChange}
                onTemplateSelect={handleTemplateSelect}
              />
            )}
          </ErrorBoundary>
        );
      case 'analytics':
        return (
          <ErrorBoundary>
            <Suspense fallback={<AnalyticsSkeleton />}>
              <KFactorDashboard data={mockAnalyticsData} />
            </Suspense>
          </ErrorBoundary>
        );
      case 'builder':
        return (
          <ErrorBoundary>
            <Suspense fallback={<BuilderSkeleton />}>
              <IncentiveBuilder
                rules={incentiveRules}
                onRulesChange={setIncentiveRules}
              />
            </Suspense>
          </ErrorBoundary>
        );
      case 'templates':
        return (
          <ErrorBoundary>
            <Suspense fallback={<TemplatesSkeleton />}>
              <TemplateLibrary
                onSelectTemplate={handleTemplateSelect}
                activeTemplateId={selectedTemplate?.id ?? null}
              />
            </Suspense>
          </ErrorBoundary>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-950">
      <Sidebar activeView={activeView} onNavigate={setActiveView} />

      {/* Mobile top bar — primary navigation on mobile */}
      <div className="md:hidden fixed top-0 inset-x-0 z-50 bg-gray-900/95 backdrop-blur-sm border-b border-gray-800/60">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2" aria-hidden="true">
            <div className="w-7 h-7 rounded-lg bg-brand-500/10 flex items-center justify-center">
              <svg className="w-3.5 h-3.5 text-brand-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="text-sm font-bold text-white">LoopEngine</span>
          </div>
          <nav className="flex gap-1" aria-label="Mobile navigation">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id)}
                className={`p-2 rounded-lg transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center ${
                  activeView === item.id
                    ? 'text-brand-500 bg-brand-500/10'
                    : 'text-gray-400 hover:text-gray-200'
                }`}
                aria-label={item.label}
                aria-current={activeView === item.id ? 'page' : undefined}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={item.icon} />
                </svg>
              </button>
            ))}
          </nav>
        </div>
      </div>

      <main
        className="flex-1 p-4 md:p-6 lg:p-8 overflow-auto pt-16 md:pt-6"
        id="main-content"
        role="main"
        aria-label={`${activeView.charAt(0).toUpperCase() + activeView.slice(1)} view`}
      >
        <div className="max-w-6xl mx-auto">{renderContent()}</div>
      </main>
    </div>
  );
}

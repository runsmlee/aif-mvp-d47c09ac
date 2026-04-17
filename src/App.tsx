import { useState, useCallback, useEffect } from 'react';
import type { ViralTemplate, TemplateParams, IncentiveRule, AppView } from './types';
import { useLocalStorage } from './hooks/useLocalStorage';
import { mockAnalyticsData } from './data/mockAnalytics';
import { templates } from './data/templates';
import { SnippetGenerator } from './components/SnippetGenerator';
import { KFactorDashboard } from './components/KFactorDashboard';
import { IncentiveBuilder } from './components/IncentiveBuilder';
import { TemplateLibrary } from './components/TemplateLibrary';
import { LivePreview } from './components/LivePreview';

type NavItem = {
  id: AppView;
  label: string;
  icon: string;
};

const NAV_ITEMS: NavItem[] = [
  { id: 'generator', label: 'Generator', icon: 'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4' },
  { id: 'analytics', label: 'Analytics', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
  { id: 'builder', label: 'Builder', icon: 'M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4' },
  { id: 'templates', label: 'Templates', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' },
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
              <span className="text-brand-500">Viral</span>Kit
            </h1>
            <p className="text-[10px] text-gray-500 mt-0.5 font-medium tracking-wide uppercase">Growth Toolkit</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4" aria-label="Main navigation">
        <ul className="flex flex-col gap-1">
          {NAV_ITEMS.map((item) => (
            <li key={item.id}>
              <button
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
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer */}
      <div className="px-5 py-4 border-t border-gray-800/60">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
          <p className="text-[11px] text-gray-500 font-mono">v1.0.0-beta</p>
        </div>
      </div>
    </aside>
  );
}

export function App() {
  const [activeView, setActiveView] = useState<AppView>('generator');
  const [selectedTemplate, setSelectedTemplate] =
    useLocalStorage<ViralTemplate | null>(
      'viralkit_selected_template',
      null
    );
  const [params, setParams] = useLocalStorage<TemplateParams | null>(
    'viralkit_params',
    null
  );
  const [incentiveRules, setIncentiveRules] = useState<IncentiveRule[]>([]);

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

  const renderContent = () => {
    switch (activeView) {
      case 'generator':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SnippetGenerator
              selectedTemplate={selectedTemplate}
              params={params}
              onParamsChange={handleParamsChange}
              onTemplateSelect={handleTemplateSelect}
            />
            <LivePreview loopType={loopType} params={params} />
          </div>
        );
      case 'analytics':
        return <KFactorDashboard data={mockAnalyticsData} />;
      case 'builder':
        return (
          <IncentiveBuilder
            rules={incentiveRules}
            onRulesChange={setIncentiveRules}
          />
        );
      case 'templates':
        return (
          <TemplateLibrary
            onSelectTemplate={handleTemplateSelect}
            activeTemplateId={selectedTemplate?.id ?? null}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-950">
      <Sidebar activeView={activeView} onNavigate={setActiveView} />

      {/* Mobile top bar — visually shown on mobile, hidden from a11y tree (sidebar is primary nav) */}
      <div className="md:hidden fixed top-0 inset-x-0 z-50 bg-gray-900/95 backdrop-blur-sm border-b border-gray-800/60" aria-hidden="true">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-brand-500/10 flex items-center justify-center">
              <svg className="w-3.5 h-3.5 text-brand-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="text-sm font-bold text-white" aria-label="ViralKit">VK</span>
          </div>
          <nav className="flex gap-1">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id)}
                className={`p-2 rounded-lg transition-colors ${
                  activeView === item.id
                    ? 'text-brand-500 bg-brand-500/10'
                    : 'text-gray-400 hover:text-gray-200'
                }`}
                tabIndex={-1}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={item.icon} />
                </svg>
              </button>
            ))}
          </nav>
        </div>
      </div>

      <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-auto pt-16 md:pt-6">
        <div className="max-w-6xl mx-auto">{renderContent()}</div>
      </main>
    </div>
  );
}

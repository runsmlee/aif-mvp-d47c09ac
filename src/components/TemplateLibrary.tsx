import { useState, useMemo, useCallback } from 'react';
import type { ViralTemplate, TemplateCategory } from '../types';
import { templates } from '../data/templates';

interface TemplateLibraryProps {
  onSelectTemplate: (template: ViralTemplate) => void;
  activeTemplateId: string | null;
}

const ALL_CATEGORIES = 'all';
type FilterOption = typeof ALL_CATEGORIES | TemplateCategory;

const CATEGORIES: { value: FilterOption; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'waitlist', label: 'Waitlist' },
  { value: 'referral', label: 'Referral' },
  { value: 'tiered', label: 'Tiered' },
  { value: 'team', label: 'Team' },
  { value: 'freemium', label: 'Freemium' },
];

const categoryColors: Record<string, string> = {
  waitlist: 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
  referral: 'bg-purple-500/10 text-purple-400 border border-purple-500/20',
  tiered: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
  team: 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
  freemium: 'bg-orange-500/10 text-orange-400 border border-orange-500/20',
};

export function TemplateLibrary({
  onSelectTemplate,
  activeTemplateId,
}: TemplateLibraryProps) {
  const [activeFilter, setActiveFilter] = useState<FilterOption>(ALL_CATEGORIES);

  const filteredTemplates = useMemo(
    () =>
      activeFilter === ALL_CATEGORIES
        ? templates
        : templates.filter((t) => t.category === activeFilter),
    [activeFilter]
  );

  const handleFilterClick = useCallback((value: FilterOption) => {
    setActiveFilter(value);
  }, []);

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className="text-lg font-semibold text-white tracking-tight">Template Library</h2>
        <p className="text-xs text-gray-500 mt-0.5">Pre-built viral loop patterns to get you started</p>
      </div>

      {/* Filter chips */}
      <div className="flex flex-wrap gap-2" role="group" aria-label="Filter templates by category">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.value}
            data-testid={
              cat.value === 'all'
                ? 'filter-chip-all'
                : `filter-chip-${cat.value}`
            }
            onClick={() => handleFilterClick(cat.value)}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all min-h-[36px] ${
              activeFilter === cat.value
                ? 'bg-brand-500 text-white shadow-sm shadow-brand-500/20'
                : 'bg-gray-800/60 text-gray-400 hover:text-gray-200 hover:bg-gray-800 border border-gray-700/50'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Template cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredTemplates.map((template) => {
          const isActive = activeTemplateId === template.id;
          return (
            <div
              key={template.id}
              data-testid="template-card"
              data-name={template.name}
              data-category={template.category}
              id={`template-card-${template.id}`}
              className={`metric-card group cursor-pointer transition-all ${
                isActive
                  ? 'ring-2 ring-brand-500/60 border-brand-500/30 shadow-lg shadow-brand-500/5'
                  : 'hover:border-gray-600/60'
              }`}
              onClick={() => onSelectTemplate(template)}
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-sm font-semibold text-white group-hover:text-brand-400 transition-colors">{template.name}</h3>
                <span
                  className={`text-[11px] px-2 py-0.5 rounded-full font-semibold ${
                    categoryColors[template.category] || 'bg-gray-700 text-gray-300'
                  }`}
                >
                  Category: {template.category}
                </span>
              </div>
              <p className="text-sm text-gray-400 mb-4 leading-relaxed">{template.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-gray-500 font-mono font-medium">
                  K-Factor: {template.kFactorImpact}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectTemplate(template);
                  }}
                  className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all min-h-[32px] ${
                    isActive
                      ? 'bg-brand-500 text-white shadow-sm'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700/50'
                  }`}
                  aria-label="Use template"
                >
                  {isActive ? 'Active' : 'Use Template'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

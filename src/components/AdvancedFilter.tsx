import { useFanStore } from '@/store/useFanStore';
import { ChevronDown, ChevronUp, X } from 'lucide-react';
import { useState } from 'react';
import type { FilterOption } from '@/types/fan';

interface FilterGroupProps {
  title: string;
  icon: React.ReactNode;
  options: FilterOption[];
  selectedValue: string;
  onChange: (value: string) => void;
  defaultOpen?: boolean;
}

function FilterGroup({ title, icon, options, selectedValue, onChange, defaultOpen = false }: FilterGroupProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border border-paper-200 rounded-xl overflow-hidden bg-white/80 backdrop-blur-sm">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-paper-50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <span className="text-vermilion-500">{icon}</span>
          <span className="font-serif-sc text-ink-700 font-medium">{title}</span>
          {selectedValue && (
            <span className="ml-2 px-2 py-0.5 bg-vermilion-100 text-vermilion-600 text-xs rounded-full">
              {options.find(o => o.value === selectedValue)?.label}
            </span>
          )}
        </div>
        {isOpen ? (
          <ChevronUp size={18} className="text-ink-400" />
        ) : (
          <ChevronDown size={18} className="text-ink-400" />
        )}
      </button>

      {isOpen && (
        <div className="px-4 pb-4 pt-1 border-t border-paper-100">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => onChange('')}
              className={`px-3 py-1.5 rounded-lg text-sm transition-all duration-200 ${
                !selectedValue
                  ? 'bg-vermilion-500 text-white shadow-md'
                  : 'bg-paper-100 text-ink-600 hover:bg-paper-200'
              }`}
            >
              全部
            </button>
            {options.map((option) => (
              <button
                key={option.value}
                onClick={() => onChange(option.value)}
                className={`px-3 py-1.5 rounded-lg text-sm transition-all duration-200 ${
                  selectedValue === option.value
                    ? 'bg-vermilion-500 text-white shadow-md'
                    : 'bg-paper-100 text-ink-600 hover:bg-paper-200 hover:text-ink-800'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdvancedFilter() {
  const {
    filterOptions,
    selectedDynasty,
    selectedMaterial,
    selectedUsage,
    setSelectedDynasty,
    setSelectedMaterial,
    setSelectedUsage,
  } = useFanStore();

  if (!filterOptions) return null;

  const hasActiveFilters = selectedDynasty || selectedMaterial || selectedUsage;

  return (
    <div className="space-y-3">
      {hasActiveFilters && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-sm text-ink-500">已选：</span>
            {selectedDynasty && (
              <FilterTag
                label={filterOptions.dynasties.find(o => o.value === selectedDynasty)?.label || ''}
                onRemove={() => setSelectedDynasty('')}
              />
            )}
            {selectedMaterial && (
              <FilterTag
                label={filterOptions.materials.find(o => o.value === selectedMaterial)?.label || ''}
                onRemove={() => setSelectedMaterial('')}
              />
            )}
            {selectedUsage && (
              <FilterTag
                label={filterOptions.usages.find(o => o.value === selectedUsage)?.label || ''}
                onRemove={() => setSelectedUsage('')}
              />
            )}
          </div>
        </div>
      )}

      <FilterGroup
        title="朝代"
        icon={<span className="text-base">🏛️</span>}
        options={filterOptions.dynasties}
        selectedValue={selectedDynasty}
        onChange={setSelectedDynasty}
      />

      <FilterGroup
        title="材质"
        icon={<span className="text-base">🎨</span>}
        options={filterOptions.materials}
        selectedValue={selectedMaterial}
        onChange={setSelectedMaterial}
      />

      <FilterGroup
        title="用途"
        icon={<span className="text-base">📜</span>}
        options={filterOptions.usages}
        selectedValue={selectedUsage}
        onChange={setSelectedUsage}
      />
    </div>
  );
}

function FilterTag({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-gold-100 text-gold-700 rounded-full text-xs border border-gold-200">
      {label}
      <button
        onClick={onRemove}
        className="ml-0.5 hover:text-gold-900 transition-colors"
        aria-label={`移除${label}筛选`}
      >
        <X size={12} />
      </button>
    </span>
  );
}

// src/components/workbench/FilterPanel.tsx

"use client";

import { useState, useMemo } from "react";
import { Clock, XCircle, Users, Hash, MessageSquare, Calendar, Link, Zap, TrendingUp } from "lucide-react";
import { ExcelData } from "@/app/[locale]/workbench/page";
import Select, { StylesConfig, Theme } from 'react-select';

// Find a specific field value in a row, same as in NetworkGraph
const findFieldValue = (row: Record<string, unknown>, fields: string[]): string | null => {
  if (!row || typeof row !== 'object') return null;
  const normalize = (str: string) => str.toLowerCase().replace(/[^a-z0-9]/g, ' ').trim();
  const normalizedRow: { [key: string]: unknown } = {};
  Object.keys(row).forEach(key => {
    if (row[key] !== undefined && row[key] !== null && String(row[key]).trim() !== '') {
      normalizedRow[normalize(key)] = row[key];
    }
  });
  for (const field of fields) {
    const normalizedField = normalize(field);
    if (normalizedRow[normalizedField]) {
      return String(normalizedRow[normalizedField]);
    }
  }
  return null;
};

export interface WorkbenchFilters {
  interactionType: "all" | "calls" | "sms";
  dateRange: { start: string; end: string };
  individuals: string[];
  minInteractions: number;
  contactWhitelist: string[];
  durationRange: { min: number; max: number };
  // New link classification filters
  linkTypes: ("primary" | "secondary" | "weak")[];
  minStrengthScore: number;
  showWeakLinks: boolean;
}

interface FilterPanelProps {
  filters: WorkbenchFilters;
  onFiltersChange: (filters: WorkbenchFilters) => void;
  data: ExcelData;
}

export function FilterPanel({ filters, onFiltersChange, data }: FilterPanelProps) {

  const updateFilter = <K extends keyof WorkbenchFilters>(key: K, value: WorkbenchFilters[K]) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const resetFilters = () => {
    onFiltersChange({
      interactionType: "all",
      dateRange: { start: "", end: "" },
      individuals: [],
      minInteractions: 0,
      contactWhitelist: [],
      durationRange: { min: 0, max: 3600 },
      linkTypes: ["primary", "secondary", "weak"],
      minStrengthScore: 0,
      showWeakLinks: true,
    });
  };

  const contactOptions = useMemo(() => {
    if (!data.listings) return [];
    const contacts = new Set<string>();
    const callerFields = ['caller_num', 'caller', 'calling_number', 'from_number'];
    const calleeFields = ['callee_num', 'callee', 'called_number', 'to_number'];
    data.listings.forEach(row => {
      const caller = findFieldValue(row, callerFields);
      const callee = findFieldValue(row, calleeFields);
      if (caller) contacts.add(caller);
      if (callee) contacts.add(callee);
    });
    return Array.from(contacts).sort().map(c => ({ value: c, label: c }));
  }, [data]);

  const selectStyles: StylesConfig = {
    control: (base) => ({ ...base, backgroundColor: 'var(--background)', borderColor: 'var(--border)' }),
    menu: (base) => ({ ...base, backgroundColor: 'var(--background)'}),
    menuList: (base) => ({...base, '::-webkit-scrollbar': {width: '4px'}, '::-webkit-scrollbar-track': {background: 'transparent'}, '::-webkit-scrollbar-thumb': {background: '#888'}}),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isSelected ? 'var(--primary)' : state.isFocused ? 'var(--muted)' : 'transparent',
      ':active': { ...base[':active'], backgroundColor: 'var(--primary-focus)'},
      color: state.isSelected ? 'white' : 'var(--foreground)'
    }),
    multiValue: (base) => ({...base, backgroundColor: 'var(--muted)' }),
    multiValueLabel: (base) => ({ ...base, color: 'var(--foreground)' }),
    input: (base) => ({...base, color: 'var(--foreground)'}),
  };

  const handleLinkTypeToggle = (linkType: "primary" | "secondary" | "weak") => {
    const newLinkTypes = filters.linkTypes.includes(linkType)
      ? filters.linkTypes.filter(type => type !== linkType)
      : [...filters.linkTypes, linkType];
    updateFilter("linkTypes", newLinkTypes);
  };

  return (
    <div className="h-full bg-card border border-border rounded-lg shadow-sm flex flex-col">
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">Filters</h3>
          <button onClick={resetFilters} className="text-sm font-medium text-primary hover:underline flex items-center gap-1">
            <XCircle className="w-4 h-4" /> Reset All
          </button>
        </div>
      </div>

      <div className="p-4 space-y-6 overflow-y-auto flex-1">
        <div>
          <label className="block text-sm font-medium text-foreground mb-3"><MessageSquare className="w-4 h-4 inline mr-2" />Interaction Type</label>
          <div className="flex bg-muted p-1 rounded-md">
            {["all", "calls", "sms"].map(type => (
              <button key={type} onClick={() => updateFilter("interactionType", type as WorkbenchFilters['interactionType'])}
                className={`flex-1 capitalize text-sm py-1.5 rounded-md transition-colors ${filters.interactionType === type ? 'bg-background shadow-sm text-primary font-semibold' : 'hover:bg-background/50'}`}>
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* New Link Classification Section */}
        <div className="border-t border-border pt-4">
          <label className="block text-sm font-medium text-foreground mb-3">
            <Link className="w-4 h-4 inline mr-2" />
            Link Classification
          </label>
          
          <div className="space-y-3">
            <div className="flex flex-col space-y-2">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Connection Types</span>
              
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleLinkTypeToggle("primary")}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filters.linkTypes.includes("primary")
                      ? 'bg-red-100 text-red-800 border border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-700'
                      : 'bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700 dark:hover:bg-gray-700'
                  }`}
                >
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  Primary
                </button>
                
                <button
                  onClick={() => handleLinkTypeToggle("secondary")}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filters.linkTypes.includes("secondary")
                      ? 'bg-amber-100 text-amber-800 border border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-700'
                      : 'bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700 dark:hover:bg-gray-700'
                  }`}
                >
                  <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                  Secondary
                </button>
                
                <button
                  onClick={() => handleLinkTypeToggle("weak")}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filters.linkTypes.includes("weak")
                      ? 'bg-gray-100 text-gray-800 border border-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600'
                      : 'bg-gray-50 text-gray-500 border border-gray-200 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-500 dark:border-gray-700 dark:hover:bg-gray-700'
                  }`}
                >
                  <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                  Weak
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                <TrendingUp className="w-4 h-4 inline mr-2" />
                Minimum Link Strength Score
              </label>
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={filters.minStrengthScore} 
                onChange={(e) => updateFilter("minStrengthScore", parseInt(e.target.value))} 
                className="w-full" 
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>0</span>
                <span className="font-medium text-primary">{filters.minStrengthScore}</span>
                <span>100</span>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="showWeakLinks"
                checked={filters.showWeakLinks}
                onChange={(e) => updateFilter("showWeakLinks", e.target.checked)}
                className="rounded border-border"
              />
              <label htmlFor="showWeakLinks" className="text-sm text-foreground cursor-pointer">
                Show weak connections
              </label>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2"><Users className="w-4 h-4 inline mr-2" />Focus on Contacts</label>
          <Select
            isMulti
            options={contactOptions}
            placeholder="Select contacts..."
            value={contactOptions.filter(opt => filters.contactWhitelist.includes(opt.value))}
            onChange={(selected) => updateFilter('contactWhitelist', selected.map(s => s.value))}
            styles={selectStyles}
            className="text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-3"><Hash className="w-4 h-4 inline mr-2" />Minimum Interactions</label>
            <input type="range" min="0" max="100" value={filters.minInteractions} onChange={(e) => updateFilter("minInteractions", parseInt(e.target.value))} className="w-full" />
            <div className="text-center text-sm font-medium text-primary">{filters.minInteractions}+ Interactions</div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-foreground mb-3"><Clock className="w-4 h-4 inline mr-2" />Call Duration</label>
            <input type="range" min="0" max="3600" value={filters.durationRange.max} onChange={(e) => updateFilter('durationRange', { ...filters.durationRange, max: parseInt(e.target.value) })} className="w-full" />
            <div className="text-center text-sm font-medium text-primary">
              Up to {Math.floor(filters.durationRange.max / 60)}m {filters.durationRange.max % 60}s
            </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-3"><Calendar className="w-4 h-4 inline mr-2" />Date Range</label>
          <div className="space-y-3">
            <input type="date" value={filters.dateRange.start} onChange={(e) => updateFilter("dateRange", { ...filters.dateRange, start: e.target.value })} className="w-full px-3 py-2 bg-background border border-border rounded-md"/>
            <input type="date" value={filters.dateRange.end} onChange={(e) => updateFilter("dateRange", { ...filters.dateRange, end: e.target.value })} className="w-full px-3 py-2 bg-background border border-border rounded-md"/>
          </div>
        </div>
      </div>
    </div>
  );
}
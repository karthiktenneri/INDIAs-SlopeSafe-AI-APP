import React, { useState, useEffect } from 'react';
import { 
  X, 
  Menu, 
  Layers, 
  Building2, 
  ShieldCheck, 
  FileSpreadsheet, 
  Network, 
  ChevronRight,
  Maximize2
} from 'lucide-react';
import { StateSusceptibilityIndex } from './StateSusceptibilityIndex';
import { InfrastructureMatrix } from './InfrastructureMatrix';
import { RainfallAndReadiness } from './RainfallAndReadiness';
import { 
  StateSusceptibility, 
  InfrastructureAsset, 
  RainfallRadarData, 
  ReliefReadinessData 
} from '../types';

interface OperationsDashboardDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  states: StateSusceptibility[];
  assets: InfrastructureAsset[];
  rainfallData: RainfallRadarData;
  reliefData: ReliefReadinessData;
  onSelectState: (stateName: string) => void;
  onOpenAssetProtocol: (asset: InfrastructureAsset) => void;
  onOpenEvacuationModal: () => void;
  isDarkMode?: boolean;
}

export type DrawerSection = 'all' | 'states' | 'infra' | 'relief';

export const OperationsDashboardDrawer: React.FC<OperationsDashboardDrawerProps> = ({
  isOpen,
  onClose,
  states,
  assets,
  rainfallData,
  reliefData,
  onSelectState,
  onOpenAssetProtocol,
  onOpenEvacuationModal,
  isDarkMode = false
}) => {
  const [activeSection, setActiveSection] = useState<DrawerSection>('all');

  // Listen for Escape key to close drawer
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div id="operations-dashboard-drawer-portal" className="fixed inset-0 z-50 flex">
      {/* Dimmed backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Slide-out Left Drawer Panel */}
      <div 
        id="operations-dashboard-left-sidebar"
        className={`relative w-full max-w-3xl md:max-w-4xl lg:max-w-5xl h-full flex flex-col shadow-2xl z-50 overflow-hidden transition-transform ${
          isDarkMode 
            ? 'bg-slate-950 text-slate-100 border-r border-slate-800' 
            : 'bg-slate-50 text-slate-900 border-r border-slate-200'
        }`}
      >
        {/* Drawer Top Header */}
        <div className={`p-4 sm:p-5 border-b flex items-center justify-between gap-3 shrink-0 ${
          isDarkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
        }`}>
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-cyan-600 text-white shadow-md">
              <Menu className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black tracking-tight uppercase font-display">
                  Operations &amp; Risk Dashboard
                </h2>
                <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded bg-cyan-100 text-cyan-800 dark:bg-cyan-950 dark:text-cyan-300 border border-cyan-300 dark:border-cyan-800">
                  National Grid
                </span>
              </div>
              <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                Official State &amp; UT Landslide • Critical Mountain Infrastructure (All 4) • NDMA &amp; SDRF Relief
              </p>
            </div>
          </div>

          <button
            id="btn-close-operations-drawer"
            onClick={onClose}
            className={`p-2 rounded-lg transition-colors cursor-pointer ${
              isDarkMode 
                ? 'hover:bg-slate-800 text-slate-400 hover:text-white' 
                : 'hover:bg-slate-100 text-slate-500 hover:text-slate-900'
            }`}
            title="Close Dashboard (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Section Quick Switcher Tabs */}
        <div className={`px-4 sm:px-6 py-2.5 border-b flex items-center gap-2 overflow-x-auto shrink-0 ${
          isDarkMode ? 'bg-slate-900/50 border-slate-800' : 'bg-slate-100/80 border-slate-200'
        }`}>
          <button
            id="tab-section-all"
            onClick={() => setActiveSection('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              activeSection === 'all'
                ? 'bg-cyan-600 text-white shadow-xs'
                : isDarkMode 
                ? 'text-slate-400 hover:text-white hover:bg-slate-800' 
                : 'text-slate-600 hover:text-slate-900 hover:bg-white'
            }`}
          >
            All 3 In Flow
          </button>

          <button
            id="tab-section-states"
            onClick={() => setActiveSection('states')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
              activeSection === 'states'
                ? 'bg-cyan-600 text-white shadow-xs'
                : isDarkMode 
                ? 'text-slate-400 hover:text-white hover:bg-slate-800' 
                : 'text-slate-600 hover:text-slate-900 hover:bg-white'
            }`}
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>1. State &amp; UT Landslide Index</span>
          </button>

          <button
            id="tab-section-infra"
            onClick={() => setActiveSection('infra')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
              activeSection === 'infra'
                ? 'bg-cyan-600 text-white shadow-xs'
                : isDarkMode 
                ? 'text-slate-400 hover:text-white hover:bg-slate-800' 
                : 'text-slate-600 hover:text-slate-900 hover:bg-white'
            }`}
          >
            <Network className="w-3.5 h-3.5" />
            <span>2. Critical Infrastructure Matrix (All 4)</span>
          </button>

          <button
            id="tab-section-relief"
            onClick={() => setActiveSection('relief')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
              activeSection === 'relief'
                ? 'bg-cyan-600 text-white shadow-xs'
                : isDarkMode 
                ? 'text-slate-400 hover:text-white hover:bg-slate-800' 
                : 'text-slate-600 hover:text-slate-900 hover:bg-white'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>3. NDMA &amp; SDRF Relief Readiness</span>
          </button>
        </div>

        {/* Scrollable Drawer Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* SECTION 1: Official State & UT Landslide Susceptibility Index */}
          {(activeSection === 'all' || activeSection === 'states') && (
            <div id="drawer-module-state-index" className="space-y-2">
              <div className="flex items-center justify-between pb-1 border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-600"></span>
                  <h3 className="text-sm font-black uppercase tracking-wider font-display">
                    Official State &amp; UT Landslide Susceptibility Index
                  </h3>
                </div>
                <span className="text-[11px] font-mono text-slate-500">
                  {states.length} Jurisdictions Ranked
                </span>
              </div>
              <StateSusceptibilityIndex 
                states={states}
                onSelectState={(stateName) => {
                  onSelectState(stateName);
                  onClose();
                }}
                isDarkMode={isDarkMode}
              />
            </div>
          )}

          {/* SECTION 2: Critical Mountain Infrastructure Vulnerability Matrix (All 4) */}
          {(activeSection === 'all' || activeSection === 'infra') && (
            <div id="drawer-module-infra-matrix" className="space-y-2 pt-2">
              <div className="flex items-center justify-between pb-1 border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                  <h3 className="text-sm font-black uppercase tracking-wider font-display">
                    Critical Mountain Infrastructure Vulnerability Matrix (All 4 Sectors)
                  </h3>
                </div>
                <span className="text-[11px] font-mono text-slate-500">
                  Dams • Railways • Highways • Tunnels
                </span>
              </div>
              <InfrastructureMatrix 
                assets={assets}
                onOpenAssetProtocol={onOpenAssetProtocol}
                isDarkMode={isDarkMode}
              />
            </div>
          )}

          {/* SECTION 3: NDMA & SDRF Relief Corridor Readiness */}
          {(activeSection === 'all' || activeSection === 'relief') && (
            <div id="drawer-module-relief-readiness" className="space-y-2 pt-2">
              <div className="flex items-center justify-between pb-1 border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                  <h3 className="text-sm font-black uppercase tracking-wider font-display">
                    NDMA &amp; SDRF Relief Corridor Readiness
                  </h3>
                </div>
                <span className="text-[11px] font-mono text-slate-500">
                  4,200 Camps • IAF Mi-17 Air Bridges
                </span>
              </div>
              <RainfallAndReadiness 
                rainfallData={rainfallData}
                reliefData={reliefData}
                onOpenEvacuationModal={onOpenEvacuationModal}
                isDarkMode={isDarkMode}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

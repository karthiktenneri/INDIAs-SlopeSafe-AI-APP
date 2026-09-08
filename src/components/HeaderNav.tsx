import React from 'react';
import { 
  ShieldAlert, 
  MapPin, 
  Layers, 
  FileSpreadsheet, 
  Activity, 
  Network, 
  PhoneCall, 
  Sun, 
  Moon,
  Menu
} from 'lucide-react';
import { SlopeSafeLogo } from './SlopeSafeLogo';

export type ActiveTab = 'gis' | 'state-index' | 'diagnostic' | 'infrastructure';

interface HeaderNavProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onOpenGpsModal: () => void;
  onOpenSosModal: () => void;
  onOpenProximityAlert?: () => void;
  onOpenOperationsDrawer?: () => void;
  isDarkMode: boolean;
  setIsDarkMode: (dark: boolean) => void;
  nodeCount?: number;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({
  activeTab,
  setActiveTab,
  onOpenGpsModal,
  onOpenSosModal,
  onOpenProximityAlert,
  onOpenOperationsDrawer,
  isDarkMode,
  setIsDarkMode,
  nodeCount = 542
}) => {
  return (
    <header 
      id="main-app-header"
      className={`px-3 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 sticky top-0 z-40 backdrop-blur-md border-b transition-colors ${
        isDarkMode 
          ? 'bg-slate-950/95 border-slate-800 text-white' 
          : 'bg-white/95 border-slate-200 text-slate-900 shadow-xs'
      }`}
    >
      {/* Brand Title with Left Menu button and SlopeSafe-AI Official Emblem Logo */}
      <div className="flex items-center space-x-2.5 sm:space-x-3">
        {/* Left Side Dashboard Menu Button */}
        {onOpenOperationsDrawer && (
          <button
            id="btn-left-dashboard-menu"
            onClick={onOpenOperationsDrawer}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-xs shadow-sm transition-all cursor-pointer shrink-0"
            title="Open Dashboard Menu: Official State & UT landslide, Critical infrastructure (all 4), NDMA & SDRF relief readiness"
          >
            <Menu className="w-4 h-4" />
            <span className="font-extrabold hidden sm:inline">Menu (Dashboard)</span>
            <span className="font-extrabold sm:hidden">Menu</span>
          </button>
        )}

        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('gis')}>
          <SlopeSafeLogo size={42} isDarkMode={isDarkMode} />
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className={`text-base sm:text-lg font-black tracking-tight flex items-center gap-1 font-display ${
                isDarkMode ? 'text-white' : 'text-slate-900'
              }`}>
                INDIA&apos;S <span className="text-cyan-600">SlopeSafe</span>
                <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-cyan-100 text-cyan-800 border border-cyan-300 ml-0.5">
                  -AI
                </span>
              </h1>
              <span className="text-[9px] uppercase font-mono font-bold px-1.5 py-0.5 rounded bg-slate-900 text-cyan-400 border border-cyan-700/60 hidden sm:inline-block">
                ERROR 404
              </span>
            </div>
            <p className={`text-[10px] sm:text-[11px] font-mono leading-none ${
              isDarkMode ? 'text-slate-400' : 'text-slate-500'
            }`}>
              National Landslide Risk Intelligence Portal
            </p>
          </div>
        </div>
      </div>

      {/* Center Navigation - Clean & Focused */}
      <nav id="top-nav-menu" className="flex items-center space-x-1 sm:space-x-1.5 overflow-x-auto py-1">
        <button
          id="nav-btn-find-risk"
          onClick={onOpenGpsModal}
          className="flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-extrabold bg-cyan-600 hover:bg-cyan-700 text-white shadow-sm transition-all shrink-0 cursor-pointer"
          title="Detect landslide threat for your exact location"
        >
          <MapPin className="w-3.5 h-3.5" />
          <span>Find Risk Near Me</span>
          <span className="text-[9px] font-black uppercase tracking-wider bg-white/25 text-white px-1 py-0.2 rounded ml-0.5">
            GPS
          </span>
        </button>

        <button
          id="nav-tab-gis"
          onClick={() => setActiveTab('gis')}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 cursor-pointer ${
            activeTab === 'gis'
              ? isDarkMode
                ? 'bg-slate-800 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'bg-slate-100 text-cyan-700 border border-slate-300 shadow-xs'
              : isDarkMode
              ? 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Landslide Risk Portal</span>
        </button>

        <button
          id="nav-tab-diagnostic"
          onClick={() => setActiveTab('diagnostic')}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 cursor-pointer ${
            activeTab === 'diagnostic'
              ? isDarkMode
                ? 'bg-slate-800 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'bg-slate-100 text-cyan-700 border border-slate-300 shadow-xs'
              : isDarkMode
              ? 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Activity className="w-3.5 h-3.5" />
          <span>Detailed Diagnostics</span>
        </button>
      </nav>

      {/* Right Controls: Ground Nodes + SOS + Theme Toggle */}
      <div className="flex items-center space-x-2.5 shrink-0">
        <div 
          id="ground-nodes-status"
          className={`hidden xl:flex items-center space-x-1.5 px-2.5 py-1 rounded-lg border text-xs font-mono ${
            isDarkMode 
              ? 'bg-slate-900 border-slate-800 text-slate-300' 
              : 'bg-slate-50 border-slate-200 text-slate-700'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>{nodeCount} Ground Nodes Synced</span>
        </div>

        {onOpenProximityAlert && (
          <button
            id="proximity-alert-header-btn"
            onClick={onOpenProximityAlert}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-extrabold uppercase tracking-wider bg-red-600 hover:bg-red-700 text-white shadow-md border border-red-500 transition-all cursor-pointer animate-pulse"
            title="Pop Rapid Landslide Proximity Alert Message"
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Danger Warning</span>
            <span className="md:hidden">Alert</span>
          </button>
        )}

        <button
          id="emergency-sos-button"
          onClick={onOpenSosModal}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-extrabold uppercase tracking-wider bg-red-600 hover:bg-red-700 text-white shadow-md border border-red-700 transition-all cursor-pointer"
          title="Emergency National Disaster Management SOS"
        >
          <PhoneCall className="w-3.5 h-3.5 animate-bounce" />
          <span>112 NATIONAL SOS</span>
        </button>

        <button
          id="theme-toggle-btn"
          onClick={() => setIsDarkMode(!isDarkMode)}
          className={`p-2 rounded-lg border transition-colors cursor-pointer ${
            isDarkMode 
              ? 'bg-slate-900 border-slate-800 text-amber-300 hover:bg-slate-800' 
              : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
          }`}
          title={isDarkMode ? "Switch to Light Science Theme" : "Switch to Dark Tactical HUD Theme"}
        >
          {isDarkMode ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4 text-cyan-600" />}
        </button>
      </div>
    </header>
  );
};

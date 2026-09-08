import React from 'react';
import { FileSpreadsheet, ArrowRight, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { StateSusceptibility } from '../types';

interface StateSusceptibilityIndexProps {
  states: StateSusceptibility[];
  onSelectState: (stateName: string) => void;
  isDarkMode?: boolean;
}

export const StateSusceptibilityIndex: React.FC<StateSusceptibilityIndexProps> = ({
  states,
  onSelectState,
  isDarkMode = false
}) => {
  const getCategoryBadge = (category: string) => {
    switch (category) {
      case 'CRITICAL':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'SEVERE':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'HIGHEST OUTSIDE HIMALAYAS':
        return 'bg-rose-100 text-rose-800 border-rose-300';
      case 'ELEVATED':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'MONITORED':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-300';
    }
  };

  const getDotColor = (category: string) => {
    switch (category) {
      case 'CRITICAL':
        return 'bg-red-600';
      case 'SEVERE':
        return 'bg-amber-600';
      case 'HIGHEST OUTSIDE HIMALAYAS':
        return 'bg-rose-600';
      case 'ELEVATED':
        return 'bg-yellow-600';
      case 'MONITORED':
        return 'bg-blue-600';
      default:
        return 'bg-emerald-600';
    }
  };

  return (
    <div 
      id="state-susceptibility-index-section" 
      className={`rounded-xl border shadow-md p-4 sm:p-5 my-4 transition-colors ${
        isDarkMode ? 'border-slate-800 bg-slate-900/95' : 'border-slate-200 bg-white'
      }`}
    >
      {/* Section Header */}
      <div className={`flex flex-wrap items-center justify-between gap-2 pb-3 mb-4 border-b ${
        isDarkMode ? 'border-slate-800' : 'border-slate-200'
      }`}>
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h3 className={`text-sm sm:text-base font-black uppercase tracking-wide flex items-center gap-1.5 font-display ${
              isDarkMode ? 'text-white' : 'text-slate-900'
            }`}>
              <FileSpreadsheet className="w-4 h-4 text-cyan-600" />
              Official State &amp; UT Landslide Susceptibility Index (% of Land Prone)
            </h3>
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-cyan-100 text-cyan-800 border border-cyan-300 font-mono">
              GSI Scientific Baseline
            </span>
          </div>
          <p className={`text-[11px] sm:text-xs mt-0.5 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            Official Geological Survey of India (GSI) quantified Landslide Susceptibility Ranking by % of geographic land area exposed
          </p>
        </div>

        <div className="flex items-center space-x-1.5 text-xs font-mono text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded border border-emerald-300">
          <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
          <span>10 Critical States / UTs Evaluated</span>
        </div>
      </div>

      {/* Grid of 10 State Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {states.map((item) => (
          <div
            key={item.rank}
            id={`state-card-${item.rank}`}
            className={`p-3.5 rounded-xl border transition-all flex flex-col justify-between group shadow-xs ${
              isDarkMode 
                ? 'border-slate-800 hover:border-cyan-500/50 bg-slate-950/60 hover:bg-slate-900' 
                : 'border-slate-200 hover:border-cyan-500 bg-slate-50 hover:bg-white'
            }`}
          >
            <div>
              {/* Card Top Row: Dot, Name, Badge, Large Percentage */}
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className={`w-2.5 h-2.5 rounded-full ${getDotColor(item.riskCategory)} shrink-0`}></span>
                  <span className={`font-bold text-sm font-display ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>
                    {item.rank}. {item.state}
                  </span>
                  <span className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded border font-mono ${getCategoryBadge(item.riskCategory)}`}>
                    {item.riskCategory}
                  </span>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-xl sm:text-2xl font-black text-red-600 font-mono leading-none">
                    {item.pronePercentage.toFixed(1)}%
                  </div>
                  <span className={`text-[9px] uppercase font-bold font-mono ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                    Land Prone
                  </span>
                </div>
              </div>

              {/* Geological Profile Notes */}
              <p className={`text-xs mt-2 line-clamp-2 leading-relaxed ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                {item.geologicalDescription}
              </p>

              {/* Area & Sensor Stats */}
              <div className={`mt-3 pt-2.5 border-t grid grid-cols-2 gap-2 text-[10px] font-mono ${
                isDarkMode ? 'border-slate-800 text-slate-400' : 'border-slate-200 text-slate-500'
              }`}>
                <div>
                  <span className="block">High-Risk Area:</span>
                  <strong className={isDarkMode ? 'text-slate-200' : 'text-slate-800'}>
                    {item.highRiskAreaSqKm.toLocaleString()} km²
                  </strong>
                </div>
                <div>
                  <span className="block">IoT Node Mesh:</span>
                  <strong className="text-cyan-600 font-bold">
                    {item.primaryActiveSensors} In-situ Sensors
                  </strong>
                </div>
              </div>
            </div>

            {/* Bottom Button */}
            <button
              onClick={() => onSelectState(item.state)}
              className={`mt-3 w-full py-1.5 px-2.5 rounded-lg text-xs font-bold transition-all border flex items-center justify-between cursor-pointer ${
                isDarkMode
                  ? 'bg-slate-900 hover:bg-cyan-950 text-slate-200 hover:text-cyan-300 border-slate-700'
                  : 'bg-white hover:bg-cyan-50 text-slate-700 hover:text-cyan-800 border-slate-200'
              }`}
            >
              <span>Inspect {item.state} Corridors</span>
              <ArrowRight className="w-3.5 h-3.5 text-cyan-600 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

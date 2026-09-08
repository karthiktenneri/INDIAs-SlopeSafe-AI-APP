import React, { useState } from 'react';
import { 
  FileSpreadsheet, 
  Search, 
  Filter, 
  ArrowRight, 
  MapPin, 
  ShieldAlert, 
  Activity, 
  Users,
  Compass
} from 'lucide-react';
import { StateSusceptibility, CorridorData } from '../types';

interface StateIndexViewProps {
  states: StateSusceptibility[];
  corridors: CorridorData[];
  onSelectCorridor: (corridor: CorridorData) => void;
  onSelectStateFilter: (stateName: string) => void;
  isDarkMode?: boolean;
}

export const StateIndexView: React.FC<StateIndexViewProps> = ({
  states,
  corridors,
  onSelectCorridor,
  onSelectStateFilter,
  isDarkMode = false
}) => {
  const [filterQuery, setFilterQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('ALL');

  const filteredStates = states.filter((s) => {
    const matchesSearch = s.state.toLowerCase().includes(filterQuery.toLowerCase()) ||
                          s.geologicalDescription.toLowerCase().includes(filterQuery.toLowerCase());
    if (!matchesSearch) return false;

    if (activeCategory === 'CRITICAL') return s.riskCategory === 'CRITICAL';
    if (activeCategory === 'SEVERE') return s.riskCategory === 'SEVERE' || s.riskCategory === 'HIGHEST OUTSIDE HIMALAYAS';
    if (activeCategory === 'ELEVATED') return s.riskCategory === 'ELEVATED';
    if (activeCategory === 'MONITORED') return s.riskCategory === 'MONITORED';
    return true;
  });

  return (
    <div id="state-index-full-view" className="space-y-4 my-4">
      {/* Header Banner */}
      <div className={`p-5 rounded-xl border shadow-md transition-colors ${
        isDarkMode ? 'border-slate-800 bg-slate-900/95 text-white' : 'border-slate-200 bg-white text-slate-900'
      }`}>
        <div className={`flex flex-wrap items-center justify-between gap-3 pb-3 border-b ${
          isDarkMode ? 'border-slate-800' : 'border-slate-200'
        }`}>
          <div>
            <div className="flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5 text-cyan-600" />
              <h2 className="text-lg sm:text-xl font-black uppercase font-display tracking-wide">
                National Landslide Susceptibility Registry &amp; State Index
              </h2>
            </div>
            <p className={`text-xs mt-1 max-w-3xl ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              Geological Survey of India (GSI) comprehensive national assessment evaluating 10 priority mountain and hilly states across 420,000 sq km of vulnerable terrain.
            </p>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs">
            <span className={`px-3 py-1 rounded-lg border ${
              isDarkMode ? 'bg-slate-950 border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'
            }`}>
              Assessed: <strong className="text-cyan-600">10 States / UTs</strong>
            </span>
            <span className="bg-red-100 px-3 py-1 rounded-lg border border-red-300 text-red-800 font-bold">
              Critical Arc: <strong className="text-red-700">3 States &gt;50%</strong>
            </span>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3">
          {/* Search Box */}
          <div className="relative flex-1 min-w-[240px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              placeholder="Filter states by name, geology, or mountain range..."
              className={`w-full pl-9 pr-3 py-1.5 rounded-lg border text-xs font-mono focus:outline-none focus:ring-2 focus:ring-cyan-500 ${
                isDarkMode 
                  ? 'bg-slate-950 border-slate-700 text-slate-200' 
                  : 'bg-slate-50 border-slate-300 text-slate-800'
              }`}
            />
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 text-xs font-mono">
            {['ALL', 'CRITICAL', 'SEVERE', 'ELEVATED', 'MONITORED'].map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                  activeCategory === cat
                    ? 'bg-cyan-600 text-white shadow-xs'
                    : isDarkMode
                    ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* States List Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredStates.map((st) => {
          const stateCorridors = corridors.filter(c => c.state.toLowerCase().includes(st.state.toLowerCase()));

          return (
            <div
              key={st.rank}
              className={`p-4 rounded-xl border transition-all space-y-3 shadow-xs ${
                isDarkMode 
                  ? 'border-slate-800 hover:border-cyan-500/50 bg-slate-900/80 text-white' 
                  : 'border-slate-200 hover:border-cyan-500 bg-white text-slate-900'
              }`}
            >
              {/* Header */}
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
                    <h3 className="text-base font-extrabold font-display">
                      #{st.rank} {st.state}
                    </h3>
                    <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-red-100 text-red-800 border border-red-300">
                      {st.riskCategory}
                    </span>
                  </div>
                  <p className={`text-xs mt-1 font-sans ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                    {st.geologicalDescription}
                  </p>
                </div>

                <div className="text-right font-mono">
                  <div className="text-2xl font-black text-red-600">
                    {st.pronePercentage.toFixed(1)}%
                  </div>
                  <span className={`text-[9px] uppercase font-bold ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                    Geographic Prone
                  </span>
                </div>
              </div>

              {/* Stats Grid */}
              <div className={`grid grid-cols-3 gap-2 font-mono text-[11px] p-2.5 rounded-lg border ${
                isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}>
                <div>
                  <span className={`block text-[10px] ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>Total Area</span>
                  <span className="font-bold">{st.totalAreaSqKm.toLocaleString()} km²</span>
                </div>
                <div>
                  <span className={`block text-[10px] ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>High Hazard Area</span>
                  <span className="text-red-600 font-bold">{st.highRiskAreaSqKm.toLocaleString()} km²</span>
                </div>
                <div>
                  <span className={`block text-[10px] ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>Active IoT Grid</span>
                  <span className="text-emerald-600 font-bold">{st.primaryActiveSensors} Sensors</span>
                </div>
              </div>

              {/* Emergency Response & Corridors */}
              <div className={`pt-2 border-t flex flex-wrap items-center justify-between gap-2 text-xs font-mono ${
                isDarkMode ? 'border-slate-800' : 'border-slate-100'
              }`}>
                <span className={`text-[11px] ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                  NDRF: <strong className={isDarkMode ? 'text-slate-200' : 'text-slate-800'}>{st.ndrfBattalion}</strong>
                </span>

                {stateCorridors.length > 0 && (
                  <button
                    onClick={() => onSelectCorridor(stateCorridors[0])}
                    className="text-cyan-700 hover:text-cyan-800 font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <span>Inspect {stateCorridors[0].shortName}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

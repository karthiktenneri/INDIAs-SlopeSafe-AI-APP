import React, { useState, useMemo } from 'react';
import { 
  Search, 
  MapPin, 
  ChevronDown, 
  ChevronUp, 
  AlertTriangle, 
  ShieldAlert, 
  Activity, 
  Mountain, 
  CloudRain, 
  Layers, 
  Compass, 
  ExternalLink,
  Sliders,
  PhoneCall,
  CheckCircle2,
  Eye,
  EyeOff
} from 'lucide-react';
import { CorridorData } from '../types';

interface GeohazardSearchConsoleProps {
  corridors: CorridorData[];
  selectedCorridor: CorridorData;
  onSelectCorridor: (corridor: CorridorData) => void;
  onOpenDiagnostic: (corridor: CorridorData) => void;
  onHaltTraffic?: (corridor: CorridorData) => void;
  onDispatchSdrf?: (corridor: CorridorData) => void;
  isDarkMode?: boolean;
}

export const GeohazardSearchConsole: React.FC<GeohazardSearchConsoleProps> = ({
  corridors,
  selectedCorridor,
  onSelectCorridor,
  onOpenDiagnostic,
  onHaltTraffic,
  onDispatchSdrf,
  isDarkMode = false
}) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [selectedRegionFilter, setSelectedRegionFilter] = useState<string>('All Regions');
  const [showDetailedProfile, setShowDetailedProfile] = useState<boolean>(false);

  const regionCategories = [
    'All Regions',
    'Himalayan Arc',
    'Western Ghats',
    'Northeast Hills',
    'Eastern Ghats',
    'Central & Aravalli'
  ];

  // Comprehensive search matching by sector name, district, state, mountain range, or region
  const filteredCorridors = useMemo(() => {
    return corridors.filter((item) => {
      const matchesRegion = 
        selectedRegionFilter === 'All Regions' || item.region === selectedRegionFilter;
      
      const query = searchTerm.toLowerCase().trim();
      if (!query) return matchesRegion;

      const matchesQuery = 
        item.name.toLowerCase().includes(query) ||
        item.shortName.toLowerCase().includes(query) ||
        item.state.toLowerCase().includes(query) ||
        (item.district && item.district.toLowerCase().includes(query)) ||
        (item.mountainRange && item.mountainRange.toLowerCase().includes(query)) ||
        item.region.toLowerCase().includes(query) ||
        (item.lithology && item.lithology.toLowerCase().includes(query));

      return matchesRegion && matchesQuery;
    });
  }, [corridors, searchTerm, selectedRegionFilter]);

  const handleSelect = (corridor: CorridorData) => {
    onSelectCorridor(corridor);
    setSearchTerm('');
    setIsDropdownOpen(false);
  };

  const getRiskBadge = (percent: number) => {
    if (percent >= 80) {
      return (
        <span className="px-2 py-0.5 rounded text-[11px] font-black uppercase font-mono bg-red-100 text-red-700 border border-red-300">
          Critical ({percent}%)
        </span>
      );
    }
    if (percent >= 70) {
      return (
        <span className="px-2 py-0.5 rounded text-[11px] font-bold uppercase font-mono bg-amber-100 text-amber-800 border border-amber-300">
          Severe ({percent}%)
        </span>
      );
    }
    if (percent >= 60) {
      return (
        <span className="px-2 py-0.5 rounded text-[11px] font-bold uppercase font-mono bg-cyan-100 text-cyan-800 border border-cyan-300">
          Monitored ({percent}%)
        </span>
      );
    }
    return (
      <span className="px-2 py-0.5 rounded text-[11px] font-bold uppercase font-mono bg-emerald-100 text-emerald-800 border border-emerald-300">
        Normal ({percent}%)
      </span>
    );
  };

  return (
    <div 
      id="geohazard-search-console-section"
      className={`rounded-xl border shadow-md p-4 sm:p-5 my-4 transition-colors ${
        isDarkMode ? 'bg-slate-900/95 border-slate-800' : 'bg-white border-slate-200'
      }`}
    >
      {/* Header & Subtitle */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <Mountain className="w-5 h-5 text-cyan-600" />
            <h2 className={`text-base sm:text-lg font-black uppercase tracking-tight font-display ${
              isDarkMode ? 'text-white' : 'text-slate-900'
            }`}>
              Mountain &amp; Hill Geohazard Search Console
            </h2>
          </div>
          <p className={`text-xs mt-0.5 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            Search across 60+ Indian mountain sectors, hill stations, ghats &amp; passes with verified lithology &amp; elevation
          </p>
        </div>

        {/* Region Filter Chips */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          {regionCategories.map((region) => (
            <button
              key={region}
              onClick={() => setSelectedRegionFilter(region)}
              className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer ${
                selectedRegionFilter === region
                  ? 'bg-cyan-600 text-white shadow-sm'
                  : isDarkMode
                  ? 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200'
              }`}
            >
              {region}
            </button>
          ))}
        </div>
      </div>

      {/* Main Search Input & Dropdown */}
      <div className="relative mb-4">
        <div className={`relative flex items-center rounded-lg border focus-within:ring-2 focus-within:ring-cyan-500 transition-all ${
          isDarkMode ? 'bg-slate-950 border-slate-700' : 'bg-slate-50 border-slate-300'
        }`}>
          <div className="pl-3.5 pr-2 text-slate-400">
            <Search className="w-4 h-4 text-cyan-600" />
          </div>

          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setIsDropdownOpen(true);
            }}
            onFocus={() => setIsDropdownOpen(true)}
            placeholder="Search hill sector (e.g., Ooty, Munnar, Wayanad, Joshimath, Darjeeling, Agumbe, Shimla, Kasara, Araku, Tawang)..."
            className={`w-full py-2.5 pr-10 text-xs sm:text-sm font-medium bg-transparent focus:outline-none ${
              isDarkMode ? 'text-white placeholder:text-slate-500' : 'text-slate-900 placeholder:text-slate-400'
            }`}
          />

          {searchTerm && (
            <button
              onClick={() => {
                setSearchTerm('');
                setIsDropdownOpen(false);
              }}
              className="pr-3 text-xs text-slate-400 hover:text-slate-600 cursor-pointer font-bold"
            >
              Clear
            </button>
          )}
        </div>

        {/* Dropdown Results Box */}
        {isDropdownOpen && (
          <div className={`absolute left-0 right-0 top-full mt-1.5 z-40 max-h-80 overflow-y-auto rounded-lg border shadow-xl backdrop-blur-lg divide-y ${
            isDarkMode 
              ? 'bg-slate-900 border-slate-700 divide-slate-800' 
              : 'bg-white border-slate-200 divide-slate-100'
          }`}>
            <div className={`p-2 px-3 text-[11px] font-mono flex items-center justify-between ${
              isDarkMode ? 'bg-slate-950 text-slate-400' : 'bg-slate-50 text-slate-500'
            }`}>
              <span>Found {filteredCorridors.length} matching mountain &amp; hill locations</span>
              <button 
                onClick={() => setIsDropdownOpen(false)}
                className="hover:underline font-bold text-cyan-600"
              >
                Close (ESC)
              </button>
            </div>

            {filteredCorridors.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-400 font-mono">
                No mountain sector found matching &quot;{searchTerm}&quot;. Try searching by district (e.g., Chamoli, Nilgiris, Idukki, Ramban) or state name.
              </div>
            ) : (
              filteredCorridors.map((corridor) => (
                <div
                  key={corridor.id}
                  onClick={() => handleSelect(corridor)}
                  className={`p-3 cursor-pointer transition-colors flex items-center justify-between gap-3 ${
                    isDarkMode 
                      ? 'hover:bg-slate-800/80 text-slate-200' 
                      : 'hover:bg-slate-50 text-slate-800'
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    <MapPin className="w-4 h-4 text-cyan-600 mt-0.5 shrink-0" />
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold">{corridor.name}</h4>
                      <p className={`text-[11px] font-mono mt-0.5 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                        {corridor.mountainRange} • {corridor.district ? `${corridor.district}, ` : ''}{corridor.state} • Elev: {corridor.elevationM}m AMSL
                      </p>
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center gap-2">
                    {getRiskBadge(corridor.riskPercent)}
                    <span className="text-[10px] font-mono text-cyan-600 font-bold hidden sm:inline">
                      Select &rarr;
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Currently Selected Mountain Sector Banner & Quick Diagnostic Header */}
      <div className={`p-4 rounded-xl border ${
        isDarkMode ? 'bg-slate-950/80 border-slate-800' : 'bg-slate-50 border-slate-200'
      }`}>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse"></span>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-700">
                Active Inspected Sector
              </span>
              {getRiskBadge(selectedCorridor.riskPercent)}
            </div>

            <h3 className={`text-sm sm:text-base font-black uppercase font-display ${
              isDarkMode ? 'text-white' : 'text-slate-900'
            }`}>
              {selectedCorridor.name}
            </h3>

            <p className={`text-xs font-mono ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              <strong>Range:</strong> {selectedCorridor.mountainRange} | <strong>District/State:</strong> {selectedCorridor.district ? `${selectedCorridor.district}, ` : ''}{selectedCorridor.state} | <strong>Elevation:</strong> {selectedCorridor.elevationM}m AMSL | <strong>Coords:</strong> {selectedCorridor.lat.toFixed(4)}°N, {selectedCorridor.lon.toFixed(4)}°E
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* Toggle Button for Details (Satisfying: display only when we ask) */}
            <button
              onClick={() => setShowDetailedProfile(!showDetailedProfile)}
              className={`px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all border cursor-pointer ${
                showDetailedProfile
                  ? 'bg-cyan-600 text-white border-cyan-700'
                  : isDarkMode
                  ? 'bg-slate-800 text-slate-200 hover:bg-slate-700 border-slate-700'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border-slate-300'
              }`}
            >
              {showDetailedProfile ? (
                <>
                  <EyeOff className="w-4 h-4 text-white" />
                  <span>Hide Details</span>
                  <ChevronUp className="w-4 h-4" />
                </>
              ) : (
                <>
                  <Eye className="w-4 h-4 text-cyan-600" />
                  <span>View Geological &amp; Hill Details</span>
                  <ChevronDown className="w-4 h-4" />
                </>
              )}
            </button>

            <button
              onClick={() => onOpenDiagnostic(selectedCorridor)}
              className="px-3 py-2 rounded-lg text-xs font-black uppercase tracking-wider bg-red-600 hover:bg-red-700 text-white shadow transition-all flex items-center gap-1 cursor-pointer whitespace-nowrap"
            >
              <span>Full Diagnostic Dossier</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Primary Real-time Telemetry Grid (Light Mode) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 mt-3 text-xs">
          <div className={`p-2.5 rounded-lg border ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
            <span className={`text-[10px] uppercase font-mono block ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Factor of Safety</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-base font-black font-mono text-red-600">
                {selectedCorridor.fos.toFixed(2)}
              </span>
              <span className="text-[10px] text-slate-400 font-mono">(&lt;1.0 Critical)</span>
            </div>
          </div>

          <div className={`p-2.5 rounded-lg border ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
            <span className={`text-[10px] uppercase font-mono block ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Failure Window</span>
            <div className="text-xs font-black font-mono text-amber-600 mt-0.5 truncate">
              {selectedCorridor.failureWindow}
            </div>
          </div>

          <div className={`p-2.5 rounded-lg border ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
            <span className={`text-[10px] uppercase font-mono block ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Subsurface Creep</span>
            <div className="text-xs font-black font-mono text-red-600 mt-0.5">
              {selectedCorridor.displacementCreep}
            </div>
          </div>

          <div className={`p-2.5 rounded-lg border ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
            <span className={`text-[10px] uppercase font-mono block ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Moisture Saturation</span>
            <div className="text-xs font-black font-mono text-cyan-600 mt-0.5">
              {selectedCorridor.moistureSaturation}%
            </div>
          </div>

          <div className={`p-2.5 rounded-lg border ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
            <span className={`text-[10px] uppercase font-mono block ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>24h Rainfall / Limit</span>
            <div className="text-xs font-black font-mono text-slate-800 dark:text-slate-200 mt-0.5">
              {selectedCorridor.rainfall24h} / {selectedCorridor.rainfallThreshold} mm
            </div>
          </div>

          <div className={`p-2.5 rounded-lg border ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
            <span className={`text-[10px] uppercase font-mono block ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Pore Water Head</span>
            <div className="text-xs font-black font-mono text-red-600 mt-0.5">
              {selectedCorridor.porePressure} kPa
            </div>
          </div>
        </div>

        {/* EXPANDABLE SECTION: Complete Mountain & Hill Area Geotechnical Profile (DISPLAYED ONLY WHEN ASKED) */}
        {showDetailedProfile && (
          <div className={`mt-4 pt-4 border-t space-y-3 animate-fadeIn ${
            isDarkMode ? 'border-slate-800' : 'border-slate-200'
          }`}>
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-cyan-600" />
              <h4 className={`text-xs font-black uppercase tracking-wider font-display ${
                isDarkMode ? 'text-slate-200' : 'text-slate-800'
              }`}>
                Sector Detailed Geological &amp; Relief Specifications (On-Demand)
              </h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
              {/* Lithology & Stratigraphy */}
              <div className={`p-3 rounded-lg border ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                <span className="text-[10px] font-bold font-mono text-cyan-600 uppercase block mb-1">
                  Lithology &amp; Bedrock Composition
                </span>
                <p className={`font-medium ${isDarkMode ? 'text-slate-300' : 'text-slate-800'}`}>
                  {selectedCorridor.lithology || 'Weathered metamorphic schist and fractured quartzites with clay slip planes.'}
                </p>
                <div className={`mt-2 text-[10px] font-mono ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  Slope Angle: <strong>{selectedCorridor.slopeAngle || '42° steep scarp with active toe erosion'}</strong>
                </div>
              </div>

              {/* Tectonic & Fault Line */}
              <div className={`p-3 rounded-lg border ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                <span className="text-[10px] font-bold font-mono text-amber-600 uppercase block mb-1">
                  Seismic Zone &amp; Structural Fault
                </span>
                <p className={`font-medium ${isDarkMode ? 'text-slate-300' : 'text-slate-800'}`}>
                  {selectedCorridor.seismicZone}
                </p>
                <div className={`mt-2 text-[10px] font-mono ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  Tectonic Fault: <strong>{selectedCorridor.faultLine || 'Main Boundary Thrust (MBT) Branch'}</strong>
                </div>
              </div>

              {/* Evacuation Route & Emergency Base */}
              <div className={`p-3 rounded-lg border ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                <span className="text-[10px] font-bold font-mono text-emerald-600 uppercase block mb-1">
                  Evacuation Corridor &amp; Response Base
                </span>
                <p className={`font-medium ${isDarkMode ? 'text-slate-300' : 'text-slate-800'}`}>
                  {selectedCorridor.evacuationRoute || 'Primary downstream ridge highway to district emergency staging center.'}
                </p>
                <div className="flex items-center gap-1.5 mt-2 text-[10px] font-mono text-slate-600 dark:text-slate-400">
                  <PhoneCall className="w-3.5 h-3.5 text-cyan-600" />
                  <span>24/7 Helpline: <strong>{selectedCorridor.emergencyHelpline || '1077 / 03592-284444'}</strong></span>
                </div>
              </div>
            </div>

            {/* In-situ Sensors Deployed in Sector */}
            <div className={`p-3 rounded-lg border flex flex-wrap items-center justify-between gap-2 ${
              isDarkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200'
            }`}>
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-cyan-600" />
                <span className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300">
                  In-Situ IoT Monitoring Node Count: <strong>{selectedCorridor.iotNodeCount} active sensors</strong>
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-1.5 text-[10px] font-mono">
                {selectedCorridor.activeSensors?.map((sensor) => (
                  <span key={sensor} className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300">
                    {sensor}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

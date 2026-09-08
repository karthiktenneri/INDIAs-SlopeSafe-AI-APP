import React from 'react';
import { Crosshair, MapPin, LocateFixed, Compass, ShieldCheck } from 'lucide-react';
import { CorridorData } from '../types';

interface HeroOverviewProps {
  activeCorridor: CorridorData;
  onOpenGpsDetect: () => void;
  onOpenCustomLatLon: () => void;
  isDarkMode?: boolean;
}

export const HeroOverview: React.FC<HeroOverviewProps> = ({
  activeCorridor,
  onOpenGpsDetect,
  onOpenCustomLatLon,
  isDarkMode = false
}) => {
  return (
    <div id="national-geohazard-hero" className="grid grid-cols-1 lg:grid-cols-12 gap-4 my-4">
      {/* Left Card: System Identity & Mission */}
      <div 
        id="hero-system-identity-panel"
        className={`lg:col-span-8 p-4 sm:p-5 rounded-xl border shadow-sm relative overflow-hidden flex flex-col justify-between transition-colors ${
          isDarkMode ? 'border-slate-800 bg-slate-900/95' : 'border-slate-200 bg-white'
        }`}
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none -mr-16 -mt-16" />
        
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-cyan-100 text-cyan-800 border border-cyan-300">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-600 animate-pulse"></span>
              National Geohazard Portal
            </span>
            <span className={`text-xs font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              Himalayan Arc • Western Ghats • North-Eastern Hill Tracts • Nilgiris
            </span>
          </div>

          <h2 className={`text-xl sm:text-2xl lg:text-[26px] font-black tracking-tight font-display mb-2 ${
            isDarkMode ? 'text-white' : 'text-slate-900'
          }`}>
            National Landslide Risk Monitoring &amp; Early Warning System
          </h2>

          <p className={`text-xs sm:text-sm leading-relaxed max-w-4xl ${
            isDarkMode ? 'text-slate-300' : 'text-slate-600'
          }`}>
            Integrated 24/7 AI-driven geotechnical warning network combining ISRO Earth Observation satellites, IMD Doppler radars, and mountain-anchored IoT sensor grids across vulnerable Indian hill corridors.
          </p>
        </div>

        <div className={`mt-4 pt-3 border-t flex flex-wrap items-center justify-between text-xs gap-2 ${
          isDarkMode ? 'border-slate-800 text-slate-400' : 'border-slate-100 text-slate-500'
        }`}>
          <div className="flex items-center gap-3 font-mono text-[11px]">
            <span className={`flex items-center gap-1 font-semibold ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              GSI Scientific Baseline
            </span>
            <span>•</span>
            <span>NISAR L-Band SAR Active</span>
            <span>•</span>
            <span className="text-cyan-600 font-medium">IMD AWS Doppler Grid Synced</span>
          </div>
          <span className="text-[10px] font-mono font-bold">
            REF: NDMA-SOP-LS-2026
          </span>
        </div>
      </div>

      {/* Right Card: National Ground Fix */}
      <div 
        id="hero-ground-fix-panel"
        className={`lg:col-span-4 p-4 sm:p-5 rounded-xl border shadow-sm flex flex-col justify-between transition-colors ${
          isDarkMode ? 'border-slate-800 bg-slate-900/95' : 'border-slate-200 bg-white'
        }`}
      >
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className={`text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 font-mono ${
              isDarkMode ? 'text-slate-200' : 'text-slate-800'
            }`}>
              <Crosshair className="w-3.5 h-3.5 text-cyan-600" />
              National Ground Fix
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300 font-mono">
              DGPS Calibrated
            </span>
          </div>

          <div className="space-y-2 font-mono text-xs">
            <div className="flex items-start justify-between">
              <span className={isDarkMode ? 'text-slate-400' : 'text-slate-500'}>Selected Sector:</span>
              <span className={`font-semibold text-right truncate max-w-[200px] ${
                isDarkMode ? 'text-slate-100' : 'text-slate-900'
              }`} title={activeCorridor.name}>
                {activeCorridor.state} ({activeCorridor.shortName})
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className={isDarkMode ? 'text-slate-400' : 'text-slate-500'}>Coordinates:</span>
              <span className={`font-bold px-2 py-0.5 rounded border ${
                isDarkMode ? 'bg-slate-950 text-cyan-300 border-cyan-900/40' : 'bg-slate-50 text-cyan-800 border-slate-200'
              }`}>
                {activeCorridor.lat.toFixed(4)}° N, {activeCorridor.lon.toFixed(4)}° E
              </span>
            </div>

            <div className="flex items-start justify-between">
              <span className={isDarkMode ? 'text-slate-400' : 'text-slate-500'}>Seismic Hazard:</span>
              <span className="text-amber-600 text-right text-[11px] font-bold">
                {activeCorridor.seismicZone}
              </span>
            </div>

            {/* Live Weather, Temp & Soil Moisture in Plain English */}
            <div className={`p-2 rounded-lg border grid grid-cols-3 gap-1 text-center ${
              isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}>
              <div>
                <span className="text-[10px] text-slate-500 block">Temp</span>
                <span className="text-xs font-bold text-orange-600 font-sans">
                  {activeCorridor.temperatureC ?? Math.round(28 - (activeCorridor.elevationM / 1000) * 6.5)}°C
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block">Rain / 24h</span>
                <span className="text-xs font-bold text-blue-600 font-sans">
                  {activeCorridor.rainfall24h} mm
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block">Soil Wetness</span>
                <span className="text-xs font-bold text-cyan-700 font-sans">
                  {activeCorridor.moistureSaturation}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick GPS / Coordinate Pin Trigger */}
        <div className={`mt-4 pt-3 border-t flex items-center gap-2 ${
          isDarkMode ? 'border-slate-800' : 'border-slate-100'
        }`}>
          <button
            id="hero-gps-detect-btn"
            onClick={onOpenGpsDetect}
            className="flex-1 py-1.5 px-2.5 rounded-lg text-xs font-extrabold bg-cyan-600 hover:bg-cyan-700 text-white shadow-xs transition-all flex items-center justify-center gap-1 cursor-pointer"
          >
            <LocateFixed className="w-3.5 h-3.5" />
            <span>Detect My GPS</span>
          </button>

          <button
            id="hero-custom-coords-btn"
            onClick={onOpenCustomLatLon}
            className={`py-1.5 px-2.5 rounded-lg text-xs font-bold transition-all border flex items-center justify-center gap-1 cursor-pointer ${
              isDarkMode 
                ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700' 
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300'
            }`}
          >
            <Compass className="w-3.5 h-3.5 text-cyan-600" />
            <span>Enter Lat/Lon</span>
          </button>
        </div>
      </div>
    </div>
  );
};

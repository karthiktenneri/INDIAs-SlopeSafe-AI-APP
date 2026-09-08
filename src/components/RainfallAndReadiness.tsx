import React from 'react';
import { 
  CloudRain, 
  ShieldCheck, 
  Eye, 
  AlertCircle, 
  Plane, 
  Building2, 
  Users, 
  TrendingUp,
  Compass
} from 'lucide-react';
import { RainfallRadarData, ReliefReadinessData } from '../types';

interface RainfallAndReadinessProps {
  rainfallData: RainfallRadarData;
  reliefData: ReliefReadinessData;
  onOpenEvacuationModal: () => void;
  isDarkMode?: boolean;
}

export const RainfallAndReadiness: React.FC<RainfallAndReadinessProps> = ({
  rainfallData,
  reliefData,
  onOpenEvacuationModal,
  isDarkMode = false
}) => {
  return (
    <div id="rainfall-and-relief-readiness-row" className="grid grid-cols-1 lg:grid-cols-2 gap-4 my-4">
      {/* Left Module: IMD Rainfall & Saturation Radar */}
      <div 
        id="imd-rainfall-radar-panel"
        className={`rounded-xl border shadow-md p-4 sm:p-5 flex flex-col justify-between transition-colors ${
          isDarkMode ? 'border-slate-800 bg-slate-900/95' : 'border-slate-200 bg-white'
        }`}
      >
        <div>
          {/* Header */}
          <div className={`flex flex-wrap items-center justify-between gap-2 pb-3 mb-3 border-b ${
            isDarkMode ? 'border-slate-800' : 'border-slate-200'
          }`}>
            <div>
              <div className="flex items-center gap-2">
                <CloudRain className="w-4 h-4 text-cyan-600" />
                <h3 className={`text-sm sm:text-base font-black uppercase tracking-wide font-display ${
                  isDarkMode ? 'text-white' : 'text-slate-900'
                }`}>
                  IMD High-Altitude Rainfall &amp; Saturation Radar
                </h3>
              </div>
              <p className={`text-[11px] sm:text-xs mt-0.5 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                Antecedent precipitation index vs geotechnical failure thresholds
              </p>
            </div>

            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-rose-100 text-rose-800 border border-rose-300 font-mono flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-pulse"></span>
              Cloudburst Track Active
            </span>
          </div>

          {/* 3 Metric Cards */}
          <div className="grid grid-cols-3 gap-2.5 mb-4">
            <div className={`p-2.5 rounded-lg border ${
              isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}>
              <span className={`text-[9px] sm:text-[10px] uppercase font-bold block font-mono ${
                isDarkMode ? 'text-slate-400' : 'text-slate-500'
              }`}>
                Cumulative 72h Inflow
              </span>
              <div className="text-sm sm:text-lg font-black text-red-600 font-mono mt-0.5">
                {rainfallData.cumulative72h} mm
              </div>
              <span className="text-[9px] sm:text-[10px] text-red-600/80 font-mono block">
                185% normal threshold
              </span>
            </div>

            <div className={`p-2.5 rounded-lg border ${
              isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}>
              <span className={`text-[9px] sm:text-[10px] uppercase font-bold block font-mono ${
                isDarkMode ? 'text-slate-400' : 'text-slate-500'
              }`}>
                Subsurface Liquefaction
              </span>
              <div className="text-sm sm:text-lg font-black text-amber-600 font-mono mt-0.5">
                {rainfallData.subsurfaceLiquefaction} Ru
              </div>
              <span className="text-[9px] sm:text-[10px] text-amber-600/80 font-mono block">
                Critical pore pressure head
              </span>
            </div>

            <div className={`p-2.5 rounded-lg border ${
              isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}>
              <span className={`text-[9px] sm:text-[10px] uppercase font-bold block font-mono ${
                isDarkMode ? 'text-slate-400' : 'text-slate-500'
              }`}>
                Next 48h Rain Forecast
              </span>
              <div className="text-sm sm:text-lg font-black text-cyan-600 font-mono mt-0.5">
                {rainfallData.next48hForecast} mm
              </div>
              <span className="text-[9px] sm:text-[10px] text-cyan-700/80 font-mono block">
                Doppler squall ETA: 3.5h
              </span>
            </div>
          </div>

          {/* High-Altitude Corridor Rainfall Threshold Status List */}
          <div>
            <div className={`text-[10px] sm:text-[11px] font-bold uppercase mb-2 font-mono ${
              isDarkMode ? 'text-slate-400' : 'text-slate-600'
            }`}>
              High-Altitude Corridor Rainfall Threshold Status:
            </div>

            <div className="space-y-2">
              {rainfallData.corridorStatuses.map((item, idx) => (
                <div 
                  key={idx} 
                  className={`p-2.5 rounded-lg border ${
                    isDarkMode ? 'bg-slate-950/80 border-slate-800' : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-mono mb-1">
                    <span className={`font-semibold ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>{item.corridor}</span>
                    <span className="font-bold text-red-600">
                      {item.current} mm / {item.threshold} mm limit
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${item.percentageOver > 100 ? 'bg-red-600' : 'bg-amber-500'}`}
                      style={{ width: `${Math.min(item.percentageOver, 100)}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[10px] font-mono mt-1">
                    <span className={item.percentageOver > 100 ? 'text-red-600 font-bold' : 'text-amber-600 font-bold'}>
                      Status: {item.status} ({item.percentageOver > 100 ? `+${item.percentageOver - 100}% over threshold` : 'Normal'})
                    </span>
                    <span className={isDarkMode ? 'text-slate-400' : 'text-slate-500'}>GSI EWS In-situ</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer info note */}
        <div className={`mt-4 pt-3 border-t text-[10px] font-mono flex items-center justify-between ${
          isDarkMode ? 'border-slate-800 text-slate-400' : 'border-slate-200 text-slate-500'
        }`}>
          <span>Sensor Update: IMD AWS Network Active</span>
          <span>Source: GSI / IMD Joint Cell</span>
        </div>
      </div>

      {/* Right Module: NDMA & SDRF Relief Corridor Readiness */}
      <div 
        id="ndma-relief-readiness-panel"
        className={`rounded-xl border shadow-md p-4 sm:p-5 flex flex-col justify-between transition-colors ${
          isDarkMode ? 'border-slate-800 bg-slate-900/95' : 'border-slate-200 bg-white'
        }`}
      >
        <div>
          {/* Header */}
          <div className={`flex flex-wrap items-center justify-between gap-2 pb-3 mb-3 border-b ${
            isDarkMode ? 'border-slate-800' : 'border-slate-200'
          }`}>
            <div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <h3 className={`text-sm sm:text-base font-black uppercase tracking-wide font-display ${
                  isDarkMode ? 'text-white' : 'text-slate-900'
                }`}>
                  NDMA &amp; SDRF Relief Corridor Readiness
                </h3>
              </div>
              <p className={`text-[11px] sm:text-xs mt-0.5 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                Emergency shelter capacities, air-evacuation routes &amp; pre-deployed battalion assets
              </p>
            </div>

            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300 font-mono flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
              Readiness: DEFCON 2
            </span>
          </div>

          {/* 3 Relief Status Cards */}
          <div className="space-y-2.5 mb-4">
            <div className={`p-3 rounded-lg border flex items-center justify-between gap-3 ${
              isDarkMode ? 'bg-slate-950/80 border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="flex items-center space-x-3">
                <Building2 className="w-5 h-5 text-cyan-600 shrink-0" />
                <div>
                  <div className={`text-xs font-bold ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>
                    Active Shelter Centers: {reliefData.activeCenters.toLocaleString()} Safe Bunkers
                  </div>
                  <div className={`text-[10px] font-mono mt-0.5 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                    {reliefData.centerLocations}
                  </div>
                </div>
              </div>
              <span className="text-xs font-bold text-emerald-600 font-mono shrink-0">
                {reliefData.bedCapacityAvail}
              </span>
            </div>

            <div className={`p-3 rounded-lg border flex items-center justify-between gap-3 ${
              isDarkMode ? 'bg-slate-950/80 border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="flex items-center space-x-3">
                <Plane className="w-5 h-5 text-cyan-600 shrink-0" />
                <div>
                  <div className={`text-xs font-bold ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>
                    Helipad &amp; Air-Drop Clearance: {reliefData.helipadReadiness}
                  </div>
                  <div className={`text-[10px] font-mono mt-0.5 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                    {reliefData.helipadLocations}
                  </div>
                </div>
              </div>
              <span className="text-xs font-bold text-cyan-600 font-mono shrink-0">
                {reliefData.iafAlertStatus}
              </span>
            </div>

            <div className={`p-3 rounded-lg border flex items-center justify-between gap-3 ${
              isDarkMode ? 'bg-slate-950/80 border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="flex items-center space-x-3">
                <Users className="w-5 h-5 text-emerald-600 shrink-0" />
                <div>
                  <div className={`text-xs font-bold ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>
                    NDRF / SDRF Deployment: {reliefData.ndrfPersonnel} Personnel On-Site
                  </div>
                  <div className={`text-[10px] font-mono mt-0.5 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                    {reliefData.ndrfBattalions}
                  </div>
                </div>
              </div>
              <span className="text-xs font-bold text-amber-600 font-mono shrink-0">
                {reliefData.equipmentReady}
              </span>
            </div>
          </div>
        </div>

        {/* Evacuation Protocol Trigger Button */}
        <div>
          <button
            id="open-evacuation-matrix-btn"
            onClick={onOpenEvacuationModal}
            className="w-full py-2.5 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs uppercase tracking-wider shadow-sm transition-all flex items-center justify-center space-x-2 cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Open Evacuation Routing &amp; SDRF Mobilization Protocols</span>
          </button>
        </div>
      </div>
    </div>
  );
};

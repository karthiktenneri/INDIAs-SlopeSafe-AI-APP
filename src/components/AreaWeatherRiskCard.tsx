import React from 'react';
import { 
  Thermometer, 
  CloudRain, 
  Droplets, 
  AlertTriangle, 
  Mountain, 
  Activity, 
  ShieldCheck, 
  BellRing,
  HelpCircle,
  Clock,
  Compass,
  CheckCircle,
  PhoneCall
} from 'lucide-react';
import { CorridorData } from '../types';
import { 
  getAreaTemperature, 
  getAreaWeather, 
  getSimpleSoilDescription, 
  getSimpleEnglishAdvice 
} from '../utils/proximityAlerts';

interface AreaWeatherRiskCardProps {
  corridor: CorridorData;
  onOpenAlertPopup: () => void;
  isDarkMode?: boolean;
}

export const AreaWeatherRiskCard: React.FC<AreaWeatherRiskCardProps> = ({
  corridor,
  onOpenAlertPopup,
  isDarkMode = false
}) => {
  const temp = getAreaTemperature(corridor);
  const weather = getAreaWeather(corridor);
  const soil = getSimpleSoilDescription(corridor.moistureSaturation);
  const advice = getSimpleEnglishAdvice(corridor);

  const isCritical = corridor.riskPercent >= 80;
  const isWarning = corridor.riskPercent >= 65 && corridor.riskPercent < 80;

  return (
    <div 
      id="area-weather-soil-risk-card"
      className={`rounded-xl border shadow-md p-4 sm:p-5 my-4 transition-all ${
        isCritical
          ? isDarkMode 
            ? 'bg-slate-900 border-red-500/80 text-white' 
            : 'bg-white border-red-400 text-slate-900'
          : isDarkMode 
            ? 'bg-slate-900 border-slate-800 text-white' 
            : 'bg-white border-slate-200 text-slate-900'
      }`}
    >
      {/* Top Header: Area Name & Simple English Danger Banner */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500">
              Live Area Danger &amp; Weather Report
            </span>
            <span className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded ${
              isCritical
                ? 'bg-red-100 text-red-800 border border-red-300'
                : isWarning
                ? 'bg-amber-100 text-amber-800 border border-amber-300'
                : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
            }`}>
              {isCritical ? '🔴 HIGH CHANCES OF SLIDING' : isWarning ? '🟡 CAUTION ADVISED' : '🟢 STABLE CONDITIONS'}
            </span>
          </div>
          <h3 className="text-base sm:text-lg font-black font-display tracking-tight mt-0.5">
            {corridor.name} ({corridor.district}, {corridor.state})
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Altitude: {corridor.elevationM} meters above sea level • Mountain Range: {corridor.mountainRange}
          </p>
        </div>

        {/* Rapid Warning Trigger Button */}
        <button
          onClick={onOpenAlertPopup}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-xs cursor-pointer transition-all animate-pulse"
        >
          <BellRing className="w-4 h-4" />
          <span>Pop Urgent Safety Warning</span>
        </button>
      </div>

      {/* Primary 4 Metric Cards in Plain Everyday English */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 py-4">
        {/* 1. Chances of Landslide */}
        <div className={`p-3.5 rounded-xl border flex flex-col justify-between ${
          isCritical 
            ? 'bg-red-50 dark:bg-red-950/40 border-red-300 dark:border-red-900/60' 
            : isDarkMode 
            ? 'bg-slate-950 border-slate-800' 
            : 'bg-slate-50 border-slate-200'
        }`}>
          <div>
            <div className="flex items-center justify-between text-xs text-slate-500 font-mono">
              <span>Chances of Landslide</span>
              <AlertTriangle className={`w-4 h-4 ${isCritical ? 'text-red-600' : 'text-amber-500'}`} />
            </div>
            <div className="flex items-baseline gap-2 mt-1">
              <span className={`text-2xl sm:text-3xl font-black font-display ${
                isCritical ? 'text-red-600' : 'text-amber-600'
              }`}>
                {corridor.riskPercent}%
              </span>
              <span className="text-xs font-bold text-red-600 uppercase">
                {isCritical ? 'Extremely High' : 'Elevated'}
              </span>
            </div>
          </div>
          <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-2 font-sans leading-snug">
            {isCritical 
              ? 'Mud and rocks have a very high chance of collapsing down the hill right now.' 
              : 'Slopes are under tension from rainfall.'}
          </p>
        </div>

        {/* 2. Temperature */}
        <div className={`p-3.5 rounded-xl border flex flex-col justify-between ${
          isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
        }`}>
          <div>
            <div className="flex items-center justify-between text-xs text-slate-500 font-mono">
              <span>Air Temperature</span>
              <Thermometer className="w-4 h-4 text-orange-500" />
            </div>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl sm:text-3xl font-black font-display text-orange-600">
                {temp}°C
              </span>
              <span className="text-xs text-slate-500">
                {temp < 15 ? 'Cold Hill Air' : 'Pleasant Mountain'}
              </span>
            </div>
          </div>
          <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-2 font-sans leading-snug">
            Current mountain ambient air temperature at {corridor.elevationM}m elevation.
          </p>
        </div>

        {/* 3. Weather & Rain */}
        <div className={`p-3.5 rounded-xl border flex flex-col justify-between ${
          isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
        }`}>
          <div>
            <div className="flex items-center justify-between text-xs text-slate-500 font-mono">
              <span>Live Weather &amp; Rain</span>
              <CloudRain className="w-4 h-4 text-blue-500" />
            </div>
            <div className="mt-1">
              <span className="text-sm sm:text-base font-extrabold text-blue-600 block leading-tight">
                {weather.weather}
              </span>
              <span className="text-xs font-mono text-slate-500">
                {corridor.rainfall24h} mm in past 24h
              </span>
            </div>
          </div>
          <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-2 font-sans leading-snug">
            Danger rain limit is {corridor.rainfallThreshold} mm. {corridor.rainfall24h > corridor.rainfallThreshold ? 'Danger limit has been crossed!' : 'Nearing limit.'}
          </p>
        </div>

        {/* 4. Soil Moisture / Wetness */}
        <div className={`p-3.5 rounded-xl border flex flex-col justify-between ${
          isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
        }`}>
          <div>
            <div className="flex items-center justify-between text-xs text-slate-500 font-mono">
              <span>Soil Moisture (Wetness)</span>
              <Droplets className="w-4 h-4 text-cyan-600" />
            </div>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl sm:text-3xl font-black font-display text-cyan-700">
                {corridor.moistureSaturation}%
              </span>
              <span className="text-xs font-bold text-red-500">
                {corridor.moistureSaturation >= 85 ? 'Completely Soaked' : 'Heavy Mud'}
              </span>
            </div>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden mt-2">
            <div 
              className={`h-full rounded-full ${
                corridor.moistureSaturation >= 85 ? 'bg-red-500' : 'bg-cyan-600'
              }`} 
              style={{ width: `${corridor.moistureSaturation}%` }}
            />
          </div>
        </div>
      </div>

      {/* Simple English Explanation Bar: What does this mean for normal people */}
      <div className={`p-4 rounded-xl border space-y-2 ${
        isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-amber-50/70 border-amber-200'
      }`}>
        <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300 font-bold text-xs uppercase font-mono">
          <HelpCircle className="w-4 h-4 text-amber-600" />
          <span>In Simple English — What does this mean for you right now?</span>
        </div>
        <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-sans">
          <strong>The mountain earth is 94% soaked with rain water.</strong> When ground becomes this wet, it turns into heavy, slippery mud that cannot hold itself up against the steep <strong>{corridor.slopeAngle}</strong> slope. 
          Right now, ground sensors detect mud moving downwards at <strong>{corridor.displacementCreep}</strong>. 
          {isCritical ? ' If heavy rain continues, a serious landslide can occur in ~4 hours.' : ' Travel with extreme care.'}
        </p>
      </div>

      {/* Plain English Immediate Safety Actions */}
      <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800">
        <div className="text-xs font-bold uppercase font-mono tracking-wider text-slate-500 mb-2.5 flex items-center justify-between">
          <span>What Every Person In This Area Should Do (Safety Checklist):</span>
          <span className="text-cyan-700 font-mono text-[11px]">Helpline: {corridor.emergencyHelpline}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {advice.map((item, idx) => (
            <div 
              key={idx}
              className={`p-2.5 rounded-lg border text-xs font-medium flex items-start gap-2 ${
                isDarkMode ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}
            >
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span className="leading-snug">{item}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

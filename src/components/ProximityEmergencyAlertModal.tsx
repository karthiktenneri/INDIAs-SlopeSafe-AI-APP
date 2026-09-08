import React, { useEffect, useState } from 'react';
import { 
  AlertTriangle, 
  Volume2, 
  VolumeX, 
  X, 
  MapPin, 
  Thermometer, 
  CloudRain, 
  Droplets, 
  ShieldAlert, 
  PhoneCall, 
  ArrowRight,
  Radio,
  CheckCircle,
  Footprints
} from 'lucide-react';
import { CorridorData } from '../types';
import { 
  playEmergencyAlertSiren, 
  getAreaTemperature, 
  getAreaWeather, 
  getSimpleSoilDescription, 
  getSimpleEnglishAdvice 
} from '../utils/proximityAlerts';

interface ProximityEmergencyAlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  corridor: CorridorData;
  distanceKm: number;
  onOpenEvacuation: () => void;
  isDarkMode?: boolean;
}

export const ProximityEmergencyAlertModal: React.FC<ProximityEmergencyAlertModalProps> = ({
  isOpen,
  onClose,
  corridor,
  distanceKm,
  onOpenEvacuation,
  isDarkMode = false
}) => {
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    if (isOpen && !isMuted) {
      // Play emergency siren on trigger
      playEmergencyAlertSiren();
    }
  }, [isOpen, isMuted]);

  if (!isOpen) return null;

  const temp = getAreaTemperature(corridor);
  const weather = getAreaWeather(corridor);
  const soilInfo = getSimpleSoilDescription(corridor.moistureSaturation);
  const adviceList = getSimpleEnglishAdvice(corridor);

  return (
    <div 
      id="rapid-danger-proximity-popup"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn font-sans"
    >
      <div 
        className={`w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden border-2 transition-all my-6 ${
          isDarkMode 
            ? 'bg-slate-900 border-red-500/80 text-white shadow-red-950/80' 
            : 'bg-white border-red-500 text-slate-900 shadow-2xl'
        }`}
      >
        {/* Flashing Urgent Header Banner */}
        <div className="bg-red-600 text-white p-4 sm:p-5 flex items-center justify-between relative overflow-hidden">
          <div className="absolute inset-0 bg-red-700 animate-pulse opacity-40 pointer-events-none" />
          
          <div className="flex items-center space-x-3 relative z-10">
            <div className="w-10 h-10 rounded-full bg-white text-red-600 flex items-center justify-center shrink-0 shadow-md animate-bounce">
              <AlertTriangle className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-red-800 text-red-100 text-[10px] font-mono font-black uppercase px-2 py-0.5 rounded tracking-widest">
                  URGENT SAFETY ALERT
                </span>
                <span className="text-xs text-red-100 font-mono">
                  PROXIMITY WARNING
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-black uppercase tracking-tight font-display">
                You Are Near a Landslide Danger Zone!
              </h2>
            </div>
          </div>

          <div className="flex items-center space-x-2 relative z-10">
            <button
              onClick={() => {
                if (isMuted) {
                  playEmergencyAlertSiren();
                }
                setIsMuted(!isMuted);
              }}
              title={isMuted ? 'Unmute Siren Alarm' : 'Mute Siren Alarm'}
              className="p-2 rounded-lg bg-red-700 hover:bg-red-800 text-white transition-colors cursor-pointer"
            >
              {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5 animate-pulse" />}
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-red-700 hover:bg-red-800 text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Plain English Danger Summary Box */}
          <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-red-600 shrink-0" />
                <span className="font-bold text-sm text-red-950 dark:text-red-200">
                  {corridor.name}
                </span>
              </div>
              <span className="text-xs font-mono font-bold bg-red-600 text-white px-2.5 py-1 rounded-full shadow-xs">
                {distanceKm <= 0.1 ? 'DIRECTLY AT SITE' : `Approx. ${distanceKm} km away from danger`}
              </span>
            </div>

            <div className="text-sm font-semibold text-red-900 dark:text-red-300">
              ⚠️ In this area, the chances of a mountain landslide are <span className="text-base font-extrabold text-red-600 underline decoration-2 underline-offset-2">{corridor.riskPercent}% (EXTREMELY HIGH)</span>!
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              Because of heavy rainfall and loose earth on this steep mountain slope, mud, rocks, and trees can slide down across roads and houses at any moment.
            </p>
          </div>

          {/* Area Weather, Temperature, and Soil Moisture Cards in Simple English */}
          <div>
            <div className="text-xs font-bold uppercase font-mono tracking-wider text-slate-500 mb-2">
              Current Conditions In This Area (What is happening right now):
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Temperature */}
              <div className={`p-3 rounded-xl border flex items-center space-x-3 ${
                isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}>
                <div className="w-10 h-10 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
                  <Thermometer className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 block font-mono">Air Temperature</span>
                  <div className="text-lg font-black font-display text-orange-600">{temp}°C</div>
                  <span className="text-[10px] text-slate-500">
                    {temp < 15 ? 'Chilly Mountain Air' : temp < 23 ? 'Cool & Damp' : 'Warm & Humid'}
                  </span>
                </div>
              </div>

              {/* Weather & Rain */}
              <div className={`p-3 rounded-xl border flex items-center space-x-3 ${
                isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}>
                <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                  <CloudRain className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 block font-mono">Current Weather</span>
                  <div className="text-xs font-bold text-blue-600 leading-tight">{weather.weather}</div>
                  <span className="text-[10px] text-slate-500 font-mono">
                    {corridor.rainfall24h} mm rain today
                  </span>
                </div>
              </div>

              {/* Soil Moisture */}
              <div className={`p-3 rounded-xl border flex items-center space-x-3 ${
                isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}>
                <div className="w-10 h-10 rounded-lg bg-cyan-100 text-cyan-600 flex items-center justify-center shrink-0">
                  <Droplets className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 block font-mono">Soil Wetness</span>
                  <div className="text-lg font-black font-display text-cyan-700">
                    {corridor.moistureSaturation}% Wet
                  </div>
                  <span className="text-[10px] text-red-500 font-semibold">
                    {corridor.moistureSaturation >= 85 ? 'Completely Soaked' : 'Very Heavy Mud'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Simple Explanation of Ground / Soil */}
          <div className={`p-3.5 rounded-xl border text-xs space-y-1 ${
            isDarkMode ? 'bg-slate-950 border-slate-800 text-slate-300' : 'bg-amber-50/70 border-amber-200 text-amber-950'
          }`}>
            <span className="font-bold font-mono text-[11px] uppercase tracking-wider text-amber-700 block">
              💧 What Does the Soil Wetness Mean?
            </span>
            <p className="leading-relaxed">
              {soilInfo.simpleExplanation}
            </p>
          </div>

          {/* Plain English "What You Should Do Now" */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase font-mono tracking-wider text-slate-500 flex items-center gap-1.5">
              <Footprints className="w-4 h-4 text-emerald-600" />
              What You Must Do Immediately (Safe Actions):
            </h3>

            <div className="space-y-2">
              {adviceList.map((advice, idx) => (
                <div 
                  key={idx}
                  className={`p-3 rounded-lg border flex items-start space-x-2.5 text-xs font-medium ${
                    isDarkMode ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{advice}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Nearest Shelter Box */}
          <div className="p-3.5 rounded-xl bg-cyan-50 dark:bg-cyan-950/40 border border-cyan-200 dark:border-cyan-900/60 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div>
              <span className="text-[10px] font-mono uppercase font-bold text-cyan-800 dark:text-cyan-300 block">
                Official Evacuation Path & Safe Shelter
              </span>
              <span className="font-bold text-slate-900 dark:text-white">
                {corridor.evacuationRoute}
              </span>
            </div>

            <button
              onClick={() => {
                onClose();
                onOpenEvacuation();
              }}
              className="px-3.5 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <span>View Shelter Map</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Footer Actions */}
        <div className={`p-4 border-t flex flex-wrap items-center justify-between gap-3 ${
          isDarkMode ? 'border-slate-800 bg-slate-950' : 'border-slate-200 bg-slate-50'
        }`}>
          <a
            href="tel:112"
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-xs cursor-pointer transition-colors"
          >
            <PhoneCall className="w-4 h-4" />
            <span>Call 112 (Disaster Police)</span>
          </a>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className={`px-4 py-2 rounded-lg font-bold text-xs transition-colors cursor-pointer ${
                isDarkMode 
                  ? 'bg-slate-800 hover:bg-slate-700 text-slate-200' 
                  : 'bg-slate-200 hover:bg-slate-300 text-slate-800'
              }`}
            >
              I Understand / Close Message
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

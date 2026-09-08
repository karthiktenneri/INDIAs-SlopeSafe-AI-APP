import React, { useState } from 'react';
import { 
  Bell, 
  BellRing, 
  MapPin, 
  LocateFixed, 
  AlertTriangle, 
  Volume2, 
  VolumeX, 
  Check, 
  Thermometer, 
  CloudRain, 
  Droplets,
  ShieldCheck,
  ChevronRight,
  Info
} from 'lucide-react';
import { CorridorData } from '../types';
import { 
  findNearestSlopeHazard, 
  playEmergencyAlertSiren, 
  requestBrowserNotificationPermission, 
  sendBrowserPushNotification,
  getAreaTemperature,
  getAreaWeather
} from '../utils/proximityAlerts';

interface ProximityLiveBannerProps {
  corridors: CorridorData[];
  onTriggerAlert: (corridor: CorridorData, distanceKm: number) => void;
  onSelectCorridor: (corridor: CorridorData) => void;
  isDarkMode?: boolean;
}

export const ProximityLiveBanner: React.FC<ProximityLiveBannerProps> = ({
  corridors,
  onTriggerAlert,
  onSelectCorridor,
  isDarkMode = false
}) => {
  const [notificationStatus, setNotificationStatus] = useState<string>(
    typeof window !== 'undefined' && 'Notification' in window ? Notification.permission : 'default'
  );
  const [currentLocationName, setCurrentLocationName] = useState<string>('Meppadi, Wayanad (Near Landslide Range)');
  const [currentCoords, setCurrentCoords] = useState<{ lat: number; lon: number }>({
    lat: 11.5365,
    lon: 76.1332 // Near Wayanad
  });
  const [isDetectingGps, setIsDetectingGps] = useState<boolean>(false);
  const [bannerCollapsed, setBannerCollapsed] = useState<boolean>(false);

  // Calculate nearest slope hazard
  const nearest = findNearestSlopeHazard(currentCoords.lat, currentCoords.lon, corridors);
  const temp = getAreaTemperature(nearest.corridor);
  const weather = getAreaWeather(nearest.corridor);

  const handleEnableNotifications = async () => {
    const perm = await requestBrowserNotificationPermission();
    setNotificationStatus(perm);
    if (perm === 'granted') {
      sendBrowserPushNotification(
        '⚠️ SlopeSafe-AI: Proximity Alert Activated',
        `You are monitoring high-risk landslide zones. We will alert you if you enter danger range.`
      );
    }
  };

  const handleUseRealGps = () => {
    setIsDetectingGps(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lon = pos.coords.longitude;
          setCurrentCoords({ lat, lon });
          setCurrentLocationName('My Live Device GPS Location');
          setIsDetectingGps(false);

          // Check if near hazard
          const res = findNearestSlopeHazard(lat, lon, corridors);
          onSelectCorridor(res.corridor);
          if (res.isWithinDangerRange && res.isHighRisk) {
            onTriggerAlert(res.corridor, res.distanceKm);
            sendBrowserPushNotification(
              `🚨 HIGH DANGER: Landslide Alert near ${res.corridor.shortName}`,
              `You are ${res.distanceKm} km from an active landslide slope! Slide chance is ${res.corridor.riskPercent}%. Move to safety!`
            );
          }
        },
        () => {
          setIsDetectingGps(false);
          // Fallback simulation near Wayanad
          handleSimulatePreset(11.5365, 76.1332, 'Meppadi, Wayanad (Near Active Mudflow Range)');
        }
      );
    } else {
      setIsDetectingGps(false);
      handleSimulatePreset(11.5365, 76.1332, 'Meppadi, Wayanad (Near Active Mudflow Range)');
    }
  };

  const handleSimulatePreset = (lat: number, lon: number, name: string) => {
    setCurrentCoords({ lat, lon });
    setCurrentLocationName(name);
    const res = findNearestSlopeHazard(lat, lon, corridors);
    onSelectCorridor(res.corridor);

    if (res.isWithinDangerRange && res.isHighRisk) {
      onTriggerAlert(res.corridor, res.distanceKm);
      sendBrowserPushNotification(
        `🚨 HIGH DANGER: Landslide Alert near ${res.corridor.shortName}`,
        `You are ${res.distanceKm} km from an active landslide slope! Slide chance is ${res.corridor.riskPercent}%. Move to safety!`
      );
    }
  };

  return (
    <div 
      id="live-proximity-geofence-banner"
      className={`rounded-xl border shadow-md my-4 p-4 sm:p-5 transition-all ${
        nearest.isWithinDangerRange && nearest.isHighRisk
          ? isDarkMode 
            ? 'bg-red-950/40 border-red-500/80 text-white' 
            : 'bg-red-50/90 border-red-300 text-slate-900'
          : isDarkMode 
            ? 'bg-slate-900/90 border-slate-800 text-white' 
            : 'bg-white border-slate-200 text-slate-900'
      }`}
    >
      {/* Top Row: Live Location Status & Notification Toggle */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center space-x-2.5">
          <div className={`w-3 h-3 rounded-full ${
            nearest.isWithinDangerRange && nearest.isHighRisk 
              ? 'bg-red-600 animate-ping' 
              : 'bg-emerald-500'
          }`} />
          
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Live Proximity Guard &amp; Geofence Scanner
              </span>
              <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                nearest.isWithinDangerRange && nearest.isHighRisk
                  ? 'bg-red-600 text-white animate-pulse'
                  : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
              }`}>
                {nearest.isWithinDangerRange && nearest.isHighRisk ? '⚠️ INSIDE DANGER RANGE (<15 KM)' : '✅ SAFE RANGE (>15 KM)'}
              </span>
            </div>
            <div className="text-sm font-bold flex items-center gap-1.5 mt-0.5">
              <MapPin className="w-4 h-4 text-cyan-600 shrink-0" />
              <span>Current Spot: <strong>{currentLocationName}</strong></span>
              <span className="text-xs font-mono text-slate-400">
                ({currentCoords.lat.toFixed(4)}° N, {currentCoords.lon.toFixed(4)}° E)
              </span>
            </div>
          </div>
        </div>

        {/* Buttons: Enable Push Notifications & GPS Detect */}
        <div className="flex flex-wrap items-center gap-2">
          {notificationStatus !== 'granted' ? (
            <button
              onClick={handleEnableNotifications}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-xs cursor-pointer transition-all animate-bounce"
            >
              <BellRing className="w-3.5 h-3.5" />
              <span>Allow Phone / Browser Alerts</span>
            </button>
          ) : (
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-bold">
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span>Push Alerts Active</span>
            </div>
          )}

          <button
            onClick={handleUseRealGps}
            disabled={isDetectingGps}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-xs cursor-pointer shadow-xs transition-all"
          >
            <LocateFixed className="w-3.5 h-3.5" />
            <span>{isDetectingGps ? 'Locating...' : 'Use My Real GPS'}</span>
          </button>
        </div>
      </div>

      {/* Main Proximity Report Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 pt-3">
        {/* Distance & Risk Statement */}
        <div className="lg:col-span-8 space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="text-xs text-slate-600 dark:text-slate-300">
              Nearest slope sliding area: <strong className="text-slate-900 dark:text-white">{nearest.corridor.name}</strong>
            </div>
            <div className="font-mono text-xs font-bold">
              Distance to hill: <span className="text-cyan-700 dark:text-cyan-400 font-extrabold">{nearest.distanceKm} km</span>
            </div>
          </div>

          {/* Simple English Verdict Bar */}
          <div className={`p-3 rounded-xl border flex flex-wrap items-center justify-between gap-3 ${
            nearest.isWithinDangerRange && nearest.isHighRisk
              ? 'bg-red-100 dark:bg-red-950/60 border-red-300 dark:border-red-900 text-red-950 dark:text-red-100'
              : 'bg-slate-100 dark:bg-slate-950 border-slate-200 dark:border-slate-800'
          }`}>
            <div className="space-y-0.5">
              <div className="text-sm font-extrabold flex items-center gap-1.5">
                {nearest.isWithinDangerRange && nearest.isHighRisk ? (
                  <>
                    <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
                    <span className="text-red-600 font-display">CHANCES OF LANDSLIDE IN THIS AREA ARE HIGH ({nearest.corridor.riskPercent}%)</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="text-emerald-700 font-display">You are outside immediate landslide danger range</span>
                  </>
                )}
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-300">
                {nearest.isWithinDangerRange && nearest.isHighRisk
                  ? `You are only ${nearest.distanceKm} km away. Earth and rocks are sliding down due to ${nearest.corridor.rainfall24h} mm rain!`
                  : `Nearest slide area (${nearest.corridor.shortName}) is ${nearest.distanceKm} km away. Stay cautious if traveling toward hills.`}
              </p>
            </div>

            {nearest.isWithinDangerRange && nearest.isHighRisk && (
              <button
                onClick={() => onTriggerAlert(nearest.corridor, nearest.distanceKm)}
                className="px-3.5 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center gap-1 cursor-pointer shadow-sm animate-pulse"
              >
                <span>View Urgent Safety Steps</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Live Area Weather & Soil Conditions */}
          <div className="grid grid-cols-3 gap-2 text-xs font-mono pt-1">
            <div className={`p-2 rounded-lg border ${isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
              <span className="text-[10px] text-slate-500 block flex items-center gap-1">
                <Thermometer className="w-3 h-3 text-orange-500" /> Temp
              </span>
              <span className="font-bold text-sm text-orange-600">{temp}°C</span>
              <span className="text-[10px] text-slate-400 block truncate">Air Temp</span>
            </div>

            <div className={`p-2 rounded-lg border ${isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
              <span className="text-[10px] text-slate-500 block flex items-center gap-1">
                <CloudRain className="w-3 h-3 text-blue-500" /> Weather
              </span>
              <span className="font-bold text-xs text-blue-600 block truncate">{weather.weather}</span>
              <span className="text-[10px] text-slate-400 block">{nearest.corridor.rainfall24h} mm rain</span>
            </div>

            <div className={`p-2 rounded-lg border ${isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
              <span className="text-[10px] text-slate-500 block flex items-center gap-1">
                <Droplets className="w-3 h-3 text-cyan-600" /> Soil Wetness
              </span>
              <span className="font-bold text-sm text-cyan-700">{nearest.corridor.moistureSaturation}%</span>
              <span className="text-[10px] text-red-500 block truncate">
                {nearest.corridor.moistureSaturation >= 85 ? 'Completely Soaked' : 'Very Wet'}
              </span>
            </div>
          </div>
        </div>

        {/* Quick Simulation Buttons to test Proximity Alerts rapidly */}
        <div className={`lg:col-span-4 p-3 rounded-xl border space-y-2 text-xs ${
          isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
        }`}>
          <div className="flex items-center justify-between">
            <span className="font-bold font-mono text-[11px] uppercase tracking-wider text-slate-500">
              ⚡ Test Proximity Alert
            </span>
            <span className="text-[10px] text-slate-400">Click to test popup:</span>
          </div>

          <div className="space-y-1.5">
            <button
              onClick={() => handleSimulatePreset(11.5365, 76.1332, 'Meppadi, Wayanad (Near Chooralmala Slide)')}
              className="w-full text-left px-2.5 py-1.5 rounded-lg bg-red-100 hover:bg-red-200 dark:bg-red-950/80 dark:hover:bg-red-900 border border-red-300 dark:border-red-800 text-red-900 dark:text-red-200 font-semibold cursor-pointer transition-colors flex items-center justify-between"
            >
              <span>🚨 Simulate: 2.4 km from Wayanad</span>
              <span className="text-[10px] bg-red-600 text-white px-1.5 py-0.5 rounded font-bold">94% Risk</span>
            </button>

            <button
              onClick={() => handleSimulatePreset(30.5564, 79.5658, 'Joshimath Ravigram (Near NH-07 Active Sinking)')}
              className="w-full text-left px-2.5 py-1.5 rounded-lg bg-amber-100 hover:bg-amber-200 dark:bg-amber-950/80 dark:hover:bg-amber-900 border border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200 font-semibold cursor-pointer transition-colors flex items-center justify-between"
            >
              <span>⚠️ Simulate: 3.8 km from Joshimath</span>
              <span className="text-[10px] bg-amber-600 text-white px-1.5 py-0.5 rounded font-bold">85% Risk</span>
            </button>

            <button
              onClick={() => handleSimulatePreset(27.3389, 88.6065, 'Gangtok Mile 18 (Near Teesta River Scarp)')}
              className="w-full text-left px-2.5 py-1.5 rounded-lg bg-cyan-100 hover:bg-cyan-200 dark:bg-cyan-950/80 dark:hover:bg-cyan-900 border border-cyan-300 dark:border-cyan-800 text-cyan-900 dark:text-cyan-200 font-semibold cursor-pointer transition-colors flex items-center justify-between"
            >
              <span>⛰️ Simulate: 4.1 km from Gangtok NH-10</span>
              <span className="text-[10px] bg-cyan-700 text-white px-1.5 py-0.5 rounded font-bold">89% Risk</span>
            </button>

            <button
              onClick={() => handleSimulatePreset(28.6139, 77.2090, 'New Delhi (Plains / Safe Ground)')}
              className="w-full text-left px-2.5 py-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 font-semibold cursor-pointer transition-colors flex items-center justify-between"
            >
              <span>✅ Simulate: Safe Plains (Delhi)</span>
              <span className="text-[10px] text-slate-500 font-bold">420 km away</span>
            </button>
          </div>

          <div className="pt-1 flex items-center justify-between text-[10px] text-slate-400">
            <span>Sound Alarm: Active</span>
            <button
              onClick={playEmergencyAlertSiren}
              className="text-cyan-700 dark:text-cyan-400 font-bold hover:underline cursor-pointer"
            >
              Test Siren Sound
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

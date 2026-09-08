// User Area Detection & All-India Search Component
import React, { useState, useEffect, useRef } from 'react';
import {
  MapPin,
  Search,
  AlertTriangle,
  ShieldCheck,
  Thermometer,
  CloudRain,
  Droplets,
  Bell,
  X,
  Navigation,
  RefreshCw,
  Home
} from 'lucide-react';
import { CorridorData } from '../types';
import {
  searchIndiaArea,
  resolveGpsLocation,
  AreaRiskResult,
  getAreaSuggestions,
  AreaSuggestion
} from '../utils/indiaAreasDatabase';
import {
  sendBrowserPushNotification,
  playEmergencyAlertSiren
} from '../utils/proximityAlerts';

interface UserAreaAndSearchCardProps {
  corridors: CorridorData[];
  onOpenShelterModal: () => void;
  onOpenSosModal: () => void;
  onTriggerSosAlert: (corridor: CorridorData, distanceKm: number) => void;
  isDarkMode: boolean;
}

export function UserAreaAndSearchCard({
  corridors,
  onOpenShelterModal,
  onOpenSosModal,
  onTriggerSosAlert,
  isDarkMode
}: UserAreaAndSearchCardProps) {
  // 1. User Location State
  const [locationStatus, setLocationStatus] = useState<'idle' | 'prompt' | 'requesting' | 'granted' | 'denied'>('prompt');
  const [userLocationResult, setUserLocationResult] = useState<AreaRiskResult | null>(null);
  const [userCoords, setUserCoords] = useState<{ lat: number; lon: number } | null>(null);
  const [locationErrorMessage, setLocationErrorMessage] = useState<string | null>(null);

  // 2. Search State - NOTE: No sample example is taken before user gives input!
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchedResult, setSearchedResult] = useState<AreaRiskResult | null>(null);
  const [hasUserSearched, setHasUserSearched] = useState<boolean>(false);
  const [isSuggestionsOpen, setIsSuggestionsOpen] = useState<boolean>(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Close suggestions if clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setIsSuggestionsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Check initial location permission on mount
  useEffect(() => {
    if (typeof navigator !== 'undefined' && 'permissions' in navigator) {
      navigator.permissions.query({ name: 'geolocation' as PermissionName }).then((status) => {
        if (status.state === 'granted') {
          handleRequestLocation();
        } else if (status.state === 'denied') {
          setLocationStatus('denied');
        } else {
          // 'prompt' -> ask user to turn on location
          setLocationStatus('prompt');
        }
      }).catch(() => {
        setLocationStatus('prompt');
      });
    } else {
      setLocationStatus('prompt');
    }
  }, []);

  // Handler to request device location
  const handleRequestLocation = () => {
    setLocationStatus('requesting');
    setLocationErrorMessage(null);

    if (!navigator.geolocation) {
      setLocationStatus('denied');
      setLocationErrorMessage('Geolocation is not supported by your browser.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        setUserCoords({ lat, lon });
        setLocationStatus('granted');

        // Resolve risk for user location
        const resolved = resolveGpsLocation(lat, lon, corridors);
        setUserLocationResult(resolved.riskResult);

        // If user is in a landslide prone area, send SOS notification & alert
        if (resolved.isLandslideProne) {
          sendBrowserPushNotification(
            `🚨 SOS LANDSLIDE ALERT: You are near ${resolved.nearestCorridor.shortName}!`,
            `Warning: Landslide risk in your area is ${resolved.nearestCorridor.riskPercent}%. Move to nearest shelter immediately!`
          );
          try {
            playEmergencyAlertSiren();
          } catch {
            // Audio context might require gesture
          }
          onTriggerSosAlert(resolved.nearestCorridor, resolved.distanceToNearestHazardKm);
        }
      },
      (err) => {
        setLocationStatus('denied');
        if (err.code === 1) {
          setLocationErrorMessage('Location permission was denied. Please turn on location in browser settings or search any area below.');
        } else {
          setLocationErrorMessage('Could not retrieve GPS location. Please turn on device location or search below.');
        }
      },
      { timeout: 12000, enableHighAccuracy: true }
    );
  };

  // Simulate Location (Convenient for testing in environments without GPS)
  const handleSimulateLocation = (isHazard: boolean) => {
    setLocationStatus('granted');
    setLocationErrorMessage(null);

    if (isHazard) {
      // Simulate near Wayanad (11.52° N, 76.15° E)
      const lat = 11.52;
      const lon = 76.15;
      setUserCoords({ lat, lon });
      const resolved = resolveGpsLocation(lat, lon, corridors);
      setUserLocationResult(resolved.riskResult);

      sendBrowserPushNotification(
        `🚨 SOS LANDSLIDE ALERT: You are in a high landslide risk area!`,
        `Wayanad slope sliding threat: Risk is ${resolved.nearestCorridor.riskPercent}%. Please evacuate to nearest safe shelter now!`
      );
      try {
        playEmergencyAlertSiren();
      } catch {
        // audio context
      }
      onTriggerSosAlert(resolved.nearestCorridor, resolved.distanceToNearestHazardKm);
    } else {
      // Simulate New Delhi (28.61° N, 77.20° E) - Safe Plains
      const lat = 28.61;
      const lon = 77.2;
      setUserCoords({ lat, lon });
      const resolved = resolveGpsLocation(lat, lon, corridors);
      setUserLocationResult(resolved.riskResult);
    }
  };

  // Handler for All-India Area Search
  const handlePerformSearch = (e?: React.FormEvent, customQuery?: string) => {
    if (e) e.preventDefault();
    const q = customQuery !== undefined ? customQuery : searchQuery;
    if (!q.trim()) return;

    setIsSuggestionsOpen(false);
    const result = searchIndiaArea(q, corridors);
    setSearchedResult(result);
    setHasUserSearched(true);
  };

  const handleSelectSuggestion = (suggestion: AreaSuggestion) => {
    setSearchQuery(suggestion.name);
    setIsSuggestionsOpen(false);
    handlePerformSearch(undefined, suggestion.name);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setSearchedResult(null);
    setHasUserSearched(false);
    setIsSuggestionsOpen(false);
  };

  const filteredSuggestions = getAreaSuggestions(searchQuery, 8);

  return (
    <div id="user-location-search-card" className="space-y-4">
      {/* 1. USER LOCATION BAR / PROMPT */}
      <div className={`p-4 rounded-xl border shadow-sm transition-all ${
        isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center space-x-2.5">
            <div className={`p-2 rounded-lg ${
              userLocationResult?.isLandslideProne
                ? 'bg-red-500/10 text-red-600'
                : 'bg-cyan-500/10 text-cyan-600'
            }`}>
              <MapPin className="w-5 h-5 animate-bounce" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-extrabold font-sans text-slate-900 dark:text-white flex items-center gap-2">
                <span>Your Current Area</span>
                {userLocationResult && (
                  <span className={`text-[11px] font-mono px-2 py-0.5 rounded-full font-bold uppercase ${
                    userLocationResult.isLandslideProne
                      ? 'bg-red-100 text-red-700 border border-red-300 dark:bg-red-950/80 dark:text-red-300 dark:border-red-800'
                      : 'bg-emerald-100 text-emerald-700 border border-emerald-300 dark:bg-emerald-950/80 dark:text-emerald-300 dark:border-emerald-800'
                  }`}>
                    {userLocationResult.isLandslideProne ? '⚠️ LANDSLIDE AREA' : '✅ SAFE PLAIN'}
                  </span>
                )}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Automatic GPS Detection &amp; Proximity Danger Checker
              </p>
            </div>
          </div>

          {/* Location Action Buttons */}
          <div className="flex items-center flex-wrap gap-2">
            {locationStatus !== 'granted' ? (
              <button
                id="btn-turn-on-location"
                onClick={handleRequestLocation}
                disabled={locationStatus === 'requesting'}
                className="flex items-center space-x-1.5 px-3.5 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-xs shadow-sm cursor-pointer transition-all disabled:opacity-50"
              >
                <Navigation className={`w-3.5 h-3.5 ${locationStatus === 'requesting' ? 'animate-spin' : ''}`} />
                <span>{locationStatus === 'requesting' ? 'Detecting Location...' : 'Turn On Location'}</span>
              </button>
            ) : (
              <button
                id="btn-refresh-location"
                onClick={handleRequestLocation}
                className="flex items-center space-x-1 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Refresh GPS</span>
              </button>
            )}

            {/* Test Simulation Controls */}
            <button
              id="simulate-hazard-btn"
              onClick={() => handleSimulateLocation(true)}
              className="text-[11px] font-mono px-2 py-1 rounded bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 dark:bg-red-950/50 dark:border-red-800 dark:text-red-300 cursor-pointer"
              title="Test GPS in Wayanad Landslide Slope"
            >
              Test: In Landslide Area
            </button>
            <button
              id="simulate-safe-btn"
              onClick={() => handleSimulateLocation(false)}
              className="text-[11px] font-mono px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 dark:bg-slate-800 dark:text-slate-300 cursor-pointer"
              title="Test GPS in Delhi (Safe Plain)"
            >
              Test: In Safe Plains
            </button>
          </div>
        </div>

        {/* Location Status Body */}
        {locationStatus === 'prompt' && !userLocationResult && (
          <div className="mt-3 p-3.5 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start space-x-2.5">
              <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <div className="text-xs text-amber-900 dark:text-amber-200">
                <span className="font-bold block">Please turn on your location</span>
                <span>Allow device location access so the app can check if there are landslide-prone slopes or mudslide hazards near you.</span>
              </div>
            </div>
            <button
              onClick={handleRequestLocation}
              className="px-3.5 py-1.5 rounded-md bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shrink-0 cursor-pointer shadow-xs"
            >
              Turn On Location
            </button>
          </div>
        )}

        {locationStatus === 'denied' && (
          <div className="mt-3 p-3 rounded-lg bg-slate-100 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300 flex items-center justify-between">
            <span>{locationErrorMessage || 'Location access is off. You can still search any area in India using the search bar below.'}</span>
            <button
              onClick={handleRequestLocation}
              className="ml-2 font-bold text-cyan-600 dark:text-cyan-400 hover:underline shrink-0"
            >
              Try Again
            </button>
          </div>
        )}

        {/* User Location Result Box (One Small Box) */}
        {userLocationResult && (
          <div className="mt-3 space-y-3">
            {/* SOS Notification Banner if in landslide hazard */}
            {userLocationResult.isLandslideProne && (
              <div className="p-3 rounded-lg bg-red-600 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-md animate-pulse">
                <div className="flex items-center space-x-2">
                  <Bell className="w-5 h-5 shrink-0" />
                  <span className="text-xs font-bold leading-tight">
                    🚨 SOS ALERT: You are in an active landslide-prone area ({userLocationResult.distanceToNearestHazardKm} km to slope)! Evacuate to the nearest shelter immediately.
                  </span>
                </div>
                <button
                  id="btn-go-to-shelter-sos"
                  onClick={onOpenShelterModal}
                  className="px-3 py-1.5 rounded bg-white text-red-700 font-extrabold text-xs shrink-0 cursor-pointer hover:bg-red-50 shadow-sm flex items-center gap-1 self-start sm:self-auto"
                >
                  <Home className="w-3.5 h-3.5" />
                  <span>Go To Near Shelter</span>
                </button>
              </div>
            )}

            {/* The One Small Box for User's Area */}
            <div className={`p-3.5 rounded-lg border text-xs font-sans ${
              userLocationResult.isLandslideProne
                ? isDarkMode ? 'bg-red-950/40 border-red-800/60' : 'bg-red-50/80 border-red-200'
                : isDarkMode ? 'bg-emerald-950/40 border-emerald-800/60' : 'bg-emerald-50/80 border-emerald-200'
            }`}>
              <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-black/10 dark:border-white/10">
                <div>
                  <span className="font-extrabold text-sm text-slate-900 dark:text-white block">
                    {userLocationResult.name}
                  </span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">
                    {userLocationResult.stateOrRegion}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-mono uppercase text-slate-400 block">Final Risk of that Area</span>
                  <span className={`text-base font-black font-mono ${
                    userLocationResult.isLandslideProne ? 'text-red-600 dark:text-red-400' : 'text-emerald-600 dark:text-emerald-400'
                  }`}>
                    {userLocationResult.finalRiskPercent}% ({userLocationResult.riskLevelText})
                  </span>
                </div>
              </div>

              {/* Weather, Soil Moisture, Temperature Strip */}
              <div className="grid grid-cols-3 gap-2 py-2.5 text-center">
                <div className={`p-2 rounded border ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                  <span className="text-[10px] text-slate-400 flex items-center justify-center gap-1">
                    <Thermometer className="w-3 h-3 text-orange-500" /> Temp
                  </span>
                  <span className="font-bold text-orange-600 dark:text-orange-400 text-sm">
                    {userLocationResult.temperatureC}°C
                  </span>
                </div>

                <div className={`p-2 rounded border ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                  <span className="text-[10px] text-slate-400 flex items-center justify-center gap-1">
                    <CloudRain className="w-3 h-3 text-blue-500" /> Weather
                  </span>
                  <span className="font-bold text-blue-600 dark:text-blue-400 text-xs truncate block" title={userLocationResult.weather}>
                    {userLocationResult.rainfall24hMm} mm ({userLocationResult.weather.split(' ')[0]})
                  </span>
                </div>

                <div className={`p-2 rounded border ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                  <span className="text-[10px] text-slate-400 flex items-center justify-center gap-1">
                    <Droplets className="w-3 h-3 text-cyan-600" /> Soil Moisture
                  </span>
                  <span className="font-bold text-cyan-600 dark:text-cyan-400 text-sm">
                    {userLocationResult.soilMoisturePercent}%
                  </span>
                </div>
              </div>

              {/* Risk Details & Shelter */}
              <div className="pt-2 border-t border-black/10 dark:border-white/10 space-y-1">
                <div>
                  <strong className="text-slate-800 dark:text-slate-200">Risk Details: </strong>
                  <span className="text-slate-600 dark:text-slate-300">{userLocationResult.riskDescription}</span>
                </div>
                <div>
                  <strong className="text-slate-800 dark:text-slate-200">Soil Condition: </strong>
                  <span className="text-slate-600 dark:text-slate-300">{userLocationResult.soilConditionSimple}</span>
                </div>
                {userLocationResult.isLandslideProne && (
                  <div className="pt-1 flex items-center justify-between gap-2">
                    <span className="text-red-700 dark:text-red-300 font-bold">
                      🏠 Nearest Shelter: {userLocationResult.shelterOrAdvice}
                    </span>
                    <button
                      onClick={onOpenShelterModal}
                      className="px-2.5 py-1 rounded bg-red-600 text-white font-bold text-[11px] hover:bg-red-700 cursor-pointer shrink-0"
                    >
                      Go To Shelter
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 2. SEARCH BAR RIGHT AFTER USER'S AREA */}
      <div 
        ref={searchContainerRef}
        className={`p-4 rounded-xl border shadow-sm ${
          isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        }`}
      >
        <div className="mb-2">
          <label htmlFor="all-india-search-input" className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
            <Search className="w-4 h-4 text-cyan-600" />
            <span>Search Any Area in India</span>
          </label>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Check landslide risk for any city, town, hill station, or district across India with live suggestions.
          </p>
        </div>

        <form onSubmit={handlePerformSearch} className="flex gap-2 relative">
          <div className="relative flex-1">
            <input
              id="all-india-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsSuggestionsOpen(true);
              }}
              onFocus={() => setIsSuggestionsOpen(true)}
              placeholder="Start typing an area (e.g. Wayanad, Munnar, Shimla, Joshimath, Delhi, Mumbai)..."
              className={`w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-lg border outline-none font-sans transition-all ${
                isDarkMode 
                  ? 'bg-slate-950 border-slate-700 text-white focus:border-cyan-500' 
                  : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-cyan-600 focus:bg-white'
              }`}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            {/* LIVE AUTOCOMPLETE SUGGESTIONS POPUP */}
            {isSuggestionsOpen && (
              <div 
                id="area-autocomplete-dropdown"
                className={`absolute left-0 right-0 top-full mt-1.5 z-30 rounded-xl border shadow-xl max-h-72 overflow-y-auto backdrop-blur-md transition-all ${
                  isDarkMode ? 'bg-slate-950/95 border-slate-700 text-slate-100' : 'bg-white/95 border-slate-200 text-slate-900'
                }`}
              >
                <div className="px-3 py-1.5 border-b border-slate-200 dark:border-slate-800 text-[10px] font-mono uppercase tracking-wider text-slate-400 flex items-center justify-between">
                  <span>Matched Indian Locations ({filteredSuggestions.length})</span>
                  <span>Click to check risk</span>
                </div>

                {filteredSuggestions.length > 0 ? (
                  <div className="p-1 space-y-0.5">
                    {filteredSuggestions.map((suggestion) => (
                      <button
                        key={suggestion.name}
                        type="button"
                        onClick={() => handleSelectSuggestion(suggestion)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-xs flex items-center justify-between gap-2 transition-all cursor-pointer ${
                          isDarkMode 
                            ? 'hover:bg-slate-800/90 text-slate-200' 
                            : 'hover:bg-slate-100 text-slate-800'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <MapPin className={`w-3.5 h-3.5 shrink-0 ${
                            suggestion.isLandslideProne ? 'text-red-500' : 'text-emerald-500'
                          }`} />
                          <div>
                            <span className="font-bold block">{suggestion.name}</span>
                            <span className="text-[11px] text-slate-500 dark:text-slate-400">{suggestion.state}</span>
                          </div>
                        </div>

                        <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border shrink-0 ${
                          suggestion.isLandslideProne
                            ? 'bg-red-500/10 text-red-600 border-red-500/30'
                            : 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30'
                        }`}>
                          {suggestion.isLandslideProne ? '⚠️ Hazard Slopes' : '✅ Safe Plains'}
                        </span>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="p-3 text-center text-xs text-slate-500">
                    No matching standard name found. Press <strong>Check Area</strong> to analyze your custom area.
                  </div>
                )}
              </div>
            )}
          </div>

          <button
            id="btn-search-area-submit"
            type="submit"
            className="px-4 sm:px-6 py-2.5 rounded-lg bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-xs sm:text-sm shadow-sm cursor-pointer transition-all flex items-center gap-1.5 shrink-0"
          >
            <Search className="w-4 h-4" />
            <span>Check Area</span>
          </button>
        </form>

        {/* Quick Suggestion Chips below search input to help user find areas fast */}
        <div className="mt-2.5 flex items-center flex-wrap gap-1.5 text-xs">
          <span className="text-[11px] text-slate-400 font-mono">Quick areas:</span>
          {[
            { label: 'Wayanad (Kerala)', query: 'Wayanad' },
            { label: 'Shimla (HP)', query: 'Shimla' },
            { label: 'Joshimath (UK)', query: 'Joshimath' },
            { label: 'Munnar (Kerala)', query: 'Munnar' },
            { label: 'Darjeeling (WB)', query: 'Darjeeling' },
            { label: 'New Delhi (Safe)', query: 'New Delhi' },
            { label: 'Mumbai (Safe)', query: 'Mumbai' },
            { label: 'Bengaluru (Safe)', query: 'Bengaluru' }
          ].map((chip) => (
            <button
              key={chip.label}
              type="button"
              onClick={() => {
                setSearchQuery(chip.query);
                handlePerformSearch(undefined, chip.query);
              }}
              className={`px-2 py-0.5 rounded text-[11px] font-sans border transition-all cursor-pointer ${
                isDarkMode 
                  ? 'bg-slate-950 hover:bg-slate-800 text-slate-300 border-slate-700' 
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
              }`}
            >
              {chip.label}
            </button>
          ))}
        </div>

        {/* 3. THE ONE SMALL BOX FOR SEARCHED AREA (ONLY SHOWN AFTER USER ENTERS AN AREA) */}
        {hasUserSearched && searchedResult && (
          <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800">
            <div className={`p-4 rounded-xl border text-xs font-sans shadow-sm ${
              searchedResult.isLandslideProne
                ? isDarkMode ? 'bg-red-950/40 border-red-800/80' : 'bg-red-50/90 border-red-200'
                : isDarkMode ? 'bg-emerald-950/40 border-emerald-800/80' : 'bg-emerald-50/90 border-emerald-200'
            }`}>
              {/* Header: Area Name & Final Risk Percentage */}
              <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-black/10 dark:border-white/10">
                <div>
                  <span className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white block">
                    {searchedResult.name}
                  </span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">
                    {searchedResult.stateOrRegion}
                  </span>
                </div>

                <div className="text-right">
                  <span className="text-[10px] font-mono uppercase text-slate-500 dark:text-slate-400 block">
                    Final Percentage of Risk
                  </span>
                  <span className={`text-base sm:text-lg font-black font-mono ${
                    searchedResult.isLandslideProne ? 'text-red-600 dark:text-red-400' : 'text-emerald-600 dark:text-emerald-400'
                  }`}>
                    {searchedResult.finalRiskPercent}% ({searchedResult.riskLevelText})
                  </span>
                </div>
              </div>

              {/* NON-LANDSLIDE PRONE AREA SPECIAL DISPLAY */}
              {!searchedResult.isLandslideProne ? (
                <div className="py-3 space-y-2">
                  <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300 font-extrabold text-sm">
                    <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                    <span>This area does NOT come under any landslide-prone zone.</span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                    {searchedResult.riskDescription}
                  </p>

                  {/* Weather, Soil & Temp for plain area */}
                  <div className="grid grid-cols-3 gap-2 pt-2 text-center">
                    <div className={`p-2 rounded border ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                      <span className="text-[10px] text-slate-400 flex items-center justify-center gap-1">
                        <Thermometer className="w-3 h-3 text-orange-500" /> Temperature
                      </span>
                      <span className="font-bold text-orange-600 text-xs sm:text-sm">
                        {searchedResult.temperatureC}°C
                      </span>
                    </div>

                    <div className={`p-2 rounded border ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                      <span className="text-[10px] text-slate-400 flex items-center justify-center gap-1">
                        <CloudRain className="w-3 h-3 text-blue-500" /> Weather
                      </span>
                      <span className="font-bold text-blue-600 text-xs truncate block" title={searchedResult.weather}>
                        {searchedResult.weather}
                      </span>
                    </div>

                    <div className={`p-2 rounded border ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                      <span className="text-[10px] text-slate-400 flex items-center justify-center gap-1">
                        <Droplets className="w-3 h-3 text-cyan-600" /> Soil Moisture
                      </span>
                      <span className="font-bold text-cyan-600 text-xs sm:text-sm">
                        {searchedResult.soilMoisturePercent}% (Firm Ground)
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                /* LANDSLIDE PRONE AREA DETAILS */
                <div className="py-3 space-y-3">
                  {/* Weather, Temperature, Soil Moisture Strip */}
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className={`p-2 rounded border ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                      <span className="text-[10px] text-slate-400 flex items-center justify-center gap-1">
                        <Thermometer className="w-3 h-3 text-orange-500" /> Temperature
                      </span>
                      <span className="font-bold text-orange-600 text-sm">
                        {searchedResult.temperatureC}°C
                      </span>
                    </div>

                    <div className={`p-2 rounded border ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                      <span className="text-[10px] text-slate-400 flex items-center justify-center gap-1">
                        <CloudRain className="w-3 h-3 text-blue-500" /> Weather
                      </span>
                      <span className="font-bold text-blue-600 text-xs truncate block" title={searchedResult.weather}>
                        {searchedResult.rainfall24hMm} mm ({searchedResult.weather})
                      </span>
                    </div>

                    <div className={`p-2 rounded border ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                      <span className="text-[10px] text-slate-400 flex items-center justify-center gap-1">
                        <Droplets className="w-3 h-3 text-cyan-600" /> Soil Moisture
                      </span>
                      <span className="font-bold text-cyan-700 dark:text-cyan-400 text-sm">
                        {searchedResult.soilMoisturePercent}% Wet
                      </span>
                    </div>
                  </div>

                  {/* Risk & Required Details in One Small Box */}
                  <div className="space-y-1.5 pt-1">
                    <div>
                      <strong className="text-slate-900 dark:text-white">Risk of that Area: </strong>
                      <span className="text-slate-700 dark:text-slate-300">{searchedResult.riskDescription}</span>
                    </div>
                    <div>
                      <strong className="text-slate-900 dark:text-white">Soil Wetness State: </strong>
                      <span className="text-slate-700 dark:text-slate-300">{searchedResult.soilConditionSimple}</span>
                    </div>
                    <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-t border-black/10 dark:border-white/10">
                      <div className="text-red-700 dark:text-red-300 font-bold flex items-center gap-1.5">
                        <Home className="w-4 h-4 text-red-600 shrink-0" />
                        <span>Nearest Safe Shelter: {searchedResult.shelterOrAdvice}</span>
                      </div>
                      <button
                        onClick={onOpenShelterModal}
                        className="px-3 py-1.5 rounded-lg bg-red-600 text-white font-extrabold text-xs hover:bg-red-700 cursor-pointer shadow-sm shrink-0"
                      >
                        Go to Near Shelter
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Informative placeholder when user hasn't searched yet */}
        {!hasUserSearched && (
          <div className="mt-3 text-xs text-slate-400 dark:text-slate-500 italic text-center py-2">
            Enter any city, town, hill station, or district name above to view its landslide risk, weather, temperature, and soil moisture.
          </div>
        )}
      </div>
    </div>
  );
}

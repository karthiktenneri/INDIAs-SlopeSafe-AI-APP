import React, { useState, useRef, useEffect } from 'react';
import { 
  Layers, 
  Satellite, 
  MapPin, 
  AlertTriangle, 
  Radio, 
  Compass, 
  Maximize2,
  Minimize2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Plane,
  Eye,
  Crosshair,
  ShieldAlert,
  ChevronRight,
  Info,
  ExternalLink
} from 'lucide-react';
import { CorridorData, LayerToggleState } from '../types';

interface GeospatialRiskMapProps {
  corridors: CorridorData[];
  selectedCorridor: CorridorData;
  onSelectCorridor: (corridor: CorridorData) => void;
  onIssueTrafficHalt: (corridor: CorridorData) => void;
  onLaunchDroneRecon: (corridor: CorridorData) => void;
  isDarkMode?: boolean;
}

// Coordinate projection calibrated to India-States-Map.jpg (1944 x 2077 pixels)
// Longitude: 70°E @ x=300px, 95°E @ x=1725px (57.0 px/degree)
// Latitude: 25°N @ y=750px, 5°N @ y=1970px (61.0 px/degree)
export function projectGeoToOfficialMap(lat: number, lon: number) {
  const x = 300 + (lon - 70.0) * 57.0;
  const y = 750 - (lat - 25.0) * 61.0;
  return {
    x: Math.round(x * 10) / 10,
    y: Math.round(y * 10) / 10,
    xPercent: (x / 1944) * 100,
    yPercent: (y / 2077) * 100
  };
}

// Topographic Vector projection formula for SVG (1000 x 1000)
export function projectGeoToVectorMap(lat: number, lon: number) {
  const minLon = 68.0;
  const maxLon = 97.5;
  const minLat = 8.0;
  const maxLat = 37.2;
  const x = 145 + ((lon - minLon) / (maxLon - minLon)) * 730;
  const y = 885 - ((lat - minLat) / (maxLat - minLat)) * 815;
  return { x: Math.round(x * 10) / 10, y: Math.round(y * 10) / 10 };
}

export const GeospatialRiskMap: React.FC<GeospatialRiskMapProps> = ({
  corridors,
  selectedCorridor,
  onSelectCorridor,
  onIssueTrafficHalt,
  onLaunchDroneRecon,
  isDarkMode = false
}) => {
  // Map display modes: 'official' (the user provided official states map) or 'topographic'
  const [mapMode, setMapMode] = useState<'official' | 'topographic'>('official');

  const [layers, setLayers] = useState<LayerToggleState>({
    insarNisar: true,
    rainfallIsohyets: true,
    faultLines: true,
    iotSensors: true,
    evacuationCorridors: true
  });

  const [historicalOffset, setHistoricalOffset] = useState<number>(0);
  const [showAllPins, setShowAllPins] = useState<boolean>(false);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [showLayerPanel, setShowLayerPanel] = useState<boolean>(false);
  const [showSectorTelemetry, setShowSectorTelemetry] = useState<boolean>(false);
  const [showHistoricalTelemetry, setShowHistoricalTelemetry] = useState<boolean>(false);
  const [hoveredCorridor, setHoveredCorridor] = useState<CorridorData | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  const toggleLayer = (key: keyof LayerToggleState) => {
    setLayers(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const getRiskColor = (percent: number) => {
    if (percent >= 80) return '#ef4444'; // Critical Red
    if (percent >= 70) return '#f59e0b'; // Severe Amber
    if (percent >= 60) return '#0284c7'; // Monitored Blue
    return '#10b981'; // Watch Green
  };

  // Key primary anchor sectors to display by default to avoid visual clutter
  const keyCorridorIds = [
    'sikkim-nh10',
    'kerala-wayanad-meppadi',
    'uttarakhand-joshimath-chamoli',
    'himachal-shimla-kinnaur-nh5',
    'jk-ramban-nh44',
    'assam-dima-hasao',
    'tamilnadu-ooty-dodabetta',
    'karnataka-agumbe-ghat',
    'maharashtra-mahabaleshwar',
    'darjeeling-lebong',
    'arunachal-tawang-sela',
    'ap-araku-valley',
    'meghalaya-cherrapunji',
    'manipur-senapati',
    'goa-chorla-ghat'
  ];

  const visibleCorridors = showAllPins 
    ? corridors 
    : corridors.filter(c => keyCorridorIds.includes(c.id) || c.id === selectedCorridor.id);

  const officialPos = projectGeoToOfficialMap(selectedCorridor.lat, selectedCorridor.lon);
  const vectorPos = projectGeoToVectorMap(selectedCorridor.lat, selectedCorridor.lon);

  const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 0.35, 3.2));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - 0.35, 0.8));
  const handleResetZoom = () => setZoomLevel(1);

  return (
    <div 
      id="whole-india-geospatial-risk-map-section" 
      className={`rounded-xl border shadow-lg overflow-hidden my-4 transition-colors ${
        isFullscreen 
          ? 'fixed inset-0 z-50 rounded-none m-0 bg-white flex flex-col' 
          : isDarkMode 
          ? 'border-slate-800 bg-slate-900/95' 
          : 'border-slate-200 bg-white'
      }`}
    >
      {/* Map Control Header */}
      <div className={`p-3.5 sm:p-4 border-b flex flex-wrap items-center justify-between gap-3 ${
        isDarkMode ? 'border-slate-800 bg-slate-950/80' : 'border-slate-200 bg-slate-50/90'
      }`}>
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="p-1 rounded bg-red-100 text-red-700">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <h3 className={`text-base sm:text-lg font-black uppercase tracking-wide font-display ${
              isDarkMode ? 'text-white' : 'text-slate-900'
            }`}>
              Official India Map &amp; Geospatial Landslide Threat Grid
            </h3>
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300 font-mono">
              Survey of India Calibrated
            </span>
          </div>
          <p className={`text-xs mt-0.5 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            Official administrative state boundaries with real-time geotechnical telemetry, InSAR displacement, and IMD isohyets.
          </p>
        </div>

        {/* View Mode Switcher, Zoom & Legend Controls */}
        <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
          {/* Map Mode Toggle: Official States vs Topographic */}
          <div className={`inline-flex rounded-lg p-0.5 border ${
            isDarkMode ? 'bg-slate-900 border-slate-700' : 'bg-slate-200 border-slate-300'
          }`}>
            <button
              onClick={() => setMapMode('official')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
                mapMode === 'official'
                  ? 'bg-cyan-600 text-white shadow-xs'
                  : isDarkMode
                  ? 'text-slate-400 hover:text-slate-200'
                  : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              Official States Map
            </button>
            <button
              onClick={() => setMapMode('topographic')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
                mapMode === 'topographic'
                  ? 'bg-cyan-600 text-white shadow-xs'
                  : isDarkMode
                  ? 'text-slate-400 hover:text-slate-200'
                  : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              Topographic GIS
            </button>
          </div>

          {/* Zoom Buttons */}
          <div className={`inline-flex items-center rounded-lg border overflow-hidden ${
            isDarkMode ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-300'
          }`}>
            <button
              onClick={handleZoomIn}
              title="Zoom In"
              className={`p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 border-r border-slate-200 dark:border-slate-700 cursor-pointer ${
                isDarkMode ? 'text-slate-300' : 'text-slate-700'
              }`}
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleZoomOut}
              title="Zoom Out"
              className={`p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 border-r border-slate-200 dark:border-slate-700 cursor-pointer ${
                isDarkMode ? 'text-slate-300' : 'text-slate-700'
              }`}
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleResetZoom}
              title="Reset Zoom"
              className={`px-2 py-1 text-[10px] font-bold hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer ${
                isDarkMode ? 'text-slate-300' : 'text-slate-700'
              }`}
            >
              {Math.round(zoomLevel * 100)}%
            </button>
          </div>

          {/* Toggle All Stations */}
          <button
            onClick={() => setShowAllPins(!showAllPins)}
            className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider transition-all border cursor-pointer ${
              showAllPins 
                ? 'bg-cyan-600 text-white border-cyan-700 shadow-xs' 
                : isDarkMode 
                ? 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white' 
                : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
            }`}
          >
            {showAllPins ? 'All Stations (60+)' : 'Key Corridors'}
          </button>

          {/* Fullscreen Toggle */}
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen View"}
            className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
              isDarkMode 
                ? 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700' 
                : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
            }`}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main Map Viewport */}
      <div 
        ref={containerRef}
        id="india-map-viewport" 
        className={`relative w-full ${isFullscreen ? 'flex-1' : 'h-[560px] sm:h-[640px] md:h-[720px]'} overflow-hidden select-none transition-colors ${
          isDarkMode ? 'bg-[#080e1a]' : 'bg-[#f8fafc]'
        }`}
      >
        {/* Lat/Lon Grid Texture Background */}
        <div 
          className="absolute inset-0 opacity-40 pointer-events-none"
          style={{
            backgroundImage: isDarkMode
              ? `radial-gradient(#38bdf8 1px, transparent 1px), linear-gradient(to right, #1e293b 1px, transparent 1px), linear-gradient(to bottom, #1e293b 1px, transparent 1px)`
              : `radial-gradient(#94a3b8 1px, transparent 1px), linear-gradient(to right, #e2e8f0 1px, transparent 1px), linear-gradient(to bottom, #e2e8f0 1px, transparent 1px)`,
            backgroundSize: '40px 40px, 40px 40px, 40px 40px'
          }}
        />

        {/* Top-Left Overlay: Official Geographic Verification Badge */}
        <div className={`absolute top-3 left-3 z-20 backdrop-blur-md rounded-lg p-2.5 shadow-md max-w-xs pointer-events-auto border ${
          isDarkMode ? 'bg-slate-900/90 border-slate-700/80' : 'bg-white/95 border-slate-200'
        }`}>
          <div className="flex items-center gap-1.5 text-xs font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className={isDarkMode ? 'text-slate-100' : 'text-slate-900'}>
              {mapMode === 'official' ? 'Official Political & States Map' : 'Digital Topographic Terrain GIS'}
            </span>
          </div>
          <p className={`text-[10px] font-mono mt-0.5 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
            Lat: 8.0°N – 37.2°N • Lon: 68.0°E – 97.5°E • 28 States &amp; 8 UTs
          </p>
        </div>

        {/* Side Heading 1: GIS Layers & Satellite Grid */}
        <div className={`absolute top-3 right-3 z-20 backdrop-blur-md rounded-lg shadow-md transition-all pointer-events-auto border ${
          isDarkMode ? 'bg-slate-900/95 border-slate-700/80' : 'bg-white/95 border-slate-200'
        }`}>
          <button
            id="heading-gis-layers"
            onClick={() => setShowLayerPanel(!showLayerPanel)}
            className="p-2.5 flex items-center justify-between gap-3 text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 hover:text-cyan-600 cursor-pointer w-full"
          >
            <div className="flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-cyan-600" />
              <span>GIS Layers &amp; Grid ({Object.values(layers).filter(Boolean).length}/5)</span>
            </div>
            <span className={`text-[9px] font-mono uppercase px-1.5 py-0.5 rounded font-bold border transition-colors ${
              showLayerPanel 
                ? 'bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-300 dark:border-slate-700' 
                : 'bg-cyan-100 text-cyan-800 dark:bg-cyan-950 dark:text-cyan-300 border-cyan-300 dark:border-cyan-800'
            }`}>
              {showLayerPanel ? 'Hide Details ▲' : 'View Details ▼'}
            </span>
          </button>

          {showLayerPanel && (
            <div className="p-2.5 space-y-1.5 font-mono text-[11px] w-64">
              <label className={`flex items-center justify-between cursor-pointer ${
                isDarkMode ? 'text-slate-300 hover:text-white' : 'text-slate-700 hover:text-slate-900'
              }`}>
                <span className="flex items-center gap-1.5">
                  <input 
                    type="checkbox" 
                    checked={layers.insarNisar} 
                    onChange={() => toggleLayer('insarNisar')}
                    className="rounded text-cyan-600 focus:ring-0"
                  />
                  Satellite InSAR (NISAR)
                </span>
                <span className="text-cyan-600 font-bold text-[10px]">v0.32</span>
              </label>

              <label className={`flex items-center justify-between cursor-pointer ${
                isDarkMode ? 'text-slate-300 hover:text-white' : 'text-slate-700 hover:text-slate-900'
              }`}>
                <span className="flex items-center gap-1.5">
                  <input 
                    type="checkbox" 
                    checked={layers.rainfallIsohyets} 
                    onChange={() => toggleLayer('rainfallIsohyets')}
                    className="rounded text-cyan-600 focus:ring-0"
                  />
                  IMD 24h Rain Isohyets
                </span>
                <span className="text-red-500 font-bold text-[10px]">Active</span>
              </label>

              <label className={`flex items-center justify-between cursor-pointer ${
                isDarkMode ? 'text-slate-300 hover:text-white' : 'text-slate-700 hover:text-slate-900'
              }`}>
                <span className="flex items-center gap-1.5">
                  <input 
                    type="checkbox" 
                    checked={layers.faultLines} 
                    onChange={() => toggleLayer('faultLines')}
                    className="rounded text-cyan-600 focus:ring-0"
                  />
                  Tectonic Faults (MCT/MBT)
                </span>
                <span className="text-amber-500 font-bold text-[10px]">High</span>
              </label>

              <label className={`flex items-center justify-between cursor-pointer ${
                isDarkMode ? 'text-slate-300 hover:text-white' : 'text-slate-700 hover:text-slate-900'
              }`}>
                <span className="flex items-center gap-1.5">
                  <input 
                    type="checkbox" 
                    checked={layers.iotSensors} 
                    onChange={() => toggleLayer('iotSensors')}
                    className="rounded text-cyan-600 focus:ring-0"
                  />
                  IoT Telemetry Nodes (542)
                </span>
                <span className="text-emerald-600 font-bold text-[10px]">Live</span>
              </label>

              <label className={`flex items-center justify-between cursor-pointer ${
                isDarkMode ? 'text-slate-300 hover:text-white' : 'text-slate-700 hover:text-slate-900'
              }`}>
                <span className="flex items-center gap-1.5">
                  <input 
                    type="checkbox" 
                    checked={layers.evacuationCorridors} 
                    onChange={() => toggleLayer('evacuationCorridors')}
                    className="rounded text-cyan-600 focus:ring-0"
                  />
                  Emergency Green Corridors
                </span>
                <span className="text-blue-600 font-bold text-[10px]">Open</span>
              </label>
            </div>
          )}
        </div>

        {/* Zoom & Pan Container */}
        <div 
          className="w-full h-full flex items-center justify-center transition-transform duration-200"
          style={{
            transform: `scale(${zoomLevel})`,
            transformOrigin: 'center center'
          }}
        >
          {/* ================= MODE 1: OFFICIAL STATES MAP (User-Provided Exact Map) ================= */}
          {mapMode === 'official' && (
            <div className="relative w-full h-full max-w-4xl max-h-full flex items-center justify-center p-2">
              <div className="relative inline-block max-w-full max-h-full aspect-[1944/2077] shadow-md border border-slate-300 rounded overflow-hidden">
                {/* Official High-Resolution Map Image */}
                <img
                  src="/assets/India-States-Map.jpg"
                  alt="Official Map of India with States and Union Territories"
                  className="w-full h-full object-contain block select-none pointer-events-none"
                  onError={(e) => {
                    // Fallback to online source if ever needed
                    (e.target as HTMLImageElement).src = 'https://www.nationsonline.org/maps/India-States-Map.jpg';
                  }}
                />

                {/* SVG Coordinate Overlay Layer calibrated to 1944 x 2077 */}
                <svg
                  viewBox="0 0 1944 2077"
                  className="absolute inset-0 w-full h-full pointer-events-none"
                  preserveAspectRatio="xMidYMid meet"
                >
                  <defs>
                    <radialGradient id="officialRainGlow" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#ef4444" stopOpacity="0.45" />
                      <stop offset="60%" stopColor="#f59e0b" stopOpacity="0.25" />
                      <stop offset="100%" stopColor="#0284c7" stopOpacity="0" />
                    </radialGradient>
                  </defs>

                  {/* Layer: Geological Thrust Faults (MCT and MBT) */}
                  {layers.faultLines && (
                    <g id="official-fault-lines-layer" opacity="0.85">
                      {/* Main Central Thrust (MCT) across Himalayas */}
                      <path
                        d="M 580 230 C 720 330, 950 470, 1360 600 C 1470 590, 1570 540, 1680 570"
                        fill="none"
                        stroke="#d97706"
                        strokeWidth="5"
                        strokeDasharray="16 8"
                      />
                      {/* Main Boundary Thrust (MBT) */}
                      <path
                        d="M 570 280 C 710 380, 940 520, 1350 630 C 1460 620, 1560 570, 1660 600"
                        fill="none"
                        stroke="#0284c7"
                        strokeWidth="4"
                        strokeDasharray="10 6"
                      />
                      {/* Western Ghats Active Escarpment Fault */}
                      <path
                        d="M 480 1000 C 510 1180, 560 1380, 650 1580"
                        fill="none"
                        stroke="#dc2626"
                        strokeWidth="4"
                        strokeDasharray="12 6"
                      />
                    </g>
                  )}

                  {/* Layer: IMD 24h Rainfall Isohyets */}
                  {layers.rainfallIsohyets && (
                    <g id="official-rainfall-isohyets-layer">
                      {/* Sikkim / Darjeeling Hub */}
                      <circle cx="1360" cy="610" r="90" fill="url(#officialRainGlow)" />
                      <circle cx="1360" cy="610" r="60" fill="none" stroke="#ef4444" strokeWidth="3" strokeDasharray="6 6" />
                      <text x="1380" cy="590" fill="#dc2626" fontSize="22" fontFamily="JetBrains Mono" fontWeight="bold">
                        142mm Isohyet
                      </text>

                      {/* Wayanad Western Ghats Hub */}
                      <circle cx="650" cy="1560" r="100" fill="url(#officialRainGlow)" />
                      <circle cx="650" cy="1560" r="65" fill="none" stroke="#ef4444" strokeWidth="3" strokeDasharray="6 6" />
                      <text x="670" cy="1540" fill="#dc2626" fontSize="22" fontFamily="JetBrains Mono" fontWeight="bold">
                        188mm Isohyet
                      </text>
                    </g>
                  )}

                  {/* Dynamic Monitoring Corridor Hotspot Pins */}
                  {visibleCorridors.map((c) => {
                    const pos = projectGeoToOfficialMap(c.lat, c.lon);
                    const isCurrent = c.id === selectedCorridor.id;
                    const dotColor = getRiskColor(c.riskPercent);

                    return (
                      <g 
                        key={c.id} 
                        transform={`translate(${pos.x}, ${pos.y})`}
                        onClick={() => onSelectCorridor(c)}
                        onMouseEnter={() => setHoveredCorridor(c)}
                        onMouseLeave={() => setHoveredCorridor(null)}
                        className="cursor-pointer group pointer-events-auto"
                      >
                        {/* Critical Risk Ping Ring */}
                        {c.riskPercent >= 80 && (
                          <circle
                            cx="0"
                            cy="0"
                            r="32"
                            fill="none"
                            stroke={dotColor}
                            strokeWidth="3.5"
                            className="animate-ping opacity-75"
                          />
                        )}

                        {/* Selected Corridor Laser Reticle Target */}
                        {isCurrent && (
                          <g>
                            <circle cx="0" cy="0" r="28" fill="none" stroke="#0284c7" strokeWidth="4" strokeDasharray="6 4" />
                            <line x1="-38" y1="0" x2="38" y2="0" stroke="#0284c7" strokeWidth="3" />
                            <line x1="0" y1="-38" x2="0" y2="38" stroke="#0284c7" strokeWidth="3" />
                          </g>
                        )}

                        {/* Main Geohazard Marker Pin */}
                        <circle
                          cx="0"
                          cy="0"
                          r={isCurrent ? 15 : 11}
                          fill={dotColor}
                          stroke="#ffffff"
                          strokeWidth="4"
                          className="transition-transform group-hover:scale-125 filter drop-shadow-md"
                        />

                        {/* Label Pill */}
                        <g transform="translate(18, -16)">
                          <rect
                            x="0"
                            y="0"
                            width={c.shortName.length * 13 + 70}
                            height="34"
                            rx="6"
                            fill={isCurrent ? '#0284c7' : '#ffffff'}
                            stroke={isCurrent ? '#38bdf8' : '#64748b'}
                            strokeWidth="2.5"
                            className="filter drop-shadow"
                          />
                          <text
                            x="10"
                            y="22"
                            fill={isCurrent ? '#ffffff' : '#0f172a'}
                            fontSize="17"
                            fontFamily="JetBrains Mono"
                            fontWeight="bold"
                          >
                            {c.shortName} ({c.riskPercent}%)
                          </text>
                        </g>
                      </g>
                    );
                  })}
                </svg>
              </div>
            </div>
          )}

          {/* ================= MODE 2: TOPOGRAPHIC DIGITAL GIS VECTOR ================= */}
          {mapMode === 'topographic' && (
            <svg
              viewBox="0 0 1000 1000"
              className="w-full h-full object-contain filter drop-shadow-sm"
              preserveAspectRatio="xMidYMid meet"
            >
              <defs>
                <linearGradient id="topoHimalayanLight" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#94a3b8" stopOpacity="0.4" />
                  <stop offset="50%" stopColor="#cbd5e1" stopOpacity="0.5" />
                  <stop offset="100%" stopColor="#e2e8f0" stopOpacity="0.3" />
                </linearGradient>

                <linearGradient id="topoLandmassLight" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#f8fafc" />
                  <stop offset="50%" stopColor="#f1f5f9" />
                  <stop offset="100%" stopColor="#e2e8f0" />
                </linearGradient>

                <linearGradient id="topoLandmassDark" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#1e293b" />
                  <stop offset="50%" stopColor="#132338" />
                  <stop offset="100%" stopColor="#0b1320" />
                </linearGradient>
              </defs>

              {/* Compass Rose */}
              <g transform="translate(80, 80)" opacity="0.65">
                <circle cx="0" cy="0" r="22" fill="none" stroke={isDarkMode ? '#475569' : '#94a3b8'} strokeWidth="1" />
                <path d="M 0 -20 L 4 -4 L 20 0 L 4 4 L 0 20 L -4 4 L -20 0 L -4 -4 Z" fill="#0284c7" />
                <text x="0" y="-24" textAnchor="middle" fontSize="10" fontWeight="bold" fill={isDarkMode ? '#e2e8f0' : '#334155'} fontFamily="JetBrains Mono">N</text>
              </g>

              {/* Ocean Range Rings */}
              <circle cx="500" cy="500" r="460" fill="none" stroke={isDarkMode ? '#1e293b' : '#e2e8f0'} strokeWidth="0.75" strokeDasharray="6 6" />
              <circle cx="500" cy="500" r="320" fill="none" stroke={isDarkMode ? '#1e293b' : '#e2e8f0'} strokeWidth="0.75" strokeDasharray="4 4" />

              {/* Topographic India Landmass Path */}
              <path
                d={`
                  M 370 70
                  C 350 75, 330 95, 320 130
                  C 310 160, 315 190, 305 210
                  C 295 230, 270 250, 260 280
                  C 245 310, 220 330, 215 360
                  C 210 385, 185 390, 180 410
                  C 175 425, 195 435, 210 440
                  C 200 450, 185 460, 185 475
                  C 190 495, 220 500, 240 485
                  C 250 480, 260 485, 265 500
                  C 270 525, 275 560, 280 600
                  C 285 640, 305 690, 325 740
                  C 340 780, 355 830, 370 875
                  C 380 885, 390 885, 395 875
                  C 415 840, 440 810, 455 780
                  C 480 730, 520 670, 550 620
                  C 580 570, 605 530, 630 490
                  C 645 470, 645 440, 640 410
                  C 640 370, 650 350, 660 340
                  C 665 315, 665 295, 675 290
                  C 685 295, 690 320, 715 330
                  C 745 320, 770 290, 800 270
                  C 830 255, 865 270, 860 300
                  C 855 330, 835 360, 825 390
                  C 820 420, 805 450, 785 480
                  C 770 485, 755 470, 750 450
                  C 740 435, 725 440, 715 420
                  C 700 400, 670 400, 650 380
                  C 635 375, 610 365, 580 345
                  C 550 325, 520 280, 490 250
                  C 460 220, 445 170, 440 130
                  C 435 90, 400 65, 370 70
                  Z
                `}
                fill={isDarkMode ? 'url(#topoLandmassDark)' : 'url(#topoLandmassLight)'}
                stroke={isDarkMode ? '#334155' : '#94a3b8'}
                strokeWidth="2"
                strokeLinejoin="round"
              />

              {/* Andaman & Nicobar Islands */}
              <g id="andaman-nicobar-chain" fill="#0284c7" opacity="0.8">
                <ellipse cx="850" cy="710" rx="3" ry="12" />
                <ellipse cx="854" cy="740" rx="3.5" ry="14" />
                <ellipse cx="858" cy="775" rx="3" ry="8" />
                <ellipse cx="865" cy="820" rx="4" ry="10" />
                <ellipse cx="875" cy="860" rx="4.5" ry="12" />
                <text x="830" y="885" fill={isDarkMode ? '#94a3b8' : '#64748b'} fontSize="9" fontFamily="JetBrains Mono">Andaman &amp; Nicobar</text>
              </g>

              {/* Lakshadweep Islands */}
              <g id="lakshadweep-chain" fill="#0284c7" opacity="0.8">
                <circle cx="280" cy="770" r="3" />
                <circle cx="275" cy="795" r="3" />
                <circle cx="285" cy="825" r="3.5" />
                <circle cx="295" cy="860" r="3" />
                <text x="210" y="840" fill={isDarkMode ? '#94a3b8' : '#64748b'} fontSize="9" fontFamily="JetBrains Mono">Lakshadweep</text>
              </g>

              {/* Himalayan Mountain Arc */}
              <path
                d="M 320 130 C 380 160, 480 220, 580 300 C 660 320, 750 290, 850 275 L 835 325 C 740 330, 660 350, 560 320 C 460 260, 370 200, 310 160 Z"
                fill="url(#topoHimalayanLight)"
                opacity="0.7"
              />

              {/* Western Ghats Mountain Ribbon */}
              <path
                d="M 275 510 C 285 580, 305 670, 330 760 C 350 810, 375 860, 385 875 L 370 875 C 345 820, 320 750, 295 660 C 275 580, 265 520, 260 510 Z"
                fill="url(#topoHimalayanLight)"
                opacity="0.8"
              />

              {/* Pins for Vector Mode */}
              {visibleCorridors.map((c) => {
                const pos = projectGeoToVectorMap(c.lat, c.lon);
                const isCurrent = c.id === selectedCorridor.id;
                const dotColor = getRiskColor(c.riskPercent);

                return (
                  <g 
                    key={c.id} 
                    transform={`translate(${pos.x}, ${pos.y})`}
                    onClick={() => onSelectCorridor(c)}
                    className="cursor-pointer group"
                  >
                    {c.riskPercent >= 80 && (
                      <circle cx="0" cy="0" r="16" fill="none" stroke={dotColor} strokeWidth="1.5" className="animate-ping opacity-60" />
                    )}
                    {isCurrent && (
                      <g>
                        <circle cx="0" cy="0" r="14" fill="none" stroke="#0284c7" strokeWidth="2" strokeDasharray="3 2" />
                        <line x1="-18" y1="0" x2="18" y2="0" stroke="#0284c7" strokeWidth="1.5" />
                        <line x1="0" y1="-18" x2="0" y2="18" stroke="#0284c7" strokeWidth="1.5" />
                      </g>
                    )}
                    <circle
                      cx="0"
                      cy="0"
                      r={isCurrent ? 7 : 5}
                      fill={dotColor}
                      stroke={isDarkMode ? '#0f172a' : '#ffffff'}
                      strokeWidth="2"
                      className="transition-all group-hover:scale-125"
                    />
                    <g transform="translate(10, -10)" className="pointer-events-none">
                      <rect
                        x="0"
                        y="0"
                        width={c.shortName.length * 7 + 38}
                        height="18"
                        rx="3"
                        fill={isCurrent ? '#0284c7' : isDarkMode ? '#0f172a' : '#ffffff'}
                        stroke={isCurrent ? '#38bdf8' : '#cbd5e1'}
                        strokeWidth="1"
                      />
                      <text
                        x="6"
                        y="12"
                        fill={isCurrent ? '#ffffff' : '#1e293b'}
                        fontSize="9"
                        fontFamily="JetBrains Mono"
                        fontWeight="bold"
                      >
                        {c.shortName} ({c.riskPercent}%)
                      </text>
                    </g>
                  </g>
                );
              })}
            </svg>
          )}
        </div>

        {/* Side Heading 2: Active Sector Geotechnical Telemetry */}
        <div 
          id="active-sector-telemetry-hud"
          className={`absolute bottom-3 left-3 z-20 backdrop-blur-md rounded-xl shadow-2xl pointer-events-auto border transition-all max-w-sm sm:max-w-md ${
            isDarkMode ? 'bg-slate-950/95 border-slate-700/80 text-slate-100' : 'bg-white/95 border-slate-200 text-slate-900'
          }`}
        >
          {/* Side Heading Header */}
          <button
            id="heading-sector-telemetry"
            onClick={() => setShowSectorTelemetry(!showSectorTelemetry)}
            className="w-full p-2.5 sm:p-3 flex items-center justify-between gap-2.5 cursor-pointer text-left"
          >
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse shrink-0"></span>
              <div>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <h4 className="text-xs sm:text-sm font-black uppercase tracking-tight font-display">
                    {selectedCorridor.name}
                  </h4>
                  <span className="text-[10px] font-bold uppercase px-1.5 py-0.2 rounded bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300 border border-red-300 font-mono">
                    {selectedCorridor.riskPercent}% Risk
                  </span>
                </div>
                <p className={`text-[10px] font-mono ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  Sector Telemetry Side Heading • Click to {showSectorTelemetry ? 'hide' : 'show'} details
                </p>
              </div>
            </div>
            <span className={`text-[10px] font-mono px-2 py-1 rounded font-bold border transition-colors shrink-0 ${
              showSectorTelemetry 
                ? 'bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-300 dark:border-slate-700' 
                : 'bg-cyan-600 text-white border-cyan-500 shadow-xs'
            }`}>
              {showSectorTelemetry ? 'Hide Details ▲' : 'View Details ▼'}
            </span>
          </button>

          {/* Expanded Sector Telemetry Details */}
          {showSectorTelemetry && (
            <div className={`p-3 sm:p-3.5 pt-0 border-t ${isDarkMode ? 'border-slate-800' : 'border-slate-200'}`}>
              <p className={`text-[10px] font-mono py-1.5 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                {selectedCorridor.state} • {selectedCorridor.mountainRange} • {selectedCorridor.elevationM}m AMSL
              </p>

              {/* Metric Badges Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 text-center mb-2.5">
                <div className={`p-1 rounded border ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                  <span className={`text-[9px] uppercase block font-mono ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Stability FoS</span>
                  <span className="text-xs font-black text-red-600 font-mono">
                    {selectedCorridor.fos.toFixed(2)}
                  </span>
                </div>

                <div className={`p-1 rounded border ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                  <span className={`text-[9px] uppercase block font-mono ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Failure ETA</span>
                  <span className="text-xs font-bold text-amber-600 font-mono truncate block">
                    {selectedCorridor.failureWindow}
                  </span>
                </div>

                <div className={`p-1 rounded border ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                  <span className={`text-[9px] uppercase block font-mono ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Displacement</span>
                  <span className="text-xs font-bold text-red-600 font-mono">
                    {selectedCorridor.displacementCreep}
                  </span>
                </div>

                <div className={`p-1 rounded border ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                  <span className={`text-[9px] uppercase block font-mono ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Moisture</span>
                  <span className="text-xs font-bold text-cyan-600 font-mono">
                    {selectedCorridor.moistureSaturation}%
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onIssueTrafficHalt(selectedCorridor)}
                  className="flex-1 py-1.5 px-2.5 rounded text-[10px] font-extrabold uppercase tracking-wider bg-red-600 hover:bg-red-700 text-white shadow transition-all whitespace-nowrap text-center cursor-pointer"
                >
                  Issue Traffic Halt
                </button>

                <button
                  onClick={() => onLaunchDroneRecon(selectedCorridor)}
                  className={`py-1.5 px-2.5 rounded text-[10px] font-bold uppercase tracking-wider transition-all border whitespace-nowrap flex items-center justify-center gap-1 cursor-pointer ${
                    isDarkMode 
                      ? 'bg-slate-900 hover:bg-slate-800 text-slate-200 border-slate-700' 
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300'
                  }`}
                >
                  <Plane className="w-3 h-3 text-cyan-600" />
                  <span>Drone Recon</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Side Heading 3: Historical Telemetry Replay */}
        <div 
          id="historical-scrubber-hud"
          className={`absolute bottom-3 right-3 z-20 backdrop-blur-md rounded-xl shadow-xl w-56 sm:w-64 pointer-events-auto border transition-all ${
            isDarkMode ? 'bg-slate-950/95 border-slate-700/80 text-slate-100' : 'bg-white/95 border-slate-200 text-slate-900'
          }`}
        >
          <button
            id="heading-historical-telemetry"
            onClick={() => setShowHistoricalTelemetry(!showHistoricalTelemetry)}
            className="w-full p-2.5 sm:p-3 flex items-center justify-between text-xs font-mono cursor-pointer"
          >
            <div className="flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5 text-cyan-600" />
              <span className={`text-[10px] uppercase font-bold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                Telemetry Replay
              </span>
            </div>
            <span className="text-cyan-600 font-bold text-[10px] flex items-center gap-1">
              {historicalOffset === 0 ? 'LIVE NOW' : `T - ${historicalOffset}h`}
              <span>{showHistoricalTelemetry ? '▲' : '▼'}</span>
            </span>
          </button>

          {/* Expanded Replay Controls */}
          {showHistoricalTelemetry && (
            <div className={`p-2.5 sm:p-3 pt-0 border-t ${isDarkMode ? 'border-slate-800' : 'border-slate-200'}`}>
              <div className="flex items-center space-x-1 mb-1.5 mt-2">
                {[24, 12, 6, 0].map((t) => (
                  <button
                    key={t}
                    onClick={() => setHistoricalOffset(t)}
                    className={`flex-1 py-0.5 rounded text-[9px] font-bold font-mono transition-all cursor-pointer ${
                      historicalOffset === t
                        ? 'bg-cyan-600 text-white shadow-xs'
                        : isDarkMode 
                        ? 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800' 
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200'
                    }`}
                  >
                    {t === 0 ? 'NOW' : `${t}h`}
                  </button>
                ))}
              </div>

              <input
                type="range"
                min="0"
                max="24"
                step="1"
                value={historicalOffset}
                onChange={(e) => setHistoricalOffset(parseInt(e.target.value))}
                className="w-full h-1 bg-slate-200 dark:bg-slate-800 rounded appearance-none cursor-pointer accent-cyan-600"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

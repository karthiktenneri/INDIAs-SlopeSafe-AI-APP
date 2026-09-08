import React, { useState } from 'react';
import { 
  Activity, 
  Cpu, 
  Wifi, 
  BatteryCharging, 
  AlertTriangle, 
  BarChart3, 
  Droplet, 
  Thermometer, 
  Layers,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  CloudRain,
  Droplets,
  HelpCircle,
  CheckCircle
} from 'lucide-react';
import { CorridorData } from '../types';
import { 
  getAreaTemperature, 
  getAreaWeather, 
  getSimpleSoilDescription, 
  getSimpleEnglishAdvice 
} from '../utils/proximityAlerts';

interface CorridorDiagnosticViewProps {
  corridor: CorridorData;
  corridors: CorridorData[];
  onSelectCorridor: (c: CorridorData) => void;
  onIssueTrafficHalt: (c: CorridorData) => void;
  onLaunchDroneRecon: (c: CorridorData) => void;
  isDarkMode?: boolean;
}

export const CorridorDiagnosticView: React.FC<CorridorDiagnosticViewProps> = ({
  corridor,
  corridors,
  onSelectCorridor,
  onIssueTrafficHalt,
  onLaunchDroneRecon,
  isDarkMode = false
}) => {
  const [activeTab, setActiveTab] = useState<'sensors' | 'soil' | 'structural'>('sensors');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 800);
  };

  return (
    <div id="corridor-diagnostic-view" className="space-y-4 my-4 font-mono text-xs">
      {/* Header Panel */}
      <div className={`p-4 sm:p-5 rounded-xl border shadow-md transition-colors ${
        isDarkMode ? 'border-slate-800 bg-slate-900/95 text-white' : 'border-slate-200 bg-white text-slate-900'
      }`}>
        <div className={`flex flex-wrap items-center justify-between gap-3 pb-3 border-b ${
          isDarkMode ? 'border-slate-800' : 'border-slate-200'
        }`}>
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-cyan-100 text-cyan-800 border border-cyan-300">
              <Activity className="w-5 h-5 animate-pulse text-cyan-600" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black font-display uppercase tracking-wide">
                  Geotechnical Sensor Array Console // {corridor.shortName}
                </h2>
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-red-100 text-red-800 border border-red-300">
                  {corridor.riskPercent}% Risk
                </span>
              </div>
              <p className={`text-[11px] mt-0.5 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                {corridor.name} • {corridor.lat.toFixed(4)}° N, {corridor.lon.toFixed(4)}° E • {corridor.seismicZone}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleRefresh}
              className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                isDarkMode 
                  ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700' 
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300'
              }`}
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-cyan-600' : ''}`} />
              <span>Poll Sensors (542 Nodes)</span>
            </button>
          </div>
        </div>

        {/* Corridor Quick Switcher */}
        <div className="flex items-center gap-2 pt-3 overflow-x-auto">
          <span className={`uppercase font-bold text-[10px] shrink-0 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
            Switch Sector:
          </span>
          {corridors.slice(0, 12).map((c) => (
            <button
              key={c.id}
              onClick={() => onSelectCorridor(c)}
              className={`px-2.5 py-1 rounded-lg text-[11px] whitespace-nowrap transition-all cursor-pointer ${
                corridor.id === c.id
                  ? 'bg-cyan-600 text-white font-bold shadow-xs'
                  : isDarkMode
                  ? 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                  : 'bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200'
              }`}
            >
              {c.shortName}
            </button>
          ))}
        </div>
      </div>

      {/* Simple English Area Weather, Soil & Living Danger Guide */}
      <div className={`p-4 rounded-xl border space-y-3 transition-colors ${
        isDarkMode ? 'border-slate-800 bg-slate-900/90' : 'border-slate-200 bg-white'
      }`}>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="font-bold text-xs uppercase text-slate-500 font-mono flex items-center gap-1.5">
            <HelpCircle className="w-4 h-4 text-cyan-600" />
            Simple English Guide For Citizens &amp; Travelers
          </span>
          <span className="text-[11px] font-bold font-mono px-2 py-0.5 rounded bg-red-100 text-red-800 border border-red-300">
            Chance of Landslide: {corridor.riskPercent}% (HIGH DANGER)
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className={`p-3 rounded-lg border flex items-center space-x-3 ${
            isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
          }`}>
            <Thermometer className="w-5 h-5 text-orange-500 shrink-0" />
            <div>
              <span className="text-[10px] text-slate-400 block font-mono">Air Temperature</span>
              <span className="text-base font-bold text-orange-600 font-sans">{getAreaTemperature(corridor)}°C</span>
              <span className="text-[10px] text-slate-500 block">Mountain Air</span>
            </div>
          </div>

          <div className={`p-3 rounded-lg border flex items-center space-x-3 ${
            isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
          }`}>
            <CloudRain className="w-5 h-5 text-blue-500 shrink-0" />
            <div>
              <span className="text-[10px] text-slate-400 block font-mono">Weather & Rain</span>
              <span className="text-xs font-bold text-blue-600 font-sans block">{getAreaWeather(corridor).weather}</span>
              <span className="text-[10px] text-slate-500 block font-mono">{corridor.rainfall24h} mm rainfall today</span>
            </div>
          </div>

          <div className={`p-3 rounded-lg border flex items-center space-x-3 ${
            isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
          }`}>
            <Droplets className="w-5 h-5 text-cyan-600 shrink-0" />
            <div>
              <span className="text-[10px] text-slate-400 block font-mono">Soil Moisture (Wetness)</span>
              <span className="text-base font-bold text-cyan-700 font-sans">{corridor.moistureSaturation}% Soaked</span>
              <span className="text-[10px] text-red-500 block font-bold">Heavy Waterlogged Mud</span>
            </div>
          </div>
        </div>

        <div className={`p-3 rounded-lg border text-xs leading-relaxed font-sans ${
          isDarkMode ? 'bg-slate-950 border-slate-800 text-slate-300' : 'bg-amber-50/70 border-amber-200 text-amber-950'
        }`}>
          <strong>Plain English Meaning:</strong> The mountain ground has absorbed {corridor.moistureSaturation}% of its maximum water capacity. 
          The mud is extremely heavy and slippery, sliding downwards at {corridor.displacementCreep}. 
          {corridor.riskPercent >= 75 ? ' Stay off the mountain roads and move to flat high ground away from steep hillside scarps.' : ' Drive with extra caution.'}
        </div>
      </div>

      {/* 4 Core Diagnostic Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Factor of Safety */}
        <div className={`p-4 rounded-xl border shadow-xs flex flex-col justify-between ${
          isDarkMode ? 'border-slate-800 bg-slate-900/90 text-white' : 'border-slate-200 bg-white text-slate-900'
        }`}>
          <div>
            <div className="flex items-center justify-between text-[11px]">
              <span className={isDarkMode ? 'text-slate-400' : 'text-slate-500'}>Factor of Safety (FoS)</span>
              <span className="text-red-600 font-bold">Unstable (&lt;1.0)</span>
            </div>
            <div className="text-3xl font-black text-red-600 font-mono my-2">
              {corridor.fos.toFixed(2)}
            </div>
          </div>
          <div className={`space-y-1 text-[11px] pt-2 border-t ${
            isDarkMode ? 'border-slate-800 text-slate-400' : 'border-slate-100 text-slate-500'
          }`}>
            <div>Critical Threshold: 1.00 FoS</div>
            <div className="text-amber-600 font-bold">Failure Window: {corridor.failureWindow}</div>
          </div>
        </div>

        {/* Subsurface Moisture Saturation */}
        <div className={`p-4 rounded-xl border shadow-xs flex flex-col justify-between ${
          isDarkMode ? 'border-slate-800 bg-slate-900/90 text-white' : 'border-slate-200 bg-white text-slate-900'
        }`}>
          <div>
            <div className="flex items-center justify-between text-[11px]">
              <span className={isDarkMode ? 'text-slate-400' : 'text-slate-500'}>Subsurface Saturation</span>
              <span className="text-red-600 font-bold">Pore Liquefaction</span>
            </div>
            <div className="text-3xl font-black text-red-600 font-mono my-2">
              {corridor.moistureSaturation}%
            </div>
          </div>
          <div className={`space-y-1 text-[11px] pt-2 border-t ${
            isDarkMode ? 'border-slate-800 text-slate-400' : 'border-slate-100 text-slate-500'
          }`}>
            <div>24h Precip: {corridor.rainfall24h} mm</div>
            <div className="text-red-600 font-bold">Breached Threshold ({corridor.rainfallThreshold} mm)</div>
          </div>
        </div>

        {/* Extensometer Creep */}
        <div className={`p-4 rounded-xl border shadow-xs flex flex-col justify-between ${
          isDarkMode ? 'border-slate-800 bg-slate-900/90 text-white' : 'border-slate-200 bg-white text-slate-900'
        }`}>
          <div>
            <div className="flex items-center justify-between text-[11px]">
              <span className={isDarkMode ? 'text-slate-400' : 'text-slate-500'}>Displacement Creep</span>
              <span className="text-amber-600 font-bold">Accelerating</span>
            </div>
            <div className="text-3xl font-black text-amber-600 font-mono my-2">
              {corridor.displacementCreep}
            </div>
          </div>
          <div className={`space-y-1 text-[11px] pt-2 border-t ${
            isDarkMode ? 'border-slate-800 text-slate-400' : 'border-slate-100 text-slate-500'
          }`}>
            <div>Cumulative 7-day: 68.4 mm</div>
            <div className="text-amber-600 font-bold">{corridor.anchorStrainAlert}</div>
          </div>
        </div>

        {/* Pore Water Pressure */}
        <div className={`p-4 rounded-xl border shadow-xs flex flex-col justify-between ${
          isDarkMode ? 'border-slate-800 bg-slate-900/90 text-white' : 'border-slate-200 bg-white text-slate-900'
        }`}>
          <div>
            <div className="flex items-center justify-between text-[11px]">
              <span className={isDarkMode ? 'text-slate-400' : 'text-slate-500'}>Pore Water Pressure</span>
              <span className="text-cyan-700 font-bold">Hydrostatic Head</span>
            </div>
            <div className="text-3xl font-black text-cyan-600 font-mono my-2">
              {corridor.porePressure} kPa
            </div>
          </div>
          <div className={`space-y-1 text-[11px] pt-2 border-t ${
            isDarkMode ? 'border-slate-800 text-slate-400' : 'border-slate-100 text-slate-500'
          }`}>
            <div>Sensor Source: {corridor.porePressureBorehole}</div>
            <div className="text-cyan-700 font-bold">Head: 4.8m Hydraulic Column</div>
          </div>
        </div>
      </div>

      {/* Geotechnical Borehole & Depth Telemetry Profile */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left: Subsurface Inclinometer Profile Visualizer */}
        <div className={`lg:col-span-7 p-4 sm:p-5 rounded-xl border shadow-sm ${
          isDarkMode ? 'border-slate-800 bg-slate-900/90 text-white' : 'border-slate-200 bg-white text-slate-900'
        }`}>
          <div className={`flex items-center justify-between pb-3 mb-3 border-b ${
            isDarkMode ? 'border-slate-800' : 'border-slate-200'
          }`}>
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyan-600" />
              <span className="font-extrabold text-sm uppercase font-display">
                Subsurface Inclinometer Depth Profile (0m - 25m)
              </span>
            </div>
            <span className={`text-[10px] font-mono ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              Borehole INC-04
            </span>
          </div>

          <div className="space-y-2.5">
            {[
              { depth: '0m - 5m', layer: 'Unconsolidated Colluvium & Topsoil', displacement: '5.6 mm/hr', shear: 'Critical Shear Slip', color: 'bg-red-500', width: '92%' },
              { depth: '5m - 12m', layer: 'Weathered Phyllite & Schist (Decomposed)', displacement: '3.4 mm/hr', shear: 'Active Creep Zone', color: 'bg-amber-500', width: '68%' },
              { depth: '12m - 18m', layer: 'Fractured Quartzite Siltstone', displacement: '1.2 mm/hr', shear: 'Plastic Straining', color: 'bg-yellow-500', width: '38%' },
              { depth: '18m - 25m', layer: 'Intact Bedrock (Main Gneissic Band)', displacement: '0.02 mm/hr', shear: 'Anchored Horizon', color: 'bg-emerald-500', width: '8%' },
            ].map((d, i) => (
              <div 
                key={i} 
                className={`p-3 rounded-lg border space-y-1.5 ${
                  isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="flex justify-between items-center text-[11px]">
                  <span className="font-bold">{d.depth}: {d.layer}</span>
                  <span className="font-bold font-mono">{d.displacement}</span>
                </div>
                <div className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div className={`h-full ${d.color}`} style={{ width: d.width }} />
                </div>
                <div className={`flex justify-between text-[10px] ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  <span>Stratum State: {d.shear}</span>
                  <span>Safety Margin: {i === 0 ? 'FoS 0.88' : i === 1 ? 'FoS 1.05' : 'FoS >1.60'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Active IoT Sensors Grid & Health */}
        <div className={`lg:col-span-5 p-4 sm:p-5 rounded-xl border shadow-sm flex flex-col justify-between ${
          isDarkMode ? 'border-slate-800 bg-slate-900/90 text-white' : 'border-slate-200 bg-white text-slate-900'
        }`}>
          <div>
            <div className={`flex items-center justify-between pb-3 mb-3 border-b ${
              isDarkMode ? 'border-slate-800' : 'border-slate-200'
            }`}>
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-cyan-600" />
                <span className="font-extrabold text-sm uppercase font-display">
                  Active Sensor Array ({corridor.iotNodeCount} Nodes)
                </span>
              </div>
              <span className="text-emerald-700 text-[10px] flex items-center gap-1 font-mono font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                LoRaWAN Mesh Online
              </span>
            </div>

            <div className="space-y-2">
              {corridor.activeSensors.map((sensor, idx) => (
                <div 
                  key={idx} 
                  className={`p-2.5 rounded-lg border flex items-center justify-between ${
                    isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <Wifi className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="font-bold">{sensor}</span>
                  </div>
                  <div className="text-right text-[10px]">
                    <span className="text-emerald-700 block font-bold">100% SIGNAL</span>
                    <span className={isDarkMode ? 'text-slate-400' : 'text-slate-500'}>Bat: 3.92V Solar</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className={`pt-4 border-t mt-4 flex gap-2 ${
            isDarkMode ? 'border-slate-800' : 'border-slate-200'
          }`}>
            <button
              onClick={() => onIssueTrafficHalt(corridor)}
              className="flex-1 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-xs cursor-pointer"
            >
              Halt Sector Traffic
            </button>
            <button
              onClick={() => onLaunchDroneRecon(corridor)}
              className={`flex-1 py-2 rounded-lg border font-bold text-xs cursor-pointer transition-all ${
                isDarkMode 
                  ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700' 
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300'
              }`}
            >
              UAV Aerial Recon
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

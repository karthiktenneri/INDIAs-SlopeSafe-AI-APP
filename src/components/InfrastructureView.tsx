import React, { useState } from 'react';
import { 
  Network, 
  Search, 
  Filter, 
  Clock, 
  ShieldAlert, 
  Truck, 
  Train, 
  Droplet, 
  Compass,
  ArrowRight,
  PhoneCall,
  Activity,
  AlertTriangle,
  Radio,
  CheckCircle2
} from 'lucide-react';
import { InfrastructureAsset } from '../types';

interface InfrastructureViewProps {
  assets: InfrastructureAsset[];
  onOpenAssetProtocol: (asset: InfrastructureAsset) => void;
  isDarkMode?: boolean;
}

export const InfrastructureView: React.FC<InfrastructureViewProps> = ({
  assets,
  onOpenAssetProtocol,
  isDarkMode = false
}) => {
  const [filterQuery, setFilterQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'ALL' | 'HYDRO' | 'RAILWAY' | 'HIGHWAY'>('ALL');

  const filteredAssets = assets.filter(a => {
    const matchesQuery = a.name.toLowerCase().includes(filterQuery.toLowerCase()) ||
                         a.corridorRegion.toLowerCase().includes(filterQuery.toLowerCase()) ||
                         a.agency.toLowerCase().includes(filterQuery.toLowerCase()) ||
                         a.category.toLowerCase().includes(filterQuery.toLowerCase());
    if (!matchesQuery) return false;

    if (categoryFilter === 'ALL') return true;
    return a.infraType === categoryFilter;
  });

  const getStatusBadge = (status: InfrastructureAsset['status'], color: InfrastructureAsset['statusColor']) => {
    switch (color) {
      case 'red':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'amber':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'green':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'blue':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-300';
    }
  };

  const getDotColor = (color: InfrastructureAsset['statusColor']) => {
    switch (color) {
      case 'red': return 'bg-red-500 animate-pulse';
      case 'amber': return 'bg-amber-500';
      case 'green': return 'bg-emerald-500';
      case 'blue': return 'bg-blue-500';
      default: return 'bg-slate-400';
    }
  };

  const getTypeIcon = (type: InfrastructureAsset['infraType']) => {
    switch (type) {
      case 'HYDRO': return <Droplet className="w-4 h-4 text-blue-500 shrink-0" />;
      case 'RAILWAY': return <Train className="w-4 h-4 text-purple-500 shrink-0" />;
      case 'HIGHWAY': return <Truck className="w-4 h-4 text-amber-500 shrink-0" />;
      default: return <Network className="w-4 h-4 text-cyan-500 shrink-0" />;
    }
  };

  const counts = {
    all: assets.length,
    hydro: assets.filter(a => a.infraType === 'HYDRO').length,
    railway: assets.filter(a => a.infraType === 'RAILWAY').length,
    highway: assets.filter(a => a.infraType === 'HIGHWAY').length,
  };

  return (
    <div id="infrastructure-full-view" className="space-y-4 my-4 font-mono text-xs">
      {/* Header Banner */}
      <div className={`p-5 rounded-xl border shadow-md transition-colors ${
        isDarkMode ? 'border-slate-800 bg-slate-900/95 text-white' : 'border-slate-200 bg-white text-slate-900'
      }`}>
        <div className={`flex flex-wrap items-center justify-between gap-3 pb-3 border-b ${
          isDarkMode ? 'border-slate-800' : 'border-slate-200'
        }`}>
          <div>
            <div className="flex items-center gap-2">
              <Network className="w-5 h-5 text-cyan-600" />
              <h2 className="text-lg sm:text-xl font-black uppercase font-display tracking-wide">
                Critical Mountain Lifeline Infrastructure Registry
              </h2>
            </div>
            <p className={`text-xs mt-1 max-w-3xl ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              Real-time structural health monitoring across strategic border highways, passenger railway tunnels, hydro reservoirs, and defense access corridors in the Indian Himalayas and Western Ghats.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="bg-red-100 px-3 py-1 rounded-lg border border-red-300 text-red-800 font-bold">
              1 Road Halted (NH-10)
            </span>
            <span className="bg-amber-100 px-3 py-1 rounded-lg border border-amber-300 text-amber-800 font-bold">
              5 Under Caution / Escort
            </span>
            <span className="bg-emerald-100 px-3 py-1 rounded-lg border border-emerald-300 text-emerald-800 font-bold">
              7 Nominal / Clear
            </span>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              placeholder="Search by asset, agency (BRO, NHAI, THDC, NHPC, Railways) or district..."
              className={`w-full pl-9 pr-3 py-1.5 rounded-lg border text-xs font-mono focus:outline-none focus:ring-2 focus:ring-cyan-500 ${
                isDarkMode 
                  ? 'bg-slate-950 border-slate-700 text-slate-200' 
                  : 'bg-slate-50 border-slate-300 text-slate-800'
              }`}
            />
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            <button
              onClick={() => setCategoryFilter('ALL')}
              className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                categoryFilter === 'ALL'
                  ? 'bg-cyan-600 text-white shadow-xs'
                  : isDarkMode
                  ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              ALL LIFELINES ({counts.all})
            </button>
            <button
              onClick={() => setCategoryFilter('HYDRO')}
              className={`flex items-center gap-1 px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                categoryFilter === 'HYDRO'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : isDarkMode
                  ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Droplet className="w-3.5 h-3.5" />
              <span>HYDRO DAMS ({counts.hydro})</span>
            </button>
            <button
              onClick={() => setCategoryFilter('RAILWAY')}
              className={`flex items-center gap-1 px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                categoryFilter === 'RAILWAY'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : isDarkMode
                  ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Train className="w-3.5 h-3.5" />
              <span>RAILWAYS ({counts.railway})</span>
            </button>
            <button
              onClick={() => setCategoryFilter('HIGHWAY')}
              className={`flex items-center gap-1 px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                categoryFilter === 'HIGHWAY'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : isDarkMode
                  ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Truck className="w-3.5 h-3.5" />
              <span>HIGHWAYS ({counts.highway})</span>
            </button>
          </div>
        </div>
      </div>

      {/* Grid of Infrastructure Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredAssets.map((asset) => (
          <div 
            key={asset.id}
            className={`p-4 rounded-xl border transition-all space-y-3 shadow-xs ${
              isDarkMode 
                ? 'border-slate-800 hover:border-cyan-500/50 bg-slate-900/80 text-white' 
                : 'border-slate-200 hover:border-cyan-500 bg-white text-slate-900'
            }`}
          >
            {/* Header: Name, Agency, Status */}
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${getDotColor(asset.statusColor)}`}></span>
                  {getTypeIcon(asset.infraType)}
                  <h3 className="text-sm font-extrabold font-display">
                    {asset.name}
                  </h3>
                </div>
                <div className={`text-[11px] mt-0.5 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  {asset.corridorRegion}
                </div>
                <div className="text-[10px] text-cyan-600 font-mono mt-0.5">
                  Alt: {asset.elevationM}m AMSL • {asset.coordinates}
                </div>
              </div>

              <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border ${getStatusBadge(asset.status, asset.statusColor)}`}>
                {asset.status}
              </span>
            </div>

            {/* Geotechnical Hazard Note */}
            <div className={`p-2.5 rounded-lg border space-y-1 ${
              isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="flex items-center justify-between">
                <span className={`text-[11px] ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  Active Hazard Telemetry:
                </span>
                <span className="text-[10px] font-mono text-slate-400">
                  Last ping: {asset.lastInspection}
                </span>
              </div>
              <p className="text-amber-600 font-sans text-xs font-semibold leading-relaxed">
                {asset.hazardNote}
              </p>
            </div>

            {/* Specialized Engineering Specs & Telemetry */}
            {asset.infraType === 'HYDRO' && asset.damSpecs && (
              <div className={`p-3 rounded-lg border space-y-2 text-[11px] ${
                isDarkMode ? 'bg-blue-950/20 border-blue-900/40' : 'bg-blue-50/70 border-blue-200'
              }`}>
                <div className="flex items-center justify-between font-bold text-blue-700">
                  <span className="flex items-center gap-1">
                    <Droplet className="w-3.5 h-3.5" />
                    Reservoir Storage
                  </span>
                  <span>{asset.damSpecs.storagePercentage}% ({asset.damSpecs.reservoirLevelM}m / FRL {asset.damSpecs.fullReservoirLevelM}m)</span>
                </div>
                
                {/* Progress bar */}
                <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${
                      asset.damSpecs.storagePercentage > 85 ? 'bg-amber-500' : 'bg-blue-600'
                    }`} 
                    style={{ width: `${Math.min(100, asset.damSpecs.storagePercentage)}%` }}
                  />
                </div>

                <div className="grid grid-cols-2 gap-2 text-[10px]">
                  <div>
                    <span className="text-slate-400 block">Discharge Balance:</span>
                    <span className="font-semibold">In: {asset.damSpecs.inflowCusecs.toLocaleString()} cusecs | Out: {asset.damSpecs.spillwayDischargeCusecs.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">GLOF / Flood Risk:</span>
                    <span className={`font-bold ${
                      asset.damSpecs.glofAlertStatus === 'GREEN' ? 'text-emerald-600' : 'text-amber-600'
                    }`}>
                      {asset.damSpecs.glofAlertStatus} Alert
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Penstock Stability:</span>
                    <span className="font-semibold">{asset.damSpecs.penstockSlopeStability}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Siltation Rate:</span>
                    <span className="font-semibold">{asset.damSpecs.siltationIndex}</span>
                  </div>
                </div>
              </div>
            )}

            {asset.infraType === 'RAILWAY' && asset.railwaySpecs && (
              <div className={`p-3 rounded-lg border space-y-2 text-[11px] ${
                isDarkMode ? 'bg-purple-950/20 border-purple-900/40' : 'bg-purple-50/70 border-purple-200'
              }`}>
                <div className="flex items-center justify-between font-bold text-purple-700">
                  <span className="flex items-center gap-1">
                    <Train className="w-3.5 h-3.5" />
                    {asset.railwaySpecs.railSection}
                  </span>
                  <span className="text-[10px] bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 px-1.5 py-0.5 rounded">
                    Kavach: {asset.railwaySpecs.kavachInterlockState}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[10px]">
                  <div>
                    <span className="text-slate-400 block">Track Gauge / Heave Shift:</span>
                    <span className="font-semibold text-amber-600">{asset.railwaySpecs.trackDisplacementMm} mm</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Rockfall Net Strain:</span>
                    <span className="font-semibold">{asset.railwaySpecs.rockfallNetTensionKn} kN</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-slate-400 block">Tunnel Portal & Scour:</span>
                    <span className="font-semibold">{asset.railwaySpecs.tunnelPortalStatus} • {asset.railwaySpecs.bridgeScourRisk}</span>
                  </div>
                </div>
              </div>
            )}

            {asset.infraType === 'HIGHWAY' && asset.highwaySpecs && (
              <div className={`p-3 rounded-lg border space-y-2 text-[11px] ${
                isDarkMode ? 'bg-amber-950/20 border-amber-900/40' : 'bg-amber-50/70 border-amber-200'
              }`}>
                <div className="flex items-center justify-between font-bold text-amber-700">
                  <span className="flex items-center gap-1">
                    <Truck className="w-3.5 h-3.5" />
                    {asset.highwaySpecs.nhRouteNumber} ({asset.highwaySpecs.chainageKm})
                  </span>
                  <span className="text-[10px] bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200 px-1.5 py-0.5 rounded">
                    Queue: {asset.highwaySpecs.trafficQueueVehicles} Veh
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[10px]">
                  <div>
                    <span className="text-slate-400 block">Carriageway Clearance:</span>
                    <span className="font-semibold">{asset.highwaySpecs.carriagewayClearanceM} meters</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Retaining Wall Pressure:</span>
                    <span className="font-semibold">{asset.highwaySpecs.retainingWallLoadKpa} kPa</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-slate-400 block">Convoy & Machinery:</span>
                    <span className="font-semibold">{asset.highwaySpecs.escortConvoyStatus} • {asset.highwaySpecs.deployedMachinery}</span>
                  </div>
                  <div className="col-span-2 text-cyan-700">
                    <span className="text-slate-400 block">Contingency Bypass:</span>
                    <span>{asset.highwaySpecs.contingencyBypass}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Footer: Agency & Protocol Trigger Button */}
            <div className={`flex flex-wrap items-center justify-between gap-2 pt-2 border-t ${
              isDarkMode ? 'border-slate-800' : 'border-slate-100'
            }`}>
              <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                <Radio className="w-3 h-3 text-emerald-500" />
                <span>Control: {asset.emergencyControlRoom}</span>
              </div>

              <button
                onClick={() => onOpenAssetProtocol(asset)}
                className={`px-3 py-1.5 rounded-lg border font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer ${
                  isDarkMode 
                    ? 'bg-slate-800 hover:bg-slate-700 text-cyan-300 border-slate-700' 
                    : 'bg-slate-100 hover:bg-slate-200 text-cyan-800 border-slate-300'
                }`}
              >
                <span>SOP {asset.protocolLabel}</span>
                <ArrowRight className="w-3.5 h-3.5 text-cyan-600" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

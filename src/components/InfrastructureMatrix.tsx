import React, { useState } from 'react';
import { 
  Network, 
  ShieldAlert, 
  CheckCircle, 
  Clock, 
  ExternalLink, 
  Droplet, 
  Train, 
  Truck, 
  Layers,
  AlertTriangle,
  Activity
} from 'lucide-react';
import { InfrastructureAsset } from '../types';

interface InfrastructureMatrixProps {
  assets: InfrastructureAsset[];
  onOpenAssetProtocol: (asset: InfrastructureAsset) => void;
  isDarkMode?: boolean;
}

export const InfrastructureMatrix: React.FC<InfrastructureMatrixProps> = ({
  assets,
  onOpenAssetProtocol,
  isDarkMode = false
}) => {
  const [selectedType, setSelectedType] = useState<'ALL' | 'HYDRO' | 'RAILWAY' | 'HIGHWAY'>('ALL');

  const filteredAssets = assets.filter(a => {
    if (selectedType === 'ALL') return true;
    return a.infraType === selectedType;
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
      case 'red': return 'bg-red-600 animate-pulse';
      case 'amber': return 'bg-amber-600';
      case 'green': return 'bg-emerald-600';
      case 'blue': return 'bg-blue-600';
      default: return 'bg-slate-400';
    }
  };

  const getTypeIcon = (type: InfrastructureAsset['infraType']) => {
    switch (type) {
      case 'HYDRO': return <Droplet className="w-3.5 h-3.5 text-blue-600 shrink-0" />;
      case 'RAILWAY': return <Train className="w-3.5 h-3.5 text-purple-600 shrink-0" />;
      case 'HIGHWAY': return <Truck className="w-3.5 h-3.5 text-amber-600 shrink-0" />;
      default: return <Layers className="w-3.5 h-3.5 text-slate-500 shrink-0" />;
    }
  };

  const counts = {
    all: assets.length,
    hydro: assets.filter(a => a.infraType === 'HYDRO').length,
    railway: assets.filter(a => a.infraType === 'RAILWAY').length,
    highway: assets.filter(a => a.infraType === 'HIGHWAY').length,
  };

  return (
    <div 
      id="infrastructure-vulnerability-matrix-section" 
      className={`rounded-xl border shadow-md p-4 sm:p-5 my-4 transition-colors ${
        isDarkMode ? 'border-slate-800 bg-slate-900/95' : 'border-slate-200 bg-white'
      }`}
    >
      {/* Header */}
      <div className={`flex flex-wrap items-center justify-between gap-2 pb-3 mb-3 border-b ${
        isDarkMode ? 'border-slate-800' : 'border-slate-200'
      }`}>
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h3 className={`text-sm sm:text-base font-black uppercase tracking-wide flex items-center gap-1.5 font-display ${
              isDarkMode ? 'text-white' : 'text-slate-900'
            }`}>
              <Network className="w-4 h-4 text-cyan-600" />
              Critical Mountain Infrastructure Vulnerability Matrix
            </h3>
          </div>
          <p className={`text-[11px] sm:text-xs mt-0.5 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            Live geotechnical telemetry across Himalayan hydroelectric dams, strategic mountain railways, and defense highway arteries
          </p>
        </div>

        <div className="flex items-center space-x-1.5 text-xs font-mono text-cyan-800 bg-cyan-100 px-2.5 py-1 rounded border border-cyan-300">
          <Clock className="w-3 h-3 text-cyan-700" />
          <span>Telemetry: Live (T-1m)</span>
        </div>
      </div>

      {/* Sector Category Filter Buttons */}
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <button
          onClick={() => setSelectedType('ALL')}
          className={`flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
            selectedType === 'ALL'
              ? 'bg-cyan-600 text-white shadow-xs'
              : isDarkMode
                ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          <Layers className="w-3 h-3" />
          <span>ALL LIFELINES ({counts.all})</span>
        </button>

        <button
          onClick={() => setSelectedType('HYDRO')}
          className={`flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
            selectedType === 'HYDRO'
              ? 'bg-blue-600 text-white shadow-xs'
              : isDarkMode
                ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          <Droplet className="w-3 h-3 text-blue-400" />
          <span>HYDRO DAMS & RESERVOIRS ({counts.hydro})</span>
        </button>

        <button
          onClick={() => setSelectedType('RAILWAY')}
          className={`flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
            selectedType === 'RAILWAY'
              ? 'bg-purple-600 text-white shadow-xs'
              : isDarkMode
                ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          <Train className="w-3 h-3 text-purple-400" />
          <span>MOUNTAIN RAILWAYS ({counts.railway})</span>
        </button>

        <button
          onClick={() => setSelectedType('HIGHWAY')}
          className={`flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
            selectedType === 'HIGHWAY'
              ? 'bg-amber-600 text-white shadow-xs'
              : isDarkMode
                ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          <Truck className="w-3 h-3 text-amber-400" />
          <span>STRATEGIC HIGHWAYS ({counts.highway})</span>
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table id="infra-matrix-table" className="w-full text-left border-collapse text-xs font-mono">
          <thead>
            <tr className={`border-b text-[10px] uppercase font-bold tracking-wider ${
              isDarkMode ? 'border-slate-800 text-slate-400' : 'border-slate-200 text-slate-500'
            }`}>
              <th className="py-2.5 px-3">Lifeline Asset</th>
              <th className="py-2.5 px-3">Corridor & Elevation</th>
              <th className="py-2.5 px-3">Live Sector Telemetry</th>
              <th className="py-2.5 px-3">Geotechnical Hazard</th>
              <th className="py-2.5 px-3 text-center">Status</th>
              <th className="py-2.5 px-3 text-right">Emergency Protocol</th>
            </tr>
          </thead>
          <tbody className={`divide-y ${isDarkMode ? 'divide-slate-800' : 'divide-slate-100'}`}>
            {filteredAssets.map((asset) => (
              <tr 
                key={asset.id} 
                className={`transition-colors ${
                  isDarkMode ? 'hover:bg-slate-800/50' : 'hover:bg-slate-50'
                }`}
              >
                {/* Asset Name with Type Icon and Status Dot */}
                <td className="py-3 px-3">
                  <div className="flex items-start space-x-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${getDotColor(asset.statusColor)} shrink-0 mt-1`}></span>
                    <div>
                      <div className="flex items-center gap-1.5">
                        {getTypeIcon(asset.infraType)}
                        <span className={`font-bold font-display text-xs sm:text-sm ${
                          isDarkMode ? 'text-slate-100' : 'text-slate-900'
                        }`}>
                          {asset.name}
                        </span>
                      </div>
                      <div className={`text-[10px] mt-0.5 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                        {asset.agency}
                      </div>
                    </div>
                  </div>
                </td>

                {/* Corridor / Region & Elevation */}
                <td className={`py-3 px-3 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                  <div>{asset.corridorRegion}</div>
                  <div className="text-[10px] font-mono text-cyan-700 mt-0.5">
                    Alt: {asset.elevationM}m AMSL • {asset.coordinates}
                  </div>
                </td>

                {/* Live Sector Telemetry */}
                <td className="py-3 px-3">
                  {asset.infraType === 'HYDRO' && asset.damSpecs && (
                    <div className="space-y-0.5 text-[11px]">
                      <div className="flex items-center gap-1 font-bold text-blue-700">
                        <span>FRL: {asset.damSpecs.reservoirLevelM}m / {asset.damSpecs.fullReservoirLevelM}m</span>
                        <span className="text-[10px] bg-blue-100 text-blue-800 px-1 rounded">{asset.damSpecs.storagePercentage}% Cap</span>
                      </div>
                      <div className={`text-[10px] ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                        Flow: +{asset.damSpecs.inflowCusecs.toLocaleString()} / -{asset.damSpecs.spillwayDischargeCusecs.toLocaleString()} cusecs
                      </div>
                      <div className="text-[10px]">
                        GLOF Risk: <span className={asset.damSpecs.glofAlertStatus === 'GREEN' ? 'text-emerald-600 font-bold' : 'text-amber-600 font-bold'}>{asset.damSpecs.glofAlertStatus}</span>
                      </div>
                    </div>
                  )}

                  {asset.infraType === 'RAILWAY' && asset.railwaySpecs && (
                    <div className="space-y-0.5 text-[11px]">
                      <div className="flex items-center gap-1 font-bold text-purple-700">
                        <span>Track Shift: {asset.railwaySpecs.trackDisplacementMm} mm</span>
                        <span className="text-[10px] bg-purple-100 text-purple-800 px-1 rounded">{asset.railwaySpecs.kavachInterlockState}</span>
                      </div>
                      <div className={`text-[10px] ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                        Rock Net Tension: {asset.railwaySpecs.rockfallNetTensionKn} kN • Patrol: {asset.railwaySpecs.patrolIntervalHours}h
                      </div>
                      <div className="text-[10px] text-slate-500 truncate max-w-[200px]">
                        {asset.railwaySpecs.tunnelPortalStatus}
                      </div>
                    </div>
                  )}

                  {asset.infraType === 'HIGHWAY' && asset.highwaySpecs && (
                    <div className="space-y-0.5 text-[11px]">
                      <div className="flex items-center gap-1 font-bold text-amber-700">
                        <span>{asset.highwaySpecs.nhRouteNumber}</span>
                        <span className="text-[10px] bg-amber-100 text-amber-800 px-1 rounded">{asset.highwaySpecs.chainageKm}</span>
                      </div>
                      <div className={`text-[10px] ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                        Clearance: {asset.highwaySpecs.carriagewayClearanceM}m • Queue: {asset.highwaySpecs.trafficQueueVehicles} veh
                      </div>
                      <div className="text-[10px] text-slate-500 truncate max-w-[200px]">
                        {asset.highwaySpecs.escortConvoyStatus}
                      </div>
                    </div>
                  )}
                </td>

                {/* Hazard Note */}
                <td className="py-3 px-3 text-amber-600 font-medium max-w-[200px]">
                  {asset.hazardNote}
                </td>

                {/* Status Badge */}
                <td className="py-3 px-3 text-center">
                  <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${getStatusBadge(asset.status, asset.statusColor)}`}>
                    {asset.status}
                  </span>
                  <div className="text-[9px] text-slate-400 mt-1">{asset.lastInspection}</div>
                </td>

                {/* Protocol Button */}
                <td className="py-3 px-3 text-right">
                  <button
                    onClick={() => onOpenAssetProtocol(asset)}
                    className="inline-flex items-center space-x-1 px-2.5 py-1.5 rounded bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-[10px] uppercase tracking-wider transition-all shadow-xs cursor-pointer"
                  >
                    <span>{asset.protocolLabel}</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

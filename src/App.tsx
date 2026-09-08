import React, { useState } from 'react';
import { TopTicker } from './components/TopTicker';
import { HeaderNav, ActiveTab } from './components/HeaderNav';
import { GeospatialRiskMap } from './components/GeospatialRiskMap';
import { Footer } from './components/Footer';
import { CorridorDiagnosticView } from './components/CorridorDiagnosticView';
import { UserAreaAndSearchCard } from './components/UserAreaAndSearchCard';
import { 
  EvacuationModal, 
  DroneReconModal, 
  SosEmergencyModal, 
  GpsDetectModal, 
  CustomLatLonModal,
  AssetProtocolModal 
} from './components/Modals';
import { 
  CORRIDORS_DATA, 
  INFRASTRUCTURE_ASSETS_DATA,
  STATES_SUSCEPTIBILITY_DATA,
  RAINFALL_RADAR_DATA,
  RELIEF_READINESS_DATA
} from './data/mockData';
import { CorridorData, InfrastructureAsset } from './types';
import { CheckCircle2, AlertTriangle, X } from 'lucide-react';
import { ProximityEmergencyAlertModal } from './components/ProximityEmergencyAlertModal';
import { OperationsDashboardDrawer } from './components/OperationsDashboardDrawer';
import { sendBrowserPushNotification } from './utils/proximityAlerts';

export default function App() {
  const [corridors, setCorridors] = useState<CorridorData[]>(CORRIDORS_DATA);
  const [selectedCorridor, setSelectedCorridor] = useState<CorridorData>(CORRIDORS_DATA[0]);
  const [activeTab, setActiveTab] = useState<ActiveTab>('gis');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [isOperationsDrawerOpen, setIsOperationsDrawerOpen] = useState<boolean>(false);

  // Rapid Danger Proximity Alert Modal
  const [isProximityAlertOpen, setIsProximityAlertOpen] = useState(false);
  const [alertCorridor, setAlertCorridor] = useState<CorridorData>(CORRIDORS_DATA[0]);
  const [alertDistanceKm, setAlertDistanceKm] = useState<number>(2.4);

  // Modals state
  const [isEvacuationOpen, setIsEvacuationOpen] = useState(false);
  const [isDroneOpen, setIsDroneOpen] = useState(false);
  const [isSosOpen, setIsSosOpen] = useState(false);
  const [isGpsOpen, setIsGpsOpen] = useState(false);
  const [isCustomLatLonOpen, setIsCustomLatLonOpen] = useState(false);
  const [selectedAssetForProtocol, setSelectedAssetForProtocol] = useState<InfrastructureAsset | null>(null);

  // Notifications / Toast
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'halt' | 'dispatch' | 'info' } | null>(null);

  const showToast = (text: string, type: 'halt' | 'dispatch' | 'info' = 'info') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 4500);
  };

  const handleTriggerProximityAlert = (corridor: CorridorData, distanceKm: number = 2.4) => {
    setAlertCorridor(corridor);
    setAlertDistanceKm(distanceKm);
    setIsProximityAlertOpen(true);
    sendBrowserPushNotification(
      `🚨 HIGH DANGER: Landslide Alert near ${corridor.shortName}`,
      `You are ${distanceKm} km from active slope sliding area! Slide chances are ${corridor.riskPercent}%. Move to safety!`
    );
  };

  const handleSelectCorridor = (corridor: CorridorData) => {
    setSelectedCorridor(corridor);
  };

  const handleIssueTrafficHalt = (corridor: CorridorData) => {
    showToast(`🚨 HIGHWAY TRAFFIC HALT ISSUED for ${corridor.name}. BRO & State Police Barricades Enforced.`, 'halt');
  };

  const handleDispatchSdrf = (corridor: CorridorData) => {
    showToast(`🚁 SDRF & NDRF Dispatched to ${corridor.shortName}. Rescue Boats & K9 Units Enroute.`, 'dispatch');
  };

  const handleAnalyzeCustomCoords = (lat: number, lon: number) => {
    // Find closest corridor or update selected
    let minD = Infinity;
    let closest = corridors[0];
    corridors.forEach(c => {
      const d = Math.hypot(c.lat - lat, c.lon - lon);
      if (d < minD) {
        minD = d;
        closest = c;
      }
    });

    const updated: CorridorData = {
      ...closest,
      lat,
      lon,
      name: `Custom Query Fix (${lat.toFixed(4)}°N, ${lon.toFixed(4)}°E)`,
      shortName: `Sector ${lat.toFixed(2)}N/${lon.toFixed(2)}E`,
    };
    setSelectedCorridor(updated);
    showToast(`Geotechnical Risk Computed for [${lat.toFixed(4)}° N, ${lon.toFixed(4)}° E]: ${closest.riskPercent}% Susceptibility`, 'info');
  };

  const handleSelectStateFromIndex = (stateName: string) => {
    const matched = corridors.find(c => c.state.toLowerCase().includes(stateName.toLowerCase()));
    if (matched) {
      setSelectedCorridor(matched);
      setActiveTab('diagnostic');
    } else {
      setActiveTab('state-index');
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-[#0b1120] text-slate-100' : 'bg-[#f1f5f9] text-slate-900'}`}>
      {/* Top Geohazard Notification Feed */}
      <TopTicker 
        corridors={corridors}
        onSelectCorridor={(c) => {
          setSelectedCorridor(c);
          if (activeTab !== 'gis' && activeTab !== 'diagnostic') setActiveTab('gis');
        }} 
      />

      {/* Main Header and Navigation Bar */}
      <HeaderNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenGpsModal={() => setIsGpsOpen(true)}
        onOpenSosModal={() => setIsSosOpen(true)}
        onOpenProximityAlert={() => handleTriggerProximityAlert(selectedCorridor, 2.4)}
        onOpenOperationsDrawer={() => setIsOperationsDrawerOpen(true)}
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
        nodeCount={542}
      />

      {/* Floating Action Toast Banner */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 max-w-md animate-bounce">
          <div className={`p-4 rounded-xl shadow-2xl border flex items-center justify-between gap-3 text-xs font-mono ${
            toastMessage.type === 'halt' 
              ? 'bg-red-950/95 border-red-500 text-red-100 shadow-red-950/50' 
              : toastMessage.type === 'dispatch'
              ? 'bg-emerald-950/95 border-emerald-500 text-emerald-100 shadow-emerald-950/50'
              : 'bg-cyan-950/95 border-cyan-500 text-cyan-100 shadow-cyan-950/50'
          }`}>
            <div className="flex items-center gap-2.5">
              {toastMessage.type === 'halt' ? (
                <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />
              ) : (
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              )}
              <span className="font-semibold">{toastMessage.text}</span>
            </div>
            <button 
              onClick={() => setToastMessage(null)}
              className="text-slate-400 hover:text-white p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-3 sm:px-6 pb-12 pt-3">
        {activeTab === 'gis' && (
          <div className="space-y-5">
            {/* 1. User Area Detection & All-India Search (No pre-filled examples) */}
            <UserAreaAndSearchCard
              corridors={corridors}
              onOpenShelterModal={() => setIsEvacuationOpen(true)}
              onOpenSosModal={() => setIsSosOpen(true)}
              onTriggerSosAlert={handleTriggerProximityAlert}
              isDarkMode={isDarkMode}
            />

            {/* 2. Whole India Geospatial Landslide Risk Map */}
            <div className="pt-2">
              <div className="mb-2 flex items-center justify-between">
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase font-mono tracking-wider flex items-center gap-2">
                  <span>Interactive India Geospatial Landslide Hazard Map</span>
                </h3>
                <span className="text-[11px] font-mono text-slate-500">Live Satellite &amp; IoT Grids</span>
              </div>
              <GeospatialRiskMap
                corridors={corridors}
                selectedCorridor={selectedCorridor}
                onSelectCorridor={handleSelectCorridor}
                onIssueTrafficHalt={handleIssueTrafficHalt}
                onLaunchDroneRecon={() => setIsDroneOpen(true)}
                isDarkMode={isDarkMode}
              />
            </div>
          </div>
        )}

        {activeTab === 'diagnostic' && (
          <CorridorDiagnosticView
            corridor={selectedCorridor}
            corridors={corridors}
            onSelectCorridor={handleSelectCorridor}
            onIssueTrafficHalt={handleIssueTrafficHalt}
            onLaunchDroneRecon={() => setIsDroneOpen(true)}
            isDarkMode={isDarkMode}
          />
        )}
      </main>

      {/* Official Joint Command Footer */}
      <Footer isDarkMode={isDarkMode} />

      {/* Modals */}
      <EvacuationModal
        isOpen={isEvacuationOpen}
        onClose={() => setIsEvacuationOpen(false)}
        corridor={selectedCorridor}
        isDarkMode={isDarkMode}
      />

      <DroneReconModal
        isOpen={isDroneOpen}
        onClose={() => setIsDroneOpen(false)}
        corridor={selectedCorridor}
        isDarkMode={isDarkMode}
      />

      <SosEmergencyModal
        isOpen={isSosOpen}
        onClose={() => setIsSosOpen(false)}
        corridor={selectedCorridor}
        isDarkMode={isDarkMode}
      />

      <GpsDetectModal
        isOpen={isGpsOpen}
        onClose={() => setIsGpsOpen(false)}
        onSelectNearestCorridor={(c) => {
          setSelectedCorridor(c);
          showToast(`Nearest sector synced: ${c.name}`, 'info');
        }}
        corridors={corridors}
        isDarkMode={isDarkMode}
      />

      <CustomLatLonModal
        isOpen={isCustomLatLonOpen}
        onClose={() => setIsCustomLatLonOpen(false)}
        onAnalyzeCoords={handleAnalyzeCustomCoords}
        isDarkMode={isDarkMode}
      />

      <AssetProtocolModal
        isOpen={selectedAssetForProtocol !== null}
        onClose={() => setSelectedAssetForProtocol(null)}
        asset={selectedAssetForProtocol}
        isDarkMode={isDarkMode}
      />

      {/* Rapid Danger Proximity Emergency Alert Modal with Audio Siren Alarm */}
      <ProximityEmergencyAlertModal
        isOpen={isProximityAlertOpen}
        onClose={() => setIsProximityAlertOpen(false)}
        corridor={alertCorridor}
        distanceKm={alertDistanceKm}
        onOpenEvacuation={() => {
          setIsProximityAlertOpen(false);
          setIsEvacuationOpen(true);
        }}
        isDarkMode={isDarkMode}
      />

      {/* Left-Side Operations Dashboard Drawer Menu */}
      <OperationsDashboardDrawer
        isOpen={isOperationsDrawerOpen}
        onClose={() => setIsOperationsDrawerOpen(false)}
        states={STATES_SUSCEPTIBILITY_DATA}
        assets={INFRASTRUCTURE_ASSETS_DATA}
        rainfallData={RAINFALL_RADAR_DATA}
        reliefData={RELIEF_READINESS_DATA}
        onSelectState={handleSelectStateFromIndex}
        onOpenAssetProtocol={(asset) => setSelectedAssetForProtocol(asset)}
        onOpenEvacuationModal={() => setIsEvacuationOpen(true)}
        isDarkMode={isDarkMode}
      />
    </div>
  );
}

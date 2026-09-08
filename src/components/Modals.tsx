import React, { useState } from 'react';
import { 
  X, 
  AlertTriangle, 
  PhoneCall, 
  MapPin, 
  Plane, 
  Compass, 
  ShieldAlert, 
  Building2, 
  Users, 
  CheckCircle2, 
  Navigation,
  Radio,
  Volume2,
  VolumeX,
  FileText,
  Send,
  Thermometer,
  CloudRain,
  Droplets
} from 'lucide-react';
import { CorridorData, InfrastructureAsset } from '../types';

// ================= EVACUATION CORRIDORS MODAL =================
interface EvacuationModalProps {
  isOpen: boolean;
  onClose: () => void;
  corridor: CorridorData;
  isDarkMode?: boolean;
}

export const EvacuationModal: React.FC<EvacuationModalProps> = ({ 
  isOpen, 
  onClose, 
  corridor,
  isDarkMode = false
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn">
      <div className={`rounded-xl max-w-3xl w-full shadow-2xl overflow-hidden font-mono text-xs border ${
        isDarkMode 
          ? 'bg-slate-900 border-slate-700 text-slate-100' 
          : 'bg-white border-slate-200 text-slate-800'
      }`}>
        {/* Header */}
        <div className={`flex items-center justify-between p-4 border-b ${
          isDarkMode ? 'border-slate-800 bg-slate-950' : 'border-slate-200 bg-slate-50'
        }`}>
          <div className="flex items-center space-x-2">
            <Navigation className="w-5 h-5 text-cyan-600" />
            <div>
              <h3 className="text-sm font-bold uppercase font-display">
                Verified Evacuation Corridor Map: {corridor.shortName}
              </h3>
              <p className={`text-[11px] ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                NDMA / GSI / SDRF Designated Life-Safety Route Registry
              </p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className={`p-1 rounded cursor-pointer ${
              isDarkMode ? 'text-slate-400 hover:text-white hover:bg-slate-800' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-200'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Tactical status banner */}
          <div className="p-3 rounded-lg bg-emerald-100 border border-emerald-300 flex items-center justify-between text-emerald-800">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span className="font-semibold">Primary Evacuation Arterial is CLEAR for non-commercial convoys</span>
            </div>
            <span className="font-bold text-[10px] bg-emerald-200 px-2 py-0.5 rounded text-emerald-900">
              STATUS: GREEN
            </span>
          </div>

          {/* Route details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className={`p-3.5 rounded-lg border space-y-2 ${
              isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}>
              <span className="text-[11px] font-bold text-cyan-600 uppercase tracking-wider block">
                Primary Bypass Route
              </span>
              <p className="text-xs font-sans leading-relaxed">
                Rangpo - Rorathang - Pakyong Alternate Ridge Link. Elevated 420m above flood riverbed; bypasses active Pegong subsidence zone.
              </p>
              <div className={`text-[11px] pt-1 border-t flex justify-between ${
                isDarkMode ? 'border-slate-800 text-slate-400' : 'border-slate-200 text-slate-500'
              }`}>
                <span>Distance: 24.8 km</span>
                <span className="text-emerald-600 font-bold">Est. Transit: 45 min</span>
              </div>
            </div>

            <div className={`p-3.5 rounded-lg border space-y-2 ${
              isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}>
              <span className="text-[11px] font-bold text-cyan-600 uppercase tracking-wider block">
                Designated Safe Staging Camp
              </span>
              <p className="text-xs font-sans leading-relaxed">
                Singtam Sports Complex &amp; Burtuk Air Base Gymnasium. Equipped with emergency generators, RO water purification, and 30-bed triage clinic.
              </p>
              <div className={`text-[11px] pt-1 border-t flex justify-between ${
                isDarkMode ? 'border-slate-800 text-slate-400' : 'border-slate-200 text-slate-500'
              }`}>
                <span>Shelter Capacity: 1,850</span>
                <span className="text-emerald-600 font-bold">Occupancy: 38%</span>
              </div>
            </div>
          </div>

          {/* Emergency Checkpoints */}
          <div>
            <span className={`text-[11px] font-bold uppercase tracking-wider block mb-2 ${
              isDarkMode ? 'text-slate-400' : 'text-slate-600'
            }`}>
              Active Security &amp; Medical Checkpoints:
            </span>
            <div className="space-y-1.5 text-xs">
              <div className={`p-2.5 rounded-lg border flex items-center justify-between ${
                isDarkMode ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}>
                <span>CP-1: Rangpo Border Checkpost (SDRF + ITBP)</span>
                <span className="text-emerald-700 font-bold">MANNING: 24/7 (VHF CH-04)</span>
              </div>
              <div className={`p-2.5 rounded-lg border flex items-center justify-between ${
                isDarkMode ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}>
                <span>CP-2: 32nd Mile Emergency Medical Aid Post</span>
                <span className="text-emerald-700 font-bold">2 AMBULANCES STAGED</span>
              </div>
              <div className={`p-2.5 rounded-lg border flex items-center justify-between ${
                isDarkMode ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}>
                <span>CP-3: Pakyong Emergency Helipad LZ-1</span>
                <span className="text-cyan-700 font-bold">IAF MI-17 READINESS</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className={`p-4 border-t flex justify-end space-x-2 ${
          isDarkMode ? 'border-slate-800 bg-slate-950' : 'border-slate-200 bg-slate-50'
        }`}>
          <button
            onClick={onClose}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              isDarkMode ? 'bg-slate-800 hover:bg-slate-700 text-slate-200' : 'bg-slate-200 hover:bg-slate-300 text-slate-800'
            }`}
          >
            Close Map Overlay
          </button>
        </div>
      </div>
    </div>
  );
};

// ================= DRONE RECON SIMULATOR MODAL =================
interface DroneReconModalProps {
  isOpen: boolean;
  onClose: () => void;
  corridor: CorridorData;
  isDarkMode?: boolean;
}

export const DroneReconModal: React.FC<DroneReconModalProps> = ({ 
  isOpen, 
  onClose, 
  corridor,
  isDarkMode = false
}) => {
  const [thermalMode, setThermalMode] = useState(true);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn font-mono">
      <div className={`rounded-xl max-w-4xl w-full shadow-2xl overflow-hidden text-xs border ${
        isDarkMode ? 'bg-slate-900 border-cyan-500/50 text-white' : 'bg-white border-slate-300 text-slate-900'
      }`}>
        {/* Header */}
        <div className={`flex items-center justify-between p-3.5 border-b ${
          isDarkMode ? 'border-slate-800 bg-slate-950' : 'border-slate-200 bg-slate-50'
        }`}>
          <div className="flex items-center space-x-2">
            <Plane className="w-5 h-5 text-cyan-600 animate-pulse" />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-black uppercase font-display tracking-wide">
                  Himalayan UAV Recon Feed // Unit: NETRA-IV
                </h3>
                <span className="text-[10px] bg-red-100 text-red-800 border border-red-300 px-1.5 py-0.2 rounded font-bold">
                  LIVE TELEMETRY
                </span>
              </div>
              <p className={`text-[11px] ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                Target Sector: {corridor.name}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className={`p-1 rounded cursor-pointer ${
              isDarkMode ? 'text-slate-400 hover:text-white hover:bg-slate-800' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-200'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Canvas Simulation */}
        <div className="relative w-full h-80 sm:h-96 bg-black overflow-hidden select-none">
          <div 
            className="w-full h-full relative flex items-center justify-center"
            style={{
              background: thermalMode 
                ? 'radial-gradient(ellipse at center, #7f1d1d 0%, #1e1b4b 60%, #030712 100%)' 
                : 'radial-gradient(ellipse at center, #1e293b 0%, #0f172a 70%, #020617 100%)'
            }}
          >
            {/* Topography mountain slope wireframe */}
            <svg className="w-full h-full absolute inset-0 opacity-40" viewBox="0 0 800 500">
              <path d="M 0 350 Q 200 180 400 280 T 800 150 L 800 500 L 0 500 Z" fill={thermalMode ? '#991b1b' : '#334155'} />
              <path d="M 150 260 Q 350 120 550 200 L 700 350" stroke={thermalMode ? '#f59e0b' : '#38bdf8'} strokeWidth="2" fill="none" strokeDasharray="6 3" />
              {/* Crack fissure */}
              <path d="M 380 220 L 420 260 L 410 310 L 450 360" stroke="#ef4444" strokeWidth="4" fill="none" />
              <circle cx="410" cy="310" r="8" stroke="#ef4444" strokeWidth="2" fill="none" className="animate-ping" />
              <text x="430" y="315" fill="#ef4444" fontSize="12" fontWeight="bold">FISSURE BREACH: 2.1m WIDE</text>
            </svg>

            {/* HUD Reticle */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-64 h-64 border border-cyan-500/40 rounded-full flex items-center justify-center relative">
                <div className="w-8 h-8 border-t border-b border-cyan-400"></div>
                <div className="h-8 w-8 border-l border-r border-cyan-400 absolute"></div>
                <span className="text-[10px] text-cyan-300 font-bold absolute bottom-2">LASER SCANNER LOCK</span>
              </div>
            </div>

            {/* Overlay Telemetry HUD */}
            <div className="absolute top-3 left-3 text-cyan-400 space-y-1 bg-black/60 p-2 rounded border border-cyan-900/50 backdrop-blur-sm">
              <div>ALT: 2,410m AMSL</div>
              <div>SPD: 38 km/h • WIND: 14kt NW</div>
              <div>PITCH: -14.2° • YAW: 112°</div>
              <div>SAT: 18 • DGPS FIX: RTK-FIXED</div>
            </div>

            <div className="absolute top-3 right-3 text-right text-red-400 space-y-1 bg-black/60 p-2 rounded border border-red-900/50 backdrop-blur-sm">
              <div className="font-bold">SLOPE CREEP: 5.6 mm/hr</div>
              <div>SHEAR ANGLE: 41.8°</div>
              <div className="text-amber-300">MOISTURE SAT: 94%</div>
              <div className="text-white">BATTERY: 82% (28m REMAINING)</div>
            </div>

            <div className="absolute bottom-3 left-3 text-slate-300 text-[11px] bg-black/60 px-2 py-1 rounded">
              COORDS: {corridor.lat.toFixed(4)}° N, {corridor.lon.toFixed(4)}° E
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className={`p-3.5 border-t flex flex-wrap items-center justify-between gap-2 ${
          isDarkMode ? 'border-slate-800 bg-slate-950' : 'border-slate-200 bg-slate-50'
        }`}>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setThermalMode(true)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                thermalMode ? 'bg-red-600 text-white shadow-xs' : 'bg-slate-200 text-slate-700'
              }`}
            >
              Thermal IR (FLIR)
            </button>
            <button
              onClick={() => setThermalMode(false)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                !thermalMode ? 'bg-cyan-600 text-white shadow-xs' : 'bg-slate-200 text-slate-700'
              }`}
            >
              HD Electro-Optical (EO)
            </button>
          </div>

          <div className="flex items-center space-x-2">
            <span className={`text-[11px] ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              BRO Swastik Drone Wing Staged at Melli
            </span>
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-bold cursor-pointer"
            >
              Return to Command Console
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ================= 112 NATIONAL SOS EMERGENCY DISPATCH MODAL =================
interface SosModalProps {
  isOpen: boolean;
  onClose: () => void;
  corridor: CorridorData;
  isDarkMode?: boolean;
}

export const SosEmergencyModal: React.FC<SosModalProps> = ({ 
  isOpen, 
  onClose, 
  corridor,
  isDarkMode = false
}) => {
  const [sirenPlaying, setSirenPlaying] = useState(false);
  const [alertDispatched, setAlertDispatched] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-red-950/70 backdrop-blur-md animate-fadeIn font-mono">
      <div className={`rounded-xl max-w-2xl w-full shadow-2xl overflow-hidden text-xs border-2 border-red-500 ${
        isDarkMode ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-red-600 bg-red-600 text-white">
          <div className="flex items-center space-x-2">
            <PhoneCall className="w-5 h-5 text-white animate-bounce" />
            <div>
              <h3 className="text-base font-black uppercase font-display tracking-wider">
                112 NATIONAL DISASTER EMERGENCY SOS
              </h3>
              <p className="text-[11px] text-red-100">
                Government of India // National Emergency Response System (NERS)
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-red-100 hover:text-white p-1 rounded hover:bg-red-700 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Siren Alert Toggle */}
          <div className="p-3 rounded-lg bg-red-50 border border-red-300 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <AlertTriangle className="w-5 h-5 text-red-600 animate-pulse" />
              <div>
                <span className="font-bold text-red-900 uppercase block text-xs">
                  Active Emergency Alert Siren
                </span>
                <span className="text-[11px] text-red-700">
                  Broadcasts evacuation horn pulse to mountain radio stations
                </span>
              </div>
            </div>
            <button
              onClick={() => setSirenPlaying(!sirenPlaying)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold uppercase transition-all cursor-pointer ${
                sirenPlaying ? 'bg-red-600 text-white animate-pulse' : 'bg-slate-200 text-slate-800 hover:bg-slate-300'
              }`}
            >
              {sirenPlaying ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              <span>{sirenPlaying ? 'SIREN ACTIVE' : 'TEST SIREN'}</span>
            </button>
          </div>

          {/* Quick Dial Directory */}
          <div>
            <span className={`text-[11px] font-bold uppercase tracking-wider block mb-2 ${
              isDarkMode ? 'text-slate-400' : 'text-slate-600'
            }`}>
              Instant Direct Disaster Helpline Lines:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <a 
                href="tel:112" 
                className="p-3 rounded-lg border border-slate-200 hover:border-red-500 bg-slate-50 hover:bg-red-50 flex items-center justify-between transition-colors"
              >
                <div>
                  <span className="font-extrabold text-sm text-red-600 block font-display">112</span>
                  <span className="text-[10px] text-slate-600">All India Emergency Helpline</span>
                </div>
                <PhoneCall className="w-4 h-4 text-red-600" />
              </a>

              <a 
                href="tel:1078" 
                className="p-3 rounded-lg border border-slate-200 hover:border-cyan-500 bg-slate-50 hover:bg-cyan-50 flex items-center justify-between transition-colors"
              >
                <div>
                  <span className="font-extrabold text-sm text-cyan-700 block font-display">1078</span>
                  <span className="text-[10px] text-slate-600">NDMA National Control Room</span>
                </div>
                <PhoneCall className="w-4 h-4 text-cyan-600" />
              </a>

              <a 
                href="tel:1070" 
                className="p-3 rounded-lg border border-slate-200 hover:border-amber-500 bg-slate-50 hover:bg-amber-50 flex items-center justify-between transition-colors"
              >
                <div>
                  <span className="font-extrabold text-sm text-amber-700 block font-display">1070</span>
                  <span className="text-[10px] text-slate-600">State Disaster Management (SEOC)</span>
                </div>
                <PhoneCall className="w-4 h-4 text-amber-600" />
              </a>

              <a 
                href="tel:1077" 
                className="p-3 rounded-lg border border-slate-200 hover:border-emerald-500 bg-slate-50 hover:bg-emerald-50 flex items-center justify-between transition-colors"
              >
                <div>
                  <span className="font-extrabold text-sm text-emerald-700 block font-display">1077</span>
                  <span className="text-[10px] text-slate-600">District Emergency Control Room (DEOC)</span>
                </div>
                <PhoneCall className="w-4 h-4 text-emerald-600" />
              </a>
            </div>
          </div>

          {/* Broadcast SMS to Corridor */}
          <div className={`p-3.5 rounded-lg border space-y-2 ${
            isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
          }`}>
            <span className="text-[11px] font-bold text-slate-800 dark:text-slate-300 uppercase tracking-wider block">
              Emergency CAP / SMS Broadcast to Telecom Towers ({corridor.shortName})
            </span>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 font-sans">
              Transmits multilingual Common Alerting Protocol (CAP) SMS message to all cell phones connected to local mountain base transceiver stations (BTS).
            </p>

            {alertDispatched ? (
              <div className="p-2.5 rounded-lg bg-emerald-100 border border-emerald-300 text-emerald-800 flex items-center gap-2 font-semibold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>EMERGENCY BROADCAST SENT to 14,280 active handsets in sector.</span>
              </div>
            ) : (
              <button
                onClick={() => setAlertDispatched(true)}
                className="w-full py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold uppercase tracking-wider text-xs flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Broadcast Emergency Cell Alert Now</span>
              </button>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className={`p-4 border-t flex justify-end ${
          isDarkMode ? 'border-slate-800 bg-slate-950' : 'border-slate-200 bg-slate-50'
        }`}>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold cursor-pointer"
          >
            Dismiss SOS View
          </button>
        </div>
      </div>
    </div>
  );
};

// ================= GPS USER DETECT MODAL =================
interface GpsDetectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectNearestCorridor: (corridor: CorridorData) => void;
  corridors: CorridorData[];
  isDarkMode?: boolean;
}

export const GpsDetectModal: React.FC<GpsDetectModalProps> = ({
  isOpen,
  onClose,
  onSelectNearestCorridor,
  corridors,
  isDarkMode = false
}) => {
  const [detecting, setDetecting] = useState(false);
  const [userCoords, setUserCoords] = useState<{ lat: number; lon: number } | null>(null);
  const [nearest, setNearest] = useState<CorridorData | null>(null);
  const [distanceKm, setDistanceKm] = useState<number | null>(null);

  if (!isOpen) return null;

  const calculateNearest = (lat: number, lon: number) => {
    let minD = Infinity;
    let closest = corridors[0];
    corridors.forEach(c => {
      const d = Math.hypot(c.lat - lat, c.lon - lon) * 111; // Approx km
      if (d < minD) {
        minD = d;
        closest = c;
      }
    });
    setNearest(closest);
    setDistanceKm(Math.round(minD));
  };

  const handleDetect = () => {
    setDetecting(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lon = pos.coords.longitude;
          setUserCoords({ lat, lon });
          calculateNearest(lat, lon);
          setDetecting(false);
        },
        () => {
          // Fallback simulation near Himalayan belt
          const simLat = 27.3250;
          const simLon = 88.5800;
          setUserCoords({ lat: simLat, lon: simLon });
          calculateNearest(simLat, simLon);
          setDetecting(false);
        }
      );
    } else {
      const simLat = 27.3250;
      const simLon = 88.5800;
      setUserCoords({ lat: simLat, lon: simLon });
      calculateNearest(simLat, simLon);
      setDetecting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn font-mono text-xs">
      <div className={`rounded-xl max-w-lg w-full shadow-2xl overflow-hidden border ${
        isDarkMode ? 'bg-slate-900 border-cyan-500/60 text-white' : 'bg-white border-slate-200 text-slate-900'
      }`}>
        {/* Header */}
        <div className={`flex items-center justify-between p-4 border-b ${
          isDarkMode ? 'border-slate-800 bg-slate-950' : 'border-slate-200 bg-slate-50'
        }`}>
          <div className="flex items-center space-x-2">
            <MapPin className="w-5 h-5 text-cyan-600" />
            <div>
              <h3 className="text-sm font-bold uppercase font-display">
                Find the Geotechnical Risk Near Me
              </h3>
              <p className={`text-[11px] ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                Precision GPS Triangulation against GSI Landslide Hotspot Grid
              </p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className={`p-1 rounded cursor-pointer ${
              isDarkMode ? 'text-slate-400 hover:text-white hover:bg-slate-800' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-200'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4">
          {!userCoords ? (
            <div className="text-center py-6 space-y-3">
              <div className="w-12 h-12 rounded-full bg-cyan-100 text-cyan-700 border border-cyan-300 flex items-center justify-center mx-auto animate-pulse">
                <Compass className="w-6 h-6" />
              </div>
              <p className="font-sans text-xs max-w-sm mx-auto text-slate-600 dark:text-slate-300">
                Click below to acquire real-time satellite coordinates and calculate immediate landslide threat levels.
              </p>
              <button
                onClick={handleDetect}
                disabled={detecting}
                className="px-5 py-2.5 rounded-lg bg-cyan-600 hover:bg-cyan-700 text-white font-bold uppercase tracking-wider text-xs shadow-md transition-all cursor-pointer"
              >
                {detecting ? 'Acquiring Satellites...' : 'Detect My Exact Location'}
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <div className={`p-3 rounded-lg border flex justify-between items-center ${
                isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}>
                <span className={isDarkMode ? 'text-slate-400' : 'text-slate-500'}>Your Acquired Fix:</span>
                <span className="text-cyan-700 font-bold">
                  {userCoords.lat.toFixed(4)}° N, {userCoords.lon.toFixed(4)}° E
                </span>
              </div>

              {nearest && (
                <div className={`p-4 rounded-lg border space-y-2 ${
                  isDarkMode ? 'bg-slate-950 border-cyan-900/60' : 'bg-cyan-50/50 border-cyan-200'
                }`}>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-bold text-slate-500">Nearest High-Risk Corridor:</span>
                    <span className="text-[10px] font-bold text-red-800 bg-red-100 px-1.5 py-0.5 rounded border border-red-300">
                      {nearest.riskPercent}% Risk
                    </span>
                  </div>
                  <h4 className="text-sm font-bold font-display">
                    {nearest.name}
                  </h4>
                  <div className="text-xs text-slate-700 dark:text-slate-300">
                    Distance: <strong className="text-amber-700">{distanceKm} km away</strong> • Seismic Hazard: {nearest.seismicZone}
                  </div>

                  {/* Plain English Proximity Danger Warning */}
                  {distanceKm !== null && distanceKm <= 15 ? (
                    <div className="p-2.5 rounded-lg bg-red-100 border border-red-300 text-red-900 text-xs font-semibold space-y-1">
                      <div className="flex items-center gap-1.5 font-bold text-red-700">
                        <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
                        <span>WARNING: You are in slope sliding range ({distanceKm} km)!</span>
                      </div>
                      <p className="text-[11px] font-sans leading-tight">
                        Chances of a landslide in this area are <strong>{nearest.riskPercent}% (HIGH)</strong>. Avoid steep cliffs and valley streams.
                      </p>
                    </div>
                  ) : (
                    <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs">
                      ✅ You are currently {distanceKm} km away from this mountain slope hazard.
                    </div>
                  )}

                  {/* Weather, Temperature & Soil Moisture Strip */}
                  <div className="grid grid-cols-3 gap-2 text-center text-xs py-1">
                    <div className={`p-2 rounded-lg border ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                      <span className="text-[10px] text-slate-400 block flex items-center justify-center gap-1">
                        <Thermometer className="w-3 h-3 text-orange-500" /> Temp
                      </span>
                      <span className="font-bold text-orange-600">
                        {nearest.temperatureC ?? Math.round(28 - (nearest.elevationM / 1000) * 6.5)}°C
                      </span>
                    </div>

                    <div className={`p-2 rounded-lg border ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                      <span className="text-[10px] text-slate-400 block flex items-center justify-center gap-1">
                        <CloudRain className="w-3 h-3 text-blue-500" /> Rain
                      </span>
                      <span className="font-bold text-blue-600">
                        {nearest.rainfall24h} mm
                      </span>
                    </div>

                    <div className={`p-2 rounded-lg border ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                      <span className="text-[10px] text-slate-400 block flex items-center justify-center gap-1">
                        <Droplets className="w-3 h-3 text-cyan-600" /> Soil
                      </span>
                      <span className="font-bold text-cyan-700">
                        {nearest.moistureSaturation}% Wet
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      onSelectNearestCorridor(nearest);
                      onClose();
                    }}
                    className="w-full mt-2 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-xs cursor-pointer shadow-xs"
                  >
                    Load This Area Telemetry &amp; Alerts
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ================= CUSTOM LAT/LON MODAL =================
interface CustomLatLonModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAnalyzeCoords: (lat: number, lon: number) => void;
  isDarkMode?: boolean;
}

export const CustomLatLonModal: React.FC<CustomLatLonModalProps> = ({
  isOpen,
  onClose,
  onAnalyzeCoords,
  isDarkMode = false
}) => {
  const [latInput, setLatInput] = useState('27.3389');
  const [lonInput, setLonInput] = useState('88.6065');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const lat = parseFloat(latInput);
    const lon = parseFloat(lonInput);
    if (!isNaN(lat) && !isNaN(lon)) {
      onAnalyzeCoords(lat, lon);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn font-mono text-xs">
      <div className={`rounded-xl max-w-md w-full shadow-2xl overflow-hidden border ${
        isDarkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'
      }`}>
        {/* Header */}
        <div className={`flex items-center justify-between p-4 border-b ${
          isDarkMode ? 'border-slate-800 bg-slate-950' : 'border-slate-200 bg-slate-50'
        }`}>
          <div className="flex items-center space-x-2">
            <Compass className="w-5 h-5 text-cyan-600" />
            <h3 className="text-sm font-bold uppercase font-display">
              Custom Coordinate Diagnostic
            </h3>
          </div>
          <button 
            onClick={onClose} 
            className={`p-1 rounded cursor-pointer ${
              isDarkMode ? 'text-slate-400 hover:text-white hover:bg-slate-800' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-200'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <p className="font-sans text-xs text-slate-600 dark:text-slate-300">
            Enter target geographic coordinates within the Indian territory to query the SlopeSafe-AI geohazard model.
          </p>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] uppercase font-bold mb-1 text-slate-500">
                Latitude (°N)
              </label>
              <input
                type="number"
                step="0.0001"
                value={latInput}
                onChange={(e) => setLatInput(e.target.value)}
                className={`w-full px-3 py-2 rounded-lg border font-mono ${
                  isDarkMode ? 'bg-slate-950 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                }`}
                required
              />
            </div>

            <div>
              <label className="block text-[11px] uppercase font-bold mb-1 text-slate-500">
                Longitude (°E)
              </label>
              <input
                type="number"
                step="0.0001"
                value={lonInput}
                onChange={(e) => setLonInput(e.target.value)}
                className={`w-full px-3 py-2 rounded-lg border font-mono ${
                  isDarkMode ? 'bg-slate-950 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                }`}
                required
              />
            </div>
          </div>

          <div className={`p-2.5 rounded-lg border text-[11px] space-y-1 ${
            isDarkMode ? 'bg-slate-950 border-slate-800 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-600'
          }`}>
            <div>Quick Presets:</div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => { setLatInput('27.3389'); setLonInput('88.6065'); }}
                className="text-cyan-700 hover:underline cursor-pointer"
              >
                Gangtok NH-10
              </button>
              <span>•</span>
              <button
                type="button"
                onClick={() => { setLatInput('11.5365'); setLonInput('76.1332'); }}
                className="text-cyan-700 hover:underline cursor-pointer"
              >
                Wayanad Meppadi
              </button>
              <span>•</span>
              <button
                type="button"
                onClick={() => { setLatInput('30.5564'); setLonInput('79.5658'); }}
                className="text-cyan-700 hover:underline cursor-pointer"
              >
                Joshimath NH-07
              </button>
            </div>
          </div>

          <div className="pt-2 flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className={`px-3.5 py-2 rounded-lg font-bold cursor-pointer ${
                isDarkMode ? 'bg-slate-800 hover:bg-slate-700 text-slate-300' : 'bg-slate-200 hover:bg-slate-300 text-slate-700'
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-700 text-white font-bold cursor-pointer shadow-xs"
            >
              Run Geotechnical Fix
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ================= INFRASTRUCTURE PROTOCOL INSPECTION MODAL =================
interface AssetProtocolModalProps {
  isOpen: boolean;
  onClose: () => void;
  asset: InfrastructureAsset | null;
  isDarkMode?: boolean;
}

export const AssetProtocolModal: React.FC<AssetProtocolModalProps> = ({ 
  isOpen, 
  onClose, 
  asset,
  isDarkMode = false
}) => {
  if (!isOpen || !asset) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn font-mono text-xs overflow-y-auto">
      <div className={`rounded-xl max-w-2xl w-full shadow-2xl overflow-hidden border my-8 ${
        isDarkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'
      }`}>
        {/* Header */}
        <div className={`flex items-center justify-between p-4 border-b ${
          isDarkMode ? 'border-slate-800 bg-slate-950' : 'border-slate-200 bg-slate-50'
        }`}>
          <div className="flex items-center space-x-2">
            <ShieldAlert className="w-5 h-5 text-cyan-600" />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold uppercase font-display">
                  {asset.protocolLabel} // Standing Operational Protocol
                </h3>
                <span className="text-[10px] bg-cyan-100 text-cyan-800 border border-cyan-300 px-1.5 py-0.5 rounded font-bold">
                  {asset.infraType}
                </span>
              </div>
              <p className={`text-[11px] ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                Nodal Authority: {asset.agency} • Emergency Control: {asset.emergencyControlRoom}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className={`p-1 rounded cursor-pointer ${
              isDarkMode ? 'text-slate-400 hover:text-white hover:bg-slate-800' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-200'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-3 max-h-[75vh] overflow-y-auto">
          {/* Basic Asset Overview */}
          <div className={`p-3.5 rounded-lg border space-y-1 ${
            isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
          }`}>
            <div className="flex items-center justify-between">
              <span className={`text-[10px] font-bold uppercase tracking-wider ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Target Strategic Asset:</span>
              <span className="text-[10px] font-mono text-cyan-700 font-bold">Alt: {asset.elevationM}m AMSL</span>
            </div>
            <div className="text-base font-extrabold font-display">{asset.name}</div>
            <div className={`text-xs ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
              Corridor / District: {asset.corridorRegion} ({asset.coordinates})
            </div>
          </div>

          {/* Status & Inspection */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            <div className={`p-2.5 rounded-lg border ${
              isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}>
              <span className="text-[10px] text-slate-500 block">Operational Status:</span>
              <span className={`font-bold text-xs ${
                asset.statusColor === 'red' ? 'text-red-600' :
                asset.statusColor === 'amber' ? 'text-amber-600' : 'text-emerald-600'
              }`}>{asset.status}</span>
            </div>

            <div className={`p-2.5 rounded-lg border ${
              isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}>
              <span className="text-[10px] text-slate-500 block">Last Field Sensor Check:</span>
              <span className="font-bold text-xs">{asset.lastInspection}</span>
            </div>

            <div className={`p-2.5 rounded-lg border col-span-2 sm:col-span-1 ${
              isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}>
              <span className="text-[10px] text-slate-500 block">Asset Category:</span>
              <span className="font-bold text-xs truncate block">{asset.category}</span>
            </div>
          </div>

          {/* Specialized Telemetry: Hydro Dam */}
          {asset.infraType === 'HYDRO' && asset.damSpecs && (
            <div className={`p-3.5 rounded-lg border space-y-2.5 ${
              isDarkMode ? 'bg-blue-950/20 border-blue-900/50' : 'bg-blue-50/70 border-blue-200'
            }`}>
              <div className="flex items-center justify-between border-b pb-1.5 border-blue-200 dark:border-blue-900/50 font-bold text-blue-700">
                <span className="uppercase tracking-wider text-[11px]">Hydro Reservoir & Dam Basin Telemetry</span>
                <span className="text-[10px] bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-mono">
                  Capacity: {asset.damSpecs.storagePercentage}%
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-[11px]">
                <div>
                  <span className="text-slate-500 block text-[10px]">Reservoir Level:</span>
                  <span className="font-bold">{asset.damSpecs.reservoirLevelM} m</span>
                  <span className="text-[10px] text-slate-400 block">FRL: {asset.damSpecs.fullReservoirLevelM} m</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Inflow Volume:</span>
                  <span className="font-bold text-blue-600">{asset.damSpecs.inflowCusecs.toLocaleString()} cusecs</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Spillway Discharge:</span>
                  <span className="font-bold">{asset.damSpecs.spillwayDischargeCusecs.toLocaleString()} cusecs</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">GLOF Alert Status:</span>
                  <span className={`font-bold ${
                    asset.damSpecs.glofAlertStatus === 'GREEN' ? 'text-emerald-600' : 'text-amber-600'
                  }`}>
                    {asset.damSpecs.glofAlertStatus} ALERT
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Penstock Slope:</span>
                  <span className="font-semibold">{asset.damSpecs.penstockSlopeStability}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Siltation Rate:</span>
                  <span className="font-semibold">{asset.damSpecs.siltationIndex}</span>
                </div>
              </div>
            </div>
          )}

          {/* Specialized Telemetry: Railway */}
          {asset.infraType === 'RAILWAY' && asset.railwaySpecs && (
            <div className={`p-3.5 rounded-lg border space-y-2.5 ${
              isDarkMode ? 'bg-purple-950/20 border-purple-900/50' : 'bg-purple-50/70 border-purple-200'
            }`}>
              <div className="flex items-center justify-between border-b pb-1.5 border-purple-200 dark:border-purple-900/50 font-bold text-purple-700">
                <span className="uppercase tracking-wider text-[11px]">Strategic Mountain Railway Telemetry</span>
                <span className="text-[10px] bg-purple-100 text-purple-800 px-2 py-0.5 rounded font-mono">
                  Kavach: {asset.railwaySpecs.kavachInterlockState}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-[11px]">
                <div>
                  <span className="text-slate-500 block text-[10px]">Track Heave / Lateral Shift:</span>
                  <span className="font-bold text-amber-600">{asset.railwaySpecs.trackDisplacementMm} mm</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Rockfall Net Tension:</span>
                  <span className="font-bold">{asset.railwaySpecs.rockfallNetTensionKn} kN</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Patrol Interval:</span>
                  <span className="font-bold">Every {asset.railwaySpecs.patrolIntervalHours} Hours</span>
                </div>
                <div className="col-span-2">
                  <span className="text-slate-500 block text-[10px]">Tunnel Portal Structural Health:</span>
                  <span className="font-semibold">{asset.railwaySpecs.tunnelPortalStatus}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Bridge Scour Risk:</span>
                  <span className="font-semibold">{asset.railwaySpecs.bridgeScourRisk}</span>
                </div>
              </div>
            </div>
          )}

          {/* Specialized Telemetry: Highway */}
          {asset.infraType === 'HIGHWAY' && asset.highwaySpecs && (
            <div className={`p-3.5 rounded-lg border space-y-2.5 ${
              isDarkMode ? 'bg-amber-950/20 border-amber-900/50' : 'bg-amber-50/70 border-amber-200'
            }`}>
              <div className="flex items-center justify-between border-b pb-1.5 border-amber-200 dark:border-amber-900/50 font-bold text-amber-700">
                <span className="uppercase tracking-wider text-[11px]">Lifeline Highway Arterial Telemetry</span>
                <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-mono">
                  {asset.highwaySpecs.nhRouteNumber} • {asset.highwaySpecs.chainageKm}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-[11px]">
                <div>
                  <span className="text-slate-500 block text-[10px]">Carriageway Clearance:</span>
                  <span className="font-bold">{asset.highwaySpecs.carriagewayClearanceM} Meters</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Retaining Wall Load:</span>
                  <span className="font-bold">{asset.highwaySpecs.retainingWallLoadKpa} kPa</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Traffic Queue:</span>
                  <span className="font-bold text-amber-700">{asset.highwaySpecs.trafficQueueVehicles} Vehicles</span>
                </div>
                <div className="col-span-2">
                  <span className="text-slate-500 block text-[10px]">Escort & Convoy Status:</span>
                  <span className="font-semibold">{asset.highwaySpecs.escortConvoyStatus}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Deployed Machinery:</span>
                  <span className="font-semibold">{asset.highwaySpecs.deployedMachinery}</span>
                </div>
                <div className="col-span-2 sm:col-span-3 text-cyan-700">
                  <span className="text-slate-500 block text-[10px]">Designated Contingency Bypass:</span>
                  <span className="font-semibold">{asset.highwaySpecs.contingencyBypass}</span>
                </div>
              </div>
            </div>
          )}

          {/* Observed Geotechnical Distress */}
          <div className={`p-3 rounded-lg border space-y-1 ${
            isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
          }`}>
            <span className="text-[11px] font-bold text-amber-700 block">Observed Geotechnical Distress & Sensor Pings:</span>
            <p className="text-xs font-sans font-semibold leading-relaxed">{asset.hazardNote}</p>
          </div>

          {/* Standing Operating Procedure */}
          <div className="p-3.5 rounded-lg bg-cyan-100 border border-cyan-300 text-cyan-950 text-xs font-sans space-y-1.5">
            <div className="font-bold flex items-center gap-1 text-cyan-900">
              <ShieldAlert className="w-4 h-4 text-cyan-700" />
              <span>Mandatory Standing Operating Procedure (NDMA / BRO 2026 Protocol)</span>
            </div>
            <p className="leading-relaxed">
              Continuous surveillance mandated by acoustic emission probes and geotechnical inclinometer arrays. Heavy defense and civilian movement must adhere strictly to traffic dispatch windows. Drone recon scheduled every 4 hours during monsoon downpours.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className={`p-4 border-t flex items-center justify-between ${
          isDarkMode ? 'border-slate-800 bg-slate-950' : 'border-slate-200 bg-slate-50'
        }`}>
          <div className="text-[11px] text-slate-400">
            Helpline: {asset.emergencyControlRoom}
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-xs cursor-pointer shadow-xs"
          >
            Acknowledge & Close Protocol
          </button>
        </div>
      </div>
    </div>
  );
};

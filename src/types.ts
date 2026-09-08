export type RiskLevel = 'Critical' | 'Severe' | 'Elevated' | 'Monitored' | 'Watch';

export interface CorridorData {
  id: string;
  name: string;
  shortName: string;
  state: string;
  district: string;
  region: 'Himalayan Arc' | 'Western Ghats' | 'Northeast Hills' | 'Eastern Ghats' | 'Central & Aravalli';
  mountainRange: string;
  elevationM: number;
  riskLevel: RiskLevel;
  riskPercent: number;
  lat: number;
  lon: number;
  fos: number; // Factor of Safety
  failureWindow: string;
  displacementCreep: string;
  moistureSaturation: number;
  rainfall24h: number;
  rainfallThreshold: number;
  porePressure: number;
  porePressureBorehole: string;
  anchorStrainAlert: string;
  advisory: string;
  seismicZone: string;
  faultLine: string;
  lithology: string;
  slopeAngle: string;
  evacuationRoute: string;
  nearestSdrfBase: string;
  emergencyHelpline: string;
  iotNodeCount: number;
  activeSensors: string[];
  temperatureC?: number;
  weatherCondition?: string;
  simpleRiskVerdict?: string;
  simpleSoilDescription?: string;
  simpleWhatToDo?: string[];
}

export interface StateSusceptibility {
  rank: number;
  state: string;
  isUT?: boolean;
  pronePercentage: number;
  riskCategory: 'CRITICAL' | 'SEVERE' | 'HIGHEST OUTSIDE HIMALAYAS' | 'ELEVATED' | 'MONITORED';
  geologicalDescription: string;
  totalAreaSqKm: number;
  highRiskAreaSqKm: number;
  primaryActiveSensors: number;
  ndrfBattalion: string;
}

export interface InfrastructureAsset {
  id: string;
  name: string;
  corridorRegion: string;
  category: string;
  infraType: 'HYDRO' | 'RAILWAY' | 'HIGHWAY';
  hazardNote: string;
  status: 'TRAFFIC HALTED' | 'CONVOY CONTROLLED' | 'SPEED RESTRICTED 20KMPH' | 'ALL GATES NOMINAL' | 'NORMAL COMMUTE' | 'SPILLWAY ALERT' | 'LINE BLOCKED';
  statusColor: 'red' | 'amber' | 'green' | 'blue';
  protocolLabel: string;
  agency: string;
  lastInspection: string;
  coordinates: string;
  elevationM: number;
  emergencyControlRoom: string;
  actionChecklist: string[];
  damSpecs?: {
    reservoirLevelM: number;
    fullReservoirLevelM: number;
    storagePercentage: number;
    inflowCusecs: number;
    spillwayDischargeCusecs: number;
    siltationIndex: string;
    glofAlertStatus: 'GREEN' | 'YELLOW' | 'RED';
    penstockSlopeStability: string;
    powerhouseTunnelStatus: string;
  };
  railwaySpecs?: {
    railSection: string;
    gauge: string;
    trackDisplacementMm: number;
    tunnelPortalStatus: string;
    rockfallNetTensionKn: number;
    kavachInterlockState: 'ARMED & NORMAL' | 'SPEED CAPPED' | 'EMERGENCY BRAKE ENGAGED';
    patrolIntervalHours: number;
    bridgeScourRisk: string;
  };
  highwaySpecs?: {
    nhRouteNumber: string;
    chainageKm: string;
    carriagewayClearanceM: number;
    retainingWallLoadKpa: number;
    trafficQueueVehicles: number;
    escortConvoyStatus: string;
    contingencyBypass: string;
    deployedMachinery: string;
  };
}

export interface LayerToggleState {
  insarNisar: boolean;
  rainfallIsohyets: boolean;
  faultLines: boolean;
  iotSensors: boolean;
  evacuationCorridors: boolean;
}

export interface RainfallRadarData {
  cumulative72h: number;
  subsurfaceLiquefaction: number;
  next48hForecast: number;
  corridorStatuses: {
    corridor: string;
    threshold: number;
    current: number;
    status: 'BREACHED' | 'NEAR THRESHOLD' | 'NORMAL';
    percentageOver: number;
  }[];
}

export interface ReliefReadinessData {
  activeCenters: number;
  centerLocations: string;
  bedCapacityAvail: string;
  helipadReadiness: string;
  helipadLocations: string;
  iafAlertStatus: string;
  ndrfPersonnel: number;
  ndrfBattalions: string;
  equipmentReady: string;
}

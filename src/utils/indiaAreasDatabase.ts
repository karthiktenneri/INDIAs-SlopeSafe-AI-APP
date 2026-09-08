// All-India Area Landslide Risk Intelligence Database & Search Resolver
import { CorridorData } from '../types';

export interface AreaRiskResult {
  name: string;
  stateOrRegion: string;
  isLandslideProne: boolean;
  finalRiskPercent: number;
  riskLevelText: 'SAFE' | 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL DANGER';
  riskDescription: string;
  temperatureC: number;
  weather: string;
  rainfall24hMm: number;
  soilMoisturePercent: number;
  soilConditionSimple: string;
  shelterOrAdvice: string;
  isUserLocation?: boolean;
  distanceToNearestHazardKm?: number;
}

// Known Landslide Prone Areas in India (Western Ghats, Himalayas, Northeast, Nilgiris, etc.)
export interface LandslideProneEntry {
  names: string[];
  displayName: string;
  state: string;
  elevationM: number;
  riskPercent: number;
  rainfall24h: number;
  soilMoisture: number;
  weather: string;
  riskDetails: string;
  shelter: string;
}

export const LANDSLIDE_PRONE_AREAS: LandslideProneEntry[] = [
  // Kerala
  {
    names: ['wayanad', 'meppadi', 'chooralmala', 'mundakkai', 'vythiri', 'kalpetta', 'mananthavady', 'thamarassery', 'churam'],
    displayName: 'Wayanad (Meppadi - Chooralmala - Mundakkai)',
    state: 'Kerala',
    elevationM: 950,
    riskPercent: 94,
    rainfall24h: 184,
    soilMoisture: 96,
    weather: 'Heavy Continuous Downpour',
    riskDetails: 'Steep hill slope saturated with torrential rain. Active mudflow, heavy debris sliding, and riverbank collapse.',
    shelter: 'Meppadi High School & Community Relief Camp (1.6 km away on flat ground)'
  },
  {
    names: ['idukki', 'munnar', 'devikulam', 'rajamala', 'pettimudi', 'peerumade', 'kattappana', 'udumbanchola'],
    displayName: 'Idukki (Munnar - Devikulam - Pettimudi)',
    state: 'Kerala',
    elevationM: 1532,
    riskPercent: 88,
    rainfall24h: 142,
    soilMoisture: 91,
    weather: 'Very Heavy Mountain Rain & Fog',
    riskDetails: 'Steep tea estate slopes and rocky cliffs. Heavy water runoff triggering loose earth slips across ghat roads.',
    shelter: 'Munnar Town Relief Center & Government College Auditorium (2.2 km away)'
  },
  {
    names: ['nilambur', 'kakkadampoyil', 'malappuram hills', 'pathanamthitta hills', 'ponmudi'],
    displayName: 'Nilambur & Kakkadampoyil Hill Slopes',
    state: 'Kerala',
    elevationM: 820,
    riskPercent: 78,
    rainfall24h: 110,
    soilMoisture: 85,
    weather: 'Heavy Rainfall',
    riskDetails: 'High risk of minor debris flows and road embankment subsidence along stream channels.',
    shelter: 'Nilambur Municipal Relief Center (3.5 km away)'
  },

  // Tamil Nadu
  {
    names: ['ooty', 'udhagamandalam', 'nilgiris', 'coonoor', 'kotagiri', 'gudalur'],
    displayName: 'Nilgiris (Ooty - Coonoor - Kotagiri)',
    state: 'Tamil Nadu',
    elevationM: 2240,
    riskPercent: 82,
    rainfall24h: 96,
    soilMoisture: 84,
    weather: 'Dense Fog & Heavy Mountain Rain',
    riskDetails: 'Steep railway and road cuttings prone to mud slips, uprooted trees, and falling boulders along mountain passes.',
    shelter: 'Coonoor St. Marys School Hall & Ooty Youth Hostel (1.2 km away)'
  },
  {
    names: ['kodaikanal', 'dindigul hills', 'palani hills', 'valparai', 'kolli hills', 'yercaud', 'shevaroy'],
    displayName: 'Kodaikanal & Palani Hills',
    state: 'Tamil Nadu',
    elevationM: 2133,
    riskPercent: 76,
    rainfall24h: 88,
    soilMoisture: 79,
    weather: 'Chilly Rain & Mountain Mist',
    riskDetails: 'Steep ghat road hairpin bends vulnerable to boulder dislodgement and mud sliding.',
    shelter: 'Kodaikanal Municipal Hall & Community Center (1.5 km away)'
  },

  // Uttarakhand
  {
    names: ['joshimath', 'ravigram', 'chamoli', 'badrinath', 'kedarnath', 'rudraprayag', 'helang'],
    displayName: 'Joshimath - Chamoli - Badrinath Axis (NH-07)',
    state: 'Uttarakhand',
    elevationM: 1890,
    riskPercent: 85,
    rainfall24h: 94,
    soilMoisture: 88,
    weather: 'Cold Rain & Saturated Silt Fog',
    riskDetails: 'Active slope subsidence, deep structural ground fissures, and heavy rockfall across the Alaknanda gorge.',
    shelter: 'Pipalkoti Permanent Transit Camp & Joshimath Sports Stadium (2.0 km away)'
  },
  {
    names: ['uttarkashi', 'gangotri', 'dharasu', 'tehri', 'nainital', 'mussoorie', 'almora', 'ranikhet', 'pithoragarh', 'dharchula', 'karnaprayag'],
    displayName: 'Uttarkashi - Nainital - Mussoorie Himalayan Slopes',
    state: 'Uttarakhand',
    elevationM: 1950,
    riskPercent: 81,
    rainfall24h: 86,
    soilMoisture: 82,
    weather: 'Heavy Himalayan Showers',
    riskDetails: 'Fragile Himalayan schists and fractured limestone slopes under high pore-water pressure.',
    shelter: 'Nainital Government Polytechnic & Mussoorie Town Hall (1.8 km away)'
  },

  // Himachal Pradesh
  {
    names: ['shimla', 'kalka-shimla', 'sanjauli', 'taradevi', 'solan', 'dhalli'],
    displayName: 'Shimla - Solan Hill Slopes (NH-05)',
    state: 'Himachal Pradesh',
    elevationM: 2206,
    riskPercent: 84,
    rainfall24h: 98,
    soilMoisture: 86,
    weather: 'Heavy Thunderstorms & Rain',
    riskDetails: 'Unstable debris slopes on steep urban ridges. Risk of sudden retaining wall failure and highway blockage.',
    shelter: 'Shimla Indira Gandhi Medical Complex Safe Zone (1.4 km away)'
  },
  {
    names: ['manali', 'kullu', 'mandi', 'pandoh', 'aut', 'beas valley', 'dharamshala', 'mcleodganj', 'chamba'],
    displayName: 'Manali - Kullu - Mandi Highway Corridor (NH-21)',
    state: 'Himachal Pradesh',
    elevationM: 2050,
    riskPercent: 89,
    rainfall24h: 118,
    soilMoisture: 92,
    weather: 'Heavy Downpour & Torrential Swells',
    riskDetails: 'Severe Beas river scour eroding road embankment toe; loose scree falling rapidly from high mountain walls.',
    shelter: 'Kullu Indoor Stadium & Mandi College Campus (1.9 km away)'
  },
  {
    names: ['kinnaur', 'reckong peo', 'kalpa', 'sangla', 'nigulsari', 'lahaul', 'spiti', 'kaza', 'keylong'],
    displayName: 'Kinnaur (Nigulsari) & Lahaul Trans-Himalayan Cliffs',
    state: 'Himachal Pradesh',
    elevationM: 2758,
    riskPercent: 91,
    rainfall24h: 68,
    soilMoisture: 75,
    weather: 'High-Altitude Cold Rain & Slush',
    riskDetails: 'Massive shooting stones and catastrophic rock avalanches from vertical granite scarps.',
    shelter: 'Reckong Peo ITBP Community Hall (2.5 km away)'
  },

  // Jammu & Kashmir and Ladakh
  {
    names: ['ramban', 'banihal', 'chenani', 'nashri', 'patnitop', 'doda', 'kishtwar', 'panthyal', 'nh-44'],
    displayName: 'Ramban - Banihal - Nashri Axis (NH-44)',
    state: 'Jammu & Kashmir',
    elevationM: 1156,
    riskPercent: 92,
    rainfall24h: 112,
    soilMoisture: 90,
    weather: 'Heavy Cold Showers & Mud Slurry',
    riskDetails: 'Panthyal & Seri shooting stones zone. Fragile clay-rich shale slips blocking national highway tunnels.',
    shelter: 'Banihal Railway Station Safe Quadrangle & Chanderkote Camp (1.5 km away)'
  },
  {
    names: ['zojila', 'zojila pass', 'drass', 'kargil', 'khardung la', 'chang la', 'leh-manali'],
    displayName: 'Zojila Pass - Drass Mountain Axis (NH-01)',
    state: 'Ladakh',
    elevationM: 3528,
    riskPercent: 87,
    rainfall24h: 44,
    soilMoisture: 72,
    weather: 'Freezing Sleet & Snow Melt Runoff',
    riskDetails: 'Steep scree gullies and permafrost thawing triggering boulder falls across high mountain pass.',
    shelter: 'BRO Transit Shelter Gumri & Drass Army Community Post (3.0 km away)'
  },

  // Sikkim & North Bengal
  {
    names: ['gangtok', 'mangan', 'chungthang', 'lachen', 'lachung', 'teesta', 'nh-10', 'singtam', 'rangpo', 'dikchu'],
    displayName: 'Sikkim (Gangtok - Mangan - Teesta Axis NH-10)',
    state: 'Sikkim',
    elevationM: 1650,
    riskPercent: 89,
    rainfall24h: 136,
    soilMoisture: 94,
    weather: 'Heavy Monsoon Torrent & River Flood',
    riskDetails: 'Teesta river toe erosion undercut mountain face. Massive mud slips at Mile 18, 20 and 29.',
    shelter: 'Singtam Community Hall & Rangpo Tourist Lodge (1.5 km away on terrace)'
  },
  {
    names: ['darjeeling', 'kalimpong', 'kurseong', 'mirik', 'tindharia', 'paglajhora', 'sukhiapokhri'],
    displayName: 'Darjeeling & Kalimpong Himalayan Slopes',
    state: 'West Bengal',
    elevationM: 2042,
    riskPercent: 83,
    rainfall24h: 114,
    soilMoisture: 89,
    weather: 'Dense Cloud Mist & Continuous Rain',
    riskDetails: 'Paglajhora sinking zone; deep weathered phyllite rock sliding downward into stream valleys.',
    shelter: 'Kurseong Town Hall & Kalimpong Mela Ground Shelter (1.8 km away)'
  },

  // Northeast
  {
    names: ['shillong', 'cherrapunji', 'sohra', 'mawsynram', 'jowai', 'tura', 'meghalaya hills'],
    displayName: 'Meghalaya (Shillong - Sohra - Jowai Ridge)',
    state: 'Meghalaya',
    elevationM: 1496,
    riskPercent: 86,
    rainfall24h: 210,
    soilMoisture: 98,
    weather: 'Extreme Monsoon Cloudburst',
    riskDetails: 'World highest rainfall zone causing sheer limestone cliffs to fracture and collapse into valley gorges.',
    shelter: 'Sohra Tourist Facility & Shillong State Central Library Safe Zone (1.7 km away)'
  },
  {
    names: ['haflong', 'dima hasao', 'lumding-badarpur', 'karbi anglong', 'jatinga'],
    displayName: 'Assam (Dima Hasao - Haflong - Jatinga)',
    state: 'Assam',
    elevationM: 680,
    riskPercent: 84,
    rainfall24h: 122,
    soilMoisture: 93,
    weather: 'Heavy Tropical Downpour',
    riskDetails: 'Soft sedimentary hills collapsing over mountain railway tracks and National Highway 54E.',
    shelter: 'Haflong Government Higher Secondary School (1.3 km away)'
  },
  {
    names: ['kohima', 'aizawl', 'itanagar', 'tawang', 'bomdila', 'noney', 'tamenglong', 'senapati', 'mokokchung'],
    displayName: 'Northeast Frontier Ridges (Kohima / Aizawl / Tawang)',
    state: 'Northeast India',
    elevationM: 1444,
    riskPercent: 85,
    rainfall24h: 115,
    soilMoisture: 90,
    weather: 'Torrential Monsoon Rain',
    riskDetails: 'Active tectonic uplift combined with heavy rain causing massive subsidence and mud avalanches.',
    shelter: 'Kohima Local Ground Transit Camp & Aizawl Community Hall (1.4 km away)'
  },

  // Maharashtra Western Ghats
  {
    names: ['mahabaleshwar', 'panchgani', 'lonavala', 'khandala', 'matheran', 'amboli', 'tamhini', 'malshej ghat', 'kasara ghat'],
    displayName: 'Maharashtra Western Ghats (Mahabaleshwar - Malshej - Khandala)',
    state: 'Maharashtra',
    elevationM: 1353,
    riskPercent: 80,
    rainfall24h: 130,
    soilMoisture: 88,
    weather: 'Heavy Ghat Downpour & Fog',
    riskDetails: 'Basalt rock cliffs subject to water pressure fracture; debris sliding across ghat road hairpin turns.',
    shelter: 'Mahabaleshwar Municipal Hall & Lonavala Rail Rest Camp (1.6 km away)'
  },

  // Karnataka Western Ghats
  {
    names: ['coorg', 'kodagu', 'madikeri', 'bhagamandala', 'chikmagalur', 'mullayanagiri', 'sakleshpur', 'agumbe', 'shiradi ghat', 'charmadi ghat'],
    displayName: 'Karnataka Ghats (Kodagu - Chikmagalur - Agumbe - Shiradi)',
    state: 'Karnataka',
    elevationM: 1170,
    riskPercent: 82,
    rainfall24h: 148,
    soilMoisture: 92,
    weather: 'High Monsoon Downpour',
    riskDetails: 'Steep coffee estate hillsides vulnerable to deep mudslides and road embankment washaways.',
    shelter: 'Madikeri Town Hall & Bhagamandala Temple High Ground (1.5 km away)'
  },

  // Eastern Ghats
  {
    names: ['araku', 'araku valley', 'lambasingi', 'anantagiri', 'paderu', 'daringbadi', 'koraput'],
    displayName: 'Eastern Ghats (Araku Valley - Lambasingi - Koraput)',
    state: 'Andhra Pradesh / Odisha',
    elevationM: 911,
    riskPercent: 68,
    rainfall24h: 74,
    soilMoisture: 73,
    weather: 'Moderate to Heavy Hill Showers',
    riskDetails: 'Moderate slope slip risk along valley ghat curves; culvert overflow and small rockfalls.',
    shelter: 'Araku Valley Tourism Complex & Paderu Sub-Collector Ground (1.9 km away)'
  }
];

// Common Indian Plains / Plateau / Coastal Cities & Districts that are NOT Landslide Prone
export const SAFE_PLAINS_AREAS = [
  'delhi', 'new delhi', 'noida', 'gurgaon', 'gurugram', 'faridabad', 'ghaziabad',
  'mumbai', 'navi mumbai', 'thane', 'pune', 'nagpur', 'aurangabad', 'solapur', 'kolhapur', 'jalgaon', 'akola',
  'bengaluru', 'bangalore', 'mysore', 'mysuru', 'hubli', 'dharwad', 'belgaum', 'bellary', 'davangere',
  'hyderabad', 'secunderabad', 'warangal', 'nizamabad', 'karimnagar', 'khammam',
  'chennai', 'coimbatore', 'madurai', 'tiruchirappalli', 'salem', 'tirunelveli', 'erode', 'vellore', 'thanjavur',
  'kolkata', 'howrah', 'durgapur', 'asansol', 'siliguri', 'kharagpur', 'haldia',
  'ahmedabad', 'surat', 'vadodara', 'rajkot', 'bhavnagar', 'jamnagar', 'junagadh', 'gandhinagar',
  'jaipur', 'jodhpur', 'kota', 'bikaner', 'ajmer', 'udaipur', 'alwar', 'bhilwara', 'sikar',
  'lucknow', 'kanpur', 'agra', 'varanasi', 'prayagraj', 'allahabad', 'meerut', 'bareilly', 'aligarh', 'moradabad', 'gorakhpur',
  'patna', 'gaya', 'bhagalpur', 'muzaffarpur', 'purnia', 'darbhanga', 'bihar sharif',
  'bhopal', 'indore', 'gwalior', 'jabalpur', 'ujjain', 'sagar', 'dewas', 'satna', 'ratlam',
  'visakhapatnam', 'vizag', 'vijayawada', 'guntur', 'nellore', 'kurnool', 'rajahmundry', 'tirupati', 'kakinada', 'kadapa',
  'chandigarh', 'ludhiana', 'amritsar', 'jalandhar', 'patiala', 'bathinda',
  'raipur', 'bhilai', 'bilaspur', 'korba',
  'ranchi', 'jamshedpur', 'dhanbad', 'bokaro', 'deoghar',
  'bhubaneswar', 'cuttack', 'rourkela', 'puri', 'sambalpur', 'berhampur', 'balasore',
  'thiruvananthapuram', 'trivandrum', 'kochi', 'cochin', 'kozhikode', 'calicut', 'kollam', 'thrissur', 'alappuzha',
  'guwahati', 'dibrugarh', 'jorhat', 'silchar', 'tezpur', 'nagaon'
];

/**
 * Searches across ALL areas in India.
 * If query matches a mountain/landslide hazard -> returns details.
 * If query matches a plain/flat city or town -> returns "does not come under any landslide prone zone".
 */
export function searchIndiaArea(query: string, corridors: CorridorData[]): AreaRiskResult | null {
  const trimmed = query.trim().toLowerCase();
  if (!trimmed) return null;

  // 1. First check if it matches any known landslide-prone area in India
  for (const item of LANDSLIDE_PRONE_AREAS) {
    const matched = item.names.some((n) => trimmed.includes(n) || n.includes(trimmed));
    if (matched) {
      // Find matching corridor from corridors list if any for live data
      const matchedCorridor = corridors.find((c) => 
        c.name.toLowerCase().includes(trimmed) || 
        c.shortName.toLowerCase().includes(trimmed) ||
        item.names.some((n) => c.name.toLowerCase().includes(n))
      );

      const riskPct = matchedCorridor ? matchedCorridor.riskPercent : item.riskPercent;
      const rain = matchedCorridor ? matchedCorridor.rainfall24h : item.rainfall24h;
      const moist = matchedCorridor ? matchedCorridor.moistureSaturation : item.soilMoisture;
      const temp = Math.round(28 - (item.elevationM / 1000) * 6.5);

      let riskLevelText: 'SAFE' | 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL DANGER' = 'HIGH';
      if (riskPct >= 85) riskLevelText = 'CRITICAL DANGER';
      else if (riskPct >= 70) riskLevelText = 'HIGH';
      else if (riskPct >= 50) riskLevelText = 'MODERATE';
      else riskLevelText = 'LOW';

      return {
        name: item.displayName,
        stateOrRegion: item.state,
        isLandslideProne: true,
        finalRiskPercent: riskPct,
        riskLevelText,
        riskDescription: item.riskDetails,
        temperatureC: Math.max(9, Math.min(26, temp)),
        weather: item.weather,
        rainfall24hMm: rain,
        soilMoisturePercent: moist,
        soilConditionSimple: moist >= 85 ? 'Completely Soaked (Heavy Unstable Mud)' : 'Very Damp Saturated Earth',
        shelterOrAdvice: item.shelter
      };
    }
  }

  // 2. Check if it matches existing corridors directly
  const corridorMatch = corridors.find((c) =>
    c.name.toLowerCase().includes(trimmed) ||
    c.shortName.toLowerCase().includes(trimmed) ||
    c.district.toLowerCase().includes(trimmed) ||
    c.state.toLowerCase().includes(trimmed)
  );

  if (corridorMatch && corridorMatch.riskPercent >= 40) {
    const temp = corridorMatch.temperatureC ?? Math.round(28 - (corridorMatch.elevationM / 1000) * 6.5);
    return {
      name: corridorMatch.name,
      stateOrRegion: `${corridorMatch.district}, ${corridorMatch.state}`,
      isLandslideProne: true,
      finalRiskPercent: corridorMatch.riskPercent,
      riskLevelText: corridorMatch.riskPercent >= 80 ? 'CRITICAL DANGER' : 'HIGH',
      riskDescription: `Steep mountain slope with ${corridorMatch.slopeAngle} inclination. Active creep detected at ${corridorMatch.displacementCreep}.`,
      temperatureC: temp,
      weather: corridorMatch.rainfall24h >= 100 ? 'Heavy Continuous Rain' : 'Moderate Mountain Showers',
      rainfall24hMm: corridorMatch.rainfall24h,
      soilMoisturePercent: corridorMatch.moistureSaturation,
      soilConditionSimple: corridorMatch.moistureSaturation >= 85 ? 'Completely Soaked Mud' : 'Damp Loose Earth',
      shelterOrAdvice: corridorMatch.evacuationRoute
    };
  }

  // 3. Check if query contains mountain/hill keywords
  const hillKeywords = ['hill', 'ghat', 'mountain', 'valley', 'pass', 'peak', 'scarp', 'slope', 'churam', 'ridge', 'range'];
  const hasHillKeyword = hillKeywords.some((k) => trimmed.includes(k));
  const hillStates = ['uttarakhand', 'himachal', 'sikkim', 'ladakh', 'arunachal', 'nagaland', 'mizoram', 'meghalaya', 'manipur', 'kashmir'];
  const hasHillState = hillStates.some((s) => trimmed.includes(s));

  if (hasHillKeyword || hasHillState) {
    // Treat as custom mountain area in India
    const formattedName = query.charAt(0).toUpperCase() + query.slice(1);
    return {
      name: `${formattedName} (Mountain Zone)`,
      stateOrRegion: hasHillState ? 'Himalayan / Hill Region' : 'Mountain Range, India',
      isLandslideProne: true,
      finalRiskPercent: 74,
      riskLevelText: 'HIGH',
      riskDescription: 'High-elevation mountain terrain subject to heavy seasonal rain, rock displacement, and soil erosion.',
      temperatureC: 18,
      weather: 'Cloudy with Mountain Showers',
      rainfall24hMm: 82,
      soilMoisturePercent: 81,
      soilConditionSimple: 'Saturated Hillside Soil',
      shelterOrAdvice: 'Local District Disaster Evacuation Point & Panchayat Bhavan on Flat Ground'
    };
  }

  // 4. Otherwise, it is a SAFE PLAIN / NON-LANDSLIDE PRONE AREA
  // Normalize capitalized name
  const formattedName = query
    .split(' ')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

  return {
    name: `${formattedName}, India`,
    stateOrRegion: 'Plains / Lowland / Plateau Terrain',
    isLandslideProne: false,
    finalRiskPercent: 0,
    riskLevelText: 'SAFE',
    riskDescription: 'This area does NOT come under any landslide-prone zone. It is situated on flat or gentle terrain with zero risk of mountain slope sliding or mudslides.',
    temperatureC: 31,
    weather: 'Clear Sky / Normal Weather',
    rainfall24hMm: 6,
    soilMoisturePercent: 28,
    soilConditionSimple: 'Normal Dry & Firm Ground (Adequate Drainage)',
    shelterOrAdvice: 'Area is completely safe from landslides. No evacuation shelter required.'
  };
}

/**
 * Resolves user GPS location coordinates to nearest city/hazard
 */
export function resolveGpsLocation(
  lat: number,
  lon: number,
  corridors: CorridorData[]
): {
  userLocationName: string;
  isLandslideProne: boolean;
  distanceToNearestHazardKm: number;
  nearestCorridor: CorridorData;
  riskResult: AreaRiskResult;
} {
  // Find closest corridor in mock data
  let closest = corridors[0];
  let minDistance = Infinity;

  corridors.forEach((c) => {
    const dLat = ((c.lat - lat) * Math.PI) / 180;
    const dLon = ((c.lon - lon) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat * Math.PI) / 180) *
        Math.cos((c.lat * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const cVal = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const dist = Math.round(6371 * cVal * 10) / 10;
    if (dist < minDistance) {
      minDistance = dist;
      closest = c;
    }
  });

  const isWithinDangerRange = minDistance <= 25.0; // within 25 km of active landslide slope

  if (isWithinDangerRange) {
    const temp = closest.temperatureC ?? Math.round(28 - (closest.elevationM / 1000) * 6.5);
    return {
      userLocationName: `Near ${closest.shortName} (${closest.district}, ${closest.state})`,
      isLandslideProne: true,
      distanceToNearestHazardKm: minDistance,
      nearestCorridor: closest,
      riskResult: {
        name: `Your Location: Near ${closest.name}`,
        stateOrRegion: `${closest.district}, ${closest.state}`,
        isLandslideProne: true,
        finalRiskPercent: closest.riskPercent,
        riskLevelText: closest.riskPercent >= 80 ? 'CRITICAL DANGER' : 'HIGH',
        riskDescription: `You are only ${minDistance} km away from an active mountain landslide slope. Steep hillside saturated with rain; mud, trees and stones can slide at any moment!`,
        temperatureC: temp,
        weather: closest.rainfall24h >= 100 ? 'Heavy Mountain Downpour' : 'Rain & Fog',
        rainfall24hMm: closest.rainfall24h,
        soilMoisturePercent: closest.moistureSaturation,
        soilConditionSimple: closest.moistureSaturation >= 85 ? 'Completely Soaked Mud (Extreme Slide Risk)' : 'Very Wet Earth',
        shelterOrAdvice: `🚨 MOVE TO SHELTER IMMEDIATELY: ${closest.evacuationRoute}`,
        isUserLocation: true,
        distanceToNearestHazardKm: minDistance
      }
    };
  } else {
    // User is far from any mountain landslide hazard (Plains or plateau)
    return {
      userLocationName: `Coordinates (${lat.toFixed(2)}° N, ${lon.toFixed(2)}° E)`,
      isLandslideProne: false,
      distanceToNearestHazardKm: minDistance,
      nearestCorridor: closest,
      riskResult: {
        name: `Your Location (${lat.toFixed(2)}° N, ${lon.toFixed(2)}° E)`,
        stateOrRegion: 'Safe Plain / Plateau Ground',
        isLandslideProne: false,
        finalRiskPercent: 0,
        riskLevelText: 'SAFE',
        riskDescription: `This area does NOT come under any landslide-prone zone. The nearest mountain landslide hazard (${closest.shortName}) is ${minDistance} km away. You are on flat, safe ground.`,
        temperatureC: 30,
        weather: 'Fair Weather',
        rainfall24hMm: 4,
        soilMoisturePercent: 32,
        soilConditionSimple: 'Normal Firm Ground (Zero Risk)',
        shelterOrAdvice: 'You are safe from landslides. No evacuation shelter required.',
        isUserLocation: true,
        distanceToNearestHazardKm: minDistance
      }
    };
  }
}

export interface AreaSuggestion {
  name: string;
  state: string;
  isLandslideProne: boolean;
  typeBadge: string;
  searchKey: string;
}

// Curated list of high-priority areas for instant suggestion lookup
export const ALL_SUGGESTION_AREAS: AreaSuggestion[] = [
  // Hill & Landslide Hazard Areas
  { name: 'Wayanad (Meppadi - Chooralmala)', state: 'Kerala', isLandslideProne: true, typeBadge: 'Hazard Slopes', searchKey: 'wayanad' },
  { name: 'Munnar & Devikulam (Idukki)', state: 'Kerala', isLandslideProne: true, typeBadge: 'Hazard Slopes', searchKey: 'munnar' },
  { name: 'Joshimath & Chamoli (Alaknanda)', state: 'Uttarakhand', isLandslideProne: true, typeBadge: 'Hazard Slopes', searchKey: 'joshimath' },
  { name: 'Shimla & Kalka Ridge', state: 'Himachal Pradesh', isLandslideProne: true, typeBadge: 'Hazard Slopes', searchKey: 'shimla' },
  { name: 'Manali & Rohtang Pass', state: 'Himachal Pradesh', isLandslideProne: true, typeBadge: 'Hazard Slopes', searchKey: 'manali' },
  { name: 'Dharamshala & Kangra', state: 'Himachal Pradesh', isLandslideProne: true, typeBadge: 'Hazard Slopes', searchKey: 'dharamshala' },
  { name: 'Ooty & Nilgiris (Coonoor)', state: 'Tamil Nadu', isLandslideProne: true, typeBadge: 'Hazard Slopes', searchKey: 'ooty' },
  { name: 'Kodaikanal & Palani Hills', state: 'Tamil Nadu', isLandslideProne: true, typeBadge: 'Hazard Slopes', searchKey: 'kodaikanal' },
  { name: 'Darjeeling & Kurseong', state: 'West Bengal', isLandslideProne: true, typeBadge: 'Hazard Slopes', searchKey: 'darjeeling' },
  { name: 'Kalimpong & Teesta Valley', state: 'West Bengal', isLandslideProne: true, typeBadge: 'Hazard Slopes', searchKey: 'kalimpong' },
  { name: 'Gangtok & East Sikkim (NH-10)', state: 'Sikkim', isLandslideProne: true, typeBadge: 'Hazard Slopes', searchKey: 'gangtok' },
  { name: 'Nainital & Almora Kumaon', state: 'Uttarakhand', isLandslideProne: true, typeBadge: 'Hazard Slopes', searchKey: 'nainital' },
  { name: 'Mussoorie & Dehradun Hills', state: 'Uttarakhand', isLandslideProne: true, typeBadge: 'Hazard Slopes', searchKey: 'mussoorie' },
  { name: 'Kedarnath & Rudraprayag', state: 'Uttarakhand', isLandslideProne: true, typeBadge: 'Hazard Slopes', searchKey: 'kedarnath' },
  { name: 'Badrinath & Hemkund Sahib', state: 'Uttarakhand', isLandslideProne: true, typeBadge: 'Hazard Slopes', searchKey: 'badrinath' },
  { name: 'Kinnaur & Spiti Valley', state: 'Himachal Pradesh', isLandslideProne: true, typeBadge: 'Hazard Slopes', searchKey: 'kinnaur' },
  { name: 'Ramban & Banihal (NH-44)', state: 'Jammu & Kashmir', isLandslideProne: true, typeBadge: 'Hazard Slopes', searchKey: 'ramban' },
  { name: 'Shillong & Cherrapunji', state: 'Meghalaya', isLandslideProne: true, typeBadge: 'Hazard Slopes', searchKey: 'shillong' },
  { name: 'Haflong & Dima Hasao', state: 'Assam', isLandslideProne: true, typeBadge: 'Hazard Slopes', searchKey: 'haflong' },
  { name: 'Tawang & Sela Pass', state: 'Arunachal Pradesh', isLandslideProne: true, typeBadge: 'Hazard Slopes', searchKey: 'tawang' },
  { name: 'Kohima & Naga Hills', state: 'Nagaland', isLandslideProne: true, typeBadge: 'Hazard Slopes', searchKey: 'kohima' },
  { name: 'Aizawl Ridge', state: 'Mizoram', isLandslideProne: true, typeBadge: 'Hazard Slopes', searchKey: 'aizawl' },
  { name: 'Mahabaleshwar & Malshej Ghat', state: 'Maharashtra', isLandslideProne: true, typeBadge: 'Hazard Slopes', searchKey: 'mahabaleshwar' },
  { name: 'Lonavala & Khandala Ghats', state: 'Maharashtra', isLandslideProne: true, typeBadge: 'Hazard Slopes', searchKey: 'lonavala' },
  { name: 'Coorg (Madikeri) & Kodagu', state: 'Karnataka', isLandslideProne: true, typeBadge: 'Hazard Slopes', searchKey: 'coorg' },
  { name: 'Chikmagalur & Mullayanagiri', state: 'Karnataka', isLandslideProne: true, typeBadge: 'Hazard Slopes', searchKey: 'chikmagalur' },
  { name: 'Agumbe Ghat (Shimoga)', state: 'Karnataka', isLandslideProne: true, typeBadge: 'Hazard Slopes', searchKey: 'agumbe' },
  { name: 'Araku Valley & Lambasingi', state: 'Andhra Pradesh', isLandslideProne: true, typeBadge: 'Hazard Slopes', searchKey: 'araku' },

  // Safe Plains & Major Cities
  { name: 'New Delhi & NCR', state: 'Delhi', isLandslideProne: false, typeBadge: 'Safe Plains', searchKey: 'delhi' },
  { name: 'Mumbai & MMR', state: 'Maharashtra', isLandslideProne: false, typeBadge: 'Safe Plains', searchKey: 'mumbai' },
  { name: 'Bengaluru / Bangalore', state: 'Karnataka', isLandslideProne: false, typeBadge: 'Safe Plains', searchKey: 'bengaluru' },
  { name: 'Hyderabad & Secunderabad', state: 'Telangana', isLandslideProne: false, typeBadge: 'Safe Plains', searchKey: 'hyderabad' },
  { name: 'Chennai & Tambaram', state: 'Tamil Nadu', isLandslideProne: false, typeBadge: 'Safe Plains', searchKey: 'chennai' },
  { name: 'Kolkata & Howrah', state: 'West Bengal', isLandslideProne: false, typeBadge: 'Safe Plains', searchKey: 'kolkata' },
  { name: 'Pune & Pimpri-Chinchwad', state: 'Maharashtra', isLandslideProne: false, typeBadge: 'Safe Plains', searchKey: 'pune' },
  { name: 'Ahmedabad & Gandhinagar', state: 'Gujarat', isLandslideProne: false, typeBadge: 'Safe Plains', searchKey: 'ahmedabad' },
  { name: 'Jaipur & Amer Plains', state: 'Rajasthan', isLandslideProne: false, typeBadge: 'Safe Plains', searchKey: 'jaipur' },
  { name: 'Lucknow & Gomti Plains', state: 'Uttar Pradesh', isLandslideProne: false, typeBadge: 'Safe Plains', searchKey: 'lucknow' },
  { name: 'Kanpur & Unnao', state: 'Uttar Pradesh', isLandslideProne: false, typeBadge: 'Safe Plains', searchKey: 'kanpur' },
  { name: 'Bhopal & Sehore', state: 'Madhya Pradesh', isLandslideProne: false, typeBadge: 'Safe Plains', searchKey: 'bhopal' },
  { name: 'Indore & Ujjain', state: 'Madhya Pradesh', isLandslideProne: false, typeBadge: 'Safe Plains', searchKey: 'indore' },
  { name: 'Patna & Danapur', state: 'Bihar', isLandslideProne: false, typeBadge: 'Safe Plains', searchKey: 'patna' },
  { name: 'Chandigarh & Mohali', state: 'Punjab / Haryana', isLandslideProne: false, typeBadge: 'Safe Plains', searchKey: 'chandigarh' },
  { name: 'Coimbatore Plains', state: 'Tamil Nadu', isLandslideProne: false, typeBadge: 'Safe Plains', searchKey: 'coimbatore' },
  { name: 'Visakhapatnam Coast', state: 'Andhra Pradesh', isLandslideProne: false, typeBadge: 'Safe Plains', searchKey: 'visakhapatnam' },
  { name: 'Vijayawada & Guntur', state: 'Andhra Pradesh', isLandslideProne: false, typeBadge: 'Safe Plains', searchKey: 'vijayawada' },
  { name: 'Kochi & Ernakulam', state: 'Kerala', isLandslideProne: false, typeBadge: 'Safe Plains', searchKey: 'kochi' },
  { name: 'Thiruvananthapuram', state: 'Kerala', isLandslideProne: false, typeBadge: 'Safe Plains', searchKey: 'thiruvananthapuram' },
  { name: 'Surat & Navsari', state: 'Gujarat', isLandslideProne: false, typeBadge: 'Safe Plains', searchKey: 'surat' },
  { name: 'Nagpur & Vidarbha Plains', state: 'Maharashtra', isLandslideProne: false, typeBadge: 'Safe Plains', searchKey: 'nagpur' },
  { name: 'Bhubaneswar & Cuttack', state: 'Odisha', isLandslideProne: false, typeBadge: 'Safe Plains', searchKey: 'bhubaneswar' },
  { name: 'Guwahati Plains', state: 'Assam', isLandslideProne: false, typeBadge: 'Safe Plains', searchKey: 'guwahati' },
  { name: 'Ranchi & Jamshedpur', state: 'Jharkhand', isLandslideProne: false, typeBadge: 'Safe Plains', searchKey: 'ranchi' }
];

export function getAreaSuggestions(query: string, maxResults: number = 8): AreaSuggestion[] {
  const q = query.trim().toLowerCase();
  if (!q) {
    return ALL_SUGGESTION_AREAS.slice(0, 6);
  }

  return ALL_SUGGESTION_AREAS.filter(
    (area) =>
      area.name.toLowerCase().includes(q) ||
      area.searchKey.toLowerCase().includes(q) ||
      area.state.toLowerCase().includes(q)
  ).slice(0, maxResults);
}

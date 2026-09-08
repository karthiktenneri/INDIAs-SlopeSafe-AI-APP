// Proximity Alert & Geofence System for SlopeSafe-AI
import { CorridorData } from '../types';

/**
 * Calculates Haversine distance in Kilometers between two coordinates
 */
export function calculateDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

/**
 * Finds the closest mountain slope hazard to given coordinates
 */
export function findNearestSlopeHazard(
  lat: number,
  lon: number,
  corridors: CorridorData[]
): { corridor: CorridorData; distanceKm: number; isWithinDangerRange: boolean; isHighRisk: boolean } {
  let closest = corridors[0];
  let minDistance = Infinity;

  corridors.forEach((c) => {
    const dist = calculateDistanceKm(lat, lon, c.lat, c.lon);
    if (dist < minDistance) {
      minDistance = dist;
      closest = c;
    }
  });

  // Danger range is within 15 km of an active steep slope zone
  const isWithinDangerRange = minDistance <= 15.0;
  const isHighRisk = closest.riskPercent >= 70;

  return {
    corridor: closest,
    distanceKm: minDistance,
    isWithinDangerRange,
    isHighRisk
  };
}

/**
 * Emergency Siren Alert using Web Audio API (Synthesizer beep)
 * Generates an urgent 2-tone alarm without external audio files
 */
let audioCtx: AudioContext | null = null;

export function playEmergencyAlertSiren() {
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;

    if (!audioCtx) {
      audioCtx = new AudioContextClass();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    const now = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = 'sawtooth';

    // Two-tone rising and falling alarm tone
    osc.frequency.setValueAtTime(850, now);
    osc.frequency.linearRampToValueAtTime(520, now + 0.18);
    osc.frequency.linearRampToValueAtTime(920, now + 0.36);
    osc.frequency.linearRampToValueAtTime(520, now + 0.54);
    osc.frequency.linearRampToValueAtTime(920, now + 0.72);
    osc.frequency.linearRampToValueAtTime(520, now + 0.9);

    gain.gain.setValueAtTime(0.18, now);
    gain.gain.linearRampToValueAtTime(0.18, now + 0.85);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 1.05);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start(now);
    osc.stop(now + 1.05);
  } catch (err) {
    console.warn('Audio siren alert blocked or unsupported:', err);
  }
}

/**
 * Request notification permission from the user's browser
 */
export async function requestBrowserNotificationPermission(): Promise<NotificationPermission> {
  if (!('Notification' in window)) {
    return 'denied';
  }
  try {
    const permission = await Notification.requestPermission();
    return permission;
  } catch (err) {
    console.warn('Could not request notification permission:', err);
    return 'denied';
  }
}

/**
 * Trigger an instant browser push notification
 */
export function sendBrowserPushNotification(title: string, body: string) {
  if ('Notification' in window && Notification.permission === 'granted') {
    try {
      new Notification(title, {
        body,
        icon: '/SlopeSafe-AI.svg',
        tag: 'slopesafe-alert',
      });
    } catch (err) {
      console.warn('Push notification delivery failed:', err);
    }
  }
}

/**
 * Derives realistic temperature in Celsius based on mountain elevation and location
 */
export function getAreaTemperature(corridor: CorridorData): number {
  if (corridor.temperatureC !== undefined) return corridor.temperatureC;
  // Lapse rate approx 6.5°C per 1000m from a 30°C sea level baseline
  const baseTemp = corridor.state === 'Kerala' || corridor.state === 'Tamil Nadu' ? 32 : 28;
  const temp = Math.round(baseTemp - (corridor.elevationM / 1000) * 6.5);
  return Math.max(8, Math.min(29, temp));
}

/**
 * Derives human-friendly weather condition in simple English
 */
export function getAreaWeather(corridor: CorridorData): {
  weather: string;
  iconType: 'cloud-rain' | 'cloud-lightning' | 'cloud' | 'sun';
  rainfallMm: number;
  rainfallStatus: string;
} {
  const rain = corridor.rainfall24h;
  if (rain >= 130) {
    return {
      weather: 'Very Heavy Cloudburst Rain',
      iconType: 'cloud-lightning',
      rainfallMm: rain,
      rainfallStatus: `High Flood Level (${rain} mm today - Danger limit: ${corridor.rainfallThreshold} mm)`
    };
  } else if (rain >= 80) {
    return {
      weather: 'Heavy Continuous Downpour',
      iconType: 'cloud-rain',
      rainfallMm: rain,
      rainfallStatus: `Heavy Rain (${rain} mm today - Approaching danger threshold)`
    };
  } else if (rain >= 40) {
    return {
      weather: 'Moderate Rain & Dense Fog',
      iconType: 'cloud-rain',
      rainfallMm: rain,
      rainfallStatus: `Moderate Rain (${rain} mm in last 24h)`
    };
  } else {
    return {
      weather: 'Cloudy with Light Drizzle',
      iconType: 'cloud',
      rainfallMm: rain,
      rainfallStatus: `Light Showers (${rain} mm)`
    };
  }
}

/**
 * Returns simple, easy-to-understand English explanation of soil moisture
 */
export function getSimpleSoilDescription(moistureSaturation: number): {
  statusText: string;
  simpleExplanation: string;
  dangerLevel: 'CRITICAL' | 'WARNING' | 'ELEVATED' | 'NOMINAL';
  color: string;
} {
  if (moistureSaturation >= 90) {
    return {
      statusText: `${moistureSaturation}% Water Saturation (Totally Soaked)`,
      simpleExplanation: 'The ground is full of water like a drenched sponge. Mud is turning into liquid and can slide at any moment!',
      dangerLevel: 'CRITICAL',
      color: 'text-red-600'
    };
  } else if (moistureSaturation >= 75) {
    return {
      statusText: `${moistureSaturation}% Water Saturation (Very Wet)`,
      simpleExplanation: 'The mountain soil has absorbed huge amounts of rainwater. Heavy mud is very weak and unstable.',
      dangerLevel: 'WARNING',
      color: 'text-amber-600'
    };
  } else if (moistureSaturation >= 60) {
    return {
      statusText: `${moistureSaturation}% Water Saturation (Damp Ground)`,
      simpleExplanation: 'Rain has softened the surface earth. Small falling stones and wet road slippery patches expected.',
      dangerLevel: 'ELEVATED',
      color: 'text-blue-600'
    };
  } else {
    return {
      statusText: `${moistureSaturation}% Water Saturation (Normal)`,
      simpleExplanation: 'Soil has adequate drainage. Mud is currently firm and gripping the bedrock.',
      dangerLevel: 'NOMINAL',
      color: 'text-emerald-600'
    };
  }
}

/**
 * Returns simple, everyday advice that anyone can understand immediately
 */
export function getSimpleEnglishAdvice(corridor: CorridorData): string[] {
  if (corridor.riskPercent >= 80) {
    return [
      '🚨 EVACUATE DANGER SPOTS: Move immediately to flat open ground. Do not sleep in houses right below steep cliffs.',
      '🛑 STAY OFF ROADS: Avoid hill highway travel. Falling boulders and mud are actively sliding down.',
      '👂 LISTEN FOR SOUNDS: If you hear a loud rumbling sound, cracking trees, or sudden muddy water from hills, RUN sideways to higher ground immediately!',
      '📞 EMERGENCY HELP: Dial 112 (Police) or 1077 (District Disaster Room) if someone is trapped.'
    ];
  } else if (corridor.riskPercent >= 65) {
    return [
      '⚠️ HIGH CAUTION: Stay awake and keep emergency flashlight and phone charged.',
      '🚗 DRIVE WITH CARE: Do not park vehicles near vertical rock walls or under loose hillside soil.',
      '🌊 WATCH STREAMS: If clear mountain streams suddenly turn thick brown and muddy, a landslide is happening upstream.',
      '🏠 KEEP SAFE SHELTER READY: Know the nearest school, temple, or government building on flat ground.'
    ];
  } else {
    return [
      '✅ AREA MONITORED: Slopes currently stable, but watch for weather updates.',
      '🌧️ Check local IMD rain forecasts before driving on mountain passes.',
      '📞 Keep emergency numbers (112, 1077) handy during monsoon travels.'
    ];
  }
}

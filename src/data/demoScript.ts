import { DemoScenarioStep } from '../types';

export const DEMO_SCENARIO_STEPS: DemoScenarioStep[] = [
  {
    id: 1,
    phase: 'PHASE 1 / 6',
    title: 'Baseline Morning Flow — Pune Metro',
    caption:
      'Ambient conditions: 15mm/h drizzle, normal morning peak volume. 320+ H3 Resolution 8 spatial cells monitor real-time roadbed telemetry.',
    rainfallMm: 15,
    trafficMultiplier: 100,
    camera: {
      center: [73.8050, 18.5650],
      zoom: 11.8,
      pitch: 45,
      bearing: -15
    },
    activeRouteId: 'route-hinjewadi-selfish',
    corridor: 'hinjewadi_shivajinagar',
    timeOfDay: 'morning',
    systemLog: '[MESH] 320 H3 spatial cells calibrated. Baseline structural strain nominal across Pune arterials.'
  },
  {
    id: 2,
    phase: 'PHASE 2 / 6',
    title: 'Sudden Monsoon Cloudburst Strikes Western Hub',
    caption:
      'Rainfall surges to 75mm/h across Hinjewadi and Wakad. Moisture saturation reaches 84%, softening asphalt subgrade and priming roads for micro-cracking.',
    rainfallMm: 75,
    trafficMultiplier: 115,
    camera: {
      center: [73.7620, 18.5950],
      zoom: 13.5,
      pitch: 60,
      bearing: 30
    },
    activeRouteId: 'route-hinjewadi-selfish',
    corridor: 'hinjewadi_shivajinagar',
    timeOfDay: 'monsoon_noon',
    systemLog: '[WEATHER ALERT] Infiltration sensor cluster reports 75mm/h precipitation. Subgrade softening index: CRITICAL.'
  },
  {
    id: 3,
    phase: 'PHASE 3 / 6',
    title: 'Selfish GPS Causes Catastrophic Pavement Overload',
    caption:
      'Conventional navigation funnels 5,800 cars down the exact same Wakad Bridge shortcut. Cyclic axle strain surges to 94% — pothole blowout is imminent.',
    rainfallMm: 85,
    trafficMultiplier: 145,
    camera: {
      center: [73.7680, 18.5980],
      zoom: 14.2,
      pitch: 62,
      bearing: 45
    },
    activeRouteId: 'route-hinjewadi-selfish',
    corridor: 'hinjewadi_shivajinagar',
    timeOfDay: 'monsoon_noon',
    systemLog: '[OVERLOAD] Wakad chokepoint cell reached 94% stress limit. Rapid fatigue micro-fissuring detected.'
  },
  {
    id: 4,
    phase: 'PHASE 4 / 6',
    title: 'StrataGrid Cooperative Balancing Activates',
    caption:
      'StrataGrid intervenes: 45% of traffic is dynamically split onto the reinforced Pashan-Sus bypass. Commuters avoid the standstill while cutting asphalt fatigue by 62%.',
    rainfallMm: 85,
    trafficMultiplier: 140,
    camera: {
      center: [73.7850, 18.5550],
      zoom: 13.2,
      pitch: 55,
      bearing: -35
    },
    activeRouteId: 'route-hinjewadi-cooperative',
    corridor: 'hinjewadi_shivajinagar',
    timeOfDay: 'monsoon_noon',
    systemLog: '[COOPERATIVE ROUTING] Traffic dynamically split across Pashan corridor. Wakad stress plummeted from 94% -> 44%.'
  },
  {
    id: 5,
    phase: 'PHASE 5 / 6',
    title: 'PCMC / PCCOE Heavy Freight Rerouting',
    caption:
      '50-ton multi-axle freight trucks attempting to cut through Akurdi/PCCOE residential streets are geo-fenced and diverted to the Spine Road industrial bypass.',
    rainfallMm: 35,
    trafficMultiplier: 120,
    camera: {
      center: [73.7850, 18.6520],
      zoom: 13.0,
      pitch: 52,
      bearing: 15
    },
    activeRouteId: 'route-pcmc-cooperative',
    corridor: 'pcmc_freight',
    timeOfDay: 'evening_rush',
    systemLog: '[FLEET DISPATCH] Class 8 heavy trucks diverted from PCCOE residential sector to Spine Road freight bypass.'
  },
  {
    id: 6,
    phase: 'PHASE 6 / 6',
    title: 'Infrastructure & Commuter Win-Win',
    caption:
      'City-wide equilibrium achieved: -62% pavement fatigue, zero pothole blowouts, and 4.2 minutes average commute reduction. Google Maps destroys roads; StrataGrid protects them.',
    rainfallMm: 20,
    trafficMultiplier: 100,
    camera: {
      center: [73.8150, 18.5600],
      zoom: 11.9,
      pitch: 58,
      bearing: -20
    },
    activeRouteId: 'route-hinjewadi-cooperative',
    corridor: 'hinjewadi_shivajinagar',
    timeOfDay: 'night',
    systemLog: '[EQUILIBRIUM] All 320 H3 sectors operating at optimal load. Estimated capital repair savings: $2.4M annually.'
  }
];

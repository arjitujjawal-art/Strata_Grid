import { DemoScenarioStep } from '../types';

export const DEMO_SCENARIO_STEPS: DemoScenarioStep[] = [
  {
    id: 1,
    phase: 'PHASE 1 / 6',
    title: 'Baseline Morning Flow — Pune Metro',
    caption:
      'Ambient conditions: 15mm/h drizzle, normal morning peak volume. 320+ H3 Resolution-8 spatial cells monitor real-time roadbed telemetry.',
    rainfallMm: 15,
    trafficMultiplier: 100,
    camera: {
      center: [73.8050, 18.5650],
      zoom: 12.2,
      pitch: 48,
      bearing: -15
    },
    activeRouteId: 'route-hinjewadi-selfish',
    corridor: 'hinjewadi_shivajinagar',
    timeOfDay: 'morning',
    systemLog: '[MESH CALIBRATION] 320 H3 spatial cells active. Baseline structural strain nominal across Pune arterials.',
    bannerType: 'neutral',
    bannerHeadline: 'TELEMETRY INITIALIZED — PUNE SPATIAL GRID',
    bannerDetail: 'Real-time multi-sensor fusion: weather, traffic density, and subgrade vibration across 320 hex cells.',
    metrics: {
      strainPct: 34,
      conditionText: 'Nominal Structural State',
      commuteMin: 38,
      impactSavings: 'Pavement Life: 100%',
      statusColor: 'emerald'
    },
    chokepoints: [
      {
        id: 'cp-wakad-1',
        name: 'Wakad Viaduct',
        coords: [73.7663, 18.5987],
        strain: 34,
        status: 'nominal',
        label: 'WAKAD VIADUCT',
        sublabel: 'Strain: 34% (Normal Flow)'
      }
    ]
  },
  {
    id: 2,
    phase: 'PHASE 2 / 6',
    title: 'Sudden Monsoon Cloudburst Strikes Western Hub',
    caption:
      'Precipitation surges to 75mm/h across Hinjewadi and Wakad. Moisture saturation reaches 84%, softening the asphalt subgrade and priming roads for micro-fissuring.',
    rainfallMm: 75,
    trafficMultiplier: 115,
    camera: {
      center: [73.7620, 18.5950],
      zoom: 13.6,
      pitch: 58,
      bearing: 30
    },
    activeRouteId: 'route-hinjewadi-selfish',
    corridor: 'hinjewadi_shivajinagar',
    timeOfDay: 'monsoon_noon',
    systemLog: '[WEATHER ALERT] Cloudburst detected: 75mm/h precipitation. Asphalt subgrade softening index: CRITICAL.',
    bannerType: 'problem',
    bannerHeadline: '⚠️ WEATHER SENSOR ALERT: SUBGRADE WATERLOGGING',
    bannerDetail: 'Moisture infiltration reduces road bearing capacity by 40%. Repeated heavy wheel passes now cause micro-shear failure.',
    metrics: {
      strainPct: 68,
      conditionText: 'Subgrade Moisture 84%',
      commuteMin: 44,
      impactSavings: 'Water Saturation Alert',
      statusColor: 'gold'
    },
    chokepoints: [
      {
        id: 'cp-wakad-2',
        name: 'Wakad Viaduct',
        coords: [73.7663, 18.5987],
        strain: 68,
        status: 'critical',
        label: 'WAKAD ARTERIAL',
        sublabel: 'Moisture: 84% | Soil Softened'
      }
    ]
  },
  {
    id: 3,
    phase: 'PHASE 3 / 6',
    title: 'Selfish GPS Causes Catastrophic Pavement Overload',
    caption:
      'Conventional navigation funnels 5,800 cars down the exact same Wakad Bridge shortcut. Cyclic axle strain surges to 94% — rapid micro-cracking and pothole blowout are imminent.',
    rainfallMm: 85,
    trafficMultiplier: 145,
    camera: {
      center: [73.7680, 18.5980],
      zoom: 14.6,
      pitch: 64,
      bearing: 45
    },
    activeRouteId: 'route-hinjewadi-selfish',
    corridor: 'hinjewadi_shivajinagar',
    timeOfDay: 'monsoon_noon',
    systemLog: '[OVERLOAD CRITICAL] Wakad chokepoint cell reached 94% stress threshold. Severe subgrade fatigue in progress.',
    bannerType: 'problem',
    bannerHeadline: '🚨 THE SELFISH ROUTING CRISIS (CONVENTIONAL GPS FLAW)',
    bannerDetail: 'Navigation algorithms blindly funnel 5,800 cars down one narrow bridge shortcut. Pavement subgrade exceeds shear capacity -> massive pothole blowout.',
    metrics: {
      strainPct: 94,
      conditionText: 'CRITICAL OVERLOAD (94%)',
      commuteMin: 54,
      impactSavings: '-$45,000 Pavement Damage',
      statusColor: 'red'
    },
    chokepoints: [
      {
        id: 'cp-wakad-3',
        name: 'Wakad Viaduct',
        coords: [73.7663, 18.5987],
        strain: 94,
        status: 'critical',
        label: 'WAKAD CHOKEPOINT — 94% STRAIN',
        sublabel: '5,800 Cars Funneled | Blowout Risk'
      }
    ]
  },
  {
    id: 4,
    phase: 'PHASE 4 / 6',
    title: 'StrataGrid Cooperative Balancing Activates',
    caption:
      'StrataGrid AI intervenes: 45% of traffic is dynamically split onto the reinforced Pashan-Sus bypass. Commuters avoid the standstill while cutting asphalt fatigue by 62%.',
    rainfallMm: 85,
    trafficMultiplier: 140,
    camera: {
      center: [73.7820, 18.5580],
      zoom: 13.4,
      pitch: 56,
      bearing: -30
    },
    activeRouteId: 'route-hinjewadi-cooperative',
    corridor: 'hinjewadi_shivajinagar',
    timeOfDay: 'monsoon_noon',
    systemLog: '[COOPERATIVE ROUTING] Traffic dynamically staggered onto Pashan corridor. Wakad stress plummeted: 94% -> 44%.',
    bannerType: 'solution',
    bannerHeadline: '✨ STRATAGRID COOPERATIVE BALANCING ACTIVATED',
    bannerDetail: 'AI detects road strain in real-time, staggering commuter flow and splitting 45% onto reinforced Pashan Bypass. Zero standstill, -62% pavement fatigue!',
    metrics: {
      strainPct: 44,
      conditionText: 'Balanced & Protected',
      commuteMin: 38,
      impactSavings: '-62% Fatigue Saved (-4.2m)',
      statusColor: 'gold'
    },
    chokepoints: [
      {
        id: 'cp-wakad-4',
        name: 'Wakad Viaduct',
        coords: [73.7663, 18.5987],
        strain: 44,
        status: 'mitigated',
        label: 'WAKAD VIADUCT — RELIEVED',
        sublabel: 'Strain Reduced: 94% -> 44%'
      },
      {
        id: 'cp-pashan-4',
        name: 'Pashan Bypass',
        coords: [73.7820, 18.5420],
        strain: 32,
        status: 'nominal',
        label: 'PASHAN-SUS BYPASS',
        sublabel: 'Cooperative Inflow: +45% Volume'
      }
    ]
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
      zoom: 13.2,
      pitch: 54,
      bearing: 20
    },
    activeRouteId: 'route-pcmc-cooperative',
    corridor: 'pcmc_freight',
    timeOfDay: 'evening_rush',
    systemLog: '[FLEET DISPATCH] Class 8 heavy trucks diverted from PCCOE residential sector to Spine Road freight bypass.',
    bannerType: 'solution',
    bannerHeadline: '🚛 HEAVY FREIGHT GEOFENCE: PCCOE CAMPUS PROTECTED',
    bannerDetail: '50-ton multi-axle logistics trucks are restricted from residential streets and routed to the 6-lane Spine Road freight expressway.',
    metrics: {
      strainPct: 36,
      conditionText: 'Residential Roads Protected',
      commuteMin: 48,
      impactSavings: 'Zero Pavement Blowouts',
      statusColor: 'gold'
    },
    chokepoints: [
      {
        id: 'cp-pccoe-5',
        name: 'PCCOE Akurdi Sector',
        coords: [73.7615, 18.6517],
        strain: 36,
        status: 'restricted',
        label: 'PCCOE CAMPUS SECTOR 26',
        sublabel: 'Axle Load Geofence: 50T Diverted'
      },
      {
        id: 'cp-spine-5',
        name: 'Spine Road Expressway',
        coords: [73.7850, 18.6650],
        strain: 48,
        status: 'nominal',
        label: 'SPINE ROAD FREIGHT BYPASS',
        sublabel: 'Heavy Logistics Expressway'
      }
    ]
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
      zoom: 12.0,
      pitch: 58,
      bearing: -20
    },
    activeRouteId: 'route-hinjewadi-cooperative',
    corridor: 'hinjewadi_shivajinagar',
    timeOfDay: 'night',
    systemLog: '[EQUILIBRIUM] All 320 H3 sectors operating at optimal load. Estimated capital repair savings: $2.4M annually.',
    bannerType: 'neutral',
    bannerHeadline: '🏆 METROPOLITAN EQUILIBRIUM ACHIEVED',
    bannerDetail: 'Both parties win: Commuters save 4.2 minutes per trip, while Pune Metro saves $2.4M annually by eliminating emergency road repairs.',
    metrics: {
      strainPct: 28,
      conditionText: 'City-Wide Resilient Grid',
      commuteMin: 36,
      impactSavings: '$2.4M Saved / Year',
      statusColor: 'emerald'
    },
    chokepoints: [
      {
        id: 'cp-pune-core-6',
        name: 'Pune Metropolitan Core',
        coords: [73.8050, 18.5650],
        strain: 28,
        status: 'nominal',
        label: 'PUNE METROPOLITAN MESH',
        sublabel: 'All 320 H3 Sectors in Equilibrium'
      }
    ]
  }
];

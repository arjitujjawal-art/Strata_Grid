import { HexCell, RouteOption, TeamMember, GalleryItem, CaseStudy, TerminalLog } from '../types';
import karthikAvatar from '../assets/images/karthik_avatar_new_1787890698224.jpg';
import nirvanAvatar from '../assets/images/nirvan_joneja_1787857082180.jpg';
import arijitAvatar from '../assets/images/arijit_photo_1787858092995.jpg';
import ihaAvatar from '../assets/images/iha_pradhan_1787857118893.jpg';
import kalindiAvatar from '../assets/images/kalindi_joshi_1787857141392.jpg';

export const INITIAL_HEX_CELLS: HexCell[] = [
  // Row 0
  { id: 'HEX-01', q: 0, r: 0, name: 'North Ridge Skyway', district: 'North Sector', baseStress: 22, trafficVolume: 1240, heavyVehiclePct: 8, floodVulnerability: 12, roadType: 'highway', speedLimit: 65, surfaceHealth: 94, potholeRisk: 'Low' },
  { id: 'HEX-02', q: 1, r: 0, name: 'Skyway North Junction', district: 'North Sector', baseStress: 31, trafficVolume: 1850, heavyVehiclePct: 11, floodVulnerability: 15, roadType: 'highway', speedLimit: 60, surfaceHealth: 88, potholeRisk: 'Low' },
  { id: 'HEX-03', q: 2, r: 0, name: 'Research Park Blvd', district: 'Tech District', baseStress: 28, trafficVolume: 1420, heavyVehiclePct: 6, floodVulnerability: 20, roadType: 'arterial', speedLimit: 45, surfaceHealth: 92, potholeRisk: 'Low' },
  { id: 'HEX-04', q: 3, r: 0, name: 'Innovation Overpass', district: 'Tech District', baseStress: 48, trafficVolume: 2900, heavyVehiclePct: 14, floodVulnerability: 28, roadType: 'bridge', speedLimit: 50, surfaceHealth: 79, potholeRisk: 'Moderate' },
  { id: 'HEX-05', q: 4, r: 0, name: 'Metro Aerodrome Expy', district: 'Airport Corridor', baseStress: 36, trafficVolume: 2100, heavyVehiclePct: 18, floodVulnerability: 14, roadType: 'highway', speedLimit: 65, surfaceHealth: 85, potholeRisk: 'Low' },
  { id: 'HEX-06', q: 5, r: 0, name: 'Cargo Perimeter Rd', district: 'Airport Corridor', baseStress: 68, trafficVolume: 3400, heavyVehiclePct: 42, floodVulnerability: 35, roadType: 'freight_spur', speedLimit: 40, surfaceHealth: 65, potholeRisk: 'Moderate' },
  { id: 'HEX-07', q: 6, r: 0, name: 'Northeast Logistics Gate', district: 'Logistics Hub', baseStress: 74, trafficVolume: 3850, heavyVehiclePct: 56, floodVulnerability: 42, roadType: 'freight_spur', speedLimit: 35, surfaceHealth: 58, potholeRisk: 'High' },

  // Row 1
  { id: 'HEX-08', q: 0, r: 1, name: 'West Valley Parkway', district: 'North Sector', baseStress: 18, trafficVolume: 980, heavyVehiclePct: 5, floodVulnerability: 10, roadType: 'arterial', speedLimit: 50, surfaceHealth: 96, potholeRisk: 'Low' },
  { id: 'HEX-09', q: 1, r: 1, name: 'University Way Interlink', district: 'North Sector', baseStress: 35, trafficVolume: 2200, heavyVehiclePct: 9, floodVulnerability: 24, roadType: 'urban_corridor', speedLimit: 35, surfaceHealth: 84, potholeRisk: 'Low' },
  { id: 'HEX-10', q: 2, r: 1, name: 'Cyber Hub Arterial', district: 'Tech District', baseStress: 52, trafficVolume: 3100, heavyVehiclePct: 12, floodVulnerability: 30, roadType: 'urban_corridor', speedLimit: 40, surfaceHealth: 76, potholeRisk: 'Moderate' },
  { id: 'HEX-11', q: 3, r: 1, name: 'Sector 7G Flyover', district: 'Metropolis Core', baseStress: 88, trafficVolume: 5120, heavyVehiclePct: 34, floodVulnerability: 62, roadType: 'bridge', speedLimit: 55, surfaceHealth: 44, potholeRisk: 'Severe' },
  { id: 'HEX-12', q: 4, r: 1, name: 'Central Data Corridor', district: 'Metropolis Core', baseStress: 72, trafficVolume: 4300, heavyVehiclePct: 22, floodVulnerability: 48, roadType: 'arterial', speedLimit: 45, surfaceHealth: 61, potholeRisk: 'High' },
  { id: 'HEX-13', q: 5, r: 1, name: 'Freight Way Toll Plaza', district: 'Logistics Hub', baseStress: 84, trafficVolume: 4900, heavyVehiclePct: 58, floodVulnerability: 50, roadType: 'freight_spur', speedLimit: 45, surfaceHealth: 49, potholeRisk: 'Severe' },
  { id: 'HEX-14', q: 6, r: 1, name: 'Port Access Arterial A', district: 'Harbor District', baseStress: 78, trafficVolume: 4200, heavyVehiclePct: 50, floodVulnerability: 72, roadType: 'freight_spur', speedLimit: 35, surfaceHealth: 54, potholeRisk: 'High' },

  // Row 2
  { id: 'HEX-15', q: 0, r: 2, name: 'Sunset Foothills Bypass', district: 'West Basin', baseStress: 14, trafficVolume: 780, heavyVehiclePct: 4, floodVulnerability: 8, roadType: 'highway', speedLimit: 60, surfaceHealth: 98, potholeRisk: 'Low' },
  { id: 'HEX-16', q: 1, r: 2, name: 'Civic Center Westbound', district: 'Civic District', baseStress: 42, trafficVolume: 2750, heavyVehiclePct: 15, floodVulnerability: 26, roadType: 'urban_corridor', speedLimit: 35, surfaceHealth: 82, potholeRisk: 'Moderate' },
  { id: 'HEX-17', q: 2, r: 2, name: 'Grand Ave Overpass', district: 'Metropolis Core', baseStress: 82, trafficVolume: 4850, heavyVehiclePct: 38, floodVulnerability: 54, roadType: 'bridge', speedLimit: 45, surfaceHealth: 48, potholeRisk: 'High' },
  { id: 'HEX-18', q: 3, r: 2, name: 'Market St Transit Hub', district: 'Metropolis Core', baseStress: 64, trafficVolume: 3950, heavyVehiclePct: 20, floodVulnerability: 38, roadType: 'urban_corridor', speedLimit: 30, surfaceHealth: 70, potholeRisk: 'Moderate' },
  { id: 'HEX-19', q: 4, r: 2, name: 'East Central Viaduct', district: 'Metropolis Core', baseStress: 79, trafficVolume: 4600, heavyVehiclePct: 32, floodVulnerability: 58, roadType: 'bridge', speedLimit: 50, surfaceHealth: 52, potholeRisk: 'High' },
  { id: 'HEX-20', q: 5, r: 2, name: 'Logistics Terminal South', district: 'Logistics Hub', baseStress: 71, trafficVolume: 4100, heavyVehiclePct: 48, floodVulnerability: 46, roadType: 'freight_spur', speedLimit: 35, surfaceHealth: 60, potholeRisk: 'High' },
  { id: 'HEX-21', q: 6, r: 2, name: 'Container Terminal 4', district: 'Harbor District', baseStress: 92, trafficVolume: 5300, heavyVehiclePct: 68, floodVulnerability: 85, roadType: 'freight_spur', speedLimit: 30, surfaceHealth: 38, potholeRisk: 'Severe' },

  // Row 3
  { id: 'HEX-22', q: 0, r: 3, name: 'West Reservoir Causeway', district: 'West Basin', baseStress: 26, trafficVolume: 1350, heavyVehiclePct: 7, floodVulnerability: 32, roadType: 'bridge', speedLimit: 45, surfaceHealth: 90, potholeRisk: 'Low' },
  { id: 'HEX-23', q: 1, r: 3, name: 'Financial District Loop', district: 'Civic District', baseStress: 58, trafficVolume: 3600, heavyVehiclePct: 16, floodVulnerability: 34, roadType: 'urban_corridor', speedLimit: 30, surfaceHealth: 74, potholeRisk: 'Moderate' },
  { id: 'HEX-24', q: 2, r: 3, name: 'Aura Tower Expressway', district: 'Metropolis Core', baseStress: 45, trafficVolume: 2800, heavyVehiclePct: 18, floodVulnerability: 28, roadType: 'highway', speedLimit: 55, surfaceHealth: 81, potholeRisk: 'Moderate' },
  { id: 'HEX-25', q: 3, r: 3, name: 'Transit Corridor B', district: 'Metropolis Core', baseStress: 86, trafficVolume: 5200, heavyVehiclePct: 40, floodVulnerability: 68, roadType: 'arterial', speedLimit: 45, surfaceHealth: 42, potholeRisk: 'Severe' },
  { id: 'HEX-26', q: 4, r: 3, name: 'Riverfront Industrial Link', district: 'East Industrial', baseStress: 62, trafficVolume: 3700, heavyVehiclePct: 36, floodVulnerability: 60, roadType: 'arterial', speedLimit: 40, surfaceHealth: 68, potholeRisk: 'Moderate' },
  { id: 'HEX-27', q: 5, r: 3, name: 'Harbor Express Overpass', district: 'Harbor District', baseStress: 85, trafficVolume: 5050, heavyVehiclePct: 52, floodVulnerability: 78, roadType: 'bridge', speedLimit: 50, surfaceHealth: 45, potholeRisk: 'Severe' },
  { id: 'HEX-28', q: 6, r: 3, name: 'Dockside Pier Terminal', district: 'Harbor District', baseStress: 69, trafficVolume: 3800, heavyVehiclePct: 60, floodVulnerability: 88, roadType: 'freight_spur', speedLimit: 25, surfaceHealth: 63, potholeRisk: 'High' },

  // Row 4
  { id: 'HEX-29', q: 0, r: 4, name: 'Bayside Coastal Arterial', district: 'West Basin', baseStress: 34, trafficVolume: 1950, heavyVehiclePct: 10, floodVulnerability: 45, roadType: 'arterial', speedLimit: 45, surfaceHealth: 86, potholeRisk: 'Low' },
  { id: 'HEX-30', q: 1, r: 4, name: 'Old Town Heritage Way', district: 'South Suburbs', baseStress: 39, trafficVolume: 2300, heavyVehiclePct: 12, floodVulnerability: 30, roadType: 'urban_corridor', speedLimit: 25, surfaceHealth: 78, potholeRisk: 'Low' },
  { id: 'HEX-31', q: 2, r: 4, name: 'Boulevard of the Republic', district: 'Civic District', baseStress: 44, trafficVolume: 2700, heavyVehiclePct: 15, floodVulnerability: 25, roadType: 'arterial', speedLimit: 40, surfaceHealth: 83, potholeRisk: 'Moderate' },
  { id: 'HEX-32', q: 3, r: 4, name: 'Central Valley Connector', district: 'Metropolis Core', baseStress: 55, trafficVolume: 3300, heavyVehiclePct: 24, floodVulnerability: 40, roadType: 'highway', speedLimit: 60, surfaceHealth: 75, potholeRisk: 'Moderate' },
  { id: 'HEX-33', q: 4, r: 4, name: 'Steel Mill Access Road', district: 'East Industrial', baseStress: 76, trafficVolume: 4150, heavyVehiclePct: 62, floodVulnerability: 52, roadType: 'freight_spur', speedLimit: 35, surfaceHealth: 56, potholeRisk: 'High' },
  { id: 'HEX-34', q: 5, r: 4, name: 'Customs Inland Yard', district: 'Logistics Hub', baseStress: 60, trafficVolume: 3400, heavyVehiclePct: 44, floodVulnerability: 48, roadType: 'freight_spur', speedLimit: 35, surfaceHealth: 71, potholeRisk: 'Moderate' },
  { id: 'HEX-35', q: 6, r: 4, name: 'South Port Gate 9', district: 'Harbor District', baseStress: 67, trafficVolume: 3650, heavyVehiclePct: 54, floodVulnerability: 80, roadType: 'freight_spur', speedLimit: 30, surfaceHealth: 66, potholeRisk: 'Moderate' },

  // Row 5
  { id: 'HEX-36', q: 0, r: 5, name: 'Marina Shoreline Way', district: 'West Basin', baseStress: 20, trafficVolume: 1100, heavyVehiclePct: 5, floodVulnerability: 55, roadType: 'arterial', speedLimit: 35, surfaceHealth: 92, potholeRisk: 'Low' },
  { id: 'HEX-37', q: 1, r: 5, name: 'Southern Green Beltway', district: 'South Suburbs', baseStress: 24, trafficVolume: 1450, heavyVehiclePct: 8, floodVulnerability: 22, roadType: 'highway', speedLimit: 65, surfaceHealth: 91, potholeRisk: 'Low' },
  { id: 'HEX-38', q: 2, r: 5, name: 'Commerce Park Loop', district: 'South Suburbs', baseStress: 38, trafficVolume: 2150, heavyVehiclePct: 14, floodVulnerability: 20, roadType: 'urban_corridor', speedLimit: 40, surfaceHealth: 85, potholeRisk: 'Low' },
  { id: 'HEX-39', q: 3, r: 5, name: 'South Metro Intertie', district: 'South Suburbs', baseStress: 49, trafficVolume: 2950, heavyVehiclePct: 22, floodVulnerability: 36, roadType: 'highway', speedLimit: 55, surfaceHealth: 80, potholeRisk: 'Moderate' },
  { id: 'HEX-40', q: 4, r: 5, name: 'Chemical Basin Spur', district: 'East Industrial', baseStress: 70, trafficVolume: 3750, heavyVehiclePct: 58, floodVulnerability: 65, roadType: 'freight_spur', speedLimit: 30, surfaceHealth: 62, potholeRisk: 'High' },
  { id: 'HEX-41', q: 5, r: 5, name: 'Rail Freight Depot 3', district: 'East Industrial', baseStress: 59, trafficVolume: 3200, heavyVehiclePct: 46, floodVulnerability: 44, roadType: 'freight_spur', speedLimit: 35, surfaceHealth: 73, potholeRisk: 'Moderate' },
  { id: 'HEX-42', q: 6, r: 5, name: 'Fishermans Wharf Pierway', district: 'Harbor District', baseStress: 32, trafficVolume: 1700, heavyVehiclePct: 12, floodVulnerability: 76, roadType: 'urban_corridor', speedLimit: 25, surfaceHealth: 88, potholeRisk: 'Low' },

  // Row 6
  { id: 'HEX-43', q: 0, r: 6, name: 'South Peninsula Highway', district: 'South Suburbs', baseStress: 16, trafficVolume: 890, heavyVehiclePct: 6, floodVulnerability: 18, roadType: 'highway', speedLimit: 65, surfaceHealth: 95, potholeRisk: 'Low' },
  { id: 'HEX-44', q: 1, r: 6, name: 'Cross-County Connector', district: 'South Suburbs', baseStress: 27, trafficVolume: 1550, heavyVehiclePct: 10, floodVulnerability: 16, roadType: 'highway', speedLimit: 60, surfaceHealth: 89, potholeRisk: 'Low' },
  { id: 'HEX-45', q: 2, r: 6, name: 'Valley Farm Road', district: 'South Suburbs', baseStress: 21, trafficVolume: 1150, heavyVehiclePct: 15, floodVulnerability: 28, roadType: 'arterial', speedLimit: 45, surfaceHealth: 93, potholeRisk: 'Low' },
  { id: 'HEX-46', q: 3, r: 6, name: 'Southgate Toll Plaza', district: 'South Suburbs', baseStress: 43, trafficVolume: 2600, heavyVehiclePct: 26, floodVulnerability: 30, roadType: 'highway', speedLimit: 50, surfaceHealth: 82, potholeRisk: 'Moderate' },
  { id: 'HEX-47', q: 4, r: 6, name: 'Eco-Corridor Greenpath', district: 'East Industrial', baseStress: 25, trafficVolume: 1300, heavyVehiclePct: 8, floodVulnerability: 35, roadType: 'arterial', speedLimit: 40, surfaceHealth: 91, potholeRisk: 'Low' },
  { id: 'HEX-48', q: 5, r: 6, name: 'Southeast Bypass Way', district: 'East Industrial', baseStress: 37, trafficVolume: 2050, heavyVehiclePct: 20, floodVulnerability: 38, roadType: 'highway', speedLimit: 60, surfaceHealth: 87, potholeRisk: 'Low' },
  { id: 'HEX-49', q: 6, r: 6, name: 'Cape Lighthouse Causeway', district: 'Harbor District', baseStress: 29, trafficVolume: 1400, heavyVehiclePct: 9, floodVulnerability: 82, roadType: 'bridge', speedLimit: 35, surfaceHealth: 89, potholeRisk: 'Low' },
];

export const MOCK_ROUTES: Record<string, RouteOption[]> = {
  driver: [
    {
      id: 'route-a',
      name: 'Route A — Selfish Fast (Grand Ave / Sector 7G)',
      durationMin: 14,
      distanceMiles: 8.4,
      stressScore: 89,
      structuralImpact: 'Critical Degradation',
      isRecommended: false,
      tag: 'Conventional GPS — High Asphalt Fatigue',
      pathHexIds: ['HEX-08', 'HEX-09', 'HEX-10', 'HEX-11', 'HEX-12', 'HEX-13']
    },
    {
      id: 'route-b',
      name: 'Route B — StrataGrid Cooperative (Civic Bypass)',
      durationMin: 16,
      distanceMiles: 9.1,
      stressScore: 28,
      structuralImpact: 'Minimal Impact (Eco-Protect)',
      isRecommended: true,
      tag: 'Recommended (+2 min, Saves 42% road wear)',
      pathHexIds: ['HEX-08', 'HEX-15', 'HEX-16', 'HEX-24', 'HEX-32', 'HEX-34']
    }
  ]
};

export const MOCK_CASE_STUDIES: CaseStudy[] = [
  {
    id: 'cs-1',
    title: 'Metropolis Core Highway Grid',
    summary: 'Predictive asphalt stress monitoring & load-balanced routing deployed across 128 highway segments.',
    problem: 'Peak-hour commuter bottlenecking caused accelerated shear strain and recurrent pothole outbreaks along the central elevated viaduct.',
    solution: 'StrataGrid shifted 28% of light passenger flow to peripheral civic arterials, preventing sub-base micro-cracking and saving $1.9M in seasonal repaving.',
    location: 'Metropolis Core, Sector 7-12',
    timeframe: '12-Month Field Pilot',
    metrics: [
      { label: 'Fatigue Stress', value: '-32.4%' },
      { label: 'Pothole Incursions', value: '-84%' },
      { label: 'Peak Delay Variance', value: '+1.8 min' },
      { label: 'Annual Savings', value: '$1.9M' }
    ],
    quote: {
      text: 'StrataGrid allowed us to proactively protect our most fragile elevated corridors before catastrophic asphalt failure occurred.',
      author: 'David Chen',
      role: 'Chief Transportation Engineer, Department of Mobility'
    }
  },
  {
    id: 'cs-2',
    title: 'Harbor Logistics & Port Access',
    summary: 'Moisture-aware freight scheduling and dynamic heavy axle balancing during tropical storm seasons.',
    problem: 'Saturated subgrade conditions combined with Class 8 container trucks caused rapid hydraulic pumping and severe rutting.',
    solution: 'Real-time Doppler precipitation integration redirected vehicles >15T onto reinforced concrete bypasses until sub-base moisture dropped below 45%.',
    location: 'Harbor Basin & Port Terminals',
    timeframe: '8-Month Deployment',
    metrics: [
      { label: 'Sub-base Pumping', value: '-91%' },
      { label: 'Heavy Axle Compliance', value: '98.2%' },
      { label: 'Structural Lifespan', value: '3.8x' },
      { label: 'Maintenance ROI', value: '440%' }
    ],
    quote: {
      text: 'Dynamic moisture gating stopped chronic road degradation in its tracks without stalling port logistics operations.',
      author: 'Capt. Sarah Jenkins',
      role: 'Director of Harbor Infrastructure & Logistics'
    }
  },
  {
    id: 'cs-3',
    title: 'Valley Commuter Arterial Network',
    summary: 'Cooperative multi-objective traffic routing replacing conventional selfish GPS navigation.',
    problem: 'Navigation apps funneled thousands of morning commuters through residential side streets not engineered for high-frequency dynamic loads.',
    solution: 'StrataGrid Cooperative API balanced commuters across three structurally resilient corridors, preserving neighborhood road integrity.',
    location: 'West Valley & Civic District',
    timeframe: '18-Month Continuous Run',
    metrics: [
      { label: 'Residential Cut-Through', value: '-78%' },
      { label: 'Road Base Integrity', value: '+42%' },
      { label: 'CO2 Idle Emissions', value: '-14.6%' },
      { label: 'Citizen Satisfaction', value: '94%' }
    ],
    quote: {
      text: 'By considering civil engineering limits alongside travel time, our city avoided millions in emergency neighborhood repairs.',
      author: 'Marcus Aurelius Vance',
      role: 'Director of Urban Resilience'
    }
  }
];

export const MOCK_TEAM: TeamMember[] = [
  {
    id: 'tm-1',
    name: 'Karthik Prakash',
    role: 'Lead Architect & Systems Engineer',
    specialty: 'Distributed Traffic Orchestration & React Systems',
    bio: 'Lead architect of StrataGrid AI. Specializes in real-time distributed systems, high-throughput IoT sensor stream ingestion, and Pareto-optimal cooperative routing engine development.',
    avatarUrl: karthikAvatar,
    github: 'https://github.com/12karthikpra',
    linkedin: 'https://linkedin.com'
  },
  {
    id: 'tm-2',
    name: 'Nirvan Joneja',
    role: 'Edge Computing & IoT Systems Lead',
    specialty: 'Piezoelectric WIM Telemetry & Distributed Sensors',
    bio: 'Pioneers edge micro-controllers and NTCIP 1202 traffic signal actuation. Specializes in sub-millisecond edge telemetry pipelines connecting Weigh-In-Motion sensors to spatial neural networks.',
    avatarUrl: nirvanAvatar,
    github: 'https://github.com',
    linkedin: 'https://linkedin.com'
  },
  {
    id: 'tm-3',
    name: 'Arijit Ujjwal',
    role: 'Geotechnical ML & Optimization Lead',
    specialty: 'AASHTO Fatigue Dynamics & Pareto Routing',
    bio: 'Machine learning specialist focused on real-time finite element asphalt stress tensors, fourth-power load dissipation models, and multi-objective routing algorithms for heavy freight corridors.',
    avatarUrl: arijitAvatar,
    github: 'https://github.com',
    linkedin: 'https://linkedin.com'
  },
  {
    id: 'tm-4',
    name: 'Iha Pradhan',
    role: 'Spatial Intelligence & Algorithms Lead',
    specialty: 'Uber H3 Hexagonal Discretization & Graph Neural Networks',
    bio: 'Expert in discrete global grid systems (DGGS) and spatial optimization. Designs hierarchical Uber H3 Resolution 8/9 spatial graphs and cooperative traffic rerouting pipelines.',
    avatarUrl: ihaAvatar,
    github: 'https://github.com',
    linkedin: 'https://linkedin.com'
  },
  {
    id: 'tm-5',
    name: 'Kalindi Joshi',
    role: 'Civil Infrastructure & Pavement Dynamics Lead',
    specialty: 'Subgrade Hydrology & Hydraulic Pumping Modeling',
    bio: 'Geotechnical and civil engineering specialist researching Darcy subgrade pore-water pressure dynamics, pavement condition indices (PCI), and automated structural lifecycle optimization.',
    avatarUrl: kalindiAvatar,
    github: 'https://github.com',
    linkedin: 'https://linkedin.com'
  }
];

export const INITIAL_TEAM_MEMBERS = MOCK_TEAM;

export const MOCK_GALLERY: GalleryItem[] = [
  {
    id: 'gal-1',
    title: 'H3 Hexagonal Sensor Overlay',
    caption: 'Real-time telemetry feeds mapping stress across Metropolis arterial grid.',
    category: 'sensor',
    location: 'Metropolis North Corridor',
    imageUrl: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'gal-2',
    title: 'Sub-surface Moisture Thermal Scan',
    caption: 'Acoustic & ground-penetrating radar detecting water pockets beneath asphalt.',
    category: 'traffic',
    location: 'Harbor Gate 4',
    imageUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'gal-3',
    title: 'Pre-emptive Pothole Detection',
    caption: 'Automated high-frequency vibration sensors logging shear stress before asphalt fracture.',
    category: 'pothole',
    location: 'Sector 7G Flyover Deck',
    imageUrl: 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'gal-4',
    title: 'Autonomous Drone Surface Scan',
    caption: 'LiDAR-equipped drones performing overnight laser profilometry on bridge deck seams.',
    category: 'bridge',
    location: 'Grand Ave Viaduct',
    imageUrl: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'gal-5',
    title: 'Heavy Freight Axle Load Balancing',
    caption: 'Weigh-in-motion sensors dynamically calculating bridge resonance and weight classes.',
    category: 'sensor',
    location: 'Logistics Bypass East',
    imageUrl: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'gal-6',
    title: 'Monsoon Dynamic Flood Defense',
    caption: 'Micro-drainage routing preventing structural washouts during high precipitation.',
    category: 'traffic',
    location: 'Riverfront Parkway',
    imageUrl: 'https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?auto=format&fit=crop&w=800&q=80'
  }
];

export const INITIAL_GALLERY_ITEMS = MOCK_GALLERY;

export const INITIAL_TERMINAL_LOGS: TerminalLog[] = [
  { id: 'log-1', timestamp: '08:42:11', level: 'info', message: 'NODE_ALPHA: Establishing secure telemetry handshake with 49 H3 spatial cells...' },
  { id: 'log-2', timestamp: '08:42:12', level: 'success', message: 'SYS: Telemetry handshake verified. Streaming 4.2M sensor data points.' },
  { id: 'log-3', timestamp: '08:42:15', level: 'warn', message: 'WARN: High friction coefficient detected in Sector 7G transit corridor.' },
  { id: 'log-4', timestamp: '08:42:16', level: 'info', message: 'AI_CORE: Rerouting optimization algorithms initiated for 1,432 vehicles.' },
  { id: 'log-5', timestamp: '08:42:20', level: 'success', message: 'OPTIMIZATION: Arterial stress reduced by 34.6%. Surface lifespan protected.' }
];

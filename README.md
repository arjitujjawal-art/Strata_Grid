# StrataGrid AI

### Predicting Road Stress. Protecting Cities. Powering Smarter Traffic.

StrataGrid AI is an **AI-driven infrastructure intelligence and cooperative traffic-routing platform** designed to address urban road deterioration, traffic congestion, and inefficient infrastructure utilization.

The platform combines **real-time IoT telemetry, pavement mechanics, geotechnical hydrology, spatial intelligence, machine learning, and multi-objective routing** to predict road degradation and dynamically distribute traffic across structurally resilient corridors.

---

## 🚨 Problem Statement

Modern navigation systems primarily optimize for **individual travel time**, often directing large volumes of vehicles toward the same roads without considering their structural vulnerability.

This creates a significant infrastructure problem:

* Heavy freight vehicles exponentially increase pavement fatigue.
* Rainfall and subgrade saturation reduce road load-bearing capacity.
* Conventional GPS systems are largely unaware of pavement stress and hydrological conditions.
* Traffic concentration accelerates pothole formation and structural deterioration.
* Municipalities are forced to rely on expensive **reactive road maintenance**.

StrataGrid AI addresses this **navigation-infrastructure paradox** by incorporating road health directly into traffic-routing decisions.

---

## 💡 Solution

StrataGrid AI introduces a **cooperative routing paradigm** that balances:

> **Travel Time + Pavement Stress + Environmental Conditions**

Instead of always selecting the shortest route, the system identifies routes that minimize both commuter delay and cumulative infrastructure degradation.

A route that adds only a few minutes to a journey can significantly reduce structural stress and extend pavement lifespan.

---

## 🎯 Key Objectives

* Predict pavement fatigue and pothole formation before catastrophic failure.
* Incorporate vehicle axle weight into road-stress calculations.
* Integrate rainfall and subgrade moisture into infrastructure analysis.
* Distribute traffic across structurally resilient road corridors.
* Dynamically manage heavy-freight movement.
* Reduce emergency road-repair expenditure.
* Provide municipalities with real-time infrastructure intelligence.
* Create an infrastructure-aware alternative to conventional GPS routing.

---

## 🧠 Core Technology

StrataGrid AI is built around four primary architectural pillars:

### 1. Real-Time IoT Telemetry

The system ingests infrastructure and environmental data from:

* Weigh-In-Motion (WIM) sensors
* Fiber-optic acoustic strain gauges
* Ground-penetrating radar
* Doppler weather radar
* Autonomous LiDAR systems
* Traffic signal telemetry

These data streams provide information regarding axle loads, structural vibrations, rainfall, moisture, and pavement conditions.

---

### 2. H3 Spatial Intelligence

The city is divided into **Uber H3 hexagonal spatial cells**.

Each spatial cell can maintain dynamic infrastructure attributes such as:

* Traffic volume
* Road stress
* Freight percentage
* Flood vulnerability
* Pavement condition

H3 enables efficient spatial indexing and rapid neighborhood-based traffic analysis.

---

### 3. Cooperative Routing Engine

Unlike conventional shortest-path routing, StrataGrid uses **Pareto multi-objective optimization**.

The routing objective considers:

```text
Route Cost = α × Travel Time + β × Road Stress
```

This allows the platform to identify routes that provide an optimal balance between commuter efficiency and infrastructure preservation.

---

### 4. Predictive AI & Forensics

The AI layer provides:

* Pothole-risk prediction
* Pavement distress classification
* Road-quality analysis
* Infrastructure forecasting
* Multimodal image analysis
* Maintenance-impact estimation

The platform can predict potential road failures **2–6 weeks in advance** according to the project design.

---

# ⚙️ Technical Pipeline

StrataGrid AI follows an eight-stage infrastructure intelligence pipeline:

```text
IoT Sensor Ingestion
        ↓
H3 Spatial Discretization
        ↓
Stress Tensor Computation
        ↓
Hydrology Fusion
        ↓
AI Fatigue Forecasting
        ↓
Pareto Route Optimization
        ↓
Dynamic Traffic Gating
        ↓
Municipal Command Center
```

### Stage 1 — IoT Sensor Ingestion

Collects WIM, acoustic strain, radar, and environmental telemetry.

### Stage 2 — H3 Discretization

Maps incoming data into H3 spatial cells.

### Stage 3 — Stress Tensor Engine

Calculates pavement stress using traffic loading and pavement mechanics.

### Stage 4 — Hydrology Fusion

Combines precipitation and subgrade saturation data.

### Stage 5 — AI Fatigue Forecasting

Predicts potential pavement failure and pothole formation.

### Stage 6 — Pareto Optimization

Balances travel-time efficiency against infrastructure stress.

### Stage 7 — Dynamic Traffic Gating

Controls traffic flow and heavy-freight routing based on road conditions.

### Stage 8 — Municipal Command

Provides real-time visualization, alerts, and infrastructure analytics.

---

# 📊 Cooperative Routing Example

StrataGrid demonstrates the difference between conventional GPS routing and infrastructure-aware routing.

| Parameter             |  Conventional GPS | StrataGrid AI |
| --------------------- | ----------------: | ------------: |
| Travel Time           |            14 min |        16 min |
| Distance              |         8.4 miles |     9.1 miles |
| Road Stress           |               89% |           28% |
| Traffic Concentration | 5,120 vehicles/hr |   Distributed |
| Infrastructure Impact |              High |           Low |
| Pavement Fatigue      |       Accelerated |       Reduced |

The StrataGrid route introduces approximately **2 minutes of additional travel time** while significantly reducing road stress and distributing traffic across resilient corridors.

---

# 🌧️ Weather-Aware Infrastructure Intelligence

Rainfall can significantly affect pavement performance by increasing **subgrade moisture and pore-water pressure**.

StrataGrid integrates precipitation information with infrastructure telemetry to identify roads that become vulnerable during heavy rainfall.

The system can therefore:

* Detect waterlogged corridors.
* Identify vulnerable subgrades.
* Restrict heavy freight from high-risk roads.
* Redirect traffic toward resilient corridors.
* Reduce hydraulic pumping and pavement deterioration.

---

# 🚛 Freight Intelligence

Heavy commercial vehicles produce substantially greater pavement damage than ordinary passenger vehicles because pavement damage increases exponentially with axle loading.

StrataGrid therefore differentiates between:

* Passenger vehicles
* Light commercial vehicles
* Heavy freight vehicles

Heavy-freight corridors can be dynamically redirected during periods of high structural or hydrological vulnerability.

---

# 🔬 AI Road Forensics

StrataGrid includes a multimodal road-quality verification system.

### Workflow

```text
Road Damage Photograph
          +
Traffic & Environmental Data
          ↓
AI Vision Analysis
          ↓
Geotechnical Cross-Validation
          ↓
Pavement Condition Scorecard
```

The system analyzes visual indicators such as:

* Potholes
* Fatigue cracking
* Rutting
* Aggregate stripping
* Surface distress
* Void formation

The resulting forensic analysis can generate indicators such as:

* Pavement Condition Index (PCI)
* Peak shear strain
* Subgrade pumping risk
* Projected fatigue reduction

---

# 🖥️ Digital Twin Dashboard

The platform provides an interactive **H3-based digital twin** of the transportation network.

The dashboard represents:

* 49 spatial sectors
* Traffic volume
* Dynamic road stress
* Freight percentage
* Flood vulnerability
* Environmental conditions
* Traffic rerouting
* Infrastructure alerts

### Environmental Simulation

The system can simulate scenarios such as:

* Monsoon surge
* Heavy freight rush
* Road or viaduct closure
* Traffic-gridlock conditions

This allows infrastructure authorities to evaluate potential consequences before implementing traffic interventions.

---

# 🤖 AI Copilot

StrataGrid incorporates **Google Gemini 2.5 Flash** as an AI copilot for infrastructure and transportation queries.

The AI layer is designed to reason about:

* Pavement mechanics
* AASHTO loading models
* Subgrade hydrology
* Traffic stress
* Spatial routing
* Infrastructure conditions
* Traffic signal management

The platform also includes a deterministic fallback mechanism for environments where an external AI API is unavailable.

---

# 🏗️ System Architecture

```text
                  ┌─────────────────────┐
                  │   IoT Sensor Layer  │
                  │ WIM / Strain / GPR  │
                  │ Weather / LiDAR     │
                  └──────────┬──────────┘
                             │
                             ▼
                  ┌─────────────────────┐
                  │   H3 Spatial Grid   │
                  └──────────┬──────────┘
                             │
                             ▼
              ┌──────────────────────────────┐
              │ Stress & Hydrology Engine    │
              │ ESAL / Shear / Moisture      │
              └──────────────┬───────────────┘
                             │
                             ▼
                  ┌─────────────────────┐
                  │   AI Prediction     │
                  │ Fatigue / Potholes  │
                  └──────────┬──────────┘
                             │
                             ▼
                ┌──────────────────────────┐
                │ Pareto Routing Engine    │
                │ Time + Road Stress       │
                └────────────┬─────────────┘
                             │
              ┌──────────────┴──────────────┐
              ▼                             ▼
      ┌────────────────┐           ┌─────────────────┐
      │ Navigation API │           │ Municipal       │
      │ & Drivers      │           │ Command Center  │
      └────────────────┘           └─────────────────┘
```

---

# 🛠️ Tech Stack

## Frontend

* React 19
* TypeScript 5.8
* Vite 6
* Tailwind CSS v4
* Motion
* Lucide React
* Canvas 2D

## Backend & AI

* Express 4
* TypeScript
* Google Gemini 2.5 Flash
* Server-Sent Events (SSE)
* REST APIs
* Rate Limiting
* Multimodal AI processing
* Deterministic fallback engine

## Spatial & Mathematical Layer

* Uber H3
* H3-JS
* Canvas 2D
* WebGL
* AASHTO ESAL mechanics
* Darcy hydrology modelling

---

# 📈 Expected Impact

According to the project simulations and case studies, StrataGrid targets substantial improvements in infrastructure preservation:

| Metric                    | Targeted Impact |
| ------------------------- | --------------: |
| Asphalt fatigue reduction |             42% |
| Pothole reduction         |             84% |
| Infrastructure lifespan   |            3.8× |
| Annual municipal savings  |           $1.9M |
| Maintenance ROI           |            440% |
| Average commute impact    |          +2 min |

These figures represent the project's stated pilot/simulation outcomes and should be interpreted within the assumptions of the presented case studies.

---

# 🧪 Case Studies

### Metropolis Core Highway Grid

A 12-month pilot across 128 highway segments focused on peak-hour bottlenecks and elevated viaduct deterioration.

**Reported outcomes:**

* 32.4% reduction in fatigue stress
* 84% reduction in pothole outbreaks
* $1.9M annual repaving savings

### Harbor Logistics & Port Access

The system addressed heavy freight movement across waterlogged subgrades.

**Reported outcomes:**

* 91% reduction in subgrade pumping
* 98.2% heavy-axle compliance
* 440% maintenance ROI

### Valley Commuter Arterial Network

Cooperative routing redistributed commuter traffic across resilient corridors.

**Reported outcomes:**

* 78% reduction in cut-through traffic
* 42% improvement in road-base integrity
* 94% citizen satisfaction

---

# 🚀 Future Roadmap

### Phase 1 — MVP

* H3 digital twin
* AI infrastructure copilot
* Multimodal forensic analysis
* Cooperative routing prototype

### Phase 2 — Municipal Pilot

* Real-world WIM sensor integration
* NTCIP traffic signal integration
* Live municipal infrastructure data

### Phase 3 — Navigation SDK

* Commercial routing API
* Integration with navigation applications
* Fleet-management integration
* Autonomous-vehicle infrastructure awareness

---

# 👥 Team

**StrataOPS**

* **Karthik Prakash** — Lead Architect & Systems Engineer
* **Nirvan Joneja** — Edge Computing & IoT Systems Lead
* **Arijit Ujjwal** — Geotechnical ML & Optimization Lead
* **Iha Pradhan** — Spatial Intelligence & Algorithms Lead
* **Kalindi Joshi** — Civil Infrastructure & Pavement Dynamics Lead

---

# 🌐 Live Demo

**Deployed Application:**

https://strata-grid.onrender.com/

> Note: The deployment may require the Render service to be active before the application becomes accessible.

---

# 📂 Project Concept

StrataGrid AI transforms conventional **reactive road maintenance** into **predictive infrastructure management**.

The fundamental principle is:

> **The best road repair is the one that never needs to happen.**

By integrating infrastructure health directly into mobility decisions, StrataGrid AI aims to create a transportation ecosystem where **traffic optimization and infrastructure preservation operate as a unified system**.

---

## 📜 License

This project is an academic/prototype implementation developed by **Team StrataOPS**.

© 2026 StrataGrid AI — Team StrataOPS


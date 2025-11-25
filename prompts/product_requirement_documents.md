# Product Requirements Document (PRD): LLM Energy Cost Calculator
**Version 1.0 – GitHub Pages Static Site (No Database)**

---

## 1. Purpose & Goals

- Provide a transparent, side-by-side comparison of electricity usage, energy cost, and (optional) carbon footprint for LLM inference using a QNAP TS-464eU server and a PC.
- Enable users to customize device specs in-session (CPU, GPU, RAM/VRAM, wattage, rate, address, etc.) and see live cost, energy, and map updates.
- Deliver a modern, visually appealing, responsive UI (Stripe-style glassomorphism), accessible across desktop and mobile.

---

## 2. Target Users

- AI/ML professionals running models locally.
- Home lab/NAS owners and small businesses.
- Gamers/prosumers curious about energy cost/impact.
- Climate-conscious infrastructure planners.

---

## 3. Core Features & Requirements

### 3.1 UI & Visual Design

- **Two Fixed Device Cards/Panels:**
    - **Width Constraints:**
        - Together have minimum width of **960px**, scaling up to 100% of screen width, but never truncated or obscured.
        - Card widths remain visually balanced and ≤half the display width when possible.
    - **Desktop:** Side-by-side (≥960px).
    - **Mobile:** Single device card view, switchable by tab/button/swipe. Comparison summary always accessible.
    - On screens <960px, layout stacks, switches to single card, or allows horiz. scrolling only when unavoidable.
    - **Glassomorphism styling** for all panels, summaries, and modals.

### 3.2 Device Inputs (per card/panel)

- Device Name (required, editable)
- Description (optional, editable)
- Address (with sample default; required for location-aware rate/map; editable)
- Interactive Map Pin (Leaflet.js + OSM, no API key, live)
- CPU
    - QNAP Server default: Intel Celeron N5105 (4C/4T, 2.9 GHz)
    - PC default: Intel Core i7-13700K (editable)
- GPU
    - QNAP Server default: None
    - PC default: NVIDIA RTX 3070 (editable)
- RAM/VRAM
    - QNAP Server default: 8GB RAM
    - PC default: 32GB RAM / 8GB VRAM (editable)
- Device Type (read-only: "Server/NAS" or "PC")
- Min Wattage
    - QNAP default: 21.1W
    - PC default: 65W (editable)
- Max Wattage
    - QNAP default: 35.3W
    - PC default: 350W (editable)
- Electricity Rate ($/kWh, NY avg 0.23 by default; editable)
- Carbon Intensity (gCO₂/kWh, US avg 185 by default; editable)
- **Validation:** Device Name and Address required, wattage >0 & <2000, rate >0 & <1.

### 3.3 Default Device Specs

#### QNAP Server (TS-464eU):

| Field           | Value                                     |
|-----------------|-------------------------------------------|
| Device Name     | QNAP Server                               |
| Description     | QNAP TS-464eU – Compact 1U NAS            |
| Address         | 1 Main St, White Plains, NY, USA          |
| CPU             | Intel Celeron N5105 (4C/4T, up to 2.9 GHz)|
| GPU             | None                                      |
| RAM/VRAM        | 8GB RAM                                   |
| Device Type     | Server/NAS                                |
| Min Wattage     | 21.1W                                     |
| Max Wattage     | 35.3W                                     |
| Electricity Rate| 0.23 $/kWh                                |
| Carbon Intensity| 185 gCO₂/kWh                              |

#### PC:

| Field           | Value                                        |
|-----------------|----------------------------------------------|
| Device Name     | PC                                           |
| Description     | Intel Core i7 Gaming PC, RTX GPU             |
| Address         | 123 Broad St, White Plains, NY, USA          |
| CPU             | Intel Core i7-13700K (8P+8E, up to 5.4 GHz)  |
| GPU             | NVIDIA RTX 3070                              |
| RAM/VRAM        | 32GB RAM / 8GB VRAM                          |
| Device Type     | PC                                           |
| Min Wattage     | 65W                                          |
| Max Wattage     | 350W                                         |
| Electricity Rate| 0.23 $/kWh                                   |
| Carbon Intensity| 185 gCO₂/kWh                                 |

---

### 3.4 Device System

- Only QNAP Server & PC cards—pre-populated, both are editable during the session.
- No user accounts/profile management; values reset on page reload.
- Edits update all calculations, maps, and summary in real time.

---

### 3.5 Calculation Outputs

- kWh/hr (min/max), cost per hour/day/week/month, CO₂ impact per unit time (device panel).
- Comparison table/chart dynamically comparing both devices (cost/energy/CO₂).
- Interactive map: both markers display on desktop, only active card's marker on mobile.
- Instant updates for all edits.

**Formula for Cost Calculation:**
\[
\text{Cost per hour} = \left(\frac{\text{Wattage}}{1000}\right) \times \text{Electricity Rate}
\]
Where Wattage is in watts and Electricity Rate is $/kWh.

For longer periods:
\[
\text{Cost per day} = \text{Cost per hour} \times 24
\]
\[
\text{Cost per week} = \text{Cost per day} \times 7
\]
\[
\text{Cost per month} = \text{Cost per day} \times 30
\]

---

### 3.6 Accessibility & Usability

- Fully keyboard-navigable, ARIA-labeled.
- AAA contrast, scalable fonts (rem/em).
- Live region updates for all dynamic changes.
- Modal dialogs trap focus.
- Never truncated/horizontally hidden content on standard desktop (>960px min-width).

---

## 4. Technical Requirements

- HTML/CSS/JS/TS, client-side only.
- Deploy on GitHub Pages.
- Responsive with enforced minimum width (960px) and mobile-first breakpoints.
- Map: Leaflet.js + OSM; geocoding with Nominatim.
- All fields validated; instant update of charts, tables, and map.
- Vitest for testing; CI coverage ≥80%.
- No backend/server/API keys, fully static site.

---

## 5. User Stories

### As a desktop user
- I can compare QNAP Server and PC panels side-by-side if my screen is ≥960px.
- Edit specs for both, view instant calculations/map/chart updates.
- See both addresses shown as map markers for compare.

### As a mobile user
- Switch between device cards with tabs/buttons/swipe.
- Edit all specs; see cost/energy for both devices.
- Summary and map always available and fully responsive.

### As any user
- I get immediate validation feedback on required fields and sensible ranges.
- My edits persist for the session and reset on reload.
- Tooltips/help for complex fields.
- Error feedback on geocoding (address) issues.

---

## 6. Acceptance Criteria & Metrics

- Desktop: Two editable cards side-by-side at ≥960px, up to 100% of display width.
- Mobile: Switchable card views, summary always available, responsive layout.
- All specs (CPU, GPU, VRAM, wattage, etc.) visible/editable.
- Maps, charts, and summary update on every change.
- Formula used for all cost calculations as specified.
- No backend/API keys; 100% client-side logic.
- 80%+ test coverage, accessibility passes, never truncated content.

---

**All PRD functional, technical, polish, and responsive layout requirements are now specified and guaranteed for Version 1.0.**

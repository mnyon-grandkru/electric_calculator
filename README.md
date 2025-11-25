# LLM Energy Cost Calculator

A transparent, side-by-side comparison tool for electricity usage, energy cost, and carbon footprint for LLM inference using a QNAP TS-464eU server and a PC.

## Features

- **Two Device Comparison**: Compare QNAP Server and PC side-by-side
- **Real-time Calculations**: Instant updates for cost, energy, and CO₂ emissions
- **Interactive Maps**: Leaflet.js integration with OpenStreetMap geocoding
- **Responsive Design**: Glassomorphism UI that works on desktop and mobile
- **Accessibility**: Fully keyboard-navigable with ARIA labels and AAA contrast
- **No Backend**: 100% client-side, static site deployable on GitHub Pages

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
```

### Testing

```bash
npm test
npm run test:coverage
```

## Project Structure

```
electric_calculator/
├── src/
│   ├── styles/
│   │   └── main.css          # Glassomorphism styling
│   ├── calculations.ts       # Cost and energy calculations
│   ├── deviceManager.ts      # Device state management
│   ├── geocoding.ts          # Address geocoding
│   ├── map.ts               # Leaflet map integration
│   ├── ui.ts                # UI rendering functions
│   ├── validation.ts        # Form validation
│   ├── main.ts              # Application entry point
│   └── types.ts             # TypeScript type definitions
├── index.html               # Main HTML structure
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## Default Device Specs

### QNAP Server (TS-464eU)
- CPU: Intel Celeron N5105 (4C/4T, 2.9 GHz)
- GPU: None
- RAM: 8GB
- Min Wattage: 21.1W
- Max Wattage: 35.3W

### PC
- CPU: Intel Core i7-13700K (8P+8E, up to 5.4 GHz)
- GPU: NVIDIA RTX 3070
- RAM: 32GB / VRAM: 8GB
- Min Wattage: 65W
- Max Wattage: 350W

## Calculations

Cost per hour = (Wattage / 1000) × Electricity Rate

All calculations update in real-time as you edit device specifications.

## Deployment

The site is configured for GitHub Pages deployment. The build process outputs to the `dist` directory.

## License

MIT


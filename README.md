# logisticsiag

Next.js ops console for IAG last-mile delivery (mock data, no backend).

Companion rider app: [logistics-app](https://github.com/OlaroPeterCelestine/logistics-app) (IAG Rider).

## Run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Surfaces

| Route | Purpose |
|-------|---------|
| `/` | Overview KPIs, trends, activity |
| `/live-map` | Live map (OpenStreetMap / Leaflet) |
| `/dispatch` | Assign unassigned orders to riders |
| `/deliveries` | Orders table + detail `/deliveries/[id]` |
| `/deliveries/new` | Create order (frontend only) |
| `/riders` | Rider roster + detail |
| `/merchants` | Merchant accounts |
| `/zones` | Zones & hubs |
| `/issues` | Exception triage |
| `/sla` | Performance |
| `/settings` | Theme / prefs |
| `/track/HAU-88421` | Public customer tracking |

## Theme

Header sun/moon toggle persists `haula-theme` in `localStorage` (true black / white).

## Stack

Next.js 16 · Tailwind 4 · Recharts · Lucide · Leaflet

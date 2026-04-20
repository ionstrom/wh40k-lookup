# WH40K Datasheet Lookup

Vite + React app: upload a photo of a WH40K miniature → Gemini Vision identifies the unit → BattleScribe XML catalogue is fetched and parsed → matched unit data displayed as a styled **Auspex Screen datasheet card**.

The datasheet card renders in a phosphor-green CRT terminal aesthetic with the full 10th edition stat block, weapons table, abilities, and keyword tags.

## Requirements

- Node.js v18+ (tested on v24)
- A [Gemini API key](https://aistudio.google.com/apikey) (free tier works)

## Setup

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## How it works

1. Enter your Gemini API key (stored in `localStorage`)
2. Upload or drag-and-drop a photo of a WH40K miniature
3. Click **Identify Miniature**
4. The app sends the image to `gemini-2.0-flash`, which returns the unit name and faction
5. The matching BattleScribe `.cat` file is fetched from [BSData/wh40k-10e](https://github.com/BSData/wh40k-10e) on GitHub
6. The XML is parsed and the closest unit entry is displayed as a styled **DatasheetCard** (phosphor-green Auspex terminal UI)

## Project structure

```
src/
  hooks/
    useGemini.js        # image → Gemini API call, returns unit name + faction
    useBattlescribe.js  # faction → catalogue URL, XML fetch + parse + fuzzy match
  components/
    ApiKeyInput.jsx     # Gemini API key input, persisted in localStorage
    ImageInput.jsx      # file upload, drag-and-drop, camera capture
    RawUnitDisplay.jsx  # matched unit displayed as formatted JSON
  App.jsx               # state management, wires hooks and components together
```

## Supported factions

| Detected faction keyword | Catalogue fetched |
|---|---|
| Space Marine / Astartes / Primaris | Imperium — Space Marines |
| Black Templar | Imperium — Black Templars |
| Blood Angel | Imperium — Blood Angels |
| Dark Angel | Imperium — Dark Angels |
| Grey Knight | Imperium — Grey Knights |
| Space Wolf | Imperium — Space Wolves |
| Ultramarine | Imperium — Ultramarines |
| Deathwatch | Imperium — Deathwatch |
| Imperial Fist | Imperium — Imperial Fists |
| Iron Hand | Imperium — Iron Hands |
| Raven Guard | Imperium — Raven Guard |
| Salamander | Imperium — Salamanders |
| White Scar | Imperium — White Scars |
| Imperial Guard / Astra Militarum | Imperium — Astra Militarum |
| Adepta Sororitas / Sisters of Battle | Imperium — Adepta Sororitas |
| Adeptus Custodes | Imperium — Adeptus Custodes |
| Adeptus Mechanicus / Skitarii | Imperium — Adeptus Mechanicus |
| Imperial Knight | Imperium — Imperial Knights |
| Chaos Space Marine / Heretic Astartes | Chaos — Chaos Space Marines |
| Death Guard / Nurgle | Chaos — Death Guard |
| Thousand Sons | Chaos — Thousand Sons |
| World Eaters | Chaos — World Eaters |
| Emperor's Children / Slaanesh | Chaos — Emperor's Children |
| Chaos Daemon | Chaos — Chaos Daemons |
| Chaos Knight | Chaos — Chaos Knights |
| Necron | Necrons |
| Ork / Greenskin | Orks |
| Aeldari / Eldar / Craftworld | Aeldari — Craftworlds |
| Drukhari / Dark Eldar | Aeldari — Drukhari |
| Tau / T'au / Fire Warrior | T'au Empire |
| Tyranid / Hive Mind | Tyranids |
| Genestealer Cult | Genestealer Cults |
| Leagues of Votann / Votann | Leagues of Votann |

## Archived POC

The original single-file proof-of-concept is preserved at [`poc/index.html`](poc/index.html). It can be opened directly in any browser with no build step.

## Next steps

- Full GW-style datasheet card UI (stat block table, weapons table, abilities list)
- Resolve `sharedProfiles` references so weapon stats missing from inline profiles are displayed
- Dynamic catalogue discovery from the BSData repo index (no hardcoded map)
- PWA support with native camera access

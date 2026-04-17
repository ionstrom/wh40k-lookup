# WH40K Datasheet Lookup — POC

Single HTML file, zero dependencies. Open directly in any browser.

## Quick start

1. Open `index.html` in Chrome / Edge / Firefox
2. Paste your Gemini API key (get one free at https://aistudio.google.com/apikey)
3. Upload a photo of a WH40K miniature (or use your phone camera)
4. Click **Identify Miniature**

The app will:
1. Send the image to `gemini-2.0-flash` and ask it to identify the unit + faction
2. Pick the matching BattleScribe catalogue from GitHub (based on detected faction)
3. Parse the XML and find the closest matching unit entry
4. Display the raw matched JSON

## Supported factions (auto-catalogue selection)

| Detected faction keyword | Catalogue fetched |
|---|---|
| Space Marine / Astartes / Primaris | Adeptus Astartes — Space Marines |
| Chaos Space Marine / Heretic Astartes | Chaos Space Marines |
| Necron | Necrons |
| Ork / Greenskin | Orks |
| Eldar / Aeldari | Aeldari |
| Tau / T'au / Fire Warrior | T'au Empire |
| Tyranid / Hive Mind | Tyranids |
| Imperial Guard / Astra Militarum | Astra Militarum |
| Grey Knight | Grey Knights |
| Death Guard / Nurgle | Death Guard |

## After POC confirmation

Next steps for the full polished version:
- Migrate to Vite + React
- Full GW-style datasheet card UI (stat block, weapons table, abilities)
- Dynamic faction/catalogue discovery from BSData repo index
- Fuzzy name matching
- PWA / camera support

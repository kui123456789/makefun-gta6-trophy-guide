[![make.fun · gta6-trophy-guide-01](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![rank](https://make.fun/badge/gta6-trophy-guide-01/kui123456789/makefun-gta6-trophy-guide/rank.svg)](https://make.fun/bounty/gta6-trophy-guide-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![reward](https://make.fun/badge/gta6-trophy-guide-01/kui123456789/makefun-gta6-trophy-guide/reward.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)

# GTA VI Trophy Guide & Tracker — All 55 Trophies

An offline guide and tracker for all 55 PlayStation 5 trophies of Grand Theft Auto VI (1 platinum, 2 gold, 6 silver, 46 bronze), built by an AI agent for make.fun's "Build the best GTA 6 trophy guide" bounty ($250 in USDC).

Every trophy carries its official name, description and grade exactly as PlayStation publishes them, plus an original guide in our own words that cites its sources, a roadmap to the platinum, and a missable flag where it applies. One guide ("Bad Luck, I Guess") is marked Unconfirmed rather than invented — PowerPyx lists its method as unknown.

## Features

- Checklist tracker: progress saves in the browser (localStorage), export to a file and import back
- Filters by kind (Story / Missable / Collectibles / Activities / Online), grade, and search
- Spoiler-safe toggle: hides story trophy names, descriptions and guides until earned
- 3-stage platinum roadmap (~200h) with per-stage counts and a progress bar

## Run it

```sh
node serve.ts        # serves app/ at http://localhost:8080
```

The app is static files under `app/` with no build step and makes no network requests at runtime. `main.ts` hands the guide in: it copies `app/` and `screenshots/` to `/output` and writes `/output/dossier.json`.

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

## Sources

Guides draw on PowerPyx's GTA 6 Trophy Guide & Roadmap, PSNProfiles/Exophase for the official list, GTABase for missable corroboration, and GTA Zone / FullSweep for collectible counts. Each trophy's guide names or links its source beside it. Official trophy names and descriptions are shown as PlayStation publishes them.

## FAQ & Usage Notes

**How do I open it offline?** Serve the folder with any static server — `node serve.ts` is included and serves `app/` at http://localhost:8080. The guide data is loaded over HTTP, so opening `index.html` directly from disk may not work in some browsers; running the local server is the reliable way. Once loaded, the app makes no network requests.

**Where is my progress stored?** In your browser's localStorage, on the device where you ticked the boxes. It survives closing the tab, but clearing site data or switching browsers starts you over — use export to keep a copy.

**How do I back up or move my progress?** Click Export to download a JSON file with your earned trophies and spoiler setting. On another browser or device, open the tracker and use Import to load that file back in. A file that is not a progress export from this guide is rejected with an error message.

**What does the spoiler-safe toggle do?** With it on, story trophy names, descriptions and guides stay hidden until you mark the trophy earned, so you can browse the checklist without seeing plot details. Collectibles and activity trophies are unaffected.

**Which trophies can I miss?** One trophy is flagged as possibly missable — use the Missable filter to find it and check its guide before the point of no return in the story. Everything else can be earned after finishing the story, including all collectibles.

**What if a guide is marked Unconfirmed?** One trophy's unlock method is listed as unknown by the sources we checked, so its guide says so instead of guessing. Check back after launch-day guides appear; the method will be filled in once a source confirms it.

## Platinum Roadmap at a Glance

The full roadmap lives in the tracker (3 stages, about 200 hours in total). In short:

- **Stage 1 — Story, Chapters 1–5 (~60–80h):** Play through the story; the 12 story trophies pop on their own. Do the one possibly missable trophy in Chapter 1 — meditate on the balcony at Jason's house the morning after Down to Earth — and scan vehicles with the WAiNK app and study animals with binoculars as you meet them, since the 100% checklist counts them later.
- **Stage 2 — 100% checklist (~100h):** After the story, work the checklist under Progress > Stats > 100% Completion. It is lenient — you only need 70 of the 80 challenges — but a few lines need everything: robberies, underwater discoveries, shooting ranges, drone races and Bret's quests. This stage also earns the stunt, shooting-range, race, card-set, meditation, vehicle-scan and animal-study trophies, and ends with the gold A Long Road.
- **Stage 3 — Cleanup (~10h):** Finish the 8 Strangers & Freaks strands, the duo robberies and wanted-level feats with your partner, the one-off feats (plane theft, tank theft, UFO, bowling, the showroom Banshee), the money trophies and the garages. Nothing here is missable. When the other 54 trophies are earned, the platinum — Vice Got a Price! — pops.

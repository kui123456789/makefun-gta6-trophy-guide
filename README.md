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

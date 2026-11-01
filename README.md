# djmgmz.github.io

Personal portfolio of Dominic Gomez, full-stack developer. It features interactive demos of [RigRAG](https://github.com/djmgmz/RigRAG), [FullCourt](https://github.com/djmgmz/FullCourt) and [WF Market Analyst](https://github.com/djmgmz/WFMarketAnalyst) that replay recorded responses from each app's backend, so no server or API key is needed. The site has a light and a dark mode; dark is the default, and the switch in the header remembers the visitor's choice.

## Running it

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # type-checks, then builds to dist/
npm run lint
```

Pushing to `main` deploys to GitHub Pages through `.github/workflows/deploy.yml`.

## How the demos work

Each demo lives in `src/demos/<project>/` and has three parts:

- `runs.json` holds real responses from the project's API, trimmed to the fields the interface reads: `/api/chat` for RigRAG; `/api/search` and `/api/meta` for FullCourt; and for WF Market Analyst, four items' details, history and forecasts, plus its overview, movers, ducat ranking and forecast report.
- The demo component reproduces the project's own interface and styles, scoped under `.rg`, `.fc` or `.wf` so they don't leak into the rest of the site. WF Market Analyst's Angular interface is ported to React, with all five of its tabs.
- `src/demos/replay.ts` steps through the pipeline stages at a watchable pace, then shows the recorded answer. The project's card lights each stage as the replay reaches it.

Only the recorded requests can be answered. Anything else typed into a demo gets a note pointing to the project's repository.

To refresh the recordings, run the project's backend locally, send the same requests, and replace `runs.json` with the trimmed responses.

WF Market Analyst's item images come from the Warframe community's item database ([WFCD](https://github.com/WFCD/warframe-items)). The project isn't affiliated with warframe.market or Digital Extremes.

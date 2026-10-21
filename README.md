# djmgmz.github.io

Personal portfolio of Dominic Gomez, full-stack developer. It features interactive demos of [RigRAG](https://github.com/djmgmz/RigRAG) and [FullCourt](https://github.com/djmgmz/FullCourt) that replay recorded responses from each app's backend, so no server or API key is needed.

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

- `runs.json` holds real responses from the project's API (`/api/chat` for RigRAG, `/api/search` and `/api/meta` for FullCourt), trimmed to the fields the interface reads.
- The demo component reproduces the project's own React interface and styles, scoped under `.rg` or `.fc` so they don't leak into the rest of the site.
- `src/demos/replay.ts` steps through the pipeline stages at a watchable pace, weighted by the recorded timings where the response has them, then shows the recorded answer.

Only the recorded requests can be answered. Anything else typed into a demo gets a note pointing to the project's repository.

To refresh the recordings, run the project's backend locally, send the same requests, and replace `runs.json` with the trimmed responses.

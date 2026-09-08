# mermaid-excalidraw-sync

Local Mermaid + Excalidraw diagram workspace — tabs, sync, diffs, Mac filesystem, and version history.

## Repository structure

```text
├── api/                              # BACKEND (Python, deployable)
│   ├── pyproject.toml                #   fastapi, uvicorn, watchdog
│   └── app/                          #   files, watching, versions, logs (plans 03–04)
├── frontend/                         # BROWSER SIDE (TypeScript)
│   ├── app/                          #   the UI application (2 tabs: Mermaid | Excalidraw)
│   └── converter/                    #   conversion engine library (frozen, upstream-derived)
│       └── src/                      #     mermaid → excalidraw pipeline
├── diagrams/                         # real mermaid docs — the app opens these directly
├── plans/                            # Implementation plans
├── package.json                      # JS workspace root (frontend/*)
└── yarn.lock                         # pinned dep versions (the JS poetry.lock)

# generated, gitignored — never committed: node_modules/, frontend/public/, frontend/converter/dist/, api/.venv/, __pycache__/
```

## Naming & placement conventions

| Kind | Naming rule | Lives in | Examples |
|---|---|---|---|
| Deployable app (runs, listens, serves) | named by its role: `api`, `app` | top level | `api/` (FastAPI server), `frontend/app/` (UI) |
| Library (imported, never runs) | named by what it does, no `-service` suffix | beside its consumer | `frontend/converter/` |
| Diagrams (user content) | real files, no fixtures | `diagrams/` | `pipeline-audiotranscript.md` |

What goes where:

- **`api/`** — anything touching disk, versions, watching, logs. Python only. No rendering, no diagram semantics.
- **`frontend/app/`** — UI code: tabs, canvas mount, fetch calls, sync/conflict decisions (the brain).
- **`frontend/converter/`** — mermaid → excalidraw math only. Frozen: we do not add JS logic here.
- A new runtime piece (e.g. a CLI) becomes a top-level app folder; a new shared browser lib becomes `frontend/<name>/`.

Notes:

- `frontend/app` imports the engine via the `@mermaid-excalidraw-sync/converter` alias (resolved to `../converter/src`).
- **The browser is the brain** — conversion and sync logic run in-tab; the Python backend only reads/writes files and versions over HTTP.
- **No test suites.** Verification happens by opening real mermaid files from `diagrams/` (e.g. `pipeline-audiotranscript.md`) in the app and eyeballing the conversion.

## Set up

Install packages:

```
yarn
```

Start development workspace:

```
yarn start
```

Build the core library:

```
yarn build
```

Build the web app (typecheck + bundle):

```
yarn build:web
```

## Get started

```ts
parseMermaidToExcalidraw(diagramDefinition: string, config?: MermaidConfig)
```

The `diagramDefinition` is the mermaid diagram definition.
and `config` is the mermaid config. You can use the `config` param when you want to pass some custom config to mermaid.

Currently `mermaid-to-excalidraw` only supports the :point_down: config params

```ts
{
  /**
   * Whether to start the diagram automatically when the page loads.
   * @default false
   */
  startOnLoad?: boolean;
  /**
   * The flowchart curve style.
   * @default "linear"
   */
  flowchart?: {
    curve?: "linear" | "basis";
  };
  /**
   * Theme variables
   * @default { fontSize: "20px" }
   */
  themeVariables?: {
    fontSize?: string;
  };
  /**
   * Maximum number of edges to be rendered.
   * @default 500
   */
  maxEdges?: number;
  /**
   * Maximum number of characters to be rendered.
   * @default 50000
   */
  maxTextSize?: number;
}
```

Example code:

```ts
import { parseMermaidToExcalidraw } from "@excalidraw/mermaid-to-excalidraw";

try {
  const { elements, files } = await parseMermaidToExcalidraw(
    diagramDefinition,
    {
      themeVariables: {
        fontSize: "25px",
      },
    }
  );
  // Render elements and files on Excalidraw
} catch (e) {
  // Parse error, displaying error message to users
}
```

## Playground

Try out [here](https://mermaid-to-excalidraw.vercel.app).

## Development

- `yarn start` — frontend dev server
- `yarn build` / `yarn build:frontend` — builds
- No test suites: verify by opening a real diagram from `diagrams/` in the app (e.g. `pipeline-audiotranscript.md`).

## API

Head over to the [docs](https://docs.excalidraw.com/docs/@excalidraw/mermaid-to-excalidraw/api).

## Support new Diagram type

Head over to the [docs](https://docs.excalidraw.com/docs/@excalidraw/mermaid-to-excalidraw/codebase/new-diagram-type).

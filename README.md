# mermaid-excalidraw-sync

Local Mermaid + Excalidraw diagram workspace — tabs, sync, diffs, Mac filesystem, and version history.

## Repository structure

```text
├── packages/
│   ├── backend/                     # Python FastAPI — the file/version clerk
│   │   ├── pyproject.toml           #   fastapi, uvicorn, watchdog
│   │   └── app/                     #   files, watching, versions, logs (plans 03–04)
│   └── frontend/                    # ALL browser-side code (TypeScript)
│       ├── excalidraw_service/      #   ALL conversion logic (frozen library)
│       │   └── src/                 #     mermaid → excalidraw pipeline
│       └── web/                     #   minimal UI (2 tabs: Mermaid | Excalidraw)
├── diagrams/                        # real mermaid docs — the app opens these directly
├── plans/                           # Implementation plans
├── public/                          # frontend build output (generated, gitignored)
├── package.json                     # JS workspace root
└── yarn.lock
```

- `packages/frontend/web` imports the converter via the `@mermaid-excalidraw-sync/excalidraw-service` alias (resolved to `../excalidraw_service/src`).
- **The browser is the brain** — conversion and sync logic run in-tab; the Python backend only reads/writes files and versions over HTTP.
- The conversion library is upstream-derived and feature-complete: we do not add JS logic there.
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

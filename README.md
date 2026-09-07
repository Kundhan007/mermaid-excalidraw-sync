# mermaid-excalidraw-sync

Local Mermaid + Excalidraw diagram workspace — tabs, sync, diffs, Mac filesystem, and version history.

## Repository structure

```text
├── apps/
│   └── web/               # Web workspace (React + Vite + Excalidraw canvas)
├── packages/
│   └── core/              # Mermaid → Excalidraw converter library
│       ├── src/
│       └── tests/
├── e2e/                   # (removed for now — Playwright visual tests)
└── kn/plans/              # Implementation plans
```

`apps/web` imports the converter via the `@mermaid-excalidraw-sync/core` alias (resolved to `packages/core/src` in Vite and TS paths).

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

- `yarn test` to run unit tests

## API

Head over to the [docs](https://docs.excalidraw.com/docs/@excalidraw/mermaid-to-excalidraw/api).

## Support new Diagram type

Head over to the [docs](https://docs.excalidraw.com/docs/@excalidraw/mermaid-to-excalidraw/codebase/new-diagram-type).

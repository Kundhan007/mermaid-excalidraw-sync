# Plan 01 — Workspace shell and tabs

Depends on: none

## Goal

Turn the current single-page playground into a document workspace with the requested primary tabs and a compact utility surface.

## Tab decision

| Surface | Role | MVP behavior |
|---|---|---|
| Mermaid | Source editor | Edit the active `.mmd` document and show Mermaid render/parse errors. |
| Current / Diff | Change review | Show the active document's source and scene changes relative to the last synchronized revision. |
| Excalidraw | Canvas editor | Edit the active Excalidraw scene directly. |
| Compact utility tab | Files + History | Keep file navigation, sync status, and recent versions accessible without taking a full main tab. |

## Change tree

```text
frontend/
├── index.tsx                  [modify]
├── style.scss                 [modify]
├── WorkspaceLayout.tsx        [new, tentative]
├── WorkspaceTabs.tsx          [new, tentative]
├── DiffPane.tsx               [new, tentative]
└── UtilityPanel.tsx           [new, tentative]
```

## File and function changes

`frontend/index.tsx`
- `App()` [modify]: Replace the current left-form/right-canvas composition with workspace layout state and active-tab rendering.

`frontend/WorkspaceLayout.tsx` [new, tentative]
- `WorkspaceLayout()` [new]: Compose the file/sidebar area, tab strip, active content panel, and persistent canvas region.

`frontend/WorkspaceTabs.tsx` [new, tentative]
- `WorkspaceTabs()` [new]: Render Mermaid, Current/Diff, Excalidraw, and compact utility tab selection with active/dirty indicators.

`frontend/DiffPane.tsx` [new, tentative]
- `DiffPane()` [new]: Render source/scene change summaries supplied by the sync model without owning persistence.

`frontend/UtilityPanel.tsx` [new, tentative]
- `UtilityPanel()` [new]: Render file tree, sync action/status, and version-history entry points in a compact panel.

`frontend/style.scss`
- Workspace layout styles [modify]: Replace the fixed two-column assumptions with responsive tabs, split panes, and compact utility navigation.

## Implementation plan

1. Define the workspace shell layout and tab identifiers independently of document data or persistence.
2. Move the existing Mermaid editor and Excalidraw canvas into tab-compatible panels while preserving the current conversion behavior.
3. Add Current/Diff and Utility panel placeholders that consume status props rather than implementing sync or filesystem logic.
4. Add dirty/error/sync-status visual states to the tab strip and compact utility surface.
5. Preserve the browser playground as a usable fallback when no local folder is connected.

## Important decisions

- The requested “current tab - diff for it” is treated as a review tab, not a second editable source of truth.
- The compact utility tab is assigned to Files + History because those controls should remain available without competing with the three main work surfaces.
- A future design decision is whether Excalidraw remains visible beside every tab or is shown only when its tab is active; the plan favors a persistent canvas on desktop and a normal tab on narrow screens.

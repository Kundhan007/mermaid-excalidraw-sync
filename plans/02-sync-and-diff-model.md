# Plan 02 — Synchronization and diff model

Depends on: 01-workspace-shell.md

## Goal

Make the Sync button deterministic when Mermaid source and Excalidraw canvas have changed independently, while making the one-way conversion limitation explicit.

## Existing capability and gap

The fork already parses Mermaid and generates Excalidraw elements through `parseMermaidToExcalidraw()`, and the playground re-renders the canvas when Mermaid data changes. It does not currently capture Excalidraw edits, retain a common base revision, calculate diffs, or synchronize persisted files.

## Change tree

```text
frontend/
├── index.tsx                    [modify]
├── CustomTest.tsx               [modify]
├── ExcalidrawWrapper.tsx        [modify]
├── MermaidDiagram.tsx           [modify]
└── state/
    ├── workspaceTypes.ts        [new, tentative]
    ├── workspaceStore.ts        [new, tentative]
    ├── syncController.ts        [new, tentative]
    └── sceneSerialization.ts    [new, tentative]
frontend/converter/src/
└── interfaces.ts                [modify, if shared document types are exported]
```

## File and function changes

`frontend/state/workspaceTypes.ts` [new, tentative]
- `WorkspaceDocument` [new]: Define path, Mermaid source, Excalidraw scene, base revision, per-side revision, dirty state, and sync metadata.

`frontend/state/workspaceStore.ts` [new, tentative]
- `createWorkspaceStore()` [new]: Own active document state, monotonic edit sequence, and last-synchronized snapshot.

`frontend/state/syncController.ts` [new, tentative]
- `syncWorkspaceDocument()` [new]: Compare source/canvas revision sequence numbers and apply the selected latest-side policy.
- `recordSourceEdit()` / `recordCanvasEdit()` [new]: Record edits with a local monotonic revision rather than relying only on wall-clock time.

`frontend/state/sceneSerialization.ts` [new, tentative]
- `serializeExcalidrawScene()` / `deserializeExcalidrawScene()` [new]: Persist scene elements, app state, and binary files without losing canvas content.

`frontend/index.tsx`
- `handleOnChange()` [modify]: Dispatch source edits to the workspace store instead of writing only one localStorage string.

`frontend/CustomTest.tsx`
- Mermaid editor wiring [modify]: Read/write the active document source and expose parse errors through workspace status.

`frontend/ExcalidrawWrapper.tsx`
- Excalidraw change callback [modify]: Capture user canvas edits, while distinguishing generated scene replacement from manual edits.

`frontend/MermaidDiagram.tsx`
- Render status [modify]: Report render success/failure to the active document rather than silently clearing failed previews.

## Implementation plan

1. Define a document model with source state, canvas state, a common base snapshot, and monotonically increasing source/canvas revisions.
2. Capture Mermaid edits and Excalidraw `onChange` events while suppressing feedback loops during generated scene replacement.
3. Implement Sync as last-local-edit-wins using revision sequence numbers, with an explicit conflict/status message when both sides changed since the base.
4. For a newer Mermaid source, regenerate the Excalidraw scene; for a newer canvas, persist the canvas and retain the Mermaid source unchanged.
5. Feed the base/current snapshots into Current/Diff so users can review what will be overwritten before confirming Sync.

## Critical product constraint

This fork supports Mermaid → Excalidraw, not arbitrary Excalidraw → Mermaid conversion. Manual canvas changes cannot reliably be converted back into Mermaid syntax. MVP Sync must therefore define “canvas is latest” as “save the canvas as latest,” not “rewrite Mermaid.”

## Recommended conflict policy

| Situation | Sync behavior |
|---|---|
| Only Mermaid changed | Regenerate canvas from Mermaid. |
| Only Excalidraw changed | Keep Mermaid and save the changed canvas. |
| Both changed | Show diff and require explicit confirmation of the latest revision to prevent accidental overwrite. |
| Parse/render failure | Keep the last valid canvas and mark Mermaid as invalid; never destroy the valid scene automatically. |

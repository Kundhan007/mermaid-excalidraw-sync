# Plan 04 — Twenty-minute snapshots and recovery

Depends on: 02-sync-and-diff-model.md and 03-local-filesystem-host.md

## Goal

Prevent accidental loss by creating recoverable versions every 20 minutes while dirty, without silently rewriting the user's Git history.

## Recommended storage policy

Use two layers: an app-managed snapshot journal for guaranteed recovery, and optional Git commits for users who explicitly enable repository integration. The app should not create automatic Git commits by default because frequent commits can pollute a project's history and may include unrelated files.

## Change tree

```text
apps/web/
├── history/VersionHistory.tsx       [new, tentative]
├── history/snapshotScheduler.ts     [new, tentative]
└── history/versionRepository.ts     [new, tentative]
apps/desktop/src-tauri/src/
└── versioning.rs                    [new, tentative]
apps/web/UtilityPanel.tsx          [modify]
apps/web/state/workspaceTypes.ts   [modify]
```

## File and function changes

`apps/web/history/snapshotScheduler.ts` [new, tentative]
- `startSnapshotScheduler()` [new]: Schedule a 20-minute dirty-document snapshot and flush pending work on close/background.

`apps/web/history/versionRepository.ts` [new, tentative]
- `createSnapshot()` / `listSnapshots()` / `restoreSnapshot()` [new]: Store immutable source, scene, metadata, and recovery snapshots.

`apps/web/history/VersionHistory.tsx` [new, tentative]
- `VersionHistory()` [new]: Show timestamps, changed side, revision labels, preview/diff action, and restore confirmation.

`apps/desktop/src-tauri/src/versioning.rs` [new, tentative]
- Native snapshot and optional Git operations [new]: Write version records safely and expose repository status without touching unrelated files.

`apps/web/UtilityPanel.tsx`
- History controls [modify]: Add last-saved time, next snapshot time, restore, and optional Git settings.

`apps/web/state/workspaceTypes.ts`
- Version metadata [modify]: Add snapshot IDs, source/canvas revision IDs, save origin, and restore provenance.

## Implementation plan

1. Define an immutable snapshot record containing both source and canvas state plus the common base revision and active file path.
2. Start a dirty-only 20-minute scheduler with atomic writes, crash recovery, and a final flush when the document closes or the app exits.
3. Add compact History UI for browsing, diffing, restoring, and clearly identifying whether a version came from Mermaid, Excalidraw, or external filesystem changes.
4. Add retention and storage limits so snapshots do not grow without bound, while protecting the newest recovery points.
5. Make Git integration opt-in and scoped to the active document pair, exposing status and manual/automatic commit preferences separately from app snapshots.

## Decisions needed before implementation

| Decision | Recommended default |
|---|---|
| Snapshot interval | 20 minutes after the last snapshot, only when dirty. |
| Snapshot location | Hidden app metadata directory beside the workspace or in the app data directory; never mix snapshots into the user's visible diagram folder by default. |
| Retention | Keep the last 30 snapshots per document, configurable later. |
| Git behavior | No automatic commits by default; offer explicit opt-in after the recovery journal works. |

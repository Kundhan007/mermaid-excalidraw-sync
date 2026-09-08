# Plan 03 — Local Mac filesystem and file tree

Depends on: 01-workspace-shell.md and 02-sync-and-diff-model.md

## Goal

Make the web UI operate on a user-selected Mac folder with a file tree and durable `.mmd` / `.excalidraw` document pairs.

## Architecture decision

The current Vite playground is browser-only and uses localStorage. A browser cannot safely provide the requested unrestricted Mac filesystem, background file watching, and Git integration. The recommended target is a Tauri desktop shell hosting the existing React/Vite UI, with a browser fallback limited to a user-selected folder through the File System Access API.

## Change tree

```text
package.json                         [modify]
frontend/
├── platform/fileSystem.ts           [new, tentative]
├── platform/browserFileSystem.ts    [new, tentative]
├── platform/desktopFileSystem.ts    [new, tentative]
├── fileTree/FileTree.tsx            [new, tentative]
└── fileTree/workspaceRepository.ts  [new, tentative]
├── src/main.rs                      [new, tentative]
├── src/commands.rs                  [new, tentative]
└── tauri.conf.json                  [new, tentative]
frontend/index.tsx                 [modify]
```

## File and function changes

`frontend/platform/fileSystem.ts` [new, tentative]
- `FileSystemAdapter` [new]: Define folder selection, tree listing, read, write, rename, delete, and external-change subscription contracts.

`frontend/platform/browserFileSystem.ts` [new, tentative]
- `createBrowserFileSystemAdapter()` [new]: Implement the restricted browser directory-handle fallback.

`frontend/platform/desktopFileSystem.ts` [new, tentative]
- `createDesktopFileSystemAdapter()` [new]: Call Tauri commands for native Mac filesystem access and atomic writes.

`frontend/fileTree/FileTree.tsx` [new, tentative]
- `FileTree()` [new]: Render folders/files, active document selection, create/rename/delete actions, and external-change markers.

`frontend/fileTree/workspaceRepository.ts` [new, tentative]
- `loadDocumentPair()` / `saveDocumentPair()` [new]: Map an active Mermaid document and its Excalidraw scene to filesystem paths and serialized content.

`apps/desktop/src-tauri/src/commands.rs` [new, tentative]
- Native filesystem commands [new]: Enforce selected-root boundaries and perform atomic read/write/watch operations.

`frontend/index.tsx`
- Workspace bootstrap [modify]: Connect the selected filesystem adapter, file tree, active document loading, and save status.

## Implementation plan

1. Define a platform-neutral filesystem adapter so the workspace and sync model do not depend on Tauri APIs.
2. Add browser directory-handle support for development and a Tauri adapter for unrestricted, permissioned Mac folder access.
3. Add a file tree that mirrors the selected folder and opens `.mmd`, `.excalidraw`, and recognized document-pair files.
4. Persist source and canvas atomically, retaining temporary files and recovery metadata when a write is interrupted.
5. Add external-change detection so a file modified outside the app enters the same diff/conflict path instead of silently overwriting it.

## Open decision

Choose between Tauri (recommended: smaller native footprint and Rust filesystem boundary), Electron (more familiar Node filesystem APIs but heavier), or browser-only (cannot meet the full “same Mac filesystem” requirement).

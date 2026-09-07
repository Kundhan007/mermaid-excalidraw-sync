import { parseMermaid } from "@mermaid-excalidraw-sync/core/parseMermaid";

export interface MermaidData {
  definition: string;
  output: Awaited<ReturnType<typeof parseMermaid>> | null;
  error: string | null;
}

export type ActiveTestCaseIndex = number | "custom" | null;

export type ThemeMode = "light" | "dark";

export interface ThemeState {
  mode: ThemeMode;
  isUserPreference: boolean;
}

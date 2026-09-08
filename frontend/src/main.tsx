import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import mermaid from "mermaid";
import { DEFAULT_FONT_SIZE, MERMAID_CONFIG } from "@mermaid-excalidraw-sync/excalidraw-service/constants";
import { ensureExcalidrawFontsLoaded } from "./lib/loadExcalidrawFonts";

// Initialize Mermaid
mermaid.initialize({
  ...MERMAID_CONFIG,
  themeVariables: {
    fontSize: `${DEFAULT_FONT_SIZE}px`,
  },
});

const root = ReactDOM.createRoot(document.getElementById("root")!);

void ensureExcalidrawFontsLoaded().finally(() => {
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
});

"""FastAPI application entry point.

The backend is deliberately "dumb": it stores files and versions exactly as
asked and reports what changed on disk. All product logic (sync, conflict
resolution, mermaid conversion) lives in the frontend.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="mermaid-excalidraw-sync", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3418"],  # frontend dev server
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/health")
def health() -> dict[str, str]:
    return {"status": "ok"}

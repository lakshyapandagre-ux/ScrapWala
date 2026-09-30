from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .routers import (
    lots_router,
    recyclers_router,
    handovers_router,
    admin_router,
    sahayak_router,
    classification_router,
    voice_router,
    location_router,
    collectors_router
)

app = FastAPI(
    title="ScrapWala API",
    description="Formal e-waste recycling & critical-mineral recovery platform API (SIH 26229)",
    version="2.0.0"
)

# CORS middleware for Next.js frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount API routers
app.include_router(lots_router)
app.include_router(recyclers_router)
app.include_router(handovers_router)
app.include_router(admin_router)
app.include_router(sahayak_router)
app.include_router(classification_router)
app.include_router(voice_router)
app.include_router(location_router)
app.include_router(collectors_router)

@app.get("/")
def root():
    return {
        "project": "ScrapWala",
        "tagline": "Offline-first, voice-assisted formal e-waste platform",
        "version": "2.0.0",
        "status": "healthy"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("apps.api.main:app", host="0.0.0.0", port=8000, reload=True)

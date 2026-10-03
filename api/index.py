from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from core.intake import BusinessProfile
from engine.orchestrator import run_reasoning_engine

app = FastAPI(title="Touch Base Intelligence Engine", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def health_check():
    return {"status": "online", "system": "Touch Base Intelligence Engine", "region": "Hermanus / Overberg"}

@app.post("/api/audit/analyze")
def analyze_business(profile: BusinessProfile):
    try:
        result = run_reasoning_engine(profile)
        return {"status": "success", "data": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/audit/{slug}")
def get_preview_audit(slug: str):
    return {
        "slug": slug,
        "message": f"Preview audit payload for {slug}",
        "recommendations": [
            "Implement direct WhatsApp click-to-chat widget",
            "Optimize mobile load time to under 1.8s",
            "Add LocalBusiness schema markup"
        ]
    }

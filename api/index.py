import sys
import os

# Ensure project root is in Python's module search path for Vercel serverless execution
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from shared.intake import BusinessProfile
from features.intelligence.orchestrator import run_reasoning_engine

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

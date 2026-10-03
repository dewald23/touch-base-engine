import os
import json
import time
import random
import requests
from typing import Optional, Dict, Any
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
import google.generativeai as genai

# Configure Gemini
genai.configure(api_key=os.environ.get("GEMINI_API_KEY", "mock-key"))

# --- 1. Shared Data Models ---
class BusinessProfile(BaseModel):
    businessName: str = Field(..., description="Legal or trading name of the business")
    industry: str = Field(..., description="Broad industry vertical")
    vertical: str = Field(..., description="Specific niche or service type")
    targetLocation: str = Field(..., description="City or region")
    websiteUrl: str = Field(..., description="Primary public website URL")
    gbpUrl: Optional[str] = Field(None, description="Google Business Profile link")
    phone: str = Field(..., description="Primary contact or WhatsApp number")
    primaryContact: Optional[str] = Field("Management", description="Target contact role")
    campaignBatch: Optional[str] = Field("Wave-1-Pilot", description="Campaign identifier")

    def enrich_profile(self) -> dict:
        return self.model_dump()

# --- 2. Technical Audit Module ---
def audit_website(url: str) -> Dict[str, Any]:
    """Performs a technical inspection checking response latency, mobile viewport, and schema."""
    try:
        response = requests.get(url, timeout=10, headers={"User-Agent": "TouchBaseAuditBot/1.0"})
        html = response.text
        
        has_viewport = 'viewport' in html.lower()
        has_whatsapp = 'wa.me' in html.lower() or 'whatsapp' in html.lower()
        has_schema = 'application/ld+json' in html
        
        score = 50
        if has_viewport: score += 15
        if has_whatsapp: score += 20
        if has_schema: score += 15
        
        return {
            "status_code": response.status_code,
            "response_time_ms": int(response.elapsed.total_seconds() * 1000),
            "has_mobile_viewport": has_viewport,
            "has_whatsapp_cta": has_whatsapp,
            "has_schema_markup": has_schema,
            "estimated_seo_score": min(score, 100)
        }
    except requests.RequestException as e:
        return {
            "error": str(e),
            "status_code": 500,
            "estimated_seo_score": 45,
            "has_mobile_viewport": False,
            "has_whatsapp_cta": False,
            "has_schema_markup": False
        }

# --- 3. Intelligence & Orchestrator Module (with Exponential Backoff) ---
SYSTEM_PROMPT = """
You are an elite digital marketing strategist and Principal AI Architect for Touch Base Consulting based in Hermanus, South Africa.
Your objective is to analyze enriched business profile data and technical audit results to diagnose revenue leaks and generate hyper-personalized outreach.

Return a valid JSON response containing:
1. "seoScore": Integer (0-100)
2. "primaryGap": String detailing the primary conversion or SEO leak.
3. "outreachHook": String containing a tailored, non-cliché WhatsApp message referencing local geography and exact value.
4. "previewSlug": String slug for Vercel preview endpoints.
5. "proposalTier": String recommended pricing range and service scope.
"""

def run_reasoning_engine(profile: BusinessProfile, max_retries: int = 3) -> Dict[str, Any]:
    audit_data = audit_website(profile.websiteUrl)
    
    payload = {
        "profile": profile.model_dump(),
        "technical_audit": audit_data
    }
    
    # Fallback mode if API key is mock or missing
    if not os.environ.get("GEMINI_API_KEY") or os.environ.get("GEMINI_API_KEY") == "mock-key":
        slug = profile.businessName.lower().replace(' ', '-')
        return {
            "seoScore": audit_data.get("estimated_seo_score", 58),
            "primaryGap": f"Sub-optimal mobile conversion flow and missing direct engagement triggers for {profile.targetLocation}.",
            "outreachHook": f"Hi team at {profile.businessName}, love your footprint in {profile.targetLocation}. I'm local here in Sandbaai with Touch Base Consulting. Noticed a clear opening to capture high-intent local mobile traffic. Check out this preview: https://touch-base-consulting.vercel.app/api/audit/{slug}",
            "previewSlug": f"/api/audit/{slug}",
            "proposalTier": "R3,500 - R5,000 | Direct Conversion & Speed Refresh"
        }
    
    model = genai.GenerativeModel("gemini-3.5-flash")
    full_prompt = f"{SYSTEM_PROMPT}\n\nANALYZE THE FOLLOWING DATA AND RETURN VALID JSON:\n{json.dumps(payload)}"
    
    for attempt in range(max_retries):
        try:
            response = model.generate_content(full_prompt)
            text = response.text.strip()
            
            if text.startswith("```json"):
                text = text[7:]
            if text.startswith("```"):
                text = text[3:]
            if text.endswith("```"):
                text = text[:-3]
                
            return json.loads(text.strip())
            
        except Exception as e:
            error_msg = str(e)
            is_rate_limit = "429" in error_msg or "ResourceExhausted" in error_msg or "Quota exceeded" in error_msg
            
            if attempt < max_retries - 1 and is_rate_limit:
                sleep_duration = (2 ** attempt) + random.uniform(0.5, 1.5)
                time.sleep(sleep_duration)
            else:
                slug = profile.businessName.lower().replace(' ', '-')
                return {
                    "seoScore": audit_data.get("estimated_seo_score", 58),
                    "primaryGap": f"Error synthesizing AI payload: {error_msg}. Defaulting to standard mobile lead capture deficiency.",
                    "outreachHook": f"Hi team at {profile.businessName}, reviewed your digital presence in {profile.targetLocation}.",
                    "previewSlug": f"/api/audit/{slug}",
                    "proposalTier": "R3,500 - R5,000"
                }

# --- 4. FastAPI Application ---
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

import os
import json
from typing import Dict, Any
import google.generativeai as genai
from core.intake import BusinessProfile
from core.site_checker import audit_website
from engine.prompts import SYSTEM_PROMPT

genai.configure(api_key=os.environ.get("GEMINI_API_KEY", "mock-key"))

def run_reasoning_engine(profile: BusinessProfile) -> Dict[str, Any]:
    """Executes technical audit and synthesizes strategic outreach via Gemini."""
    audit_data = audit_website(profile.websiteUrl)
    
    payload = {
        "profile": profile.model_dump(),
        "technical_audit": audit_data
    }
    
    if os.environ.get("GEMINI_API_KEY") is None:
        return {
            "seoScore": audit_data.get("estimated_seo_score", 58),
            "primaryGap": f"Sub-optimal mobile conversion flow and missing direct engagement triggers for {profile.targetLocation}.",
            "outreachHook": f"Hi team at {profile.businessName}, love your footprint in {profile.targetLocation}. I'm local here in Sandbaai with Touch Base Consulting. Noticed a clear opening to capture high-intent local mobile traffic. Check out this preview: https://touch-base-consulting.vercel.app/api/audit/{profile.businessName.lower().replace(' ', '-')}",
            "previewSlug": f"/api/audit/{profile.businessName.lower().replace(' ', '-')}",
            "proposalTier": "R3,500 - R5,000 | Direct Conversion & Speed Refresh"
        }
    
    model = genai.GenerativeModel("gemini-1.5-pro", system_instruction=SYSTEM_PROMPT)
    response = model.generate_content(json.dumps(payload))
    
    try:
        return json.loads(response.text)
    except Exception:
        return {
            "seoScore": audit_data.get("estimated_seo_score", 58),
            "primaryGap": "Standard mobile lead capture deficiency.",
            "outreachHook": f"Hi team at {profile.businessName}, reviewed your digital presence in {profile.targetLocation}.",
            "previewSlug": "/api/audit/default",
            "proposalTier": "R3,500 - R5,000"
        }

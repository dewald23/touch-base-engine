import os
import json
from typing import Dict, Any
import google.generativeai as genai
from shared.intake import BusinessProfile
from features.audit.checker import audit_website
from features.intelligence.prompts import SYSTEM_PROMPT

genai.configure(api_key=os.environ.get("GEMINI_API_KEY", "mock-key"))

def run_reasoning_engine(profile: BusinessProfile) -> Dict[str, Any]:
    audit_data = audit_website(profile.websiteUrl)
    
    payload = {
        "profile": profile.model_dump(),
        "technical_audit": audit_data
    }
    
    # Fallback mode if API key is not set or mock
    if not os.environ.get("GEMINI_API_KEY") or os.environ.get("GEMINI_API_KEY") == "mock-key":
        slug = profile.businessName.lower().replace(' ', '-')
        return {
            "seoScore": audit_data.get("estimated_seo_score", 58),
            "primaryGap": f"Sub-optimal mobile conversion flow and missing direct engagement triggers for {profile.targetLocation}.",
            "outreachHook": f"Hi team at {profile.businessName}, love your footprint in {profile.targetLocation}. I'm local here in Sandbaai with Touch Base Consulting. Noticed a clear opening to capture high-intent local mobile traffic. Check out this preview: https://touch-base-consulting.vercel.app/api/audit/{slug}",
            "previewSlug": f"/api/audit/{slug}",
            "proposalTier": "R3,500 - R5,000 | Direct Conversion & Speed Refresh"
        }
    
    try:
        model = genai.GenerativeModel("gemini-1.5-pro")
        
        # Combine system prompt and JSON payload into a single reliable prompt string
        full_prompt = f"{SYSTEM_PROMPT}\n\nANALYZE THE FOLLOWING DATA AND RETURN VALID JSON:\n{json.dumps(payload)}"
        
        response = model.generate_content(full_prompt)
        text = response.text.strip()
        
        # Strip markdown code blocks if the model wraps JSON in ```json ... ```
        if text.startswith("```json"):
            text = text[7:]
        if text.startswith("```"):
            text = text[3:]
        if text.endswith("```"):
            text = text[:-3]
            
        return json.loads(text.strip())
        
    except Exception as e:
        slug = profile.businessName.lower().replace(' ', '-')
        return {
            "seoScore": audit_data.get("estimated_seo_score", 58),
            "primaryGap": f"Error synthesizing AI payload: {str(e)}. Defaulting to standard mobile lead capture deficiency.",
            "outreachHook": f"Hi team at {profile.businessName}, reviewed your digital presence in {profile.targetLocation}.",
            "previewSlug": f"/api/audit/{slug}",
            "proposalTier": "R3,500 - R5,000"
        }

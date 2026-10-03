import os
import json
import time
import random
from typing import Dict, Any
import google.generativeai as genai
from shared.intake import BusinessProfile
from features.audit.checker import audit_website
from features.intelligence.prompts import SYSTEM_PROMPT

genai.configure(api_key=os.environ.get("GEMINI_API_KEY", "mock-key"))

def run_reasoning_engine(profile: BusinessProfile, max_retries: int = 3) -> Dict[str, Any]:
    """
    Executes technical site auditing and Gemini reasoning synthesis with 
    built-in exponential backoff for rate-limit resilience.
    """
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
    
    # Exponential Backoff Execution Loop
    for attempt in range(max_retries):
        try:
            response = model.generate_content(full_prompt)
            text = response.text.strip()
            
            # Clean markdown code blocks if present
            if text.startswith("```json"):
                text = text[7:]
            if text.startswith("```"):
                text = text[3:]
            if text.endswith("```"):
                text = text[:-3]
                
            return json.loads(text.strip())
            
        except Exception as e:
            error_msg = str(e)
            # Check if error is rate-limit related (429 or resource exhausted)
            is_rate_limit = "429" in error_msg or "ResourceExhausted" in error_msg or "Quota exceeded" in error_msg
            
            if attempt < max_retries - 1 and is_rate_limit:
                # Calculate exponential backoff delay with jitter: 2^attempt + random seconds
                sleep_duration = (2 ** attempt) + random.uniform(0.5, 1.5)
                print(f"Rate limit hit for {profile.businessName}. Retrying in {sleep_duration:.2f} seconds (Attempt {attempt + 1}/{max_retries})...")
                time.sleep(sleep_duration)
            else:
                # If out of retries or non-rate-limit error, fallback gracefully
                print(f"AI synthesis error after {attempt + 1} attempts: {error_msg}")
                slug = profile.businessName.lower().replace(' ', '-')
                return {
                    "seoScore": audit_data.get("estimated_seo_score", 58),
                    "primaryGap": f"Error synthesizing AI payload: {error_msg}. Defaulting to standard mobile lead capture deficiency.",
                    "outreachHook": f"Hi team at {profile.businessName}, reviewed your digital presence in {profile.targetLocation}.",
                    "previewSlug": f"/api/audit/{slug}",
                    "proposalTier": "R3,500 - R5,000"
                }

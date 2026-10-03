import os
import json
import time
import random
import requests
from typing import Optional, Dict, Any
from fastapi import FastAPI, HTTPException
from fastapi.responses import HTMLResponse
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
    
    slug = profile.businessName.lower().replace(' ', '-')
    
    # Fallback mode if API key is mock or missing
    if not os.environ.get("GEMINI_API_KEY") or os.environ.get("GEMINI_API_KEY") == "mock-key":
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
                
            result = json.loads(text.strip())
            # Ensure preview slug uses proper path
            result["previewSlug"] = f"/api/audit/{slug}"
            return result
            
        except Exception as e:
            error_msg = str(e)
            is_rate_limit = "429" in error_msg or "ResourceExhausted" in error_msg or "Quota exceeded" in error_msg
            
            if attempt < max_retries - 1 and is_rate_limit:
                sleep_duration = (2 ** attempt) + random.uniform(0.5, 1.5)
                time.sleep(sleep_duration)
            else:
                return {
                    "seoScore": audit_data.get("estimated_seo_score", 58),
                    "primaryGap": f"Error synthesizing AI payload: {error_msg}. Defaulting to standard mobile lead capture deficiency.",
                    "outreachHook": f"Hi team at {profile.businessName}, reviewed your digital presence in {profile.targetLocation}. Check out this preview: [https://touch-base-consulting.vercel.app/api/audit/](https://touch-base-consulting.vercel.app/api/audit/){slug}",
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

@app.post("/audit/analyze")
def analyze_business(profile: BusinessProfile):
    try:
        result = run_reasoning_engine(profile)
        return {"status": "success", "data": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/audit/{slug}", response_class=HTMLResponse)
def view_audit_preview(slug: str):
    """Renders the dynamic client preview landing page."""
    business_name = " ".join([w.capitalize() for w in slug.split("-")])
    
    html_content = f"""
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Digital Growth Preview | {business_name}</title>
            <link href="[https://fonts.googleapis.com/css2?family=Montserrat:wght@600;700;800&family=Open+Sans:wght@400;500;600&display=swap](https://fonts.googleapis.com/css2?family=Montserrat:wght@600;700;800&family=Open+Sans:wght@400;500;600&display=swap)" rel="stylesheet">
            <script src="[https://cdn.tailwindcss.com](https://cdn.tailwindcss.com)"></script>
            <script>
                tailwind.config = {{
                    theme: {{
                        extend: {{
                            colors: {{
                                brandGold: '#B8860B',
                                brandGoldDark: '#996F09',
                                darkBg: '#0A0A0A',
                                cardBg: '#141414',
                                borderDark: '#262626'
                            }},
                            fontFamily: {{
                                heading: ['Montserrat', 'sans-serif'],
                                body: ['Open Sans', 'sans-serif']
                            }}
                        }}
                    }}
                }}
            </script>
        </head>
        <body class="bg-darkBg text-gray-100 font-body min-h-screen">
            <header class="border-b border-borderDark bg-cardBg/80 sticky top-0 z-50">
                <div class="max-w-5xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div class="flex items-center space-x-3">
                        <div class="w-10 h-10 rounded-lg bg-brandGold flex items-center justify-center text-black font-heading font-extrabold text-xl">TB</div>
                        <div>
                            <h1 class="font-heading font-bold text-sm tracking-wide text-white">TOUCH BASE CONSULTING</h1>
                            <p class="text-xs text-brandGold font-body uppercase tracking-wider">Client Preview Concept</p>
                        </div>
                    </div>
                    <span class="px-3 py-1 rounded-full text-xs font-medium bg-brandGold/10 text-brandGold border border-brandGold/30">
                        Live Optimization Preview
                    </span>
                </div>
            </header>
            <main class="max-w-5xl mx-auto px-6 py-12 space-y-8">
                <div class="bg-cardBg border border-borderDark rounded-2xl p-8 shadow-2xl relative overflow-hidden">
                    <div class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-brandGold to-amber-600"></div>
                    <span class="text-xs uppercase font-semibold text-brandGold tracking-wider">Target Asset</span>
                    <h2 class="font-heading font-extrabold text-3xl text-white mt-1 mb-4">{business_name}</h2>
                    <p class="text-gray-300 text-base leading-relaxed">
                        This high-converting mobile layout concept was custom-engineered by Touch Base Consulting to eliminate lead leakage, accelerate mobile page speed, and capture direct local inquiries instantly.
                    </p>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div class="bg-cardBg border border-borderDark rounded-xl p-6">
                        <div class="w-8 h-8 rounded bg-brandGold/10 text-brandGold flex items-center justify-center font-bold mb-4">1</div>
                        <h4 class="font-heading font-bold text-white mb-2">WhatsApp Click-to-Chat</h4>
                        <p class="text-sm text-gray-400">Enables high-intent mobile visitors to start instant quote conversations in one tap.</p>
                    </div>
                    <div class="bg-cardBg border border-borderDark rounded-xl p-6">
                        <div class="w-8 h-8 rounded bg-brandGold/10 text-brandGold flex items-center justify-center font-bold mb-4">2</div>
                        <h4 class="font-heading font-bold text-white mb-2">Mobile Speed Optimization</h4>
                        <p class="text-sm text-gray-400">Streamlined assets engineered to load under 1.8 seconds on cellular networks.</p>
                    </div>
                    <div class="bg-cardBg border border-borderDark rounded-xl p-6">
                        <div class="w-8 h-8 rounded bg-brandGold/10 text-brandGold flex items-center justify-center font-bold mb-4">3</div>
                        <h4 class="font-heading font-bold text-white mb-2">Local Map Pack Schema</h4>
                        <p class="text-sm text-gray-400">Structured data markup designed to dominate local Overberg search results.</p>
                    </div>
                </div>
                <div class="bg-brandGold/10 border border-brandGold/30 rounded-2xl p-8 text-center space-y-4">
                    <h3 class="font-heading font-bold text-xl text-white">Ready to deploy this conversion engine for {business_name}?</h3>
                    <p class="text-sm text-gray-300 max-w-xl mx-auto">Let's lock in your direct local lead capture flow. Reach out directly via WhatsApp to review the full setup.</p>
                    <a href="[https://wa.me/27820000000](https://wa.me/27820000000)" target="_blank" class="inline-block bg-brandGold hover:bg-brandGoldDark text-black font-heading font-bold py-3 px-8 rounded-lg transition-colors">
                        Connect with Touch Base Consulting
                    </a>
                </div>
            </main>
        </body>
        </html>
    """
    return HTMLResponse(content=html_content)

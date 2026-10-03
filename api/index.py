import os
import json
import time
import random
import requests
from typing import Optional, List
from fastapi import FastAPI, HTTPException
from fastapi.responses import HTMLResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
import google.generativeai as genai
import gspread
from oauth2client.service_account import ServiceAccountCredentials

# Configure Gemini
genai.configure(api_key=os.environ.get("GEMINI_API_KEY", "mock-key"))

# --- 1. Upgraded Pydantic Response Schema ---
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

class TechnicalBreakdown(BaseModel):
    mobileViewportValid: bool = Field(..., description="Whether mobile viewport meta is correctly configured")
    whatsappCtaDetected: bool = Field(..., description="Presence of direct click-to-chat WhatsApp triggers")
    schemaMarkupPresent: bool = Field(..., description="Presence of local business JSON-LD schema")
    estimatedLoadTimeSeconds: float = Field(..., description="Estimated cellular load speed in seconds")

class OutreachVariant(BaseModel):
    hookStyle: str = Field(..., description="e.g., 'Local & Direct', 'Speed & Mobile Focus', 'Value-First'")
    message: str = Field(..., description="Tailored WhatsApp outreach message")

class ExecutiveProposal(BaseModel):
    tierName: str = Field(..., description="Service tier name")
    priceRangeZAR: str = Field(..., description="Pricing range in ZAR, e.g., 'R3,500 - R5,000'")
    deliverables: List[str] = Field(..., description="Specific bullet points included in the scope")

class AgencyIntelligenceReport(BaseModel):
    businessName: str
    targetLocation: str
    overallHealthScore: int = Field(..., ge=0, le=100)
    primaryRevenueLeak: str = Field(..., description="Core conversion or SEO bottleneck identified")
    technicalBreakdown: TechnicalBreakdown
    outreachHooks: List[OutreachVariant] = Field(..., description="3 distinct outreach hook options")
    recommendedProposal: ExecutiveProposal
    previewSlug: str

# --- 2. Technical Audit Module ---
def audit_website(url: str) -> dict:
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
    except requests.RequestException:
        return {
            "status_code": 500,
            "estimated_seo_score": 45,
            "has_mobile_viewport": False,
            "has_whatsapp_cta": False,
            "has_schema_markup": False
        }

# --- 3. Gemini 3.5 Flash Reasoning Engine with Structured Outputs ---
SYSTEM_PROMPT = """
You are an elite digital marketing strategist and Principal AI Architect for Touch Base Consulting based in Hermanus, South Africa.
Analyze the enriched business profile and technical audit data to generate a comprehensive agency intelligence report for Overberg enterprises.
Ensure outreach hooks reference local geography and exact value without cliché filler phrases.
"""

def run_reasoning_engine(profile: BusinessProfile, max_retries: int = 3) -> dict:
    audit_data = audit_website(profile.websiteUrl)
    slug = profile.businessName.lower().replace(' ', '-')
    preview_url = f"https://touch-base-consulting.vercel.app/p/{slug}"
    
    payload = {
        "profile": profile.model_dump(),
        "technical_audit": audit_data
    }
    
    if not os.environ.get("GEMINI_API_KEY") or os.environ.get("GEMINI_API_KEY") == "mock-key":
        return {
            "businessName": profile.businessName,
            "targetLocation": profile.targetLocation,
            "overallHealthScore": audit_data.get("estimated_seo_score", 58),
            "primaryRevenueLeak": f"Sub-optimal mobile conversion flow and missing direct engagement triggers for {profile.targetLocation}.",
            "technicalBreakdown": {
                "mobileViewportValid": audit_data.get("has_mobile_viewport", False),
                "whatsappCtaDetected": audit_data.get("has_whatsapp_cta", False),
                "schemaMarkupPresent": audit_data.get("has_schema_markup", False),
                "estimatedLoadTimeSeconds": 2.2
            },
            "outreachHooks": [
                {
                    "hookStyle": "Local & Direct",
                    "message": f"Hi team at {profile.businessName}, love your footprint in {profile.targetLocation}. I'm local here in Sandbaai with Touch Base Consulting. Noticed a clear opening to capture high-intent local mobile traffic. Check out this preview: {preview_url}"
                }
            ],
            "recommendedProposal": {
                "tierName": "Direct Conversion & Speed Refresh",
                "priceRangeZAR": "R3,500 - R5,000",
                "deliverables": ["Mobile Speed Optimization", "WhatsApp Click-to-Chat Integration", "Local Schema Markup"]
            },
            "previewSlug": f"/p/{slug}"
        }

    model = genai.GenerativeModel(
        model_name="gemini-3.5-flash",
        generation_config={
            "response_mime_type": "application/json",
            "response_schema": AgencyIntelligenceReport
        }
    )
    
    prompt = f"{SYSTEM_PROMPT}\n\nDATA:\n{json.dumps(payload)}"
    
    for attempt in range(max_retries):
        try:
            response = model.generate_content(prompt)
            result = json.loads(response.text)
            result["previewSlug"] = f"/p/{slug}"
            return result
        except Exception as e:
            if attempt == max_retries - 1:
                raise HTTPException(status_code=500, detail=f"AI Synthesis Error: {str(e)}")
            time.sleep(2 ** attempt)

# --- 4. Google Sheets CRM Integration ---
def get_crm_worksheet():
    scope = ["https://spreadsheets.google.com/feeds", "https://www.googleapis.com/auth/drive"]
    creds_json = os.environ.get("GOOGLE_CREDENTIALS_JSON")
    if not creds_json:
        raise ValueError("GOOGLE_CREDENTIALS_JSON environment variable is missing.")
    creds_dict = json.loads(creds_json)
    creds = ServiceAccountCredentials.from_json_keyfile_dict(creds_dict, scope)
    client = gspread.authorize(creds)
    return client.open("Hermanus Pilot CRM").sheet1

# --- 5. FastAPI Application ---
app = FastAPI(title="Touch Base Intelligence Engine", version="2.0.0")

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

@app.post("/api/crm/sync-batch")
def sync_batch_to_crm(leads: List[dict]):
    try:
        sheet = get_crm_worksheet()
        synced_count = 0
        for lead in leads:
            row_data = [
                lead.get("businessName"),
                lead.get("websiteUrl"),
                lead.get("primaryContact", "Management"),
                lead.get("targetLocation"),
                lead.get("industry"),
                lead.get("overallHealthScore", 50),
                lead.get("speedScore", 50),
                lead.get("latency", "1000ms"),
                lead.get("status", "Prospect"),
                lead.get("recommendedProposal", {}).get("tierName", "R3,500 - R5,000")
            ]
            sheet.append_row(row_data)
            synced_count += 1
        return {"status": "success", "message": f"Successfully synced {synced_count} leads to Hermanus Pilot CRM."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"CRM Sync Error: {str(e)}")

@app.get("/p/{slug}", response_class=HTMLResponse)
def view_audit_preview(slug: str):
    business_name = " ".join([w.capitalize() for w in slug.split("-")])
    html_content = f"""
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Digital Growth Preview | {business_name}</title>
            <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@600;700;800&family=Open+Sans:wght@400;500;600&display=swap" rel="stylesheet">
            <script src="https://cdn.tailwindcss.com"></script>
        </head>
        <body class="bg-[#0A0A0A] text-gray-100 font-['Open_Sans'] min-h-screen">
            <header class="border-b border-[#262626] bg-[#141414]/80 sticky top-0 z-50">
                <div class="max-w-5xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div class="flex items-center space-x-3">
                        <img src="/logo.jpg" alt="Touch Base Consulting" class="w-10 h-10 rounded-lg object-cover border border-[#B8860B]/40 shadow-lg">
                        <div>
                            <h1 class="font-['Montserrat'] font-bold text-sm tracking-wide text-white">TOUCH BASE CONSULTING</h1>
                            <p class="text-xs text-[#B8860B] uppercase tracking-wider">Client Preview Concept</p>
                        </div>
                    </div>
                    <span class="px-3 py-1 rounded-full text-xs font-medium bg-[#B8860B]/10 text-[#B8860B] border border-[#B8860B]/30">
                        Live Optimization Preview
                    </span>
                </div>
            </header>
            <main class="max-w-5xl mx-auto px-6 py-12 space-y-8">
                <div class="bg-[#141414] border border-[#262626] rounded-2xl p-8 shadow-2xl relative overflow-hidden">
                    <div class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#B8860B] to-amber-600"></div>
                    <span class="text-xs uppercase font-semibold text-[#B8860B] tracking-wider">Target Asset</span>
                    <h2 class="font-['Montserrat'] font-extrabold text-3xl text-white mt-1 mb-4">{business_name}</h2>
                    <p class="text-gray-300 text-base leading-relaxed">
                        This high-converting mobile layout concept was custom-engineered by Touch Base Consulting to eliminate lead leakage and accelerate mobile page speed.
                    </p>
                </div>
            </main>
        </body>
        </html>
    """
    return HTMLResponse(content=html_content)

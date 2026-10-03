from pydantic import BaseModel, Field
from typing import List

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

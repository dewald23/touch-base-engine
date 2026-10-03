from pydantic import BaseModel, Field
from typing import Optional

class BusinessProfile(BaseModel):
    businessName: str = Field(..., description="Legal or trading name of the business")
    industry: str = Field(..., description="Broad industry vertical")
    vertical: str = Field(..., description="Specific niche or service type")
    targetLocation: str = Field(..., description="City or region (e.g., Hermanus, Western Cape)")
    websiteUrl: str = Field(..., description="Primary public website URL")
    gbpUrl: Optional[str] = Field(None, description="Google Business Profile URL or CID link")
    phone: str = Field(..., description="Primary contact or WhatsApp number")
    primaryContact: Optional[str] = Field("Management", description="Target desk or contact role")
    campaignBatch: Optional[str] = Field("Wave-1-Pilot", description="Outreach campaign tag")

    def enrich_profile(self) -> dict:
        """Normalizes and prepares profile data for the intelligence layer."""
        return self.model_dump()

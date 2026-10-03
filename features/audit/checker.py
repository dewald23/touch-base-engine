import requests
from typing import Dict, Any

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

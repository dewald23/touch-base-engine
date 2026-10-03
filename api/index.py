import os
import json
import requests
from fastapi import HTTPException

INTERACTION_API_URL = "https://generativelanguage.googleapis.com/v1beta/interactions"

def run_interactions_engine(profile: dict, audit_data: dict) -> dict:
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key or api_key == "mock-key":
        # Fallback Mock Payload
        slug = profile["businessName"].lower().replace(' ', '-')
        return {
            "businessName": profile["businessName"],
            "targetLocation": profile["targetLocation"],
            "overallHealthScore": audit_data.get("estimated_seo_score", 62),
            "primaryRevenueLeak": f"Sub-optimal mobile conversion flow in {profile['targetLocation']}.",
            "previewSlug": f"/p/{slug}"
        }

    headers = {
        "x-goog-api-key": api_key,
        "Content-Type": "application/json",
        "Api-Revision": "2026-05-20"
    }

    payload = {
        "model": "gemini-3.8-flash",
        "input": f"Analyze this Overberg business profile and technical audit data: {json.dumps({'profile': profile, 'technical_audit': audit_data})}",
        "response_format": {
            "type": "text",
            "mime_type": "application/json",
            "schema": {
                "type": "object",
                "properties": {
                    "businessName": {"type": "string"},
                    "targetLocation": {"type": "string"},
                    "overallHealthScore": {"type": "integer"},
                    "primaryRevenueLeak": {"type": "string"},
                    "previewSlug": {"type": "string"}
                },
                "required": ["businessName", "targetLocation", "overallHealthScore", "primaryRevenueLeak", "previewSlug"]
            }
        }
    }

    try:
        response = requests.post(INTERACTION_API_URL, headers=headers, json=payload, timeout=15)
        if response.status_code != 200:
            raise HTTPException(status_code=response.status_code, detail=response.text)
        
        data = response.json()
        # Extract model output text from steps
        steps = data.get("steps", [])
        for step in steps:
            if step.get("type") == "model_output":
                content_list = step.get("content", [])
                for item in content_list:
                    if item.get("type") == "text":
                        return json.loads(item.get("text"))
                        
        raise ValueError("No valid model output found in interaction steps.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Interactions API Error: {str(e)}")

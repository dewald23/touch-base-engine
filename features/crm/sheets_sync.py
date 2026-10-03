import os
import json
import gspread
from oauth2client.service_account import ServiceAccountCredentials

def sync_to_crm(row_data: list):
    """Syncs audit results and outreach status to Google Sheets CRM."""
    scope = ["https://spreadsheets.google.com/feeds", "https://www.googleapis.com/auth/drive"]
    creds_json = os.environ.get("GOOGLE_CREDENTIALS_JSON")
    
    if not creds_json:
        print("Google credentials not configured. Skipping sheet sync.")
        return False
        
    creds = ServiceAccountCredentials.from_json_keyfile_dict(json.loads(creds_json), scope)
    client = gspread.authorize(creds)
    sheet = client.open("Hermanus Pilot CRM").sheet1
    sheet.append_row(row_data)
    return True

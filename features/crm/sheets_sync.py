import os
import json
import gspread
from oauth2client.service_account import ServiceAccountCredentials

def get_crm_sheet():
    """Initializes and returns the Hermanus Pilot CRM worksheet."""
    scope = [
        "https://spreadsheets.google.com/feeds",
        "https://www.googleapis.com/auth/drive"
    ]
    creds_json = os.environ.get("GOOGLE_CREDENTIALS_JSON")
    
    if not creds_json:
        raise ValueError("GOOGLE_CREDENTIALS_JSON environment variable is missing.")
        
    creds_dict = json.loads(creds_json)
    creds = ServiceAccountCredentials.from_json_keyfile_dict(creds_dict, scope)
    client = gspread.authorize(creds)
    sheet = client.open("Hermanus Pilot CRM").sheet1
    return sheet

def sync_to_crm(row_data: list):
    """Appends a new row of lead audit data and outreach status to the CRM sheet."""
    try:
        sheet = get_crm_sheet()
        sheet.append_row(row_data)
        return {"status": "success", "message": "Successfully synced to Hermanus Pilot CRM."}
    except Exception as e:
        return {"status": "error", "message": str(e)}

def update_lead_status(business_name: str, new_status: str):
    """Updates the status column (Column I) for an existing business in the CRM sheet."""
    try:
        sheet = get_crm_sheet()
        cell = sheet.find(business_name)
        if cell:
            sheet.update_cell(cell.row, 9, new_status)
            return {"status": "success", "message": f"Updated {business_name} status to {new_status}."}
        return {"status": "error", "message": f"Business '{business_name}' not found in CRM."}
    except Exception as e:
        return {"status": "error", "message": str(e)}

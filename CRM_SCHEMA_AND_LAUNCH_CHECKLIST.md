# Touch Base Agency OS: CRM Schema & Launch Operations

## Part 1: Google Sheet CRM Column Schema

Use this exact column structure for your master pilot tracking sheet.

**Sheet Name:** `Touch Base Hermanus Pilot`

### Column Definitions

| Column | Header | Type | Format | Example | Purpose |
|--------|--------|------|--------|---------|---------|
| A | Business Name | Text | Title Case | De Kelders Guest House | Prospect company identifier |
| B | Vertical | Dropdown | Guest House / Landscaper / Contractor | Guest House | Business category for segmentation |
| C | Owner / Contact | Text | First + Last Name | Johann Kleynhans | Decision-maker name |
| D | Phone / WhatsApp | Text | +27XXXXXXXXXX | +27825551234 | Direct contact number |
| E | Website URL | Link/URL | https://domain.com | dekelders.co.za | Current web presence |
| F | Location | Dropdown | Hermanus / Onrus / Sandbaai / Vermont / Gansbaai | Hermanus | Geographic segment |
| G | SEO Score | Number | 0–100 | 68 | Audit score from Agent 1 (output) |
| H | Preview URL | Link/URL | https://vercel.../api/audit/[slug] | https://tb-engine.vercel.app/api/audit/de-kelders-guest-house | Generated preview page (output) |
| I | Lead Status | Dropdown | 1 - Cold / 2 - Contacted / 3 - Preview Viewed / 4 - Warm Reply / 5 - Discovery Call / 6 - Proposal Sent / 7 - Won / 8 - Passed | 2 - Contacted | Pipeline progression |
| J | Last Outreach Date | Date | YYYY-MM-DD | 2026-10-09 | When last message was sent |
| K | Follow-Up Count | Number | Integer (0, 1, 2, 3...) | 1 | How many follow-ups sent |
| L | Response Status | Text | No Response / Viewed / Replied / Interested / Objection | Viewed | Type of engagement received |
| M | Notes / Next Action | Text | Long form | "Viewed preview 2x, asked about timeline. Follow up with proposal by Friday." | Context for next touchpoint |
| N | Proposal Sent Date | Date | YYYY-MM-DD | 2026-10-15 | When proposal was dispatched |
| O | Investment Amount | Currency | R0,000 | R2,999 | Quoted engagement fee |
| P | Close Status | Dropdown | Pending / Won / Lost / Not Ready | Pending | Final outcome |

### Google Sheet Setup Instructions

1. **Create a new Google Sheet** titled "Touch Base Hermanus Pilot"
2. **Set up headers** in Row 1 with the columns above (A–P)
3. **Add data validation** for dropdown columns:
   - **Column B (Vertical):** Guest House, Landscaper, Contractor
   - **Column F (Location):** Hermanus, Onrus, Sandbaai, Vermont, Gansbaai
   - **Column I (Lead Status):** 1 - Cold, 2 - Contacted, 3 - Preview Viewed, 4 - Warm Reply, 5 - Discovery Call, 6 - Proposal Sent, 7 - Won, 8 - Passed
   - **Column L (Response Status):** No Response, Viewed, Replied, Interested, Objection, Scheduled Call
   - **Column P (Close Status):** Pending, Won, Lost, Not Ready

4. **Freeze Row 1** (to keep headers visible when scrolling)
5. **Set column widths:**
   - A, C, E, H, M: Wide (300+px)
   - B, F, I, L, P: Medium (150px)
   - D, G, J, K, N, O: Narrow (120px)

### Example CRM Data (First 5 Leads)

| A | B | C | D | E | F | G | H | I | J | K | L | M | N | O | P |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Business Name | Vertical | Owner / Contact | Phone / WhatsApp | Website URL | Location | SEO Score | Preview URL | Lead Status | Last Outreach | Follow-Up Count | Response Status | Notes / Next Action | Proposal Sent | Investment | Close Status |
| De Kelders Guest House | Guest House | Johann Kleynhans | +27825551234 | dekelders.co.za | Hermanus | 68 | [URL] | 2 - Contacted | 2026-10-09 | 0 | No Response | Sent Day 1. Monitor for preview view. | — | — | Pending |
| Onrus Stays | Guest House | Sarah Meyer | +27834445678 | onrusstays.com | Onrus | 72 | [URL] | 2 - Contacted | 2026-10-09 | 0 | No Response | Sent Day 1. Follow-up due Day 4. | — | — | Pending |
| Hermanus Garden Design | Landscaper | Marcus Steenkamp | +27721112233 | hgarden.co.za | Hermanus | 65 | [URL] | 1 - Cold | — | 0 | No Response | Pending audit run. Schedule for Day 4. | — | — | Pending |
| Overberg Home Renovations | Contractor | David Pieterse | +27784445555 | overberghomes.com | Vermont | 71 | [URL] | 2 - Contacted | 2026-10-08 | 0 | No Response | Early send (pre-test). Follow up Day 3. | — | — | Pending |
| De Wijk Landscaping | Landscaper | Anna de Wijk | +27713332244 | dewijk.co.za | Sandbaai | 59 | [URL] | 1 - Cold | — | 0 | No Response | Low SEO score. Consider nurture vs. hard push. | — | — | Pending |

---

## Part 2: Polished High-Converting WhatsApp Scripts

### **Vertical A: Boutique Hospitality (Guest Houses & Lodges)**

#### **Version A (Direct & Personal)**
```
Hi [Owner Name], love what you've built at [Business Name]. 
I'm local here in Sandbaai with Touch Base Consulting. 

I ran a quick local search check for boutique stays in Hermanus 
and noticed your mobile booking triggers are leaking direct weekend 
inquiries straight to OTAs.

I spun up a clean, high-converting preview of how your digital presence 
could capture direct mobile bookings instantly: 
[Insert Vercel Preview URL]

Take a look when you have a spare two minutes and let me know your thoughts.
```

#### **Version B (Curiosity-Driven)**
```
Hi [Owner Name], quick question for you: 

Are you capturing all the direct weekend bookings for [Business Name] 
in Hermanus right now? Most guest houses I've checked are missing 
a clear mobile path for direct reservations.

I put together a live preview showing exactly what that could look like: 
[Insert Vercel Preview URL]

Worth a 90-second review. Thoughts?
```

#### **Version C (Problem-Solution)**
```
Morning [Owner Name], I noticed something about [Business Name]:

Your site is solid, but travelers searching on mobile for "stay in Hermanus" 
are getting funneled to Booking.com instead of booking directly with you.

That's lost commission and lost data. I built a preview showing how 
to flip that: [Insert Vercel Preview URL]

Let me know if it resonates.
```

---

### **Vertical B: Landscaping & Garden Services**

#### **Version A (Quality-Focused)**
```
Morning [Owner Name], great work on the portfolio for [Business Name]. 
I'm a digital strategist based right here in Hermanus. 

While reviewing local search trends for landscaping in the Overberg, 
I noticed high-intent homeowners searching on mobile are missing 
a direct WhatsApp click-to-chat on your site.

I put together a fast-loading mobile concept designed specifically 
to convert local traffic into quote requests: 
[Insert Vercel Preview URL]

Have a quick look and tell me if this matches the quality of your work.
```

#### **Version B (Lead-Generation Angle)**
```
Hi [Owner Name], [Business Name] is known for great work. 

Question: Are you getting enough qualified quote requests each month 
to keep your team busy? Most landscapers I've talked to say their 
website doesn't pull leads consistently.

I designed a preview showing what a high-converting landscaper portal 
looks like locally: [Insert Vercel Preview URL]

Worth a look?
```

#### **Version C (Competitive Awareness)**
```
Morning [Owner Name], local home owners in Hermanus and Sandbaai 
are searching for landscapers on mobile right now.

Your competitors are capturing those searches because their sites 
have clear WhatsApp quote buttons. You don't.

I built a preview that shows exactly how to fix that for [Business Name]: 
[Insert Vercel Preview URL]

Check it out when you have a moment.
```

---

### **Vertical C: Building Contractors & Home Services**

#### **Version A (Authority-Driven)**
```
Hi [Owner Name], [Business Name] has a solid reputation around Hermanus. 

Quick question—are you capturing all the high-value local renovation 
searches happening in Onrus and Vermont right now?

I ran a quick technical check on your mobile site speed and local schema. 
There's a clear opening to outrank local competitors in the map pack. 

I built a live concept layout showing what a high-converting contractor 
portal looks like for your region: [Insert Vercel Preview URL]

Worth a two-minute look when you're off-site.
```

#### **Version B (Urgency-Driven)**
```
Morning [Owner Name], homeowners in Vermont and Onrus are actively 
searching for renovation contractors right now.

The ones getting the calls are the ones showing up first in local search 
with a clear, mobile-friendly quote request path. 

I put together a preview showing exactly what that looks like: 
[Insert Vercel Preview URL]

Let me know your thoughts.
```

#### **Version C (ROI-Focused)**
```
Hi [Owner Name], here's the reality for contractors in the Overberg:

Most of your potential clients search on mobile. Your website probably 
isn't set up to convert that search into a qualified inquiry.

I built a preview that shows how to capture more high-value local leads: 
[Insert Vercel Preview URL]

Worth a quick review. Thoughts?
```

---

### **Script Selection Guide**

- **Version A** = Best for cold outreach (trust-building, personal touch)
- **Version B** = Best for follow-ups (curiosity hook, problem validation)
- **Version C** = Best for re-engagement (urgency, competitive pressure)

**Recommendation:** Start with Version A for all first touches. If no response after 3 days, follow up with Version B.

---

## Part 3: Day-by-Day Pilot Launch Checklist

### **PHASE 1: Setup & Prospecting (Days 1–3)**

#### **Day 1: CRM Initialization**
- [ ] Create new Google Sheet titled "Touch Base Hermanus Pilot"
- [ ] Set up 16 column headers (A–P) exactly as specified above
- [ ] Add data validation dropdowns for columns B, F, I, L, P
- [ ] Freeze Row 1 (View menu > Freeze > 1 row)
- [ ] Share Google Sheet link in your workspace notes
- [ ] **Status Check:** CRM is live and ready for data entry

#### **Day 2: Prospect Research - Guest Houses (5 targets)**
- [ ] Research & log 5 boutique guest houses:
  1. De Kelders Guest House (Hermanus)
  2. Onrus Stays (Onrus)
  3. Hermanus Backpackers Lodge (Hermanus)
  4. Sandbaai Beach House (Sandbaai)
  5. De Kelders Manor (Gansbaai)
- [ ] For each, collect:
  - Business Name (Col A)
  - Owner/Contact Name (Col C) — from Google Business Profile
  - Phone/WhatsApp (Col D)
  - Website URL (Col E)
  - Location (Col F)
- [ ] Set Lead Status to **1 - Cold** for all 5 (Col I)
- [ ] **Status Check:** All 5 guest houses logged with verified contact details

#### **Day 3: Prospect Research - Landscapers & Contractors (10 targets)**
- [ ] Research & log 5 landscapers:
  1. Hermanus Garden Design Co. (Hermanus)
  2. Overberg Landscaping Solutions (Sandbaai)
  3. De Wijk Landscaping (Sandbaai)
  4. Hermanus Tree Care & Maintenance (Hermanus)
  5. Onrus Garden Specialists (Onrus)
- [ ] Research & log 5 contractors:
  1. Overberg Home Renovations (Vermont)
  2. Hermanus Construction Group (Hermanus)
  3. Vermont Build & Design (Vermont)
  4. Coastal Carpentry & Finishes (Onrus)
  5. De Kelders Property Maintenance (Gansbaai)
- [ ] For each, collect the same data points as guest houses
- [ ] Set Lead Status to **1 - Cold** for all 10 (Col I)
- [ ] **Status Check:** All 15 prospects logged and verified. Sheet is 100% complete.

---

### **PHASE 2: Audit & Preview Generation (Days 4–7)**

#### **Day 4: Run Agent 1 Audits (Batch 1 - Guest Houses)**
- [ ] Open your Vercel dashboard (https://YOUR_VERCEL_DOMAIN)
- [ ] Navigate to "Run Local SEO Audit" form
- [ ] For each of the 5 guest houses, enter:
  - Business Name
  - Industry: "Hospitality / Guest House"
  - Target Location: (from Col F)
  - Website URL: (from Col E)
- [ ] Click **"Run Audit & Log to CRM"** for each
- [ ] **Expected:** Gemini generates SEO score, audit summary, and auto-logs to your Google Sheet webhook
- [ ] Manually verify scores appear in Col G
- [ ] **Status Check:** All 5 guest houses have SEO scores (Col G) populated

#### **Day 5: Generate Preview Links (Batch 1 - Guest Houses)**
- [ ] For each of the 5 guest houses with completed audits:
  - Click **"Create Preview"** in your Agency OS dashboard
  - Enter: Business Name, Location, Industry
  - Copy the generated Vercel URL
  - Paste into Col H (Preview URL)
- [ ] Test 2–3 preview links in a new browser tab to verify:
  - Niche-specific accent color rendering
  - Mobile responsiveness
  - WhatsApp CTA is live (+27 75 090 8984)
- [ ] **Status Check:** All 5 guest house preview URLs are live and tested

#### **Day 6: Run Agent 1 Audits (Batch 2 - Landscapers & Contractors)**
- [ ] Run Agent 1 for all 10 landscapers and contractors (same process as Day 4)
- [ ] Verify SEO scores populate in Col G for all 10
- [ ] **Status Check:** All 15 businesses now have audit scores

#### **Day 7: Generate Preview Links (Batch 2 - Landscapers & Contractors)**
- [ ] Generate preview links for all 10 landscapers and contractors
- [ ] Paste URLs into Col H for each
- [ ] Spot-check 2–3 preview links for rendering quality
- [ ] **Status Check:** All 15 businesses have live, tested preview URLs. System is ready for outreach.

---

### **PHASE 3: Wave 1 Outreach - First 5 Leads (Days 8–10)**

#### **Day 8: Dispatch Wave 1 (Afternoon)**
- [ ] Select the first 5 targets (recommend: 3 guest houses + 2 landscapers for vertical variety)
- [ ] For each target:
  - Open WhatsApp Web or mobile
  - Copy the appropriate script (Version A) from the scripts above
  - Personalize: [Owner Name], [Business Name], [Location], [Preview URL]
  - Send via your business WhatsApp (+27 75 090 8984)
  - Wait 2 seconds between sends (avoid rate-limiting)
- [ ] In your CRM sheet:
  - Update Col I (Lead Status) → **2 - Contacted**
  - Update Col J (Last Outreach Date) → Today's date
  - Update Col K (Follow-Up Count) → 0
  - Add note in Col M: "Wave 1 initial outreach sent"
- [ ] **Status Check:** All 5 Wave 1 targets have been messaged. Confirm all sent successfully in WhatsApp chat history.

#### **Day 9: Monitor Wave 1 Responses**
- [ ] Check WhatsApp for any replies or previews viewed
- [ ] For each response received:
  - Update Col L (Response Status) with "Viewed" or "Replied"
  - Add context in Col M (e.g., "Asked about pricing," "Viewed preview 2x")
  - Do NOT respond yet—just log and monitor
- [ ] **Status Check:** Responses documented in CRM. Set reminder to follow up non-responders on Day 11.

#### **Day 10: Prepare Wave 2**
- [ ] Select the next 5 targets for Wave 2 outreach (the remaining 10 businesses)
- [ ] Pre-review their preview links to ensure all are live
- [ ] Prepare personalized scripts for each (can vary script version if desired)
- [ ] **Status Check:** Wave 2 targets are ready for dispatch tomorrow

---

### **PHASE 4: Wave 2 Outreach & Initial Follow-Ups (Days 11–14)**

#### **Day 11: Dispatch Wave 2 (Batch 1)**
- [ ] Send personalized WhatsApp messages to 5 new targets (landscapers, contractors, or remaining guest houses)
- [ ] Update CRM:
  - Col I → **2 - Contacted**
  - Col J → Today's date
  - Col K → 0
  - Col M → "Wave 2 initial outreach sent"
- [ ] **Monitor Wave 1 non-responders:** For any targets from Day 8 with no response after 72 hours (now Day 11):
  - Run Agent 3 (Follow-Up Sequence) in your Agency OS dashboard
  - Generate Day-3 follow-up message
  - Send via WhatsApp with message template: "Hi [Name], just checking if you had a chance to review the preview. No pressure, just wanted to follow up. Let me know your thoughts."
  - Update Col K (Follow-Up Count) → 1
  - Update Col M with "Day 3 follow-up sent"
- [ ] **Status Check:** Wave 2 dispatched. Wave 1 follow-ups sent to non-responders.

#### **Day 12: Dispatch Wave 2 (Batch 2)**
- [ ] Send WhatsApp to remaining 5 targets (final batch)
- [ ] Update CRM as above
- [ ] Continue monitoring Wave 1 & 2 responses
- [ ] For any "warm" replies (interest, questions, preview views), update Col L → **4 - Warm Reply** and Col I (Lead Status) → **4 - Warm Reply**
- [ ] **Status Check:** All 15 businesses now have initial outreach. 10 are awaiting 72-hour follow-up window.

#### **Day 13: 72-Hour Follow-Up Window Opens for Wave 2**
- [ ] Check for any Wave 2 responses (from Day 11–12 sends)
- [ ] For non-responders from Wave 2:
  - Not yet time for follow-up (only 24–48 hours have passed)
  - Just monitor and log any engagement
- [ ] Continue nurturing "Warm Reply" leads:
  - If they asked a question, respond with brief clarification
  - If they just viewed, no action needed yet
  - Prepare to move warm leads to **5 - Discovery Call** status
- [ ] **Status Check:** Responses logged. Warm leads identified and ready for next phase.

#### **Day 14: Second Follow-Up Wave (72+ hours)**
- [ ] For ANY lead with no response after 72 hours (from Wave 1 or Wave 2):
  - Run Agent 3 again
  - Send Day-3 follow-up message
  - Update Col K (Follow-Up Count) → 1 (or 2 if already followed up once)
  - Update Col M: "Second follow-up sent. Nurture if no response."
- [ ] For "Warm Reply" leads that show strong interest:
  - Send calendar link for a 15-minute discovery call
  - Update Col I → **5 - Discovery Call** (if call is scheduled)
  - Update Col M: "Discovery call scheduled for [Date/Time]"
- [ ] **Status Check:** All leads in active follow-up or nurture. Warm leads have discovery calls on calendar. Non-responders will be monitored through week 3.

---

### **PHASE 5: Proposal & Conversion Review (Days 15–30)**

#### **Days 15–20: Discovery Call Execution**
- [ ] Conduct 15-minute discovery calls with any scheduled leads
  - Use the Discovery Call Framework from CAMPAIGN_PLAYBOOK.md
  - Document pain points, budget, timeline, decision-maker
  - Take notes in Col M
- [ ] After each call, update:
  - Col M: Call summary (e.g., "Pain point: lead generation. Budget: R3–5k. Timeline: ASAP")
  - Col I → **5 - Discovery Call** if still qualifying
  - Col L → "Interested" or "Objection" based on call outcome
- [ ] **Status Check:** Minimum 2–3 calls completed. Document learnings about winning verticals, common objections, and messaging effectiveness.

#### **Days 21–25: Generate & Send Proposals**
- [ ] For leads that qualified from discovery calls (strong fit + budget alignment):
  - Run Agent 4 (Build Proposal) in your Agency OS dashboard
  - Fill in: Business Name, Industry, Location, SEO Score
  - System generates proposal summary, scope, and investment
- [ ] For each proposal:
  - Copy the generated brief
  - Send via WhatsApp or email with personalized cover note:
    ```
    Hi [Owner Name],
    
    Based on our chat, here's what I recommend for [Business Name]:
    
    [Proposal summary]
    
    Investment: R[amount]
    Timeline: [weeks]
    
    Let me know your thoughts. Happy to clarify anything.
    
    [Your Name]
    +27 75 090 8984
    ```
  - Update CRM:
    - Col I → **6 - Proposal Sent**
    - Col N (Proposal Sent Date) → Today
    - Col O (Investment Amount) → The quoted amount
    - Col M: "Proposal sent on [date]. Follow up on [date + 5 days]"
- [ ] **Status Check:** 2–3 proposals sent to qualified leads. Set reminders for follow-up conversations.

#### **Days 26–30: Final Review & Campaign Analysis**

**End-of-Month Analytics:**
- [ ] Complete the Campaign Success Metrics table:
  | Metric | Target | Actual |
  |--------|--------|--------|
  | Businesses Contacted | 15 | [Count] |
  | Positive Responses | 3+ | [Count] |
  | Preview Views | 5+ | [Count] |
  | Discovery Calls Booked | 3+ | [Count] |
  | Proposals Sent | 2+ | [Count] |
  | Deals Won | 1–2 | [Count] |

- [ ] Analyze by vertical:
  ```
  Guest Houses:
  - Contacted: 5
  - Reply Rate: __%
  - Discovery Calls: __
  - Proposals: __
  - Wins: __
  
  Landscapers:
  - Contacted: 5
  - Reply Rate: __%
  - Discovery Calls: __
  - Proposals: __
  - Wins: __
  
  Contractors:
  - Contacted: 5
  - Reply Rate: __%
  - Discovery Calls: __
  - Proposals: __
  - Wins: __
  ```

- [ ] Document learnings:
  - Which vertical had the highest response rate?
  - Which script version performed best?
  - Which city (Hermanus, Sandbaai, Onrus, etc.) responded fastest?
  - What were the top 3 objections?
  - What budget range came up most often?

- [ ] Next steps:
  - If you won 1–2 deals: Scale the winning vertical to 30 new leads
  - If you won 0 deals but have 2+ warm leads: Refine offer and follow up aggressively
  - If you got low responses: Test new messaging (Version B or C scripts) on next batch

- [ ] **Final Status:** Campaign complete. Results documented. Next 30-day strategy defined based on pilot learnings.

---

## Quick Reference: Key Dates & Milestones

| Milestone | Target Date | Action |
|-----------|-------------|--------|
| CRM Sheet Live | Day 1 | Sheet created and shared |
| All 15 Prospects Logged | Day 3 | 100% data entry complete |
| All Audits Completed | Day 6 | All 15 businesses scored |
| All Previews Live | Day 7 | All 15 preview URLs generated |
| Wave 1 Outreach (5 leads) | Day 8 | First messages sent |
| Wave 2 Outreach (5 leads) | Day 11 | Second batch sent |
| Wave 3 Outreach (5 leads) | Day 12 | Final batch sent |
| Day-3 Follow-Ups Begin | Day 11 | First non-responder follow-ups |
| Discovery Calls Scheduled | Day 14 | Warm leads booked on calendar |
| Proposals Sent | Day 21–25 | Qualified leads receive briefs |
| Campaign Review Complete | Day 30 | Final metrics, learnings, next strategy |

---

## Success Indicators (Real-Time Monitoring)

**Track these daily in your CRM to gauge momentum:**

✅ **Day 8:** At least 3 of 5 Wave 1 messages delivered  
✅ **Day 10:** At least 1 positive response (view or reply)  
✅ **Day 12:** All 15 businesses contacted  
✅ **Day 14:** At least 1 warm lead identified (replied or viewed preview 2+x)  
✅ **Day 15:** At least 1 discovery call scheduled  
✅ **Day 21:** At least 1 proposal sent  
✅ **Day 30:** 1–2 paid engagements or strong next-step commitments  

**If any of these milestones slip**, adjust messaging or vertical focus immediately. Don't wait until Day 30 to course-correct.

---

## Your Next Action

1. **Today:** Create the Google Sheet with the exact column schema above
2. **Tomorrow–Day 3:** Build your 15-person prospect list (use Google Maps + Facebook local business search)
3. **Days 4–7:** Run audits and generate preview links
4. **Days 8+:** Execute outreach exactly as specified in the checklist

**You're ready to go live.** This is your operational blueprint for the next 30 days.

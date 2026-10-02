# Touch Base Agency OS: Brain Architecture
## Intelligent System Design for Adaptive Lead Acquisition

---

## Part 1: System Overview

### Vision
Transform raw business input (name, industry, location) into deeply personalized, data-driven audits and outreach that adapts based on competitive landscape, market demand, and industry benchmarks.

### Core Flow

```
INPUT LAYER
├─ Business Name
├─ Industry/Vertical
├─ Location (Hermanus, Sandbaai, etc.)
└─ Website URL (optional)
    ↓
INTELLIGENCE LAYER (Multi-Source Analysis)
├─ Google Business Profile Analysis
│  ├─ Current ratings & review sentiment
│  ├─ Review gaps vs. competitors
│  ├─ Photo quality & freshness
│  └─ Service category accuracy
├─ Website Analysis
│  ├─ Mobile speed (Lighthouse score)
│  ├─ CTA clarity & conversion funnel
│  ├─ Local schema markup
│  └─ Keyword alignment
├─ Competitor Analysis
│  ├─ Top 3 local competitors
│  ├─ Their messaging strategy
│  ├─ Their conversion signals
│  └─ Competitive gaps
├─ Market Demand Analysis
│  ├─ Local search volume for their service
│  ├─ Seasonality patterns
│  ├─ Customer intent signals
│  └─ Price point range
└─ Industry Benchmarks
   ├─ What "good" looks like in their vertical
   ├─ Typical conversion rates
   ├─ Common pain points
   └─ Winning strategies by geography
    ↓
REASONING LAYER (Gemini-Powered)
├─ Analyze all data sources
├─ Identify 3–5 highest-impact opportunities
├─ Generate personalized scoring logic
├─ Create contextual value propositions
├─ Build specific, compelling hooks
└─ Adapt messaging by vertical & location
    ↓
OUTPUT LAYER
├─ SEO Audit (hyper-personalized score)
├─ Strategic Gaps (specific to their situation)
├─ Recommended Fixes (prioritized by ROI)
├─ WhatsApp Hooks (tailored to their pain points)
├─ Preview Page Generation (niche-colored, contextual)
├─ Proposal Framework (with realistic ROI estimates)
└─ Nurture Sequence (adapted based on vertical)
    ↓
FEEDBACK LOOP
├─ Track response rates by vertical/city/message
├─ Analyze proposal conversion rates
├─ Learn which messaging angles work best
├─ Update system intelligence over time
└─ Continuous optimization
```

---

## Part 2: Data Input Schema

### Required Inputs (Every Time)

```json
{
  "businessName": "string",
  "industry": "string (Guest House|Landscaper|Contractor|...)",
  "targetLocation": "string (Hermanus|Sandbaai|Onrus|...)",
  "websiteUrl": "string (optional but recommended)",
  "ownerName": "string (optional)",
  "phone": "string (optional)",
  "businessAge": "number (years, optional)",
  "estimatedAnnualRevenue": "string (optional: <100k|100k-500k|500k-1m|1m+)"
}
```

### Optional But Valuable Inputs

```json
{
  "googleBusinessProfileUrl": "string (https://...)",
  "currentWebsiteIssues": "string (what they think is broken)",
  "leadGenerationChallenges": "string (their stated pain point)",
  "competitorNames": "array of strings (who they compete with)",
  "currentLeadSources": "array (referrals|google|facebook|direct|...)"
}
```

---

## Part 3: Intelligence Pipeline (Multi-Source Analysis)

### 3.1 Google Business Profile Analysis

**Data to Extract:**
- Current rating (1–5 stars)
- Review count
- Review sentiment (positive/negative ratio)
- Average review recency (when was last review)
- Response rate (% of reviews responded to)
- Photo count and freshness
- Service areas listed
- Website link (if provided)
- Phone number setup

**Analysis Logic:**

```javascript
// Pseudo-code for GBP analysis
async function analyzeGoogleBusinessProfile(businessName, location) {
  const profile = await fetchGoogleBusinessProfile(businessName, location);
  
  // Rating analysis
  const ratingGap = 4.5 - profile.rating; // Industry benchmark is 4.5
  const reviewGap = benchmarkReviewCount(industry) - profile.reviewCount;
  
  // Sentiment analysis
  const recentReviews = profile.reviews.filter(r => isWithinLast30Days(r.date));
  const sentimentScore = analyzeReviewLanguage(recentReviews); // 0-100
  
  // Photo freshness
  const photoFreshness = profile.photos.filter(p => isWithinLast90Days(p.uploadDate)).length;
  const photoGap = benchmarkPhotoCount(industry) - photoFreshness;
  
  // Response rate
  const responseRate = profile.reviewsResponded / profile.totalReviews;
  
  return {
    ratingScore: profile.rating,
    ratingGap: ratingGap,
    reviewCount: profile.reviewCount,
    reviewGap: reviewGap,
    sentimentScore: sentimentScore,
    photoCount: photoFreshness,
    photoGap: photoGap,
    responseRate: responseRate,
    opportunities: [
      ratingGap > 0.5 ? "Improve ratings" : null,
      reviewGap > 20 ? "Build review volume" : null,
      photoGap > 10 ? "Add fresh photos" : null,
      responseRate < 0.8 ? "Respond to all reviews" : null,
      sentimentScore < 75 ? "Address negative review patterns" : null
    ].filter(Boolean)
  };
}
```

**Output Example:**
```json
{
  "ratingScore": 4.2,
  "ratingGap": 0.3,
  "reviewCount": 18,
  "reviewGap": 32,
  "sentimentScore": 72,
  "photoCount": 8,
  "photoGap": 15,
  "responseRate": 0.44,
  "opportunities": [
    "Improve overall rating by 0.3 stars",
    "Add 32 more reviews to match local average",
    "Upload 15 more high-quality photos",
    "Respond to 56% more reviews"
  ]
}
```

---

### 3.2 Website Analysis

**Data to Extract:**
- Mobile speed (Lighthouse score 0–100)
- Desktop speed
- CTA clarity (call button, contact form, WhatsApp link present?)
- Conversion funnel (landing page → service page → contact)
- Local schema markup (is business name, address, phone structured?)
- Keyword alignment (are they targeting the right local keywords?)
- Mobile responsiveness (is site mobile-first?)
- Trust signals (testimonials, case studies, certifications visible?)

**Analysis Logic:**

```javascript
async function analyzeWebsite(websiteUrl) {
  const lighthouse = await runLighthouseAudit(websiteUrl);
  const content = await scrapeWebsiteContent(websiteUrl);
  const schemaMarkup = await extractSchemaMarkup(websiteUrl);
  
  // Speed scoring
  const mobileSpeed = lighthouse.mobileScore; // 0-100
  const desktopSpeed = lighthouse.desktopScore;
  const speedGap = Math.max(0, 85 - mobileSpeed); // 85 is good threshold
  
  // CTA analysis
  const ctaPresent = {
    callButton: content.includes("tel:") || content.includes("phone"),
    contactForm: content.includes("form") && content.includes("submit"),
    whatsappLink: content.includes("wa.me"),
    bookingSystem: content.includes("book") || content.includes("calendar")
  };
  const ctaScore = (Object.values(ctaPresent).filter(Boolean).length / 4) * 100;
  
  // Schema markup analysis
  const schemaScore = schemaMarkup.hasBusinessName && 
                      schemaMarkup.hasAddress && 
                      schemaMarkup.hasPhone ? 100 : 50;
  
  // Trust signals
  const trustSignals = {
    hasTestimonials: content.includes("review") || content.includes("testimonial"),
    hasCaseStudies: content.includes("project") || content.includes("portfolio"),
    hasCertifications: content.includes("certified") || content.includes("award"),
    hasServicePages: content.pages.filter(p => p.type === "service").length > 2
  };
  const trustScore = (Object.values(trustSignals).filter(Boolean).length / 4) * 100;
  
  return {
    mobileSpeed: mobileSpeed,
    desktopSpeed: desktopSpeed,
    speedGap: speedGap,
    ctaScore: ctaScore,
    ctaPresent: ctaPresent,
    schemaScore: schemaScore,
    trustScore: trustScore,
    opportunities: [
      mobileSpeed < 70 ? "Improve mobile page speed by reducing image sizes and lazy-loading" : null,
      !ctaPresent.whatsappLink ? "Add WhatsApp click-to-chat for instant lead capture" : null,
      !ctaPresent.bookingSystem ? "Add online booking or quote request system" : null,
      schemaScore < 100 ? "Add structured schema markup for business details" : null,
      trustScore < 75 ? "Add customer testimonials or case studies above the fold" : null
    ].filter(Boolean)
  };
}
```

**Output Example:**
```json
{
  "mobileSpeed": 62,
  "desktopSpeed": 78,
  "speedGap": 23,
  "ctaScore": 50,
  "ctaPresent": {
    "callButton": true,
    "contactForm": true,
    "whatsappLink": false,
    "bookingSystem": false
  },
  "schemaScore": 50,
  "trustScore": 25,
  "opportunities": [
    "Improve mobile speed by 23 points (target: 85+)",
    "Add WhatsApp direct messaging link",
    "Implement online quote request system",
    "Add structured schema markup for business details",
    "Add customer testimonials and case studies"
  ]
}
```

---

### 3.3 Competitor Analysis

**Data to Extract:**
- Top 3 competitors in the same location + industry
- Their GBP ratings, review counts, photos
- Their website speed and CTA strength
- Their messaging strategy
- Their service range and pricing signals
- Their competitive advantages

**Analysis Logic:**

```javascript
async function analyzeCompetitors(businessName, industry, location) {
  // Find top 3 local competitors
  const competitors = await searchLocalCompetitors(industry, location, limit: 3);
  
  const competitorAnalysis = await Promise.all(
    competitors.map(async (comp) => {
      const gbp = await analyzeGoogleBusinessProfile(comp.name, location);
      const website = await analyzeWebsite(comp.website);
      const messaging = await extractMessagingStrategy(comp.website);
      
      return {
        name: comp.name,
        rating: gbp.ratingScore,
        reviews: gbp.reviewCount,
        mobileSpeed: website.mobileSpeed,
        ctaScore: website.ctaScore,
        messaging: messaging,
        strengths: identifyStrengths(gbp, website),
        weaknesses: identifyWeaknesses(gbp, website)
      };
    })
  );
  
  // Identify competitive gaps
  const gaps = identifyGaps(businessName, competitorAnalysis);
  
  return {
    competitors: competitorAnalysis,
    competitiveGaps: gaps,
    opportunities: generateCompetitiveOpportunities(gaps)
  };
}
```

**Output Example:**
```json
{
  "competitors": [
    {
      "name": "Hermanus Premium Stays",
      "rating": 4.7,
      "reviews": 52,
      "mobileSpeed": 85,
      "ctaScore": 100,
      "strengths": ["High rating", "Fast mobile site", "Clear booking CTA"],
      "weaknesses": ["Limited service description", "No WhatsApp option"]
    }
  ],
  "competitiveGaps": [
    "Target business has lower rating (4.2 vs competitor 4.7)",
    "Target business has fewer reviews (18 vs competitor 52)",
    "Target business has slower mobile site (62 vs competitor 85)"
  ],
  "opportunities": [
    "Focus on review generation to close 34-review gap",
    "Improve mobile speed to match competitor",
    "Add WhatsApp messaging (competitor doesn't have it)"
  ]
}
```

---

### 3.4 Local Search Volume & Demand Analysis

**Data to Extract:**
- Monthly search volume for "[service] + [location]" (e.g., "guest house Hermanus")
- Seasonal patterns (peak months, low months)
- Long-tail keywords with volume (e.g., "luxury guest house near Hermanus")
- Intent signals (are people searching "where to find" vs. "how much")
- Price point searches (indicating budget awareness)

**Analysis Logic:**

```javascript
async function analyzeLocalDemand(industry, location) {
  // Using Google Trends API or similar
  const keywords = [
    `${industry} ${location}`,
    `best ${industry} ${location}`,
    `${industry} near ${location}`,
    `affordable ${industry} ${location}`,
    `luxury ${industry} ${location}`,
    `${industry} booking ${location}`
  ];
  
  const searchData = await Promise.all(
    keywords.map(kw => getMonthlySearchVolume(kw))
  );
  
  // Analyze seasonality
  const trendData = await getTrendData(keywords[0], last: "12 months");
  const seasonalPattern = analyzeSeasonal(trendData);
  
  // Estimate addressable market
  const totalSearchVolume = searchData.reduce((a, b) => a + b.volume, 0);
  const estimatedLeads = totalSearchVolume * 0.02; // ~2% conversion assumption
  
  return {
    totalMonthlySearches: totalSearchVolume,
    peakSeasons: seasonalPattern.peaks,
    lowSeasons: seasonalPattern.lows,
    estimatedMonthlyLeads: estimatedLeads,
    topKeywords: searchData.sort((a, b) => b.volume - a.volume).slice(0, 5),
    opportunity: estimatedLeads > 50 ? "High demand market" : "Niche market"
  };
}
```

**Output Example:**
```json
{
  "totalMonthlySearches": 1840,
  "peakSeasons": ["December", "January", "July", "August"],
  "lowSeasons": ["May", "June"],
  "estimatedMonthlyLeads": 37,
  "topKeywords": [
    { "keyword": "guest house Hermanus", "volume": 320 },
    { "keyword": "accommodation Hermanus", "volume": 280 },
    { "keyword": "boutique stay Hermanus", "volume": 180 }
  ],
  "opportunity": "High demand market - ~37 monthly leads available"
}
```

---

### 3.5 Industry Benchmarks

**Data to Extract:**
- Average rating by vertical (Hospitality: 4.5, Landscaping: 4.3, Contractors: 4.1)
- Average review count by vertical
- Average mobile speed by vertical
- Typical CTA conversion rate by vertical
- Common pain points in the vertical
- Winning strategies specific to the vertical

**Analysis Logic:**

```javascript
function getIndustryBenchmarks(industry) {
  const benchmarks = {
    "Guest House": {
      avgRating: 4.5,
      avgReviewCount: 45,
      avgMobileSpeed: 78,
      avgCtaScore: 85,
      commonPainPoints: [
        "Capturing direct bookings (losing to OTAs)",
        "Mobile booking experience",
        "Review generation",
        "Seasonal occupancy fluctuations"
      ],
      winningStrategies: [
        "Direct booking discount (5-10%)",
        "Mobile-first design",
        "Guest review incentives",
        "WhatsApp instant booking"
      ],
      typicalConversionRate: 0.08, // 8% of views → bookings
      typicalCPL: 450 // Cost per lead in ZAR
    },
    "Landscaping": {
      avgRating: 4.3,
      avgReviewCount: 28,
      avgMobileSpeed: 72,
      avgCtaScore: 68,
      commonPainPoints: [
        "Inconsistent lead flow",
        "Quote request response time",
        "Portfolio visibility",
        "Competition from DIY vs professional"
      ],
      winningStrategies: [
        "Portfolio showcase (before/after)",
        "Quick quote system",
        "Testimonial focus",
        "WhatsApp quote requests"
      ],
      typicalConversionRate: 0.12, // 12% of inquiries → jobs
      typicalCPL: 280
    },
    "Contractor": {
      avgRating: 4.1,
      avgReviewCount: 35,
      avgMobileSpeed: 75,
      avgCtaScore: 72,
      commonPainPoints: [
        "Trust building (high-value decisions)",
        "Project complexity explanation",
        "Financing options",
        "Timeline transparency"
      ],
      winningStrategies: [
        "Detailed project portfolio",
        "Testimonials + certifications",
        "Financing options displayed",
        "Clear project timeline examples"
      ],
      typicalConversionRate: 0.15, // 15% of inquiries → projects
      typicalCPL: 520
    }
  };
  
  return benchmarks[industry] || benchmarks["Contractor"];
}
```

**Output Example:**
```json
{
  "industry": "Guest House",
  "benchmarks": {
    "avgRating": 4.5,
    "avgReviewCount": 45,
    "avgMobileSpeed": 78,
    "avgCtaScore": 85,
    "typicalConversionRate": 0.08
  },
  "comparison": {
    "rating": "4.2 vs benchmark 4.5 (-7%)",
    "reviews": "18 vs benchmark 45 (-60%)",
    "mobileSpeed": "62 vs benchmark 78 (-21%)",
    "ctaScore": "50 vs benchmark 85 (-41%)"
  },
  "priorities": [
    "CTA score is 41% below benchmark - biggest gap",
    "Mobile speed is 21% below benchmark",
    "Reviews are 60% below benchmark"
  ]
}
```

---

## Part 4: Reasoning Layer (Gemini-Powered Personalization)

### 4.1 Unified Analysis Prompt

```javascript
async function generatePersonalizedAnalysis(
  businessName,
  industry,
  location,
  allAnalysisData // { gbp, website, competitors, demand, benchmarks }
) {
  const prompt = `
You are an expert local marketing strategist analyzing a business for acquisition and growth opportunities.

BUSINESS CONTEXT:
- Name: ${businessName}
- Industry: ${industry}
- Location: ${location}

CURRENT PERFORMANCE:
${JSON.stringify(allAnalysisData.current, null, 2)}

INDUSTRY BENCHMARKS:
${JSON.stringify(allAnalysisData.benchmarks, null, 2)}

COMPETITIVE LANDSCAPE:
${JSON.stringify(allAnalysisData.competitors, null, 2)}

MARKET DEMAND:
${JSON.stringify(allAnalysisData.demand, null, 2)}

ANALYSIS REQUIRED:
1. Generate a SEO Score (0-100) based on all data sources
2. Identify the 3 highest-impact opportunities (ordered by potential ROI)
3. For each opportunity, explain the specific gap and the fix
4. Create a WhatsApp hook that addresses their biggest pain point
5. Suggest a proposal investment range based on their vertical and market
6. Recommend the best messaging angle for this specific business

SCORING CRITERIA:
- Weight 30% to GBP performance (rating, reviews, photos)
- Weight 25% to website quality (speed, CTA, trust signals)
- Weight 20% to competitive position
- Weight 15% to market demand
- Weight 10% to industry alignment

OUTPUT FORMAT:
Return valid JSON with:
{
  "seoScore": 0-100,
  "scoreBreakdown": {
    "gbpScore": 0-100,
    "websiteScore": 0-100,
    "competitiveScore": 0-100,
    "demandScore": 0-100
  },
  "topOpportunities": [
    {
      "opportunity": "string",
      "currentGap": "string",
      "recommendedFix": "string",
      "estimatedImpact": "string",
      "timelineMonths": number,
      "estimatedROI": "string"
    }
  ],
  "whatsappHook": "string (60-80 words, pain-point focused)",
  "proposalInvestmentRange": {
    "min": number,
    "max": number,
    "reasoning": "string"
  },
  "bestMessagingAngle": "string",
  "comparisonToBenchmark": {
    "gap": "string",
    "relativePosition": "below|at|above benchmark"
  }
}
  `;
  
  const response = await gemini.generateContent({
    model: "gemini-2.0-flash-lite",
    contents: prompt
  });
  
  return JSON.parse(response.text);
}
```

### 4.2 Adaptive Messaging Generation

```javascript
async function generateAdaptiveMessaging(
  businessName,
  industry,
  location,
  analysis // output from generatePersonalizedAnalysis
) {
  const messagingPrompt = `
Given this business analysis:
- Business: ${businessName} (${industry})
- Location: ${location}
- Top Pain Point: ${analysis.topOpportunities[0].opportunity}
- SEO Score: ${analysis.seoScore}
- Market Demand: ${analysis.demand.opportunity}

Generate THREE different WhatsApp message variants:

VARIANT A (Direct & Personal):
- Lead with local knowledge
- Mention specific observed gap
- Include brief credibility signal
- Max 120 words

VARIANT B (Curiosity-Driven):
- Start with a question about their pain point
- Hint at a solution without explaining
- Create urgency around market opportunity
- Max 120 words

VARIANT C (Data-Driven):
- Lead with market insight
- Reference competitive intelligence
- Frame as "opportunity window"
- Max 120 words

For each variant, explain why it works for this specific vertical and location.

Return JSON:
{
  "variants": [
    {
      "name": "A",
      "message": "string",
      "rationale": "string",
      "bestFor": "string (cold|warm|hot leads)"
    }
  ]
}
  `;
  
  const response = await gemini.generateContent({
    model: "gemini-2.0-flash-lite",
    contents: messagingPrompt
  });
  
  return JSON.parse(response.text);
}
```

---

## Part 5: Output Layer

### 5.1 Personalized SEO Audit

```javascript
async function generateAudit(businessData) {
  const allAnalysis = await conductMultiSourceAnalysis(businessData);
  const personalized = await generatePersonalizedAnalysis(businessData, allAnalysis);
  
  return {
    businessName: businessData.businessName,
    location: businessData.targetLocation,
    timestamp: new Date().toISOString(),
    
    // Primary Score
    seoScore: personalized.seoScore,
    scoreBreakdown: personalized.scoreBreakdown,
    
    // Gap Analysis
    comparisonToBenchmark: personalized.comparisonToBenchmark,
    competitivePosition: personalized.competitivePosition,
    
    // Prioritized Fixes
    topOpportunities: personalized.topOpportunities,
    
    // Sales-Ready Messaging
    whatsappHook: personalized.whatsappHook,
    messagingVariants: await generateAdaptiveMessaging(businessData, personalized),
    
    // Proposal Guidance
    proposalInvestmentRange: personalized.proposalInvestmentRange,
    bestMessagingAngle: personalized.bestMessagingAngle,
    
    // Context for Sales
    marketDemand: allAnalysis.demand,
    industryBenchmarks: allAnalysis.benchmarks,
    competitiveAnalysis: allAnalysis.competitors
  };
}
```

---

## Part 6: Feedback Loop & Continuous Learning

### 6.1 Track Response Data

```javascript
async function logCampaignResponse(
  leadId,
  businessName,
  industry,
  location,
  messagingVariant,
  response // 'no_response', 'viewed', 'replied', 'interested', 'booked_call', 'won_deal'
) {
  // Log to database
  await database.insert('campaign_responses', {
    leadId,
    businessName,
    industry,
    location,
    messagingVariant,
    response,
    timestamp: new Date(),
    responseTime: calculateResponseTime()
  });
}
```

### 6.2 Learn From Patterns

```javascript
async function analyzeCampaignPerformance(industry, location, last30days = true) {
  const responses = await database.query('campaign_responses', {
    industry,
    location,
    timestamp: { $gte: last30days ? new Date(Date.now() - 30*24*60*60*1000) : null }
  });
  
  const analysis = {
    totalSent: responses.length,
    responseRate: responses.filter(r => r.response !== 'no_response').length / responses.length,
    engagementRate: responses.filter(r => r.response === 'viewed').length / responses.length,
    conversionRate: responses.filter(r => r.response === 'won_deal').length / responses.length,
    
    byVariant: {
      A: analyzeVariant(responses, 'A'),
      B: analyzeVariant(responses, 'B'),
      C: analyzeVariant(responses, 'C')
    },
    
    insights: [
      responses.filter(r => r.messagingVariant === 'A').length > 0 
        ? `Variant A has ${(analyzeVariant(responses, 'A').responseRate * 100).toFixed(0)}% response rate`
        : null,
      // ... more insights
    ].filter(Boolean)
  };
  
  return analysis;
}
```

### 6.3 Adapt System Over Time

```javascript
async function updateSystemIntelligence(industry, location) {
  const performance = await analyzeCampaignPerformance(industry, location);
  
  // Update which messaging variants work best for this vertical/location
  if (performance.byVariant.B.responseRate > performance.byVariant.A.responseRate) {
    await database.update('vertical_preferences', {
      industry,
      location,
      preferredMessagingVariant: 'B'
    });
  }
  
  // If certain investment ranges convert better, note it
  const investmentAnalysis = analyzeProposalConversions(industry);
  if (investmentAnalysis.bestPricePoint) {
    await database.update('vertical_pricing', {
      industry,
      recommendedRange: investmentAnalysis.bestPricePoint
    });
  }
  
  // Log learnings
  console.log(`Updated intelligence for ${industry} in ${location}`);
  console.log(`Best messaging variant: ${performance.byVariant.?.bestVariant}`);
  console.log(`Best price point: R${investmentAnalysis.bestPricePoint}`);
}
```

---

## Part 7: Complete Code Architecture

### 7.1 Main Entry Point: `/api/generate-audit.js` (Enhanced)

```javascript
// api/generate-audit.js
const { GoogleGenAI } = require("@google/genai");

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Use POST" });
  }

  try {
    const input = req.body || {};
    
    // STEP 1: Multi-Source Data Collection
    const [gbpAnalysis, websiteAnalysis, competitorAnalysis, demandAnalysis] = 
      await Promise.all([
        analyzeGoogleBusinessProfile(input.businessName, input.targetLocation),
        input.websiteUrl ? analyzeWebsite(input.websiteUrl) : { mobileSpeed: 0, ctaScore: 0 },
        analyzeCompetitors(input.businessName, input.industry, input.targetLocation),
        analyzeLocalDemand(input.industry, input.targetLocation)
      ]);
    
    const benchmarks = getIndustryBenchmarks(input.industry);
    
    // STEP 2: Unified Analysis via Gemini
    const personalized = await generatePersonalizedAnalysis(
      input.businessName,
      input.industry,
      input.targetLocation,
      {
        gbp: gbpAnalysis,
        website: websiteAnalysis,
        competitors: competitorAnalysis,
        demand: demandAnalysis,
        benchmarks: benchmarks
      }
    );
    
    // STEP 3: Generate Adaptive Messaging Variants
    const messagingVariants = await generateAdaptiveMessaging(
      input.businessName,
      input.industry,
      input.targetLocation,
      personalized
    );
    
    // STEP 4: Build Comprehensive Audit Output
    const audit = {
      ok: true,
      timestamp: new Date().toISOString(),
      businessName: input.businessName,
      industry: input.industry,
      targetLocation: input.targetLocation,
      
      // Core Intelligence
      seoScore: personalized.seoScore,
      scoreBreakdown: personalized.scoreBreakdown,
      
      // Gap Analysis
      comparisonToBenchmark: personalized.comparisonToBenchmark,
      topOpportunities: personalized.topOpportunities,
      
      // Sales-Ready Hooks
      whatsappHook: personalized.whatsappHook,
      messagingVariants: messagingVariants.variants,
      
      // Proposal Guidance
      proposalInvestmentRange: personalized.proposalInvestmentRange,
      bestMessagingAngle: personalized.bestMessagingAngle,
      
      // Market Context
      marketDemand: demandAnalysis,
      competitiveAnalysis: competitorAnalysis,
      industryBenchmarks: benchmarks
    };
    
    // STEP 5: Log to CRM
    if (process.env.SHEET_WEBHOOK_URL) {
      await fetch(process.env.SHEET_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          timestamp: audit.timestamp,
          businessName: audit.businessName,
          industry: audit.industry,
          targetLocation: audit.targetLocation,
          score: audit.seoScore,
          gapSummary: audit.topOpportunities[0]?.opportunity,
          whatsappHook: audit.whatsappHook,
          proposalMin: audit.proposalInvestmentRange.min,
          proposalMax: audit.proposalInvestmentRange.max
        })
      });
    }
    
    return res.status(200).json(audit);
    
  } catch (error) {
    console.error("Audit generation error:", error);
    return res.status(500).json({
      ok: false,
      error: error.message
    });
  }
};

// Helper functions defined below...
async function analyzeGoogleBusinessProfile(businessName, location) { /* ... */ }
async function analyzeWebsite(url) { /* ... */ }
async function analyzeCompetitors(businessName, industry, location) { /* ... */ }
async function analyzeLocalDemand(industry, location) { /* ... */ }
function getIndustryBenchmarks(industry) { /* ... */ }
async function generatePersonalizedAnalysis(businessName, industry, location, allData) { /* ... */ }
async function generateAdaptiveMessaging(businessName, industry, location, analysis) { /* ... */ }
```

---

## Part 8: Implementation Roadmap

### Phase 1: MVP (Week 1)
- ✅ Google Business Profile analysis (ratings, reviews)
- ✅ Industry benchmarks (hard-coded for 3 verticals)
- ✅ Gemini-powered personalization
- ✅ SEO score generation

### Phase 2: Enhanced (Week 2)
- ✅ Website analysis (speed, CTA, schema)
- ✅ Competitor analysis (top 3 local competitors)
- ✅ Adaptive messaging variants

### Phase 3: Full Intelligence (Week 3)
- ✅ Local demand analysis (search volume, seasonality)
- ✅ Feedback loop (track response rates)
- ✅ Continuous learning (update system over time)

### Phase 4: Advanced Optimization (Week 4)
- ✅ A/B test messaging by vertical/city
- ✅ Dynamic pricing based on market opportunity
- ✅ Predictive response rate scoring

---

## Summary: How the Brain Works

1. **Input:** Business name + industry + location
2. **Analysis:** Simultaneously fetch GBP data, analyze website, research competitors, study market demand, compare to benchmarks
3. **Reasoning:** Gemini synthesizes all data, identifies gaps, assigns scores, creates personalized hooks
4. **Output:** Hyper-personalized audit with 3 messaging variants, proposal range, and specific action priorities
5. **Feedback:** Track which messages work, update system intelligence
6. **Adaptation:** Over time, system learns what works for each vertical/location and optimizes accordingly

This transforms the system from template-based → **truly intelligent and adaptive**.

Would you like me to code the actual implementation for Phase 1 (MVP) to get this live?

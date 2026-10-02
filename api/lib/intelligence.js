// api/lib/intelligence.js
// Core intelligence module - analyzes business data and generates insights

const { GoogleGenAI } = require("@google/genai");

// Industry benchmarks
const INDUSTRY_BENCHMARKS = {
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
    typicalConversionRate: 0.08,
    typicalCPL: 450
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
    typicalConversionRate: 0.12,
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
    typicalConversionRate: 0.15,
    typicalCPL: 520
  }
};

// Analyze Google Business Profile
async function analyzeGoogleBusinessProfile(businessName, location) {
  // Simulated GBP analysis (replace with actual Google Places API)
  // For MVP, return mock data; upgrade to real API later
  
  return {
    ratingScore: Math.random() * 5,
    ratingGap: Math.random() * 1.5,
    reviewCount: Math.floor(Math.random() * 50),
    sentimentScore: 50 + Math.random() * 50,
    photoCount: Math.floor(Math.random() * 30),
    responseRate: Math.random(),
    opportunities: [
      "Improve ratings",
      "Build review volume",
      "Add fresh photos",
      "Respond to all reviews"
    ].filter(() => Math.random() > 0.5),
    source: "google_business_profile"
  };
}

// Analyze website quality
async function analyzeWebsite(websiteUrl) {
  if (!websiteUrl) {
    return {
      mobileSpeed: 0,
      desktopSpeed: 0,
      speedGap: 85,
      ctaScore: 0,
      schemaScore: 0,
      trustScore: 0,
      opportunities: ["Add a website", "Improve mobile speed", "Add CTAs"],
      source: "no_website"
    };
  }

  // Simulated website analysis (replace with Lighthouse/PageSpeed API)
  return {
    mobileSpeed: 40 + Math.random() * 60,
    desktopSpeed: 50 + Math.random() * 50,
    speedGap: Math.random() * 30,
    ctaScore: 20 + Math.random() * 80,
    ctaPresent: {
      callButton: Math.random() > 0.5,
      contactForm: Math.random() > 0.5,
      whatsappLink: Math.random() > 0.7,
      bookingSystem: Math.random() > 0.8
    },
    schemaScore: Math.random() * 100,
    trustScore: 20 + Math.random() * 80,
    opportunities: [
      Math.random() > 0.6 ? "Improve mobile page speed" : null,
      Math.random() > 0.6 ? "Add WhatsApp direct messaging link" : null,
      Math.random() > 0.6 ? "Implement online quote request system" : null,
      Math.random() > 0.6 ? "Add structured schema markup" : null,
      Math.random() > 0.6 ? "Add customer testimonials" : null
    ].filter(Boolean),
    source: "website_analysis"
  };
}

// Analyze local competitors
async function analyzeCompetitors(businessName, industry, location) {
  // Simulated competitor analysis (replace with actual local search)
  
  const competitors = [
    {
      name: `Top Competitor 1 in ${location}`,
      rating: 4.5 + Math.random() * 0.5,
      reviews: 40 + Math.floor(Math.random() * 40),
      mobileSpeed: 70 + Math.random() * 30,
      ctaScore: 70 + Math.random() * 30,
      strengths: ["High rating", "Fast mobile site", "Clear booking CTA"],
      weaknesses: ["Limited service description"]
    },
    {
      name: `Top Competitor 2 in ${location}`,
      rating: 4.2 + Math.random() * 0.6,
      reviews: 25 + Math.floor(Math.random() * 30),
      mobileSpeed: 60 + Math.random() * 35,
      ctaScore: 60 + Math.random() * 35,
      strengths: ["Good portfolio", "Local presence"],
      weaknesses: ["Slow mobile site", "No WhatsApp"]
    },
    {
      name: `Top Competitor 3 in ${location}`,
      rating: 3.8 + Math.random() * 0.7,
      reviews: 15 + Math.floor(Math.random() * 25),
      mobileSpeed: 50 + Math.random() * 40,
      ctaScore: 50 + Math.random() * 40,
      strengths: ["Affordable", "Local owner"],
      weaknesses: ["Outdated website", "Few reviews"]
    }
  ];

  return {
    competitors: competitors,
    competitiveGaps: [
      `Target business has potential to outrank if CTA score improves`,
      `Competitor analysis shows opportunity in ${location}`,
      `Market not oversaturated - room for differentiation`
    ],
    opportunities: [
      "Focus on review generation",
      "Improve mobile speed",
      "Add WhatsApp messaging"
    ],
    source: "competitive_analysis"
  };
}

// Analyze local market demand
async function analyzeLocalDemand(industry, location) {
  // Simulated demand analysis (replace with Google Trends API)
  
  const baseVolume = {
    "Guest House": 1840,
    "Landscaping": 1200,
    "Contractor": 950
  }[industry] || 1000;

  return {
    totalMonthlySearches: baseVolume + Math.floor(Math.random() * 500),
    peakSeasons: ["December", "January", "July", "August"],
    lowSeasons: ["May", "June"],
    estimatedMonthlyLeads: Math.floor((baseVolume + Math.random() * 500) * 0.02),
    topKeywords: [
      { keyword: `${industry} ${location}`, volume: Math.floor(baseVolume * 0.3) },
      { keyword: `best ${industry} ${location}`, volume: Math.floor(baseVolume * 0.25) },
      { keyword: `${industry} near ${location}`, volume: Math.floor(baseVolume * 0.2) }
    ],
    opportunity: baseVolume > 1000 ? "High demand market" : "Niche market",
    source: "market_demand"
  };
}

// Get industry benchmarks
function getIndustryBenchmarks(industry) {
  return INDUSTRY_BENCHMARKS[industry] || INDUSTRY_BENCHMARKS["Contractor"];
}

// Calculate weighted score
function calculateWeightedScore(analyses) {
  const weights = {
    gbp: 0.3,
    website: 0.25,
    competitive: 0.2,
    demand: 0.15,
    industry: 0.1
  };

  const gbpScore = Math.min(100, (analyses.gbp.ratingScore || 0) * 20 + 40);
  const websiteScore = (analyses.website.mobileSpeed || 0) * 0.7 + (analyses.website.ctaScore || 0) * 0.3;
  const competitiveScore = 50 + Math.random() * 50; // Placeholder
  const demandScore = analyses.demand.totalMonthlySearches > 1500 ? 85 : 65;
  const industryScore = 60; // Placeholder

  const weighted =
    gbpScore * weights.gbp +
    websiteScore * weights.website +
    competitiveScore * weights.competitive +
    demandScore * weights.demand +
    industryScore * weights.industry;

  return Math.min(100, Math.max(0, weighted));
}

// Generate personalized analysis using Gemini
async function generatePersonalizedAnalysis(businessName, industry, location, allAnalyses) {
  const apiKey = process.env.GEMINI_API_KEY;
  const model = process.env.GEMINI_MODEL || "gemini-2.0-flash-lite";

  if (!apiKey) {
    // Fallback analysis without Gemini
    return generateFallbackAnalysis(businessName, industry, location, allAnalyses);
  }

  const prompt = `
You are an expert local marketing strategist analyzing a business for acquisition opportunities.

BUSINESS CONTEXT:
- Name: ${businessName}
- Industry: ${industry}
- Location: ${location}

CURRENT PERFORMANCE:
Google Business Profile: Rating ${allAnalyses.gbp.ratingScore?.toFixed(1) || "N/A"}/5, ${allAnalyses.gbp.reviewCount || 0} reviews
Website Quality: Mobile Speed ${allAnalyses.website.mobileSpeed?.toFixed(0) || 0}/100, CTA Score ${allAnalyses.website.ctaScore?.toFixed(0) || 0}/100
Market Demand: ${allAnalyses.demand.totalMonthlySearches} monthly searches, ~${allAnalyses.demand.estimatedMonthlyLeads} potential leads/month

INDUSTRY BENCHMARKS:
Average Rating: ${allAnalyses.benchmarks.avgRating}, Average Reviews: ${allAnalyses.benchmarks.avgReviewCount}, Average Mobile Speed: ${allAnalyses.benchmarks.avgMobileSpeed}

ANALYSIS REQUIRED:
1. Generate SEO Score (0-100) based on all data
2. Identify top 3 opportunities (ordered by ROI)
3. Create specific WhatsApp hook for this business
4. Suggest proposal investment range
5. Identify best messaging angle

Return ONLY valid JSON:
{
  "seoScore": 0-100,
  "topOpportunities": [
    {"opportunity": "string", "gap": "string", "fix": "string", "impact": "string"}
  ],
  "whatsappHook": "string (50-80 words)",
  "proposalRange": {"min": 2999, "max": 5999},
  "messagingAngle": "string",
  "reasoning": "string"
}
  `;

  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model,
      contents: prompt
    });

    const text = response?.text || "{}";
    const cleaned = text.replace(/```json|```/gi, "").trim();
    return JSON.parse(cleaned);
  } catch (error) {
    console.error("Gemini analysis error:", error);
    return generateFallbackAnalysis(businessName, industry, location, allAnalyses);
  }
}

// Fallback analysis if Gemini fails
function generateFallbackAnalysis(businessName, industry, location, allAnalyses) {
  const benchmarks = allAnalyses.benchmarks;
  const seoScore = calculateWeightedScore(allAnalyses);

  return {
    seoScore: Math.round(seoScore),
    topOpportunities: [
      {
        opportunity: "Improve mobile conversion flow",
        gap: `Current CTA score is ${Math.round(allAnalyses.website.ctaScore || 0)}, benchmark is ${benchmarks.avgCtaScore}`,
        fix: "Add WhatsApp direct messaging, improve call-to-action placement",
        impact: "15-25% increase in lead capture rate"
      },
      {
        opportunity: "Build review authority",
        gap: `Current reviews: ${allAnalyses.gbp.reviewCount || 0}, benchmark: ${benchmarks.avgReviewCount}`,
        fix: "Implement review generation campaign, respond to all reviews",
        impact: "Higher map pack ranking, improved trust signals"
      },
      {
        opportunity: "Optimize for local search visibility",
        gap: `Estimated ${allAnalyses.demand.estimatedMonthlyLeads} monthly leads available in ${location}`,
        fix: "Improve local schema markup, optimize for local keywords",
        impact: "Capture 10-20% of available local search demand"
      }
    ],
    whatsappHook: `Hi ${businessName} team, I noticed a few quick wins that could capture more local ${industry.toLowerCase()} inquiries in ${location}. I built a preview showing what improved lead flow could look like. Worth a quick look?`,
    proposalRange: {
      min: Math.max(1999, benchmarks.typicalCPL * 5),
      max: Math.max(3999, benchmarks.typicalCPL * 10)
    },
    messagingAngle: `Local lead capture and conversion optimization for ${industry}`,
    reasoning: "Focused on high-ROI gaps between current and benchmark performance"
  };
}

// Export all functions
module.exports = {
  analyzeGoogleBusinessProfile,
  analyzeWebsite,
  analyzeCompetitors,
  analyzeLocalDemand,
  getIndustryBenchmarks,
  calculateWeightedScore,
  generatePersonalizedAnalysis,
  generateFallbackAnalysis,
  INDUSTRY_BENCHMARKS
};

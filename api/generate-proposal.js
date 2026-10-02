const { GoogleGenAI } = require('@google/genai');

async function callGeminiWithRetry(apiCallFn, retries = 3, delay = 1000) {
    try {
        return await apiCallFn();
    } catch (error) {
        const isUnavailable = error.status === 503 || 
                              (error.message && error.message.includes('503')) ||
                              (error.message && error.message.includes('unavailable'));
        if (retries > 0 && isUnavailable) {
            console.warn(`Gemini 503 High Demand. Retrying in ${delay}ms... (${retries} attempts left)`);
            await new Promise(resolve => setTimeout(resolve, delay));
            return callGeminiWithRetry(apiCallFn, retries - 1, delay * 2);
        }
        throw error;
    }
}

module.exports = async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, error: 'Method Not Allowed' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        return res.status(500).json({ success: false, error: 'GEMINI_API_KEY environment variable is missing.' });
    }

    try {
        const ai = new GoogleGenAI({ apiKey: apiKey });
        const { businessName, industry, targetLocation, identifiedGaps } = req.body;

        if (!businessName || !industry || !targetLocation) {
            return res.status(400).json({ success: false, error: 'Missing required parameters' });
        }

        const prompt = `
            Create a high-converting closing proposal brief with projected conversion uplift and ROI metrics for:
            - Business Name: ${businessName}
            - Industry: ${industry}
            - Location: ${targetLocation}
            - Identified Gaps: ${identifiedGaps || 'Missing schema, slow mobile site, low map pack visibility'}
        `;

        const response = await callGeminiWithRetry(async () => {
            return await ai.models.generateContent({
                model: process.env.GEMINI_MODEL || 'gemini-3.1-flash-lite',
                contents: prompt,
                config: {
                    responseMimeType: 'application/json',
                    responseSchema: {
                        type: "OBJECT",
                        properties: {
                            executiveSummary: { type: "STRING" },
                            recommendedSolution: { 
                                type: "ARRAY", 
                                items: { type: "STRING" }
                            },
                            conversionUpliftEstimate: { type: "STRING", description: "Projected percentage increase in local inbound inquiries" },
                            projectInvestment: { type: "STRING" }
                        },
                        required: ["executiveSummary", "recommendedSolution", "conversionUpliftEstimate", "projectInvestment"]
                    }
                }
            });
        });

        const parsedData = JSON.parse(response.text);

        return res.status(200).json({ success: true, proposal: parsedData });

    } catch (error) {
        return res.status(500).json({ 
            success: false, 
            error: error.message.includes('503') ? 'Model experiencing high demand. Please try again in a few seconds.' : error.message 
        });
    }
};

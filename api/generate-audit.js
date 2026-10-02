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
        const { businessName, industry, targetLocation } = req.body;

        if (!businessName || !industry || !targetLocation) {
            return res.status(400).json({ success: false, error: 'Missing required parameters' });
        }

        const prompt = `
            Analyze the local search performance, mobile speed, schema presence, and map pack visibility for:
            - Business Name: ${businessName}
            - Industry: ${industry}
            - Location: ${targetLocation}
        `;

        const response = await callGeminiWithRetry(async () => {
            return await ai.models.generateContent({
                model: 'gemini-3.1-flash-lite',
                contents: prompt,
                config: {
                    responseMimeType: 'application/json',
                    responseSchema: {
                        type: "OBJECT",
                        properties: {
                            seo_score: { type: "INTEGER", description: "Estimated local SEO score out of 100" },
                            key_pain_points: { 
                                type: "ARRAY", 
                                items: { type: "STRING" },
                                description: "Top 3 technical or local search gaps" 
                            },
                            recommended_fix: { type: "STRING", description: "The single highest-impact technical fix for this business" },
                            whatsappHook: { type: "STRING", description: "Direct, empathetic cold outreach message ready for WhatsApp" }
                        },
                        required: ["seo_score", "key_pain_points", "recommended_fix", "whatsappHook"]
                    }
                }
            });
        });

        const parsedData = JSON.parse(response.text);

        if (process.env.SHEET_WEBHOOK_URL) {
            try {
                await fetch(process.env.SHEET_WEBHOOK_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 
                        businessName, 
                        industry, 
                        targetLocation, 
                        score: parsedData.seo_score,
                        gapSummary: parsedData.recommended_fix, 
                        whatsappHook: parsedData.whatsappHook,
                        timestamp: new Date().toISOString()
                    })
                });
            } catch (sheetError) {
                console.error('Failed to log to Google Sheet webhook:', sheetError.message);
            }
        }

        return res.status(200).json({ success: true, audit: parsedData });

    } catch (error) {
        return res.status(500).json({ 
            success: false, 
            error: error.message.includes('503') ? 'Model experiencing high demand. Please try again in a few seconds.' : error.message 
        });
    }
};

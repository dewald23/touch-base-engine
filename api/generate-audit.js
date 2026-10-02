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
            Perform a rigorous technical audit and local SEO evaluation for:
            - Business Name: ${businessName}
            - Industry: ${industry}
            - Location: ${targetLocation}
            
            Evaluate local map pack ranking potential, mobile conversion friction, missing LocalBusiness JSON-LD schema, and Open Graph metadata gaps.
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
                            seo_score: { type: "INTEGER", description: "Overall local SEO and digital maturity score out of 100" },
                            schema_detected: { type: "BOOLEAN", description: "Estimated presence of valid LocalBusiness JSON-LD markup" },
                            mobile_viewport_ok: { type: "BOOLEAN", description: "Estimated mobile optimization standard" },
                            key_pain_points: { 
                                type: "ARRAY", 
                                items: { type: "STRING" },
                                description: "Top 3 technical or local search gaps" 
                            },
                            recommended_fix: { type: "STRING", description: "The single highest-impact technical fix for this business" },
                            whatsappHook: { type: "STRING", description: "Direct, empathetic cold outreach message ready for WhatsApp" }
                        },
                        required: ["seo_score", "schema_detected", "mobile_viewport_ok", "key_pain_points", "recommended_fix", "whatsappHook"]
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
                        schemaDetected: parsedData.schema_detected,
                        mobileOk: parsedData.mobile_viewport_ok,
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

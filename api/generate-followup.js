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
        const { businessName, industry, targetLocation, originalGap } = req.body;

        if (!businessName || !industry || !targetLocation) {
            return res.status(400).json({ success: false, error: 'Missing required parameters' });
        }

        const prompt = `
            Create a 2-touch WhatsApp follow-up sequence for a local prospect who hasn't replied to their audit:
            - Business Name: ${businessName}
            - Industry: ${industry}
            - Location: ${targetLocation}
            - Original Gap: ${originalGap || 'Local search and mobile conversion friction'}
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
                            dayThreeFollowup: { type: "STRING" },
                            daySevenFollowup: { type: "STRING" }
                        },
                        required: ["dayThreeFollowup", "daySevenFollowup"]
                    }
                }
            });
        });

        const parsedData = JSON.parse(response.text);

        return res.status(200).json({ success: true, followUps: parsedData });

    } catch (error) {
        return res.status(500).json({ 
            success: false, 
            error: error.message.includes('503') ? 'Model experiencing high demand. Please try again in a few seconds.' : error.message 
        });
    }
};

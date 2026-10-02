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
    if (req.method !== 'POST' && req.method !== 'GET') {
        return res.status(405).json({ success: false, error: 'Method Not Allowed' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        return res.status(500).json({ success: false, error: 'GEMINI_API_KEY environment variable is missing.' });
    }

    const businessName = req.body?.businessName || req.query?.businessName || 'Local Business';
    const industry = req.body?.industry || req.query?.industry || 'Service Provider';
    const targetLocation = req.body?.targetLocation || req.query?.targetLocation || 'Overberg, South Africa';

    try {
        const ai = new GoogleGenAI({ apiKey: apiKey });

        const prompt = `
            Create custom copy blocks for a high-converting micro-landing page preview targeting:
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
                            headline: { type: "STRING" },
                            seoFinding: { type: "STRING" },
                            ctaText: { type: "STRING" }
                        },
                        required: ["headline", "seoFinding", "ctaText"]
                    }
                }
            });
        });

        const data = JSON.parse(response.text);

        const htmlContent = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Digital Audit Preview | ${businessName}</title>
            <script src="https://cdn.tailwindcss.com"></script>
            <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@600;700&family=Open+Sans:wght@400;500&display=swap" rel="stylesheet">
            <style>
                body { font-family: 'Open Sans', sans-serif; background-color: #0A0A0A; color: #FFFFFF; }
                h1, h2, h3 { font-family: 'Montserrat', sans-serif; }
            </style>
        </head>
        <body class="antialiased min-h-screen flex flex-col justify-between">
            <header class="border-b border-zinc-900 py-4 px-6 flex justify-between items-center max-w-4xl mx-auto w-full">
                <span class="text-xs tracking-widest uppercase text-[#B8860B] font-bold">Touch Base Consulting | Audit Preview</span>
                <span class="text-xs text-zinc-400">Prepared for ${businessName}</span>
            </header>

            <main class="max-w-4xl mx-auto px-6 py-16 flex-grow">
                <div class="inline-block px-3 py-1 mb-6 text-xs font-semibold tracking-wider text-[#B8860B] uppercase bg-zinc-900 border border-[#B8860B]/30 rounded-full">
                    Exclusive Local SEO Brief &bull; ${targetLocation}
                </div>
                
                <h1 class="text-3xl md:text-5xl font-bold tracking-tight mb-6 leading-tight text-white">
                    ${data.headline}
                </h1>
                
                <p class="text-lg text-zinc-300 mb-10 leading-relaxed">
                    ${data.seoFinding}
                </p>

                <div class="bg-zinc-900/80 border border-zinc-800 rounded-xl p-8 mb-10 shadow-2xl backdrop-blur">
                    <h3 class="text-xl font-bold text-white mb-3">The Growth Opportunity</h3>
                    <p class="text-zinc-400 mb-8 leading-relaxed">
                        High-intent customers in ${targetLocation} searching for ${industry} services are currently routing directly to your top competitors due to map pack friction and missing mobile conversion triggers.
                    </p>
                    <a href="https://wa.me/?text=Hi%20Touch%20Base%20Team,%20let%27s%20discuss%20the%20audit%20for%20${encodeURIComponent(businessName)}" 
                       class="inline-flex items-center justify-center w-full md:w-auto px-8 py-4 bg-[#B8860B] hover:bg-[#a0750a] text-black font-bold rounded-lg transition shadow-lg">
                        ${data.ctaText} &rarr;
                    </a>
                </div>
            </main>

            <footer class="border-t border-zinc-900 text-center py-6 text-xs text-zinc-500 max-w-4xl mx-auto w-full">
                &copy; ${new Date().getFullYear()} Touch Base Consulting, Hermanus, South Africa. All rights reserved.
            </footer>
        </body>
        </html>
        `;

        return res.setHeader('Content-Type', 'text/html').status(200).send(htmlContent);

    } catch (error) {
        return res.status(500).json({ 
            success: false, 
            error: error.message.includes('503') ? 'Model experiencing high demand. Please try again in a few seconds.' : error.message 
        });
    }
};

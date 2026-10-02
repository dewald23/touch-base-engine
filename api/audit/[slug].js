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
    if (req.method !== 'GET') {
        return res.status(405).json({ success: false, error: 'Method Not Allowed' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        return res.status(500).send('GEMINI_API_KEY environment variable is missing.');
    }

    const { slug } = req.query;
    if (!slug) {
        return res.status(400).send('Missing prospect slug parameter.');
    }

    const businessName = slug
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

    const industry = req.query.industry || 'Local Service Provider';
    const targetLocation = req.query.location || 'Overberg, South Africa';

    try {
        const ai = new GoogleGenAI({ apiKey: apiKey });

        const prompt = `
            Design full website copy for a high-converting professional website preview targeting:
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
                            heroHeadline: { type: "STRING", description: "Commanding headline capturing local authority" },
                            heroSubheadline: { type: "STRING", description: "Engaging subheadline addressing customer pain points" },
                            services: {
                                type: "ARRAY",
                                items: {
                                    type: "OBJECT",
                                    properties: {
                                        title: { type: "STRING" },
                                        description: { type: "STRING" }
                                    },
                                    required: ["title", "description"]
                                },
                                description: "3 core services tailored to this business"
                            },
                            socialProof: { type: "STRING", description: "A persuasive customer testimonial or quality guarantee statement" },
                            ctaText: { type: "STRING", description: "Action button text for booking or contacting" }
                        },
                        required: ["heroHeadline", "heroSubheadline", "services", "socialProof", "ctaText"]
                    }
                }
            });
        });

        const data = JSON.parse(response.text);

        // Edge Caching for 24 hours
        res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate');

        // Curated Unsplash placeholder image based on industry vibe
        const heroImage = `https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80`;

        const htmlContent = `
        <!DOCTYPE html>
        <html lang="en" class="scroll-smooth">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>${businessName} | Official Website Preview</title>
            <script src="https://cdn.tailwindcss.com"></script>
            <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@600;700;800&family=Open+Sans:wght@400;500;600&display=swap" rel="stylesheet">
            <style>
                body { font-family: 'Open Sans', sans-serif; background-color: #0A0A0A; color: #FFFFFF; }
                h1, h2, h3, h4, .brand-font { font-family: 'Montserrat', sans-serif; }
            </style>
        </head>
        <body class="antialiased min-h-screen flex flex-col justify-between selection:bg-[#B8860B] selection:text-black">

            <!-- Navigation Bar -->
            <header class="border-b border-zinc-900 bg-[#0A0A0A]/90 sticky top-0 z-50 backdrop-blur">
                <div class="max-w-6xl mx-auto px-6 h-20 flex justify-between items-center">
                    <div class="flex items-center space-x-3">
                        <span class="w-3 h-3 bg-[#B8860B] rounded-full"></span>
                        <span class="brand-font font-bold text-lg tracking-wider text-white uppercase">${businessName}</span>
                    </div>
                    <div class="hidden md:flex items-center space-x-6 text-sm text-zinc-400">
                        <a href="#services" class="hover:text-[#B8860B] transition">Services</a>
                        <a href="#about" class="hover:text-[#B8860B] transition">About</a>
                        <a href="#contact" class="px-4 py-2 bg-[#B8860B] hover:bg-[#a0750a] text-black font-bold rounded-lg transition">Get in Touch</a>
                    </div>
                </div>
            </header>

            <!-- Hero Section with Image & Value Prop -->
            <main class="flex-grow">
                <section class="max-w-6xl mx-auto px-6 py-16 md:py-24 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    <div class="space-y-6">
                        <div class="inline-block px-3 py-1 text-xs font-semibold tracking-wider text-[#B8860B] uppercase bg-zinc-900 border border-[#B8860B]/30 rounded-full">
                            Serving ${targetLocation} &bull; Professional ${industry}
                        </div>
                        <h1 class="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight text-white">
                            ${data.heroHeadline}
                        </h1>
                        <p class="text-lg text-zinc-300 leading-relaxed">
                            ${data.heroSubheadline}
                        </p>
                        <div class="pt-4 flex flex-col sm:flex-row gap-4">
                            <a href="https://wa.me/?text=Hi%20${encodeURIComponent(businessName)},%20I%20saw%20your%20website%20preview%20built%20by%20Touch%20Base%20Consulting." 
                               class="inline-flex items-center justify-center px-8 py-4 bg-[#B8860B] hover:bg-[#a0750a] text-black font-bold rounded-lg transition shadow-xl text-center">
                                ${data.ctaText} &rarr;
                            </a>
                            <a href="#services" class="inline-flex items-center justify-center px-8 py-4 bg-zinc-900 hover:bg-zinc-800 text-white font-semibold rounded-lg border border-zinc-800 transition text-center">
                                Explore Services
                            </a>
                        </div>
                    </div>
                    <div class="relative">
                        <div class="absolute -inset-1 bg-gradient-to-r from-[#B8860B] to-transparent rounded-2xl blur opacity-30"></div>
                        <div class="relative rounded-2xl overflow-hidden border border-zinc-800 shadow-2xl bg-zinc-900 aspect-video md:aspect-square">
                            <img src="${heroImage}" alt="${businessName} Preview" class="w-full h-full object-cover opacity-90 hover:scale-105 transition duration-500">
                        </div>
                    </div>
                </section>

                <!-- Services Grid -->
                <section id="services" class="border-t border-zinc-900 bg-zinc-950 py-24">
                    <div class="max-w-6xl mx-auto px-6">
                        <div class="text-center max-w-2xl mx-auto mb-16">
                            <span class="text-xs uppercase tracking-widest text-[#B8860B] font-bold">Expertise & Solutions</span>
                            <h2 class="text-3xl md:text-4xl font-bold mt-2 text-white">Designed for High Conversion</h2>
                            <p class="text-zinc-400 mt-4 text-sm">Engineered to capture local search traffic in ${targetLocation} and turn visitors into loyal clients.</p>
                        </div>
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                            ${data.services.map((service, index) => `
                                <div class="bg-zinc-900/80 border border-zinc-800/80 rounded-xl p-8 hover:border-[#B8860B]/50 transition shadow-lg flex flex-col justify-between">
                                    <div>
                                        <div class="w-10 h-10 rounded-lg bg-black border border-[#B8860B]/30 flex items-center justify-center text-[#B8860B] font-bold mb-6">
                                            0${index + 1}
                                        </div>
                                        <h3 class="text-xl font-bold text-white mb-3">${service.title}</h3>
                                        <p class="text-zinc-400 text-sm leading-relaxed">${service.description}</p>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </section>

                <!-- Social Proof / Testimonial Section -->
                <section class="py-20 border-t border-zinc-900">
                    <div class="max-w-4xl mx-auto px-6 text-center">
                        <div class="bg-zinc-900 border border-zinc-800 rounded-2xl p-10 md:p-14 relative shadow-2xl">
                            <span class="text-5xl text-[#B8860B] font-serif absolute top-6 left-8 opacity-40">&ldquo;</span>
                            <p class="text-lg md:text-xl text-zinc-200 italic leading-relaxed mb-6 relative z-10">
                                "${data.socialProof}"
                            </p>
                            <span class="text-xs uppercase tracking-widest text-[#B8860B] font-bold">&bull; Verified Client Standard &bull;</span>
                        </div>
                    </div>
                </section>

                <!-- Contact / Footer Banner -->
                <section id="contact" class="border-t border-zinc-900 bg-black py-20 text-center">
                    <div class="max-w-3xl mx-auto px-6 space-y-6">
                        <h2 class="text-3xl md:text-4xl font-bold text-white">Ready to Dominate ${targetLocation}?</h2>
                        <p class="text-zinc-400 text-sm">Claim this fully optimized digital preview and upgrade your online presence today.</p>
                        <div class="pt-2">
                            <a href="https://wa.me/?text=Hi%20Touch%20Base%20Team,%20let%27s%20claim%20the%20preview%20for%20${encodeURIComponent(businessName)}" 
                               class="inline-flex items-center justify-center px-8 py-4 bg-[#B8860B] hover:bg-[#a0750a] text-black font-bold rounded-lg transition shadow-xl">
                                Claim Full Website &rarr;
                            </a>
                        </div>
                    </div>
                </section>
            </main>

            <!-- Footer -->
            <footer class="border-t border-zinc-900 bg-[#0A0A0A] py-12">
                <div class="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-xs text-zinc-500 space-y-4 md:space-y-0">
                    <div>
                        &copy; ${new Date().getFullYear()} ${businessName}. All rights reserved.
                    </div>
                    <div class="flex items-center space-x-2 text-zinc-400">
                        <span>Crafted with precision by</span>
                        <span class="text-[#B8860B] font-bold">Touch Base Consulting</span>
                        <span>&bull; Hermanus, SA</span>
                    </div>
                </div>
            </footer>

        </body>
        </html>
        `;

        return res.setHeader('Content-Type', 'text/html').status(200).send(htmlContent);

    } catch (error) {
        return res.status(500).send(
            error.message.includes('503') 
                ? 'Model experiencing high demand. Please try again in a few seconds.' 
                : error.message
        );
    }
};

const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Root dashboard
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// POST /api/generate-audit
app.post('/api/generate-audit', (req, res) => {
    const { businessName, targetLocation, industry } = req.body;
    const slug = businessName ? businessName.toLowerCase().replace(/\s+/g, '-') : 'target-business';
    
    res.json({
        status: 'success',
        data: {
            seoScore: 62,
            primaryGap: `Sub-optimal mobile conversion flow and missing direct engagement triggers in ${targetLocation || 'Hermanus'}.`,
            outreachHook: `Hi team at ${businessName || 'Business'}, love your footprint in ${targetLocation || 'Hermanus'}. I'm local here in Sandbaai with Touch Base Consulting. Noticed a clear opening to capture high-intent local mobile traffic. Check out this preview: https://touch-base-consulting.vercel.app/api/audit/${slug}. Take a look when you have two minutes and let me know your thoughts.`,
            previewSlug: `/api/audit/${slug}`,
            proposalTier: 'R3,500 - R5,000 | Direct Conversion & Speed Refresh'
        }
    });
});

// POST /api/generate-followup
app.post('/api/generate-followup', (req, res) => {
    const { businessName, targetLocation } = req.body;
    res.json({
        status: 'success',
        data: {
            followUpMessage: `Hi team at ${businessName || 'Business'}, checking in briefly. Did you get a chance to look at the mobile preview link for ${targetLocation || 'Hermanus'}? Happy to share the exact leak points where direct inquiries are dropping off.`
        }
    });
});

// POST /api/generate-proposal
app.post('/api/generate-proposal', (req, res) => {
    const { businessName } = req.body;
    res.json({
        status: 'success',
        data: {
            proposalTitle: `Executive Growth Brief for ${businessName || 'Client'}`,
            estimatedRoi: '3x to 5x increase in direct mobile lead capture within 30 days',
            investment: 'R4,500 (One-time setup & optimization)'
        }
    });
});

// GET /api/audit/:slug - Renders visual preview page locally
app.get('/api/audit/:slug', (req, res) => {
    const { slug } = req.params;
    const businessName = slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    
    res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Digital Growth Preview | ${businessName}</title>
            <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@600;700;800&family=Open+Sans:wght@400;500;600&display=swap" rel="stylesheet">
            <script src="https://cdn.tailwindcss.com"></script>
            <script>
                tailwind.config = {
                    theme: {
                        extend: {
                            colors: {
                                brandGold: '#B8860B',
                                brandGoldDark: '#996F09',
                                darkBg: '#0A0A0A',
                                cardBg: '#141414',
                                borderDark: '#262626'
                            },
                            fontFamily: {
                                heading: ['Montserrat', 'sans-serif'],
                                body: ['Open Sans', 'sans-serif']
                            }
                        }
                    }
                }
            </script>
        </head>
        <body class="bg-darkBg text-gray-100 font-body min-h-screen">
            <header class="border-b border-borderDark bg-cardBg/80 sticky top-0 z-50">
                <div class="max-w-5xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div class="flex items-center space-x-3">
                        <div class="w-10 h-10 rounded-lg bg-brandGold flex items-center justify-center text-black font-heading font-extrabold text-xl">TB</div>
                        <div>
                            <h1 class="font-heading font-bold text-sm tracking-wide text-white">TOUCH BASE CONSULTING</h1>
                            <p class="text-xs text-brandGold font-body uppercase tracking-wider">Client Preview Concept</p>
                        </div>
                    </div>
                    <span class="px-3 py-1 rounded-full text-xs font-medium bg-brandGold/10 text-brandGold border border-brandGold/30">
                        Live Optimization Preview
                    </span>
                </div>
            </header>

            <main class="max-w-5xl mx-auto px-6 py-12 space-y-8">
                <div class="bg-cardBg border border-borderDark rounded-2xl p-8 shadow-2xl relative overflow-hidden">
                    <div class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-brandGold to-amber-600"></div>
                    <span class="text-xs uppercase font-semibold text-brandGold tracking-wider">Target Asset</span>
                    <h2 class="font-heading font-extrabold text-3xl text-white mt-1 mb-4">${businessName}</h2>
                    <p class="text-gray-300 text-base leading-relaxed">
                        This high-converting mobile layout concept was custom-engineered by Touch Base Consulting to eliminate lead leakage, accelerate mobile page speed, and capture direct local inquiries instantly.
                    </p>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div class="bg-cardBg border border-borderDark rounded-xl p-6">
                        <div class="w-8 h-8 rounded bg-brandGold/10 text-brandGold flex items-center justify-center font-bold mb-4">1</div>
                        <h4 class="font-heading font-bold text-white mb-2">WhatsApp Click-to-Chat</h4>
                        <p class="text-sm text-gray-400">Enables high-intent mobile visitors to start instant quote conversations in one tap.</p>
                    </div>
                    <div class="bg-cardBg border border-borderDark rounded-xl p-6">
                        <div class="w-8 h-8 rounded bg-brandGold/10 text-brandGold flex items-center justify-center font-bold mb-4">2</div>
                        <h4 class="font-heading font-bold text-white mb-2">Mobile Speed Optimization</h4>
                        <p class="text-sm text-gray-400">Streamlined assets engineered to load under 1.8 seconds on cellular networks.</p>
                    </div>
                    <div class="bg-cardBg border border-borderDark rounded-xl p-6">
                        <div class="w-8 h-8 rounded bg-brandGold/10 text-brandGold flex items-center justify-center font-bold mb-4">3</div>
                        <h4 class="font-heading font-bold text-white mb-2">Local Map Pack Schema</h4>
                        <p class="text-sm text-gray-400">Structured data markup designed to dominate local Overberg search results.</p>
                    </div>
                </div>

                <div class="bg-brandGold/10 border border-brandGold/30 rounded-2xl p-8 text-center space-y-4">
                    <h3 class="font-heading font-bold text-xl text-white">Ready to deploy this conversion engine for ${businessName}?</h3>
                    <p class="text-sm text-gray-300 max-w-xl mx-auto">Let's lock in your direct local lead capture flow. Reach out directly via WhatsApp to review the full setup.</p>
                    <a href="https://wa.me/27820000000" target="_blank" class="inline-block bg-brandGold hover:bg-brandGoldDark text-black font-heading font-bold py-3 px-8 rounded-lg transition-colors">
                        Connect with Touch Base Consulting
                    </a>
                </div>
            </main>
        </body>
        </html>
    `);
});

app.listen(PORT, () => {
    console.log(`Touch Base Intelligence App running at http://localhost:${PORT}`);
});

module.exports = (req, res) => {
    res.status(200).json({ 
        system: "Touch Base Consulting | Agency OS", 
        status: "Online",
        engine: "gemini-3.1-flash-lite",
        hq: "Sandbaai, Hermanus, Western Cape, South Africa",
        whatsapp: "+27 75 090 8984",
        email: "customerservice@touchbaseconsulting.co.za",
        endpoints: [
            "GET /",
            "POST /api/generate-audit",
            "POST /api/generate-micro-page",
            "POST /api/generate-followup",
            "POST /api/generate-proposal",
            "GET /api/audit/[slug]"
        ]
    });
};

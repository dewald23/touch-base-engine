module.exports = (req, res) => {
    res.status(200).json({ 
        system: "Touch Base Consulting | Agency OS", 
        status: "Online",
        engine: "gemini-3.1-flash-lite",
        endpoints: [
            "/api/generate-audit",
            "/api/generate-micro-page",
            "/api/generate-followup",
            "/api/generate-proposal",
            "/api/audit/[slug]"
        ]
    });
};

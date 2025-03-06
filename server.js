const express = require('express');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const defaultFindings = {
    "Liver": "Normal.",
    "Gallbladder": "Normal.",
    "Pancreas": "Normal.",
    "Spleen": "Normal.",
    "Appendix": "Normal.",
    "Small Bowel": "Normal.",
    "Large Bowel": "Normal.",
    "Lungs": "Normal.",
    "Heart": "Normal."
};

// Function to generate a structured report
function generateReport(transcription) {
    let findings = { ...defaultFindings };

    // Update findings based on user input
    if (transcription.toLowerCase().includes("appendix is inflamed")) {
        findings["Appendix"] = "Inflamed.";
    }

    // Create the structured findings section
    let findingsText = "Findings:\n" + Object.entries(findings)
        .map(([key, value]) => `${key}: ${value}`)
        .join("\n");

    // Generate impression dynamically
    let impression = "No acute findings.";
    if (findings["Appendix"] === "Inflamed.") {
        impression = "Findings suggest **acute appendicitis**. Consider clinical correlation.";
    }

    return `${findingsText}\n\nImpression:\n${impression}`;
}

// API endpoint
app.post('/api/generate-report', (req, res) => {
    const { transcription } = req.body;
    if (!transcription) {
        return res.status(400).json({ error: "Missing transcription input" });
    }

    const report = generateReport(transcription);
    res.json({ report });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});


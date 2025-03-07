const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

app.post("/api/generate-report", (req, res) => {
    const { transcription } = req.body;
    const findings = generateFindings(transcription);
    const impression = generateImpression(findings);

    const report = `
FINDINGS:
${findings}

IMPRESSION:
${impression}
    `.trim();

    res.json({ report });
});

function generateFindings(transcription) {
    let findings = {
        LUNGS: "No focal consolidation, effusion, or pneumothorax.",
        PLEURA: "No pleural effusion or thickening.",
        MEDIASTINUM: "No significant lymphadenopathy.",
        HEART: "Normal heart size.",
        AORTA: "No aneurysm or dissection.",
        ESOPHAGUS: "No esophageal abnormality.",
        CHEST_WALL: "No suspicious osseous lesions or soft tissue abnormalities."
    };

    if (transcription.includes("nodule")) {
        findings.LUNGS = "Small 2mm nodule in the right upper lobe noted.";
    }

    return Object.entries(findings).map(([key, value]) => `${key}: ${value}`).join("\n\n");
}

function generateImpression(findings) {
    let impression = [];

    if (findings.includes("nodule")) {
        impression.push("Small 2mm pulmonary nodule in the right upper lobe.");
        impression.push("Follow-up as clinically indicated.");
    }

    return impression.join("\n\n") || "No acute findings.";
}

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

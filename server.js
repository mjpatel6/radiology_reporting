const express = require("express");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

app.post("/api/generate-report", (req, res) => {
    const { transcription } = req.body;

    if (!transcription) {
        return res.status(400).json({ error: "No transcription provided" });
    }

    const findings = generateFindings(transcription);
    const impression = generateImpression(findings);

    const report = `
FINDINGS:

${findings}

IMPRESSION:

${impression}
    `;

    res.json({ report });
});

const generateFindings = (transcription) => {
    let findings = {
        lungs: "No focal consolidation, pneumothorax, or effusion.",
        pleura: "No pleural effusion or thickening.",
        mediastinum: "No significant lymphadenopathy.",
        heart: "Heart size within normal limits. No pericardial effusion.",
        chestWall: "No acute abnormalities of the chest wall or soft tissues.",
    };

    if (transcription.includes("nodule")) {
        findings.lungs = "2mm nodule in the right upper lobe noted.";
    }

    let formattedFindings = "";
    for (const [key, value] of Object.entries(findings)) {
        formattedFindings += `${value}\n\n`;
    }

    return formattedFindings.trim();
};

const generateImpression = (findings) => {
    if (findings.includes("nodule")) {
        return "Small 2mm pulmonary nodule in the right upper lobe. Follow-up as clinically indicated.";
    }
    return "No acute cardiopulmonary findings.";
};

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

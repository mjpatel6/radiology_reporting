const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

app.post("/api/generate-report", (req, res) => {
    const { transcription } = req.body;
    
    const { modality, bodyPart, filteredText } = parseTranscription(transcription);
    const findings = generateFindings(filteredText, bodyPart);
    const impression = generateImpression(findings);

    const report = `
FINDINGS:

${findings}

IMPRESSION:

${impression}
    `.trim();

    res.json({ report });
});

function parseTranscription(transcription) {
    const modalities = ["ct", "mri", "us", "xr", "x-ray", "ultrasound"];
    const bodyParts = ["head", "brain", "chest", "abdomen", "pelvis", "spine", "neck", "extremity", "knee", "shoulder", "hip"];

    let words = transcription.toLowerCase().split(/\s+/);
    let modality = words.find(word => modalities.includes(word)) || "unspecified";
    let bodyPart = words.find(word => bodyParts.includes(word)) || "general";

    let filteredText = words.filter(word => !modalities.includes(word) && !bodyParts.includes(word)).join(" ");

    return { modality, bodyPart, filteredText };
}

function generateFindings(transcription, bodyPart) {
    let templates = {
        general: {
            LUNGS: "No focal consolidation, effusion, or pneumothorax.",
            PLEURA: "No pleural effusion or thickening.",
            MEDIASTINUM: "No significant lymphadenopathy.",
            HEART: "Normal heart size.",
            AORTA: "No aneurysm or dissection.",
            ESOPHAGUS: "No esophageal abnormality.",
            CHEST_WALL: "No suspicious osseous lesions or soft tissue abnormalities."
        },
        abdomen: {
            LIVER: "No focal liver lesion.",
            GALLBLADDER: "No gallstones or wall thickening.",
            PANCREAS: "Normal pancreatic contour.",
            SPLEEN: "Normal splenic size.",
            KIDNEYS: "No hydronephrosis or mass.",
            BOWEL: "No bowel obstruction or inflammatory changes.",
            AORTA: "No aneurysm or dissection."
        },
        brain: {
            PARENCHYMA: "No acute intracranial hemorrhage or infarct.",
            VENTRICLES: "No hydrocephalus.",
            CISTERNS: "No abnormal effacement.",
            SINUSES: "No acute sinus disease."
        },
        spine: {
            ALIGNMENT: "Normal vertebral alignment.",
            DISC: "No significant disc bulge or herniation.",
            CORD: "No abnormal signal in spinal cord."
        }
    };

    let findings = templates[bodyPart] || templates.general;

    // Modify findings based on the transcription
    if (transcription.includes("nodule")) {
        findings.LUNGS = "Small pulmonary nodule noted.";
    }
    if (transcription.includes("cardiomegaly")) {
        findings.HEART = "Cardiomegaly present.";
    }
    if (transcription.includes("hiatal hernia")) {
        findings.ESOPHAGUS = "Small hiatal hernia noted.";
    }
    if (transcription.includes("mass")) {
        findings.BOWEL = "Soft tissue mass identified, further evaluation required.";
    }
    if (transcription.includes("stroke")) {
        findings.PARENCHYMA = "Findings consistent with acute infarct.";
    }
    if (transcription.includes("hernia")) {
        findings.ABDOMEN = "Hernia noted in the abdominal wall.";
    }

    return Object.entries(findings)
        .map(([key, value]) => `${key}: ${value}`)
        .join("\n\n");
}

function generateImpression(findings) {
    let impression = [];

    if (findings.includes("nodule")) {
        impression.push("Pulmonary nodule noted. Follow-up per Fleischner Society guidelines.");
    }
    if (findings.includes("Cardiomegaly")) {
        impression.push("Cardiomegaly. Correlate with echocardiogram.");
    }
    if (findings.includes("hiatal hernia")) {
        impression.push("Small hiatal hernia, incidental finding.");
    }
    if (findings.includes("stroke")) {
        impression.push("Findings consistent with acute infarct. Recommend neurology consultation.");
    }
    if (findings.includes("mass")) {
        impression.push("Abdominal mass identified. Consider further imaging or biopsy.");

    return impression.join("\n\n") || "No acute findings.";
}

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

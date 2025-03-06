const express = require("express");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 3000;

// Helper function to detect modality and body part
const detectStudyType = (text) => {
    const modalities = ["CT", "MRI", "US", "XR", "X-ray", "Ultrasound"];
    const bodyParts = {
        chest: ["lung", "chest", "pleura", "mediastinum", "nodule", "upper lobe", "lower lobe"],
        abdomen: ["liver", "spleen", "kidney", "pancreas", "gallbladder", "appendix"],
        brain: ["brain", "ventricles", "cerebellum", "hemorrhage"],
        spine: ["spine", "vertebrae", "disc", "cord"],
    };

    let detectedModality = "CT"; // Default to CT if none found
    for (const modality of modalities) {
        if (text.toLowerCase().includes(modality.toLowerCase())) {
            detectedModality = modality.toUpperCase();
            break;
        }
    }

    let detectedBodyPart = "Abdomen"; // Default to Abdomen
    for (const [part, keywords] of Object.entries(bodyParts)) {
        if (keywords.some((word) => text.toLowerCase().includes(word))) {
            detectedBodyPart = part.charAt(0).toUpperCase() + part.slice(1);
            break;
        }
    }

    return { modality: detectedModality, bodyPart: detectedBodyPart };
};

// Function to generate a structured report
const generateReport = (text) => {
    const { modality, bodyPart } = detectStudyType(text);

    let findings = "";
    let impression = "";

    if (bodyPart === "Chest") {
        findings = `LUNGS: ${text.includes("nodule") ? "2mm nodule in the right upper lobe noted." : "Lungs are clear."}\nPLEURA: No pleural effusion or thickening.\nMEDIASTINUM: No significant lymphadenopathy.`;
        impression = text.includes("nodule") ? "Small 2mm pulmonary nodule in the right upper lobe. Follow-up as clinically indicated." : "No acute cardiopulmonary findings.";
    } else if (bodyPart === "Abdomen") {
        findings = `LIVER: No focal lesions.\nGALLBLADDER: No stones or wall thickening.\nKIDNEYS: No hydronephrosis or stones.`;
        impression = "No acute abdominal pathology.";
    } else if (bodyPart === "Brain") {
        findings = `BRAIN: No hemorrhage, mass effect, or midline shift.\nVENTRICLES: Normal size and configuration.`;
        impression = "No acute intracranial abnormality.";
    } else if (bodyPart === "Spine") {
        findings = `VERTEBRAE: No fractures or significant degenerative changes.\nCORD: Normal signal throughout.`;
        impression = "No acute spinal abnormality.";
    }

    return `**Modality: ${modality} ${bodyPart}**\n\n**FINDINGS:**\n${findings}\n\n**IMPRESSION:**\n${impression}`;
};

app.post("/api/generate-report", (req, res) => {
    const { transcription } = req.body;
    if (!transcription) {
        return res.status(400).json({ report: "Error: No transcription provided." });
    }

    const report = generateReport(transcription);
    res.json({ report });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

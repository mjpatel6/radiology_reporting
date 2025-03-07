const express = require("express");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 3000;

// Function to generate a structured radiology report
function generateReport(transcription) {
  if (!transcription || typeof transcription !== "string") {
    return "Error: Invalid input.";
  }

  // Convert to lowercase for consistency
  const inputText = transcription.toLowerCase();

  // Determine modality
  let modality = "CT";
  if (inputText.includes("mri")) modality = "MRI";
  if (inputText.includes("ultrasound") || inputText.includes("us")) modality = "Ultrasound";
  if (inputText.includes("x-ray") || inputText.includes("xr")) modality = "X-ray";

  // Determine body region
  let bodyPart = "Abdomen/Pelvis"; // Default
  if (inputText.includes("chest")) bodyPart = "Chest";
  if (inputText.includes("brain") || inputText.includes("head")) bodyPart = "Brain";
  if (inputText.includes("spine")) bodyPart = "Spine";
  if (inputText.includes("neck")) bodyPart = "Neck";
  if (inputText.includes("extremity")) bodyPart = "Extremity";

  // Template for different studies
  const findings = {
    Chest: {
      Lungs: inputText.includes("nodule") ? "Pulmonary nodule noted." : "No pulmonary nodule or mass.",
      Pleura: inputText.includes("effusion") ? "Pleural effusion present." : "No pleural effusion.",
      Mediastinum: inputText.includes("cardiomegaly") ? "Cardiomegaly noted." : "No significant mediastinal abnormality.",
      Heart: inputText.includes("enlarged heart") ? "Heart size is enlarged." : "Normal heart size."
    },
    AbdomenPelvis: {
      Liver: inputText.includes("liver lesion") ? "Liver lesion identified." : "No focal hepatic lesion.",
      Gallbladder: inputText.includes("gallstone") ? "Gallstones present." : "Gallbladder is unremarkable.",
      Pancreas: inputText.includes("pancreatitis") ? "Findings consistent with pancreatitis." : "Pancreas appears normal."
    },
    Brain: {
      BrainParenchyma: inputText.includes("stroke") ? "Acute infarct identified." : "No acute infarct or hemorrhage.",
      Ventricles: inputText.includes("hydrocephalus") ? "Ventricular enlargement present." : "Ventricles are normal in size."
    },
    Spine: {
      Vertebrae: inputText.includes("fracture") ? "Vertebral fracture identified." : "No acute vertebral fracture.",
      Discs: inputText.includes("herniation") ? "Disc herniation present." : "No significant disc herniation."
    }
  };

  // Selecting findings based on body part
  const selectedFindings = findings[bodyPart] || findings.AbdomenPelvis;

  // Construct the structured findings
  let findingsText = "";
  for (const [section, text] of Object.entries(selectedFindings)) {
    findingsText += `${section.toUpperCase()}: ${text}\n`;
  }

  // Generate the impression
  let impression = "No acute findings.";
  if (inputText.includes("nodule")) {
    impression = "Pulmonary nodule present. Follow-up as clinically indicated.";
  } else if (inputText.includes("fracture")) {
    impression = "Vertebral fracture identified. Further evaluation recommended.";
  }

  // Final report format
  return `FINDINGS:\n${findingsText}\nIMPRESSION:\n${impression}`;
}

// API Endpoint
app.post("/api/generate-report", (req, res) => {
  const { transcription } = req.body;
  const report = generateReport(transcription);
  res.json({ report });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

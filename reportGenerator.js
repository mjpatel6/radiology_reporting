function generateReport(transcription, modality, bodyPart) {
  if (!transcription || typeof transcription !== "string") {
    return { findings: "Error: Invalid input.", impression: "" };
  }

  const inputText = transcription.toLowerCase();

  // Findings templates based on modality and body part
  const findingsTemplates = {
    CT: {
      Chest: "CT of the chest shows no acute abnormalities.",
      Brain: "CT of the brain shows no evidence of infarct or hemorrhage.",
      AbdomenPelvis: "CT abdomen and pelvis is unremarkable.",
      Spine: "CT of the spine shows no fractures or significant degenerative changes.",
    },
    MRI: {
      Chest: "MRI of the chest shows no mass or lymphadenopathy.",
      Brain: "MRI of the brain is unremarkable for acute pathology.",
      AbdomenPelvis: "MRI of the abdomen and pelvis shows no significant lesions.",
      Spine: "MRI of the spine reveals no spinal cord compression or disc herniation.",
    },
    Ultrasound: {
      Chest: "Ultrasound of the chest shows no pleural effusion.",
      AbdomenPelvis: "Ultrasound of the abdomen is unremarkable.",
    },
    Xray: {
      Chest: "Chest X-ray shows clear lungs and no signs of pneumonia.",
      Spine: "X-ray of the spine shows no fractures or abnormal alignment.",
    },
  };

  // Default finding based on selection
  const findings = findingsTemplates[modality]?.[bodyPart] || "No significant findings noted.";

  // Impression based on keyword detection
  let impression = "No acute findings.";
  if (inputText.includes("nodule")) {
    impression = "Pulmonary nodule present. Follow-up as clinically indicated.";
  } else if (inputText.includes("fracture")) {
    impression = "Vertebral fracture identified. Further evaluation recommended.";
  } else if (inputText.includes("mass")) {
    impression = "Soft tissue mass detected. Correlation with further imaging is suggested.";
  }

  return { findings, impression };
}

module.exports = { generateReport };

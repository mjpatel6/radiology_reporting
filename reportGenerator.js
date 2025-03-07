function generateReport(transcription, modality, bodyPart) {
  if (!transcription || typeof transcription !== "string") {
    return { findings: "Error: Invalid input.", impression: "" };
  }

  const inputText = transcription.toLowerCase();

  // Detailed organ-system-based report structure
  let findings = "";
  let impression = "";

  if (modality === "CT" && bodyPart === "Chest") {
    findings += "**Lungs:** No focal consolidation, effusion, or pneumothorax. Mild bibasilar atelectasis noted.\n";
    findings += "**Mediastinum:** No significant lymphadenopathy. Normal cardiac silhouette.\n";
    findings += "**Pleura:** No pleural thickening or calcifications.\n";
    findings += "**Bones:** No acute fractures or lytic lesions.\n";
    
    impression = "No acute cardiopulmonary abnormality. Mild atelectasis may be related to shallow breathing.";
  }

  if (modality === "MRI" && bodyPart === "Brain") {
    findings += "**Gray and White Matter:** No acute infarct, hemorrhage, or demyelination.\n";
    findings += "**Ventricular System:** Normal ventricular size and midline structures.\n";
    findings += "**Cerebellum:** No cerebellar lesions or mass effect.\n";
    findings += "**Sinuses:** Paranasal sinuses and mastoid air cells are clear.\n";
    
    impression = "Unremarkable MRI of the brain. No acute intracranial abnormality.";
  }

  if (modality === "Ultrasound" && bodyPart === "Abdomen/Pelvis") {
    findings += "**Liver:** Normal echotexture, no focal lesions.\n";
    findings += "**Gallbladder:** No gallstones or wall thickening.\n";
    findings += "**Kidneys:** No hydronephrosis or calculi.\n";
    findings += "**Bladder:** Well distended with no intraluminal masses.\n";
    
    impression = "Normal ultrasound of the abdomen and pelvis.";
  }

  if (modality === "X-ray" && bodyPart === "Spine") {
    findings += "**Alignment:** Normal vertebral alignment.\n";
    findings += "**Bones:** No fractures, lytic or blastic lesions.\n";
    findings += "**Intervertebral Discs:** No significant narrowing.\n";
    
    impression = "No acute osseous abnormality of the spine.";
  }

  // Modify report based on additional keyword findings
  if (inputText.includes("nodule")) {
    findings += "**Nodule:** A pulmonary nodule is present in the right upper lobe.\n";
    impression = "Consider follow-up CT in 6 months for pulmonary nodule surveillance.";
  }
  if (inputText.includes("mass")) {
    findings += "**Mass:** A suspicious soft tissue mass is noted.\n";
    impression = "Further imaging with contrast-enhanced MRI is recommended.";
  }
  if (inputText.includes("fracture")) {
    findings += "**Fracture:** Acute fracture identified at T12 vertebral body.\n";
    impression = "Recommend orthopedic evaluation and further CT imaging.";
  }
  if (inputText.includes("effusion")) {
    findings += "**Pleural Effusion:** Small pleural effusion noted on the left side.\n";
    impression = "Recommend clinical correlation and follow-up imaging if necessary.";
  }
  if (inputText.includes("atelectasis")) {
    findings += "**Atelectasis:** Mild bibasilar atelectasis seen.\n";
    impression = "Possible secondary to shallow breathing or underlying lung pathology.";
  }

  return { findings, impression };
}

module.exports = { generateReport };

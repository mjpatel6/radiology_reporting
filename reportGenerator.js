function generateReport(transcription, modality, bodyPart) {
  if (!transcription || typeof transcription !== "string") {
    return { findings: "Error: Invalid input.", impression: "" };
  }

  const inputText = transcription.toLowerCase();

  // Detailed organ-system-based report structure
  let findings = "";
  let impression = "";

  if (modality === "CT" && bodyPart === "Chest") {
    findings += "LUNGS: No focal consolidation, effusion, or pneumothorax. Mild bibasilar atelectasis noted.\n";
    findings += "MEDIASTINUM: No significant lymphadenopathy. Normal cardiac silhouette.\n";
    findings += "PLEURA: No pleural thickening or calcifications.\n";
    findings += "HEART: No pericardial effusion. Normal cardiac contours.\n";
    findings += "BONES: No acute fractures or destructive lesions.\n";
    findings += "SOFT TISSUES: No abnormal soft tissue swelling or masses.\n";
    findings += "UPPER ABDOMEN: No acute findings.\n";
    
    impression = "No acute cardiopulmonary abnormality. Mild atelectasis may be related to shallow breathing.";
  }

  if (modality === "CT" && bodyPart === "Abdomen/Pelvis") {
    findings += "LIVER: No focal lesions or significant hepatomegaly.\n";
    findings += "SPLEEN: Normal size and appearance.\n";
    findings += "KIDNEYS: No hydronephrosis or nephrolithiasis.\n";
    findings += "BLADDER: Well distended with no intraluminal masses.\n";
    findings += "BONES: No acute fractures or lytic lesions.\n";
    findings += "SOFT TISSUES: No significant abnormalities.\n";
    findings += "LOWER LUNGS: No acute findings.\n";
    
    impression = "No acute abdominal or pelvic abnormality. Lower lung fields clear.";
  }

  if (modality === "MRI" && bodyPart === "Brain") {
    findings += "GRAY AND WHITE MATTER: No acute infarct, hemorrhage, or demyelination.\n";
    findings += "VENTRICULAR SYSTEM: Normal ventricular size and midline structures.\n";
    findings += "CEREBELLUM: No cerebellar lesions or mass effect.\n";
    findings += "SINUSES: Paranasal sinuses and mastoid air cells are clear.\n";
    findings += "BONES: No evidence of skull fractures or destructive lesions.\n";
    findings += "SOFT TISSUES: No abnormal extracranial soft tissue masses.\n";
    
    impression = "Unremarkable MRI of the brain. No acute intracranial abnormality.";
  }

  if (modality === "X-ray" && ["Wrist", "Elbow", "Knee", "Ankle"].includes(bodyPart)) {
    findings += "BONES: No acute fractures, dislocations, or destructive lesions.\n";
    findings += "JOINTS: No significant joint effusion or degenerative changes.\n";
    findings += "SOFT TISSUES: No abnormal soft tissue swelling, masses, or foreign bodies.\n";
    
    impression = "No acute osseous abnormality of the " + bodyPart.toLowerCase() + ".";
  }

  // Modify report based on additional keyword findings
  if (inputText.includes("nodule")) {
    findings += "NODULE: A pulmonary nodule is present in the right upper lobe.\n";
    impression = "Consider follow-up CT in 6 months for pulmonary nodule surveillance.";
  }
  if (inputText.includes("mass")) {
    findings += "MASS: A suspicious soft tissue mass is noted.\n";
    impression = "Further imaging with contrast-enhanced MRI is recommended.";
  }
  if (inputText.includes("fracture")) {
    findings += "FRACTURE: Acute fracture identified.\n";
    impression = "Recommend orthopedic evaluation and further CT imaging.";
  }
  if (inputText.includes("effusion")) {
    findings += "PLEURAL EFFUSION: Small pleural effusion noted on the left side.\n";
    impression = "Recommend clinical correlation and follow-up imaging if necessary.";
  }
  if (inputText.includes("atelectasis")) {
    findings += "ATELECTASIS: Mild bibasilar atelectasis seen.\n";
    impression = "Possible secondary to shallow breathing or underlying lung pathology.";
  }

  return { findings, impression };
}

module.exports = { generateReport };

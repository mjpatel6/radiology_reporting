const fetch = require("node-fetch");

async function generateReport(transcription, modality, bodyPart) {
  if (!transcription || typeof transcription !== "string") {
    return { findings: "Error: Invalid input.", impression: "" };
  }

  const apiKey = process.env.OPENAI_API_KEY;
  const endpoint = "https://api.openai.com/v1/chat/completions";

  const organSystems = {
    CT: {
      Chest: "lungs, heart, mediastinum, great vessels, chest wall",
      Abdomen: "liver, spleen, pancreas, kidneys, bowel, abdominal vessels",
      // Add more body parts as needed
    },
    MRI: {
      Brain: "brain parenchyma, ventricular system, cranial nerves, skull base",
      Spine: "vertebral bodies, spinal cord, intervertebral discs, nerve roots",
      // Add more body parts as needed
    },
    // Add more modalities as needed
  };

  const systemsToInclude =
    organSystems[modality]?.[bodyPart] ||
    "all relevant organ systems for this modality and body part";

  const messages = [
    {
      role: "system",
      content: `You are a radiologist assistant. Generate a structured radiology report for a ${modality} scan of the ${bodyPart}. Include findings for the following organ systems: ${systemsToInclude}. For systems not mentioned, state that they are normal.`,
    },
    {
      role: "user",
      content: `Dictated findings: "${transcription}". Generate a detailed report with the following sections:
1. **Findings**: Describe all abnormal and normal findings.
2. **Impression**: Summarize the key findings and their clinical significance.`,
    },
  ];

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo", // or "gpt-4" if available
        messages: messages,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("OpenAI API Error:", errorText);
      return { findings: "AI processing failed. Please try again.", impression: "" };
    }

    const data = await response.json();
    const reply = data.choices[0].message.content.trim();

    // Split findings and impression
    const findingsSection = reply.includes("**Findings:**")
      ? reply.split("**Findings:**")[1].split("**Impression:**")[0].trim()
      : reply;
    const impressionSection = reply.includes("**Impression:**")
      ? reply.split("**Impression:**")[1].trim()
      : "";

    return {
      findings: findingsSection,
      impression: impressionSection,
    };
  } catch (error) {
    console.error("Error generating report:", error);
    return { findings: "Error generating report. Please check your connection.", impression: "" };
  }
}

module.exports = { generateReport };
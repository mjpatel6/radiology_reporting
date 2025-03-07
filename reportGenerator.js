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
      content: "You are a radiologist assistant. Respond with a comprehensive, structured report that includes all relevant organ systems and findings appropriate to the specified imaging modality and body part."
    },
    {
      role: "user",
      content: `You are a radiologist. Based on the dictated findings: "${transcription}", generate a detailed radiology report for a ${modality} scan of the ${bodyPart}. Include findings for the following organ systems: ${systemsToInclude}. Ensure that the report is structured, accurate, and complete.`
    }
  ];

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: messages,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("OpenAI API Error:", errorText);
      return { findings: "AI processing failed.", impression: "" };
    }

    const data = await response.json();
    const reply = data.choices[0].message.content.trim();

    // Attempt to split findings and impression if they are separated in the response
    const [findingsSection, impressionSection] = reply.split("**Impression:**");

    return {
      findings: findingsSection ? findingsSection.trim() : reply,
      impression: impressionSection ? impressionSection.trim() : "",
    };
  } catch (error) {
    console.error("Error generating report:", error);
    return { findings: "Error generating report.", impression: "" };
  }
}

module.exports = { generateReport };

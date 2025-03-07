const fetch = require("node-fetch");

async function generateReport(transcription, modality, bodyPart) {
  if (!transcription || typeof transcription !== "string") {
    return { findings: "Error: Invalid input.", impression: "" };
  }

  const apiKey = process.env.OPENAI_API_KEY;
  const endpoint = "https://api.openai.com/v1/completions";

  const prompt = `You are a radiologist. Based on the dictated findings: "${transcription}", generate a structured radiology report for a ${modality} scan of the ${bodyPart}. 
  Make sure to place the correct findings under the appropriate organ system and differentiate between normal and abnormal findings.`;

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo", // Replace with "gpt-3.5-turbo" or another model you have access to
        prompt: prompt,
        max_tokens: 300,
      }),
    });

    if (!response.ok) {
      console.error("OpenAI API Error:", await response.text());
      return { findings: "AI processing failed.", impression: "" };
    }

    const data = await response.json();
    return { findings: data.choices[0].text.trim(), impression: "AI-generated impression." };
  } catch (error) {
    console.error("Error generating report:", error);
    return { findings: "Error generating report.", impression: "" };
  }
}

module.exports = { generateReport };

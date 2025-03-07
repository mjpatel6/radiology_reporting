<<<<<<< HEAD
const fetch = require("node-fetch");

async function generateReport(transcription, modality, bodyPart) {
  const apiKey = process.env.OPENAI_API_KEY;
  const endpoint = "https://api.openai.com/v1/completions";

  const prompt = `You are a radiologist. Based on the dictated findings: "${transcription}", generate a structured radiology report for a ${modality} scan of the ${bodyPart}. Ensure findings are correctly categorized and medically appropriate.`;
=======
async function generateReport(transcription, modality, bodyPart) {
  if (!transcription || typeof transcription !== "string") {
    return { findings: "Error: Invalid input.", impression: "" };
  }

  const apiKey = "YOUR_OPENAI_API_KEY"; // Replace with your actual OpenAI key
  const endpoint = "https://api.openai.com/v1/completions";

  const prompt = `You are a radiologist. Based on the dictated findings: "${transcription}", generate a structured radiology report for a ${modality} scan of the ${bodyPart}. 
  Make sure to place the correct findings under the appropriate organ system and differentiate between normal and abnormal findings.`;
>>>>>>> heroku/main

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4",
        prompt: prompt,
        max_tokens: 300,
      }),
    });

<<<<<<< HEAD
    if (!response.ok) {
      console.error("OpenAI API Error:", await response.text());
      return { findings: "AI processing failed.", impression: "" };
    }

    const data = await response.json();
    return { findings: data.choices[0].text.trim(), impression: "AI-generated impression." };
  } catch (error) {
    console.error("Backend AI Request Error:", error);
=======
    const data = await response.json();
    return { findings: data.choices[0].text.trim(), impression: "Impression based on AI analysis." };

  } catch (error) {
    console.error("Error generating report:", error);
>>>>>>> heroku/main
    return { findings: "Error generating report.", impression: "" };
  }
}

module.exports = { generateReport };

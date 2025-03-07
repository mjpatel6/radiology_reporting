const fetch = require("node-fetch");

async function generateReport(transcription, modality, bodyPart) {
  if (!transcription || typeof transcription !== "string") {
    return { findings: "Error: Invalid input.", impression: "" };
  }

  const apiKey = process.env.OPENAI_API_KEY;
  const endpoint = "https://api.openai.com/v1/chat/completions";

  const messages = [
    {
      role: "system",
      content: "You are a radiologist assistant. Respond with a concise, structured report."
    },
    {
      role: "user",
      content: `You are a radiologist. Based on the dictated findings: "${transcription}", generate a structured radiology report for a ${modality} scan of the ${bodyPart}. Make sure to place the correct findings under the appropriate organ system and differentiate between normal and abnormal findings.`
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
        model: "gpt-3.5-turbo", // Use the chat model
        messages: messages,
        max_tokens: 300,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("OpenAI API Error:", errorText);
      return { findings: "AI processing failed.", impression: "" };
    }

    const data = await response.json();
    const reply = data.choices[0].message.content.trim();
    return { findings: reply, impression: "AI-generated impression." };
  } catch (error) {
    console.error("Error generating report:", error);
    return { findings: "Error generating report.", impression: "" };
  }
}

module.exports = { generateReport };

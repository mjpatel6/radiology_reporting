// server.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const { generateReport } = require("./reportGenerator");

const app = express();
const PORT = process.env.PORT || 3000;
const corsOptions = {
  origin: "http://localhost:5173", // Allow frontend requests
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json({ limit: "1mb" }));
app.use(helmet());
app.use(morgan("dev"));

app.post("/api/generate-report", async (req, res) => {
  try {
    const { transcription, modality, bodyPart } = req.body;
    if (!transcription || !modality || !bodyPart) {
      return res.status(400).json({ error: "Missing required fields." });
    }

    const { findings, impression } = await generateReport(transcription, modality, bodyPart);
    res.json({ findings, impression });
  } catch (error) {
    console.error("Error generating report:", error);
    res.status(500).json({ error: "Internal Server Error." });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});


// reportGenerator.js
const fetch = require("node-fetch");

async function generateReport(transcription, modality, bodyPart) {
  const apiKey = process.env.OPENAI_API_KEY;
  const endpoint = "https://api.openai.com/v1/completions";

  const prompt = `You are a radiologist. Based on the dictated findings: "${transcription}", generate a structured radiology report for a ${modality} scan of the ${bodyPart}. Ensure findings are correctly categorized and medically appropriate.`;

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

    if (!response.ok) {
      console.error("OpenAI API Error:", await response.text());
      return { findings: "AI processing failed.", impression: "" };
    }

    const data = await response.json();
    return { findings: data.choices[0].text.trim(), impression: "AI-generated impression." };
  } catch (error) {
    console.error("Backend AI Request Error:", error);
    return { findings: "Error generating report.", impression: "" };
  }
}

module.exports = { generateReport };

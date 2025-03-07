const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const { generateReport } = require("./reportGenerator");

const app = express();

// Middleware
app.use(express.json({ limit: "1mb" }));
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));

const PORT = process.env.PORT || 3000;

// API Endpoint for Generating Reports
app.post("/api/generate-report", (req, res) => {
  try {
    const { transcription, modality, bodyPart } = req.body;

    if (!transcription || typeof transcription !== "string") {
      return res.status(400).json({ error: "Invalid input. Transcription must be a non-empty string." });
    }

    if (!modality || !bodyPart) {
      return res.status(400).json({ error: "Modality and Body Part are required fields." });
    }

    const { findings, impression } = generateReport(transcription, modality, bodyPart);
    res.json({ findings, impression });
  } catch (error) {
    console.error("Error generating report:", error);
    res.status(500).json({ error: "Internal Server Error. Please try again later." });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});

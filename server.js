const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const { generateReport } = require("./reportGenerator");

const app = express();

// ✅ Allow CORS requests from your Vite frontend
const corsOptions = {
  origin: "http://localhost:5173", // Allow requests from your frontend
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json({ limit: "1mb" }));
app.use(helmet());
app.use(morgan("dev"));

const PORT = process.env.PORT || 3000;

app.post("/api/generate-report", async (req, res) => {
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

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});

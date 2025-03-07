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

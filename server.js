require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const { generateReport } = require("./reportGenerator");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(helmet());
app.use(morgan("tiny"));

app.post("/api/generate-report", async (req, res) => {
  try {
    const { transcription, modality, bodyPart } = req.body;
    const result = await generateReport(transcription, modality, bodyPart);
    res.json(result);
  } catch (error) {
    console.error("Error generating report:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});

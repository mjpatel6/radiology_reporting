const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Radiology Reporting API is running!");
});

app.post("/api/generate-report", (req, res) => {
    const { transcription } = req.body;
    if (!transcription) {
        return res.status(400).json({ error: "No transcription provided" });
    }

    const report = `Findings: ${transcription}\nImpression: Pending radiologist review.`;
    res.json({ report });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});


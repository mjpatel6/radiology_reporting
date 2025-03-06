const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// Backend API endpoint
app.post('/api/generate-report', (req, res) => {
    const { transcription } = req.body;
    if (!transcription) {
        return res.status(400).json({ error: 'No transcription provided' });
    }

    const findings = `LIVER: Unremarkable.\n\nGALLBLADDER: Unremarkable.\n\nPANCREAS: Unremarkable.\n\nLOWER CHEST: Lungs and heart unremarkable.`;
    const impression = `1. Acute appendicitis without perforation or abscess.\n\n2. A hepatic cyst measuring 2 cm, likely benign.\n\n3. Mild bibasilar atelectasis, likely atelectasis versus scarring.`;

    res.json({ findings, impression });
});

// Serve static files from the React frontend
app.use(express.static(path.join(__dirname, 'frontend/build')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend/build', 'index.html'));
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

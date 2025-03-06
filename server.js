{\rtf1\ansi\ansicpg1252\cocoartf2821
\cocoatextscaling0\cocoaplatform0{\fonttbl\f0\fswiss\fcharset0 Helvetica;}
{\colortbl;\red255\green255\blue255;}
{\*\expandedcolortbl;;}
\margl1440\margr1440\vieww11520\viewh8400\viewkind0
\pard\tx720\tx1440\tx2160\tx2880\tx3600\tx4320\tx5040\tx5760\tx6480\tx7200\tx7920\tx8640\pardirnatural\partightenfactor0

\f0\fs24 \cf0 const express = require('express');\
const cors = require('cors');\
const app = express();\
const port = process.env.PORT || 5000;\
\
app.use(cors());\
app.use(express.json());\
\
// Sample API endpoint for handling findings\
app.post('/api/generate-report', (req, res) => \{\
    const \{ transcription \} = req.body;\
    if (!transcription) \{\
        return res.status(400).json(\{ error: 'No transcription provided' \});\
    \}\
    \
    // Simple logic to generate findings & impressions\
    const findings = `LIVER: Unremarkable.\\n\\nGALLBLADDER: Unremarkable.\\n\\nPANCREAS: Unremarkable.\\n\\nLOWER CHEST: Lungs and heart unremarkable.`;\
    const impression = `1. Acute appendicitis without perforation or abscess.\\n\\n2. A hepatic cyst measuring 2 cm, likely benign.\\n\\n3. Mild bibasilar atelectasis, likely atelectasis versus scarring.`;\
    \
    res.json(\{ findings, impression \});\
\});\
\
app.listen(port, () => \{\
    console.log(`Server running on port $\{port\}`);\
\});\
}
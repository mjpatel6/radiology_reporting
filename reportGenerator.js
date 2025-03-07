import React, { useState, useEffect } from "react";
import { useSpeechRecognition } from "react-speech-recognition";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Mic, Clipboard, RefreshCcw } from "lucide-react";

const modalities = ["CT", "MRI", "Ultrasound", "X-ray"];
const bodyParts = ["Chest", "Brain", "Abdomen/Pelvis", "Spine", "Neck", "Extremity"];

const App = () => {
  const [transcription, setTranscription] = useState("");
  const [findings, setFindings] = useState("");
  const [impression, setImpression] = useState("");
  const [modality, setModality] = useState("CT");
  const [bodyPart, setBodyPart] = useState("Chest");
  const [listening, setListening] = useState(false);
  const { transcript, resetTranscript, startListening, stopListening } = useSpeechRecognition();

  useEffect(() => {
    if (listening) {
      setTranscription(transcript);
      processSpeech(transcript);
    }
  }, [transcript, listening]);

  const processSpeech = (spokenText) => {
    const words = spokenText.toLowerCase().split(" ");
    if (words.includes("ct")) setModality("CT");
    if (words.includes("mri")) setModality("MRI");
    if (words.includes("ultrasound") || words.includes("us")) setModality("Ultrasound");
    if (words.includes("x-ray") || words.includes("xr")) setModality("X-ray");

    if (words.includes("chest")) setBodyPart("Chest");
    if (words.includes("brain") || words.includes("head")) setBodyPart("Brain");
    if (words.includes("abdomen") || words.includes("pelvis")) setBodyPart("Abdomen/Pelvis");
    if (words.includes("spine")) setBodyPart("Spine");
    if (words.includes("neck")) setBodyPart("Neck");
    if (words.includes("extremity")) setBodyPart("Extremity");

    const punctuationMap = { period: ".", comma: ",", newline: "\n" };
    const processedText = words.map((word) => punctuationMap[word] || word).join(" ");
    setTranscription(processedText);
  };

  const handleGenerateReport = async () => {
    const response = await fetch("https://radiologybot-71ad51a754d0.herokuapp.com/api/generate-report", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ transcription, modality, bodyPart }),
    });
    
    const data = await response.json();
    if (response.ok) {
      setFindings(data.findings);
      setImpression(data.impression);
    } else {
      setFindings("Error generating report. Please try again.");
      setImpression("");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 p-8">
      <Card className="w-full max-w-3xl shadow-2xl p-8 bg-white rounded-xl border">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">🩻 Radiology Report Generator</h1>

        <div className="flex gap-4 mb-4">
          <select className="border p-3 rounded-lg text-gray-700 bg-white" value={modality} onChange={(e) => setModality(e.target.value)}>
            {modalities.map((mod) => <option key={mod} value={mod}>{mod}</option>)}
          </select>
          <select className="border p-3 rounded-lg text-gray-700 bg-white" value={bodyPart} onChange={(e) => setBodyPart(e.target.value)}>
            {bodyParts.map((part) => <option key={part} value={part}>{part}</option>)}
          </select>
        </div>

        <textarea
          className="w-full p-4 border rounded-lg text-gray-900 shadow-md focus:ring-2 focus:ring-blue-300"
          rows="4"
          value={transcription}
          onChange={(e) => setTranscription(e.target.value)}
          placeholder="Start dictating or type findings..."
        />

        <div className="flex gap-3 mt-6 justify-center">
          <Button onClick={handleGenerateReport} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold">Generate Report</Button>
          <Button onClick={() => { setTranscription(""); resetTranscript(); }} className="bg-gray-500 hover:bg-gray-600 text-white"><RefreshCcw /></Button>
          <Button onClick={() => {
            if (listening) {
              stopListening();
              setListening(false);
            } else {
              startListening();
              setListening(true);
            }
          }} className={listening ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"}><Mic /></Button>
        </div>

        {findings && (
          <CardContent className="bg-gray-50 border rounded-lg p-6 mt-6 shadow-lg">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">Generated Report</h2>
            <h3 className="text-lg font-medium text-gray-600">Findings:</h3>
            <textarea className="w-full p-4 border rounded-lg text-gray-900 shadow-sm" rows="4" value={findings} readOnly />
            <h3 className="text-lg font-medium text-gray-600 mt-4">Impression:</h3>
            <textarea className="w-full p-4 border rounded-lg text-gray-900 shadow-sm" rows="3" value={impression} readOnly />
            <Button onClick={() => navigator.clipboard.writeText(`FINDINGS:\n${findings}\n\nIMPRESSION:\n${impression}`)} className="bg-gray-700 hover:bg-gray-800 text-white w-full mt-4"><Clipboard /> Copy Report</Button>
          </CardContent>
        )}
      </Card>
    </div>
  );
};

export default App;

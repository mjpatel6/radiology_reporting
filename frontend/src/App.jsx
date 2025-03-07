import React, { useState, useEffect } from "react";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Mic, Clipboard, RefreshCcw } from "lucide-react";

const modalities = ["CT", "MRI", "Ultrasound", "X-ray"];
const bodyParts = ["Chest", "Brain", "Abdomen/Pelvis", "Spine", "Neck", "Extremity", "Wrist", "Elbow", "Knee", "Ankle"];

const App = () => {
  const [transcription, setTranscription] = useState("");
  const [findings, setFindings] = useState("");
  const [impression, setImpression] = useState("");
  const [modality, setModality] = useState("CT");
  const [bodyPart, setBodyPart] = useState("Chest");
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const { transcript, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition();

  useEffect(() => {
    if (listening) {
      setTranscription(transcript);
    }
  }, [transcript, listening]);

  const toggleListening = () => {
    if (!browserSupportsSpeechRecognition) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }
    if (listening) {
      SpeechRecognition.stopListening();
      setListening(false);
    } else {
      SpeechRecognition.startListening({ continuous: true });
      setListening(true);
    }
  };

  const handleGenerateReport = async () => {
    setLoading(true);
    try {
<<<<<<< HEAD
      const response = await fetch("http://localhost:3000/api/generate-report", {
=======
      const response = await fetch("https://radiologybot-71ad51a754d0.herokuapp.com/api/generate-report", {
>>>>>>> heroku/main
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transcription, modality, bodyPart }),
      });
      
      const data = await response.json();
      if (response.ok) {
        setFindings(data.findings.replace(/\n/g, "\n\n"));
        setImpression(data.impression);
      } else {
        setFindings("Error generating report. Please try again.");
        setImpression("");
      }
    } catch (error) {
      console.error("Error during API call:", error);
      setFindings("Error connecting to server. Please check your connection.");
      setImpression("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 p-10 text-white">
      <Card className="w-full max-w-3xl shadow-lg p-8 bg-gray-800 rounded-xl border border-gray-600">
        <h1 className="text-3xl font-bold text-gray-100 mb-6 text-center">🩻 Radiology Report Generator</h1>

        <div className="flex gap-4 mb-4">
          <select className="border p-3 rounded bg-gray-700 text-white" value={modality} onChange={(e) => setModality(e.target.value)}>
            {modalities.map((mod) => <option key={mod} value={mod}>{mod}</option>)}
          </select>
          <select className="border p-3 rounded bg-gray-700 text-white" value={bodyPart} onChange={(e) => setBodyPart(e.target.value)}>
            {bodyParts.map((part) => <option key={part} value={part}>{part}</option>)}
          </select>
        </div>

        <textarea
          className="w-full p-4 border rounded-lg text-gray-900 bg-gray-100 shadow-md focus:ring-2 focus:ring-blue-400"
          rows="3"
          value={transcription}
          onChange={(e) => setTranscription(e.target.value)}
          placeholder="Start dictating or type findings..."
        />

        <div className="flex gap-3 mt-6 justify-center">
          <Button onClick={handleGenerateReport} disabled={loading} className="bg-blue-500 hover:bg-blue-600 text-white font-semibold">
            {loading ? "Generating..." : "Generate Report"}
          </Button>
          <Button onClick={() => { setTranscription(""); resetTranscript(); }} className="bg-gray-600 hover:bg-gray-700 text-white">
            <RefreshCcw />
          </Button>
          <Button onClick={toggleListening} className={listening ? "bg-red-500" : "bg-green-500"}>
            <Mic /> {listening ? "Stop Dictation" : "Start Dictation"}
          </Button>
        </div>

        {findings && (
          <CardContent className="bg-gray-700 border rounded-lg p-6 mt-6">
            <h2 className="text-xl font-semibold text-white mb-4">Generated Report</h2>
            <div className="mb-4">
              <h3 className="text-lg font-medium text-gray-300">Findings:</h3>
              <textarea className="w-full p-4 border rounded-md bg-gray-600 text-white shadow-sm" rows="6" value={findings} readOnly />
            </div>
            <div className="mb-4">
              <h3 className="text-lg font-medium text-gray-300">Impression:</h3>
              <textarea className="w-full p-4 border rounded-md bg-gray-600 text-white shadow-sm" rows="3" value={impression} readOnly />
            </div>
            <Button onClick={() => navigator.clipboard.writeText(`FINDINGS:\n${findings}\n\nIMPRESSION:\n${impression}`)} className="bg-blue-500 hover:bg-blue-600 text-white w-full">
              <Clipboard /> Copy Report
            </Button>
          </CardContent>
        )}
      </Card>
    </div>
  );
};

export default App;

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
  const [loading, setLoading] = useState(false);
  const { transcript, resetTranscript, browserSupportsSpeechRecognition, listening: speechListening, startListening, stopListening } = useSpeechRecognition();

  useEffect(() => {
    if (!browserSupportsSpeechRecognition) {
      alert("Speech recognition is not supported in this browser.");
    }
  }, [browserSupportsSpeechRecognition]);

  useEffect(() => {
    if (speechListening) {
      setTranscription(transcript);
    }
  }, [transcript, speechListening]);

  const toggleListening = () => {
    if (speechListening) {
      stopListening();
      setListening(false);
    } else {
      startListening();
      setListening(true);
    }
  };

  const handleGenerateReport = async () => {
    setLoading(true);
    console.log("Sending request to API...");
    try {
      const response = await fetch("https://radiologybot-71ad51a754d0.herokuapp.com/api/generate-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transcription, modality, bodyPart }),
      });
      
      const data = await response.json();
      console.log("Response received:", data);
      
      if (response.ok) {
        setFindings(data.findings);
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
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-200 p-10">
      <Card className="w-full max-w-4xl shadow-lg p-8 bg-white rounded-xl border border-gray-300">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">🩻 Radiology Report Generator</h1>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <select className="border p-3 rounded-lg text-gray-700 bg-white w-full" value={modality} onChange={(e) => setModality(e.target.value)}>
            {modalities.map((mod) => <option key={mod} value={mod}>{mod}</option>)}
          </select>
          <select className="border p-3 rounded-lg text-gray-700 bg-white w-full" value={bodyPart} onChange={(e) => setBodyPart(e.target.value)}>
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

        <div className="flex gap-4 mt-6 justify-center">
          <Button onClick={handleGenerateReport} disabled={loading} className={`${loading ? "bg-gray-500" : "bg-blue-600 hover:bg-blue-700"} text-white font-semibold flex items-center gap-2`}>
            {loading ? "Generating..." : "Generate Report"}
          </Button>
          <Button onClick={toggleListening} className={`${listening ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"} text-white font-semibold flex items-center gap-2`}>
            <Mic /> {listening ? "Stop Dictation" : "Start Dictation"}
          </Button>
          <Button onClick={() => { setTranscription(""); resetTranscript(); }} className="bg-gray-500 hover:bg-gray-600 text-white"><RefreshCcw /></Button>
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

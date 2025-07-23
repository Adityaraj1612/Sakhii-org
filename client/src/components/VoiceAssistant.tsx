import React, { useState } from "react";
import axios from "axios";
import { Mic, MicOff } from "lucide-react";

const VoiceAssistant: React.FC = () => {
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const handleListen = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech Recognition is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-IN";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setListening(true);
    recognition.onend = () => setListening(false);
    recognition.onerror = (e: any) => {
      console.error(e);
      setListening(false);
    };

    recognition.onresult = (event: any) => {
      const text = event.results[0][0].transcript;
      setTranscript(text);
      sendToGemini(text);
    };

    recognition.start();
  };

  const sendToGemini = async (text: string) => {
    setLoading(true);
    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      const res = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
        {
          contents: [
            {
              role: "user",
              parts: [
                {
                  text: `You are SAKHII, a women's reproductive health assistant. You ONLY answer queries about menstrual health, reproductive health, diet, exercise, mental health, SAKHII app usage, and emergency guidance. If the user asks anything else, reply: "Sorry, I can only answer questions related to women's reproductive health and SAKHII services."

User Query: ${text}`
                }
              ]
            }
          ]
        }
      );

      const geminiText = res.data.candidates[0].content.parts[0].text;
      setResponse(geminiText);
      speakResponse(geminiText);
    } catch (error) {
      console.error(error);
      setResponse("Sorry, something went wrong while fetching the response.");
    }
    setLoading(false);
  };

  const speakResponse = (text: string) => {
    const synth = window.speechSynthesis;
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = "en-IN";
    synth.speak(utter);
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-white rounded-xl shadow-lg border border-pink-200 mt-10">
      <h2 className="text-xl font-semibold text-pink-600 mb-4 text-center">🎤 SAKHII Voice Assistant</h2>
      <button
        onClick={handleListen}
        disabled={listening}
        className={`w-full py-3 rounded-lg text-white font-semibold flex items-center justify-center gap-2 transition ${
          listening ? "bg-pink-300 cursor-not-allowed" : "bg-pink-500 hover:bg-pink-600"
        }`}
      >
        {listening ? <MicOff /> : <Mic />}
        {listening ? "Listening..." : "Tap to Speak"}
      </button>
      {transcript && (
        <p className="mt-4 text-gray-800">
          <strong>You:</strong> {transcript}
        </p>
      )}
      {loading && <p className="mt-2 text-pink-500">Fetching response...</p>}
      {response && (
        <p className="mt-4 text-gray-900 whitespace-pre-wrap">
          <strong>SAKHII:</strong> {response}
        </p>
      )}
    </div>
  );
};

export default VoiceAssistant;

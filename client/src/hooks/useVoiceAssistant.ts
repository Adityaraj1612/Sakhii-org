import { useState } from "react";
import axios from "axios";

export const useVoiceAssistant = () => {
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

  return {
    handleListen,
    listening,
    transcript,
    response,
    loading,
  };
};

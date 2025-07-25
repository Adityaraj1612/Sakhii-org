import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Mic, MicOff, Send, Volume2, VolumeX } from "lucide-react";
import { useTranslation } from "react-i18next";

interface AskSakhiiModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

const AskSakhiiModal: React.FC<AskSakhiiModalProps> = ({ isOpen, onClose }) => {
  const { t, i18n } = useTranslation();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const synthesisRef = useRef<SpeechSynthesisUtterance | null>(null);
  
  const currentLanguage = i18n.language.startsWith('hi') ? 'hi' : 'en';
  
  // Welcome messages in different languages
  const welcomeMessages: Record<string, string> = {
    en: "Hi! I'm Sakhii, your women's health assistant. I can help you with questions about reproductive health, menstrual health, diet, exercise, and general wellness. How can I assist you today?",
    hi: "नमस्ते! मैं सखी हूँ, आपकी महिला स्वास्थ्य सहायक। मैं प्रजनन स्वास्थ्य, मासिक धर्म, आहार, व्यायाम और सामान्य कल्याण के बारे में आपकी मदद कर सकती हूँ। आज मैं आपकी कैसे सहायता कर सकती हूँ?"
  };

  // Initialize welcome message
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([{
        id: '1',
        content: welcomeMessages[currentLanguage],
        role: 'assistant',
        timestamp: new Date(),
      }]);
    }
  }, [isOpen, currentLanguage]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Initialize speech recognition
  useEffect(() => {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = currentLanguage === 'hi' ? 'hi-IN' : 'en-IN';
      
      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setIsRecording(false);
      };
      
      recognitionRef.current.onerror = () => {
        setIsRecording(false);
      };
      
      recognitionRef.current.onend = () => {
        setIsRecording(false);
      };
    }
  }, [currentLanguage]);

  // Enhanced language detection
  const detectLanguage = (text: string): string => {
    // Simple language detection based on script and common words
    if (/[\u0900-\u097F]/.test(text)) return 'hi'; // Devanagari (Hindi)
    if (/[\u0B80-\u0BFF]/.test(text)) return 'ta'; // Tamil
    if (/[\u0C00-\u0C7F]/.test(text)) return 'te'; // Telugu
    if (/[\u0980-\u09FF]/.test(text)) return 'bn'; // Bengali
    if (/[\u0A80-\u0AFF]/.test(text)) return 'gu'; // Gujarati
    if (/[\u0D00-\u0D7F]/.test(text)) return 'ml'; // Malayalam
    if (/[\u0C80-\u0CFF]/.test(text)) return 'kn'; // Kannada
    if (/[\u0B00-\u0B7F]/.test(text)) return 'or'; // Odia
    if (/[\u0A00-\u0A7F]/.test(text)) return 'pa'; // Punjabi
    
    // Check for common words in regional languages
    const hindiWords = ['क्या', 'कैसे', 'मेरा', 'आपका', 'स्वास्थ्य', 'पीरियड', 'मासिक'];
    const tamilWords = ['என்ன', 'எப்படி', 'என்', 'உங்கள்', 'உடல்நலம்'];
    const teluguWords = ['ఏమిటి', 'ఎలా', 'నా', 'మీ', 'ఆరోగ్యం'];
    
    if (hindiWords.some(word => text.includes(word))) return 'hi';
    if (tamilWords.some(word => text.includes(word))) return 'ta';
    if (teluguWords.some(word => text.includes(word))) return 'te';
    
    return currentLanguage; // Default to current UI language
  };

  const sendMessage = async (messageText: string) => {
    if (!messageText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: messageText,
      role: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    // Detect language from user input
    const detectedLanguage = detectLanguage(messageText);

    try {
      const response = await fetch('/api/ask-sakhii', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: messageText,
          language: detectedLanguage
        }),
      });

      const data = await response.json();
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.response || "Sorry, I couldn't process your request at the moment.",
        role: 'assistant',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
      
      // Speak the response
      speakText(assistantMessage.content);
      
    } catch (error) {
      console.error('Error sending message:', error);
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: currentLanguage === 'hi' 
          ? "क्षमा करें, कुछ गलत हुआ है। कृपया बाद में पुनः प्रयास करें।"
          : "Sorry, something went wrong. Please try again later.",
        role: 'assistant',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleVoiceInput = () => {
    if (!recognitionRef.current) {
      alert(currentLanguage === 'hi' 
        ? "वॉयस रिकॉर्डिंग इस ब्राउज़र में समर्थित नहीं है।"
        : "Voice recording is not supported in this browser.");
      return;
    }

    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      recognitionRef.current.start();
      setIsRecording(true);
    }
  };

  const speakText = (text: string) => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Get available voices and prioritize Hindi voice
    const voices = window.speechSynthesis.getVoices();
    let selectedVoice = null;
    
    if (currentLanguage === 'hi') {
      // Find the best Hindi voice (female preferred)
      selectedVoice = voices.find(voice => 
        voice.lang.includes('hi') && voice.name.toLowerCase().includes('female')
      ) || voices.find(voice => voice.lang.includes('hi-IN')) 
        || voices.find(voice => voice.lang.includes('hi'));
      
      utterance.lang = 'hi-IN';
    } else {
      // Find English Indian voice
      selectedVoice = voices.find(voice => 
        voice.lang.includes('en-IN') && voice.name.toLowerCase().includes('female')
      ) || voices.find(voice => voice.lang.includes('en-IN'))
        || voices.find(voice => voice.lang.includes('en'));
      
      utterance.lang = 'en-IN';
    }
    
    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }
    
    utterance.rate = 1.2; // Faster speech
    utterance.pitch = 1.1; // Slightly higher pitch for female voice
    
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    
    synthesisRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-auto h-[600px] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-rose-600 flex items-center justify-between">
            🌸 Ask Sakhii
            <Button
              variant="ghost"
              size="sm"
              onClick={isSpeaking ? stopSpeaking : undefined}
              className={isSpeaking ? "text-rose-500" : ""}
            >
              {isSpeaking ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </Button>
          </DialogTitle>
        </DialogHeader>
        
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 rounded-lg">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-lg ${
                  message.role === 'user'
                    ? 'bg-rose-500 text-white'
                    : 'bg-white text-gray-800 border'
                }`}
              >
                <p className={`text-sm ${
                  message.role === 'assistant' 
                    ? 'font-serif text-base leading-relaxed' 
                    : ''
                }`}>
                  {message.content}
                </p>
                {message.role === 'assistant' && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => speakText(message.content)}
                    className="mt-2 p-1 h-6 text-xs"
                  >
                    <Volume2 className="h-3 w-3 mr-1" />
                    {currentLanguage === 'hi' ? 'सुनें' : 'Listen'}
                  </Button>
                )}
              </div>
            </div>
          ))}
          
          {loading && (
            <div className="flex justify-start">
              <div className="bg-white text-gray-800 border p-3 rounded-lg">
                <div className="flex items-center space-x-2">
                  <div className="animate-spin h-4 w-4 border-2 border-rose-500 border-t-transparent rounded-full"></div>
                  <span className="text-sm">
                    {currentLanguage === 'hi' ? 'सखी सोच रही है...' : 'Sakhii is thinking...'}
                  </span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
        
        {/* Input Area */}
        <form onSubmit={handleSubmit} className="flex items-center space-x-2 p-2 border-t">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleVoiceInput}
            className={isRecording ? "bg-rose-100 border-rose-300" : ""}
          >
            {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
          </Button>
          
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={currentLanguage === 'hi' 
              ? "अपना स्वास्थ्य प्रश्न टाइप करें..."
              : "Type your health question..."}
            className="flex-1"
            disabled={loading}
          />
          
          <Button 
            type="submit" 
            size="sm"
            disabled={!input.trim() || loading}
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AskSakhiiModal;
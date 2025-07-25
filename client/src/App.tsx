import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Minimize2, Maximize2, Mic, MicOff, Volume2, VolumeX, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card } from '@/components/ui/card';
import { useTranslation } from 'react-i18next';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

// Health responses based on language
const healthResponses: Record<string, Array<{ keywords: string[], response: string }>> = {
  en: [
    {
      keywords: ['period', 'cycle', 'menstrual', 'menstruation'],
      response: "Regular periods typically occur every 21 to 35 days. If you're experiencing irregular periods, it could be due to stress, weight changes, or hormonal fluctuations. Consider tracking your cycle with our tracking tool for better insights."
    },
    {
      keywords: ['pregnant', 'pregnancy', 'conception'],
      response: "Early signs of pregnancy may include a missed period, fatigue, nausea, and breast tenderness. If you suspect you're pregnant, consider taking a home test or consulting your healthcare provider."
    },
    {
      keywords: ['ovulation', 'fertile', 'fertility'],
      response: "Ovulation typically occurs around day 14 of a 28-day cycle. Signs may include a slight rise in body temperature, changes in cervical mucus, and sometimes mild cramping. Our tracking tools can help predict your ovulation days."
    },
    {
      keywords: ['cramp', 'pain', 'pms', 'premenstrual'],
      response: "Menstrual cramps are caused by uterine contractions. To manage the pain, try applying heat, gentle exercise, hydration, and over-the-counter pain relievers. If cramps are severe, consult a healthcare provider."
    },
    {
      keywords: ['pcos', 'polycystic'],
      response: "PCOS (Polycystic Ovary Syndrome) is a hormonal disorder causing enlarged ovaries with small cysts. Symptoms include irregular periods, excess hair growth, and acne. Treatment options are available - please consult your doctor for specific advice."
    },
    {
      keywords: ['endometriosis'],
      response: "Endometriosis occurs when tissue similar to the uterine lining grows outside the uterus. Symptoms include painful periods, pain during intercourse, and excessive bleeding. If you suspect endometriosis, please consult your healthcare provider."
    },
    {
      keywords: ['menopause', 'perimenopause'],
      response: "Menopause is the natural end of menstrual cycles, typically occurring in your 40s or 50s. Symptoms include hot flashes, mood changes, and sleep issues. Various treatments are available to manage symptoms."
    },
    {
      keywords: ['contraception', 'birth control', 'pill'],
      response: "There are many contraception options including hormonal methods (pills, patches, rings), barrier methods (condoms), IUDs, and more. Each has different effectiveness rates and side effects. Consult your healthcare provider for personalized advice."
    },
    {
      keywords: ['breast', 'mammogram', 'lumps'],
      response: "Regular breast self-exams help detect changes. Most breast lumps are benign, but any changes should be evaluated by a doctor. Mammograms are typically recommended starting at age 40-50 depending on risk factors."
    },
    {
      keywords: ['nutrition', 'diet', 'eating'],
      response: "A balanced diet rich in whole foods supports reproductive health. Key nutrients include iron, calcium, folate, and omega-3 fatty acids. Staying hydrated and maintaining a healthy weight also contribute to overall health."
    }
  ],
  hi: [
    {
      keywords: ['पीरियड', 'चक्र', 'मासिक धर्म', 'मासिक'],
      response: "सामान्य मासिक धर्म आमतौर पर हर 21 से 35 दिनों में होता है। यदि आप अनियमित मासिक धर्म का अनुभव कर रही हैं, तो यह तनाव, वजन में परिवर्तन, या हार्मोनल उतार-चढ़ाव के कारण हो सकता है। बेहतर अंतर्दृष्टि के लिए हमारे ट्रैकिंग टूल से अपने चक्र को ट्रैक करने पर विचार करें।"
    },
    {
      keywords: ['गर्भवती', 'गर्भावस्था', 'गर्भधारण'],
      response: "गर्भावस्था के प्रारंभिक लक्षणों में मासिक धर्म का न आना, थकान, मतली, और स्तनों में कोमलता शामिल हो सकते हैं। यदि आपको संदेह है कि आप गर्भवती हैं, तो घर पर परीक्षण करने या अपने स्वास्थ्य सेवा प्रदाता से परामर्श करने पर विचार करें।"
    },
    {
      keywords: ['ओव्युलेशन', 'उर्वर', 'प्रजनन क्षमता'],
      response: "ओव्युलेशन आमतौर पर 28 दिनों के चक्र के दिन 14 के आसपास होता है। लक्षणों में शरीर के तापमान में थोड़ी वृद्धि, सर्विकल म्यूकस में परिवर्तन, और कभी-कभी हल्के ऐंठन शामिल हो सकते हैं। हमारे ट्रैकिंग टूल आपके ओव्युलेशन के दिनों की भविष्यवाणी करने में मदद कर सकते हैं।"
    },
    {
      keywords: ['ऐंठन', 'दर्द', 'पीएमएस', 'प्रीमेंस्ट्रुअल'],
      response: "मासिक धर्म के दौरान ऐंठन गर्भाशय के संकुचन के कारण होती है। दर्द को प्रबंधित करने के लिए, गर्मी लगाने, हल्के व्यायाम, हाइड्रेशन, और काउंटर पर मिलने वाली दर्द निवारक दवाओं का प्रयास करें। यदि ऐंठन गंभीर है, तो स्वास्थ्य सेवा प्रदाता से परामर्श करें।"
    },
    {
      keywords: ['पीसीओएस', 'पॉलीसिस्टिक'],
      response: "पीसीओएस (पॉलीसिस्टिक ओवरी सिंड्रोम) एक हार्मोनल विकार है जिससे अंडाशय में छोटी सिस्ट के साथ वृद्धि होती है। लक्षणों में अनियमित मासिक धर्म, अतिरिक्त बाल विकास, और मुँहासे शामिल हैं। उपचार विकल्प उपलब्ध हैं - कृपया विशिष्ट सलाह के लिए अपने डॉक्टर से परामर्श करें।"
    },
    {
      keywords: ['एंडोमेट्रियोसिस'],
      response: "एंडोमेट्रियोसिस तब होता है जब गर्भाशय की अस्तर के समान ऊतक गर्भाशय के बाहर विकसित होता है। लक्षणों में दर्दनाक मासिक धर्म, संभोग के दौरान दर्द, और अत्यधिक रक्तस्राव शामिल हैं। यदि आपको एंडोमेट्रियोसिस का संदेह है, तो कृपया अपने स्वास्थ्य सेवा प्रदाता से परामर्श करें।"
    },
    {
      keywords: ['मेनोपॉज', 'पेरिमेनोपॉज', 'रजोनिवृत्ति'],
      response: "रजोनिवृत्ति मासिक धर्म चक्रों का प्राकृतिक अंत है, जो आमतौर पर आपके 40 या 50 के दशक में होता है। लक्षणों में गर्म चमक, मूड परिवर्तन, और नींद की समस्याएं शामिल हैं। लक्षणों को प्रबंधित करने के लिए विभिन्न उपचार उपलब्ध हैं।"
    },
    {
      keywords: ['गर्भनिरोधक', 'जन्म नियंत्रण', 'गोली'],
      response: "कई गर्भनिरोधक विकल्प उपलब्ध हैं जिनमें हार्मोनल तरीके (गोलियां, पैच, रिंग्स), बैरियर मेथड्स (कंडोम), आईयूडी, और अधिक शामिल हैं। प्रत्येक की अलग-अलग प्रभावशीलता दर और साइड इफेक्ट्स हैं। वैयक्तिकृत सलाह के लिए अपने स्वास्थ्य सेवा प्रदाता से परामर्श करें।"
    },
    {
      keywords: ['स्तन', 'मैमोग्राम', 'गांठ'],
      response: "नियमित स्तन स्व-परीक्षण परिवर्तनों का पता लगाने में मदद करते हैं। अधिकांश स्तन गांठें सौम्य होती हैं, लेकिन किसी भी परिवर्तन का मूल्यांकन डॉक्टर द्वारा किया जाना चाहिए। मैमोग्राम आमतौर पर जोखिम कारकों के आधार पर 40-50 वर्ष की आयु से शुरू होने की सिफारिश की जाती है।"
    },
    {
      keywords: ['पोषण', 'आहार', 'खाना'],
      response: "संपूर्ण खाद्य पदार्थों से भरपूर संतुलित आहार प्रजनन स्वास्थ्य का समर्थन करता है। प्रमुख पोषक तत्वों में आयरन, कैल्शियम, फोलेट, और ओमेगा-3 फैटी एसिड शामिल हैं। हाइड्रेटेड रहना और स्वस्थ वजन बनाए रखना भी समग्र स्वास्थ्य में योगदान देते हैं।"
    }
  ]
};

// Default response based on language
const defaultResponses: Record<string, string> = {
  en: "I'm here to help with basic women's health questions. Please ask about topics like menstrual cycles, pregnancy symptoms, contraception, or other reproductive health concerns. For medical emergencies or personalized advice, please consult a healthcare professional.",
  hi: "मैं बुनियादी महिला स्वास्थ्य प्रश्नों में मदद करने के लिए यहां हूं। कृपया मासिक धर्म चक्र, गर्भावस्था के लक्षण, गर्भनिरोधक, या अन्य प्रजनन स्वास्थ्य संबंधी चिंताओं के बारे में पूछें। चिकित्सा आपात स्थिति या व्यक्तिगत सलाह के लिए, कृपया स्वास्थ्य देखभाल पेशेवर से परामर्श करें।"
};

// Welcome message based on language
const welcomeMessages: Record<string, string> = {
  en: "Hi! I'm your health assistant. How can I help you today?",
  hi: "नमस्ते! मैं आपका स्वास्थ्य सहायक हूँ। आज मैं आपकी कैसे मदद कर सकता हूँ?"
};

// Placeholder text based on language
const placeholders: Record<string, string> = {
  en: "Type your health question...",
  hi: "अपना स्वास्थ्य प्रश्न टाइप करें..."
};

const ChatBot: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const synthesisRef = useRef<SpeechSynthesisUtterance | null>(null);
  const currentLanguage = i18n.language.startsWith('hi') ? 'hi' : 'en';
  
  // Initialize welcome message based on language
  useEffect(() => {
    setMessages([{
      id: '1',
      content: welcomeMessages[currentLanguage],
      role: 'assistant',
      timestamp: new Date(),
    }]);
  }, [currentLanguage]);
  
  // Initialize speech recognition
  useEffect(() => {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = currentLanguage === 'hi' ? 'hi-IN' : 'en-US';

      recognitionRef.current.onresult = (event: { results: { transcript: any; }[][]; }) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        
        // Auto-submit when voice input is received
        if (transcript.trim()) {
          // Add a slight delay to allow the user to see what was transcribed
          setTimeout(() => {
            handleSendMessageWithText(transcript);
          }, 500);
        }
      };

      recognitionRef.current.onend = () => {
        setIsRecording(false);
      };
      
      recognitionRef.current.onerror = (error: any) => {
        console.error('Speech recognition error:', error);
        setIsRecording(false);
      };
    }
    
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (error) {
          console.error('Error stopping speech recognition:', error);
        }
      }
    };
  }, [currentLanguage]);

  // Initialize speech synthesis
  useEffect(() => {
    if ('speechSynthesis' in window) {
      synthesisRef.current = new SpeechSynthesisUtterance();
      synthesisRef.current.lang = currentLanguage === 'hi' ? 'hi-IN' : 'en-US';
      synthesisRef.current.onend = () => {
        // Add this to stop speaking when the utterance is done
        if (synthesisRef.current) {
          synthesisRef.current.onend = null;
        }
      };
      
      // Get available voices
      const populateVoices = () => {
        if (synthesisRef.current) {
          const voices = window.speechSynthesis.getVoices();
          const voiceForLanguage = voices.find(voice => 
            voice.lang.startsWith(currentLanguage === 'hi' ? 'hi' : 'en')
          );
          
          if (voiceForLanguage) {
            synthesisRef.current.voice = voiceForLanguage;
          }
        }
      };
      
      populateVoices();
      
      // Chrome loads voices asynchronously
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = populateVoices;
      }
    }
    
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, [currentLanguage]);
  
  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Update recognition and synthesis language when i18n language changes
  useEffect(() => {
    if (recognitionRef.current) {
      recognitionRef.current.lang = currentLanguage === 'hi' ? 'hi-IN' : 'en-US';
    }
    if (synthesisRef.current) {
      synthesisRef.current.lang = currentLanguage === 'hi' ? 'hi-IN' : 'en-US';
    }
  }, [currentLanguage]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  };

  const generateResponse = (question: string): string => {
    const lowerQuestion = question.toLowerCase();
    const responses = healthResponses[currentLanguage];
    
    // Check for common health questions based on keywords
    for (const item of responses) {
      if (item.keywords.some(keyword => lowerQuestion.includes(keyword))) {
        return item.response;
      }
    }
    
    // Default response if no keywords match
    return defaultResponses[currentLanguage];
  };

  const handleSendMessage = () => {
    handleSendMessageWithText(input);
  };
  
  const handleSendMessageWithText = (messageText: string) => {
    if (!messageText.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: messageText,
      role: 'user',
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);
    
    // Simulate AI response delay
    setTimeout(() => {
      const response = generateResponse(messageText);
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response,
        role: 'assistant',
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      setLoading(false);
      
      // Speak the response if text-to-speech is enabled
      if (isSpeaking && 'speechSynthesis' in window && synthesisRef.current) {
        // Cancel any ongoing speech
        window.speechSynthesis.cancel();
        
        // Set the text and speak
        synthesisRef.current.text = response;
        window.speechSynthesis.speak(synthesisRef.current);
      }
    }, 1000);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
    setIsMinimized(false);
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };
  
  const toggleVoiceRecording = () => {
    if (!('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
      alert(currentLanguage === 'hi' 
        ? 'आपका ब्राउज़र स्पीच रिकग्निशन का समर्थन नहीं करता है।' 
        : 'Your browser does not support speech recognition.');
      return;
    }
    
    if (isRecording) {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (error) {
          console.error('Error stopping speech recognition:', error);
        }
      }
      setIsRecording(false);
    } else {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.start();
          setIsRecording(true);
        } catch (error) {
          console.error('Error starting speech recognition:', error);
          setIsRecording(false);
        }
      }
    }
  };
  
  const toggleSpeaking = () => {
    setIsSpeaking(!isSpeaking);
    
    // If turning off, stop any ongoing speech
    if (isSpeaking && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  };
  
  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
  };

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {!isOpen ? (
        <Button 
          onClick={toggleChat} 
          className="h-14 w-14 rounded-full shadow-lg bg-primary hover:bg-primary/90"
        >
          <MessageSquare className="h-6 w-6" />
        </Button>
      ) : (
        <Card className={`
          transition-all duration-300 shadow-xl 
          ${isMinimized ? 'h-16 w-80' : 'h-[500px] w-80 flex flex-col'}
        `}>
          <div className="flex items-center justify-between p-3 border-b bg-primary text-primary-foreground">
            <div className="flex items-center">
              <Avatar className="mr-2 h-8 w-8">
                <AvatarImage src="/robot-avatar.png" alt="AI Assistant" />
                <AvatarFallback>AI</AvatarFallback>
              </Avatar>
              <span className="font-medium">
                {currentLanguage === 'hi' ? 'स्वास्थ्य सहायक' : 'Health Assistant'}
              </span>
            </div>
            <div className="flex space-x-1">
              {/* Language selection */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-primary-foreground hover:bg-primary/90">
                    <Globe className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => changeLanguage('en')}>
                    English
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => changeLanguage('hi')}>
                    हिन्दी (Hindi)
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
              {/* Text-to-speech toggle */}
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={toggleSpeaking}
                className="h-8 w-8 text-primary-foreground hover:bg-primary/90"
                title={isSpeaking ? 
                  (currentLanguage === 'hi' ? 'वॉइस सुनना बंद करें' : 'Turn off voice') : 
                  (currentLanguage === 'hi' ? 'वॉइस सुनें' : 'Turn on voice')
                }
              >
                {isSpeaking ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
              </Button>
              
              <Button variant="ghost" size="icon" onClick={toggleMinimize} className="h-8 w-8 text-primary-foreground hover:bg-primary/90">
                {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
              </Button>
              <Button variant="ghost" size="icon" onClick={toggleChat} className="h-8 w-8 text-primary-foreground hover:bg-primary/90">
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {!isMinimized && (
            <>
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div 
                      key={message.id} 
                      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div 
                        className={`max-w-[80%] rounded-lg p-3 ${
                          message.role === 'user' 
                            ? 'bg-primary text-primary-foreground' 
                            : 'bg-muted'
                        }`}
                      >
                        {message.content}
                      </div>
                    </div>
                  ))}
                  {loading && (
                    <div className="flex justify-start">
                      <div className="max-w-[80%] rounded-lg p-3 bg-muted">
                        <div className="flex space-x-1">
                          <div className="h-2 w-2 bg-primary rounded-full animate-bounce"></div>
                          <div className="h-2 w-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          <div className="h-2 w-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>
              
              <div className="p-3 border-t flex items-end">
                {/* Voice input button */}
                <Button
                  variant={isRecording ? "destructive" : "outline"}
                  size="icon"
                  onClick={toggleVoiceRecording}
                  className="mr-2 h-10 w-10 flex-shrink-0"
                  title={isRecording ? 
                    (currentLanguage === 'hi' ? 'रिकॉर्डिंग रोकें' : 'Stop recording') : 
                    (currentLanguage === 'hi' ? 'वॉइस इनपुट शुरू करें' : 'Start voice input')
                  }
                >
                  {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                </Button>
                
                <Textarea
                  value={input}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  placeholder={placeholders[currentLanguage]}
                  className="resize-none min-h-[60px]"
                />
                <Button 
                  onClick={handleSendMessage} 
                  className="ml-2 h-10"
                  disabled={!input.trim() || loading}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </>
          )}
        </Card>
      )}
    </div>
  );
};

// TypeScript interfaces for Web Speech API
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export default ChatBot;
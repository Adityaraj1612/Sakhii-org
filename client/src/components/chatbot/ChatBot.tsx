import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Minimize2, Maximize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card } from '@/components/ui/card';
import { useTranslation } from 'react-i18next';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

const healthResponses = [
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
];

const defaultResponse = "I'm here to help with basic women's health questions. Please ask about topics like menstrual cycles, pregnancy symptoms, contraception, or other reproductive health concerns. For medical emergencies or personalized advice, please consult a healthcare professional.";

const ChatBot: React.FC = () => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hi! I'm your health assistant. How can I help you today?",
      role: 'assistant',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  };

  const generateResponse = (question: string): string => {
    const lowerQuestion = question.toLowerCase();
    
    // Check for common health questions based on keywords
    for (const item of healthResponses) {
      if (item.keywords.some(keyword => lowerQuestion.includes(keyword))) {
        return item.response;
      }
    }
    
    // Default response if no keywords match
    return defaultResponse;
  };

  const handleSendMessage = () => {
    if (!input.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      role: 'user',
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);
    
    // Simulate AI response delay
    setTimeout(() => {
      const response = generateResponse(userMessage.content);
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response,
        role: 'assistant',
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      setLoading(false);
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
              <span className="font-medium">Health Assistant</span>
            </div>
            <div className="flex space-x-1">
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
                <Textarea
                  value={input}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  placeholder="Type your health question..."
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

export default ChatBot;
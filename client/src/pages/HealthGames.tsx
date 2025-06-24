import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { useTranslation } from "react-i18next";
import { ChevronLeft } from "lucide-react";

// Quiz questions data
const quizQuestions = [
  {
    id: 1,
    category: "Reproductive Health Quiz",
    question: "What is the average length of a menstrual cycle?",
    options: ["21 days", "28 days", "35 days", "42 days"],
    correctAnswer: 1
  },
  {
    id: 2,
    category: "True or False Challenge",
    question: "Pregnancy is possible during menstruation.",
    options: ["True", "False"],
    correctAnswer: 1
  }
];

// Educational resources data
const educationalResources = [
  {
    title: "Understanding Your Menstrual Cycle",
    description: "Learn about the four phases of your cycle and what happens during each one.",
    category: "Reproductive Health",
    readTime: "5 min read"
  },
  {
    title: "Reproductive Health Basics",
    description: "Essential topics to understand about reproductive health and wellness.",
    category: "Health Education", 
    readTime: "7 min read"
  },
  {
    title: "Common Questions Answered",
    description: "Get answers to frequently asked questions about reproductive health and wellness.",
    category: "FAQ",
    readTime: "3 min read"
  }
];

// Game cards data  
const gameCards = [
  {
    title: "Monthly Cycle Quiz",
    description: "Test your knowledge about menstrual health with interactive questions.",
    category: "Quiz"
  },
  {
    title: "True or False Challenge", 
    description: "Challenge yourself with true/false questions about reproductive health.",
    category: "Challenge"
  },
  {
    title: "Matching Pairs",
    description: "Match symptoms with cycle phases to learn about your body.",
    category: "Matching"
  },
  {
    title: "Hormone Heroes",
    description: "Learn about different hormones and their roles in your reproductive health.",
    category: "Educational"
  },
  {
    title: "Nutrition Navigator",
    description: "Discover the best foods for each phase of your menstrual cycle.",
    category: "Nutrition"
  },
  {
    title: "Symptom Spotter",
    description: "Identify and track common menstrual symptoms with this interactive game.",
    category: "Health"
  },
  {
    title: "Cycle Calendar Challenge",
    description: "Test your ability to predict cycle phases and fertile windows.",
    category: "Prediction"
  },
  {
    title: "Myth Busters",
    description: "Separate facts from fiction about women's reproductive health.",
    category: "Education"
  },
  {
    title: "Wellness Wheel",
    description: "Spin the wheel to discover daily wellness tips for reproductive health.",
    category: "Wellness"
  }
];

const HealthGames = () => {
  const [currentView, setCurrentView] = useState<'home' | 'quiz'>('home');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const { t } = useTranslation();

  const currentQuestion = quizQuestions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / quizQuestions.length) * 100;

  const handleAnswerSubmit = () => {
    if (selectedAnswer === null) return;
    
    if (selectedAnswer === currentQuestion.correctAnswer) {
      setScore(score + 1);
    }
    
    setShowResult(true);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      // Quiz completed
      alert(`Quiz completed! Your score: ${score}/${quizQuestions.length}`);
      setCurrentView('home');
      setCurrentQuestionIndex(0);
      setSelectedAnswer(null);
      setShowResult(false);
      setScore(0);
    }
  };

  const startQuiz = () => {
    setCurrentView('quiz');
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
  };

  if (currentView === 'quiz') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          {/* Header */}
          <div className="flex items-center mb-8">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setCurrentView('home')}
              className="mr-4"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{currentQuestion.category}</h1>
              <p className="text-gray-600">Question {currentQuestionIndex + 1} of {quizQuestions.length}</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <Progress value={progress} className="h-2" />
          </div>

          {/* Question Card */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-xl">{currentQuestion.question}</CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup 
                value={selectedAnswer?.toString()} 
                onValueChange={(value) => setSelectedAnswer(parseInt(value))}
                className="space-y-4"
              >
                {currentQuestion.options.map((option, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <RadioGroupItem 
                      value={index.toString()} 
                      id={`option-${index}`}
                      disabled={showResult}
                    />
                    <Label 
                      htmlFor={`option-${index}`} 
                      className="flex-1 cursor-pointer py-2"
                    >
                      {String.fromCharCode(65 + index)}. {option}
                    </Label>
                  </div>
                ))}
              </RadioGroup>

              <div className="mt-6 flex justify-end">
                {!showResult ? (
                  <Button 
                    onClick={handleAnswerSubmit}
                    disabled={selectedAnswer === null}
                    className="bg-pink-500 hover:bg-pink-600"
                  >
                    Continue
                  </Button>
                ) : (
                  <div className="flex items-center space-x-4">
                    {selectedAnswer === currentQuestion.correctAnswer ? (
                      <span className="text-green-600 font-medium">Correct!</span>
                    ) : (
                      <span className="text-red-600 font-medium">
                        Incorrect. The correct answer is {String.fromCharCode(65 + currentQuestion.correctAnswer)}.
                      </span>
                    )}
                    <Button 
                      onClick={handleNextQuestion}
                      className="bg-pink-500 hover:bg-pink-600"
                    >
                      {currentQuestionIndex < quizQuestions.length - 1 ? 'Next Question' : 'Finish Quiz'}
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-pink-100 to-purple-100 py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Learn About Reproductive Health Through Fun Games
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Engage with our interactive games designed to help you learn about reproductive health, menstrual cycles, symptoms, and hormones.
          </p>
          <Button 
            size="lg" 
            onClick={startQuiz}
            className="bg-pink-500 hover:bg-pink-600 text-white px-8 py-3"
          >
            Start Quiz
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        {/* Educational Games Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-4">Educational Games for Reproductive Health</h2>
          <p className="text-gray-600 text-center mb-12 max-w-3xl mx-auto">
            Choose from our variety of interactive games designed to make learning about reproductive health engaging and informative.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {gameCards.map((game, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader className="text-center pb-4">
                  <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <div className="w-8 h-8 bg-pink-500 rounded"></div>
                  </div>
                  <CardTitle className="text-lg">{game.title}</CardTitle>
                  <div className="mt-2">
                    <span className="text-xs bg-pink-100 text-pink-600 px-2 py-1 rounded-full">
                      {game.category}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-gray-600 mb-4">{game.description}</p>
                  <Button 
                    variant="outline" 
                    onClick={startQuiz}
                    className="border-pink-500 text-pink-500 hover:bg-pink-50"
                  >
                    Start Game
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Educational Resources Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Educational Resources</h2>
          <p className="text-gray-600 text-center mb-8">
            Explore our comprehensive collection of articles, videos, and guides to reproductive health.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {educationalResources.map((resource, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">{resource.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">{resource.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-pink-600">{resource.category}</span>
                    <span className="text-sm text-gray-500">{resource.readTime}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Testimonials Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">What Our Users Say</h2>
          <p className="text-gray-600 text-center mb-8">
            Read testimonials from women who have used our platform to improve their reproductive health.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((_, index) => (
              <Card key={index} className="bg-gray-50">
                <CardContent className="pt-6">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mr-4">
                      <span className="text-pink-600 font-semibold">★★★★★</span>
                    </div>
                    <div>
                      <p className="font-semibold">User {index + 1}</p>
                      <p className="text-sm text-gray-600">Verified User</p>
                    </div>
                  </div>
                  <p className="text-gray-700 italic">
                    "These games made learning about reproductive health so much easier and more engaging. I feel more confident about my health decisions now."
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Learn While Having Fun?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of women who are taking control of their reproductive health through education.
          </p>
          <Button 
            size="lg" 
            onClick={startQuiz}
            className="bg-white text-pink-600 hover:bg-gray-100 px-8 py-3"
          >
            Get Started Today
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HealthGames;
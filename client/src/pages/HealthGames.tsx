import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { useTranslation } from "react-i18next";
import { ChevronLeft, Shuffle, Target, Puzzle, Award, Clock, Star, Brain, Heart, RefreshCw } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useLocation } from "wouter";

// Extended quiz questions for reproductive health
const quizQuestions = [
  {
    id: 1,
    category: "Menstrual Cycle",
    question: "What is the average length of a menstrual cycle?",
    options: ["21 days", "28 days", "35 days", "42 days"],
    correctAnswer: 1,
    explanation: "The average menstrual cycle is 28 days, though normal cycles can range from 21 to 35 days."
  },
  {
    id: 2,
    category: "Fertility",
    question: "When is a woman most fertile during her cycle?",
    options: ["During menstruation", "Around ovulation (day 14)", "Right after menstruation", "At the end of cycle"],
    correctAnswer: 1,
    explanation: "Ovulation typically occurs around day 14 of a 28-day cycle, making this the most fertile time."
  },
  {
    id: 3,
    category: "Hormones",
    question: "Which hormone triggers ovulation?",
    options: ["Estrogen", "Progesterone", "LH (Luteinizing Hormone)", "FSH"],
    correctAnswer: 2,
    explanation: "LH surge triggers the release of the egg from the ovary during ovulation."
  },
  {
    id: 4,
    category: "Health",
    question: "Which symptom is NOT typically associated with PMS?",
    options: ["Mood swings", "Bloating", "Fever", "Breast tenderness"],
    correctAnswer: 2,
    explanation: "Fever is not a typical PMS symptom. If you have fever with other symptoms, consult a healthcare provider."
  },
  {
    id: 5,
    category: "Nutrition",
    question: "Which nutrient is especially important during menstruation?",
    options: ["Vitamin C", "Iron", "Vitamin D", "Calcium"],
    correctAnswer: 1,
    explanation: "Iron is crucial during menstruation to replace iron lost through menstrual blood."
  }
];

// Matching game data
const matchingPairs = [
  { id: 1, term: "Ovulation", definition: "Release of egg from ovary" },
  { id: 2, term: "Menstruation", definition: "Monthly shedding of uterine lining" },
  { id: 3, term: "Estrogen", definition: "Hormone that builds uterine lining" },
  { id: 4, term: "Progesterone", definition: "Hormone that maintains pregnancy" },
  { id: 5, term: "Follicular Phase", definition: "First half of menstrual cycle" },
  { id: 6, term: "Luteal Phase", definition: "Second half of menstrual cycle" }
];

// Crossword clues
const crosswordClues = [
  { number: 1, clue: "Monthly bleeding (13 letters)", answer: "MENSTRUATION", direction: "across" },
  { number: 2, clue: "Egg release (9 letters)", answer: "OVULATION", direction: "down" },
  { number: 3, clue: "Female hormone (8 letters)", answer: "ESTROGEN", direction: "across" },
  { number: 4, clue: "Time before period (3 letters)", answer: "PMS", direction: "down" }
];

const HealthGames = () => {
  const [currentView, setCurrentView] = useState<'home' | 'quiz' | 'matching' | 'crossword' | 'memory'>('home');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [matchingGame, setMatchingGame] = useState<{ selectedTerm: number | null; selectedDef: number | null; matched: number[]; }>({
    selectedTerm: null,
    selectedDef: null,
    matched: []
  });
  const { t } = useTranslation();
  const { user } = useAuth();
  const [_, setLocation] = useLocation();

  // Redirect to sign in if not authenticated
  useEffect(() => {
    if (!user) {
      setLocation('/sign-in');
    }
  }, [user, setLocation]);

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
      setGameCompleted(true);
    }
  };

  const startQuiz = () => {
    setCurrentView('quiz');
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setGameCompleted(false);
  };

  const startMatchingGame = () => {
    setCurrentView('matching');
    setMatchingGame({ selectedTerm: null, selectedDef: null, matched: [] });
  };

  const startCrossword = () => {
    setCurrentView('crossword');
  };

  const startMemoryGame = () => {
    setCurrentView('memory');
  };

  const resetGame = () => {
    setCurrentView('home');
    setScore(0);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setGameCompleted(false);
    setMatchingGame({ selectedTerm: null, selectedDef: null, matched: [] });
  };

  const handleMatchingClick = (type: 'term' | 'definition', id: number) => {
    if (matchingGame.matched.includes(id)) return;

    if (type === 'term') {
      if (matchingGame.selectedTerm === id) {
        setMatchingGame(prev => ({ ...prev, selectedTerm: null }));
      } else {
        setMatchingGame(prev => ({ ...prev, selectedTerm: id }));
        
        if (matchingGame.selectedDef !== null) {
          // Check if they match
          const term = matchingPairs.find(p => p.id === id);
          const def = matchingPairs.find(p => p.id === matchingGame.selectedDef);
          
          if (term && def && term.id === def.id) {
            setMatchingGame(prev => ({
              matched: [...prev.matched, id],
              selectedTerm: null,
              selectedDef: null
            }));
          } else {
            setTimeout(() => {
              setMatchingGame(prev => ({ ...prev, selectedTerm: null, selectedDef: null }));
            }, 1000);
          }
        }
      }
    } else {
      if (matchingGame.selectedDef === id) {
        setMatchingGame(prev => ({ ...prev, selectedDef: null }));
      } else {
        setMatchingGame(prev => ({ ...prev, selectedDef: id }));
        
        if (matchingGame.selectedTerm !== null) {
          // Check if they match
          const term = matchingPairs.find(p => p.id === matchingGame.selectedTerm);
          const def = matchingPairs.find(p => p.id === id);
          
          if (term && def && term.id === def.id) {
            setMatchingGame(prev => ({
              matched: [...prev.matched, id],
              selectedTerm: null,
              selectedDef: null
            }));
          } else {
            setTimeout(() => {
              setMatchingGame(prev => ({ ...prev, selectedTerm: null, selectedDef: null }));
            }, 1000);
          }
        }
      }
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <Brain className="h-16 w-16 text-pink-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Please Sign In</h2>
            <p className="text-gray-600 mb-4">You need to sign in to access the health games.</p>
            <Button onClick={() => setLocation('/sign-in')} className="bg-pink-500 hover:bg-pink-600">
              Go to Sign In
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Quiz View
  if (currentView === 'quiz') {
    if (gameCompleted) {
      return (
        <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white">
          <div className="container mx-auto px-4 py-8 max-w-4xl">
            <Card className="text-center">
              <CardHeader>
                <Award className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
                <CardTitle className="text-3xl">Quiz Completed!</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xl mb-4">Your Score: {score}/{quizQuestions.length}</p>
                <p className="text-gray-600 mb-6">
                  {score === quizQuestions.length ? "Perfect! You're a reproductive health expert!" :
                   score >= quizQuestions.length * 0.8 ? "Great job! You have excellent knowledge!" :
                   score >= quizQuestions.length * 0.6 ? "Good work! Keep learning!" :
                   "Keep studying and try again!"}
                </p>
                <div className="space-x-4">
                  <Button onClick={startQuiz} className="bg-pink-500 hover:bg-pink-600">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Try Again
                  </Button>
                  <Button onClick={resetGame} variant="outline">
                    Back to Games
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
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
              <h1 className="text-2xl font-bold text-gray-900">{currentQuestion.category} Quiz</h1>
              <p className="text-gray-600">Question {currentQuestionIndex + 1} of {quizQuestions.length}</p>
            </div>
          </div>

          <div className="mb-8">
            <Progress value={progress} className="h-2" />
          </div>

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

              <div className="mt-6">
                {!showResult ? (
                  <Button 
                    onClick={handleAnswerSubmit}
                    disabled={selectedAnswer === null}
                    className="bg-pink-500 hover:bg-pink-600"
                  >
                    Submit Answer
                  </Button>
                ) : (
                  <div className="space-y-4">
                    <div className="p-4 rounded-lg bg-gray-50">
                      {selectedAnswer === currentQuestion.correctAnswer ? (
                        <div className="text-green-600 font-medium mb-2">
                          <Star className="h-5 w-5 inline mr-2" />
                          Correct!
                        </div>
                      ) : (
                        <div className="text-red-600 font-medium mb-2">
                          Incorrect. The correct answer is {String.fromCharCode(65 + currentQuestion.correctAnswer)}.
                        </div>
                      )}
                      <p className="text-gray-700">{currentQuestion.explanation}</p>
                    </div>
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

  // Matching Game View
  if (currentView === 'matching') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
        <div className="container mx-auto px-4 py-8 max-w-6xl">
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
              <h1 className="text-2xl font-bold text-gray-900">Matching Game</h1>
              <p className="text-gray-600">Match terms with their definitions</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Terms</h3>
              <div className="space-y-3">
                {matchingPairs.map((pair) => (
                  <Button
                    key={`term-${pair.id}`}
                    onClick={() => handleMatchingClick('term', pair.id)}
                    className={`w-full p-4 text-left justify-start ${
                      matchingGame.matched.includes(pair.id) 
                        ? 'bg-green-100 text-green-800 border-green-300' 
                        : matchingGame.selectedTerm === pair.id
                        ? 'bg-purple-100 text-purple-800 border-purple-300'
                        : 'bg-white border-gray-300 hover:bg-gray-50'
                    }`}
                    variant="outline"
                    disabled={matchingGame.matched.includes(pair.id)}
                  >
                    {pair.term}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Definitions</h3>
              <div className="space-y-3">
                {matchingPairs.map((pair) => (
                  <Button
                    key={`def-${pair.id}`}
                    onClick={() => handleMatchingClick('definition', pair.id)}
                    className={`w-full p-4 text-left justify-start ${
                      matchingGame.matched.includes(pair.id) 
                        ? 'bg-green-100 text-green-800 border-green-300' 
                        : matchingGame.selectedDef === pair.id
                        ? 'bg-purple-100 text-purple-800 border-purple-300'
                        : 'bg-white border-gray-300 hover:bg-gray-50'
                    }`}
                    variant="outline"
                    disabled={matchingGame.matched.includes(pair.id)}
                  >
                    {pair.definition}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {matchingGame.matched.length === matchingPairs.length && (
            <Card className="mt-8 text-center">
              <CardContent className="pt-6">
                <Award className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold mb-2">Congratulations!</h2>
                <p className="text-gray-600 mb-4">You've matched all pairs correctly!</p>
                <Button onClick={startMatchingGame} className="bg-purple-500 hover:bg-purple-600">
                  Play Again
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    );
  }

  // Home View with Game Selection
  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-pink-100 to-purple-100 py-16">
        <div className="container mx-auto px-4 text-center">
          <Brain className="h-16 w-16 text-pink-500 mx-auto mb-4" />
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Health Games for Women
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Learn about reproductive health, menstrual cycles, and wellness through fun, interactive games designed specifically for women.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button 
              size="lg" 
              onClick={startQuiz}
              className="bg-pink-500 hover:bg-pink-600 text-white px-8 py-3"
            >
              <Target className="h-5 w-5 mr-2" />
              Start Quiz
            </Button>
            <Button 
              size="lg" 
              onClick={startMatchingGame}
              className="bg-purple-500 hover:bg-purple-600 text-white px-8 py-3"
            >
              <Shuffle className="h-5 w-5 mr-2" />
              Matching Game
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        {/* Game Cards Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-4">Choose Your Game</h2>
          <p className="text-gray-600 text-center mb-12 max-w-3xl mx-auto">
            Select from our variety of educational games designed to make learning about women's health engaging and fun.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer group" onClick={startQuiz}>
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-pink-200 transition-colors">
                  <Target className="h-8 w-8 text-pink-600" />
                </div>
                <CardTitle className="text-lg">Knowledge Quiz</CardTitle>
                <div className="mt-2">
                  <span className="text-xs bg-pink-100 text-pink-600 px-2 py-1 rounded-full">
                    Quiz
                  </span>
                </div>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600 mb-4">Test your knowledge about reproductive health, menstrual cycles, and hormones with our comprehensive quiz.</p>
                <div className="flex items-center justify-center text-sm text-gray-500 mb-4">
                  <Clock className="h-4 w-4 mr-1" />
                  5-10 minutes
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer group" onClick={startMatchingGame}>
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-200 transition-colors">
                  <Shuffle className="h-8 w-8 text-purple-600" />
                </div>
                <CardTitle className="text-lg">Matching Pairs</CardTitle>
                <div className="mt-2">
                  <span className="text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded-full">
                    Matching
                  </span>
                </div>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600 mb-4">Match health terms with their definitions to strengthen your understanding of women's health concepts.</p>
                <div className="flex items-center justify-center text-sm text-gray-500 mb-4">
                  <Clock className="h-4 w-4 mr-1" />
                  3-5 minutes
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer group opacity-75">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 transition-colors">
                  <Puzzle className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle className="text-lg">Health Crossword</CardTitle>
                <div className="mt-2">
                  <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                    Coming Soon
                  </span>
                </div>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600 mb-4">Solve crossword puzzles featuring reproductive health terminology and concepts.</p>
                <div className="flex items-center justify-center text-sm text-gray-500 mb-4">
                  <Clock className="h-4 w-4 mr-1" />
                  10-15 minutes
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer group opacity-75">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-green-200 transition-colors">
                  <Brain className="h-8 w-8 text-green-600" />
                </div>
                <CardTitle className="text-lg">Memory Game</CardTitle>
                <div className="mt-2">
                  <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full">
                    Coming Soon
                  </span>
                </div>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600 mb-4">Improve your memory while learning about healthy habits and wellness tips.</p>
                <div className="flex items-center justify-center text-sm text-gray-500 mb-4">
                  <Clock className="h-4 w-4 mr-1" />
                  5-8 minutes
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer group opacity-75">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-yellow-200 transition-colors">
                  <Heart className="h-8 w-8 text-yellow-600" />
                </div>
                <CardTitle className="text-lg">Wellness Challenge</CardTitle>
                <div className="mt-2">
                  <span className="text-xs bg-yellow-100 text-yellow-600 px-2 py-1 rounded-full">
                    Coming Soon
                  </span>
                </div>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600 mb-4">Complete daily wellness challenges to improve your reproductive health knowledge.</p>
                <div className="flex items-center justify-center text-sm text-gray-500 mb-4">
                  <Clock className="h-4 w-4 mr-1" />
                  Daily
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer group opacity-75">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-red-200 transition-colors">
                  <Award className="h-8 w-8 text-red-600" />
                </div>
                <CardTitle className="text-lg">Health Trivia</CardTitle>
                <div className="mt-2">
                  <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full">
                    Coming Soon
                  </span>
                </div>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600 mb-4">Quick trivia questions about nutrition, exercise, and reproductive health.</p>
                <div className="flex items-center justify-center text-sm text-gray-500 mb-4">
                  <Clock className="h-4 w-4 mr-1" />
                  2-3 minutes
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Why Play Health Games?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
            <div>
              <Brain className="h-12 w-12 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Learn Better</h3>
              <p className="opacity-90">Interactive games help you retain health information more effectively than traditional reading.</p>
            </div>
            <div>
              <Heart className="h-12 w-12 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Stay Engaged</h3>
              <p className="opacity-90">Fun gameplay keeps you motivated to learn about your reproductive health and wellness.</p>
            </div>
            <div>
              <Award className="h-12 w-12 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Track Progress</h3>
              <p className="opacity-90">Monitor your learning progress and celebrate achievements as you master health concepts.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HealthGames;
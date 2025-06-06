import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { BookOpen, Trophy, Clock, Brain, Activity, Target } from "lucide-react";
import { useTranslation } from "react-i18next";

// Quiz game questions
interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

const healthQuizQuestions: QuizQuestion[] = [
  {
    id: 1,
    question: "How long does a typical menstrual cycle last?",
    options: ["14 days", "21 days", "28 days", "35 days"],
    correctAnswer: 2,
    explanation: "While cycles can vary from person to person, the average menstrual cycle lasts about 28 days, counted from the first day of one period to the first day of the next."
  },
  {
    id: 2,
    question: "During which phase of the menstrual cycle does ovulation typically occur?",
    options: ["Menstrual phase", "Follicular phase", "Luteal phase", "Premenstrual phase"],
    correctAnswer: 1,
    explanation: "Ovulation typically occurs at the end of the follicular phase, about 14 days before the next period starts in a 28-day cycle."
  },
  {
    id: 3,
    question: "Which hormone triggers ovulation?",
    options: ["Estrogen", "Progesterone", "Luteinizing hormone (LH)", "Follicle-stimulating hormone (FSH)"],
    correctAnswer: 2,
    explanation: "Luteinizing hormone (LH) surges just before ovulation, triggering the release of an egg from the ovary."
  },
  {
    id: 4,
    question: "What is the fertile window in a typical menstrual cycle?",
    options: ["The first 5 days of the cycle", "Days 7-11 of the cycle", "Days 10-17 of the cycle", "The last 5 days of the cycle"],
    correctAnswer: 2,
    explanation: "The fertile window typically spans about 6 days - the 5 days before ovulation plus the day of ovulation itself, which is often around days 10-17 in a 28-day cycle."
  },
  {
    id: 5,
    question: "Which of these is NOT a common PMS symptom?",
    options: ["Mood swings", "Bloating", "Headaches", "High fever"],
    correctAnswer: 3,
    explanation: "High fever is not a typical PMS symptom. Common PMS symptoms include mood swings, bloating, headaches, breast tenderness, and fatigue."
  },
  {
    id: 6,
    question: "How long does a fertilized egg take to travel from the fallopian tube to the uterus?",
    options: ["1-2 hours", "1-2 days", "3-4 days", "5-6 days"],
    correctAnswer: 2,
    explanation: "A fertilized egg typically takes 3-4 days to travel from the fallopian tube to the uterus, where it may implant in the uterine lining."
  },
  {
    id: 7,
    question: "Which vitamin is especially important to take before and during early pregnancy to prevent neural tube defects?",
    options: ["Vitamin A", "Vitamin C", "Vitamin D", "Vitamin B9 (Folate/Folic Acid)"],
    correctAnswer: 3,
    explanation: "Vitamin B9 (Folate/Folic Acid) is essential before and during early pregnancy to help prevent neural tube defects in the developing baby."
  },
  {
    id: 8,
    question: "What is the average length of a full-term pregnancy?",
    options: ["36 weeks", "38 weeks", "40 weeks", "42 weeks"],
    correctAnswer: 2,
    explanation: "A full-term pregnancy is considered to be about 40 weeks (or 280 days) from the first day of the last menstrual period."
  },
  {
    id: 9,
    question: "Which of these can help alleviate menstrual cramps?",
    options: ["Cold compresses", "Caffeine", "Exercise", "Sugary foods"],
    correctAnswer: 2,
    explanation: "Light to moderate exercise can help reduce menstrual cramps by releasing endorphins and improving blood circulation to the pelvic area."
  },
  {
    id: 10,
    question: "What does PCOS stand for?",
    options: ["Premenstrual Cycle Ovarian Syndrome", "Polycystic Ovary Syndrome", "Primary Cervical Obstruction Syndrome", "Post-Contraceptive Ovulation Syndrome"],
    correctAnswer: 1,
    explanation: "PCOS stands for Polycystic Ovary Syndrome, a hormonal disorder common among women of reproductive age that can affect fertility and metabolism."
  }
];

// Cycle phases for matching game
interface CyclePhase {
  name: string;
  description: string;
  characteristics: string[];
  color: string;
}

const cyclePhases: CyclePhase[] = [
  {
    name: "Menstrual Phase",
    description: "The period when the uterine lining sheds",
    characteristics: [
      "Bleeding",
      "Cramps",
      "Typically lasts 3-7 days",
      "Beginning of a new cycle"
    ],
    color: "bg-rose-100 border-rose-500"
  },
  {
    name: "Follicular Phase",
    description: "The phase when follicles in the ovary mature",
    characteristics: [
      "Increased estrogen",
      "Uterine lining builds up",
      "Typically days 6-14",
      "Ends with ovulation"
    ],
    color: "bg-amber-100 border-amber-500"
  },
  {
    name: "Ovulation Phase",
    description: "The release of a mature egg from the ovary",
    characteristics: [
      "Egg released from ovary",
      "Fertile window",
      "Cervical mucus changes",
      "Can cause mild pain (mittelschmerz)"
    ],
    color: "bg-green-100 border-green-500"
  },
  {
    name: "Luteal Phase",
    description: "Post-ovulation phase when the body prepares for possible pregnancy",
    characteristics: [
      "Increased progesterone",
      "Typically days 15-28",
      "PMS symptoms may occur",
      "Basal body temperature rises"
    ],
    color: "bg-blue-100 border-blue-500"
  }
];

// Symptom Tracker Challenge data
interface BodySystem {
  name: string;
  symptoms: string[];
  description: string;
  healthyHabits: string[];
}

const bodySystems: BodySystem[] = [
  {
    name: "Reproductive System",
    symptoms: [
      "Irregular periods",
      "Severe menstrual cramps",
      "Unusual discharge",
      "Pelvic pain",
      "Heavy bleeding"
    ],
    description: "The female reproductive system includes the ovaries, fallopian tubes, uterus, cervix, and vagina. These organs work together to produce hormones, release eggs, and support pregnancy.",
    healthyHabits: [
      "Track your menstrual cycle",
      "Get regular gynecological check-ups",
      "Practice safe sex",
      "Do regular breast self-exams",
      "Stay hydrated"
    ]
  },
  {
    name: "Hormonal System",
    symptoms: [
      "Mood swings",
      "Fatigue",
      "Weight changes",
      "Hot flashes",
      "Sleep disturbances"
    ],
    description: "The endocrine system produces hormones that regulate many bodily functions including metabolism, growth, development, and reproduction. Estrogen and progesterone are key female hormones.",
    healthyHabits: [
      "Maintain a balanced diet",
      "Get regular exercise",
      "Manage stress",
      "Get adequate sleep",
      "Limit alcohol consumption"
    ]
  },
  {
    name: "Digestive System",
    symptoms: [
      "Bloating",
      "Constipation",
      "Diarrhea",
      "Nausea",
      "Abdominal pain"
    ],
    description: "The digestive system breaks down food into nutrients for the body to use for energy, growth, and cell repair. Many women experience digestive changes throughout their menstrual cycle.",
    healthyHabits: [
      "Eat fiber-rich foods",
      "Stay hydrated",
      "Eat smaller, more frequent meals",
      "Exercise regularly",
      "Manage stress"
    ]
  },
  {
    name: "Immune System",
    symptoms: [
      "Frequent infections",
      "Slow healing",
      "Allergies",
      "Fatigue",
      "Inflammation"
    ],
    description: "The immune system protects the body from pathogens and disease. Hormone fluctuations during the menstrual cycle can affect immune function in some women.",
    healthyHabits: [
      "Get adequate sleep",
      "Eat a nutrient-rich diet",
      "Exercise regularly",
      "Wash hands frequently",
      "Get recommended vaccinations"
    ]
  }
];

// Health Games Component
const HealthGames = () => {
  const [activeTab, setActiveTab] = useState("quiz");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  
  // Matching game state
  const [matchingGameActive, setMatchingGameActive] = useState(false);
  const [shuffledCharacteristics, setShuffledCharacteristics] = useState<{text: string, phaseIndex: number, matched: boolean}[]>([]);
  const [selectedCharacteristic, setSelectedCharacteristic] = useState<number | null>(null);
  const [matchedPhases, setMatchedPhases] = useState<boolean[]>([false, false, false, false]);
  const [phaseScores, setPhaseScores] = useState([0, 0, 0, 0]);
  const [matchGameComplete, setMatchGameComplete] = useState(false);
  
  // Symptom tracker challenge state
  const [selectedSystem, setSelectedSystem] = useState<number | null>(null);
  const [trackedSymptoms, setTrackedSymptoms] = useState<{[key: string]: string[]}>({});
  const [symptomLearningComplete, setSymptomLearningComplete] = useState<boolean[]>([false, false, false, false]);
  
  // Timer states
  const [quizTimeElapsed, setQuizTimeElapsed] = useState(0);
  const [matchGameTimeElapsed, setMatchGameTimeElapsed] = useState(0);
  
  const { toast } = useToast();
  const { t } = useTranslation();
  
  // Quiz game handlers
  const handleAnswerSelection = (answerIndex: number) => {
    if (hasAnswered) return;
    
    setSelectedAnswer(answerIndex);
    setHasAnswered(true);
    
    const currentQuestion = healthQuizQuestions[currentQuestionIndex];
    if (answerIndex === currentQuestion.correctAnswer) {
      setScore(score + 1);
      toast({
        title: t('healthGames.quizGame.correct'),
        description: currentQuestion.explanation,
        variant: "default",
      });
    } else {
      toast({
        title: t('healthGames.quizGame.incorrect'),
        description: currentQuestion.explanation,
        variant: "destructive",
      });
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < healthQuizQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setHasAnswered(false);
    } else {
      setQuizCompleted(true);
    }
  };

  const restartQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setHasAnswered(false);
    setScore(0);
    setQuizCompleted(false);
    setQuizTimeElapsed(0);
  };
  
  // Matching game handlers
  const startMatchingGame = () => {
    // Create a shuffled array of all characteristics with their phase index
    const allCharacteristics = cyclePhases.flatMap((phase, phaseIndex) => 
      phase.characteristics.map(characteristic => ({
        text: characteristic,
        phaseIndex: phaseIndex,
        matched: false
      }))
    );
    
    // Shuffle the characteristics
    const shuffled = [...allCharacteristics].sort(() => Math.random() - 0.5);
    
    setShuffledCharacteristics(shuffled);
    setMatchingGameActive(true);
    setMatchedPhases([false, false, false, false]);
    setPhaseScores([0, 0, 0, 0]);
    setMatchGameComplete(false);
  };
  
  const handleCharacteristicSelection = (index: number) => {
    if (shuffledCharacteristics[index].matched) return;
    
    const characteristic = shuffledCharacteristics[index];
    const phaseIndex = characteristic.phaseIndex;
    
    // If this is the first selection, mark it as selected
    if (selectedCharacteristic === null) {
      setSelectedCharacteristic(index);
      return;
    }
    
    // This is the second selection, check if it matches the phase of the first selection
    const firstCharacteristic = shuffledCharacteristics[selectedCharacteristic];
    
    if (firstCharacteristic.phaseIndex === phaseIndex) {
      // Match found!
      const newShuffledCharacteristics = [...shuffledCharacteristics];
      newShuffledCharacteristics[selectedCharacteristic].matched = true;
      newShuffledCharacteristics[index].matched = true;
      setShuffledCharacteristics(newShuffledCharacteristics);
      
      // Update the score for this phase
      const newPhaseScores = [...phaseScores];
      newPhaseScores[phaseIndex]++;
      setPhaseScores(newPhaseScores);
      
      // Check if all characteristics for this phase are matched
      if (newPhaseScores[phaseIndex] === cyclePhases[phaseIndex].characteristics.length) {
        const newMatchedPhases = [...matchedPhases];
        newMatchedPhases[phaseIndex] = true;
        setMatchedPhases(newMatchedPhases);
        
        toast({
          title: t('healthGames.cycleMatchGame.phaseCompleted'),
          description: `You've matched all characteristics for the ${cyclePhases[phaseIndex].name}!`,
        });
        
        // Check if all phases are matched
        if (newMatchedPhases.every(matched => matched)) {
          setMatchGameComplete(true);
          toast({
            title: t('healthGames.cycleMatchGame.gameCompleted'),
            description: t('healthGames.cycleMatchGame.congratulations'),
          });
        }
      }
    }
    
    // Reset selection regardless of match
    setSelectedCharacteristic(null);
  };
  
  const resetMatchingGame = () => {
    setMatchingGameActive(false);
    setShuffledCharacteristics([]);
    setSelectedCharacteristic(null);
    setMatchedPhases([false, false, false, false]);
    setPhaseScores([0, 0, 0, 0]);
    setMatchGameComplete(false);
    setMatchGameTimeElapsed(0);
  };
  
  // Symptom tracker challenge handlers
  const handleSystemSelection = (index: number) => {
    setSelectedSystem(index);
    
    // Initialize tracked symptoms for this system if not already done
    if (!trackedSymptoms[index]) {
      setTrackedSymptoms({
        ...trackedSymptoms,
        [index]: []
      });
    }
  };
  
  const toggleSymptom = (symptom: string) => {
    if (selectedSystem === null) return;
    
    const systemSymptoms = trackedSymptoms[selectedSystem] || [];
    
    if (systemSymptoms.includes(symptom)) {
      // Remove the symptom
      const updatedSymptoms = systemSymptoms.filter(s => s !== symptom);
      setTrackedSymptoms({
        ...trackedSymptoms,
        [selectedSystem]: updatedSymptoms
      });
    } else {
      // Add the symptom
      setTrackedSymptoms({
        ...trackedSymptoms,
        [selectedSystem]: [...systemSymptoms, symptom]
      });
    }
  };
  
  const completeSystemLearning = (index: number) => {
    const newLearningComplete = [...symptomLearningComplete];
    newLearningComplete[index] = true;
    setSymptomLearningComplete(newLearningComplete);
    
    toast({
      title: t('healthGames.bodySystemsGame.learningComplete'),
      description: `You've completed learning about the ${bodySystems[index].name}!`,
    });
  };
  
  const resetSymptomTracker = () => {
    setSelectedSystem(null);
    setTrackedSymptoms({});
    setSymptomLearningComplete([false, false, false, false]);
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-2">{t('healthGames.title')}</h1>
      <p className="text-gray-500 text-center mb-8">{t('healthGames.subtitle')}</p>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mb-8">
        <TabsList className="grid grid-cols-3 mb-8">
          <TabsTrigger value="quiz" className="flex items-center gap-2">
            <Brain className="h-4 w-4" /> {t('healthGames.quizGame.title')}
          </TabsTrigger>
          <TabsTrigger value="matching" className="flex items-center gap-2">
            <Activity className="h-4 w-4" /> {t('healthGames.cycleMatchGame.title')}
          </TabsTrigger>
          <TabsTrigger value="symptoms" className="flex items-center gap-2">
            <Target className="h-4 w-4" /> {t('healthGames.bodySystemsGame.title')}
          </TabsTrigger>
        </TabsList>
        
        {/* Health Quiz Game */}
        <TabsContent value="quiz">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-yellow-500" />
                  {t('healthGames.quizGame.title')}
                </div>
                <Badge variant="outline" className="ml-2">
                  {quizCompleted ? "Completed" : `Question ${currentQuestionIndex + 1}/${healthQuizQuestions.length}`}
                </Badge>
              </CardTitle>
              <CardDescription>
                {t('healthGames.quizGame.subtitle')}
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              {!quizCompleted ? (
                <div className="space-y-6">
                  <div className="mb-4">
                    <Progress value={(currentQuestionIndex / healthQuizQuestions.length) * 100} className="h-2" />
                  </div>
                  
                  <div className="bg-primary/5 p-4 rounded-lg">
                    <h3 className="text-lg font-medium mb-3">
                      {healthQuizQuestions[currentQuestionIndex].question}
                    </h3>
                    
                    <div className="space-y-3">
                      {healthQuizQuestions[currentQuestionIndex].options.map((option, index) => (
                        <button
                          key={index}
                          className={cn(
                            "w-full text-left px-4 py-3 rounded-md border transition-colors",
                            selectedAnswer === index && hasAnswered && index === healthQuizQuestions[currentQuestionIndex].correctAnswer
                              ? "bg-green-100 border-green-500"
                              : selectedAnswer === index && hasAnswered
                                ? "bg-red-100 border-red-500"
                                : selectedAnswer === index
                                  ? "bg-primary/20 border-primary"
                                  : "hover:bg-gray-100 border-gray-200"
                          )}
                          onClick={() => handleAnswerSelection(index)}
                          disabled={hasAnswered}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                    
                    {hasAnswered && (
                      <div className="mt-4 text-sm bg-gray-50 p-3 rounded border">
                        <p className="font-medium">
                          {selectedAnswer === healthQuizQuestions[currentQuestionIndex].correctAnswer
                            ? `✓ ${t('healthGames.quizGame.correct')}`
                            : `✗ ${t('healthGames.quizGame.incorrect')}`
                          }
                        </p>
                        <p className="mt-1 text-gray-600">
                          {healthQuizQuestions[currentQuestionIndex].explanation}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/20 mb-4">
                    <Trophy className="h-10 w-10 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold">{t('healthGames.quizGame.completed')}</h3>
                  <p className="text-xl mt-2">
                    {t('healthGames.quizGame.yourScore')}: <span className="font-bold">{score}/{healthQuizQuestions.length}</span>
                  </p>
                  <p className="mt-4 text-gray-500">
                    {score === healthQuizQuestions.length
                      ? t('healthGames.quizGame.perfectScore')
                      : score >= healthQuizQuestions.length * 0.8
                        ? t('healthGames.quizGame.greatJob')
                        : score >= healthQuizQuestions.length * 0.6
                          ? t('healthGames.quizGame.goodEffort')
                          : t('healthGames.quizGame.moreToLearn')
                    }
                  </p>
                </div>
              )}
            </CardContent>
            
            <CardFooter className="flex justify-between">
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1 text-gray-500" />
                <span className="text-sm text-gray-500">
                  Score: {score}/{healthQuizQuestions.length}
                </span>
              </div>
              
              {!quizCompleted ? (
                <Button onClick={handleNextQuestion} disabled={!hasAnswered}>
                  {currentQuestionIndex < healthQuizQuestions.length - 1 ? t('healthGames.quizGame.nextQuestion') : t('healthGames.quizGame.finishQuiz')}
                </Button>
              ) : (
                <Button onClick={restartQuiz}>{t('healthGames.quizGame.playAgain')}</Button>
              )}
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Cycle Phase Matching Game */}
        <TabsContent value="matching">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-violet-500" />
                {t('healthGames.cycleMatchGame.title')}
              </CardTitle>
              <CardDescription>
                {t('healthGames.cycleMatchGame.subtitle')}
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              {!matchingGameActive ? (
                <div className="text-center py-8">
                  <div className="max-w-md mx-auto space-y-6">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-violet-100 mb-4">
                      <Activity className="h-10 w-10 text-violet-500" />
                    </div>
                    <h3 className="text-xl font-medium">{t('healthGames.cycleMatchGame.learnAbout')}</h3>
                    <p className="text-gray-500">
                      {t('healthGames.cycleMatchGame.description')}
                    </p>
                    <Button 
                      onClick={startMatchingGame} 
                      className="bg-violet-500 hover:bg-violet-600"
                    >
                      {t('healthGames.cycleMatchGame.startGame')}
                    </Button>
                  </div>
                </div>
              ) : !matchGameComplete ? (
                <div className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {cyclePhases.map((phase, index) => (
                      <div 
                        key={index}
                        className={cn(
                          "border rounded-lg p-4 transition-all",
                          matchedPhases[index] ? phase.color : "bg-gray-50 border-gray-200"
                        )}
                      >
                        <h3 className="font-medium text-center mb-2">{phase.name}</h3>
                        <p className="text-xs text-center text-gray-500 mb-3">{phase.description}</p>
                        <div className="text-center">
                          <span className="text-sm font-medium">
                            {t('healthGames.cycleMatchGame.matched')}: {phaseScores[index]}/{phase.characteristics.length}
                          </span>
                          <Progress 
                            value={(phaseScores[index] / phase.characteristics.length) * 100} 
                            className="h-2 mt-1" 
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="border rounded-lg p-4">
                    <h3 className="font-medium mb-3 text-center">{t('healthGames.cycleMatchGame.matchCharacteristics')}</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                      {shuffledCharacteristics.map((characteristic, index) => (
                        <button
                          key={index}
                          className={cn(
                            "text-left p-3 rounded-md border text-sm transition-colors",
                            characteristic.matched 
                              ? `${cyclePhases[characteristic.phaseIndex].color} opacity-50` 
                              : selectedCharacteristic === index
                                ? "bg-primary/20 border-primary"
                                : "hover:bg-gray-100 border-gray-200"
                          )}
                          onClick={() => handleCharacteristicSelection(index)}
                          disabled={characteristic.matched}
                        >
                          {characteristic.text}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-4">
                    <Trophy className="h-10 w-10 text-green-500" />
                  </div>
                  <h3 className="text-2xl font-bold">{t('healthGames.cycleMatchGame.gameCompleted')}</h3>
                  <p className="mt-4 text-gray-600">
                    {t('healthGames.cycleMatchGame.gameCompletedDescription')}
                  </p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                    {cyclePhases.map((phase, index) => (
                      <div 
                        key={index}
                        className={cn(
                          "border rounded-lg p-3",
                          phase.color
                        )}
                      >
                        <h4 className="font-medium text-center">{phase.name}</h4>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
            
            <CardFooter className="flex justify-between">
              {matchingGameActive && (
                <Button 
                  variant="outline" 
                  onClick={resetMatchingGame}
                >
                  {t('healthGames.cycleMatchGame.resetGame')}
                </Button>
              )}
              
              {matchGameComplete && (
                <Button 
                  className="ml-auto" 
                  onClick={startMatchingGame}
                >
                  {t('healthGames.cycleMatchGame.playAgain')}
                </Button>
              )}
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Body Systems Explorer */}
        <TabsContent value="symptoms">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-blue-500" />
                {t('healthGames.bodySystemsGame.title')}
              </CardTitle>
              <CardDescription>
                {t('healthGames.bodySystemsGame.subtitle')}
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1 space-y-4">
                  <h3 className="font-medium text-lg mb-2">{t('healthGames.bodySystemsGame.systems')}</h3>
                  
                  {bodySystems.map((system, index) => (
                    <button
                      key={index}
                      className={cn(
                        "w-full text-left p-4 rounded-lg border transition-colors",
                        symptomLearningComplete[index] && "border-green-500 bg-green-50",
                        selectedSystem === index && "border-primary bg-primary/10",
                        "hover:bg-gray-50"
                      )}
                      onClick={() => handleSystemSelection(index)}
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{system.name}</span>
                        {symptomLearningComplete[index] && (
                          <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                            {t('healthGames.bodySystemsGame.completed')}
                          </Badge>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
                
                <div className="md:col-span-2 border rounded-lg p-6">
                  {selectedSystem !== null ? (
                    <div className="space-y-6">
                      <h3 className="text-xl font-semibold">{bodySystems[selectedSystem].name}</h3>
                      
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <h4 className="font-medium mb-2">{t('healthGames.bodySystemsGame.aboutSystem')}</h4>
                        <p className="text-sm text-gray-700">
                          {bodySystems[selectedSystem].description}
                        </p>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-3">{t('healthGames.bodySystemsGame.commonSymptoms')}</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {bodySystems[selectedSystem].symptoms.map((symptom, idx) => {
                            const isTracked = trackedSymptoms[selectedSystem]?.includes(symptom);
                            return (
                              <button
                                key={idx}
                                className={cn(
                                  "flex items-center p-3 rounded-md border text-sm text-left transition-colors",
                                  isTracked 
                                    ? "bg-primary/20 border-primary"
                                    : "hover:bg-gray-100 border-gray-200"
                                )}
                                onClick={() => toggleSymptom(symptom)}
                              >
                                <div className={cn(
                                  "w-4 h-4 rounded mr-2 flex-shrink-0",
                                  isTracked ? "bg-primary" : "bg-gray-200"
                                )} />
                                {symptom}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-3">{t('healthGames.bodySystemsGame.healthyHabits')}</h4>
                        <ul className="list-disc pl-5 space-y-1 text-sm">
                          {bodySystems[selectedSystem].healthyHabits.map((habit, idx) => (
                            <li key={idx} className="text-gray-700">{habit}</li>
                          ))}
                        </ul>
                      </div>
                      
                      <Button 
                        onClick={() => completeSystemLearning(selectedSystem)}
                        disabled={symptomLearningComplete[selectedSystem]}
                        className="w-full"
                      >
                        {symptomLearningComplete[selectedSystem] 
                          ? t('healthGames.bodySystemsGame.learningComplete') 
                          : t('healthGames.bodySystemsGame.markLearningComplete')
                        }
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-500">
                        {t('healthGames.bodySystemsGame.selectSystem')}
                      </h3>
                      <p className="text-gray-400 text-sm mt-2">
                        {t('healthGames.bodySystemsGame.exploreDescription')}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
            
            <CardFooter>
              <Button 
                variant="outline" 
                onClick={resetSymptomTracker}
                className="ml-auto"
              >
                {t('healthGames.bodySystemsGame.resetProgress')}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default HealthGames;
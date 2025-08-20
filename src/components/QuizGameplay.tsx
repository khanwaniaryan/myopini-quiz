import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { Question, getQuestionsByCategoryAndDifficulty } from "@/data/quizData";
import { QuizConfig } from "./QuizSelection";
import { Opponent } from "./Matchmaking";
import { 
  Clock, 
  Zap, 
  CheckCircle, 
  XCircle, 
  Trophy, 
  Target, 
  Eye, 
  Wifi, 
  Shield, 
  Timer,
  Sparkles,
  TrendingUp,
  Users,
  MessageCircle,
  Settings,
  Volume2,
  VolumeX,
  Flame
} from "lucide-react";

interface QuizGameplayProps {
  config: QuizConfig;
  opponent: Opponent;
  walletAddress: string;
  onQuizComplete: (results: QuizResults) => void;
}

export interface QuizResults {
  playerScore: number;
  opponentScore: number;
  totalQuestions: number;
  playerAnswers: Array<{ correct: boolean; timeSeconds: number }>;
  opponentAnswers: Array<{ correct: boolean; timeSeconds: number }>;
  isWinner: boolean;
  category: string;
  difficulty: string;
  playerStreak: number;
  opponentStreak: number;
  averageResponseTime: number;
}

// Power-up types
type PowerUpType = "fifty-fifty" | "extra-time" | "peek";

interface PowerUp {
  type: PowerUpType;
  name: string;
  description: string;
  icon: React.ReactNode;
  used: boolean;
  cooldown: number;
}

// Live feed entry
interface LiveFeedEntry {
  id: string;
  message: string;
  timestamp: number;
  type: "speed" | "streak" | "powerup" | "general";
}

// Question Progress Component
const QuestionProgress = ({ 
  playerResults, 
  opponentResults, 
  currentQuestion, 
  totalQuestions 
}: { 
  playerResults: Array<"correct" | "incorrect" | null>;
  opponentResults: Array<"correct" | "incorrect" | null>;
  currentQuestion: number;
  totalQuestions: number;
}) => {
  return (
    <div className="flex flex-col gap-2 mb-6">
      {/* Player Progress */}
      <div className="flex items-center gap-2">
        <div className="text-xs text-muted w-12">You:</div>
        <div className="flex gap-1">
          {Array.from({ length: totalQuestions }, (_, i) => (
            <div
              key={i}
              className={`w-3 h-3 rounded-full border ${
                i === currentQuestion
                  ? 'border-primary bg-primary animate-pulse'
                  : playerResults[i] === 'correct'
                  ? 'border-win bg-win'
                  : playerResults[i] === 'incorrect'
                  ? 'border-red-500 bg-red-500'
                  : 'border-card-border bg-card'
              }`}
            />
          ))}
        </div>
      </div>
      
      {/* Opponent Progress */}
      <div className="flex items-center gap-2">
        <div className="text-xs text-muted w-12">Opp:</div>
        <div className="flex gap-1">
          {Array.from({ length: totalQuestions }, (_, i) => (
            <div
              key={i}
              className={`w-3 h-3 rounded-full border ${
                i === currentQuestion
                  ? 'border-accent bg-accent animate-pulse'
                  : opponentResults[i] === 'correct'
                  ? 'border-win bg-win'
                  : opponentResults[i] === 'incorrect'
                  ? 'border-red-500 bg-red-500'
                  : 'border-card-border bg-card'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const QuizGameplay = ({ config, opponent, walletAddress, onQuizComplete }: QuizGameplayProps) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [timeLeft, setTimeLeft] = useState(10);
  const [startTime, setStartTime] = useState<number>(0);
  const [playerScore, setPlayerScore] = useState(0);
  const [opponentScore, setOpponentScore] = useState(0);
  const [playerAnswers, setPlayerAnswers] = useState<Array<{ correct: boolean; timeSeconds: number }>>([]);
  const [opponentAnswers, setOpponentAnswers] = useState<Array<{ correct: boolean; timeSeconds: number }>>([]);
  const [opponentAnswered, setOpponentAnswered] = useState(false);
  const [gamePhase, setGamePhase] = useState<"countdown" | "question" | "answer" | "complete">("countdown");
  const [countdown, setCountdown] = useState(3);
  
  // New competitive features
  const [playerStreak, setPlayerStreak] = useState(0);
  const [opponentStreak, setOpponentStreak] = useState(0);
  const [playerResponseTime, setPlayerResponseTime] = useState<number>(0);
  const [opponentResponseTime, setOpponentResponseTime] = useState<number>(0);
  const [showSpeedBonus, setShowSpeedBonus] = useState(false);
  const [speedBonusPoints, setSpeedBonusPoints] = useState(0);
  const [liveFeed, setLiveFeed] = useState<LiveFeedEntry[]>([]);
  const [spectatorCount, setSpectatorCount] = useState(12);
  const [ping, setPing] = useState(45);
  const [showSettings, setShowSettings] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);
  
  // Question progress tracking
  const [playerQuestionResults, setPlayerQuestionResults] = useState<Array<"correct" | "incorrect" | null>>([]);
  const [opponentQuestionResults, setOpponentQuestionResults] = useState<Array<"correct" | "incorrect" | null>>([]);
  const [showLiveFeed, setShowLiveFeed] = useState(true);
  
  // Power-ups
  const [powerUps, setPowerUps] = useState<PowerUp[]>([
    {
      type: "fifty-fifty",
      name: "50:50",
      description: "Remove two wrong answers",
      icon: <Target className="h-4 w-4" />,
      used: false,
      cooldown: 0
    },
    {
      type: "extra-time",
      name: "Extra Time",
      description: "Add 10 seconds to timer",
      icon: <Timer className="h-4 w-4" />,
      used: false,
      cooldown: 0
    },
    {
      type: "peek",
      name: "Peek",
      description: "See opponent's answer after you answer",
      icon: <Eye className="h-4 w-4" />,
      used: false,
      cooldown: 0
    }
  ]);
  
  const [removedOptions, setRemovedOptions] = useState<number[]>([]);
  const [showOpponentAnswer, setShowOpponentAnswer] = useState(false);
  const [opponentSelectedAnswer, setOpponentSelectedAnswer] = useState<number | null>(null);
  
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const speedMeterRef = useRef<HTMLDivElement>(null);
  const streakRef = useRef<HTMLDivElement>(null);

  // Calculate win probability
  const calculateWinProbability = () => {
    const totalQuestions = questions.length;
    const questionsLeft = totalQuestions - currentQuestionIndex - 1;
    const maxPossiblePoints = questionsLeft * 15; // Max 15 points per question
    
    const playerMaxScore = playerScore + maxPossiblePoints;
    const opponentMaxScore = opponentScore + maxPossiblePoints;
    
    if (playerMaxScore < opponentScore) return 0;
    if (opponentMaxScore < playerScore) return 100;
    
    const playerAdvantage = playerScore - opponentScore;
    const totalPossible = maxPossiblePoints * 2;
    
    return Math.max(0, Math.min(100, 50 + (playerAdvantage / totalPossible) * 100));
  };

  const winProbability = calculateWinProbability();

  // Add live feed entry
  const addLiveFeedEntry = (message: string, type: LiveFeedEntry["type"] = "general") => {
    const entry: LiveFeedEntry = {
      id: Date.now().toString(),
      message,
      timestamp: Date.now(),
      type
    };
    
    setLiveFeed(prev => [entry, ...prev.slice(0, 4)]); // Keep last 5 entries
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
      setLiveFeed(prev => prev.filter(e => e.id !== entry.id));
    }, 5000);
  };

  // Speed meter component
  const SpeedMeter = ({ responseTime, isPlayer, isAnswered }: { 
    responseTime: number; 
    isPlayer: boolean; 
    isAnswered: boolean;
  }) => {
    const percentage = isAnswered ? Math.max(0, 100 - (responseTime / 10) * 100) : 100;
    const isFast = responseTime < 3;
    
    return (
      <div className="relative">
        {isMobile ? (
          // Horizontal bar for mobile
          <div className="w-full h-2 bg-card-border rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-300 ${
                isFast ? 'bg-win' : 'bg-primary'
              }`}
              style={{ width: `${percentage}%` }}
            />
            {isAnswered && (
              <div className="absolute -top-6 left-0 text-xs font-mono">
                {responseTime.toFixed(1)}s
                {isFast && <Zap className="inline h-3 w-3 ml-1 text-win" />}
              </div>
            )}
          </div>
        ) : (
          // Radial meter for desktop
          <div className="relative w-16 h-16">
            <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 64 64">
              <circle
                cx="32"
                cy="32"
                r="28"
                stroke="hsl(var(--card-border))"
                strokeWidth="4"
                fill="none"
              />
              <circle
                cx="32"
                cy="32"
                r="28"
                stroke={isFast ? "hsl(var(--win))" : "hsl(var(--primary))"}
                strokeWidth="4"
                fill="none"
                strokeDasharray={`${2 * Math.PI * 28}`}
                strokeDashoffset={`${2 * Math.PI * 28 * (1 - percentage / 100)}`}
                className="transition-all duration-300"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              {isAnswered ? (
                <div className="text-xs font-mono text-center">
                  <div>{responseTime.toFixed(1)}s</div>
                  {isFast && <Zap className="h-3 w-3 mx-auto text-win" />}
                </div>
              ) : (
                <div className="w-2 h-2 bg-muted rounded-full animate-pulse" />
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  // Streak badge component
  const StreakBadge = ({ streak, isPlayer }: { streak: number; isPlayer: boolean }) => {
    if (streak < 2) return null;
    
    const multiplier = streak >= 3 ? 1.5 : 1.2;
    
    return (
      <div 
        ref={streakRef}
        className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold ${
          isPlayer ? 'bg-win/20 text-win' : 'bg-accent/20 text-accent'
        } animate-pulse`}
      >
        <Sparkles className="h-3 w-3" />
        <span>COMBO x{streak}</span>
        {streak >= 3 && (
          <span className="text-xs opacity-75">+{Math.round((multiplier - 1) * 100)}%</span>
        )}
      </div>
    );
  };

  // Power-up component
  const PowerUpButton = ({ powerUp, onUse }: { powerUp: PowerUp; onUse: () => void }) => {
    const isDisabled = powerUp.used || powerUp.cooldown > 0;
    
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={onUse}
        disabled={isDisabled}
        className={`relative ${isDisabled ? 'opacity-50' : 'hover:scale-105'}`}
        title={powerUp.description}
      >
        {powerUp.icon}
        <span className="ml-1">{powerUp.name}</span>
        {powerUp.cooldown > 0 && (
          <div className="absolute inset-0 bg-black/50 rounded flex items-center justify-center text-xs">
            {powerUp.cooldown}s
          </div>
        )}
      </Button>
    );
  };

  // Live feed component
  const LiveFeed = () => {
    if (!showLiveFeed || liveFeed.length === 0) return null;
    
    return (
      <div className="fixed bottom-4 right-4 w-72 sm:w-80 max-h-48 overflow-hidden z-50">
        <div className="bg-card/90 backdrop-blur-sm border border-card-border rounded-lg p-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 text-xs text-muted">
              <MessageCircle className="h-3 w-3" />
              <span className="hidden sm:inline">Live Feed</span>
              <span className="sm:hidden">Feed</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowLiveFeed(false)}
              className="h-6 w-6 p-0"
            >
              ×
            </Button>
          </div>
          <div className="space-y-1">
            {liveFeed.map(entry => (
              <div key={entry.id} className="text-xs text-muted animate-fade-in">
                {entry.message}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  useEffect(() => {
    const categoryQuestions = getQuestionsByCategoryAndDifficulty(config.category, config.difficulty);
    const shuffled = [...categoryQuestions].sort(() => Math.random() - 0.5);
    const selectedQuestions = shuffled.slice(0, parseInt(config.matchLength));
    setQuestions(selectedQuestions);
    
    // Initialize question results arrays
    setPlayerQuestionResults(new Array(selectedQuestions.length).fill(null));
    setOpponentQuestionResults(new Array(selectedQuestions.length).fill(null));
    
    // Simulate spectator count
    setSpectatorCount(Math.floor(Math.random() * 20) + 5);
    
    // Simulate ping
    setPing(Math.floor(Math.random() * 100) + 20);
  }, [config]);

  // Countdown before quiz starts
  useEffect(() => {
    if (gamePhase === "countdown" && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (gamePhase === "countdown" && countdown === 0) {
      setGamePhase("question");
      setStartTime(Date.now());
      addLiveFeedEntry("Match started! Good luck!", "general");
    }
  }, [gamePhase, countdown]);

  // Question timer
  useEffect(() => {
    if (gamePhase === "question" && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (gamePhase === "question" && timeLeft === 0) {
      handleTimeout();
    }
  }, [gamePhase, timeLeft]);

  // Simulate opponent behavior
  useEffect(() => {
    if (gamePhase === "question" && !opponentAnswered) {
      const opponentDelay = config.difficulty === "easy" ? 
        Math.random() * 4000 + 2000 : // 2-6 seconds
        config.difficulty === "medium" ?
        Math.random() * 6000 + 3000 : // 3-9 seconds
        Math.random() * 8000 + 4000; // 4-12 seconds
      
      const timer = setTimeout(() => {
        simulateOpponentAnswer();
      }, opponentDelay);
      
      return () => clearTimeout(timer);
    }
  }, [gamePhase, currentQuestionIndex, opponentAnswered]);

  const simulateOpponentAnswer = () => {
    if (opponentAnswered || gamePhase !== "question") return;
    
    const question = questions[currentQuestionIndex];
    const accuracy = opponent.isBot ? 
      (config.difficulty === "easy" ? 0.85 : config.difficulty === "medium" ? 0.65 : 0.45) :
      0.75; // Human opponent simulated accuracy
    
    const isCorrect = Math.random() < accuracy;
    const responseTime = Math.random() * 8 + 2; // 2-10 seconds
    
    setOpponentAnswered(true);
    setOpponentResponseTime(responseTime);
    const newAnswer = { correct: isCorrect, timeSeconds: responseTime };
    setOpponentAnswers(prev => [...prev, newAnswer]);
    
    // Update opponent question results
    setOpponentQuestionResults(prev => {
      const newResults = [...prev];
      newResults[currentQuestionIndex] = isCorrect ? "correct" : "incorrect";
      return newResults;
    });
    
    if (isCorrect) {
      const points = Math.max(5, 15 - Math.floor(responseTime));
      setOpponentScore(prev => prev + points);
      setOpponentStreak(prev => prev + 1);
      addLiveFeedEntry(`${opponent.name} answered correctly in ${responseTime.toFixed(1)}s`, "speed");
    } else {
      setOpponentStreak(0);
      addLiveFeedEntry(`${opponent.name} missed question ${currentQuestionIndex + 1}`, "general");
    }
  };

  const usePowerUp = (powerUpType: PowerUpType) => {
    const powerUp = powerUps.find(p => p.type === powerUpType);
    if (!powerUp || powerUp.used || powerUp.cooldown > 0) return;

    setPowerUps(prev => prev.map(p => 
      p.type === powerUpType ? { ...p, used: true } : p
    ));

    switch (powerUpType) {
      case "fifty-fifty":
        const question = questions[currentQuestionIndex];
        const wrongOptions = question.options
          .map((_, index) => index)
          .filter(index => index !== question.correctAnswer);
        const toRemove = wrongOptions.sort(() => Math.random() - 0.5).slice(0, 2);
        setRemovedOptions(toRemove);
        addLiveFeedEntry("50:50 used — two options removed", "powerup");
        break;
      
      case "extra-time":
        setTimeLeft(prev => prev + 10);
        addLiveFeedEntry("Extra time activated — +10 seconds", "powerup");
        break;
      
      case "peek":
        setShowOpponentAnswer(true);
        addLiveFeedEntry("Peek used — opponent's answer revealed", "powerup");
        break;
    }

    toast({
      title: `${powerUp.name} used`,
      description: powerUp.description,
    });
  };

  const handleAnswerSelect = (answerIndex: number) => {
    if (selectedAnswer !== null || gamePhase !== "question") return;
    
    const responseTime = (Date.now() - startTime) / 1000;
    setSelectedAnswer(answerIndex);
    setPlayerResponseTime(responseTime);
    
    const question = questions[currentQuestionIndex];
    const isCorrect = answerIndex === question.correctAnswer;
    
    const newAnswer = { correct: isCorrect, timeSeconds: responseTime };
    setPlayerAnswers(prev => [...prev, newAnswer]);
    
    if (isCorrect) {
      const basePoints = 10;
      const speedBonus = responseTime < 3 ? Math.max(0, 5 - Math.floor(responseTime)) : 0;
      const streakBonus = playerStreak >= 3 ? Math.floor(basePoints * 0.5) : 0;
      const totalPoints = basePoints + speedBonus + streakBonus;
      
      setPlayerScore(prev => prev + totalPoints);
      setPlayerStreak(prev => prev + 1);
      setSpeedBonusPoints(speedBonus);
      setShowSpeedBonus(true);
      
      addLiveFeedEntry(`You answered in ${responseTime.toFixed(1)}s`, "speed");
      
      if (speedBonus > 0) {
        addLiveFeedEntry(`Lightning! +${speedBonus} speed bonus`, "speed");
      }
      
      if (playerStreak >= 2) {
        addLiveFeedEntry(`COMBO x${playerStreak + 1} — +${Math.round((playerStreak >= 3 ? 1.5 : 1.2 - 1) * 100)}%`, "streak");
      }
      
      toast({
        title: `Correct! +${totalPoints} points`,
        description: `Answered in ${responseTime.toFixed(1)}s${speedBonus > 0 ? ` • +${speedBonus} speed bonus` : ''}`,
      });
    } else {
      setPlayerStreak(0);
      addLiveFeedEntry("You missed question " + (currentQuestionIndex + 1), "general");
      
      toast({
        title: "Incorrect",
        description: "Better luck next question!",
        variant: "destructive",
      });
    }
    
    // Update question results
    setPlayerQuestionResults(prev => {
      const newResults = [...prev];
      newResults[currentQuestionIndex] = isCorrect ? "correct" : "incorrect";
      return newResults;
    });
    
    // Simulate opponent response
    setTimeout(() => {
      const opponentResponseTime = Math.random() * 5 + 1;
      setOpponentResponseTime(opponentResponseTime);
      setOpponentAnswered(true);
      
      const opponentIsCorrect = Math.random() > 0.4; // 60% chance of being correct
      
      // Update opponent question results
      setOpponentQuestionResults(prev => {
        const newResults = [...prev];
        newResults[currentQuestionIndex] = opponentIsCorrect ? "correct" : "incorrect";
        return newResults;
      });
      
      addLiveFeedEntry(`Opponent answered in ${opponentResponseTime.toFixed(1)}s`, "speed");
    }, 1000 + Math.random() * 2000);
    
    setGamePhase("answer");
    setShowAnswer(true);
    
    // Auto advance after showing answer
    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        nextQuestion();
      } else {
        completeQuiz();
      }
    }, 3000);
  };

  const handleTimeout = () => {
    if (selectedAnswer === null) {
      setPlayerAnswers(prev => [...prev, { correct: false, timeSeconds: 10 }]);
      setPlayerStreak(0);
      addLiveFeedEntry("Time's up! No answer selected", "general");
      
      toast({
        title: "Time's up!",
        description: "No answer selected",
        variant: "destructive",
      });
    }
    setGamePhase("answer");
    setShowAnswer(true);
    
    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        nextQuestion();
      } else {
        completeQuiz();
      }
    }, 3000);
  };

  const nextQuestion = () => {
    setCurrentQuestionIndex(prev => prev + 1);
    setSelectedAnswer(null);
    setShowAnswer(false);
    setTimeLeft(10);
    setStartTime(Date.now());
    setOpponentAnswered(false);
    setOpponentSelectedAnswer(null);
    setShowOpponentAnswer(false);
    setRemovedOptions([]);
    setPlayerResponseTime(0);
    setOpponentResponseTime(0);
    setShowSpeedBonus(false);
    setGamePhase("question");
  };

  const completeQuiz = () => {
    const averageResponseTime = playerAnswers.reduce((sum, answer) => sum + answer.timeSeconds, 0) / playerAnswers.length;
    
    const results: QuizResults = {
      playerScore,
      opponentScore,
      totalQuestions: questions.length,
      playerAnswers,
      opponentAnswers,
      isWinner: playerScore > opponentScore,
      category: config.category,
      difficulty: config.difficulty,
      playerStreak,
      opponentStreak,
      averageResponseTime,
    };
    
    setGamePhase("complete");
    onQuizComplete(results);
  };

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-96 bg-card border-card-border">
          <CardContent className="p-8 text-center">
            <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4" />
            <p className="text-muted">Loading quiz questions...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-background">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-float" />
        <div className="absolute top-40 right-20 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "1s" }} />
      </div>

      <div className="relative z-10 container mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 mb-8">
          <div className="flex flex-wrap items-center gap-2 sm:gap-4">
            <Badge variant="outline" className="text-xs">
              {config.category} • {config.difficulty}
            </Badge>
            <Badge variant="outline" className="text-xs">
              Q{currentQuestionIndex + 1}/{questions.length}
            </Badge>
          </div>
          
          <Progress value={progress} className="w-32 sm:w-48" />
        </div>





        {gamePhase === "countdown" && (
          <div className="flex items-center justify-center min-h-[60vh]">
            <Card className="w-96 bg-card border-card-border">
              <CardContent className="p-12 text-center">
                <div className="text-8xl font-score font-bold text-primary mb-4 animate-scale-in">
                  {countdown}
                </div>
                <p className="text-xl text-muted">Get ready to battle!</p>
              </CardContent>
            </Card>
          </div>
        )}

        {(gamePhase === "question" || gamePhase === "answer") && (
          <div className="grid lg:grid-cols-12 gap-4 lg:gap-8">
            {/* Player Cards */}
            <div className="lg:col-span-3 order-2 lg:order-1">
              <Card className="bg-card border-card-border mb-4">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <Avatar className="w-10 h-10">
                      <AvatarFallback className="bg-primary text-white text-sm">
                        YOU
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-mono text-xs text-muted">
                        {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                      </div>
                      <div className="text-sm font-semibold">You</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 mb-2">
                    <div className="text-2xl font-score font-bold text-win">
                      {playerScore}
                    </div>
                    <StreakBadge streak={playerStreak} isPlayer={true} />
                  </div>
                  
                  <div className="flex items-center justify-between text-xs text-muted mb-3">
                    <span>Points</span>
                    <span>Q{currentQuestionIndex + 1}/{questions.length}</span>
                  </div>
                  
                  {/* Streak Display */}
                  {playerStreak >= 2 && (
                    <div className="mb-3 p-2 bg-win/10 border border-win/20 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Flame className="h-4 w-4 text-win" />
                        <span className="text-sm font-semibold text-win">COMBO x{playerStreak}</span>
                      </div>
                    </div>
                  )}
                  
                  {/* Question Progress Dots */}
                  <div className="mb-3">
                    <div className="text-xs text-muted mb-2">Progress:</div>
                    <div className="flex gap-1">
                      {Array.from({ length: questions.length }, (_, i) => (
                        <div
                          key={i}
                          className={`w-2 h-2 rounded-full border ${
                            i === currentQuestionIndex
                              ? 'border-primary bg-primary animate-pulse'
                              : playerQuestionResults[i] === 'correct'
                              ? 'border-win bg-win'
                              : playerQuestionResults[i] === 'incorrect'
                              ? 'border-red-500 bg-red-500'
                              : 'border-card-border bg-card'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  
                  {/* Speed Meter */}
                  <SpeedMeter 
                    responseTime={playerResponseTime} 
                    isPlayer={true} 
                    isAnswered={selectedAnswer !== null}
                  />
                  
                  {/* Speed Bonus Animation */}
                  {showSpeedBonus && speedBonusPoints > 0 && (
                    <div className="absolute -top-2 -right-2 bg-win text-white text-xs px-2 py-1 rounded-full animate-bounce">
                      +{speedBonusPoints}
                    </div>
                  )}
                </CardContent>
              </Card>
              
              <Card className="bg-card border-card-border">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <Avatar className="w-10 h-10">
                      <AvatarFallback className="bg-accent text-white text-sm">
                        {opponent.name.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="text-sm font-semibold">{opponent.name}</div>
                      <div className="flex items-center gap-1">
                        {opponent.isBot && <Badge variant="outline" className="text-xs">BOT</Badge>}
                        <div className={`w-2 h-2 rounded-full ${opponentAnswered ? 'bg-win' : 'bg-muted animate-pulse'}`} />
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 mb-2">
                    <div className="text-2xl font-score font-bold text-accent">
                      {opponentScore}
                    </div>
                    <StreakBadge streak={opponentStreak} isPlayer={false} />
                  </div>
                  
                  <div className="flex items-center justify-between text-xs text-muted mb-3">
                    <span>Points</span>
                    <span>Q{currentQuestionIndex + 1}/{questions.length}</span>
                  </div>
                  
                  {/* Streak Display */}
                  {opponentStreak >= 2 && (
                    <div className="mb-3 p-2 bg-accent/10 border border-accent/20 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Flame className="h-4 w-4 text-accent" />
                        <span className="text-sm font-semibold text-accent">COMBO x{opponentStreak}</span>
                      </div>
                    </div>
                  )}
                  
                  {/* Question Progress Dots */}
                  <div className="mb-3">
                    <div className="text-xs text-muted mb-2">Progress:</div>
                    <div className="flex gap-1">
                      {Array.from({ length: questions.length }, (_, i) => (
                        <div
                          key={i}
                          className={`w-2 h-2 rounded-full border ${
                            i === currentQuestionIndex
                              ? 'border-accent bg-accent animate-pulse'
                              : opponentQuestionResults[i] === 'correct'
                              ? 'border-win bg-win'
                              : opponentQuestionResults[i] === 'incorrect'
                              ? 'border-red-500 bg-red-500'
                              : 'border-card-border bg-card'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  
                  {/* Speed Meter */}
                  <SpeedMeter 
                    responseTime={opponentResponseTime} 
                    isPlayer={false} 
                    isAnswered={opponentAnswered}
                  />
                  
                  {/* Opponent Answer (if peek used) */}
                  {showOpponentAnswer && opponentSelectedAnswer !== null && (
                    <div className="mt-2 text-xs text-muted">
                      Opponent chose: {String.fromCharCode(65 + opponentSelectedAnswer)}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Question Area */}
            <div className="lg:col-span-9 order-1 lg:order-2">
              <Card className="bg-card border-card-border">
                <CardContent className="p-4 sm:p-8">
                  {/* Win Probability - Compact with Bar */}
                  <div className="mb-4 flex justify-center">
                    <div className="bg-gradient-to-r from-card to-card/50 border border-card-border rounded-lg px-6 py-3">
                      <div className="flex items-center gap-4">
                        <div className="text-center">
                          <div className="text-lg font-score font-bold text-win">
                            {Math.round(winProbability)}%
                          </div>
                          <div className="text-xs text-muted">You</div>
                        </div>
                        
                        {/* Win Probability Bar */}
                        <div className="flex flex-col items-center gap-2">
                          <div className="w-32 h-2 bg-card-border rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-win to-accent transition-all duration-500 ease-out"
                              style={{ width: `${winProbability}%` }}
                            />
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-win rounded-full animate-pulse"></div>
                            <span className="text-xs font-medium text-muted">Win Probability</span>
                          </div>
                        </div>
                        
                        <div className="text-center">
                          <div className="text-lg font-score font-bold text-accent">
                            {Math.round(100 - winProbability)}%
                          </div>
                          <div className="text-xs text-muted">Opponent</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Timer */}
                  <div className="flex justify-center mb-6">
                    <div className="relative">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-4 border-card-border flex items-center justify-center">
                        <div className={`text-xl sm:text-2xl font-score font-bold ${timeLeft <= 3 ? 'text-red-400 animate-pulse' : 'text-foreground'}`}>
                          {timeLeft}
                        </div>
                      </div>
                      <div 
                        className="absolute inset-0 rounded-full border-4 border-primary"
                        style={{
                          background: `conic-gradient(hsl(var(--primary)) ${(timeLeft / 10) * 360}deg, transparent 0deg)`
                        }}
                      />
                    </div>
                  </div>

                  {/* Question */}
                  <div className="text-center mb-8">
                    <h2 className="text-lg sm:text-2xl font-heading font-bold text-foreground mb-4">
                      {currentQuestion.question}
                    </h2>
                  </div>

                  {/* Power-ups */}
                  <div className="flex flex-wrap justify-center gap-2 mb-6">
                    {powerUps.map(powerUp => (
                      <PowerUpButton
                        key={powerUp.type}
                        powerUp={powerUp}
                        onUse={() => usePowerUp(powerUp.type)}
                      />
                    ))}
                  </div>

                  {/* Answer Options */}
                  <div className="grid grid-cols-1 gap-4 mb-6">
                    {currentQuestion.options.map((option, index) => {
                      let variant: "answer" | "answer-correct" | "answer-incorrect" | "answer-selected" = "answer";
                      
                      // Hide removed options (50:50 power-up)
                      if (removedOptions.includes(index)) {
                        return null;
                      }
                      
                      if (showAnswer) {
                        if (index === currentQuestion.correctAnswer) {
                          variant = "answer-correct";
                        } else if (selectedAnswer === index) {
                          variant = "answer-incorrect";
                        }
                      } else if (selectedAnswer === index) {
                        variant = "answer-selected";
                      }

                      return (
                        <Button
                          key={index}
                          variant={variant}
                          size="lg"
                          onClick={() => handleAnswerSelect(index)}
                          disabled={selectedAnswer !== null || gamePhase !== "question"}
                          className="h-14 sm:h-16 text-left justify-start p-4 sm:p-6 relative"
                        >
                          <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center mr-3 sm:mr-4 text-xs sm:text-sm font-semibold">
                            {String.fromCharCode(65 + index)}
                          </div>
                          <span className="text-sm sm:text-base">{option}</span>
                          {showAnswer && index === currentQuestion.correctAnswer && (
                            <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 ml-auto text-win" />
                          )}
                          {showAnswer && selectedAnswer === index && index !== currentQuestion.correctAnswer && (
                            <XCircle className="h-4 w-4 sm:h-5 sm:w-5 ml-auto text-red-400" />
                          )}
                        </Button>
                      );
                    })}
                  </div>

                  {/* Explanation */}
                  {showAnswer && (
                    <div className="bg-card/50 border border-card-border rounded-lg p-4 animate-fade-in">
                      <div className="flex items-start gap-3">
                        <Target className="h-5 w-5 text-primary mt-0.5" />
                        <div>
                          <div className="font-semibold text-sm text-foreground mb-1">Explanation</div>
                          <div className="text-sm text-muted">{currentQuestion.explanation}</div>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>

      {/* Live Feed */}
      <LiveFeed />
    </div>
  );
};

export default QuizGameplay;
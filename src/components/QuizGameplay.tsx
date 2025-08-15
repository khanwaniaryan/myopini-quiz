import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { Question, getQuestionsByCategoryAndDifficulty } from "@/data/quizData";
import { QuizConfig } from "./QuizSelection";
import { Opponent } from "./Matchmaking";
import { Clock, Zap, CheckCircle, XCircle, Trophy, Target } from "lucide-react";

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
}

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
  
  const { toast } = useToast();

  useEffect(() => {
    const categoryQuestions = getQuestionsByCategoryAndDifficulty(config.category, config.difficulty);
    const shuffled = [...categoryQuestions].sort(() => Math.random() - 0.5);
    setQuestions(shuffled.slice(0, parseInt(config.matchLength)));
  }, [config]);

  // Countdown before quiz starts
  useEffect(() => {
    if (gamePhase === "countdown" && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (gamePhase === "countdown" && countdown === 0) {
      setGamePhase("question");
      setStartTime(Date.now());
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
    const newAnswer = { correct: isCorrect, timeSeconds: responseTime };
    setOpponentAnswers(prev => [...prev, newAnswer]);
    
    if (isCorrect) {
      const points = Math.max(5, 15 - Math.floor(responseTime));
      setOpponentScore(prev => prev + points);
    }
  };

  const handleAnswerSelect = (answerIndex: number) => {
    if (selectedAnswer !== null || gamePhase !== "question") return;
    
    const responseTime = (Date.now() - startTime) / 1000;
    setSelectedAnswer(answerIndex);
    
    const question = questions[currentQuestionIndex];
    const isCorrect = answerIndex === question.correctAnswer;
    
    const newAnswer = { correct: isCorrect, timeSeconds: responseTime };
    setPlayerAnswers(prev => [...prev, newAnswer]);
    
    if (isCorrect) {
      const speedBonus = Math.max(5, 15 - Math.floor(responseTime));
      setPlayerScore(prev => prev + speedBonus);
      
      toast({
        title: `Correct! +${speedBonus} points`,
        description: `Answered in ${responseTime.toFixed(1)}s`,
      });
    } else {
      toast({
        title: "Incorrect",
        description: "Better luck next question!",
        variant: "destructive",
      });
    }
    
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
    setGamePhase("question");
  };

  const completeQuiz = () => {
    const results: QuizResults = {
      playerScore,
      opponentScore,
      totalQuestions: questions.length,
      playerAnswers,
      opponentAnswers,
      isWinner: playerScore > opponentScore,
      category: config.category,
      difficulty: config.difficulty,
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
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="text-xs">
              {config.category} • {config.difficulty}
            </Badge>
            <Badge variant="outline" className="text-xs">
              Question {currentQuestionIndex + 1}/{questions.length}
            </Badge>
          </div>
          <Progress value={progress} className="w-48" />
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
          <div className="grid lg:grid-cols-12 gap-8">
            {/* Player Cards */}
            <div className="lg:col-span-3">
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
                  <div className="text-2xl font-score font-bold text-win">
                    {playerScore}
                  </div>
                  <div className="text-xs text-muted">Points</div>
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
                  <div className="text-2xl font-score font-bold text-accent">
                    {opponentScore}
                  </div>
                  <div className="text-xs text-muted">Points</div>
                </CardContent>
              </Card>
            </div>

            {/* Question Area */}
            <div className="lg:col-span-9">
              <Card className="bg-card border-card-border">
                <CardContent className="p-8">
                  {/* Timer */}
                  <div className="flex justify-center mb-6">
                    <div className="relative">
                      <div className="w-20 h-20 rounded-full border-4 border-card-border flex items-center justify-center">
                        <div className={`text-2xl font-score font-bold ${timeLeft <= 3 ? 'text-red-400 animate-pulse' : 'text-foreground'}`}>
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
                    <h2 className="text-2xl font-heading font-bold text-foreground mb-4">
                      {currentQuestion.question}
                    </h2>
                  </div>

                  {/* Answer Options */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    {currentQuestion.options.map((option, index) => {
                      let variant: "answer" | "answer-correct" | "answer-incorrect" | "answer-selected" = "answer";
                      
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
                          className="h-16 text-left justify-start p-6"
                        >
                          <div className="w-8 h-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center mr-4 text-sm font-semibold">
                            {String.fromCharCode(65 + index)}
                          </div>
                          {option}
                          {showAnswer && index === currentQuestion.correctAnswer && (
                            <CheckCircle className="h-5 w-5 ml-auto text-win" />
                          )}
                          {showAnswer && selectedAnswer === index && index !== currentQuestion.correctAnswer && (
                            <XCircle className="h-5 w-5 ml-auto text-red-400" />
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
    </div>
  );
};

export default QuizGameplay;
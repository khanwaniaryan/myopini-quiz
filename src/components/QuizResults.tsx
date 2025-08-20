import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { QuizResults as QuizResultsType } from "./QuizGameplay";
import { Opponent } from "./Matchmaking";
import { Trophy, Medal, Zap, Clock, Target, Star, RotateCcw, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";

interface QuizResultsProps {
  results: QuizResultsType;
  opponent: Opponent;
  walletAddress: string;
  onPlayAgain: () => void;
  onViewLeaderboard: () => void;
}

const QuizResults = ({ results, opponent, walletAddress, onPlayAgain, onViewLeaderboard }: QuizResultsProps) => {
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (results.isWinner) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }
  }, [results.isWinner]);

  const playerCorrectAnswers = results.playerAnswers.filter(a => a.correct).length;
  const opponentCorrectAnswers = results.opponentAnswers.filter(a => a.correct).length;
  const averageResponseTime = results.averageResponseTime || results.playerAnswers.reduce((acc, a) => acc + a.timeSeconds, 0) / results.playerAnswers.length;
  const fastestAnswer = Math.min(...results.playerAnswers.map(a => a.timeSeconds));
  const maxStreak = Math.max(...results.playerAnswers.reduce((streaks, answer, index) => {
    if (answer.correct) {
      const lastStreak = streaks[streaks.length - 1] || 0;
      streaks[streaks.length - 1] = lastStreak + 1;
    } else {
      streaks.push(0);
    }
    return streaks;
  }, [] as number[]));

  return (
    <div className="min-h-screen bg-background">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-float" />
        <div className="absolute top-40 right-20 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "1s" }} />
        {results.isWinner && (
          <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-win/20 rounded-full blur-3xl animate-float" style={{ animationDelay: "2s" }} />
        )}
      </div>

      {/* Confetti */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {Array.from({ length: 50 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-win rounded-full animate-confetti"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${3 + Math.random() * 2}s`
              }}
            />
          ))}
        </div>
      )}

      <div className="relative z-10 container mx-auto px-6 py-12">
        {/* Winner Banner */}
        <div className="text-center mb-12">
          <div className={`text-8xl mb-4 ${results.isWinner ? 'animate-bounce' : ''}`}>
            {results.isWinner ? '🏆' : '🥈'}
          </div>
          <h1 className={`text-5xl font-heading font-bold mb-4 ${
            results.isWinner 
              ? 'text-win animate-glow' 
              : 'text-muted'
          }`}>
            {results.isWinner ? 'Victory!' : 'Good Fight!'}
          </h1>
          <p className="text-xl text-muted">
            {results.isWinner 
              ? `You defeated ${opponent.name}!` 
              : `${opponent.name} won this round`
            }
          </p>
        </div>

        {/* Score Comparison */}
        <Card className="bg-card border-card-border mb-8 max-w-4xl mx-auto">
          <CardContent className="p-8">
            <div className="grid md:grid-cols-3 gap-8 items-center">
              {/* Player */}
              <div className={`text-center ${results.isWinner ? 'order-2' : 'order-1'}`}>
                <Avatar className="w-20 h-20 mx-auto mb-4">
                  <AvatarFallback className="bg-primary text-white text-xl">
                    YOU
                  </AvatarFallback>
                </Avatar>
                <div className="font-mono text-sm text-muted mb-2">
                  {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                </div>
                <div className="text-sm font-semibold text-foreground mb-4">You</div>
                <div className={`text-6xl font-score font-bold mb-2 ${
                  results.isWinner ? 'text-win' : 'text-muted'
                }`}>
                  {results.playerScore}
                </div>
                <div className="text-sm text-muted">
                  {playerCorrectAnswers}/{results.totalQuestions} correct
                </div>
              </div>

              {/* VS */}
              <div className={`text-center ${results.isWinner ? 'order-1' : 'order-2'}`}>
                <div className="text-2xl font-heading font-bold text-muted mb-4">VS</div>
                {results.isWinner && (
                  <Trophy className="w-12 h-12 text-win mx-auto animate-pulse" />
                )}
              </div>

              {/* Opponent */}
              <div className={`text-center ${results.isWinner ? 'order-3' : 'order-1'}`}>
                <Avatar className="w-20 h-20 mx-auto mb-4">
                  <AvatarFallback className="bg-accent text-white text-xl">
                    {opponent.name.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="text-sm font-semibold text-foreground mb-2">{opponent.name}</div>
                {opponent.isBot && (
                  <Badge variant="outline" className="text-xs mb-4">BOT</Badge>
                )}
                <div className={`text-6xl font-score font-bold mb-2 ${
                  !results.isWinner ? 'text-win' : 'text-muted'
                }`}>
                  {results.opponentScore}
                </div>
                <div className="text-sm text-muted">
                  {opponentCorrectAnswers}/{results.totalQuestions} correct
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid md:grid-cols-5 gap-6 mb-8 max-w-5xl mx-auto">
          <Card className="bg-card border-card-border">
            <CardContent className="p-6 text-center">
              <Target className="w-8 h-8 text-primary mx-auto mb-3" />
              <div className="text-2xl font-score font-bold text-foreground mb-1">
                {((playerCorrectAnswers / results.totalQuestions) * 100).toFixed(0)}%
              </div>
              <div className="text-sm text-muted">Accuracy</div>
            </CardContent>
          </Card>

          <Card className="bg-card border-card-border">
            <CardContent className="p-6 text-center">
              <Clock className="w-8 h-8 text-accent mx-auto mb-3" />
              <div className="text-2xl font-score font-bold text-foreground mb-1">
                {averageResponseTime.toFixed(1)}s
              </div>
              <div className="text-sm text-muted">Avg. Time</div>
            </CardContent>
          </Card>

          <Card className="bg-card border-card-border">
            <CardContent className="p-6 text-center">
              <Zap className="w-8 h-8 text-win mx-auto mb-3" />
              <div className="text-2xl font-score font-bold text-foreground mb-1">
                {fastestAnswer.toFixed(1)}s
              </div>
              <div className="text-sm text-muted">Fastest</div>
            </CardContent>
          </Card>

          <Card className="bg-card border-card-border">
            <CardContent className="p-6 text-center">
              <TrendingUp className="w-8 h-8 text-win mx-auto mb-3" />
              <div className="text-2xl font-score font-bold text-foreground mb-1">
                x{maxStreak}
              </div>
              <div className="text-sm text-muted">Max Streak</div>
            </CardContent>
          </Card>

          <Card className="bg-card border-card-border">
            <CardContent className="p-6 text-center">
              <Star className="w-8 h-8 text-primary mx-auto mb-3" />
              <div className="text-2xl font-score font-bold text-foreground mb-1">
                +{results.isWinner ? 50 : 20}
              </div>
              <div className="text-sm text-muted">XP Earned</div>
            </CardContent>
          </Card>
        </div>

        {/* Rank Delta Preview */}
        <Card className="bg-card border-card-border mb-8 max-w-md mx-auto">
          <CardContent className="p-6 text-center">
            <h3 className="font-heading font-bold text-foreground mb-3 flex items-center justify-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Rank Change
            </h3>
            <div className="flex items-center justify-center gap-4">
              <div className="text-center">
                <div className="text-2xl font-score font-bold text-win">+12</div>
                <div className="text-xs text-muted">Rank Points</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-score font-bold text-accent">#1,247</div>
                <div className="text-xs text-muted">New Rank</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Question by Question */}
        <Card className="bg-card border-card-border mb-8 max-w-4xl mx-auto">
          <CardContent className="p-6">
            <h3 className="text-lg font-heading font-bold text-foreground mb-4 flex items-center gap-2">
              <Medal className="w-5 h-5" />
              Question Breakdown
            </h3>
            <div className="space-y-3">
              {results.playerAnswers.map((answer, index) => {
                const opponentAnswer = results.opponentAnswers[index];
                const playerFaster = answer.timeSeconds < (opponentAnswer?.timeSeconds || 0);
                const points = answer.correct ? Math.max(5, 15 - Math.floor(answer.timeSeconds)) : 0;
                const speedBonus = answer.correct && answer.timeSeconds < 3 ? Math.max(0, 5 - Math.floor(answer.timeSeconds)) : 0;
                
                return (
                  <div key={index} className="flex items-center justify-between p-3 bg-card/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center text-sm font-semibold">
                        {index + 1}
                      </div>
                      <div>
                        <div className={`text-sm font-semibold ${answer.correct ? 'text-win' : 'text-red-400'}`}>
                          {answer.correct ? 'Correct' : 'Incorrect'}
                        </div>
                        <div className="text-xs text-muted flex items-center gap-2">
                          {answer.timeSeconds.toFixed(1)}s
                          {playerFaster && answer.correct && (
                            <Zap className="h-3 w-3 text-win" />
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {answer.correct ? (
                        <div className="flex flex-col items-end gap-1">
                          <Badge variant="outline" className="text-win border-win/20 bg-win/10">
                            +{points}
                          </Badge>
                          {speedBonus > 0 && (
                            <Badge variant="outline" className="text-win border-win/20 bg-win/10 text-xs">
                              +{speedBonus} speed
                            </Badge>
                          )}
                        </div>
                      ) : (
                        <Badge variant="outline" className="text-red-400 border-red-400/20 bg-red-400/10">
                          +0
                        </Badge>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-md mx-auto">
          <Button 
            variant="hero" 
            size="xl" 
            onClick={onPlayAgain}
            className="w-full sm:w-auto"
          >
            <RotateCcw className="h-5 w-5 mr-2" />
            Play Again
          </Button>
          <Button 
            variant="outline" 
            size="xl" 
            onClick={onViewLeaderboard}
            className="w-full sm:w-auto"
          >
            <TrendingUp className="h-5 w-5 mr-2" />
            View Leaderboard
          </Button>
        </div>

        {/* Demo Rewards */}
        {results.isWinner && (
          <Card className="bg-win/5 border-win/20 mt-8 max-w-md mx-auto">
            <CardContent className="p-6 text-center">
              <Trophy className="w-8 h-8 text-win mx-auto mb-3" />
              <h3 className="font-heading font-bold text-win mb-2">Demo Rewards</h3>
              <p className="text-sm text-muted mb-3">
                In a real game, you would have earned:
              </p>
              <div className="flex justify-center gap-4">
                <Badge variant="outline" className="text-win border-win/20 bg-win/10">
                  +0.05 ETH
                </Badge>
                <Badge variant="outline" className="text-win border-win/20 bg-win/10">
                  +100 XP
                </Badge>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default QuizResults;
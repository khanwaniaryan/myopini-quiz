import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import WalletConnect from "@/components/WalletConnect";
import QuizSelection, { QuizConfig } from "@/components/QuizSelection";
import Matchmaking, { Opponent } from "@/components/Matchmaking";
import QuizGameplay, { QuizResults } from "@/components/QuizGameplay";
import QuizResultsComponent from "@/components/QuizResults";
import { Trophy, Zap, Users, Brain, Star, Award, BarChart3, User, History, Wallet } from "lucide-react";

type GameState = "landing" | "connecting" | "quiz-selection" | "matchmaking" | "quiz" | "results" | "leaderboard";

const Index = () => {
  const [gameState, setGameState] = useState<GameState>("landing");
  const [walletAddress, setWalletAddress] = useState<string>("");
  const [quizConfig, setQuizConfig] = useState<QuizConfig | null>(null);
  const [showWalletConnect, setShowWalletConnect] = useState(false);
  const [currentOpponent, setCurrentOpponent] = useState<Opponent | null>(null);
  const [quizResults, setQuizResults] = useState<QuizResults | null>(null);

  const handleWalletConnect = (address: string) => {
    setWalletAddress(address);
    setShowWalletConnect(false);
    // setGameState("quiz-selection");
  };

  const handleStartMatchmaking = (config: QuizConfig) => {
    setQuizConfig(config);
    setGameState("matchmaking");
  };

  const handleMatchFound = (opponent: Opponent) => {
    setCurrentOpponent(opponent);
    setGameState("quiz");
  };

  const handleCancelSearch = () => {
    setGameState("quiz-selection");
  };

  const handleQuizComplete = (results: QuizResults) => {
    setQuizResults(results);
    setGameState("results");
  };

  const handlePlayAgain = () => {
    setQuizResults(null);
    setCurrentOpponent(null);
    setGameState("quiz-selection");
  };

  const handleViewLeaderboard = () => {
    setGameState("leaderboard");
  };

  if (gameState === "quiz-selection" && walletAddress) {
    return (
      <QuizSelection 
        walletAddress={walletAddress}
        onStartMatchmaking={handleStartMatchmaking}
      />
    );
  }

  if (gameState === "matchmaking" && quizConfig) {
    return (
      <Matchmaking 
        config={quizConfig}
        onMatchFound={handleMatchFound}
        onCancel={handleCancelSearch}
      />
    );
  }

  if (gameState === "quiz" && quizConfig && currentOpponent) {
    return (
      <QuizGameplay 
        config={quizConfig}
        opponent={currentOpponent}
        walletAddress={walletAddress}
        onQuizComplete={handleQuizComplete}
      />
    );
  }

  if (gameState === "results" && quizResults && currentOpponent) {
    return (
      <QuizResultsComponent 
        results={quizResults}
        opponent={currentOpponent}
        walletAddress={walletAddress}
        onPlayAgain={handlePlayAgain}
        onViewLeaderboard={handleViewLeaderboard}
      />
    );
  }

  if (gameState === "leaderboard") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-96 bg-card border-card-border">
          <CardContent className="p-8 text-center">
            <Trophy className="w-16 h-16 text-primary mx-auto mb-4" />
            <h2 className="text-2xl font-heading font-bold text-foreground mb-4">
              Leaderboard
            </h2>
            <p className="text-muted mb-6">
              Coming soon! This would show the top players and rankings.
            </p>
            <Button onClick={() => setGameState("landing")}>
              Back to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Landing Page
  return (
    <div className="min-h-screen bg-background">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-float" />
        <div className="absolute top-40 right-20 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "1s" }} />
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-win/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "2s" }} />
      </div>

      <div className="relative z-10 container mx-auto px-6 py-12">
        {/* Header */}
        <header className="flex justify-between items-center mb-16">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
              <Brain className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-xl font-heading font-bold text-foreground">CryptoQuiz</h2>
          </div>
          
          <div className="flex items-center gap-4">
            <nav className="hidden md:flex items-center gap-4">
              <Link to="/leaderboard">
                <Button variant="ghost" size="sm" className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  Leaderboard
                </Button>
              </Link>
              <Link to="/history">
                <Button variant="ghost" size="sm" className="flex items-center gap-2">
                  <History className="h-4 w-4" />
                  History
                </Button>
              </Link>
              <Link to="/profile">
                <Button variant="ghost" size="sm" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Profile
                </Button>
              </Link>
            </nav>
            
            {walletAddress ? (
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs px-3 py-1">
                  <span className="w-2 h-2 bg-win rounded-full mr-2 animate-pulse" />
                  {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                </Badge>
              </div>
            ) : 
            (
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setShowWalletConnect(true)}
                  className="flex items-center gap-2"
                >
                  <Wallet className="h-4 w-4" />
                  Connect Wallet
                </Button>
                <Badge variant="outline" className="text-xs px-3 py-1">
                  <span className="w-2 h-2 bg-win rounded-full mr-2 animate-pulse" />
                  DEMO MODE
                </Badge>
              </div>
            )
            }
          </div>
        </header>

        {/* Hero Section */}
        <div className="text-center space-y-8 mb-16">
          <div className="space-y-4">
            <h1 className="text-6xl md:text-8xl font-heading font-bold bg-gradient-primary bg-clip-text text-transparent animate-slide-up">
              1v1 Quiz Battles
            </h1>
            <h2 className="text-2xl md:text-3xl font-heading font-semibold text-accent animate-slide-up" style={{ animationDelay: "0.1s" }}>
              Win the Crown
            </h2>
            <p className="text-lg text-muted max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: "0.2s" }}>
              Challenge opponents in real-time knowledge battles. Test your skills, climb the leaderboard, and earn crypto rewards in our gamified quiz platform.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-slide-up" style={{ animationDelay: "0.3s" }}>
            {!walletAddress ? (
              <Button 
                variant="hero" 
                size="xl" 
                onClick={() => setShowWalletConnect(true)}
                className="min-w-64"
              >
                <Zap className="h-5 w-5 mr-2" />
                Connect Wallet (Demo)
              </Button>
            ) : (
              <Button 
                variant="hero" 
                size="xl" 
                onClick={() => setGameState("quiz-selection")}
                className="min-w-64"
              >
                <Zap className="h-5 w-5 mr-2" />
                Start Playing
              </Button>
            )}
            <Link to="/leaderboard">
              <Button variant="outline" size="xl" className="min-w-48">
                <Trophy className="h-5 w-5 mr-2" />
                Explore Leaderboard
              </Button>
            </Link>
          </div>
        </div>

        {/* Quick Access */}
        <div className="text-center mb-16">
          <h3 className="text-xl font-heading font-semibold text-foreground mb-6">
            Explore the Platform
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <Link to="/leaderboard">
              <Card className="bg-card border-card-border hover:border-primary/50 transition-all duration-300 hover:scale-105 cursor-pointer h-full">
                <CardContent className="p-6 text-center">
                  <BarChart3 className="h-8 w-8 text-primary mx-auto mb-3" />
                  <h4 className="font-semibold text-foreground mb-2">Leaderboard</h4>
                  <p className="text-sm text-muted">View global rankings and top players</p>
                </CardContent>
              </Card>
            </Link>
            
            <Link to="/history">
              <Card className="bg-card border-card-border hover:border-primary/50 transition-all duration-300 hover:scale-105 cursor-pointer h-full">
                <CardContent className="p-6 text-center">
                  <History className="h-8 w-8 text-accent mx-auto mb-3" />
                  <h4 className="font-semibold text-foreground mb-2">Match History</h4>
                  <p className="text-sm text-muted">Review your past battles and performance</p>
                </CardContent>
              </Card>
            </Link>
            
            <Link to="/profile">
              <Card className="bg-card border-card-border hover:border-primary/50 transition-all duration-300 hover:scale-105 cursor-pointer h-full">
                <CardContent className="p-6 text-center">
                  <User className="h-8 w-8 text-win mx-auto mb-3" />
                  <h4 className="font-semibold text-foreground mb-2">Profile</h4>
                  <p className="text-sm text-muted">Check your stats, achievements, and settings</p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>

        {/* How It Works */}
        <div className="text-center mb-16">
          <h3 className="text-2xl font-heading font-bold text-foreground mb-8">
            How 1v1 Battles Work
          </h3>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <Card className="bg-card border-card-border shadow-card hover:shadow-glow transition-all duration-300 hover:scale-105">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <h4 className="text-lg font-heading font-semibold text-card-foreground mb-2">
                  1. Get Matched
                </h4>
                <p className="text-sm text-muted">
                  Choose your category and difficulty, then get matched with an opponent of similar skill level.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card border-card-border shadow-card hover:shadow-glow transition-all duration-300 hover:scale-105">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <Brain className="h-8 w-8 text-white" />
                </div>
                <h4 className="text-lg font-heading font-semibold text-card-foreground mb-2">
                  2. Battle Live
                </h4>
                <p className="text-sm text-muted">
                  Answer questions simultaneously. Speed and accuracy both matter for maximum points.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card border-card-border shadow-card hover:shadow-glow transition-all duration-300 hover:scale-105">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-gradient-win rounded-full flex items-center justify-center mx-auto mb-4">
                  <Trophy className="h-8 w-8 text-white" />
                </div>
                <h4 className="text-lg font-heading font-semibold text-card-foreground mb-2">
                  3. Claim Victory
                </h4>
                <p className="text-sm text-muted">
                  Win matches to earn points, climb leaderboards, and unlock exclusive rewards.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mb-16">
          <div className="text-center">
            <div className="text-3xl font-score font-bold text-accent mb-1">12.4K</div>
            <div className="text-sm text-muted">Active Players</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-score font-bold text-win mb-1">89.2K</div>
            <div className="text-sm text-muted">Battles Fought</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-score font-bold text-primary mb-1">$24.7K</div>
            <div className="text-sm text-muted">Rewards Paid</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-score font-bold text-accent mb-1">156</div>
            <div className="text-sm text-muted">Categories</div>
          </div>
        </div>

        {/* Recent Winners */}
        <div className="text-center">
          <h3 className="text-xl font-heading font-bold text-foreground mb-6">
            🏆 Recent Champions
          </h3>
          <div className="flex flex-wrap justify-center gap-4 max-w-2xl mx-auto">
            {[
              { name: "CryptoKing", reward: "0.5 ETH", streak: "7" },
              { name: "QuizMaster", reward: "0.3 ETH", streak: "12" },
              { name: "BlockNinja", reward: "0.8 ETH", streak: "5" },
            ].map((winner, index) => (
              <Badge 
                key={index}
                variant="outline" 
                className="px-4 py-2 bg-card/50 border-card-border hover:border-win/50 transition-colors"
              >
                <Star className="h-3 w-3 mr-1 text-win" />
                {winner.name} won {winner.reward}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      {/* Wallet Connect Modal */}
      {showWalletConnect && (
        <WalletConnect onConnect={handleWalletConnect} />
      )}
    </div>
  );
};

export default Index;

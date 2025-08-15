import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { QuizConfig } from "./QuizSelection";
import { Users, Zap, Trophy, Clock, Bot } from "lucide-react";

interface MatchmakingProps {
  config: QuizConfig;
  onMatchFound: (opponent: Opponent) => void;
  onCancel: () => void;
}

export interface Opponent {
  id: string;
  name: string;
  avatar: string;
  address: string;
  winStreak: number;
  isBot: boolean;
  rating: number;
}

const generateOpponent = (isBot: boolean = false): Opponent => {
  const botNames = ["CryptoBot", "QuizMaster", "BrainAI", "ChainGenius", "TokenTrader"];
  const playerNames = ["Player_842", "CryptoKing", "QuizNinja", "BlockMaster", "TokenHawk"];
  
  const names = isBot ? botNames : playerNames;
  const name = names[Math.floor(Math.random() * names.length)];
  
  const generateAddress = () => {
    const prefix = "0x";
    const chars = "0123456789abcdef";
    let address = prefix;
    for (let i = 0; i < 40; i++) {
      address += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return address;
  };

  return {
    id: Math.random().toString(36).substr(2, 9),
    name,
    avatar: name.charAt(0).toUpperCase(),
    address: generateAddress(),
    winStreak: Math.floor(Math.random() * 12) + 1,
    isBot,
    rating: Math.floor(Math.random() * 500) + 1200,
  };
};

const Matchmaking = ({ config, onMatchFound, onCancel }: MatchmakingProps) => {
  const [searchTime, setSearchTime] = useState(0);
  const [playerPool, setPlayerPool] = useState(128);
  const [recentWinners] = useState([
    "CryptoKing won 0.5 ETH",
    "QuizMaster beat BlockNinja",
    "TokenHawk on 7-win streak!",
  ]);
  const [matchFound, setMatchFound] = useState(false);
  const [opponent, setOpponent] = useState<Opponent | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setSearchTime(prev => prev + 1);
      setPlayerPool(prev => prev + Math.floor(Math.random() * 5) - 2);
    }, 1000);

    // Simulate matchmaking - 50% chance human, 50% bot
    const matchTimer = setTimeout(() => {
      const isBot = Math.random() > 0.5;
      const foundOpponent = generateOpponent(isBot);
      setOpponent(foundOpponent);
      setMatchFound(true);
      
      // Auto-start after showing opponent
      setTimeout(() => {
        onMatchFound(foundOpponent);
      }, 3000);
    }, Math.random() * 4000 + 2000); // 2-6 seconds

    return () => {
      clearInterval(timer);
      clearTimeout(matchTimer);
    };
  }, [onMatchFound]);

  if (matchFound && opponent) {
    return (
      <div className="min-h-screen bg-background p-6 flex items-center justify-center">
        <div className="w-full max-w-lg space-y-6">
          <div className="text-center space-y-2">
            <div className="text-6xl animate-bounce">⚡</div>
            <h1 className="text-3xl font-heading font-bold text-win">
              Opponent Found!
            </h1>
            <p className="text-muted">Preparing for battle...</p>
          </div>

          <Card className="bg-card border-card-border shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <Avatar className="h-16 w-16 border-2 border-primary">
                  <AvatarFallback className="bg-gradient-primary text-white font-bold text-xl">
                    {opponent.avatar}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-heading font-bold text-card-foreground">
                      {opponent.name}
                    </h3>
                    {opponent.isBot && (
                      <Badge variant="outline" className="text-xs">
                        <Bot className="h-3 w-3 mr-1" />
                        Bot
                      </Badge>
                    )}
                  </div>
                  
                  <p className="text-sm font-mono text-muted">
                    {opponent.address.slice(0, 6)}...{opponent.address.slice(-4)}
                  </p>
                  
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <Trophy className="h-4 w-4 text-win" />
                      <span className="text-muted">Streak: {opponent.winStreak}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Zap className="h-4 w-4 text-accent" />
                      <span className="text-muted">Rating: {opponent.rating}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-card/50 rounded-lg border border-card-border">
                <h4 className="font-medium text-card-foreground mb-2">Match Details</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Category:</span>
                    <p className="text-card-foreground font-medium">{config.category}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Difficulty:</span>
                    <p className="text-card-foreground font-medium">{config.difficulty}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Length:</span>
                    <p className="text-card-foreground font-medium">Best of {config.matchLength}</p>
                  </div>
                  {config.wager && (
                    <div>
                      <span className="text-muted-foreground">Stake:</span>
                      <p className="text-card-foreground font-medium">{config.stakeAmount} ETH</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-6 text-center">
                <div className="flex items-center justify-center gap-2 text-accent">
                  <Clock className="h-4 w-4 animate-spin" />
                  <span className="text-sm">Starting in 3 seconds...</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6 flex items-center justify-center">
      <div className="w-full max-w-lg space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="relative mb-4">
            <Users className="h-16 w-16 text-primary mx-auto animate-pulse" />
            <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping" />
          </div>
          <h1 className="text-3xl font-heading font-bold bg-gradient-primary bg-clip-text text-transparent">
            Finding Your Opponent
          </h1>
          <p className="text-muted">
            Searching for the perfect match...
          </p>
        </div>

        {/* Search Status */}
        <Card className="bg-card border-card-border shadow-card">
          <CardContent className="p-6 space-y-6">
            <div className="text-center space-y-2">
              <div className="flex justify-center space-x-1">
                <div className="w-3 h-3 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]" />
                <div className="w-3 h-3 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]" />
                <div className="w-3 h-3 bg-primary rounded-full animate-bounce" />
              </div>
              <p className="text-lg font-medium text-card-foreground">
                Searching for opponent...
              </p>
              <p className="text-sm text-muted">
                {Math.floor(searchTime / 60)}:{(searchTime % 60).toString().padStart(2, '0')}
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-card/50 rounded-lg">
                <span className="text-sm text-muted-foreground">Players online:</span>
                <span className="font-mono text-accent">{playerPool}</span>
              </div>
              
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-card-foreground">Recent Activity</h4>
                <div className="space-y-1">
                  {recentWinners.map((winner, index) => (
                    <div 
                      key={index}
                      className="text-xs text-muted-foreground p-2 bg-card/30 rounded animate-slide-up"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      🏆 {winner}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <Button variant="outline" onClick={onCancel} className="w-full">
              Cancel Search
            </Button>
          </CardContent>
        </Card>

        <div className="text-center">
          <p className="text-xs text-muted-foreground">
            Good things take seconds. We're finding you the perfect challenge.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Matchmaking;
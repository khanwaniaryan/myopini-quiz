import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Link } from "react-router-dom";
import { 
  ArrowLeft, 
  Trophy, 
  Medal, 
  Zap, 
  Clock, 
  Target, 
  TrendingUp, 
  Calendar,
  Filter,
  Search,
  BarChart3,
  Star,
  Crown,
  Flame
} from "lucide-react";

interface MatchHistory {
  id: string;
  date: string;
  opponent: {
    name: string;
    isBot: boolean;
  };
  category: string;
  difficulty: string;
  playerScore: number;
  opponentScore: number;
  isWinner: boolean;
  totalQuestions: number;
  playerCorrectAnswers: number;
  averageResponseTime: number;
  maxStreak: number;
  fastestAnswer: number;
  rankChange: number;
  xpEarned: number;
}

const History = () => {
  const [selectedFilter, setSelectedFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Mock data - in real app this would come from API/database
  const matchHistory: MatchHistory[] = [
    {
      id: "1",
      date: "2024-01-15",
      opponent: { name: "CryptoWhiz", isBot: false },
      category: "DeFi",
      difficulty: "hard",
      playerScore: 85,
      opponentScore: 72,
      isWinner: true,
      totalQuestions: 10,
      playerCorrectAnswers: 8,
      averageResponseTime: 2.3,
      maxStreak: 4,
      fastestAnswer: 0.8,
      rankChange: 12,
      xpEarned: 50
    },
    {
      id: "2",
      date: "2024-01-14",
      opponent: { name: "BlockchainBot", isBot: true },
      category: "Smart Contracts",
      difficulty: "medium",
      playerScore: 65,
      opponentScore: 78,
      isWinner: false,
      totalQuestions: 10,
      playerCorrectAnswers: 6,
      averageResponseTime: 3.1,
      maxStreak: 2,
      fastestAnswer: 1.2,
      rankChange: -8,
      xpEarned: 20
    },
    {
      id: "3",
      date: "2024-01-13",
      opponent: { name: "NFTMaster", isBot: false },
      category: "NFTs",
      difficulty: "easy",
      playerScore: 95,
      opponentScore: 68,
      isWinner: true,
      totalQuestions: 10,
      playerCorrectAnswers: 9,
      averageResponseTime: 1.8,
      maxStreak: 6,
      fastestAnswer: 0.6,
      rankChange: 15,
      xpEarned: 60
    },
    {
      id: "4",
      date: "2024-01-12",
      opponent: { name: "DeFiBot", isBot: true },
      category: "DeFi",
      difficulty: "medium",
      playerScore: 72,
      opponentScore: 65,
      isWinner: true,
      totalQuestions: 10,
      playerCorrectAnswers: 7,
      averageResponseTime: 2.7,
      maxStreak: 3,
      fastestAnswer: 1.0,
      rankChange: 8,
      xpEarned: 35
    },
    {
      id: "5",
      date: "2024-01-11",
      opponent: { name: "ChainLink", isBot: false },
      category: "Smart Contracts",
      difficulty: "hard",
      playerScore: 58,
      opponentScore: 82,
      isWinner: false,
      totalQuestions: 10,
      playerCorrectAnswers: 5,
      averageResponseTime: 4.2,
      maxStreak: 1,
      fastestAnswer: 1.8,
      rankChange: -12,
      xpEarned: 15
    }
  ];

  const filteredHistory = matchHistory.filter(match => {
    const matchesFilter = selectedFilter === "all" || 
      (selectedFilter === "wins" && match.isWinner) ||
      (selectedFilter === "losses" && !match.isWinner) ||
      (selectedFilter === "category" && match.category.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (selectedFilter === "opponent" && match.opponent.name.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return matchesFilter;
  });

  const stats = {
    totalMatches: matchHistory.length,
    wins: matchHistory.filter(m => m.isWinner).length,
    losses: matchHistory.filter(m => !m.isWinner).length,
    winRate: Math.round((matchHistory.filter(m => m.isWinner).length / matchHistory.length) * 100),
    averageScore: Math.round(matchHistory.reduce((sum, m) => sum + m.playerScore, 0) / matchHistory.length),
    totalXP: matchHistory.reduce((sum, m) => sum + m.xpEarned, 0),
    bestStreak: Math.max(...matchHistory.map(m => m.maxStreak)),
    fastestAnswer: Math.min(...matchHistory.map(m => m.fastestAnswer))
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-float" />
        <div className="absolute top-40 right-20 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "1s" }} />
      </div>

      <div className="relative z-10 container mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-heading font-bold text-foreground">Match History</h1>
              <p className="text-muted">Your competitive journey</p>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-card border-card-border">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-score font-bold text-win mb-1">{stats.wins}</div>
              <div className="text-xs text-muted">Wins</div>
            </CardContent>
          </Card>
          
          <Card className="bg-card border-card-border">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-score font-bold text-accent mb-1">{stats.losses}</div>
              <div className="text-xs text-muted">Losses</div>
            </CardContent>
          </Card>
          
          <Card className="bg-card border-card-border">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-score font-bold text-primary mb-1">{stats.winRate}%</div>
              <div className="text-xs text-muted">Win Rate</div>
            </CardContent>
          </Card>
          
          <Card className="bg-card border-card-border">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-score font-bold text-win mb-1">{stats.totalXP}</div>
              <div className="text-xs text-muted">Total XP</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex gap-2">
            <Button
              variant={selectedFilter === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedFilter("all")}
            >
              All
            </Button>
            <Button
              variant={selectedFilter === "wins" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedFilter("wins")}
            >
              <Trophy className="h-4 w-4 mr-1" />
              Wins
            </Button>
            <Button
              variant={selectedFilter === "losses" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedFilter("losses")}
            >
              <Medal className="h-4 w-4 mr-1" />
              Losses
            </Button>
          </div>
          
          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted" />
              <input
                type="text"
                placeholder="Search opponents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 bg-card border border-card-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
        </div>

        {/* Match History List */}
        <div className="space-y-4">
          {filteredHistory.map((match) => (
            <Card key={match.id} className="bg-card border-card-border hover:border-primary/50 transition-colors">
              <CardContent className="p-6">
                {/* Desktop Layout */}
                <div className="hidden lg:flex items-center justify-between">
                  {/* Match Info */}
                  <div className="flex items-center gap-4 flex-1">
                    <div className="text-center">
                      <div className={`text-2xl ${match.isWinner ? 'animate-bounce' : ''}`}>
                        {match.isWinner ? '🏆' : '🥈'}
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-foreground">
                          vs {match.opponent.name}
                        </h3>
                        {match.opponent.isBot && (
                          <Badge variant="outline" className="text-xs">BOT</Badge>
                        )}
                        <Badge variant="outline" className="text-xs">
                          {match.category} • {match.difficulty}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted">
                        {formatDate(match.date)} • {match.totalQuestions} questions
                      </div>
                    </div>
                  </div>

                  {/* Score */}
                  <div className="text-center min-w-[120px]">
                    <div className="text-2xl font-score font-bold text-foreground mb-1">
                      {match.playerScore} - {match.opponentScore}
                    </div>
                    <div className={`text-sm font-medium ${match.isWinner ? 'text-win' : 'text-muted'}`}>
                      {match.isWinner ? 'Victory' : 'Defeat'}
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-6 min-w-[300px] justify-center">
                    <div className="text-center">
                      <div className="flex items-center gap-1 text-sm">
                        <Target className="h-3 w-3" />
                        <span>{match.playerCorrectAnswers}/{match.totalQuestions}</span>
                      </div>
                      <div className="text-xs text-muted">Correct</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="flex items-center gap-1 text-sm">
                        <Clock className="h-3 w-3" />
                        <span>{match.averageResponseTime.toFixed(1)}s</span>
                      </div>
                      <div className="text-xs text-muted">Avg Time</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="flex items-center gap-1 text-sm">
                        <Flame className="h-3 w-3" />
                        <span>x{match.maxStreak}</span>
                      </div>
                      <div className="text-xs text-muted">Streak</div>
                    </div>
                  </div>

                  {/* Rank Change */}
                  <div className="text-center min-w-[80px]">
                    <div className={`text-sm font-bold ${match.rankChange > 0 ? 'text-win' : 'text-accent'}`}>
                      {match.rankChange > 0 ? '+' : ''}{match.rankChange}
                    </div>
                    <div className="text-xs text-muted">Rank</div>
                  </div>
                </div>

                {/* Tablet Layout */}
                <div className="hidden md:flex lg:hidden flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`text-2xl ${match.isWinner ? 'animate-bounce' : ''}`}>
                        {match.isWinner ? '🏆' : '🥈'}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-foreground">
                            vs {match.opponent.name}
                          </h3>
                          {match.opponent.isBot && (
                            <Badge variant="outline" className="text-xs">BOT</Badge>
                          )}
                        </div>
                        <div className="text-sm text-muted">
                          {match.category} • {match.difficulty} • {formatDate(match.date)}
                        </div>
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-score font-bold text-foreground mb-1">
                        {match.playerScore} - {match.opponentScore}
                      </div>
                      <div className={`text-sm font-medium ${match.isWinner ? 'text-win' : 'text-muted'}`}>
                        {match.isWinner ? 'Victory' : 'Defeat'}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <div className="flex items-center gap-1 text-sm">
                          <Target className="h-3 w-3" />
                          <span>{match.playerCorrectAnswers}/{match.totalQuestions}</span>
                        </div>
                        <div className="text-xs text-muted">Correct</div>
                      </div>
                      
                      <div className="text-center">
                        <div className="flex items-center gap-1 text-sm">
                          <Clock className="h-3 w-3" />
                          <span>{match.averageResponseTime.toFixed(1)}s</span>
                        </div>
                        <div className="text-xs text-muted">Avg Time</div>
                      </div>
                      
                      <div className="text-center">
                        <div className="flex items-center gap-1 text-sm">
                          <Flame className="h-3 w-3" />
                          <span>x{match.maxStreak}</span>
                        </div>
                        <div className="text-xs text-muted">Streak</div>
                      </div>
                    </div>
                    
                    <div className="text-center">
                      <div className={`text-sm font-bold ${match.rankChange > 0 ? 'text-win' : 'text-accent'}`}>
                        {match.rankChange > 0 ? '+' : ''}{match.rankChange}
                      </div>
                      <div className="text-xs text-muted">Rank</div>
                    </div>
                  </div>
                </div>

                {/* Mobile Layout */}
                <div className="md:hidden space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`text-xl ${match.isWinner ? 'animate-bounce' : ''}`}>
                        {match.isWinner ? '🏆' : '🥈'}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-foreground text-sm">
                            vs {match.opponent.name}
                          </h3>
                          {match.opponent.isBot && (
                            <Badge variant="outline" className="text-xs">BOT</Badge>
                          )}
                        </div>
                        <div className="text-xs text-muted">
                          {match.category} • {match.difficulty}
                        </div>
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-score font-bold text-foreground mb-1">
                        {match.playerScore} - {match.opponentScore}
                      </div>
                      <div className={`text-xs font-medium ${match.isWinner ? 'text-win' : 'text-muted'}`}>
                        {match.isWinner ? 'Victory' : 'Defeat'}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs text-muted">
                    <span>{formatDate(match.date)} • {match.totalQuestions} questions</span>
                    <div className={`text-xs font-bold ${match.rankChange > 0 ? 'text-win' : 'text-accent'}`}>
                      {match.rankChange > 0 ? '+' : ''}{match.rankChange} Rank
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 pt-3 border-t border-card-border">
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 text-sm">
                        <Target className="h-3 w-3" />
                        <span>{match.playerCorrectAnswers}/{match.totalQuestions}</span>
                      </div>
                      <div className="text-xs text-muted">Correct</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 text-sm">
                        <Clock className="h-3 w-3" />
                        <span>{match.averageResponseTime.toFixed(1)}s</span>
                      </div>
                      <div className="text-xs text-muted">Avg Time</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 text-sm">
                        <Flame className="h-3 w-3" />
                        <span>x{match.maxStreak}</span>
                      </div>
                      <div className="text-xs text-muted">Streak</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredHistory.length === 0 && (
          <Card className="bg-card border-card-border">
            <CardContent className="p-12 text-center">
              <BarChart3 className="h-12 w-12 text-muted mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No matches found</h3>
              <p className="text-muted">Try adjusting your filters or start playing to build your history!</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default History;

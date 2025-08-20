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
  Crown,
  TrendingUp,
  TrendingDown,
  Star,
  Flame,
  Target,
  Clock,
  Zap,
  Filter,
  Search,
  Award,
  Users,
  BarChart3
} from "lucide-react";

interface LeaderboardEntry {
  rank: number;
  previousRank: number;
  username: string;
  walletAddress: string;
  score: number;
  totalMatches: number;
  winRate: number;
  bestStreak: number;
  fastestAnswer: number;
  totalXP: number;
  category: string;
  isOnline: boolean;
  lastActive: string;
}

const Leaderboard = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedTimeframe, setSelectedTimeframe] = useState<string>("all-time");
  const [searchTerm, setSearchTerm] = useState("");

  // Mock data - in real app this would come from API/database
  const leaderboardData: LeaderboardEntry[] = [
    {
      rank: 1,
      previousRank: 1,
      username: "CryptoWhiz",
      walletAddress: "0x1234...5678",
      score: 2847,
      totalMatches: 156,
      winRate: 89,
      bestStreak: 12,
      fastestAnswer: 0.4,
      totalXP: 28470,
      category: "DeFi",
      isOnline: true,
      lastActive: "2 min ago"
    },
    {
      rank: 2,
      previousRank: 3,
      username: "BlockchainMaster",
      walletAddress: "0x8765...4321",
      score: 2712,
      totalMatches: 142,
      winRate: 85,
      bestStreak: 10,
      fastestAnswer: 0.5,
      totalXP: 27120,
      category: "Smart Contracts",
      isOnline: false,
      lastActive: "1 hour ago"
    },
    {
      rank: 3,
      previousRank: 2,
      username: "NFTKing",
      walletAddress: "0x9876...5432",
      score: 2654,
      totalMatches: 134,
      winRate: 82,
      bestStreak: 8,
      fastestAnswer: 0.6,
      totalXP: 26540,
      category: "NFTs",
      isOnline: true,
      lastActive: "5 min ago"
    },
    {
      rank: 4,
      previousRank: 4,
      username: "DeFiQueen",
      walletAddress: "0x5432...9876",
      score: 2518,
      totalMatches: 128,
      winRate: 78,
      bestStreak: 9,
      fastestAnswer: 0.7,
      totalXP: 25180,
      category: "DeFi",
      isOnline: true,
      lastActive: "15 min ago"
    },
    {
      rank: 5,
      previousRank: 6,
      username: "ChainLink",
      walletAddress: "0x3456...7890",
      score: 2432,
      totalMatches: 145,
      winRate: 76,
      bestStreak: 7,
      fastestAnswer: 0.8,
      totalXP: 24320,
      category: "Smart Contracts",
      isOnline: false,
      lastActive: "3 hours ago"
    },
    {
      rank: 6,
      previousRank: 5,
      username: "TokenTrader",
      walletAddress: "0x7890...3456",
      score: 2387,
      totalMatches: 167,
      winRate: 74,
      bestStreak: 6,
      fastestAnswer: 0.9,
      totalXP: 23870,
      category: "DeFi",
      isOnline: true,
      lastActive: "1 min ago"
    },
    {
      rank: 7,
      previousRank: 8,
      username: "SmartContractor",
      walletAddress: "0x2345...6789",
      score: 2254,
      totalMatches: 123,
      winRate: 71,
      bestStreak: 5,
      fastestAnswer: 1.0,
      totalXP: 22540,
      category: "Smart Contracts",
      isOnline: false,
      lastActive: "2 hours ago"
    },
    {
      rank: 8,
      previousRank: 7,
      username: "NFTCollector",
      walletAddress: "0x6789...2345",
      score: 2187,
      totalMatches: 156,
      winRate: 68,
      bestStreak: 4,
      fastestAnswer: 1.1,
      totalXP: 21870,
      category: "NFTs",
      isOnline: true,
      lastActive: "30 min ago"
    },
    {
      rank: 9,
      previousRank: 10,
      username: "CryptoNewbie",
      walletAddress: "0x4567...8901",
      score: 2103,
      totalMatches: 89,
      winRate: 65,
      bestStreak: 3,
      fastestAnswer: 1.2,
      totalXP: 21030,
      category: "DeFi",
      isOnline: true,
      lastActive: "10 min ago"
    },
    {
      rank: 10,
      previousRank: 9,
      username: "BlockchainBot",
      walletAddress: "0x8901...4567",
      score: 2045,
      totalMatches: 234,
      winRate: 62,
      bestStreak: 2,
      fastestAnswer: 1.3,
      totalXP: 20450,
      category: "Smart Contracts",
      isOnline: false,
      lastActive: "1 day ago"
    }
  ];

  const filteredLeaderboard = leaderboardData.filter(entry => {
    const matchesCategory = selectedCategory === "all" || entry.category === selectedCategory;
    const matchesSearch = entry.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entry.walletAddress.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Crown className="h-5 w-5 text-yellow-400" />;
      case 2: return <Medal className="h-5 w-5 text-gray-300" />;
      case 3: return <Trophy className="h-5 w-5 text-orange-400" />;
      default: return null;
    }
  };

  const getRankChange = (currentRank: number, previousRank: number) => {
    if (currentRank < previousRank) {
      return <TrendingUp className="h-4 w-4 text-win" />;
    } else if (currentRank > previousRank) {
      return <TrendingDown className="h-4 w-4 text-accent" />;
    }
    return null;
  };

  const categories = ["all", "DeFi", "Smart Contracts", "NFTs"];

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
              <h1 className="text-3xl font-heading font-bold text-foreground">Leaderboard</h1>
              <p className="text-muted">Global crypto quiz rankings</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-muted" />
            <span className="text-sm text-muted">{leaderboardData.length} players</span>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex gap-2">
            {categories.map(category => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
              >
                {category === "all" ? "All Categories" : category}
              </Button>
            ))}
          </div>
          
          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted" />
              <input
                type="text"
                placeholder="Search players..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 bg-card border border-card-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
        </div>

        {/* Top 3 Podium */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {filteredLeaderboard.slice(0, 3).map((entry, index) => (
            <Card key={entry.rank} className={`bg-card border-card-border ${index === 0 ? 'border-yellow-400/50' : ''}`}>
              <CardContent className="p-6 text-center">
                <div className="flex justify-center mb-4">
                  {getRankIcon(entry.rank)}
                </div>
                
                <Avatar className="w-16 h-16 mx-auto mb-4">
                  <AvatarFallback className="bg-primary text-white text-lg">
                    {entry.username.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                
                <h3 className="font-semibold text-foreground mb-1">{entry.username}</h3>
                <div className="text-xs text-muted mb-3">{entry.walletAddress}</div>
                
                <div className="text-3xl font-score font-bold text-foreground mb-2">
                  #{entry.rank}
                </div>
                
                <div className="text-2xl font-score font-bold text-win mb-2">
                  {entry.score.toLocaleString()}
                </div>
                
                <div className="flex items-center justify-center gap-4 text-xs text-muted">
                  <div>
                    <div className="font-medium">{entry.winRate}%</div>
                    <div>Win Rate</div>
                  </div>
                  <div>
                    <div className="font-medium">{entry.totalMatches}</div>
                    <div>Matches</div>
                  </div>
                </div>
                
                {entry.isOnline && (
                  <div className="mt-3 flex items-center justify-center gap-1 text-xs text-win">
                    <div className="w-2 h-2 bg-win rounded-full animate-pulse"></div>
                    Online
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Leaderboard Table */}
        <Card className="bg-card border-card-border">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-card-border">
                    <th className="text-left p-4 text-sm font-medium text-muted">Rank</th>
                    <th className="text-left p-4 text-sm font-medium text-muted">Player</th>
                    <th className="text-center p-4 text-sm font-medium text-muted">Score</th>
                    <th className="text-center p-4 text-sm font-medium text-muted">Win Rate</th>
                    <th className="text-center p-4 text-sm font-medium text-muted">Best Streak</th>
                    <th className="text-center p-4 text-sm font-medium text-muted">Fastest</th>
                    <th className="text-center p-4 text-sm font-medium text-muted">XP</th>
                    <th className="text-center p-4 text-sm font-medium text-muted">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLeaderboard.slice(3).map((entry) => (
                    <tr key={entry.rank} className="border-b border-card-border/50 hover:bg-card/50 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-foreground">#{entry.rank}</span>
                          {getRankChange(entry.rank, entry.previousRank)}
                        </div>
                      </td>
                      
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="w-8 h-8">
                            <AvatarFallback className="bg-primary text-white text-xs">
                              {entry.username.slice(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium text-foreground">{entry.username}</div>
                            <div className="text-xs text-muted">{entry.walletAddress}</div>
                          </div>
                        </div>
                      </td>
                      
                      <td className="p-4 text-center">
                        <div className="text-lg font-score font-bold text-foreground">
                          {entry.score.toLocaleString()}
                        </div>
                      </td>
                      
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <Target className="h-3 w-3" />
                          <span className="text-sm">{entry.winRate}%</span>
                        </div>
                      </td>
                      
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <Flame className="h-3 w-3" />
                          <span className="text-sm">x{entry.bestStreak}</span>
                        </div>
                      </td>
                      
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <Zap className="h-3 w-3" />
                          <span className="text-sm">{entry.fastestAnswer}s</span>
                        </div>
                      </td>
                      
                      <td className="p-4 text-center">
                        <div className="text-sm font-medium text-win">
                          {entry.totalXP.toLocaleString()}
                        </div>
                      </td>
                      
                      <td className="p-4 text-center">
                        {entry.isOnline ? (
                          <div className="flex items-center justify-center gap-1 text-xs text-win">
                            <div className="w-2 h-2 bg-win rounded-full animate-pulse"></div>
                            Online
                          </div>
                        ) : (
                          <div className="text-xs text-muted">
                            {entry.lastActive}
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {filteredLeaderboard.length === 0 && (
          <Card className="bg-card border-card-border">
            <CardContent className="p-12 text-center">
              <BarChart3 className="h-12 w-12 text-muted mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No players found</h3>
              <p className="text-muted">Try adjusting your filters or search terms!</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;

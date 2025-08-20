import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Link } from "react-router-dom";
import { 
  ArrowLeft, 
  Trophy, 
  Medal, 
  Crown,
  TrendingUp,
  Star,
  Flame,
  Target,
  Clock,
  Zap,
  Settings,
  Edit,
  Award,
  Users,
  BarChart3,
  Calendar,
  Wallet,
  Shield,
  Volume2,
  VolumeX,
  Moon,
  Sun,
  Bell,
  BellOff,
  Eye,
  EyeOff,
  Copy,
  ExternalLink,
  LogOut,
  User,
  Activity,
  TrendingDown
} from "lucide-react";

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  unlocked: boolean;
  unlockedDate?: string;
  progress?: number;
  maxProgress?: number;
}

interface CategoryStats {
  category: string;
  matches: number;
  wins: number;
  winRate: number;
  averageScore: number;
  bestStreak: number;
  fastestAnswer: number;
}

const Profile = () => {
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [showSettings, setShowSettings] = useState(false);

  // Mock user data
  const userProfile = {
    username: "CryptoWhiz",
    walletAddress: "0x1234567890abcdef1234567890abcdef12345678",
    rank: 15,
    previousRank: 18,
    totalScore: 2847,
    totalXP: 28470,
    level: 42,
    xpToNextLevel: 530,
    totalMatches: 156,
    wins: 134,
    losses: 22,
    winRate: 85.9,
    averageResponseTime: 2.3,
    fastestAnswer: 0.8,
    bestStreak: 12,
    joinDate: "2023-06-15",
    lastActive: "2 minutes ago",
    isOnline: true
  };

  const categoryStats: CategoryStats[] = [
    {
      category: "DeFi",
      matches: 67,
      wins: 58,
      winRate: 86.6,
      averageScore: 78.2,
      bestStreak: 8,
      fastestAnswer: 0.6
    },
    {
      category: "Smart Contracts",
      matches: 54,
      wins: 45,
      winRate: 83.3,
      averageScore: 75.8,
      bestStreak: 6,
      fastestAnswer: 0.9
    },
    {
      category: "NFTs",
      matches: 35,
      wins: 31,
      winRate: 88.6,
      averageScore: 82.1,
      bestStreak: 12,
      fastestAnswer: 0.8
    }
  ];

  const achievements: Achievement[] = [
    {
      id: "1",
      name: "First Victory",
      description: "Win your first match",
      icon: <Trophy className="h-6 w-6" />,
      unlocked: true,
      unlockedDate: "2023-06-16"
    },
    {
      id: "2",
      name: "Speed Demon",
      description: "Answer a question in under 1 second",
      icon: <Zap className="h-6 w-6" />,
      unlocked: true,
      unlockedDate: "2023-07-22"
    },
    {
      id: "3",
      name: "Streak Master",
      description: "Achieve a 10+ answer streak",
      icon: <Flame className="h-6 w-6" />,
      unlocked: true,
      unlockedDate: "2023-08-15"
    },
    {
      id: "4",
      name: "Centurion",
      description: "Play 100 matches",
      icon: <Target className="h-6 w-6" />,
      unlocked: true,
      unlockedDate: "2023-09-30"
    },
    {
      id: "5",
      name: "Category Master",
      description: "Win 50 matches in each category",
      icon: <Crown className="h-6 w-6" />,
      unlocked: false,
      progress: 2,
      maxProgress: 3
    },
    {
      id: "6",
      name: "Elite Player",
      description: "Reach the top 10 on the leaderboard",
      icon: <Medal className="h-6 w-6" />,
      unlocked: false,
      progress: 15,
      maxProgress: 10
    }
  ];

  const recentMatches = [
    { opponent: "BlockchainBot", result: "W", score: "85-72", date: "2 hours ago" },
    { opponent: "NFTMaster", result: "W", score: "95-68", date: "1 day ago" },
    { opponent: "DeFiQueen", result: "L", score: "65-78", date: "2 days ago" },
    { opponent: "ChainLink", result: "W", score: "72-65", date: "3 days ago" }
  ];

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // In a real app, show a toast notification
  };

  const tabs = [
    { id: "overview", label: "Overview", icon: <User className="h-4 w-4" /> },
    { id: "achievements", label: "Achievements", icon: <Award className="h-4 w-4" /> },
    { id: "stats", label: "Statistics", icon: <BarChart3 className="h-4 w-4" /> },
    { id: "settings", label: "Settings", icon: <Settings className="h-4 w-4" /> }
  ];

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
              <h1 className="text-3xl font-heading font-bold text-foreground">Profile</h1>
              <p className="text-muted">Your crypto quiz journey</p>
            </div>
          </div>
        </div>

        {/* Profile Header */}
        <Card className="bg-card border-card-border mb-8">
          <CardContent className="p-6">
            <div className="flex items-center gap-6">
              <Avatar className="w-24 h-24">
                <AvatarFallback className="bg-primary text-white text-2xl">
                  {userProfile.username.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-2xl font-heading font-bold text-foreground">{userProfile.username}</h2>
                  {userProfile.isOnline && (
                    <div className="flex items-center gap-1 text-xs text-win">
                      <div className="w-2 h-2 bg-win rounded-full animate-pulse"></div>
                      Online
                    </div>
                  )}
                </div>
                
                <div className="flex items-center gap-4 mb-3">
                  <div className="flex items-center gap-1 text-sm text-muted">
                    <Wallet className="h-4 w-4" />
                    <span>{userProfile.walletAddress.slice(0, 6)}...{userProfile.walletAddress.slice(-4)}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(userProfile.walletAddress)}
                      className="h-6 w-6 p-0"
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                
                <div className="flex items-center gap-6 text-sm">
                  <div>
                    <div className="text-lg font-score font-bold text-foreground">#{userProfile.rank}</div>
                    <div className="text-muted">Rank</div>
                  </div>
                  <div>
                    <div className="text-lg font-score font-bold text-win">{userProfile.totalScore.toLocaleString()}</div>
                    <div className="text-muted">Total Score</div>
                  </div>
                  <div>
                    <div className="text-lg font-score font-bold text-primary">Level {userProfile.level}</div>
                    <div className="text-muted">Level</div>
                  </div>
                </div>
              </div>
              
              <Button variant="outline" size="sm">
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {tabs.map(tab => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveTab(tab.id)}
              className="flex items-center gap-2"
            >
              {tab.icon}
              {tab.label}
            </Button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Level Progress */}
            <Card className="bg-card border-card-border">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-foreground">Level Progress</h3>
                  <div className="text-sm text-muted">
                    {userProfile.xpToNextLevel} XP to next level
                  </div>
                </div>
                <Progress value={((userProfile.totalXP % 1000) / 1000) * 100} className="mb-2" />
                <div className="flex justify-between text-sm text-muted">
                  <span>Level {userProfile.level}</span>
                  <span>Level {userProfile.level + 1}</span>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="bg-card border-card-border">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-score font-bold text-win mb-1">{userProfile.wins}</div>
                  <div className="text-xs text-muted">Wins</div>
                </CardContent>
              </Card>
              
              <Card className="bg-card border-card-border">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-score font-bold text-accent mb-1">{userProfile.losses}</div>
                  <div className="text-xs text-muted">Losses</div>
                </CardContent>
              </Card>
              
              <Card className="bg-card border-card-border">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-score font-bold text-primary mb-1">{userProfile.winRate}%</div>
                  <div className="text-xs text-muted">Win Rate</div>
                </CardContent>
              </Card>
              
              <Card className="bg-card border-card-border">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-score font-bold text-win mb-1">{userProfile.bestStreak}</div>
                  <div className="text-xs text-muted">Best Streak</div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Matches */}
            <Card className="bg-card border-card-border">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">Recent Matches</h3>
                <div className="space-y-3">
                  {recentMatches.map((match, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-card/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                          match.result === "W" ? "bg-win/20 text-win" : "bg-accent/20 text-accent"
                        }`}>
                          {match.result}
                        </div>
                        <div>
                          <div className="font-medium text-foreground">vs {match.opponent}</div>
                          <div className="text-sm text-muted">{match.date}</div>
                        </div>
                      </div>
                      <div className="text-sm font-mono">{match.score}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "achievements" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {achievements.map(achievement => (
                <Card key={achievement.id} className={`bg-card border-card-border ${
                  achievement.unlocked ? 'border-win/50' : 'opacity-60'
                }`}>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-lg ${
                        achievement.unlocked ? 'bg-win/20 text-win' : 'bg-muted text-muted'
                      }`}>
                        {achievement.icon}
                      </div>
                      
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground mb-1">{achievement.name}</h3>
                        <p className="text-sm text-muted mb-3">{achievement.description}</p>
                        
                        {achievement.unlocked ? (
                          <div className="text-xs text-win">
                            Unlocked {achievement.unlockedDate}
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <div className="flex justify-between text-xs text-muted">
                              <span>Progress</span>
                              <span>{achievement.progress}/{achievement.maxProgress}</span>
                            </div>
                            <Progress value={(achievement.progress! / achievement.maxProgress!) * 100} />
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeTab === "stats" && (
          <div className="space-y-6">
            {/* Category Performance */}
            <Card className="bg-card border-card-border">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">Category Performance</h3>
                <div className="space-y-4">
                  {categoryStats.map(category => (
                    <div key={category.category} className="p-4 bg-card/50 rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium text-foreground">{category.category}</h4>
                        <Badge variant="outline">{category.matches} matches</Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <div className="text-win font-medium">{category.winRate}%</div>
                          <div className="text-muted">Win Rate</div>
                        </div>
                        <div>
                          <div className="text-primary font-medium">{category.averageScore}</div>
                          <div className="text-muted">Avg Score</div>
                        </div>
                        <div>
                          <div className="text-accent font-medium">x{category.bestStreak}</div>
                          <div className="text-muted">Best Streak</div>
                        </div>
                        <div>
                          <div className="text-win font-medium">{category.fastestAnswer}s</div>
                          <div className="text-muted">Fastest</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Performance Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-card border-card-border">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-4">Performance Metrics</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-muted">Average Response Time</span>
                      <span className="font-medium">{userProfile.averageResponseTime}s</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted">Fastest Answer</span>
                      <span className="font-medium text-win">{userProfile.fastestAnswer}s</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted">Total XP Earned</span>
                      <span className="font-medium text-primary">{userProfile.totalXP.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted">Member Since</span>
                      <span className="font-medium">{new Date(userProfile.joinDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card border-card-border">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-4">Rank Progress</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-muted">Current Rank</span>
                      <span className="font-medium">#{userProfile.rank}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted">Previous Rank</span>
                      <span className="font-medium">#{userProfile.previousRank}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted">Rank Change</span>
                      <div className="flex items-center gap-1">
                        <TrendingUp className="h-4 w-4 text-win" />
                        <span className="font-medium text-win">+{userProfile.previousRank - userProfile.rank}</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted">Last Active</span>
                      <span className="font-medium">{userProfile.lastActive}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {activeTab === "settings" && (
          <div className="space-y-6">
            <Card className="bg-card border-card-border">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">Game Settings</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-foreground">Audio</div>
                      <div className="text-sm text-muted">Sound effects and notifications</div>
                    </div>
                    <Button variant="outline" size="sm">
                      <Volume2 className="h-4 w-4 mr-2" />
                      Enabled
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-foreground">Live Feed</div>
                      <div className="text-sm text-muted">Show real-time match updates</div>
                    </div>
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      Enabled
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-foreground">Notifications</div>
                      <div className="text-sm text-muted">Match invitations and results</div>
                    </div>
                    <Button variant="outline" size="sm">
                      <Bell className="h-4 w-4 mr-2" />
                      Enabled
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-card-border">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">Account</h3>
                <div className="space-y-4">
                  <Button variant="outline" className="w-full justify-start">
                    <Shield className="h-4 w-4 mr-2" />
                    Privacy Settings
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Connect Wallet
                  </Button>
                  <Button variant="outline" className="w-full justify-start text-red-400">
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;

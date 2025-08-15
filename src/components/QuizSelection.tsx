import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Brain, Clock, Trophy, Zap } from "lucide-react";

interface QuizSelectionProps {
  walletAddress: string;
  onStartMatchmaking: (config: QuizConfig) => void;
}

export interface QuizConfig {
  category: string;
  difficulty: string;
  matchLength: string;
  wager: boolean;
  stakeAmount?: number;
}

const categories = [
  { value: "crypto", label: "Crypto & Blockchain", icon: "₿" },
  { value: "sports", label: "Sports", icon: "⚽" },
  { value: "tech", label: "Technology", icon: "💻" },
  { value: "general", label: "General Knowledge", icon: "🧠" },
  { value: "movies", label: "Movies & TV", icon: "🎬" },
];

const difficulties = [
  { value: "easy", label: "Easy", description: "Perfect for beginners", color: "text-green-400" },
  { value: "medium", label: "Medium", description: "Good challenge", color: "text-yellow-400" },
  { value: "hard", label: "Hard", description: "Expert level", color: "text-red-400" },
];

const matchLengths = [
  { value: "3", label: "Best of 3", duration: "~5 min" },
  { value: "5", label: "Best of 5", duration: "~8 min" },
  { value: "7", label: "Best of 7", duration: "~12 min" },
];

const QuizSelection = ({ walletAddress, onStartMatchmaking }: QuizSelectionProps) => {
  const [config, setConfig] = useState<QuizConfig>({
    category: "",
    difficulty: "",
    matchLength: "",
    wager: false,
    stakeAmount: 0,
  });

  const isConfigComplete = config.category && config.difficulty && config.matchLength;

  const handleSubmit = () => {
    if (isConfigComplete) {
      onStartMatchmaking(config);
    }
  };

  return (
    <div className="min-h-screen bg-background p-6 flex items-center justify-center">
      <div className="w-full max-w-2xl space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-heading font-bold bg-gradient-primary bg-clip-text text-transparent">
            Choose Your Battle
          </h1>
          <p className="text-muted">Configure your 1v1 quiz match</p>
          <div className="inline-flex items-center gap-2 bg-card px-4 py-2 rounded-lg border border-card-border">
            <div className="w-2 h-2 bg-win rounded-full animate-pulse" />
            <span className="text-sm font-mono text-muted">
              {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
            </span>
          </div>
        </div>

        <Card className="bg-card border-card-border shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-heading">
              <Brain className="h-6 w-6 text-primary" />
              Quiz Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Category Selection */}
            <div className="space-y-3">
              <Label className="text-card-foreground font-medium">Category</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {categories.map((cat) => (
                  <Button
                    key={cat.value}
                    variant={config.category === cat.value ? "default" : "outline"}
                    className="h-20 flex-col gap-2 hover:scale-105 transition-all duration-200"
                    onClick={() => setConfig({...config, category: cat.value})}
                  >
                    <span className="text-2xl">{cat.icon}</span>
                    <span className="text-sm font-medium text-center">{cat.label}</span>
                  </Button>
                ))}
              </div>
            </div>

            {/* Difficulty Selection */}
            <div className="space-y-3">
              <Label className="text-card-foreground font-medium">Difficulty</Label>
              <div className="grid grid-cols-3 gap-3">
                {difficulties.map((diff) => (
                  <Button
                    key={diff.value}
                    variant={config.difficulty === diff.value ? "default" : "outline"}
                    className="h-16 flex-col gap-1"
                    onClick={() => setConfig({...config, difficulty: diff.value})}
                  >
                    <span className={`font-medium ${diff.color}`}>{diff.label}</span>
                    <span className="text-xs text-muted-foreground">{diff.description}</span>
                  </Button>
                ))}
              </div>
            </div>

            {/* Match Length */}
            <div className="space-y-3">
              <Label className="text-card-foreground font-medium">Match Length</Label>
              <div className="grid grid-cols-3 gap-3">
                {matchLengths.map((length) => (
                  <Button
                    key={length.value}
                    variant={config.matchLength === length.value ? "default" : "outline"}
                    className="h-16 flex-col gap-1"
                    onClick={() => setConfig({...config, matchLength: length.value})}
                  >
                    <div className="flex items-center gap-1">
                      <Trophy className="h-4 w-4" />
                      <span className="font-medium">{length.label}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">{length.duration}</span>
                  </Button>
                ))}
              </div>
            </div>

            {/* Wager Option */}
            <div className="space-y-3 p-4 bg-card/50 rounded-lg border border-card-border">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-card-foreground font-medium">Enable Wager (Demo)</Label>
                  <p className="text-sm text-muted-foreground">Add stakes to make it interesting</p>
                </div>
                <Switch
                  checked={config.wager}
                  onCheckedChange={(checked) => setConfig({...config, wager: checked, stakeAmount: checked ? 0.01 : 0})}
                />
              </div>
              
              {config.wager && (
                <div className="space-y-2">
                  <Label className="text-sm text-muted">Stake Amount (Demo)</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      step="0.01"
                      min="0.01"
                      max="1"
                      value={config.stakeAmount}
                      onChange={(e) => setConfig({...config, stakeAmount: parseFloat(e.target.value) || 0})}
                      className="bg-card border-card-border"
                      placeholder="0.01"
                    />
                    <span className="text-sm text-muted-foreground font-mono">ETH</span>
                  </div>
                </div>
              )}
            </div>

            {/* Action Button */}
            <Button
              variant="hero"
              size="lg"
              className="w-full"
              disabled={!isConfigComplete}
              onClick={handleSubmit}
            >
              <Zap className="h-5 w-5 mr-2" />
              Find Opponent
            </Button>

            <div className="text-center">
              <p className="text-xs text-muted-foreground">
                We'll match you with a live opponent — bots used as fallback
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default QuizSelection;
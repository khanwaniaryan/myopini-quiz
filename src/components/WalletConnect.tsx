import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, Wallet } from "lucide-react";

interface WalletConnectProps {
  onConnect: (address: string) => void;
}

const WalletConnect = ({ onConnect }: WalletConnectProps) => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string>("");
  const [isOpen, setIsOpen] = useState(true);
  const { toast } = useToast();

  const generateDemoAddress = () => {
    const prefix = "0x";
    const chars = "0123456789abcdef";
    let address = prefix;
    for (let i = 0; i < 40; i++) {
      address += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return address;
  };

  const handleConnect = async () => {
    setIsConnecting(true);
    
    // Simulate connection delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const address = generateDemoAddress();
    setWalletAddress(address);
    setShowSuccess(true);
    setIsConnecting(false);

    toast({
      title: "Wallet Connected! 🎉",
      description: `Demo address: ${address.slice(0, 6)}...${address.slice(-4)}`,
    });

    // Auto redirect after success animation
    setTimeout(() => {
      onConnect(address);
    }, 2000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="bg-card border-card-border max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center font-heading text-xl">
            {isConnecting ? "Connecting Wallet..." : showSuccess ? "Connected Successfully!" : "Connect Demo Wallet"}
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col items-center space-y-6 py-6">
          {!isConnecting && !showSuccess ? (
            <>
              <div className="relative">
                <Wallet className="h-16 w-16 text-primary" />
                <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping" />
              </div>
              <div className="text-center space-y-4">
                <p className="text-muted">
                  Click below to connect a demo wallet and start playing!
                </p>
                <Button 
                  variant="hero" 
                  size="lg" 
                  onClick={handleConnect}
                  className="min-w-48"
                >
                  <Wallet className="h-5 w-5 mr-2" />
                  Connect Demo Wallet
                </Button>
              </div>
            </>
          ) : isConnecting ? (
            <>
              <div className="relative">
                <Wallet className="h-16 w-16 text-primary animate-bounce" />
                <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping" />
              </div>
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]" />
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]" />
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
              </div>
              <p className="text-muted text-center">
                Generating demo wallet address...
              </p>
            </>
          ) : (
            <>
              <div className="relative">
                <CheckCircle className="h-16 w-16 text-win animate-scale-in" />
                <div className="absolute inset-0 bg-win/20 rounded-full animate-ping" />
              </div>
              <div className="text-center space-y-2">
                <p className="font-heading text-lg text-win">Demo Wallet Connected!</p>
                <p className="text-sm text-muted font-mono bg-card/50 px-3 py-2 rounded-lg border border-card-border">
                  {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                </p>
                <p className="text-xs text-muted-foreground">
                  ⚠️ DEMO ONLY - Not a real wallet connection
                </p>
              </div>
              <div className="flex justify-center">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div
                    key={i}
                    className="w-2 h-2 bg-accent rounded-full animate-confetti mx-1"
                    style={{ animationDelay: `${i * 0.1}s` }}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WalletConnect;
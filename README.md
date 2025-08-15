# Crypto Quiz Duel - 1v1 Quiz Game Prototype

A modern, gamified 1v1 quiz platform built with React, TypeScript, and Tailwind CSS. This prototype demonstrates a complete quiz game flow from wallet connection to matchmaking to gameplay and results.

## 🎮 Features

### Complete Game Flow
- **Landing Page**: Beautiful hero section with game introduction
- **Wallet Connection**: Demo wallet connection with realistic animations
- **Quiz Selection**: Choose category, difficulty, and match length
- **Matchmaking**: Find opponents with live search simulation
- **Quiz Gameplay**: Real-time 1v1 quiz battles with timer and scoring
- **Results**: Detailed results with statistics and animations

### Game Features
- **5 Categories**: Crypto, Sports, Technology, General Knowledge, Movies & TV
- **3 Difficulty Levels**: Easy, Medium, Hard
- **3 Match Lengths**: Best of 3, 5, or 7 questions
- **Real-time Scoring**: Speed and accuracy based scoring system
- **Opponent Simulation**: Both human and bot opponents
- **Beautiful UI**: Modern, crypto-native design with animations

### Technical Features
- **React 18** with TypeScript
- **Tailwind CSS** with custom design system
- **Shadcn/ui** components
- **React Router** for navigation
- **Responsive Design** for mobile and desktop
- **Custom Animations** and micro-interactions

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd crypto-duel-demo-main
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

## 🎯 How to Play

### 1. Connect Wallet (Demo)
- Click the "Connect Wallet (Demo)" button on the landing page
- Watch the realistic connection animation
- A demo wallet address will be generated

### 2. Choose Your Battle
- Select a quiz category (Crypto, Sports, Tech, etc.)
- Choose difficulty level (Easy, Medium, Hard)
- Pick match length (Best of 3, 5, or 7)
- Optionally enable wager mode (demo only)

### 3. Find an Opponent
- The system will search for live opponents
- You'll be matched with either a human player or bot
- View opponent stats and match details

### 4. Battle Live
- Answer questions within the time limit
- Compete against your opponent in real-time
- Earn points for speed and accuracy
- Watch live opponent status

### 5. View Results
- See detailed match statistics
- Compare performance with opponent
- View question-by-question breakdown
- Choose to play again or view leaderboard

## 🎨 Design System

### Color Palette
- **Primary**: Neon Purple (#7C5CFF) - Energetic and crypto-native
- **Accent**: Cyan (#00E5FF) - Complementary tech color
- **Win**: Green (#00D27A) - Success and victory
- **Background**: Deep space navy (#070914) - Dark theme

### Typography
- **Headings**: Sora/Poppins - Modern and readable
- **Body**: Inter/Manrope - Clean and accessible
- **Scores**: Orbitron - Futuristic for game elements

### Animations
- **Float**: Gentle floating animations for background elements
- **Glow**: Pulsing glow effects for interactive elements
- **Confetti**: Celebration animations for victories
- **Slide-up**: Smooth entrance animations

## 🏗️ Project Structure

```
src/
├── components/          # React components
│   ├── ui/             # Shadcn/ui components
│   ├── WalletConnect.tsx
│   ├── QuizSelection.tsx
│   ├── Matchmaking.tsx
│   ├── QuizGameplay.tsx
│   └── QuizResults.tsx
├── data/
│   └── quizData.ts     # Quiz questions and categories
├── hooks/
│   ├── use-toast.ts    # Toast notifications
│   └── use-mobile.tsx  # Mobile detection
├── lib/
│   └── utils.ts        # Utility functions
├── pages/
│   ├── Index.tsx       # Main landing page
│   └── NotFound.tsx    # 404 page
└── App.tsx             # Main app component
```

## 🎯 Game Mechanics

### Scoring System
- **Base Points**: 10 points for correct answers
- **Speed Bonus**: Up to 5 additional points for fast answers
- **Time Limit**: 25 seconds per question
- **Opponent AI**: Simulated with realistic response times

### Categories & Questions
- **Crypto & Blockchain**: Bitcoin, Ethereum, DeFi, NFTs
- **Sports**: Football, Basketball, Tennis, Olympics
- **Technology**: AI, Programming, Internet, Hardware
- **General Knowledge**: Geography, Science, History
- **Movies & TV**: Films, Directors, Awards, Classics

### Matchmaking
- **Live Search**: Simulated real-time opponent search
- **Skill Matching**: Based on difficulty selection
- **Bot Fallback**: AI opponents when no humans available
- **Quick Match**: 2-6 second average wait time

## 🔧 Customization

### Adding New Questions
Edit `src/data/quizData.ts` to add new questions:

```typescript
{
  id: "unique-id",
  question: "Your question here?",
  options: ["Option A", "Option B", "Option C", "Option D"],
  correctAnswer: 0, // Index of correct answer
  explanation: "Explanation of the answer",
  category: "crypto", // Must match existing category
  difficulty: "easy"  // easy, medium, or hard
}
```

### Styling Customization
- **Colors**: Modify CSS variables in `src/index.css`
- **Animations**: Add new keyframes in `tailwind.config.ts`
- **Components**: Customize Shadcn/ui components in `src/components/ui/`

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

## 🎮 Demo Features

This is a **prototype** that demonstrates:
- ✅ Complete game flow from start to finish
- ✅ Realistic wallet connection simulation
- ✅ Live matchmaking with opponent generation
- ✅ Interactive quiz gameplay with scoring
- ✅ Beautiful, responsive UI design
- ✅ Smooth animations and transitions

### What's Simulated
- Wallet connection (generates demo addresses)
- Live opponent search (simulated with delays)
- Real-time gameplay (local state management)
- Rewards and leaderboards (demo only)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🎯 Future Enhancements

- [ ] Real wallet integration (MetaMask, WalletConnect)
- [ ] Backend API for persistent data
- [ ] Real-time multiplayer with WebSockets
- [ ] Blockchain rewards and NFTs
- [ ] Tournament system
- [ ] Social features and leaderboards
- [ ] Mobile app (React Native)

---

**Enjoy the game! 🎮✨**

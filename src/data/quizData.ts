export interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  category: string;
  difficulty: string;
}

export const quizQuestions: Record<string, Question[]> = {
  crypto: [
    {
      id: "crypto-1",
      question: "What does 'HODL' originally stand for in crypto culture?",
      options: [
        "Hold On for Dear Life",
        "Hold On Don't Lose",
        "A misspelling of 'hold' from a Bitcoin forum post",
        "High Order Digital Ledger"
      ],
      correctAnswer: 2,
      explanation: "HODL originated from a drunk Bitcoin forum post where someone misspelled 'hold'",
      category: "crypto",
      difficulty: "easy"
    },
    {
      id: "crypto-2",
      question: "Which blockchain introduced smart contracts?",
      options: ["Bitcoin", "Ethereum", "Litecoin", "Dogecoin"],
      correctAnswer: 1,
      explanation: "Ethereum was the first blockchain to introduce smart contract functionality",
      category: "crypto",
      difficulty: "medium"
    },
    {
      id: "crypto-3",
      question: "What is the maximum supply of Bitcoin?",
      options: ["21 million", "100 million", "1 billion", "Unlimited"],
      correctAnswer: 0,
      explanation: "Bitcoin has a hard cap of 21 million coins that will ever exist",
      category: "crypto",
      difficulty: "easy"
    },
    {
      id: "crypto-4",
      question: "What consensus mechanism does Ethereum 2.0 use?",
      options: ["Proof of Work", "Proof of Stake", "Proof of Authority", "Delegated Proof of Stake"],
      correctAnswer: 1,
      explanation: "Ethereum 2.0 transitioned from Proof of Work to Proof of Stake",
      category: "crypto",
      difficulty: "medium"
    },
    {
      id: "crypto-5",
      question: "Which year was Bitcoin created?",
      options: ["2008", "2009", "2010", "2011"],
      correctAnswer: 1,
      explanation: "Bitcoin was created in 2009 by the pseudonymous Satoshi Nakamoto",
      category: "crypto",
      difficulty: "easy"
    }
  ],
  sports: [
    {
      id: "sports-1",
      question: "Which country won the 2018 FIFA World Cup?",
      options: ["Brazil", "France", "Germany", "Argentina"],
      correctAnswer: 1,
      explanation: "France won the 2018 FIFA World Cup held in Russia",
      category: "sports",
      difficulty: "easy"
    },
    {
      id: "sports-2",
      question: "How many players are on a basketball team during play?",
      options: ["4", "5", "6", "7"],
      correctAnswer: 1,
      explanation: "Each basketball team has 5 players on the court during play",
      category: "sports",
      difficulty: "easy"
    },
    {
      id: "sports-3",
      question: "Which tennis tournament is played on clay courts?",
      options: ["Wimbledon", "US Open", "French Open", "Australian Open"],
      correctAnswer: 2,
      explanation: "The French Open (Roland Garros) is the only Grand Slam played on clay courts",
      category: "sports",
      difficulty: "medium"
    },
    {
      id: "sports-4",
      question: "What is the maximum score possible in ten-pin bowling?",
      options: ["200", "250", "300", "350"],
      correctAnswer: 2,
      explanation: "A perfect game in bowling scores 300 points (12 strikes)",
      category: "sports",
      difficulty: "medium"
    },
    {
      id: "sports-5",
      question: "Which sport is known as 'The Sport of Kings'?",
      options: ["Tennis", "Golf", "Horse Racing", "Polo"],
      correctAnswer: 2,
      explanation: "Horse racing is traditionally known as 'The Sport of Kings'",
      category: "sports",
      difficulty: "easy"
    }
  ],
  tech: [
    {
      id: "tech-1",
      question: "What does 'AI' stand for?",
      options: ["Automated Intelligence", "Artificial Intelligence", "Advanced Integration", "Algorithmic Implementation"],
      correctAnswer: 1,
      explanation: "AI stands for Artificial Intelligence",
      category: "tech",
      difficulty: "easy"
    },
    {
      id: "tech-2",
      question: "Which programming language is primarily used for iOS app development?",
      options: ["Java", "Python", "Swift", "C++"],
      correctAnswer: 2,
      explanation: "Swift is Apple's primary programming language for iOS development",
      category: "tech",
      difficulty: "medium"
    },
    {
      id: "tech-3",
      question: "What does 'HTTP' stand for?",
      options: ["HyperText Transfer Protocol", "High Tech Transfer Process", "HyperText Transmission Process", "High Transfer Text Protocol"],
      correctAnswer: 0,
      explanation: "HTTP stands for HyperText Transfer Protocol",
      category: "tech",
      difficulty: "easy"
    },
    {
      id: "tech-4",
      question: "Which company developed the React JavaScript library?",
      options: ["Google", "Microsoft", "Facebook", "Twitter"],
      correctAnswer: 2,
      explanation: "React was developed by Facebook (now Meta)",
      category: "tech",
      difficulty: "medium"
    },
    {
      id: "tech-5",
      question: "What does 'GPU' stand for?",
      options: ["General Processing Unit", "Graphics Processing Unit", "Global Processing Unit", "Game Processing Unit"],
      correctAnswer: 1,
      explanation: "GPU stands for Graphics Processing Unit",
      category: "tech",
      difficulty: "easy"
    }
  ],
  general: [
    {
      id: "general-1",
      question: "What is the capital of Australia?",
      options: ["Sydney", "Melbourne", "Canberra", "Perth"],
      correctAnswer: 2,
      explanation: "Canberra is the capital city of Australia",
      category: "general",
      difficulty: "medium"
    },
    {
      id: "general-2",
      question: "Which planet is known as the Red Planet?",
      options: ["Venus", "Mars", "Jupiter", "Saturn"],
      correctAnswer: 1,
      explanation: "Mars is known as the Red Planet due to its reddish appearance",
      category: "general",
      difficulty: "easy"
    },
    {
      id: "general-3",
      question: "How many continents are there?",
      options: ["5", "6", "7", "8"],
      correctAnswer: 2,
      explanation: "There are 7 continents: Asia, Africa, North America, South America, Antarctica, Europe, and Australia",
      category: "general",
      difficulty: "easy"
    },
    {
      id: "general-4",
      question: "What is the largest ocean on Earth?",
      options: ["Atlantic", "Indian", "Arctic", "Pacific"],
      correctAnswer: 3,
      explanation: "The Pacific Ocean is the largest ocean covering about 1/3 of Earth's surface",
      category: "general",
      difficulty: "easy"
    },
    {
      id: "general-5",
      question: "Which element has the chemical symbol 'O'?",
      options: ["Gold", "Oxygen", "Silver", "Iron"],
      correctAnswer: 1,
      explanation: "Oxygen has the chemical symbol 'O'",
      category: "general",
      difficulty: "easy"
    }
  ],
  movies: [
    {
      id: "movies-1",
      question: "Which movie won the Academy Award for Best Picture in 2020?",
      options: ["1917", "Joker", "Parasite", "Once Upon a Time in Hollywood"],
      correctAnswer: 2,
      explanation: "Parasite won Best Picture at the 2020 Academy Awards",
      category: "movies",
      difficulty: "medium"
    },
    {
      id: "movies-2",
      question: "Who directed the movie 'Inception'?",
      options: ["Steven Spielberg", "Christopher Nolan", "Martin Scorsese", "Quentin Tarantino"],
      correctAnswer: 1,
      explanation: "Christopher Nolan directed the sci-fi thriller Inception",
      category: "movies",
      difficulty: "medium"
    },
    {
      id: "movies-3",
      question: "Which animated movie features the song 'Let It Go'?",
      options: ["Moana", "Tangled", "Frozen", "Beauty and the Beast"],
      correctAnswer: 2,
      explanation: "'Let It Go' is the famous song from Disney's Frozen",
      category: "movies",
      difficulty: "easy"
    },
    {
      id: "movies-4",
      question: "What is the highest-grossing film of all time?",
      options: ["Titanic", "Avatar", "Avengers: Endgame", "Star Wars: The Force Awakens"],
      correctAnswer: 1,
      explanation: "Avatar (2009) is the highest-grossing film of all time",
      category: "movies",
      difficulty: "medium"
    },
    {
      id: "movies-5",
      question: "Which actor played Iron Man in the Marvel Cinematic Universe?",
      options: ["Chris Evans", "Robert Downey Jr.", "Chris Hemsworth", "Mark Ruffalo"],
      correctAnswer: 1,
      explanation: "Robert Downey Jr. played Tony Stark/Iron Man in the MCU",
      category: "movies",
      difficulty: "easy"
    }
  ]
};

export const getQuestionsByCategory = (category: string, difficulty?: string): Question[] => {
  const categoryQuestions = quizQuestions[category] || [];
  if (difficulty) {
    return categoryQuestions.filter(q => q.difficulty === difficulty);
  }
  return categoryQuestions;
};

// Add more questions for better gameplay
export const getQuestionsByCategoryAndDifficulty = (category: string, difficulty: string): Question[] => {
  const allQuestions = quizQuestions[category] || [];
  const filteredQuestions = allQuestions.filter(q => q.difficulty === difficulty);
  
  // If we don't have enough questions for the difficulty, return all questions for the category
  if (filteredQuestions.length < 3) {
    return allQuestions;
  }
  
  return filteredQuestions;
};
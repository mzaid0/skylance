export interface UpdateUserData {
  industry: string;
  experience: string;
  bio: string;
  skills: string[];
}

export interface InsightsType {
  id: string;
  industry: string;
  salaryRanges: JsonValue[];
  growthRate: number;
  demandLevel: string;
  topSkills: string[];
  marketOutlook: string;
  keyTrends: string[];
  recommendedSkills: string[];
  nextUpdate: Date;
  lastUpdated: Date;
}

export interface Question {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

export type Answers = string[];
export type Score = number;

export interface SaveQuizData {
  questions: Question[];
  answers: string[];
  score: Score;
}

// Define the type for each question result
export interface QuizQuestionResult {
  questions: string; // The question text (note: using "questions" to match saved data)
  answers: string; // Correct answer
  userAnswer: string;
  isCorrect: boolean;
  explanation: string;
}

// Define the type for the entire quiz result
export interface QuizResultData {
  quizScore: number;
  improvementTip?: string;
  questions: QuizQuestionResult[];
}

// Define the props for QuizResult component
export interface QuizResultProps {
  result: QuizResultData;
}

// Define the structure of a single question result
export interface AssessmentQuestion {
  question: string;
  answer: string;
  userAnswer: string;
  isCorrect: boolean;
  explanation: string;
}

// Define the Assessment type (matching your Prisma Assessment model)
export interface Assessment {
  id: string;
  quizScore: number;
  questions: AssessmentQuestion[];
  category: string;
  userId: string;
  improvementTip: string | null ;
  createdAt: Date; // Updated from string to Date
  updatedAt: Date; // Updated from string to Date
}

// Define the props for StatsCards
export interface StatsCardsProps {
  assessments: Assessment[];
}

export interface QuizResultProps {
  result: Assessment;
  onStartNew: () => void;
}

export interface ConvertedQuizResultData {
  quizScore: number;
  improvementTip?: string | undefined; // `null` ko `undefined` mein convert karenge
  questions: QuizQuestionResult[];
}

export interface Entry {
  title: string;
  organization: string;
  startDate: string;
  endDate?: string;
  description: string;
  current?: boolean;
}

export type Difficulty = "easy" | "medium" | "hard";

export type EpisodeSectionId =
  | "story"
  | "problem"
  | "diagram"
  | "try-yourself"
  | "brute-force"
  | "observation"
  | "pattern-discovery"
  | "solution"
  | "complexity"
  | "related"
  | "quiz"
  | "takeaways";

export interface Category {
  id: string;
  label: string;
  color: string;
  total: number;
}

export interface PatternVariant {
  id: string;
  title: string;
  description: string;
}

export interface Pattern {
  title: string;
  slug: string;
  description: string;
  categories: string[];
  difficulty: Difficulty;
  episodeCount: number;
  tags: string[];
  icon: string;
  color: string;
  variants: PatternVariant[];
  mdx: string;
}

export interface Episode {
  patternSlug: string;
  slug: string;
  title: string;
  subtitle: string;
  order: number;
  difficulty: Difficulty;
  readTimeMin: number;
  heroDescription?: string;
  leetcodeUrl: string;
  mdx: string;
  sections: EpisodeSectionId[];
}

export type ResourceType = "video" | "book" | "article" | "course";

export interface Resource {
  id: string;
  title: string;
  description: string;
  url: string;
  type: ResourceType;
  tags: string[];
}

export interface User {
  email: string;
  name: string;
  passwordHash: string;
}

export interface Session {
  email: string;
  name: string;
}

export interface LastVisited {
  patternSlug: string;
  episodeSlug: string;
  sectionId: EpisodeSectionId;
}

export interface EpisodeProgress {
  sectionsRead: EpisodeSectionId[];
  quizScore?: number;
  completedAt?: string;
}

export interface UserProgress {
  userId: string;
  lastVisited?: LastVisited;
  episodes: Record<string, EpisodeProgress>;
  patterns: Record<string, { percentComplete: number }>;
  streak: { current: number; lastActiveDate: string };
  xp: number;
  problemsSolved: number;
  weeklyActivity: number[];
  updatedAt?: string;
}

export interface SearchItem {
  id: string;
  title: string;
  subtitle: string;
  href: string;
  type: "pattern" | "episode";
  tags: string[];
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface ComplexityVariant {
  variant: string;
  time: string;
  space: string;
}

export interface ProblemExample {
  input: string;
  output: string;
  explanation?: string;
}

export interface DiagramStep {
  left: number;
  right: number;
  highlight: number[];
  label: string;
  boats: number;
}

export interface EpisodeContentData {
  examples: ProblemExample[];
  diagramSteps: DiagramStep[];
  people: number[];
  limit: number;
  starterCode: string;
  solutionCode: string;
  bruteForceCode: string;
  complexityVariants: ComplexityVariant[];
  relatedProblems: { title: string; url: string; difficulty: Difficulty }[];
  quizQuestions: QuizQuestion[];
  takeaways: string[];
}

// FarmFlow AI — Shared Types

export type ProblemCategory =
  | "soil_analysis"
  | "crop_recommendation"
  | "budget_optimizer"
  | "weather_advisory"
  | "pest_disease"
  | "irrigation"
  | "market_price"
  | "yield_predictor"
  | "fertilizer_planner"
  | "general";

export interface ParsedProblem {
  category: ProblemCategory;
  categoryLabel: string;
  emoji: string;
  color: string;
  summary: string;
  appTitle: string;
  appDescription: string;
  keyFeatures: string[];
  userInputs: Record<string, string>; // extracted from problem statement
}

export interface GeneratedApp {
  html: string;
  title: string;
  description: string;
}

export interface DeploymentResult {
  success: boolean;
  url?: string;
  provider: "locus" | "vercel" | "demo";
  deploymentId?: string;
  error?: string;
  message?: string;
}

export interface AgentStep {
  id: string;
  label: string;
  status: "pending" | "running" | "done" | "error";
  detail?: string;
}

export interface AgentState {
  stage: "idle" | "analyzing" | "generating" | "deploying" | "done" | "error";
  problem: ParsedProblem | null;
  app: GeneratedApp | null;
  deployment: DeploymentResult | null;
  steps: AgentStep[];
  error?: string;
}

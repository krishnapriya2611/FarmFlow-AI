import { ProblemCategory, ParsedProblem } from "./types";

// ─── Category metadata ────────────────────────────────────────────────────────
export const CATEGORY_META: Record<
  ProblemCategory,
  { label: string; emoji: string; color: string; keywords: string[] }
> = {
  soil_analysis: {
    label: "Soil Analysis",
    emoji: "🌱",
    color: "#a16207",
    keywords: ["soil", "clay", "sandy", "loam", "pH", "nutrients", "fertility", "organic matter"],
  },
  crop_recommendation: {
    label: "Crop Recommendation",
    emoji: "🌾",
    color: "#16a34a",
    keywords: ["crop", "plant", "grow", "cultivate", "seed", "variety", "season", "which crop"],
  },
  budget_optimizer: {
    label: "Budget Optimizer",
    emoji: "💰",
    color: "#d97706",
    keywords: ["budget", "cost", "money", "cheap", "affordable", "optimize", "savings", "expense", "rupees", "invest"],
  },
  weather_advisory: {
    label: "Weather Advisory",
    emoji: "🌤️",
    color: "#0284c7",
    keywords: ["weather", "rain", "temperature", "climate", "drought", "flood", "humidity", "forecast"],
  },
  pest_disease: {
    label: "Pest & Disease Control",
    emoji: "🐛",
    color: "#dc2626",
    keywords: ["pest", "disease", "insect", "fungus", "blight", "rot", "infection", "spray", "pesticide"],
  },
  irrigation: {
    label: "Irrigation Planner",
    emoji: "💧",
    color: "#0891b2",
    keywords: ["water", "irrigation", "drip", "sprinkler", "moisture", "watering", "drought"],
  },
  market_price: {
    label: "Market Price Tracker",
    emoji: "📈",
    color: "#7c3aed",
    keywords: ["price", "market", "sell", "mandi", "profit", "income", "rate", "value"],
  },
  yield_predictor: {
    label: "Yield Predictor",
    emoji: "📊",
    color: "#0ea5e9",
    keywords: ["yield", "harvest", "production", "output", "predict", "estimate", "quantity"],
  },
  fertilizer_planner: {
    label: "Fertilizer Planner",
    emoji: "🧪",
    color: "#059669",
    keywords: ["fertilizer", "NPK", "nitrogen", "phosphorus", "potassium", "compost", "manure", "urea"],
  },
  general: {
    label: "General Farming Assistant",
    emoji: "🚜",
    color: "#6b7280",
    keywords: [],
  },
};

// ─── Heuristic category detector (used as fallback) ──────────────────────────
export function detectCategory(text: string): ProblemCategory {
  const lower = text.toLowerCase();
  let bestCategory: ProblemCategory = "general";
  let bestScore = 0;

  for (const [cat, meta] of Object.entries(CATEGORY_META) as [
    ProblemCategory,
    (typeof CATEGORY_META)[ProblemCategory]
  ][]) {
    const score = meta.keywords.filter((kw) => lower.includes(kw)).length;
    if (score > bestScore) {
      bestScore = score;
      bestCategory = cat;
    }
  }
  return bestCategory;
}

// ─── Build a ParsedProblem from Gemini JSON response ─────────────────────────
export function buildParsedProblem(
  category: ProblemCategory,
  data: {
    summary: string;
    appTitle: string;
    appDescription: string;
    keyFeatures: string[];
    userInputs: Record<string, string>;
  }
): ParsedProblem {
  const meta = CATEGORY_META[category];
  return {
    category,
    categoryLabel: meta.label,
    emoji: meta.emoji,
    color: meta.color,
    ...data,
  };
}

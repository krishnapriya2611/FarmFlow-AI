import { GoogleGenerativeAI } from "@google/generative-ai";
import { ProblemCategory, ParsedProblem, GeneratedApp } from "./types";
import { buildParsedProblem, detectCategory } from "./problemParser";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

// ─── Step 1: Analyze Problem ─────────────────────────────────────────────────
export async function analyzeProblem(userInput: string): Promise<ParsedProblem> {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `You are FarmFlow AI, an expert agricultural analyst. Analyze the following farming problem statement and extract structured information.

FARMING PROBLEM: "${userInput}"

Respond with ONLY a valid JSON object (no markdown, no code blocks) with this exact structure:
{
  "category": "<one of: soil_analysis | crop_recommendation | budget_optimizer | weather_advisory | pest_disease | irrigation | market_price | yield_predictor | fertilizer_planner | general>",
  "summary": "<2-3 sentence summary of the problem>",
  "appTitle": "<catchy app title (3-6 words)>",
  "appDescription": "<what the generated app will do, in 1 sentence>",
  "keyFeatures": ["<feature 1>", "<feature 2>", "<feature 3>", "<feature 4>"],
  "userInputs": {
    "<input_field_name>": "<extracted value from problem statement or 'user_provided'>",
    "...": "..."
  }
}

Rules:
- keyFeatures: exactly 4 features the app will have
- userInputs: extract all concrete values mentioned (soil type, budget amount, location, crop type, season, etc.)
- category: pick the MOST relevant category
- appTitle: creative and farming-themed`;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();
    // Strip markdown fences if present
    const cleaned = text.replace(/^```json\n?/, "").replace(/\n?```$/, "").trim();
    const parsed = JSON.parse(cleaned);

    return buildParsedProblem(parsed.category as ProblemCategory, {
      summary: parsed.summary,
      appTitle: parsed.appTitle,
      appDescription: parsed.appDescription,
      keyFeatures: parsed.keyFeatures,
      userInputs: parsed.userInputs,
    });
  } catch (err) {
    console.error("Gemini analyze error:", err);
    // Fallback to heuristic
    const category = detectCategory(userInput);
    return buildParsedProblem(category, {
      summary: `Farming problem: ${userInput.slice(0, 120)}`,
      appTitle: "Smart Farm Assistant",
      appDescription: "An intelligent app to help address your farming problem",
      keyFeatures: ["Smart Recommendations", "Data Visualization", "Interactive Interface", "Actionable Insights"],
      userInputs: { problem: userInput.slice(0, 200) },
    });
  }
}

// ─── Step 2: Generate App HTML ────────────────────────────────────────────────
export async function generateApp(problem: ParsedProblem): Promise<GeneratedApp> {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const inputsDesc = Object.entries(problem.userInputs)
    .map(([k, v]) => `${k}: ${v}`)
    .join(", ");

  const prompt = `You are FarmFlow App Generator. Create a complete, standalone, beautiful single-page web application (HTML + CSS + JS in one file) for the following farming problem.

PROBLEM CATEGORY: ${problem.categoryLabel}
APP TITLE: ${problem.appTitle}
DESCRIPTION: ${problem.appDescription}
KEY FEATURES: ${problem.keyFeatures.join(", ")}
USER DATA: ${inputsDesc}

DESIGN REQUIREMENTS:
- Dark agricultural theme: background #0a1a0e, accents #22c55e (green), #f59e0b (amber)
- Use Google Fonts: Inter
- Modern glassmorphism cards with rgba backgrounds and backdrop-filter blur
- Smooth CSS animations and transitions
- Fully functional with realistic sample data populated from the user's inputs
- Charts/visualizations using Chart.js (CDN) where appropriate
- Fully responsive mobile-first layout
- Premium feel with gradients, glows, and micro-animations

CONTENT REQUIREMENTS:
- Pre-populate the app with the extracted user data as defaults
- Show actual recommendations, calculations, or analysis based on the problem
- Include interactive elements (sliders, dropdowns, buttons) that update results dynamically
- Show at least one data visualization (chart, gauge, or table)
- All features listed must be implemented and functional

Return ONLY the complete HTML file content. Start with <!DOCTYPE html>. No explanation, no markdown fences.`;

  const result = await model.generateContent(prompt);
  let html = result.response.text().trim();

  // Clean up if model wraps in markdown
  if (html.startsWith("```")) {
    html = html.replace(/^```html?\n?/, "").replace(/\n?```$/, "").trim();
  }

  return {
    html,
    title: problem.appTitle,
    description: problem.appDescription,
  };
}

# FarmFlow AI 🌾

> AI-powered agent that understands your farming problem and instantly generates + deploys a custom app.

## How It Works

1. **Describe** your farming problem in natural language
2. **AI Analyzes** the problem and classifies it (soil, budget, pests, weather, etc.)
3. **Generates** a fully functional, beautiful custom app using Gemini AI
4. **Deploys** it live via BuildWithLocus (primary) or Vercel (fallback)

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env.local
# Edit .env.local and add your API keys

# 3. Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Environment Setup (.env.local)

```env
# Required — Gemini AI (get from https://aistudio.google.com)
GEMINI_API_KEY=your_gemini_api_key_here

# BuildWithLocus — Primary deployment (activate once you get access)
LOCUS_API_KEY=your_locus_api_key_here
LOCUS_PROJECT_ID=your_locus_project_id_here
LOCUS_TEAM_ID=your_locus_team_id_here
DEPLOY_MODE=locus   # <-- switch to "locus" once you have credentials

# Vercel — Fallback deployment (get from https://vercel.com/account/tokens)
VERCEL_TOKEN=your_vercel_token_here
```

## Activating BuildWithLocus Deployment

1. Get access from the BuildWithLocus team (Discord / portal)
2. Copy your `LOCUS_API_KEY`, `LOCUS_PROJECT_ID`, and `LOCUS_TEAM_ID`
3. Set `DEPLOY_MODE=locus` in `.env.local`
4. Restart the dev server — all deployments go through Locus automatically

## Problem Categories Supported

| Category | Examples |
|---|---|
| 🌱 Soil Analysis | Soil type, pH, fertility recommendations |
| 🌾 Crop Recommendation | Best crops for your conditions |
| 💰 Budget Optimizer | Max profit with given budget |
| 🌤️ Weather Advisory | Season/climate based farming plan |
| 🐛 Pest & Disease | Detection and treatment guide |
| 💧 Irrigation Planner | Water scheduling and optimization |
| 📈 Market Price | Mandi price tracker |
| 📊 Yield Predictor | Harvest estimation |
| 🧪 Fertilizer Planner | NPK recommendations |

## Tech Stack

- **Frontend**: Next.js 15, TypeScript, Tailwind CSS
- **AI**: Google Gemini 1.5 Flash
- **Deployment**: BuildWithLocus (primary) / Vercel (fallback)

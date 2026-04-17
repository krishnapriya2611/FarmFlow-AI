"use client";

import { useState, useRef, useEffect } from "react";
import { AgentState, AgentStep, ParsedProblem, DeploymentResult, GeneratedApp } from "@/lib/types";
import AgentStepper from "@/components/AgentStepper";
import ProblemCard from "@/components/ProblemCard";
import DeploymentBadge from "@/components/DeploymentBadge";

// ─── Example prompts ──────────────────────────────────────────────────────────
const EXAMPLES = [
  {
    label: "🌱 Soil + Weather",
    text: "I have clay soil in Maharashtra, getting 800mm rainfall annually. What crops should I grow this kharif season?",
  },
  {
    label: "💰 Budget Seeds",
    text: "I have ₹15,000 budget for 2 acres in Rajasthan with dry conditions. Recommend seeds that give max profit.",
  },
  {
    label: "🐛 Pest Control",
    text: "My wheat crop has yellow rust fungus and aphid attack. Plants are turning yellow with black spots.",
  },
  {
    label: "💧 Irrigation Plan",
    text: "I grow tomatoes on 3 acres with a borewell. How should I schedule drip irrigation to save water and maximize yield?",
  },
  {
    label: "📈 Market Price",
    text: "I want to track mandi prices for onion, potato and tomato across Punjab and UP markets.",
  },
  {
    label: "🧪 Fertilizer Plan",
    text: "My paddy crop is 45 days old. Soil test shows low nitrogen and medium phosphorus. What fertilizer should I apply?",
  },
];

const INITIAL_STEPS: AgentStep[] = [
  { id: "analyze", label: "Analyzing farming problem", status: "pending" },
  { id: "categorize", label: "Classifying problem type", status: "pending" },
  { id: "generate", label: "Generating custom app code", status: "pending" },
  { id: "deploy", label: "Deploying to live server", status: "pending" },
];

// ─── Floating particles ───────────────────────────────────────────────────────
function Particles() {
  const EMOJIS = ["🌱", "🌾", "💧", "☀️", "🌿", "🍃", "🌻"];
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {EMOJIS.map((e, i) => (
        <span
          key={i}
          className="particle absolute text-lg opacity-0"
          style={{
            left: `${10 + i * 13}%`,
            bottom: "-20px",
            animationDuration: `${12 + i * 3}s`,
            animationDelay: `${i * 2}s`,
          }}
        >
          {e}
        </span>
      ))}
    </div>
  );
}

export default function Home() {
  const [input, setInput] = useState("");
  const [state, setState] = useState<AgentState>({
    stage: "idle",
    problem: null,
    app: null,
    deployment: null,
    steps: INITIAL_STEPS,
    error: undefined,
  });
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (state.stage !== "idle") {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [state.stage, state.deployment]);

  function updateStep(id: string, status: AgentStep["status"], detail?: string) {
    setState((prev) => ({
      ...prev,
      steps: prev.steps.map((s) => (s.id === id ? { ...s, status, detail } : s)),
    }));
  }

  async function handleSubmit() {
    if (!input.trim() || state.stage !== "idle") return;

    // Reset
    setState({
      stage: "analyzing",
      problem: null,
      app: null,
      deployment: null,
      steps: INITIAL_STEPS.map((s) => ({ ...s, status: "pending" })),
    });

    // Mark step 1 running
    setState((prev) => ({
      ...prev,
      steps: prev.steps.map((s, i) => (i === 0 ? { ...s, status: "running" } : s)),
    }));

    try {
      // Single API call — server handles all three phases
      const res = await fetch("/api/agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userInput: input }),
      });

      // Stream-like step progression via polling (since we have one API call, we simulate)
      // In production you'd use a streaming/SSE endpoint for real-time updates
      await simulateStepProgress(setState);

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Failed");

      setState((prev) => ({
        ...prev,
        stage: "done",
        problem: data.problem,
        app: data.app,
        deployment: data.deployment,
        steps: prev.steps.map((s) => ({ ...s, status: "done" })),
      }));
    } catch (err) {
      setState((prev) => ({
        ...prev,
        stage: "error",
        error: String(err),
        steps: prev.steps.map((s) =>
          s.status === "running" ? { ...s, status: "error", detail: String(err) } : s
        ),
      }));
    }
  }

  function handleReset() {
    setState({
      stage: "idle",
      problem: null,
      app: null,
      deployment: null,
      steps: INITIAL_STEPS,
    });
    setInput("");
    textareaRef.current?.focus();
  }

  const isLoading = ["analyzing", "generating", "deploying"].includes(state.stage);

  return (
    <div className="bg-animated relative min-h-screen">
      <Particles />

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-8">
        {/* ── Header ── */}
        <header className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-green-950/40 border border-green-700/30 rounded-full px-4 py-1.5 mb-6">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-xs text-green-400 font-medium">AI-Powered · Auto-Deploy · Farming Domain</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-black mb-4 tracking-tight">
            <span className="gradient-text">FarmFlow</span>{" "}
            <span className="text-white">AI</span>
          </h1>
          <p className="text-lg text-gray-400 max-w-xl mx-auto leading-relaxed">
            Describe your farming problem — our AI agent understands it, builds a custom app, 
            and deploys it live within seconds.
          </p>
        </header>

        {/* ── Input Section ── */}
        {state.stage === "idle" && (
          <div className="animate-fade-in">
            {/* Example chips */}
            <div className="flex flex-wrap gap-2 mb-4 justify-center">
              {EXAMPLES.map((ex) => (
                <button
                  key={ex.label}
                  onClick={() => setInput(ex.text)}
                  className="text-xs px-3 py-1.5 rounded-full bg-green-950/40 border border-green-800/40 text-green-300 hover:border-green-500/60 hover:bg-green-900/40 transition-all duration-200"
                >
                  {ex.label}
                </button>
              ))}
            </div>

            {/* Textarea */}
            <div className="glass-card rounded-2xl p-1.5 shadow-2xl">
              <textarea
                ref={textareaRef}
                id="farming-problem-input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) handleSubmit();
                }}
                placeholder="Describe your farming problem in detail...&#10;&#10;Example: I have sandy soil in Gujarat with 600mm annual rainfall, ₹20,000 budget for 1 acre. Which vegetables give maximum profit in summer season?"
                rows={5}
                className="w-full bg-transparent text-white placeholder-gray-500 text-base p-4 resize-none outline-none font-sans leading-relaxed"
              />
              <div className="flex items-center justify-between px-4 pb-3">
                <span className="text-xs text-gray-600">
                  Ctrl+Enter to submit • {input.length} chars
                </span>
                <button
                  id="generate-app-btn"
                  onClick={handleSubmit}
                  disabled={!input.trim() || isLoading}
                  className="btn-glow text-white font-semibold text-sm px-6 py-2.5 rounded-xl flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Generate App
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── Agent Working ── */}
        {state.stage !== "idle" && (
          <div className="space-y-6 animate-fade-in">
            {/* Reset button */}
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-400 truncate max-w-xs">
                <span className="text-gray-600">Problem: </span>
                <span className="text-gray-300">&quot;{input.slice(0, 80)}...&quot;</span>
              </div>
              <button
                id="new-problem-btn"
                onClick={handleReset}
                className="text-xs px-3 py-1.5 rounded-lg bg-gray-800 border border-gray-700 text-gray-400 hover:text-white hover:border-gray-500 transition-all"
              >
                ← New Problem
              </button>
            </div>

            <div className="grid md:grid-cols-5 gap-6">
              {/* Left: Stepper */}
              <div className="md:col-span-2">
                <AgentStepper steps={state.steps} />
              </div>

              {/* Right: Results */}
              <div className="md:col-span-3 space-y-4">
                {/* Loading pulse */}
                {isLoading && !state.problem && (
                  <div className="glass-card rounded-2xl p-6 space-y-3">
                    <div className="shimmer h-4 rounded w-3/4" />
                    <div className="shimmer h-3 rounded w-full" />
                    <div className="shimmer h-3 rounded w-5/6" />
                    <div className="grid grid-cols-2 gap-2 mt-4">
                      <div className="shimmer h-10 rounded-lg" />
                      <div className="shimmer h-10 rounded-lg" />
                    </div>
                  </div>
                )}

                {state.problem && <ProblemCard problem={state.problem} />}
                {state.deployment && <DeploymentBadge result={state.deployment} />}

                {/* Error */}
                {state.stage === "error" && (
                  <div className="glass-card rounded-2xl p-5 border border-red-900/30">
                    <p className="text-red-400 text-sm font-medium mb-1">Something went wrong</p>
                    <p className="text-gray-400 text-xs">{state.error}</p>
                    <button onClick={handleReset} className="mt-3 text-xs text-green-400 hover:underline">
                      Try again →
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* App Preview */}
            {state.app && state.deployment?.success && (
              <div className="animate-slide-up">
                <p className="text-xs text-green-400 font-semibold uppercase tracking-widest mb-3">
                  📱 Live App Preview
                </p>
                <div className="app-preview">
                  <iframe
                    id="app-preview-frame"
                    srcDoc={state.app.html}
                    title={state.app.title}
                    className="w-full h-[600px] border-0"
                    sandbox="allow-scripts allow-forms allow-same-origin"
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── Feature Pills ── */}
        {state.stage === "idle" && (
          <div className="mt-12 grid grid-cols-3 gap-4 text-center">
            {[
              { icon: "🧠", title: "Gemini AI", desc: "Understands your exact farming context" },
              { icon: "⚡", title: "Instant Generation", desc: "Custom app built in seconds" },
              { icon: "🚀", title: "Auto-Deploy", desc: "Live URL via BuildWithLocus or Vercel" },
            ].map((f) => (
              <div key={f.title} className="glass-card rounded-2xl p-5">
                <div className="text-3xl mb-2">{f.icon}</div>
                <p className="text-sm font-semibold text-white">{f.title}</p>
                <p className="text-xs text-gray-400 mt-1">{f.desc}</p>
              </div>
            ))}
          </div>
        )}

        <div ref={bottomRef} />
      </div>
    </div>
  );
}

// ─── Simulated step animation while API call runs ─────────────────────────────
async function simulateStepProgress(
  setState: React.Dispatch<React.SetStateAction<AgentState>>
) {
  const steps = [
    { id: "analyze", delay: 600, detail: "Reading problem statement..." },
    { id: "categorize", delay: 1200, detail: "Identifying farming category..." },
    { id: "generate", delay: 2000, detail: "Writing app code with Gemini..." },
    { id: "deploy", delay: 3000, detail: "Deploying to live server..." },
  ];

  let prevId = "";
  for (const step of steps) {
    await new Promise((r) => setTimeout(r, step.delay));
    if (prevId) {
      setState((prev) => ({
        ...prev,
        steps: prev.steps.map((s) => (s.id === prevId ? { ...s, status: "done" } : s)),
      }));
    }
    setState((prev) => ({
      ...prev,
      steps: prev.steps.map((s) =>
        s.id === step.id ? { ...s, status: "running", detail: step.detail } : s
      ),
    }));
    prevId = step.id;
  }
}

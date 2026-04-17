"use client";
import { ParsedProblem } from "@/lib/types";

interface ProblemCardProps {
  problem: ParsedProblem;
}

export default function ProblemCard({ problem }: ProblemCardProps) {
  return (
    <div className="glass-card rounded-2xl p-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-start gap-4 mb-5">
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
          style={{ background: `${problem.color}22`, border: `1.5px solid ${problem.color}55` }}
        >
          {problem.emoji}
        </div>
        <div>
          <span
            className="category-badge mb-1"
            style={{
              background: `${problem.color}20`,
              color: problem.color,
              border: `1px solid ${problem.color}40`,
            }}
          >
            {problem.categoryLabel}
          </span>
          <h2 className="text-xl font-bold text-white mt-1">{problem.appTitle}</h2>
          <p className="text-sm text-gray-400 mt-0.5">{problem.appDescription}</p>
        </div>
      </div>

      {/* Summary */}
      <div className="bg-black/30 rounded-xl p-4 mb-4">
        <p className="text-sm text-gray-300 leading-relaxed">{problem.summary}</p>
      </div>

      {/* Features */}
      <div className="mb-4">
        <p className="text-xs text-green-400 font-semibold uppercase tracking-widest mb-2">
          App Features
        </p>
        <div className="grid grid-cols-2 gap-2">
          {problem.keyFeatures.map((f, i) => (
            <div
              key={i}
              className="flex items-center gap-2 bg-green-950/30 rounded-lg px-3 py-2"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-green-400 flex-shrink-0" />
              <span className="text-xs text-gray-300">{f}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Extracted Inputs */}
      {Object.keys(problem.userInputs).length > 0 && (
        <div>
          <p className="text-xs text-amber-400 font-semibold uppercase tracking-widest mb-2">
            Detected Parameters
          </p>
          <div className="flex flex-wrap gap-2">
            {Object.entries(problem.userInputs).map(([k, v]) => (
              <div
                key={k}
                className="flex items-center gap-1.5 bg-amber-950/20 border border-amber-900/30 rounded-lg px-2.5 py-1"
              >
                <span className="text-xs text-amber-500 font-medium">{k}:</span>
                <span className="text-xs text-amber-200">{v}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

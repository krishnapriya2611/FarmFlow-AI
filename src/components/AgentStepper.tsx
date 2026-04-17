"use client";
import { AgentStep } from "@/lib/types";

interface StepperProps {
  steps: AgentStep[];
}

const statusIcons: Record<AgentStep["status"], JSX.Element> = {
  pending: (
    <div className="w-8 h-8 rounded-full border-2 border-gray-600 flex items-center justify-center">
      <div className="w-2 h-2 rounded-full bg-gray-600" />
    </div>
  ),
  running: (
    <div className="relative w-8 h-8">
      <div className="absolute inset-0 rounded-full bg-green-500 opacity-25 ping-ring" />
      <div className="w-8 h-8 rounded-full bg-green-800 border-2 border-green-400 flex items-center justify-center">
        <svg className="w-3 h-3 text-green-400 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      </div>
    </div>
  ),
  done: (
    <div className="w-8 h-8 rounded-full bg-green-600 border-2 border-green-400 flex items-center justify-center">
      <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
      </svg>
    </div>
  ),
  error: (
    <div className="w-8 h-8 rounded-full bg-red-900 border-2 border-red-500 flex items-center justify-center">
      <svg className="w-4 h-4 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      </svg>
    </div>
  ),
};

export default function AgentStepper({ steps }: StepperProps) {
  return (
    <div className="glass-card rounded-2xl p-6 space-y-1">
      <h3 className="text-xs font-semibold text-green-400 uppercase tracking-widest mb-4">
        Agent Progress
      </h3>
      {steps.map((step, i) => (
        <div key={step.id} className="flex gap-4">
          <div className="flex flex-col items-center">
            {statusIcons[step.status]}
            {i < steps.length - 1 && (
              <div
                className={`w-0.5 h-8 mt-1 transition-colors duration-500 ${
                  step.status === "done" ? "bg-green-600" : "bg-gray-700"
                }`}
              />
            )}
          </div>
          <div className="pb-6 flex-1">
            <p
              className={`text-sm font-medium transition-colors duration-300 ${
                step.status === "done"
                  ? "text-green-300"
                  : step.status === "running"
                  ? "text-white"
                  : step.status === "error"
                  ? "text-red-400"
                  : "text-gray-500"
              }`}
            >
              {step.label}
            </p>
            {step.detail && (
              <p className="text-xs text-gray-400 mt-0.5">{step.detail}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

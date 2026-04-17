"use client";
import { DeploymentResult } from "@/lib/types";

interface DeploymentBadgeProps {
  result: DeploymentResult;
}

const providerMeta = {
  locus: { label: "BuildWithLocus", icon: "🚀", color: "#7c3aed" },
  vercel: { label: "Vercel", icon: "▲", color: "#0070f3" },
  demo: { label: "Demo Preview", icon: "👁️", color: "#16a34a" },
};

export default function DeploymentBadge({ result }: DeploymentBadgeProps) {
  const meta = providerMeta[result.provider];
  const isDataUrl = result.url?.startsWith("data:");

  return (
    <div className="animate-slide-up">
      {result.success ? (
        <div className="glass-card rounded-2xl p-6 border border-green-500/20">
          {/* Success header */}
          <div className="flex items-center gap-3 mb-4">
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-green-500 opacity-20 ping-ring" />
              <div className="w-10 h-10 rounded-full bg-green-900 border-2 border-green-400 flex items-center justify-center">
                <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <div>
              <h3 className="text-base font-bold text-white">App Successfully Deployed!</h3>
              <p className="text-xs text-gray-400">{result.message}</p>
            </div>
          </div>

          {/* Provider badge */}
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xs text-gray-400">Deployed via</span>
            <span
              className="category-badge"
              style={{
                background: `${meta.color}20`,
                color: meta.color,
                border: `1px solid ${meta.color}40`,
              }}
            >
              {meta.icon} {meta.label}
            </span>
          </div>

          {/* URL */}
          {result.url && !isDataUrl && (
            <div className="bg-black/40 rounded-xl p-3 flex items-center gap-3 mb-4">
              <div className="w-2 h-2 rounded-full bg-green-400 flex-shrink-0 animate-pulse" />
              <a
                href={result.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-400 text-sm font-mono truncate hover:text-green-300 transition-colors"
              >
                {result.url}
              </a>
              <button
                onClick={() => navigator.clipboard.writeText(result.url!)}
                className="ml-auto p-1.5 rounded-lg bg-green-900/30 hover:bg-green-800/50 transition-colors flex-shrink-0"
                title="Copy URL"
              >
                <svg className="w-4 h-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </button>
            </div>
          )}

          {isDataUrl && (
            <div className="bg-amber-950/20 border border-amber-700/30 rounded-xl p-3 mb-4">
              <p className="text-xs text-amber-300">
                🔑 Add <code className="bg-black/40 px-1 rounded">VERCEL_TOKEN</code> or{" "}
                <code className="bg-black/40 px-1 rounded">LOCUS_API_KEY</code> in{" "}
                <code className="bg-black/40 px-1 rounded">.env.local</code> to get a real live URL.
                <br />The app preview is shown below.
              </p>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex gap-3">
            {result.url && !isDataUrl && (
              <a
                href={result.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 btn-glow text-white text-sm font-semibold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                Open Live App
              </a>
            )}
            {result.deploymentId && (
              <div className="flex-1 bg-gray-900/50 rounded-xl py-2.5 px-4 text-center">
                <p className="text-xs text-gray-500">Deployment ID</p>
                <p className="text-xs text-gray-300 font-mono truncate">{result.deploymentId}</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="glass-card rounded-2xl p-5 border border-red-900/30">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-red-900 border border-red-500 flex items-center justify-center flex-shrink-0">
              <span className="text-red-400 text-sm">✕</span>
            </div>
            <div>
              <p className="text-sm font-medium text-red-400">Deployment Failed</p>
              <p className="text-xs text-gray-400 mt-0.5">{result.error}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

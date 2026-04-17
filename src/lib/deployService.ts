/**
 * FarmFlow AI — Deployment Service
 *
 * Deployment priority:
 *  1. BuildWithLocus  (DEPLOY_MODE=locus, LOCUS_API_KEY set)
 *  2. Vercel          (DEPLOY_MODE=vercel, VERCEL_TOKEN set)
 *  3. Demo            (no credentials — inline data-URL preview)
 *
 * ── BuildWithLocus API used ──────────────────────────────────────────────────
 *  Create project:  POST /v1/projects          { name }  → { id, ... }
 *  Deploy files:    POST /v1/projects/:id/deployments
 *                   or  POST /v1/deployments   { projectId, files[] }
 */

import { GeneratedApp, DeploymentResult } from "./types";

const LOCUS_BASE = "https://api.buildwithlocus.com/v1";

// ─── Public entry point ───────────────────────────────────────────────────────
export async function deployApp(app: GeneratedApp): Promise<DeploymentResult> {
  const mode = process.env.DEPLOY_MODE || "demo";

  if (mode === "locus" && process.env.LOCUS_API_KEY) {
    return deployWithLocus(app);
  }
  if (mode === "vercel" && process.env.VERCEL_TOKEN) {
    return deployWithVercel(app);
  }
  return demoDeployment(app);
}

// ─── 1. BuildWithLocus ────────────────────────────────────────────────────────
async function deployWithLocus(app: GeneratedApp): Promise<DeploymentResult> {
  const token = process.env.LOCUS_API_KEY!;
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  try {
    // ── Step A: Resolve project ID ──────────────────────────────────────────
    let projectId = process.env.LOCUS_PROJECT_ID?.trim() || "";

    if (!projectId) {
      // Auto-create a project — matches the curl the Locus team shared
      const projectName = `farmflow-${Date.now()}`;
      const createRes = await fetch(`${LOCUS_BASE}/projects`, {
        method: "POST",
        headers,
        body: JSON.stringify({ name: projectName }),
      });

      if (!createRes.ok) {
        const txt = await createRes.text();
        throw new Error(`Locus project create failed ${createRes.status}: ${txt}`);
      }

      const project = await createRes.json();
      projectId = project.id;
      console.log("[Locus] Created project:", projectId);
    }

    // ── Step B: Deploy the generated HTML ────────────────────────────────────
    // Try project-scoped endpoint first, then fall back to top-level
    const deployPayload = {
      projectId,
      files: [
        {
          file: "index.html",
          data: app.html,
          encoding: "utf-8",
        },
      ],
      framework: "static",
      public: true,
    };

    // Primary endpoint — project-scoped
    let deployRes = await fetch(`${LOCUS_BASE}/projects/${projectId}/deployments`, {
      method: "POST",
      headers,
      body: JSON.stringify(deployPayload),
    });

    // Fallback to top-level deployments endpoint
    if (!deployRes.ok && deployRes.status === 404) {
      deployRes = await fetch(`${LOCUS_BASE}/deployments`, {
        method: "POST",
        headers,
        body: JSON.stringify(deployPayload),
      });
    }

    if (!deployRes.ok) {
      const txt = await deployRes.text();
      throw new Error(`Locus deploy failed ${deployRes.status}: ${txt}`);
    }

    const data = await deployRes.json();

    // Locus may return url / deploymentUrl / liveUrl — handle all variants
    const liveUrl =
      data.url ??
      data.deploymentUrl ??
      data.liveUrl ??
      data.previewUrl ??
      `https://app.buildwithlocus.com/projects/${projectId}`;

    return {
      success: true,
      url: liveUrl,
      provider: "locus",
      deploymentId: data.id ?? data.deploymentId ?? projectId,
      message: "Deployed via BuildWithLocus 🚀",
    };
  } catch (err) {
    console.error("[Locus] deployment error:", err);

    // Graceful fallback to Vercel if token exists
    if (process.env.VERCEL_TOKEN) {
      console.warn("[Locus] Falling back to Vercel...");
      const vercelResult = await deployWithVercel(app);
      return { ...vercelResult, message: `Locus failed → ${vercelResult.message}` };
    }

    return {
      success: false,
      provider: "locus",
      error: String(err),
    };
  }
}

// ─── 2. Vercel (fallback) ────────────────────────────────────────────────────
async function deployWithVercel(app: GeneratedApp): Promise<DeploymentResult> {
  const token = process.env.VERCEL_TOKEN!;
  const projectName = `farmflow-${Date.now()}`;

  try {
    const res = await fetch("https://api.vercel.com/v13/deployments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: projectName,
        files: [{ file: "index.html", data: app.html, encoding: "utf-8" }],
        projectSettings: { framework: null },
        public: true,
        target: "production",
      }),
    });

    if (!res.ok) {
      const txt = await res.text();
      throw new Error(`Vercel API error ${res.status}: ${txt}`);
    }

    const data = await res.json();
    return {
      success: true,
      url: `https://${data.url}`,
      provider: "vercel",
      deploymentId: data.id,
      message: "Deployed via Vercel ▲",
    };
  } catch (err) {
    console.error("[Vercel] deployment error:", err);
    return { success: false, provider: "vercel", error: String(err) };
  }
}

// ─── 3. Demo (no credentials) ────────────────────────────────────────────────
function demoDeployment(app: GeneratedApp): DeploymentResult {
  const base64 = Buffer.from(app.html).toString("base64");
  return {
    success: true,
    url: `data:text/html;base64,${base64}`,
    provider: "demo",
    deploymentId: `demo-${Date.now()}`,
    message:
      "Demo mode — app shown inline. Set DEPLOY_MODE=locus + LOCUS_API_KEY for live URLs.",
  };
}

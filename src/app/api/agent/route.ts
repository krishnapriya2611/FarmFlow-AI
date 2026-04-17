import { NextRequest, NextResponse } from "next/server";
import { analyzeProblem } from "@/lib/geminiService";
import { generateApp } from "@/lib/geminiService";
import { deployApp } from "@/lib/deployService";

export async function POST(req: NextRequest) {
  try {
    const { userInput } = await req.json();

    if (!userInput || typeof userInput !== "string" || userInput.trim().length < 5) {
      return NextResponse.json(
        { error: "Please describe your farming problem in detail." },
        { status: 400 }
      );
    }

    // Step 1 – Analyze
    const problem = await analyzeProblem(userInput.trim());

    // Step 2 – Generate App
    const app = await generateApp(problem);

    // Step 3 – Deploy
    const deployment = await deployApp(app);

    return NextResponse.json({
      success: true,
      problem,
      app: {
        title: app.title,
        description: app.description,
        html: app.html,
      },
      deployment,
    });
  } catch (err) {
    console.error("[/api/agent] error:", err);
    return NextResponse.json(
      { error: "An error occurred. Please try again." },
      { status: 500 }
    );
  }
}

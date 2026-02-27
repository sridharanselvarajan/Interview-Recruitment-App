import { NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(req) {
  const { question, userAnswer, interviewId, jobPosition } = await req.json();

  if (!question || !userAnswer || !interviewId) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const PROMPT = `
  You are an expert technical interviewer evaluating a candidate's answer for the role of ${jobPosition}.
  
  Question: "${question}"
  Candidate Answer: "${userAnswer}"
  
  Evaluate this answer strictly. Respond with ONLY valid JSON, no markdown, no code blocks, no extra text.
  Output exactly this structure:
  {
    "rating": <number 1-10>,
    "feedback": "<One sentence critique>",
    "improvement": "<One sentence on how to improve>"
  }
  `;

  // Try models in order — fall back if the first is unavailable on free tier
  const models = [
    "stepfun/step-3.5-flash:free",
    "meta-llama/llama-3.3-70b-instruct:free",
    "mistralai/mistral-7b-instruct:free"
  ];

  try {
    const openai = new OpenAI({
      baseURL: "https://openrouter.ai/api/v1",
      apiKey: process.env.OPENROUTER_API_KEY,
    });

    let lastError = null;

    for (const model of models) {
      try {
        const completion = await openai.chat.completions.create({
          model,
          messages: [
            { role: "system", content: "You are a technical interviewer. Always respond with valid JSON only." },
            { role: "user", content: PROMPT }
          ],
          max_tokens: 300
        });

        const raw = completion.choices?.[0]?.message?.content || '';
        // Strip markdown fences and extract JSON object
        let cleaned = raw.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim();
        const start = cleaned.indexOf('{');
        const end = cleaned.lastIndexOf('}');
        if (start !== -1 && end !== -1) cleaned = cleaned.slice(start, end + 1);

        const aiResponse = JSON.parse(cleaned);
        return NextResponse.json(aiResponse);

      } catch (modelErr) {
        console.warn(`Model ${model} failed:`, modelErr?.message);
        lastError = modelErr;
        // Try next model
      }
    }

    // All models failed — return a default so the interview can still continue
    console.error("All evaluate-answer models failed:", lastError?.message);
    return NextResponse.json({
      rating: 5,
      feedback: "Evaluation unavailable for this answer.",
      improvement: "Please retry the interview for a full evaluation."
    });

  } catch (e) {
    console.error("Evaluate-answer route error:", e?.message);
    return NextResponse.json({ error: e.message || "Unknown error" }, { status: 500 });
  }
}

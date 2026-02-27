import { QUESTION_PROMPT } from "@/services/Contants";
import { NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(req) {
  const { jobPosition, jobDescription, duration, type } = await req.json();

  const FINAL_PROMPT = QUESTION_PROMPT
    .replace("{{jobTitle}}", jobPosition || "")
    .replace("{{jobDescription}}", jobDescription || "")
    .replace("{{duration}}", duration || "")
    .replace("{{type}}", Array.isArray(type) ? type.join(", ") : type || "");

  try {
    const openai = new OpenAI({
      baseURL: "https://openrouter.ai/api/v1",
      apiKey: process.env.OPENROUTER_API_KEY,
    });

    const completion = await openai.chat.completions.create({
      model: "stepfun/step-3.5-flash:free",
      messages: [
        { role: "user", content: FINAL_PROMPT }
      ],
      max_tokens: 2000,
    });

    if (
      !completion ||
      !completion.choices ||
      completion.choices.length === 0 ||
      !completion.choices[0].message
    ) {
      console.error("Invalid AI response structure:", completion);
      return NextResponse.json({ error: "Invalid response from AI model" }, { status: 500 });
    }

    const aiResponse = completion.choices[0].message.content;
    return NextResponse.json({ content: aiResponse });

  } catch (e) {
    console.error("AI model error:", e?.message || e);
    return NextResponse.json({ error: e?.message || "Unexpected server error" }, { status: 500 });
  }
}

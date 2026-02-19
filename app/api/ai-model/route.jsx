import { QUESTION_PROMPT } from "@/services/Contants";
import { NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(req) {
  try {
    const { jobPosition, jobDescription, duration, type } = await req.json();

    const FINAL_PROMPT = QUESTION_PROMPT
      .replace('{{jobTitle}}', jobPosition)
      .replace('{{jobDescription}}', jobDescription)
      .replace('{{duration}}', duration)
      .replace('{{type}}', type);

    console.log("Final Prompt:", FINAL_PROMPT);

    const openai = new OpenAI({
      baseURL: "https://openrouter.ai/api/v1",
      apiKey: process.env.OPENROUTER_API_KEY,
    });

    const completion = await openai.chat.completions.create({
      model: "arcee-ai/trinity-large-preview:free",
      messages: [
        { role: "user", content: FINAL_PROMPT }
      ],
      max_tokens: 800, // Increased to ensure complete JSON response
      temperature: 0.3 // Lower temperature for more consistent JSON formatting
    });

    console.log("OpenAI Completion Response:", completion);

    if (
      !completion ||
      !completion.choices ||
      completion.choices.length === 0 ||
      !completion.choices[0].message
    ) {
      console.error("Invalid OpenAI response structure:", completion);
      return NextResponse.json({ error: "Invalid response from AI model" }, { status: 500 });
    }

    const aiResponse = completion.choices[0].message.content;

    return NextResponse.json({ content: aiResponse });

  } catch (e) {
    console.error("AI model error:", e?.message || e);
    return NextResponse.json({ error: e?.message || "Unexpected server error" }, { status: 500 });
  }
}

import { FEEDBACK_PROMPT } from "@/services/Contants";
import { supabase } from "@/services/supabaseClient";
import { NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(req) {
  const { conversation, interviewId } = await req.json();

  let conversationText = conversation;

  if (!conversationText && interviewId) {
    // Fetch conversation from DB if not provided
    const { data: userAnswers, error } = await supabase
      .from('UserAnswer')
      .select('question, userAnswer, feedback')
      .eq('interviewId', interviewId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error("Failed to fetch user answers:", error);
      return NextResponse.json({ error: "Failed to fetch interview data" }, { status: 500 });
    }

    if (userAnswers && userAnswers.length > 0) {
      conversationText = userAnswers.map(ans => `
Q: ${ans.question}
A: ${ans.userAnswer}
Feedback: ${ans.feedback}
      `).join('\n');
    }
  }

  if (!conversationText) {
    return NextResponse.json({ error: "No conversation data found" }, { status: 400 });
  }

  const FINAL_PROMPT = FEEDBACK_PROMPT.replace('{{conversation}}', JSON.stringify(conversationText));

  try {
    const openai = new OpenAI({
      baseURL: "https://openrouter.ai/api/v1",
      apiKey: process.env.OPENROUTER_API_KEY,
    });
// ... rest of the file
    const completion = await openai.chat.completions.create({
      model: "stepfun/step-3.5-flash:free",
      messages: [
        { role: "user", content: FINAL_PROMPT }
      ],
      max_tokens: 2000 
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

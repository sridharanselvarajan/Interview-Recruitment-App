import { FEEDBACK_PROMPT } from "@/services/Contants";
import { supabase } from "@/services/supabaseClient";
import { NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(req) {
  const { conversation, interviewId } = await req.json();

  let conversationText = null;

  // If conversation is an array (from VAPI), convert to readable dialogue text
  if (Array.isArray(conversation) && conversation.length > 0) {
    const validMessages = conversation.filter(m => m?.content && m.content.trim());
    if (validMessages.length > 0) {
      conversationText = validMessages
        .map(m => `${m.role.toUpperCase()}: ${m.content}`)
        .join('\n');
    }
  } else if (typeof conversation === 'string' && conversation.trim()) {
    conversationText = conversation;
  }

  // Fall back to fetching from UserAnswer table if no conversation provided
  if (!conversationText && interviewId) {
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
    // Return a graceful incomplete-session response instead of crashing with 400
    const incompleteResponse = JSON.stringify({
      feedback: {
        rating: { technicalSkills: 0, communication: 0, problemSolving: 0, experience: 0 },
        summary: "The interview session ended before any conversation was recorded. This may be due to a connection issue or the call being ended very early. Please retry the interview.",
        strengths: [],
        areasForImprovement: ["Complete the full interview session to receive a proper evaluation."],
        Recommendation: "Not Recommended",
        RecommendationMsg: "No conversation data was captured. Please retry the interview session."
      }
    });
    return NextResponse.json({ content: incompleteResponse });
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
      max_tokens: 4000
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

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
  
  Evaluate this answer strictly.
  Output JSON format only:
  {
    "rating": <number 1-10>,
    "feedback": "<One sentence critique>",
    "improvement": "<One sentence on how to improve>"
  }
  `;

  try {
    const openai = new OpenAI({
      baseURL: "https://openrouter.ai/api/v1",
      apiKey: process.env.OPENROUTER_API_KEY,
    });

    const completion = await openai.chat.completions.create({
      model: "meta-llama/llama-3.3-70b-instruct:free",
      messages: [
        { role: "system", content: "You are a technical interviewer." },
        { role: "user", content: PROMPT }
      ]
    });
    
    const content = completion.choices[0].message.content.replace(/```json|```/g, '').trim();
    const aiResponse = JSON.parse(content);

    // Save to Database
    // Note: We need a server-side supabase client or use the client side if row level security allows insert.
    // For API routes, usually good to use service role or just pass auth headers if using standard client.
    // Here we will rely on the client-side saving or do it here if we had service key. 
    // To keep it simple and secure, we'll return the result to the client and let the client save it, 
    // OR we use the anon key if RLS allows valid inserts.
    // BETTER: Client saves it. API just evaluates.
    // WAIT: The plan said API saves it. But API usually needs Service Key or forwarded Auth.
    // Let's return the evaluation and let the frontend save it to 'UserAnswer' via Supabase client which has the user's session.
    // This is safer/easier than managing auth inside this Next.js API route without extra setup.
    
    return NextResponse.json(aiResponse);

  } catch (e) {
    console.error("Evaluation error:", e);
    return NextResponse.json({ error: e.message || "Unknown error", stack: e.stack }, { status: 500 });
  }
}
